"use client";
import { useState } from "react";

interface IAddressInputProps {
  onSumbit: (address: string) => Promise<void>;
}

const AddAddressInput = ({ onSumbit }: IAddressInputProps) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onSumbit(address);
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
        className="p-2 rounded bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-200 focus:outline-none disabled:opacity-50"
      >
        {loading ? "در حال ارسال" : "افزودن"}
      </button>
    </div>
  );
};

export default AddAddressInput;
