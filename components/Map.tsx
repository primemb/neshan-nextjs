"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import mapboxgl from "@neshan-maps-platform/mapbox-gl";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";

import ThemeSwitch from "./Themeswitch";
import useLocation from "@/hooks/useLocation";
import AddAddressInput from "./AddAddressInput";
import { toast } from "react-toastify";
import useMap from "@/hooks/useMap";

const Map = () => {
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const markerRef = useRef<Record<number, mapboxgl.Marker>>({});

  const { locations, addLocationFromAddress, drawDirection } = useLocation();

  const isDarkMode = theme === "dark";
  const { removeMarker } = useMap({ isDarkMode, mapContainer });

  const addNewAddressHandler = async (address: string) => {
    const newLocation = await addLocationFromAddress(address);
    if ("error" in newLocation) {
      toast.error(newLocation.error);
    } else {
      // const newMarker = new mapboxgl.Marker()
      //   .setLngLat([newLocation.longitude, newLocation.latitude])
      //   .addTo(mapRef.current!);
      // markerRef.current[newLocation.id] = newMarker;
      // newMarker.getElement().addEventListener("click", (event) => {
      //   event.stopPropagation();
      //   newMarker.remove();
      //   removeLocation(newLocation.id);
      // });
    }
  };

  const handleDirection = async () => {
    const { pointsObj, routeObj } = await drawDirection(
      locations.map((location) => ({
        lat: location.latitude,
        lng: location.longitude,
      }))
    );
    console.log(pointsObj, routeObj);
    // if (mapRef.current) {
    //   mapRef.current.addSource("route", {
    //     type: "geojson",
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     data: routeObj as any,
    //   });
    //   mapRef.current.addSource("points1", {
    //     type: "geojson",
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     data: pointsObj as any,
    //   });

    //   mapRef.current.addLayer({
    //     id: "route-line",
    //     type: "line",
    //     source: "route",
    //     layout: {
    //       "line-join": "round",
    //       "line-cap": "round",
    //     },
    //     paint: {
    //       "line-color": "#250ECD",
    //       "line-width": 9,
    //     },
    //   });

    //   mapRef.current.addLayer({
    //     id: "points1",
    //     type: "circle",
    //     source: "points1",
    //     paint: {
    //       "circle-color": "#9fbef9",
    //       "circle-stroke-color": "#FFFFFF",
    //       "circle-stroke-width": 2,
    //       "circle-radius": 5,
    //     },
    //   });
    // }
  };

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
            <h2 className="text-2xl font-bold">لیست آدرس ها</h2>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
              title="Toggle Dark Mode"
            >
              <ThemeSwitch />
            </button>
          </div>
          <AddAddressInput onSumbit={addNewAddressHandler} />
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
                        onClick={() => {
                          removeMarker(location.id);
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
          <button onClick={handleDirection}>Test</button>
        </div>
        {/* Map Container */}
        <div className="w-3/4">
          <div ref={setMapContainer} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Map;
