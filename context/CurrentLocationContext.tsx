"use client";

import { createContext } from "react";
import { GeoLocationCoordinates } from "@/interfaces/location.interface";

interface ICurrentLocationContext {
  location: GeoLocationCoordinates | null;
  error: string | null;
  isManualLocation: boolean;
  setManualLocation: (location: GeoLocationCoordinates) => void;
  toggleManualLocation: () => void;
  isLoading: boolean;
}

export const CurrentLocationContext = createContext<
  ICurrentLocationContext | undefined
>(undefined);
