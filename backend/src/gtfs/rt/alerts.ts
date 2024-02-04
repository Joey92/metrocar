import { db } from '../../common/db';

import { DateTime } from 'luxon';
import { transit_realtime as protoRT } from '../../../generated/gtfs-rt';

export type CauseType = keyof typeof protoRT.Alert.Cause;
export type EffectType = keyof typeof protoRT.Alert.Effect;
export type SeverityType = keyof typeof protoRT.Alert.SeverityLevel;

export interface Alert {
  id: string;
  cause: CauseType;
  effect: EffectType;
  severity: SeverityType;
  affects: {
    trip?: string;
    agency?: string;
    route?: string;
    routeType?: string;
    stop?: string;
  };
  dates: {
    startTime: DateTime;
    endTime: DateTime;
  }[];
  translation: string; // translation key
}

export const saveAlert = async (alert: Alert) => {
  db.tx(async (tx) => {
    const { trip, agency, route, stop } = alert.affects;

    tx.batch([
      tx.none(
        'INSERT INTO rt_alerts (id, cause, effect, severity, translation, trip, route, agency, stop) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          alert.id,
          protoRT.Alert.Cause[alert.cause],
          protoRT.Alert.Effect[alert.effect],
          protoRT.Alert.SeverityLevel[alert.severity],
          alert.translation,
          trip,
          route,
          agency,
          stop
        ],
      ),
      alert.dates.map((date) =>
        tx.none(
          'INSERT INTO rt_alert_times (alert, start_time, end_time) VALUES ($1, $2, $3)',
          [alert.id, date.startTime.toSeconds(), date.endTime.toSeconds()],
        ),
      ),
    ]);
  });
};
