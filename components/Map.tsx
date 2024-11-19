"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import mapboxgl from "@neshan-maps-platform/mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";

import ThemeSwitch from "./Themeswitch";

const Map = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const mapRef = useRef<mapboxgl.Map>();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  const isDarkMode = theme === "dark";

  useEffect(() => {
    const neshanMap = mapRef.current;
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        mapType: isDarkMode
          ? mapboxgl.Map.mapTypes.neshanVectorNight
          : mapboxgl.Map.mapTypes.neshanVector,
        mapKey: process.env.NEXT_PUBLIC_NESHAN_KEY as string,
        zoom: 11,
        pitch: 0,
        center: [51.389, 35.6892],
        minZoom: 2,
        maxZoom: 21,
        trackResize: true,
        poi: true,
        traffic: false,

        mapTypeControllerOptions: {
          show: true,
          position: "bottom-left",
        },
      }) as unknown as mapboxgl.Map;
      mapRef.current.on("click", handleMapClick);
    }
    return () => neshanMap?.remove();
  }, [isDarkMode, mounted]);

  useEffect(() => setMounted(true), []);

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? "light" : "dark");

    setTimeout(() => {
      markers.forEach((markerData) => {
        markerData.addTo(mapRef.current as mapboxgl.Map);
      });
    }, 1000);
  };

  const handleMapClick = (
    event: mapboxgl.MapMouseEvent & mapboxgl.EventData
  ) => {
    if (mapRef.current) {
      // Get the clicked coordinates
      const { lng, lat } = event.lngLat;
      // Create a new marker
      const newMarker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
      newMarker.getElement().addEventListener("click", (event) => {
        // Prevent map click event from firing
        event.stopPropagation();
        newMarker.remove();
        setMarkers((currentMarkers) =>
          currentMarkers.filter((m) => m !== newMarker)
        );
      });
      // Update the state to include the new marker
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    }
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
          {markers.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No markers added. Click on the map to add a marker.
            </p>
          ) : (
            <ul>
              {markers.map((marker, index) => {
                const { lng, lat } = marker.getLngLat();
                return (
                  <li
                    key={index}
                    className="mb-2 p-2 bg-gray-200 dark:bg-gray-700 rounded"
                  >
                    <div className="flex justify-between items-center">
                      <span>
                        Marker {index + 1}: ({lng.toFixed(4)}, {lat.toFixed(4)})
                      </span>
                      <button
                        onClick={() => {
                          if (
                            window.confirm("Do you want to remove this marker?")
                          ) {
                            marker.remove();
                            setMarkers((currentMarkers) =>
                              currentMarkers.filter((m) => m !== marker)
                            );
                          }
                        }}
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
