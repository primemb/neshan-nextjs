import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
}

interface UseCurrentLocationReturn {
  location: Coordinates | null;
  error: string | null;
}

export const useCurrentLocation = (
  options: PositionOptions = {}
): UseCurrentLocationReturn => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previousLocation = useRef<Coordinates | null>(null);

  useEffect(() => {
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

      // Function to calculate distance between two coordinates
      const getDistance = (loc1: Coordinates, loc2: Coordinates) => {
        const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
        const earthRadiusKm = 6371;

        const dLat = toRadians(loc2.latitude - loc1.latitude);
        const dLon = toRadians(loc2.longitude - loc1.longitude);

        const lat1 = toRadians(loc1.latitude);
        const lat2 = toRadians(loc2.latitude);

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusKm * c * 1000; // Distance in meters
      };

      if (previousLocation.current) {
        const distance = getDistance(previousLocation.current, newLocation);
        if (distance < 10) {
          // Ignore updates less than 10 meters
          return;
        }
      }

      previousLocation.current = newLocation;
      setLocation(newLocation);
    };

    const handleError: PositionErrorCallback = (error) => {
      setError(error.message);
    };

    const watcherId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watcherId);
    };
  }, [options]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return { location, error };
};
