import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, ArrowRight, Loader2 } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId: string;
  currency: "USD" | "INR";
  price: number;
  currencySymbol: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  productName,
  productId,
  currency,
  price,
  currencySymbol,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && emailRef.current) {
      setTimeout(() => emailRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!customerEmail || !customerEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          currency,
          customer_name: customerName,
          customer_email: customerEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-md"
          >
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              {/* Glow */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/15 rounded-full blur-[80px] pointer-events-none" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <h3 className="text-xl font-bold text-white mb-1">
                Checkout
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Purchasing{" "}
                <span className="text-indigo-300 font-semibold">{productName}</span>
                {" "}for{" "}
                <span className="text-white font-bold">
                  {currencySymbol}{price}
                </span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      ref={emailRef}
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="you@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Your license key & download link will be emailed here.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Proceed to Pay {currencySymbol}{price}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
