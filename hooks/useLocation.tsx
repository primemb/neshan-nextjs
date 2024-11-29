"use client";

import { LocationContext } from "@/context/LocationContext";
import { useContext } from "react";

const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

export default useLocation;
