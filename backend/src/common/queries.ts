import { IDatabase, ITask } from 'pg-promise';
import { StopData } from '../types';
import { pg, db } from './db';

export async function createPrivateStops(
  stops: StopData[],
  dbConn: ITask<any> | IDatabase<any> = db,
) {
  const stopInsert = pg.helpers.insert(
    stops.map((s) => ({ ...s, created_at: new Date() })),
    ['id', 'stop_name', 'location', 'reporter', 'private', 'created_at'],
    'stops',
  );
  return dbConn.none(stopInsert);
}
