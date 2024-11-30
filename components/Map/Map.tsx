"use client";
import { useEffect, useState } from "react";

import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import { useMap } from "@/hooks/useMap";

const Map = () => {
  const [mounted, setMounted] = useState(false);

  const { setMapContainer } = useMap();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return <div ref={setMapContainer} className="w-full h-full" />;
};

export default Map;
