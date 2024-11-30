import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neshan Map",
  description:
    "simple map application using Neshan Maps API, Next.js, and Tailwind CSS",
  creator: "Mohammadreza Behzadfar (mbehzadfar.dev)",
};

const page = () => {
  return <Home />;
};

export default page;
