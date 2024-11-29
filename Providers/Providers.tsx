"use client";

import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import { LocationProvider } from "./LocationProvider";
import { MapProvider } from "./MapProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastContainer position="top-left" rtl bodyClassName="toast-custom" />
      <LocationProvider>
        <MapProvider>{children}</MapProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}
