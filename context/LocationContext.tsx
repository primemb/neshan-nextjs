"use client";

import { createContext } from "react";
import { LocationWithAddress } from "@/interfaces/api-responses.interface";
import {
  ICoordinate,
  IGetAddressFromLocationParams,
} from "@/interfaces/location.interface";

// Define the shape of your context
interface LocationContextType {
  locations: LocationWithAddress[];
  addLocation: (
    params: IGetAddressFromLocationParams
  ) => Promise<LocationWithAddress>;
  addLocationFromAddress: (
    address: string
  ) => Promise<LocationWithAddress | { error: string }>;
  removeLocation: (id: number) => Promise<void>;
  getLocations: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  directionInfo: (start: ICoordinate, locations: ICoordinate[]) => Promise<any>;
}

// Create the context
export const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);
