import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

interface MobileSidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileSidebarToggle({
  isOpen,
  onToggle,
}: MobileSidebarToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`
        fixed top-4 right-4 z-50 text-white p-2 
        focus:ring-2 rounded-full focus:outline-none 
        ${
          !isOpen
            ? "bg-blue-500 hover:bg-blue-600 focus:ring-blue-400"
            : "bg-rose-500 hover:bg-rose-600 focus:ring-rose-400"
        }
      `}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
    </motion.button>
  );
}
