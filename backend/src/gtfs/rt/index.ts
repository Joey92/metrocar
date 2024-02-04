import { DateTime } from 'luxon';
import { transit_realtime as protoRT } from '../../../generated/gtfs-rt';
import crypto from 'crypto';

import { db } from '../../common/db';
import { RequestHandler } from 'express';
import i18next from 'i18next';
import { getVehicleUpdates } from './vehicleUpdate';

const t = i18next.t;

export const toFeed = (entity: any[]) =>
  new protoRT.FeedMessage({
    header: new protoRT.FeedHeader({
      gtfsRealtimeVersion: '2.0',
      incrementality: protoRT.FeedHeader.Incrementality.FULL_DATASET,
      timestamp: DateTime.now().toMillis() / 1000,
    }),
    entity,
  });

export const gtfsRTHandler: RequestHandler = async (_, res) => {
  const feed = await getRTFeed();

  res.send(protoRT.FeedMessage.encode(feed).finish());
};

export const gtfsRTTripUpdatesHandler: RequestHandler = async (_, res) => {
  const tripUpdates = await tripUpdateFeedEntities();

  console.log(`GTFS RT: ${tripUpdates.length} trip updates`);

  res.send(protoRT.FeedMessage.encode(toFeed(tripUpdates)).finish());
};

export const gtfsRTAlertsHandler: RequestHandler = async (_, res) => {
  const alerts = await alertsFeedEntities();

  console.log(`GTFS RT: ${alerts.length} alerts`);

  res.send(protoRT.FeedMessage.encode(toFeed(alerts)).finish());
};

export const gtfsAlertsHandler: RequestHandler = async (_, res) => {
  res.send(await getAlerts());
};

export const gtfsTripUpdatesHandler: RequestHandler = async (_, res) => {
  res.send(await getTripUpdates());
};

export const gtfsVehicleUpdatesHandler: RequestHandler = async (_, res) => {
  res.send(await getVehicleUpdates());
};

export const tripUpdateFeedEntities = async () => {
  const updates = await getTripUpdates();
  return Object.keys(updates).map((id) => {
    return new protoRT.FeedEntity({
      id,
      tripUpdate: updates[id],
    });
  });
};

export const alertsFeedEntities = async () => {
  /**
   * Alerts
   */
  const alerts = await getAlerts();
  return alerts.map((alert) => {
    const shasum = crypto.createHash('sha1');
    alert.informedEntity
      .map((entity) =>
        [
          entity.agencyId,
          entity.directionId,
          entity.routeId,
          entity.routeType,
          entity.stopId,
          entity.trip?.tripId,
        ].join(''),
      )
      .forEach((entity) => {
        shasum.update(entity);
      });

    const id = shasum.digest('hex');

    return new protoRT.FeedEntity({
      id,
      alert,
    });
  });
};

export const languages = ['en', 'de']; // languages for Alert translations
interface Translation {
  url?: string;
  headerText: string;
  ttsHeaderText?: string;
  descriptionText: string;
  ttsDescriptionText?: string;
}

export const getAlerts = async (): Promise<protoRT.IAlert[]> => {
  const alertData = await db.manyOrNone(`SELECT * FROM rt_alerts`);
  const times = await db.manyOrNone(`SELECT * FROM rt_alert_times`);

  const alerts: { [index: string]: protoRT.IAlert } = {};

  alertData.forEach((alert) => {
    const {
      id,
      cause,
      effect,
      severity,
      agency: agencyId,
      route: routeId,
      route_type: routeType = undefined,
      trip: tripId,
      stop: stopId,
    } = alert;
    alerts[id] = {
      cause:
        protoRT.Alert.Cause[cause as string] ||
        protoRT.Alert.Cause.UNKNOWN_CAUSE,
      effect:
        protoRT.Alert.Effect[effect as string] ||
        protoRT.Alert.Effect.UNKNOWN_EFFECT,
      severityLevel:
        protoRT.Alert.SeverityLevel[severity as string] ||
        protoRT.Alert.SeverityLevel.UNKNOWN_SEVERITY,
      activePeriod: [],

      url: {
        translation: [],
      },
      headerText: {
        translation: [],
      },
      ttsHeaderText: {
        translation: [],
      },
      descriptionText: {
        translation: [],
      },
      ttsDescriptionText: {
        translation: [],
      },
      informedEntity: [
        {
          agencyId,
          routeId,
          routeType,
          trip: tripId
            ? {
                tripId,
              }
            : undefined,
          stopId,
        },
      ],
    };
  });

  alertData.forEach((alert) => {
    const { id, translation } = alert;
    languages.forEach((language) => {
      const trans = t(translation, {
        lng: language,
        returnObjects: true,
      }) as unknown as Translation;

      if (!trans.headerText || !trans.descriptionText) {
        alerts[id].headerText.translation.push({
          text: 'Alert',
        });
        alerts[id].headerText.translation.push({
          text: 'This alert has no text. Please report this to the developer!',
        });
      }

      Object.keys(trans).forEach((key) => {
        if (key in alerts[id]) {
          alerts[id][key].translation.push({
            text: trans[key],
            language,
          });
        }

        alerts[id][key] = {
          translation: [
            {
              text: trans[key],
              language,
            },
          ],
        };
      });
    });
  });

  times.forEach((time) => {
    const { alert: id, start_time: start, end_time: end } = time;

    alerts[id].activePeriod.push({
      start,
      end,
    });
  });

  return Object.values(alerts);
};

