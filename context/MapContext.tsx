"use client";

import { ICoordinate } from "@/interfaces/location.interface";
import { createContext } from "react";

interface IMapContext {
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>;
  markerRef: React.MutableRefObject<Record<number, mapboxgl.Marker>>;
  addMarker: (coordinate: ICoordinate, id: number) => void;
  removeMarker: (id: number) => void;
  removeAllMarkers: () => void;
  setMapContainer: (container: HTMLDivElement | null) => void;
  addDirection: () => Promise<void>;
  destroy: () => void;
}

export const MapContext = createContext<IMapContext | undefined>(undefined);
