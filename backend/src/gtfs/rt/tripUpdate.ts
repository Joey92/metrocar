import { DateTime } from 'luxon';
import { db } from '../../common/db';
import { transit_realtime as protoRT } from '../../../generated/gtfs-rt';

export type ScheduleRelationship =
  keyof typeof protoRT.TripDescriptor.ScheduleRelationship;

// see https://gtfs.org/reference/realtime/v2/#enum-schedulerelationship-1
export const updateTripScheduleRelationship = (
  tripId: string,
  vehicleId: string,
  date: DateTime,
  relationship: ScheduleRelationship,
) =>
  // TODO: handle different start dates
  db.none(
    `INSERT INTO
    rt_trip_updates (trip, vehicle, start_date, schedule_relationship)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (trip, vehicle)
    DO UPDATE SET schedule_relationship = EXCLUDED.schedule_relationship`,
    [tripId, vehicleId, date.toSQLDate(), relationship],
  );

export const updateVehicle = (
  tripId: string,
  date: DateTime,
  vehicleId: string,
) =>
  db.none(
    `UPDATE
    rt_trip_updates
    SET vehicle_id = $1
    WHERE trip = $2 AND start_date = $3
    ON CONFLICT (trip, vehicle, start_date)
    DO NOTHING`,
    [vehicleId, tripId, date],
  );

export const cancelTrip = (tripId: string, vehicleId: string, date: DateTime) =>
  updateTripScheduleRelationship(tripId, vehicleId, date, 'CANCELED');

export const scheduleTrip = (
  tripId: string,
  vehicleId: string,
  date: DateTime,
) => updateTripScheduleRelationship(tripId, vehicleId, date, 'SCHEDULED');
