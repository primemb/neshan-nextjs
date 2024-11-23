"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import mapboxgl from "@neshan-maps-platform/mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";

import ThemeSwitch from "./Themeswitch";
import useLocation from "@/hooks/useLocation";

const Map = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const mapRef = useRef<mapboxgl.Map>();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<Record<number, mapboxgl.Marker>>({});

  const { locations, getLocations, addLocation, removeLocation } =
    useLocation();

  const isDarkMode = theme === "dark";

  const handleMapClick = useCallback(
    async (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      if (mapRef.current) {
        // Get the clicked coordinates
        const { lng, lat } = event.lngLat;
        // Create a new marker
        const newLocation = await addLocation({ lat, lng });
        const newMarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        markerRef.current[newLocation.id] = newMarker;
        newMarker.getElement().addEventListener("click", (event) => {
          // Prevent map click event from firing
          event.stopPropagation();
          newMarker.remove();
          removeLocation(newLocation.id);
        });

        // Update the state to include the new marker
      }
    },
    [addLocation, removeLocation]
  );

  useEffect(() => {
    if (mapRef.current) {
      for (const location of locations) {
        if (!markerRef.current[location.id]) {
          const mark = new mapboxgl.Marker()
            .setLngLat([location.longitude, location.latitude])
            .addTo(mapRef.current as mapboxgl.Map);

          markerRef.current[location.id] = mark;
          mark.getElement().addEventListener("click", (event) => {
            // Prevent map click event from firing
            event.stopPropagation();
            mark.remove();
            removeLocation(location.id);
          });
        }
      }
    }
  }, [locations, mapRef, removeLocation]);

  useEffect(() => {
    const neshanMap = mapRef.current;
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        mapType: isDarkMode
          ? mapboxgl.Map.mapTypes.neshanVectorNight
          : mapboxgl.Map.mapTypes.neshanVector,
        mapKey: process.env.NEXT_PUBLIC_NESHAN_MAP_KEY as string,
        zoom: 11,
        pitch: 0,
        center: [51.389, 35.6892],
        minZoom: 2,
        maxZoom: 21,
        trackResize: false,
        poi: true,
        traffic: false,

        mapTypeControllerOptions: {
          show: true,
          position: "bottom-left",
        },
      }) as unknown as mapboxgl.Map;
      mapRef.current.on("click", handleMapClick);
      mapRef.current.on("load", () => {
        getLocations();
      });
    }
    return () => neshanMap?.remove();
  }, [isDarkMode, mounted, handleMapClick, getLocations]);

  useEffect(() => setMounted(true), []);

  const toggleDarkMode = () => {
    markerRef.current = {};
    setTheme(isDarkMode ? "light" : "dark");

    // mapRef.current?.remove();
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="w-1/4 p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Markers List</h2>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
              title="Toggle Dark Mode"
            >
              <ThemeSwitch />
            </button>
          </div>
          {locations.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              هیچ مکانی انتخاب نشده است
            </p>
          ) : (
            <ul>
              {locations.map((location, index) => {
                return (
                  <li
                    key={index}
                    className="mb-2 p-2 bg-gray-200 dark:bg-gray-700 rounded"
                  >
                    <div className="flex justify-between items-center">
                      <span>
                        {location.address?.formatted_address || "ادرس یافت نشد"}
                      </span>
                      <button
                        onClick={() => removeLocation(location.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        title="Remove Marker"
                      >
                        &times;
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {/* Map Container */}
        <div className="w-3/4">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Map;
