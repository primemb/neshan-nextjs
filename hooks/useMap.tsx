"use client";

import { ICoordinate } from "@/interfaces/location.interface";
import mapboxgl from "@neshan-maps-platform/mapbox-gl";
import { useCallback, useEffect, useRef } from "react";
import useLocation from "./useLocation";

interface IUseMapProps {
  isDarkMode: boolean;
  mapContainer: HTMLDivElement | null;
}

const useMap = ({ isDarkMode, mapContainer }: IUseMapProps) => {
  const { locations, getLocations, addLocation, removeLocation } =
    useLocation();
  const mapRef = useRef<mapboxgl.Map>();
  const markerRef = useRef<Record<number, mapboxgl.Marker>>({});

  const destroy = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = undefined;
      markerRef.current = {};
    }
  }, []);

  const removeMarker = useCallback(
    async (id: number) => {
      if (markerRef.current[id]) {
        markerRef.current[id].remove();
        await removeLocation(id);
        delete markerRef.current[id];
      }
    },
    [removeLocation]
  );

  const addMarker = useCallback(
    ({ lat, lng }: ICoordinate, id: number) => {
      if (!mapRef.current) return;
      if (markerRef.current[id]) return;

      const newMarker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapRef.current!);

      newMarker.getElement().addEventListener("click", (event) => {
        event.stopPropagation();
        removeMarker(id);
      });

      markerRef.current[id] = newMarker;
    },
    [removeMarker]
  );

  useEffect(() => {
    if (!mapContainer) return;
    console.log("salam");
    mapRef.current = new mapboxgl.Map({
      container: mapContainer,
      mapType: isDarkMode
        ? mapboxgl.Map.mapTypes.neshanVectorNight
        : mapboxgl.Map.mapTypes.neshanVector,
      mapKey: process.env.NEXT_PUBLIC_NESHAN_MAP_KEY as string,
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

    mapRef.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;
      await addLocation({ lat: lat, lng: lng });
    });

    mapRef.current.on("load", () => {
      getLocations();
    });

    return () => destroy();
  }, [mapContainer, isDarkMode, destroy, addLocation, getLocations]);

  useEffect(() => {
    if (mapRef.current) {
      for (const location of locations) {
        if (!markerRef.current[location.id]) {
          addMarker(
            { lat: location.latitude, lng: location.longitude },
            location.id
          );
        }
      }
    }
  }, [locations, mapRef, addMarker]);

  const removeAllMarkers = useCallback(() => {
    Object.values(markerRef.current).forEach((marker) => marker.remove());
  }, []);

  return {
    addMarker,
    removeMarker,
    removeAllMarkers,
    destroy,
  };
};

export default useMap;
