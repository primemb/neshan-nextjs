"use client";

import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import Map from "@/components/Map/Map";
import Sidebar from "@/components/SideBar/Sidebar";
import { useMediaQuery } from "react-responsive";
import CurrentLocationButton from "@/components/Map/CurrentLocationButton";

export default function Home() {
  const [mounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Animation variants for the sidebar
  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
    exit: { x: "-100%" },
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSidebar = () => {
    setSidebarOpen((state) => !state);
  };

  return (
    <div className="relative flex h-full bg-gray-100 dark:bg-gray-900">
      {isMobile && (
        <motion.button
          onClick={handleSidebar}
          className={`fixed top-4 right-4 z-50 text-white p-2 focus:ring-2  rounded-full focus:outline-none ${
            !sidebarOpen
              ? "bg-blue-500 hover:bg-blue-600 focus:ring-blue-400"
              : "bg-rose-500 hover:bg-rose-600 focus:ring-rose-400"
          }`}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </motion.button>
      )}

      <AnimatePresence>
        {(!isMobile || sidebarOpen) && (
          <motion.div
            key="sidebar"
            className={`pt-20 lg:pt-2 px-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 ${
              isMobile
                ? "fixed inset-0 z-40 "
                : "hidden lg:flex flex-col lg:w-1/4 h-full pb-4"
            }`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full lg:w-3/4">
        <Map />
        <CurrentLocationButton />
      </div>
    </div>
  );
}
