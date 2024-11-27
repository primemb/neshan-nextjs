"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  addLocationFromAddressAction,
  deleteLocationAction,
  drawLocationAction,
  getAllLocationsAction,
  saveNewlocationAction,
} from "@/actions/location.action";
import { LocationWithAddress } from "@/interfaces/api-responses.interface";
import { IGetAddressFromLocationParams } from "@/interfaces/location.interface";
import { makeRouteAndPoint } from "@/libs/util";

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
  drawDirection: (locations: { lat: number; lng: number }[]) => Promise<any>;
}

// Create the context
const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

// Create the provider component
export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locations, setLocations] = useState<LocationWithAddress[]>([]);

  const getLocations = useCallback(async () => {
    const data = await getAllLocationsAction();
    setLocations(data);
  }, []);

  const addLocation = useCallback(
    async ({ lat, lng }: IGetAddressFromLocationParams) => {
      const newLocation = await saveNewlocationAction({ lat, lng });
      setLocations((prevLocation) => [...prevLocation, newLocation]);
      return newLocation;
    },
    []
  );

  const addLocationFromAddress = useCallback(async (address: string) => {
    const newLocation = await addLocationFromAddressAction(address);
    if ("error" in newLocation) {
      return newLocation;
    } else {
      setLocations((prevLocation) => [...prevLocation, newLocation]);
      return newLocation;
    }
  }, []);

  const removeLocation = useCallback(async (id: number) => {
    setLocations((prevLocations) => prevLocations.filter((l) => l.id !== id));
    await deleteLocationAction(id);
  }, []);

  const drawDirection = useCallback(
    async (locations: { lat: number; lng: number }[]) => {
      const response = await drawLocationAction(locations);
      return makeRouteAndPoint(response);
    },
    []
  );

  return (
    <LocationContext.Provider
      value={{
        locations,
        addLocation,
        addLocationFromAddress,
        removeLocation,
        getLocations,
        drawDirection,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Update the useLocation hook to use context
const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

export default useLocation;
