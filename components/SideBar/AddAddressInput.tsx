"use client";
import useLocation from "@/hooks/useLocation";
import { useState } from "react";

const AddAddressInput = () => {
  const { addLocationFromAddress } = useLocation();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await addLocationFromAddress(address);
    setAddress("");
    setLoading(false);
  };

  return (
    <div className="flex justify-between items-center mb-4 w-full">
      <input
        type="text"
        name="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        id="address"
        placeholder="استان   شهر / روستا   میدان   خیابان   کوچه پلاک"
        className="p-2 w-3/4 rounded border border-gray-300 dark:border-gray-700 focus:outline-none"
      />

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
        className="py-2 px-4 text-sm rounded bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-200 focus:outline-none disabled:opacity-50"
      >
        {loading ? "در حال ارسال" : "افزودن"}
      </button>
    </div>
  );
};

export default AddAddressInput;
