import axios from "axios";
import { INTERNAL_OTP_URL } from "../config";

export const axiosConfigDefaults = {
  baseURL: INTERNAL_OTP_URL,
  timeout: 10000,
};

export default axios.create(axiosConfigDefaults);

// e.g. /otp/routers/default/index/stops/MetroCar:75dda211-e938-4a9e-b228-f796ff042f19/stoptimes/2022-07-21
export interface StopTimeResponse {
  pattern: Pattern;
  times: Time[];
}

export interface Pattern {
  id: string;
  desc: string;
  routeId: string;
}

export interface Time {
  stopId: string;
  stopIndex: number;
  stopCount: number;
  scheduledArrival: number;
  scheduledDeparture: number;
  realtimeArrival: number;
  realtimeDeparture: number;
  arrivalDelay: number;
  departureDelay: number;
  timepoint: boolean;
  realtime: boolean;
  realtimeState: string;
  serviceDay: number;
  tripId: string;
  headsign: string;
}

// e.g. /otp/routers/default/index/routes/MetroCar:${routeId}/trips
export interface Trips {
  id: string;
  tripHeadsign: string;
  serviceId: string;
  shapeId: string;
  direction: number;
}
