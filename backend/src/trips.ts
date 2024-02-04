import axios from 'axios';
import _ from 'lodash';
import { DateTime, Duration } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

import {
  GraphhopperNavigation,
  Path,
  PersistTripRequestBody,
  Stop,
} from './types';
import { db, pg } from './common/db';
import * as config from './common/config';
import { Messages } from './common/enums';
import { RequestHandler } from 'express';
import { cancelTrip } from './gtfs/rt/tripUpdate';
import { INTERNAL_DEFAULT_AGENCY_ID } from './common/config';
import assert from 'assert';
import { createPrivateStops } from './common/queries';

interface DBStop {
  stop_id: string;
  stop_lon: number;
  stop_lat: number;
  stop_name: string;
}

export const getStopsOnRouteHandler: RequestHandler<
  undefined,
  CustomResponse,
  {
    waypoints: [number, number][];
  }
> = async (req, res) => {
  const { waypoints = [] } = req.body;

  if (waypoints.length < 2) {
    res.status(400);
    res.send({
      field: waypoints.length == 0 ? 'from' : 'to',
      message: Messages.FIELD_REQUIRED,
      error: true,
    });
    return;
  }

  try {
    const fromLatLng = waypoints[0];
    const toLatLng = waypoints[waypoints.length - 1];

    const route = await axios.post<GraphhopperNavigation>(
      `${config.GRAPHHOPPER_URL}/route`,
      {
        profile: 'car',
        points: waypoints,
        points_encoded: false,
      },
    );
    const pathway = JSON.stringify(route.data.paths[0].points);

    const stops = await db.any(
      `SELECT
      id,
      stop_name,
      ST_AsGeoJSON(location) as location
      FROM stops
      WHERE active = true
      AND
    ST_Intersects(
      COALESCE(anker_points, location),
    ST_Buffer(
      ST_GeomFromGeoJSON($1),
      0.0003,
      'side=right join=bevel'
      )
    )
    ORDER BY ST_Distance(
      location,
      ST_SetSRID(st_makepoint($2, $3), 4326)
    )`,
      [pathway, ...fromLatLng],
    );

    const stopsWithLocation = stops.map((row) => ({
      ...row,
      location: JSON.parse(row.location),
    }));

    const stopLocations = stopsWithLocation.map(
      (stop) => stop.location.coordinates,
    );

    const { data: routeWithWaypoints } =
      await axios.post<GraphhopperNavigation>(
        `${config.GRAPHHOPPER_URL}/route`,
        {
          profile: 'car',
          points: [fromLatLng, ...stopLocations, toLatLng],
          points_encoded: false,
        },
      );

    const wp = getWaypointTimeAndDistance(routeWithWaypoints.paths[0], true);
    const waypointInfo = _.zip(wp, [
      {
        stop_name: 'origin',
        location: { type: 'Point', coordinates: fromLatLng },
      },
      ...stopsWithLocation,
      {
        stop_name: 'destination',
        location: { type: 'Point', coordinates: toLatLng },
      },
    ]).map((entry) => ({
      ...entry[0],
      ...entry[1],
    }));

    const resp = {
      waypointInfo,
      route: routeWithWaypoints.paths[0].points,
    };

    res.send(resp);
  } catch (e) {
    res.status(503);
    res.send({
      message: Messages.ROUTER_UNAVAILABLE,
      error: true,
    });
    console.error(e);
  }
};

/**
 * Gets the distance and time of each waypoint passed to the graphhopper routing.
 *
 * @param route
 * @param ends If set to true, the return value will include distance and time of the beginning and end of the route
 * @returns Array of distance and time for each waypoint given on the route
 */
