"use client";
import { ICoordinate } from "@/interfaces/location.interface";
import mapboxgl from "@neshan-maps-platform/mapbox-gl";
import { useCallback, useRef } from "react";

const useMarker = () => {
  const mapRef = useRef<mapboxgl.Map>();
  const markerRef = useRef<Record<number, mapboxgl.Marker>>({});

  const setMapRef = useCallback((map: mapboxgl.Map) => {
    mapRef.current = map;
  }, []);

  const destroy = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = undefined;
      markerRef.current = {};
    }
  }, []);

  const removeMarker = useCallback((id: number) => {
    if (markerRef.current[id]) {
      markerRef.current[id].remove();
      delete markerRef.current[id];
    }
  }, []);

  const addMarker = useCallback(
    ({ lat, lng }: ICoordinate, id: number) => {
      if (!mapRef.current) return;
      if (markerRef.current[id]) return;

      const popup = new mapboxgl.Popup({ offset: 25 }).setText(id.toString());

      const newMarker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapRef.current!);

      newMarker.setPopup(popup);

      newMarker.getElement().addEventListener("click", (event) => {
        event.stopPropagation();
        removeMarker(id);
      });

      markerRef.current[id] = newMarker;
    },
    [removeMarker]
  );

  const removeAllMarkers = useCallback(() => {
    Object.values(markerRef.current).forEach((marker) => marker.remove());
  }, []);

  return { setMapRef, addMarker, removeMarker, removeAllMarkers, destroy };
};

export default useMarker;
