import localFont from "next/font/local";
import { Providers } from "@/Providers/Providers";
import "react-toastify/ReactToastify.min.css";
import type { Viewport } from "next";
import "./globals.css";

const IranYekan = localFont({
  src: [
    {
      path: "./fonts/IranyekanRegular.woff",
      weight: "100 500",
    },
    {
      path: "./fonts/IranyekanBold.woff",
      weight: "600 900",
    },
  ],
  variable: "--font-iran",
});

export const viewport: Viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="rtl" lang="en" suppressHydrationWarning>
      <body
        className={`w-full h-full ${IranYekan.variable} font-iran antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
