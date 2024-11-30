"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import useLocation from "@/hooks/useLocation";
import { ICoordinate } from "@/interfaces/location.interface";
import { MapContext } from "@/context/MapContext";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { createCustomMarker } from "@/libs/util";
import { toast } from "react-toastify";

interface IMapProviderProps {
  children: React.ReactNode;
}

export const MapProvider = ({ children }: IMapProviderProps) => {
  const [mapboxglModule, setMapboxglModule] = useState<
    typeof import("@neshan-maps-platform/mapbox-gl") | null
  >(null);

  const {
    locations,
    getLocations,
    addLocation,
    removeLocation,
    directionInfo,
  } = useLocation();

  const {
    location: currentLocation,
    setManualLocation: setCurrentLocationManual,
    isLoading: isCurrentLocationLoading,
  } = useCurrentLocation();

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map>();
  const [mapRefState, setMapRefState] = useState<mapboxgl.Map>();
  const markerRef = useRef<Record<number, mapboxgl.Marker>>({});
  const currentLocationMarkerRef = useRef<mapboxgl.Marker>();

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
    setMapRefState(undefined);
    markerRef.current = {};
    currentLocationMarkerRef.current = undefined;
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

  const addDirection = useCallback(async () => {
    if (locations.length < 3) {
      toast.error("نقاط بیشتری بر روی نقشه انتخاب کنید");
      return;
    }
    let startLocation: ICoordinate | null = null;
    if (currentLocation) {
      startLocation = {
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
      };
    }
    const { pointsObj, routeObj } = await directionInfo(
      startLocation,
      locations.map((location) => ({
        lat: location.latitude,
        lng: location.longitude,
      }))
    );

    if (mapRef.current) {
      if (mapRef.current.getLayer("route-line")) {
        mapRef.current.removeLayer("route-line");
        mapRef.current.removeSource("route");
      }

      if (mapRef.current.getLayer("points1")) {
        mapRef.current.removeLayer("points1");
        mapRef.current.removeSource("points1");
      }

      mapRef.current.addSource("route", {
        type: "geojson",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: routeObj as any,
      });

      mapRef.current.addSource("points1", {
        type: "geojson",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: pointsObj as any,
      });

      mapRef.current.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#250ECD",
          "line-width": 9,
        },
      });

      mapRef.current.addLayer({
        id: "points1",
        type: "circle",
        source: "points1",
        paint: {
          "circle-color": "#9fbef9",
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-width": 2,
          "circle-radius": 5,
        },
      });
    }
  }, [locations, directionInfo, currentLocation]);

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

    const newMap = new mapboxglModule.Map({
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

    mapRef.current = newMap;

    setMapRefState(newMap);

    mapRef.current.on("load", () => {
      getLocations();
    });

    return () => destroy();
  }, [mapContainer, mapboxglModule, isDarkMode, destroy, getLocations]);

  useEffect(() => {
    const handleClick = async (
      e: mapboxgl.MapMouseEvent & mapboxgl.EventData
    ) => {
      const { lng, lat } = e.lngLat;
      if (isCurrentLocationLoading) {
        setCurrentLocationManual({
          latitude: lat,
          longitude: lng,
          accuracy: 0,
        });
      } else {
        await addLocation({ lat, lng });
      }
    };

    if (mapRefState) {
      mapRefState.on("click", handleClick);
    }

    return () => {
      if (mapRefState) {
        mapRefState.off("click", handleClick);
      }
    };
  }, [
    mapRefState,
    isCurrentLocationLoading,
    setCurrentLocationManual,
    addLocation,
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

  const addCurrentLocationMarker = useCallback(() => {
    if (currentLocation && mapRef.current) {
      const customMark = createCustomMarker();

      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.remove();
      }

      currentLocationMarkerRef.current = new mapboxglModule!.Marker(customMark)
        .setLngLat([currentLocation.longitude, currentLocation.latitude])
        .addTo(mapRef.current);

      mapRef.current.jumpTo({
        center: [currentLocation.longitude, currentLocation.latitude],
      });
    }
  }, [currentLocation, mapboxglModule]);

  useEffect(() => {
    addCurrentLocationMarker();
  }, [currentLocation, mapRef, addCurrentLocationMarker]);

  useEffect(() => {
    if (mapRef.current && mapboxglModule && currentLocation) {
      addCurrentLocationMarker();
    }
  }, [isDarkMode, mapboxglModule, currentLocation, addCurrentLocationMarker]);

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
        addDirection,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
