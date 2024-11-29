"use client";

import useLocation from "@/hooks/useLocation";
import { ICoordinate } from "@/interfaces/location.interface";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapContext } from "@/context/MapContext";

interface IMapProviderProps {
  children: React.ReactNode;
}

export const MapProvider = ({ children }: IMapProviderProps) => {
  const [mapboxglModule, setMapboxglModule] = useState<
    typeof import("@neshan-maps-platform/mapbox-gl") | null
  >(null);
  const { locations, getLocations, addLocation, removeLocation } =
    useLocation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map>();
  const markerRef = useRef<Record<number, mapboxgl.Marker>>({});

  useEffect(() => {
    if (mapboxglModule) return;
    import("@neshan-maps-platform/mapbox-gl").then((module) => {
      setMapboxglModule(module);
    });
  }, [mapboxglModule]);

  const destroy = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = undefined;
    }
    markerRef.current = {};
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
      if (!mapboxglModule) return;

      const newMarker = new mapboxglModule.Marker()
        .setLngLat([lng, lat])
        .addTo(mapRef.current!);

      newMarker.getElement().addEventListener("click", (event) => {
        event.stopPropagation();
        removeMarker(id);
      });

      markerRef.current[id] = newMarker;
    },
    [removeMarker, mapboxglModule]
  );

  useEffect(() => {
    if (!mapContainer) return;
    if (!mapboxglModule) return;

    mapRef.current = new mapboxglModule.Map({
      container: mapContainer,
      mapType: isDarkMode
        ? mapboxglModule.Map.mapTypes.neshanVectorNight
        : mapboxglModule.Map.mapTypes.neshanVector,
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
      await addLocation({ lat, lng });
    });

    mapRef.current.on("load", () => {
      getLocations();
    });

    return () => destroy();
  }, [
    mapContainer,
    mapboxglModule,
    isDarkMode,
    destroy,
    addLocation,
    getLocations,
  ]);

  useEffect(() => {
    if (mapRef.current) {
      locations.forEach((location) => {
        if (!markerRef.current[location.id]) {
          addMarker(
            { lat: location.latitude, lng: location.longitude },
            location.id
          );
        }
      });
    }
  }, [locations, addMarker]);

  const removeAllMarkers = useCallback(() => {
    Object.values(markerRef.current).forEach((marker) => marker.remove());
    markerRef.current = {};
  }, []);

  return (
    <MapContext.Provider
      value={{
        mapRef,
        markerRef,
        addMarker,
        removeMarker,
        removeAllMarkers,
        destroy,
        setMapContainer,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
