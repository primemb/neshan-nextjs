"use client";

import useLocation from "@/hooks/useLocation";
import { useMap } from "@/hooks/useMap";
import ThemeSwitch from "../Themeswitch";
import AddAddressInput from "./AddAddressInput";
import { useTheme } from "next-themes";

const Sidebar = () => {
  const { locations } = useLocation();
  const { removeMarker, addDirection } = useMap();

  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <div className="w-1/4 p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 overflow-auto">
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
      {locations.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          هیچ مکانی انتخاب نشده است
        </p>
      ) : (
        <ul>
          {locations.map((location, index) => {
            return (
              <li
                key={index}
                className="mb-2 p-2 bg-gray-200 dark:bg-gray-700 rounded"
              >
                <div className="flex justify-between items-center">
                  <span>
                    {location.address?.formatted_address || "ادرس یافت نشد"}
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
      <button
        className="w-full p-2 mt-4 bg-blue-500 text-white rounded focus:outline"
        onClick={addDirection}
      >
        مسیر یابی
      </button>
    </div>
  );
};

export default Sidebar;
