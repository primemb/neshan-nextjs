"use client";

import {
  deleteLocation,
  getAllLocations,
  saveNewlocation,
} from "@/actions/location.action";
import { LocationWithAddress } from "@/interfaces/api-responses.interface";
import { IGetAddressFromLocationParams } from "@/interfaces/location.interface";
import { useCallback, useState } from "react";

const useLocation = () => {
  const [locations, setLocations] = useState<LocationWithAddress[]>([]);

  const getLocations = useCallback(async () => {
    const data = await getAllLocations();
    setLocations(data);
  }, []);

  const addLocation = useCallback(
    async ({ lat, lng }: IGetAddressFromLocationParams) => {
      const newLocation = await saveNewlocation({ lat, lng });
      setLocations((prevLocation) => [...prevLocation, newLocation]);
      return newLocation;
    },
    []
  );

  const removeLocation = useCallback(async (id: number) => {
    setLocations((prevLocations) => prevLocations.filter((l) => l.id !== id));
    await deleteLocation(id);
  }, []);

  return { locations, addLocation, removeLocation, getLocations };
};

export default useLocation;
