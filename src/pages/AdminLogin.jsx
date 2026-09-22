import { useState } from "react";
import { Lock, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "../supabaseClient";

const ADMIN_PASSWORD = "ndidi2022";
const ADMIN_EMAIL = "matlockbabe247@gmail.com";

export default function AdminLogin({ onLoggedIn }) {
  const [step, setStep] = useState("password");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);

  const handlePasswordSubmit = async () => {
    setError("");
    if (password !== ADMIN_PASSWORD) {
      setError("Incorrect password.");
      return;
    }

    setLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: ADMIN_EMAIL,
        options: { shouldCreateUser: false },
      });
      if (otpError) throw otpError;
      setStep("otp");
    } catch (err) {
      setError("Couldn't send verification code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setError("");
    if (!otp.trim()) {
      setError("Enter the code sent to your email.");
      return;
    }

    setLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: ADMIN_EMAIL,
        token: otp.trim(),
        type: "email",
      });
      if (verifyError) throw verifyError;

      sessionStorage.setItem("shopvora_admin", "true");
      onLoggedIn();
    } catch (err) {
      setError("Incorrect or expired code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResent(false);
    setLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: ADMIN_EMAIL,
        options: { shouldCreateUser: false },
      });
      if (otpError) throw otpError;
      setResent(true);
    } catch (err) {
      setError("Couldn't resend code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1A14] flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-lg bg-[#3DDC84] flex items-center justify-center mb-3">
            <Lock size={22} className="text-[#0F1A14]" strokeWidth={2.5} />
          </div>
          <h1 className="text-white font-semibold text-lg">Admin Access</h1>
          <p className="text-[#4A5D51] text-xs mt-1">Shopvora management dashboard</p>
        </div>

        {step === "password" ? (
          <>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
              placeholder="Enter admin password"
              style={{ color: "#FFFFFF", backgroundColor: "#16241C" }}
              className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent mb-3"
            />

            {error && (
              <p className="text-[#FF6B6B] text-xs bg-[#2A1616] border border-[#4A2323] rounded-lg px-3 py-2 mb-3">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handlePasswordSubmit}
              disabled={loading}
              className="w-full bg-[#3DDC84] hover:bg-[#34C476] transition-colors text-[#0F1A14] font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : (
                <>
                  Continue
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <p className="text-[#8AA396] text-xs mb-3 text-center">
              We sent a 6-digit code to your email. Enter it below to continue.
            </p>

            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleOtpSubmit()}
              placeholder="Enter 6-digit code"
              style={{ color: "#FFFFFF", backgroundColor: "#16241C" }}
              className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm text-center tracking-[0.3em] placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent mb-3"
            />

            {error && (
              <p className="text-[#FF6B6B] text-xs bg-[#2A1616] border border-[#4A2323] rounded-lg px-3 py-2 mb-3">
                {error}
              </p>
            )}

            {resent && !error && (
              <p className="text-[#3DDC84] text-xs bg-[#16241C] border border-[#22362A] rounded-lg px-3 py-2 mb-3">
                A new code has been sent.
              </p>
            )}

            <button
              type="button"
              onClick={handleOtpSubmit}
              disabled={loading}
              className="w-full bg-[#3DDC84] hover:bg-[#34C476] transition-colors text-[#0F1A14] font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 disabled:opacity-60 mb-3"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : (
                <>
                  Verify & log in
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep("password");
                  setOtp("");
                  setError("");
                  setResent(false);
                }}
                className="text-[#8AA396]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-[#3DDC84] font-medium disabled:opacity-60"
              >
                Resend code
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
