import { RequestHandler } from 'express';
import { DateTime } from 'luxon';
import { transit_realtime as protoRT } from '../../../generated/gtfs-rt';
import redisClient from '../../common/redis';

export type CongestionLevel = keyof typeof protoRT.VehiclePosition.CongestionLevel;
export type VehicleStopStatus = keyof typeof protoRT.VehiclePosition.VehicleStopStatus;
export type OccupancyStatus = keyof typeof protoRT.VehiclePosition.OccupancyStatus;

export const vehicleUpdateHandler: RequestHandler = async (req) => {
  const { id, lat, lon, speed } = req.body;
  await createVehicleUpdate(id, lat, lon, speed);
};

export const createVehicleUpdate = async (id, latitude, longitude, speed) => {
  const { FeedEntity, VehiclePosition } = protoRT;

  const vehicle = {
    trip: {
      tripId: id,
    },
    position: {
      latitude,
      longitude,
      speed,
    },
    congestionLevel: 0,
    occupancyStatus: VehiclePosition.OccupancyStatus.FEW_SEATS_AVAILABLE,
    timestamp: DateTime.now().toSeconds(),
  } as protoRT.IVehiclePosition;

  const entity = new FeedEntity({
    id,
    vehicle,
  });

  const key = `rt_trip_update_${id}`;

  const entityBuffer = Buffer.from(FeedEntity.encode(entity).finish());
  await redisClient.set(key, entityBuffer, {
    EX: 500
  });
  await redisClient.publish(key, entityBuffer as unknown as string);
};

export const getVehicleUpdates = async () => {
  const vehicleUpdates: protoRT.FeedEntity[] = [];
  for await (const key of redisClient.scanIterator({
    MATCH: 'rt_trip_update_*',
  })) {
    const feedEntityData = await redisClient.getBuffer(key);
    vehicleUpdates.push(protoRT.FeedEntity.decode(feedEntityData));
  }

  return vehicleUpdates;
}
