"use client";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastContainer position="top-left" rtl bodyClassName="toast-custom" />
      {children}
    </ThemeProvider>
  );
}