interface TripUpdateHashMap {
  [index: string]: protoRT.TripUpdate;
}

export const getTripUpdates = async () => {
  // Must select trips and updates from the last 24h
  const tripUpdates = await db.manyOrNone(`
  SELECT
    tu.id,
    t.id as trip_id,
    v.id as vehicle_id,
    v.licenseplate,
    v.description as vehicle_label,
    tu.schedule_relationship as schedule_relationship,
    coalesce(tu.start_date, t.start_date) as start_date,
    stu.schedule_relationship as stu_schedule_relationship,
    stu.updated_at as stu_updated_at,
    extract(epoch from tu.updated_at) as updated_at,
    st.stop as stop_id,
    st.stop_sequence,
    st.arrival,
    st.departure,
    stu.arrival_delay,
    stu.departure_delay
  FROM rt_trip_updates tu
  INNER JOIN trips t ON t.id = tu.trip
  INNER JOIN stop_times st ON tu.trip = st.trip
  LEFT JOIN vehicles v ON tu.vehicle = v.id
  LEFT JOIN rt_stop_time_updates stu
    ON st.trip = stu.trip
      AND st.stop_sequence = stu.stop_sequence
  WHERE
      tu.updated_at > NOW() - INTERVAL '15 minutes'
      OR (t.start_date > NOW() AND tu.schedule_relationship = 'CANCELED')
  `);

  const updates: TripUpdateHashMap = tripUpdates.reduce(
    (tripUpdates: TripUpdateHashMap, tripUpdate) => {
      const {
        id,
        trip_id,
        vehicle_id,
        licenseplate,
        vehicle_label,
        stop_sequence,
        schedule_relationship,
        updated_at,
        //arrival_time: scheduledArrivalTime,
        arrival_delay,
        //departure_time: scheduledDepartureTime,
        departure_delay,
        stu_schedule_relationship,
        //start_date,
        // stop_id,
      } = tripUpdate;

      // const startDate = DateTime.fromJSDate(start_date);

      if (!(id in tripUpdates)) {
        tripUpdates[id] = {
          trip: {
            tripId: trip_id,
            scheduleRelationship: schedule_relationship,
            // startDate: startDate.toFormat('yyyyMMdd'),
          },
          vehicle: vehicle_id
            ? {
                id: vehicle_id,
                licensePlate: licenseplate,
                label: vehicle_label,
              }
            : undefined,
          stopTimeUpdate: [],
          timestamp: updated_at,
          delay: 0,
        } as protoRT.TripUpdate;
      }

      tripUpdates[id].stopTimeUpdate.push({
        stopSequence: stop_sequence,
        // stopId: stop_id,
        arrival: {
          delay: arrival_delay || 0,
          // time: Math.round(
          //   startDate
          //     .plus(scheduledArrivalTime)
          //     .plus({ minutes: arrival_delay || 0 })
          //     .toSeconds(),
          // ),
        },
        departure: {
          delay: departure_delay || 0,
          // time: Math.round(
          //   startDate
          //     .plus(scheduledDepartureTime)
          //     .plus({ minutes: departure_delay || 0 })
          //     .toSeconds(),
          // ),
        },
        scheduleRelationship: stu_schedule_relationship
          ? stu_schedule_relationship
          : schedule_relationship,
      });

      return tripUpdates;
    },
    {} as TripUpdateHashMap,
  );

  return updates;
};

export const getRTFeed = async () => {
  /**
   * VehicleUpdates
   */
  const vehicleUpdates = await getVehicleUpdates();

  const updateFeedEntities = await tripUpdateFeedEntities();

  const alertFeedEntities = await alertsFeedEntities();

  console.log(
    `GTFS RT: ${alertFeedEntities.length} alerts, ${updateFeedEntities.length} trip updates, ${vehicleUpdates.length} vehicle updates`,
  );

  return toFeed([
    ...alertFeedEntities,
    ...updateFeedEntities,
    ...vehicleUpdates,
  ]);
};
