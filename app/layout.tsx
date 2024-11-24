import localFont from "next/font/local";
import { Providers } from "@/components/ThemeProvider";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

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
