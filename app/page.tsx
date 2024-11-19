"use client";
import dynamic from "next/dynamic";
const DynamicMap = dynamic(() => import("@/components/Map"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Home() {
  return <DynamicMap />;
}