function getWaypointTimeAndDistance(route: Path, ends = false) {
  const waypoints = route.instructions.reduce(
    (acc, current, idx) => {
      const { distanceAcc, timeAcc, waypoints } = acc;
      const { distance, time } = current;
      const isStop = current.text.startsWith('Waypoint ');

      const newDistance = distanceAcc + distance;
      let newTime = timeAcc + time;

      // append waypoint for each stop
      // if ends is true, append the last instruction to waypoints
      if (isStop || (ends && idx == route.instructions.length - 1)) {
        waypoints.push({
          distance: newDistance,
          time: newTime,
        });
      }

      return {
        distanceAcc: newDistance,
        timeAcc: newTime, // add 1 minute travel time to every stop
        waypoints,
      };
    },
    {
      distanceAcc: 0,
      timeAcc: 0,
      waypoints: [],
    } as {
      distanceAcc: number;
      timeAcc: number;
      waypoints: { distance: number; time: number }[];
    },
  ).waypoints;

  // add the origin waypoint
  if (ends) {
    waypoints.unshift({
      distance: 0,
      time: 0,
    });
  }

  return waypoints;
}

// shamelessly copied from stackoverflow
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export const getGTFSShapeFromPoints = async (points: number[][]) => {
  /** todo: move out of function */
  const { data: routeWithWaypoints } = await axios(
    `${config.GRAPHHOPPER_URL}/route`,
    {
      method: 'POST',
      data: {
        profile: 'car',
        points,
        points_encoded: false,
      },
    },
  );

  return routeWithWaypoints.paths[0].points.coordinates.reduce(
    (shape, point, idx) => {
      if (idx === 0) {
        shape.push({
          lon: point[0],
          lat: point[1],
          seq: idx,
          dist: 0,
        });
        return shape;
      }

      const { lon: prevLat, lat: prevLon, dist: prevDist } = shape[idx - 1];
      const distTraveled = Math.round(
        getDistanceFromLatLonInKm(prevLat, prevLon, point[0], point[1]) * 1000,
      );

      shape.push({
        lon: point[0],
        lat: point[1],
        seq: idx,
        dist: prevDist + distTraveled,
      });
      return shape;
    },
    [],
  );
};

type Color = [number, number, number];

function randomRGBColor(): Color {
  return [0, 0, 0].map(() => Math.floor(Math.random() * 255)) as [
    number,
    number,
    number,
  ];
}

function textColorBasedOnColor(color: Color): string {
  return color[0] * 0.299 + color[1] * 0.587 + color[2] * 0.114 > 149
    ? '#000000'
    : '#FFFFFF';
}

function colorToHex(color: Color): string {
  return (
    '#' +
    color
      .map((c) => c.toString(16))
      .map((str) => (str.length === 1 ? `0${str}` : str))
      .join('')
      .toUpperCase()
  );
}

// const calculateLineType = (stops: Stop[]) => {
//   const enabledStops = stops.filter((s) => s.selected);

//   switch (true) {
//     case enabledStops.length === stops.length:
//       return 'Local';
//     case enabledStops.length > stops.length / 2:
//     default:
//       return 'Limited';
//     case enabledStops.length > 2:
//       return 'Limited-Express';
//     case enabledStops.length === 2:
//       return 'Express';
//   }
// };

interface ErrorResponse {
  message?: string;
  field?: string;
  error: boolean;
}

type CustomResponse = ErrorResponse | any;

export const createTripHandler: RequestHandler<
  null,
  CustomResponse,
  PersistTripRequestBody
