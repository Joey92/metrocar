import { Geometry } from "./geo";

export interface SelectValue<T> {
  label?: string;
  value?: T;
}

export type CoordinateSelectValue = SelectValue<[number, number]>;

export interface RadarTrip {
  id: number;
  trip_radar_id: string;
  trips_id: string;
}

export interface Radar {
  id: string;
  from: Geometry;
  to: Geometry;
  from_name: string;
  to_name: string;
  date: string;
  has_search_results?: boolean | null;
}

export interface DirectusNotification {
  id?: number;
  timestamp?: string;
  status?: string;
  recipient?: string;
  sender?: string;
  subject?: string;
  message?: string;
  collection?: string;
  item?: string;
}
