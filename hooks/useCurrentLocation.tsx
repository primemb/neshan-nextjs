"use client";

import { CurrentLocationContext } from "@/context/CurrentLocationContext";
import { useContext } from "react";

export const useCurrentLocation = () => {
  const context = useContext(CurrentLocationContext);

  if (context === undefined) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider"
    );
  }

  return context;
};
