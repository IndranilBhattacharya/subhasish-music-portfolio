import { memo, useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Download,
  Key,
  AlertTriangle,
  Loader2,
  Shield,
  Copy,
  Check,
  ArrowLeft,
  Mail,
} from "lucide-react";

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
  details?: string;
}

const SuccessPage: NextPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasVerifiedRef = useRef(false);

  const getFingerprint = useCallback(async (): Promise<string> => {
    try {
      const FingerprintJS = (await import("@fingerprintjs/fingerprintjs")).default;
      const fp = await FingerprintJS.load();
      const fpResult = await fp.get();
      return fpResult.visitorId;
    } catch {
      const raw = [navigator.userAgent, navigator.language, screen.width, screen.height, screen.colorDepth, new Date().getTimezoneOffset()].join("|");
      let hash = 0;
      for (let i = 0; i < raw.length; i++) { hash = (hash << 5) - hash + raw.charCodeAt(i); hash |= 0; }
      return `fallback-${Math.abs(hash).toString(36)}`;
    }
  }, []);

  const triggerDownload = useCallback(async (signedUrl: string, productName: string) => {
    setDownloading(true);
    try {
      const filename = `${productName || "download"}.zip`;
      const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(signedUrl)}&filename=${encodeURIComponent(filename)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      setDownloaded(true);
    } catch (err) {
      console.error("Download error:", err);
      window.open(signedUrl, "_blank");
      setDownloaded(true);
    } finally {
      setDownloading(false);
    }
  }, []);

  const copyLicenseKey = useCallback(async () => {
    if (!result?.license_key) return;
    try {
      await navigator.clipboard.writeText(result.license_key);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = result.license_key;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [result?.license_key]);

  useEffect(() => {
    if (!router.isReady || hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;

    const {
      razorpay_payment_id,
      razorpay_payment_link_id,
      razorpay_payment_link_reference_id,
      razorpay_payment_link_status,
      razorpay_signature,
    } = router.query;

    if (!razorpay_payment_id) {
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

        // Auto-download after user sees the success screen
        if (data.download_url && data.product_name) {
          setTimeout(() => {
            triggerDownload(data.download_url!, data.product_name!);
          }, 2000);
        }
      } catch (err: any) {
        setStatus("error");
        setResult({ success: false, error: err.message || "Unexpected error during verification." });
      }
    };

    verifyPayment();
  }, [router.isReady]);

  const handleManualDownload = () => {
    if (result?.download_url && result?.product_name) {
      triggerDownload(result.download_url, result.product_name);
    }
  };

  return (
    <motion.div
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      className="relative min-h-screen w-full flex flex-col items-center"
    >
      <Head>
        <title>Order Confirmed | Subhasish Music</title>
        <meta name="robots" content="noindex" />
      </Head>

      <ToolBar />

      <main className="flex-1 flex items-center justify-center w-[92vw] sm:w-[85vw] md:w-[75vw] lg:w-[55vw] xl:w-[48vw] 2xl:w-[42vw] px-4 pt-28 pb-32 z-10">
        {/* VERIFYING */}
        {status === "verifying" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex flex-col items-center gap-5"
          >
            <Loader2 size={48} className="text-indigo-400 animate-spin" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Confirming your payment...
            </h1>
            <p className="text-gray-500 text-base max-w-sm">
              We&apos;re verifying the transaction and generating your license key. This will only take a moment.
            </p>
          </motion.div>
        )}

        {/* SUCCESS */}
        {status === "success" && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 mb-5"
              >
                <CheckCircle size={32} className="text-green-400" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Order Confirmed</h1>
              <p className="text-gray-500 text-base">
                Your copy of <span className="text-white font-medium">{result.product_name}</span> is ready.
              </p>
            </div>

            {/* Card */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden">
              {/* License Key Section */}
              <div className="p-6 sm:p-8 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <Key size={16} className="text-zinc-500" />
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.15em]">License Key</span>
                  </div>
                  <button
                    onClick={copyLicenseKey}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-2.5 py-1 rounded-md hover:bg-zinc-800"
                  >
                    {copied ? <><Check size={12} className="text-green-400" /><span className="text-green-400">Copied</span></> : <><Copy size={12} />Copy</>}
                  </button>
                </div>
                <div
                  onClick={copyLicenseKey}
                  className="bg-zinc-950 rounded-lg px-4 py-3 font-mono text-sm sm:text-base text-emerald-400 break-all cursor-pointer border border-zinc-800 hover:border-zinc-700 transition-colors select-all"
                >
                  {result.license_key}
                </div>
                <p className="text-xs text-zinc-600 mt-2.5">
                  This is your permanent license key. Keep it safe — you&apos;ll need it for support requests.
                </p>
              </div>

              {/* Device Info */}
              <div className="px-6 sm:px-8 py-5 border-b border-zinc-800 flex items-start gap-3">
                <Shield size={16} className="text-zinc-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-zinc-400 font-medium">Locked to this device</p>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    You can re-download this product anytime from the store on this device.
                  </p>
                </div>
              </div>

              {/* Email Info */}
              {result.customer_email && (
                <div className="px-6 sm:px-8 py-5 border-b border-zinc-800 flex items-start gap-3">
                  <Mail size={16} className="text-zinc-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-zinc-400 font-medium">Confirmation sent</p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      License key and download link emailed to <span className="text-zinc-400">{result.customer_email}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Download */}
              <div className="p-6 sm:p-8">
                <button
                  onClick={handleManualDownload}
                  disabled={downloading}
                  className="w-full py-3.5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-wait"
                >
                  {downloading ? (
                    <><Loader2 size={18} className="animate-spin" />Downloading...</>
                  ) : (
                    <><Download size={18} />{downloaded ? "Download Again" : "Download Now"}</>
                  )}
                </button>
                {downloaded && !downloading && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-emerald-500/60 text-xs mt-3"
                  >
                    Download complete — check your downloads folder.
                  </motion.p>
                )}
              </div>
            </div>

            {/* Back to store */}
            <div className="text-center mt-8">
              <button
                onClick={() => router.push("/samples-store")}
                className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm font-medium transition-colors"
              >
                <ArrowLeft size={14} />
                Back to The Vault
              </button>
            </div>
          </motion.div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex flex-col items-center gap-5 max-w-md"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20">
              <AlertTriangle size={32} className="text-red-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Verification Failed
            </h1>
            <p className="text-gray-500 text-base">
              {result?.error || "We couldn't verify your payment. If money was deducted, please contact support."}
            </p>
            {result?.details && (
              <p className="text-red-400/50 text-xs font-mono bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-2 max-w-full break-all">
                {result.details}
              </p>
            )}
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => router.push("/samples-store")}
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft size={14} />
                Store
              </button>
              <button
                onClick={() => { hasVerifiedRef.current = false; window.location.reload(); }}
                className="px-5 py-2.5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-lg text-sm font-medium transition-colors"
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
