"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";

export default function LoginModal({ isOpen, onClose }) {
  const [step, setStep] = useState("mobile"); // 'mobile' or 'otp'
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const { sendOTP, login } = useAuth();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    const result = await sendOTP(mobile);

    if (result.success) {
      setStep("otp");
      setOtpSent(true);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    // Name and email are no longer collected during OTP verification
    // They will be collected/updated during the order process
    const result = await login(mobile, otp, "", "");

    if (result.success) {
      onClose();
      resetForm();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setStep("mobile");
    setMobile("");
    setOtp("");
    setError("");
    setOtpSent(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-noir/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-noir-light border border-rose/20 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden glass-strong"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose/10 blur-[50px] -mr-16 -mt-16 rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/10 blur-[50px] -ml-16 -mb-16 rounded-full" />

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2
                    className="text-2xl font-bold bg-gradient-to-r from-cream to-rose bg-clip-text text-transparent"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step === "mobile" ? "Welcome Back" : "Verify Identity"}
                  </h2>
                  <p className="text-cream-muted text-sm mt-1">
                    {step === "mobile"
                      ? "Sign in to your account"
                      : `Enter OTP sent to ${mobile}`}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full bg-cream/5 flex items-center justify-center text-cream-muted hover:text-rose hover:bg-rose/10 transition-all duration-300"
                >
                  <span className="material-symbols-outlined text-xl">
                    close
                  </span>
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">
                    error
                  </span>
                  {error}
                </motion.div>
              )}

              {step === "mobile" ? (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-cream/50 uppercase tracking-widest ml-1">
                      Mobile Number
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-rose/40 group-focus-within:text-rose transition-colors text-lg">
                        call
                      </span>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full input-noir py-4 pl-12 pr-4 font-bold"
                        maxLength="10"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary py-4 shadow-rose/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-noir border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Get Started</span>
                        <span className="material-symbols-outlined text-lg">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </motion.button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-cream/50 uppercase tracking-widest ml-1">
                      Verification Code
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-rose/40 group-focus-within:text-rose transition-colors text-lg">
                        lock
                      </span>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit code"
                        className="w-full input-noir py-4 pl-12 pr-4 tracking-[0.5em] text-center font-black placeholder:tracking-normal placeholder:text-cream/20"
                        maxLength="6"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-primary py-4 shadow-rose/20 disabled:opacity-50 flex items-center justify-center gap-2 font-bold"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-noir border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Verify & Login</span>
                          <span className="material-symbols-outlined text-lg">
                            verified_user
                          </span>
                        </>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setStep("mobile")}
                      className="w-full text-cream-muted hover:text-rose text-sm font-medium transition-colors"
                    >
                      Use a different number
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
