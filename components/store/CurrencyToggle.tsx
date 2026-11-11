

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
    <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-full relative overflow-hidden ring-1 ring-white/10 shadow-inner">
      <button
        onClick={() => onChange("USD")}
        className={`relative w-16 py-1.5 text-xs tracking-wider uppercase font-bold rounded-full z-10 transition-all duration-300 ${
          currency === "USD" ? "text-white drop-shadow-md" : "text-gray-400 hover:text-white"
        }`}
      >
        {currency === "USD" && (
          <motion.div
            layoutId="currency-pill"
            className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] -z-10"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        USD
      </button>

      <button
        onClick={() => onChange("INR")}
        className={`relative w-16 py-1.5 text-xs tracking-wider uppercase font-bold rounded-full z-10 transition-all duration-300 ${
          currency === "INR" ? "text-white drop-shadow-md" : "text-gray-400 hover:text-white"
        }`}
      >
        {currency === "INR" && (
          <motion.div
            layoutId="currency-pill"
            className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] -z-10"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        INR
      </button>
    </div>
  );
}