> = async (req, res) => {
  const {
    stops = [],
    start_date,
    end_date,
    calendar,
    vehicle,
    route,
    agency,
  } = req.body;

  const userId = req.user!.id;

  if (stops.length < 2 || !start_date) {
    res.status(400);
    res.send({
      message: 'generic_error',
      error: true,
    });
    return;
  }

  if (stops.filter((s) => s.selected).length < 2) {
    res.status(400);
    res.send({
      message: 'trip_minimum_stations',
      field: 'stops',
      error: true,
    });
    return;
  }

  if (calendar) {
    const calendarValues = Object.values(calendar) as boolean[];
    if (calendarValues.length !== 7 || !calendarValues.find((v) => v)) {
      res.status(400);
      res.send({
        message: 'calendar_at_least_one',
        error: true,
      });
      return;
    }
  }

  const startDateTime = DateTime.fromISO(start_date);
  if (end_date) {
    const endDateTime = DateTime.fromISO(end_date);
    if (startDateTime > endDateTime) {
      res.status(400);
      res.send({
        message: 'starttime_greater_than_endtime',
        error: true,
      });
      return;
    }
  }

  // if agency provided, check if the user is allowed to add stuff to the agency
  if (agency) {
    const agencies = await db.manyOrNone(
      'SELECT agencies_id FROM agencies_members WHERE users_id = $1',
      [userId],
    );

    if (!agencies.find((val) => val.agency_id == agency)) {
      res.status(403);
      res.send({
        message: 'agency_non_member',
        error: true,
      });
      return;
    }
  }

  if (vehicle) {
    try {
      const vehicleData = await db.one(
        'SELECT owner, agency FROM vehicles WHERE id = $1',
        [vehicle],
      );

      if (vehicleData.owner != userId || vehicleData.agency != agency) {
        throw new Error('vehicle not allowed');
      }
    } catch (e) {
      res.status(404);
      res.send({
        message: 'vehicle_not_found',
        field: 'vehicle',
        error: true,
      });
      return;
    }
  }

  stops.forEach((stop) => {
    assert(stop.id, 'Each station needs an UUIDv4 ID');
    if (stop.private) {
      assert(stop.location, ' Private stops need a location');
      assert(stop.stop_name, 'Private stops need a stop_name');
    }
  });

  db.tx(async (dbConn) => {
    // private stops at the beginning or end of trips
    // they are not in the database and are only available for the trip
    // and they are also only saved within the trips table
    const privateStops = stops
      .filter((s) => s.private)
      .map((s) => ({
        id: s.id,
        private: true,
        stop_name: s.stop_name!,
        location: `POINT(${s.location!.coordinates[0]} ${
          s.location!.coordinates[1]
        })`,
        reporter: userId,
      }));

    if (privateStops.length > 0) {
      await createPrivateStops(privateStops, dbConn);
    }

    // Fetch the stops from the request in our database
    // to make sure they exist
    const dbStops = await dbConn
      .any<DBStop>(
        `
    select id as stop_id, ST_Y(location) as stop_lat, ST_X(location) as stop_lon, stop_name
    from stops
    where id = ANY($1::uuid[]) AND (active = true OR private = true)`,
        [stops.map((stop) => stop.id)],
      )
      .then((s) =>
        s.reduce((stops, currStop) => {
          stops[currStop.stop_id] = currStop;
          return stops;
        }, {} as { [index: string]: DBStop }),
      );

    // combine the stops we were sent with the ones from the database
    // And filter out the stops that are not in the DB
    const mappedStops = stops
      .map((s) => {
        const dbStop = dbStops[s.id] || null;
        if (!dbStop) {
          return null;
        }
        return {
          ...dbStop,
          ...s,
        };
      })
      .filter((s) => s) as (Stop & DBStop)[];

    // remove stops that the user marked as skipped
    const mappedSelectedExistingStops = mappedStops.filter((s) => s.selected);

    const startDateTime = DateTime.fromISO(start_date, { setZone: true });

    const tripID = uuidv4();
    const serviceID = uuidv4();
    let routeID = route ? route : uuidv4(); // route ID can change if existing route hash exists

    // create deterministic route ID for set of stop sequences
    // so if a user has the same stops they will serve the same line
    const shasum = crypto.createHash('sha1');

    // we don't use the mappedSelectedExistingStops to calculate the route hash
    // because we want the same route hash
    // no matter which stations are selected
    shasum.update(mappedStops.map((s) => s.id).join('-'));
    const routeHash = shasum.digest('hex');

    // check if route shape exists
    const existingShape = await dbConn.oneOrNone(
      `SELECT id  FROM shapes WHERE route_hash = $1`,
      [routeHash],
    );

    const shapeId = existingShape ? existingShape.id : uuidv4();

    if (!existingShape) {
      // create a new shape from navigation
      const stopCoordinates = mappedSelectedExistingStops.map((row) => [
        row.stop_lon,
        row.stop_lat,
      ]);

      const shapeEntries = await getGTFSShapeFromPoints(stopCoordinates);
      await dbConn.none(
        `INSERT INTO
    shapes (id, route_hash, shape, shape_dist)
    VALUES ($1::uuid, $2, ST_GeomFromText($3), $4)`,
        [
          shapeId,
          routeHash,
          `LINESTRING (${shapeEntries
            .map((s) => `${s.lon} ${s.lat}`)
            .join(', ')})`,
          JSON.stringify(shapeEntries.map((s) => s.dist)),
        ],
      );
    }

    // if  no route is specified, create one
    if (!route) {
      const routeColor = randomRGBColor();
      const textColor = textColorBasedOnColor(routeColor);

      const existingRoute = await dbConn.oneOrNone(
        `SELECT id FROM routes WHERE route_hash = $1`,
        [routeHash],
      );

      if (!existingRoute) {
        // route short name is a sequence, but the plan is to assign new
        // route short names/numbers later based on geolocation
        // to keep it simple. Or else the route names (Line numbers) will
        // get too complex
        await dbConn.none(
          `INSERT INTO
  routes (id, route_hash, agency, route_short_name, route_color, route_text_color, created_at)
  VALUES ($1::uuid, $2, $3, concat('L', substring($4 from 2 for 4)), $4, $5, CURRENT_TIMESTAMP) ON CONFLICT (route_hash) DO NOTHING`,
          [
            routeID,
            routeHash,
            agency ? agency : INTERNAL_DEFAULT_AGENCY_ID,
            colorToHex(routeColor),
            textColor,
          ],
        );
      } else {
        routeID = existingRoute.id;
      }
    }

    await dbConn.batch([
      dbConn.none(
        `
        INSERT INTO trips (
          id,
          route,
          calendar,
          start_date,
          owner,
          shape,
          created_at
           )

        VALUES (
          $1::uuid,
          $2::uuid,
          $3::uuid,
          $4,
          $5::uuid,
          $6::uuid, CURRENT_TIMESTAMP
        ) ON CONFLICT (id) DO UPDATE
        SET start_date = CURRENT_DATE`,
        [
          tripID,
          routeID,
          calendar ? serviceID : null,
          calendar ? null : startDateTime.toSQLDate(),
          agency ? null : userId, // leave owner as null of agency is set
          shapeId,
        ],
      ),
      vehicle
        ? dbConn.none(
            `INSERT INTO rt_trip_updates (id, trip, vehicle, created_at, updated_at)
        VALUES ($1::uuid, $2::uuid, $3::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [uuidv4(), tripID, vehicle],
          )
        : Promise.resolve(),
    ]);

    // handle reoccurring trip
    if (calendar && end_date) {
      const {
        monday = 0,
        tuesday = 0,
        wednesday = 0,
        thursday = 0,
        friday = 0,
        saturday = 0,
        sunday = 0,
      } = calendar;

      const endDateTime = DateTime.fromISO(end_date);

      await dbConn.none(
        `
        INSERT INTO calendar (id, monday, tuesday, wednesday, thursday, friday, saturday, sunday, start_date, end_date)
        VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO UPDATE
        SET (monday, tuesday, wednesday, thursday, friday, saturday, sunday, start_date, end_date) =
        (EXCLUDED.monday, EXCLUDED.tuesday, EXCLUDED.wednesday, EXCLUDED.thursday, EXCLUDED.friday, EXCLUDED.saturday, EXCLUDED.sunday, EXCLUDED.start_date, EXCLUDED.end_date)`,
        [
          serviceID,
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
          startDateTime.toSQLDate(),
          endDateTime.toSQLDate(),
        ],
      );
    }

    const { hour: hours, minute: minutes } = startDateTime;
    const startDuration = Duration.fromObject({
      hours,
      minutes: minutes,
    });
    const stopTimes = mappedSelectedExistingStops.map((stop, idx) => {
      const { id, arrivalOffset, departureOffset, distance } = stop;
      const arrivalTime = startDuration.plus(arrivalOffset);
      const departureTime = startDuration.plus(departureOffset);
      return {
        id: uuidv4(),
        trip: tripID,
        arrival: startDateTime.plus(arrivalOffset).toSQLTime(),
        departure: startDateTime.plus(departureOffset).toSQLTime(),
        arrival_day: Math.floor(arrivalTime.as('days')),
        departure_day: Math.floor(departureTime.as('days')),
        stop: id,
        stop_sequence: idx + 1,
        shape_dist_traveled: distance,
      };
    });

    const stopTimeInsert = pg.helpers.insert(
      stopTimes,
      [
        'id',
        'trip',
        'stop',
        'arrival',
        'departure',
        'arrival_day',
        'departure_day',
        'stop_sequence',
        'shape_dist_traveled',
      ],
      'stop_times',
    );
    await dbConn.none(stopTimeInsert);

    res.sendStatus(201);
  }).catch((e) => {
    console.error(e);
    res.sendStatus(500);
  });
};

export const cancelTripHandler: RequestHandler<
  { id: string; vehicle?: string },
  any,
  { date?: string }
> = async (req, res) => {
  const { id: tripid, vehicle: vehicleId = null } = req.params;
  const { date } = req.body;

  const { id: userId } = req.user;

  try {
    const tripVehicles = await db.manyOrNone(
      `
    SELECT *
    FROM trips t
    LEFT JOIN rt_trip_updates rttu ON rttu.trip = t.id
    WHERE t.id = $1`,
      [tripid],
    );

    if (!tripVehicles) {
      res.status(404);
      res.send({
        error: true,
        message: 'trip not found',
      });
      return;
    }

    const defaultTrip = tripVehicles[0];

    if (defaultTrip.owner != userId) {
      res.sendStatus(403);
      return;
    }

    if (tripVehicles.length > 1 && !vehicleId) {
      res.status(404);
      res.send({
        error: true,
        message:
          'You need to specify a vehicle ID because there are multiple on this trip',
      });
      return;
    }

    if (tripVehicles.length > 1 && vehicleId) {
      // verify this vehicle exists on the trip
      if (!tripVehicles.find((v) => v.vehicle_id === vehicleId)) {
        res.status(404);
        res.send({
          error: true,
          message: 'vehicle not found on this trip',
        });
        return;
      }
    }

    const vehicle = vehicleId ? vehicleId : defaultTrip.vehicle_id;

    const calendar = await db.oneOrNone(
      'SELECT * FROM calendar WHERE id = $1',
      [defaultTrip.calendar],
    );

    if (calendar) {
      if (!date) {
        res.status(400);
        res.send({
          error: true,
          message:
            'sending a date is required when having a reoccuring service',
        });
        return;
      }

      const minDate = DateTime.fromSQL(calendar.start_date);
      const maxDate = DateTime.fromSQL(calendar.end_date);
      const parsedDate = DateTime.fromISO(date);

      if (parsedDate < minDate || parsedDate > maxDate) {
        res.status(400);
        res.send({
          error: true,
          message: 'Date must be in range of the calendar start and end date',
        });
        return;
      }

      await cancelTrip(tripid, vehicle, parsedDate);
      res.sendStatus(200);
      return;
    }

    const parsedDate = DateTime.fromSQL(defaultTrip.start_date);

    await cancelTrip(tripid, vehicle, parsedDate);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};
