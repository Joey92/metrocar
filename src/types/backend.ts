import { Components } from "./directus";

export interface NavigateResponse {
  waypointInfo: MeasuredStop[];
  route: Points;
  from?: MeasuredStop;
  to?: MeasuredStop;
}

export interface Route {
  hints: Hints;
  info: Info;
  paths: Path[];
}

export interface Hints {
  "visited_nodes.sum": number;
  "visited_nodes.average": number;
}

export interface Info {
  copyrights: string[];
  took: number;
}

export interface Path {
  distance: number;
  weight: number;
  time: number;
  transfers: number;
  points_encoded: boolean;
  bbox: number[];
  points: Points;
  instructions: Instruction[];
  legs: any[];
  details: Details;
  ascend: number;
  descend: number;
  snapped_waypoints: Points;
}

export interface Details {}

export interface Instruction {
  distance: number;
  heading?: number;
  sign: number;
  interval: number[];
  text: string;
  time: number;
  street_name: string;
  last_heading?: number;
}

export interface Points {
  type: string;
  coordinates: [number, number][];
}

export interface NavigateResponseError {
  error?: boolean;
  field?: string;
  message: string;
}

export interface SearchResponse {
  plan: Plan;
}

export interface Plan {
  date: number;
  from: PlanFrom;
  to: PlanFrom;
  itineraries: Itinerary[];
}

export interface PlanFrom {
  name: string;
  lon: number;
  lat: number;
  vertexType: VertexType;
}

export enum VertexType {
  Normal = "NORMAL",
  Transit = "TRANSIT",
}

export interface Itinerary {
  duration: number;
  startTime: number;
  endTime: number;
  walkTime: number;
  transitTime: number;
  waitingTime: number;
  walkDistance: number;
  walkLimitExceeded: boolean;
  generalizedCost: number;
  elevationLost: number;
  elevationGained: number;
  transfers: number;
  fare: ItineraryFare;
  legs: Leg[];
  systemNotices: SystemNotice[];
  tooSloped: boolean;
  arrivedAtDestinationWithRentedBicycle: boolean;
}

export interface ItineraryFare {
  fare: FareFare;
  details: Details;
}

export interface Details {
  regular?: RegularElement[];
}

export interface RegularElement {
  fareId: string;
  price: PriceClass;
  routes: string[];
}

export interface PriceClass {
  currency: Currency;
  cents: number;
}

export interface Currency {
  symbol: string;
  currency: string;
  defaultFractionDigits: number;
  currencyCode: string;
}

export interface FareFare {
  regular?: PriceClass;
}

export interface Leg {
  startTime: number;
  endTime: number;
  departureDelay: number;
  arrivalDelay: number;
  realTime: boolean;
  distance: number;
  generalizedCost: number;
  pathway: boolean;
  mode: string;
  transitLeg: boolean;
  route: string;
  agencyTimeZoneOffset: number;
  interlineWithPreviousLeg: boolean;
  from: IntermediateStopClass;
  to: IntermediateStopClass;
  legGeometry: LegGeometry;
  steps: Step[];
  alerts?: Alert[];
  rentedBike?: boolean;
  walkingBike?: boolean;
  duration: number;
  agencyName?: string;
  agencyUrl?: string;
  routeColor?: string;
  routeType?: number;
  routeId?: string;
  routeTextColor?: string;
  tripShortName?: string;
  headsign?: string;
  agencyId?: string;
  tripId?: string;
  serviceDate?: string;
  intermediateStops?: IntermediateStopClass[];
  routeShortName?: string;
  routeLongName?: string;
  username?: string;
  owner_id?: string;
  schedule_relationship?: null;
  vehicle_description?: string;
  vehicle_licenseplate?: string;
  feature_fares?: boolean;
  feature_tickets?: boolean;
  start_date?: string;
  trip_id?: string;
  tickets?: Ticket[];
}

export interface Alert {
  alertHeaderText: AlertHeaderText;
}

export enum AlertHeaderText {
  UnpavedSurface = "Unpaved surface",
}

export interface IntermediateStopClass {
  name: string;
  lon: number;
  lat: number;
  departure?: number;
  vertexType: VertexType;
  stopId?: string;
  arrival?: number;
  zoneId?: string;
  stopIndex?: number;
  stopSequence?: number;
}

export interface LegGeometry {
  points: string;
  length: number;
}

export interface Step {
  distance: number;
  relativeDirection: string;
  streetName: string;
  absoluteDirection: AbsoluteDirection;
  stayOn: boolean;
  area: boolean;
  bogusName: boolean;
  lon: number;
  lat: number;
  elevation: string;
  walkingBike: boolean;
  alerts?: Alert[];
}

export enum AbsoluteDirection {
  Northwest = "NORTHWEST",
  South = "SOUTH",
  Southeast = "SOUTHEAST",
  Southwest = "SOUTHWEST",
  West = "WEST",
}

export interface Ticket {
  id: string;
  start_date: string;
  origin_stop_sequence: number;
  destination_stop_sequence: number;
  approved: boolean;
  trip: string;
}

export interface SystemNotice {
  tag: string;
  text: string;
}

export type MeasuredStop = Components.Schemas.ItemsStops & {
  distance: number;
  time: number;
};

export type StopOnATrip = MeasuredStop & {
  stopDuration: number;
  arrivalOffset: number;
  departureOffset: number;
  selected: boolean;
  features: {
    selected: boolean;
    enter: boolean;
    exit: boolean;
  };
};

export interface CreateTripRequest {
  stops: StopOnATrip[];
  start_date: string;
  agency?: string;
  end_date?: string;
  weekdays?: {
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
    sunday?: boolean;
  };
  vehicle?: string;
}
