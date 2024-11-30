"use client";

import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { FaLocationArrow } from "react-icons/fa";

const CurrentLocationButton = () => {
  const { isLoading, toggleManualLocation } = useCurrentLocation();
  return (
    <button
      className="absolute bottom-4 right-4 z-10 bg-white p-2 rounded-full shadow-lg"
      onClick={toggleManualLocation}
    >
      <FaLocationArrow
        className={`${
          isLoading ? "animate-pulse text-red-500" : "text-blue-500"
        }`}
      />
    </button>
  );
};

export default CurrentLocationButton;
