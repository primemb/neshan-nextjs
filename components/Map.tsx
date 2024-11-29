"use client";
import { useEffect, useState } from "react";

import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import { useMap } from "@/hooks/useMap";

const Map = () => {
  const [mounted, setMounted] = useState(false);

  const { setMapContainer } = useMap();

  // const handleDirection = async () => {
  //   const { pointsObj, routeObj } = await drawDirection(
  //     locations.map((location) => ({
  //       lat: location.latitude,
  //       lng: location.longitude,
  //     }))
  //   );
  //   console.log(pointsObj, routeObj);
  //   // if (mapRef.current) {
  //   //   mapRef.current.addSource("route", {
  //   //     type: "geojson",
  //   //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   //     data: routeObj as any,
  //   //   });
  //   //   mapRef.current.addSource("points1", {
  //   //     type: "geojson",
  //   //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   //     data: pointsObj as any,
  //   //   });

  //   //   mapRef.current.addLayer({
  //   //     id: "route-line",
  //   //     type: "line",
  //   //     source: "route",
  //   //     layout: {
  //   //       "line-join": "round",
  //   //       "line-cap": "round",
  //   //     },
  //   //     paint: {
  //   //       "line-color": "#250ECD",
  //   //       "line-width": 9,
  //   //     },
  //   //   });

  //   //   mapRef.current.addLayer({
  //   //     id: "points1",
  //   //     type: "circle",
  //   //     source: "points1",
  //   //     paint: {
  //   //       "circle-color": "#9fbef9",
  //   //       "circle-stroke-color": "#FFFFFF",
  //   //       "circle-stroke-width": 2,
  //   //       "circle-radius": 5,
  //   //     },
  //   //   });
  //   // }
  // };

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return <div ref={setMapContainer} className="w-full h-full" />;
};

export default Map;
