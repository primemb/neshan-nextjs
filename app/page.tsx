"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";

import Map from "@/components/Map/Map";
import Sidebar from "@/components/SideBar/Sidebar";
import CurrentLocationButton from "@/components/Map/CurrentLocationButton";
import MobileSidebarToggle from "@/components/SideBar/MobileSidebarToggle";

export default function Home() {
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Extracted sidebar variants to improve readability
  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
    exit: { x: "-100%" },
  };

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  const renderSidebar = () => {
    if (!isMobile || sidebarOpen) {
      return (
        <motion.div
          key="sidebar"
          className={`
            pt-20 lg:pt-2 px-4 
            bg-white dark:bg-gray-800 
            text-gray-800 dark:text-gray-200 
            ${
              isMobile
                ? "fixed inset-0 z-40"
                : "hidden lg:flex flex-col lg:w-1/4 h-full pb-4"
            }
          `}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={sidebarVariants}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Sidebar />
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="relative flex h-full bg-gray-100 dark:bg-gray-900">
      {isMobile && (
        <MobileSidebarToggle isOpen={sidebarOpen} onToggle={toggleSidebar} />
      )}

      <AnimatePresence>{renderSidebar()}</AnimatePresence>

      <div className="relative w-full lg:w-3/4">
        <Map />
        <CurrentLocationButton />
      </div>
    </div>
  );
}
