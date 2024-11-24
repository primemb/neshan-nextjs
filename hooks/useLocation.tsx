"use client";

import {
  addLocationFromAddressAction,
  deleteLocationAction,
  getAllLocationsAction,
  saveNewlocationAction,
} from "@/actions/location.action";
import { LocationWithAddress } from "@/interfaces/api-responses.interface";
import { IGetAddressFromLocationParams } from "@/interfaces/location.interface";
import { useCallback, useState } from "react";

const useLocation = () => {
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

  return {
    locations,
    addLocation,
    addLocationFromAddress,
    removeLocation,
    getLocations,
  };
};

export default useLocation;