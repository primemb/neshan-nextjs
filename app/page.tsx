import Map from "@/components/Map";
import Sidebar from "@/components/SideBar/Sidebar";

export default function Home() {
  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-900">
      <div className="hidden lg:flex flex-col lg:w-1/4 h-full p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <Sidebar />
      </div>
      <div className="w-full lg:w-3/4">
        <Map />
      </div>
    </div>
  );
}
