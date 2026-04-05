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
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && nameRef.current) {
      setTimeout(() => nameRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-md"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Accent line */}
              <div className="h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

              <div className="p-7">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Checkout</h3>
                    <p className="text-sm text-zinc-500">
                      <span className="text-zinc-300 font-medium">{productName}</span>
                      <span className="mx-1.5 text-zinc-700">&middot;</span>
                      <span className="text-white font-semibold">{currencySymbol}{price}</span>
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-zinc-600 hover:text-white transition-colors p-1 -mr-1 -mt-1"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                      <input
                        ref={nameRef}
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => { setCustomerEmail(e.target.value); setError(""); }}
                        placeholder="you@email.com"
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                      />
                    </div>
                    <p className="text-[11px] text-zinc-600 mt-1.5">
                      License key & download link will be sent here.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-red-400 text-sm bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-white hover:bg-zinc-100 text-zinc-900 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        Pay {currencySymbol}{price}
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
