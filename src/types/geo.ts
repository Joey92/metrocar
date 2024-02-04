export interface FeatureCollection {
  features: Feature[];
  type: string;
}

export interface Feature {
  geometry: Geometry;
  type: string;
  properties: Properties;
}

export interface Geometry {
  coordinates: [number, number][];
  type: GeometryType;
}

export enum GeometryType {
  Point = "Point",
}

export interface Properties {
  osm_id: number;
  osm_type: string;
  extent: number[];
  country: string;
  osm_key: string;
  city?: string;
  countrycode: string;
  district?: string;
  osm_value: string;
  postcode: string;
  name: string;
  type: string;
  county?: string;
  state?: string;
  housenumber?: string;
  street?: string;
}
