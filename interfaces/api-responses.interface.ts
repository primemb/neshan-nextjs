import { Address, Location } from "@prisma/client";

export interface ILocationToAddress {
  status: string;
  formatted_address: string;
  route_name: string;
  route_type: string;
  neighbourhood: string | null;
  city: string;
  state: string;
  place: string | null;
  municipality_zone: string | null;
  in_traffic_zone: boolean;
  in_odd_even_zone: boolean;
  village: string | null;
  county: string;
  district: string;
}

export interface IAdrressToLocation {
  status: string;
  location: {
    x: number;
    y: number;
  };
}

export interface ITSPApiParams {
  waypoints: { lat: number; lng: number }[];
  sourceIsAnyPoint: boolean;
}

export type LocationWithAddress = Location & { address?: Address | null };

export interface ITSPApiResponse {
  points: Point[];
}

export interface Point {
  name: string;
  location: number[];
  index: number;
}

export interface IDirectionApiResponse {
  routes: Route[];
}

export interface Route {
  overview_polyline: OverviewPolyline;
  legs: Leg[];
}

export interface OverviewPolyline {
  points: string;
}

export interface Leg {
  summary: string;
  distance: Distance;
  duration: Duration;
  steps: Step[];
}

export interface Distance {
  value: number;
  text: string;
}

export interface Duration {
  value: number;
  text: string;
}

export interface Step {
  name: string;
  instruction: string;
  bearing_after: number;
  type: string;
  modifier?: string;
  distance: Distance;
  duration: Duration;
  polyline: string;
  start_location: number[];
  exit?: number;
}
