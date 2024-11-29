import Map from "@/components/Map";
import Sidebar from "@/components/SideBar/Sidebar";

export default function Home() {
  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="w-3/4">
        <Map />
      </div>
    </div>
  );
}
