import { memo, useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { CheckCircle, Download, Key, AlertTriangle, Loader2, Shield } from "lucide-react";

import ToolBar from "../../components/Utilities/ToolBar";
import BottomNavBar from "../../components/Utilities/BottomNavBar";

interface VerifyResult {
  success: boolean;
  license_key?: string;
  download_url?: string;
  product_name?: string;
  customer_email?: string;
  already_processed?: boolean;
  error?: string;
}

const SuccessPage: NextPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const getFingerprint = useCallback(async (): Promise<string> => {
    try {
      // Use FingerprintJS Pro or the open-source version
      const FingerprintJS = (await import("@fingerprintjs/fingerprintjs")).default;
      const fp = await FingerprintJS.load();
      const fpResult = await fp.get();
      return fpResult.visitorId;
    } catch {
      // Fallback: generate a simple device identifier from navigator properties
      const raw = [
        navigator.userAgent,
        navigator.language,
        screen.width,
        screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
      ].join("|");

      // Simple hash
      let hash = 0;
      for (let i = 0; i < raw.length; i++) {
        const char = raw.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
      }
      return `fallback-${Math.abs(hash).toString(36)}`;
    }
  }, []);

  const triggerDownload = useCallback((url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const {
      razorpay_payment_id,
      razorpay_payment_link_id,
      razorpay_payment_link_reference_id,
      razorpay_payment_link_status,
      razorpay_signature,
      session_id, // For Stripe
    } = router.query;

    // Must have Razorpay or Stripe params
    if (!razorpay_payment_id && !session_id) {
      setStatus("error");
      setResult({ success: false, error: "No payment information found in URL." });
      return;
    }

    const verifyPayment = async () => {
      try {
        const fingerprint = await getFingerprint();

        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id,
            razorpay_payment_link_id,
            razorpay_payment_link_reference_id: razorpay_payment_link_reference_id || "",
            razorpay_payment_link_status,
            razorpay_signature,
            session_id,
            fingerprint,
          }),
        });

        const data: VerifyResult = await res.json();

        if (!res.ok || !data.success) {
          setStatus("error");
          setResult(data);
          return;
        }

        setStatus("success");
        setResult(data);

        // Auto-download the file
        if (data.download_url) {
          // Small delay so the user sees the success screen first
          setTimeout(() => {
            triggerDownload(
              data.download_url!,
              `${data.product_name || "download"}.zip`
            );
          }, 2000);
        }
      } catch (err: any) {
        setStatus("error");
        setResult({
          success: false,
          error: err.message || "Unexpected error during verification.",
        });
      }
    };

    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query]);

  const handleManualDownload = () => {
    if (result?.download_url) {
      triggerDownload(
        result.download_url,
        `${result.product_name || "download"}.zip`
      );
    }
  };

  const pageVariants = {
    initial: { opacity: 0 },
    stable: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      exit="exit"
      animate="stable"
      initial="initial"
      variants={pageVariants}
      className="relative min-h-screen w-full flex flex-col items-center"
    >
      <Head>
        <title>Payment Confirmation | Subhasish Music</title>
        <meta name="robots" content="noindex" />
      </Head>

      <ToolBar />

      <main className="flex-1 flex items-center justify-center w-[90vw] md:w-[85vw] lg:w-[60vw] 2xl:w-[50vw] px-4 pt-28 pb-32 z-10">
        {/* ─── VERIFYING STATE ────────────────────────────────────── */}
        {status === "verifying" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex flex-col items-center gap-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[60px]" />
              <Loader2
                size={64}
                className="text-indigo-400 animate-spin relative z-10"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Verifying Payment...
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              Hang tight — we're confirming your payment and generating your
              license key.
            </p>
          </motion.div>
        )}

        {/* ─── SUCCESS STATE ──────────────────────────────────────── */}
        {status === "success" && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-2xl"
          >
            {/* Card */}
            <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Glow */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-500/15 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

              {/* Success Icon */}
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                    delay: 0.2,
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-[40px]" />
                  <CheckCircle
                    size={80}
                    className="text-green-400 relative z-10"
                  />
                </motion.div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-3">
                Payment Successful!
              </h1>
              <p className="text-gray-400 text-center text-lg mb-10">
                Thank you for purchasing{" "}
                <span className="text-white font-semibold">
                  {result.product_name}
                </span>
              </p>

              {/* License Key */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Key size={20} className="text-indigo-400" />
                  <span className="text-sm font-bold text-indigo-300 uppercase tracking-widest">
                    Your License Key
                  </span>
                </div>
                <div className="bg-black/50 rounded-xl px-5 py-4 font-mono text-lg text-green-300 break-all select-all cursor-pointer border border-white/5">
                  {result.license_key}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Save this key — it's your proof of purchase.
                </p>
              </motion.div>

              {/* Device Lock Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={20} className="text-indigo-400" />
                  <span className="text-sm font-bold text-indigo-300 uppercase tracking-widest">
                    Device Locked
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  This purchase is now linked to your current browser/device.
                  You can re-download anytime from this device using your
                  license key on the store page.
                </p>
              </motion.div>

              {/* Download Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={handleManualDownload}
                  className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:-translate-y-0.5"
                >
                  <Download size={22} />
                  {downloaded
                    ? "Download Again"
                    : "Download Now"}
                </button>
                {downloaded && (
                  <p className="text-center text-green-400/70 text-sm mt-3">
                    ✓ Your download has started automatically.
                  </p>
                )}
              </motion.div>

              {/* Email Note */}
              {result.customer_email && (
                <p className="text-center text-gray-500 text-sm mt-6">
                  A confirmation email with your license key and download link
                  will be sent to{" "}
                  <span className="text-gray-300">
                    {result.customer_email}
                  </span>
                </p>
              )}
            </div>

            {/* Back to store */}
            <div className="text-center mt-8">
              <button
                onClick={() => router.push("/samples-store")}
                className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-colors"
              >
                ← Back to The Vault
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── ERROR STATE ────────────────────────────────────────── */}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex flex-col items-center gap-6 max-w-lg"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-[60px]" />
              <AlertTriangle
                size={64}
                className="text-red-400 relative z-10"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Verification Failed
            </h1>
            <p className="text-gray-400 text-lg">
              {result?.error ||
                "We couldn't verify your payment. If money was deducted, please contact support."}
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => router.push("/samples-store")}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-semibold transition-colors"
              >
                Back to Store
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}
      </main>

      <BottomNavBar />
    </motion.div>
  );
};

export default memo(SuccessPage);
