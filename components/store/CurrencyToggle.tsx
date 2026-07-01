

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export type Currency = "USD" | "INR";

interface CurrencyToggleProps {
  currency: Currency;
  onChange: (currency: Currency) => void;
}

export default function CurrencyToggle({ currency, onChange }: CurrencyToggleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-1 4k:space-x-3 8k:space-x-8 bg-white/5 p-1 4k:p-3 8k:p-8 rounded-full relative overflow-hidden ring-1 ring-white/10 shadow-inner">
      <button
        onClick={() => onChange("USD")}
        className={`relative w-16 4k:w-32 8k:w-64 py-1.5 4k:py-4 8k:py-8 text-xs 4k:text-2xl 8k:text-5xl tracking-wider uppercase font-bold rounded-full z-10 transition-all duration-300 ${
          currency === "USD" ? "text-white drop-shadow-md" : "text-gray-400 hover:text-white"
        }`}
      >
        {currency === "USD" && (
          <motion.div
            layoutId="currency-pill"
            className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] -z-10"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        USD
      </button>

      <button
        onClick={() => onChange("INR")}
        className={`relative w-16 4k:w-32 8k:w-64 py-1.5 4k:py-4 8k:py-8 text-xs 4k:text-2xl 8k:text-5xl tracking-wider uppercase font-bold rounded-full z-10 transition-all duration-300 ${
          currency === "INR" ? "text-white drop-shadow-md" : "text-gray-400 hover:text-white"
        }`}
      >
        {currency === "INR" && (
          <motion.div
            layoutId="currency-pill"
            className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] -z-10"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        INR
      </button>
    </div>
  );
}
