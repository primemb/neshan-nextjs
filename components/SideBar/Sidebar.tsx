"use client";
import { useTheme } from "next-themes";
import { useState } from "react";

import useLocation from "@/hooks/useLocation";
import { useMap } from "@/hooks/useMap";
import AddAddressInput from "./AddAddressInput";
import ThemeSwitch from "../Themeswitch";
import { toast } from "react-toastify";

const Sidebar = () => {
  const [loadingDirections, setLoadingDirections] = useState(false);
  const { locations } = useLocation();
  const { removeMarker, addDirection } = useMap();

  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const handleAddDirection = async () => {
    try {
      setLoadingDirections(true);
      await addDirection();
    } catch (error) {
      console.log(error);
      toast.error("مشکلی پیش آمد مجدد امتحان کنید");
    } finally {
      setLoadingDirections(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">لیست آدرس ها</h2>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
          title="Toggle Dark Mode"
        >
          <ThemeSwitch />
        </button>
      </div>
      <AddAddressInput />
      <div id="bad-height" className="flex flex-grow flex-col">
        <div className="overflow-y-auto flex flex-grow w-full">
          {locations.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              هیچ مکانی انتخاب نشده است
            </p>
          ) : (
            <ul className="w-full">
              {locations.map((location, index) => {
                return (
                  <li
                    key={index}
                    className="mb-2 p-2 bg-gray-200 dark:bg-gray-700 rounded"
                  >
                    <div className="flex justify-between items-center">
                      <span>
                        {location.address?.formatted_address || "آدرس یافت نشد"}
                      </span>
                      <button
                        onClick={() => {
                          removeMarker(location.id);
                        }}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        title="Remove Marker"
                      >
                        &times;
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <button
          disabled={loadingDirections}
          className="w-full p-2 mt-4 bg-blue-500 text-white rounded focus:outline disabled:opacity-50"
          onClick={handleAddDirection}
        >
          مسیر یابی
        </button>
      </div>
    </>
  );
};

export default Sidebar;
