import axios from 'axios';
import { RequestHandler } from 'express';
import { OTP_URL, PHOTON_URL } from './common/config';
import { Messages } from './common/enums';
import { db } from './common/db';
import _ from 'lodash';
import { FeatureCollection, Geometry, OTPPlan } from './types';
import { DateTime } from 'luxon';

export const searchHandler: RequestHandler = async (req, res) => {
  const {
    from: fromCoords,
    to: toCoords,
    fromName = 'unknown',
    toName = 'unknown',
    showCanceled = false,
    ...otpQuery
  } = req.query;

  if (!fromCoords || !toCoords) {
    res.status(400);
    res.send({
      field: fromCoords ? 'to' : 'from',
      message: Messages.FIELD_REQUIRED,
    });
    return;
  }

  const from =
    typeof fromCoords === 'string'
      ? (fromCoords as string).split(',').map(parseFloat)
      : (fromCoords as string[]).map(parseFloat);
  const to =
    typeof toCoords === 'string'
      ? (toCoords as string).split(',').map(parseFloat)
      : (toCoords as string[]).map(parseFloat);

  if (from.length !== 2 && to.length !== 2) {
    res.status(400);
    res.send({
      field: to.length !== 2 ? 'to' : 'from',
      message: Messages.FIELD_INVALID,
    });
    return;
  }

  try {
    const plan = await searchRequest(
      [[from[1], from[0]]],
      [[to[1], to[0]]],
      fromName as string,
      toName as string,
      otpQuery,
      req.user,
      false,
    );

    res.send({
      plan,
    });
  } catch (e) {
    res.status(503);
    res.send({
      message: Messages.ROUTER_UNAVAILABLE,
    });
    console.error(e);
  }
};

export const searchRequest = async (
  fromCoords: Geometry['coordinates'], // [lat, lon]
  toCoords: Geometry['coordinates'],
  fromName: string,
  toName: string,
  otpQuery: Record<string, any> = {},
  user: Express.User | undefined = undefined,
  showCanceled = false, // shows canceled trips in search results
) => {
  // check https://github.com/opentripplanner/OpenTripPlanner/blob/dev-2.x/src/main/java/org/opentripplanner/api/common/RoutingResource.java
  const optResp = await axios.get<OTPPlan>(
    `${OTP_URL}/otp/routers/default/plan`,
    {
      params: {
        ...otpQuery,
        // @see https://github.com/opentripplanner/OpenTripPlanner/blob/dev-2.x/src/main/java/org/opentripplanner/api/common/LocationStringParser.java#L44
        fromPlace: `${fromName}::${fromCoords[1]},${fromCoords[0]}`,
        toPlace: `${toName}::${toCoords[1]},${toCoords[0]}`,
        debugItineraryFilter: true,
      },
    },
  );

  // extract all trip IDs from the legs
  const tripIds = _.uniq(
    optResp.data.plan.itineraries.flatMap((i) =>
      i.legs
        .map((l) => l.tripId)
        .filter((t) => t)
        .filter((t) => t?.includes('MetroCar'))
        .map((t) => t?.replace('MetroCar:', '')),
    ),
  );

  // no trip IDs of metro car in the search result
  // no need to enrich or filter results
  if (tripIds.length === 0) {
    return optResp.data.plan;
  }

  // fetch trip info for each trip id sent from OTP
  // to enrich trip info
  const tripList = await db.manyOrNone(
    `SELECT
      t.id as trip_id,
      u.display_name as username,
      u.id as owner_id,
      tu.schedule_relationship,
      t.feature_fares,
      t.feature_tickets,
      t.start_date
    FROM trips t
    INNER JOIN directus_users u ON t.owner = u.id
    LEFT JOIN rt_trip_updates tu ON tu.trip = t.id
    LEFT JOIN vehicles v ON tu.vehicle = v.id
    WHERE t.id IN ($1:csv)`,
    [tripIds],
  );

  // create a map out of the trip data
  const tripMap = tripList.reduce((trips, trip) => {
    trips[trip.trip_id] = trip;
    return trips;
  }, {});

  const tickets = {};
  if (user) {
    const ticketsQ = await db.manyOrNone(
      `SELECT
      tickets.id,
      tickets.start_date,
      tickets.origin_stop_sequence,
      tickets.destination_stop_sequence,
      tickets.approved,
      tickets.trip
      FROM tickets
      INNER JOIN trips ON tickets.trip = trips.id
      WHERE
        trips.id IN ($1:csv)
        AND tickets.owner = $2`,
      [tripIds, user.id],
    );

    ticketsQ.forEach((ticket) => {
      if (!tickets[ticket.trip]) {
        tickets[ticket.trip] = [];
      }

      tickets[ticket.trip].push({
        ...ticket,
        start_date: DateTime.fromJSDate(ticket.start_date).toSQLDate(),
      });
    });
  }

  // enrich otp legs with trip info
  // remove itineraries that include canceled trips
  const plan = {
    ...optResp.data.plan,
    itineraries: optResp.data.plan.itineraries
      .map((i) => ({
        ...i,
        legs: i.legs.map((l) => {
          if (!l.tripId) {
            return l;
          }

          const tripId = l.tripId.replace('MetroCar:', '');
          if (!(tripId in tripMap)) {
            return l;
          }

          const {
            trip_id,
            start_date: startDate,
            ...enrichments
          } = tripMap[tripId];

          return {
            ...l,
            ...enrichments,
            start_date: DateTime.fromJSDate(startDate).toSQLDate(),
            trip_id,
            tickets: tickets[trip_id] || [],
          };
        }),
      }))
      .filter(
        (i) =>
          showCanceled ||
          i.legs.find((l) => l.schedule_relationship !== 'CANCELED'),
      ),
  };

  return plan;
};

export const autocompleteQuery: RequestHandler = async (req, res) => {
  const { q, lat, lon } = req.query;
  const params = new URLSearchParams();
  params.append('q', q as string);

  if (lat && lon) {
    params.append('lat', lat as string);
    params.append('lon', lon as string);
  }
  const resp = await axios.get<FeatureCollection>(`${PHOTON_URL}/api`, {
    headers: req.headers,
    params,
  });

  const sendData = resp.data.features.map(
    ({
      properties: { name, country, city, state },
      geometry: { coordinates },
    }) => ({
      label: [name, city, state, country].filter((x) => x).join(', '),
      value: coordinates,
    }),
  );

  res.send(sendData);
};
