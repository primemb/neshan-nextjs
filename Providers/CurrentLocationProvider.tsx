"use client";

import { CurrentLocationContext } from "@/context/CurrentLocationContext";
import { GeoLocationCoordinates } from "@/interfaces/location.interface";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface LocationProviderProps {
  children: React.ReactNode;
}

export const CurrentLocationProvider = ({
  children,
}: LocationProviderProps) => {
  const [location, setLocation] = useState<GeoLocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setManualLocation = useCallback(
    (manualLocation: GeoLocationCoordinates) => {
      setLocation(manualLocation);
      setError(null);
      toast.success("موقعیت مکانی به صورت دستی تنظیم شد");
      setIsManualLocation(true);
      setIsLoading(false);
    },
    []
  );

  const toggleManualLocation = () => {
    setIsLoading((prev) => !prev);
  };

  useEffect(() => {
    // Do not attempt to get location if it's manually set
    if (isManualLocation || isLoading || location !== null) return;

    if (!navigator.geolocation) {
      setError("امکان دسترسی به موقعیت فعلی شما وجود ندارد");
      return;
    }

    const handleSuccess: PositionCallback = ({ coords }) => {
      const { latitude, longitude, accuracy, altitude, heading, speed } =
        coords;
      const newLocation = {
        latitude,
        longitude,
        accuracy,
        altitude,
        heading,
        speed,
      };

      setLocation(newLocation);
    };

    const handleError: PositionErrorCallback = (error) => {
      console.error(error);
      setError(
        "مشکلی در دسترسی به موقعیت فعلی شما پیش آمد, لطفا به صورت دستی موقعیت خود را تنظیم کنید"
      );
    };

    // Get location once instead of watching
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000,
    });
  }, [isManualLocation, isLoading, location]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <CurrentLocationContext.Provider
      value={{
        location,
        error,
        isLoading,
        isManualLocation,
        setManualLocation,
        toggleManualLocation,
      }}
    >
      {children}
    </CurrentLocationContext.Provider>
  );
};
