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

export type LocationWithAddress = Location & { address?: Address | null };
