"use client";
import useLocation from "@/hooks/useLocation";
import { useState } from "react";
import { toast } from "react-toastify";

const AddAddressInput = () => {
  const { addLocationFromAddress } = useLocation();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await addLocationFromAddress(address);
      if ("error" in response) {
        toast.error("مشکلی پیش آمد مجدد امتحان کنید");
      } else {
        setAddress("");
      }
    } catch (error) {
      console.log(error);
      toast.error("مشکلی پیش آمد مجدد امتحان کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 xl:flex-row justify-between items-center mb-4 w-full">
      <input
        type="text"
        name="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        id="address"
        placeholder="استان   شهر / روستا   میدان   خیابان   کوچه پلاک"
        className="p-2 w-full xl:w-3/4 rounded border border-gray-300 dark:border-gray-700 focus:outline-none"
      />

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
        className="py-2 px-4 w-full xl:w-1/4 text-sm rounded bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-200 focus:outline-none disabled:opacity-50"
      >
        {loading ? "در حال ارسال" : "افزودن"}
      </button>
    </div>
  );
};

export default AddAddressInput;
