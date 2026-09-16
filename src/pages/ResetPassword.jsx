import { useState } from "react";
import { Store, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1A14] flex flex-col items-center justify-center px-6 py-10 font-sans">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#3DDC84] flex items-center justify-center">
          <Store size={20} className="text-[#0F1A14]" strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">Shopvora</span>
      </div>

      <div className="w-full max-w-sm bg-[#16241C] rounded-2xl p-6 border border-[#22362A] shadow-2xl">
        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 size={40} className="text-[#3DDC84] mx-auto mb-4" />
            <h2 className="text-white text-lg font-semibold mb-2">Password updated</h2>
            <p className="text-[#8AA396] text-sm mb-5">
              Your password has been changed. You can now log in with your new password.
            </p>
            <a
              href="/"
              className="inline-block bg-[#3DDC84] hover:bg-[#34C476] transition-colors text-[#0F1A14] font-semibold text-sm rounded-lg px-5 py-2.5"
            >
              Go to log in
            </a>
          </div>
        ) : (
          <>
            <h1 className="text-white text-xl font-semibold mb-1">Set a new password</h1>
            <p className="text-[#8AA396] text-sm mb-6">
              Enter a new password for your account.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[#8AA396] text-xs font-medium mb-1.5">New password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
                  className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Confirm new password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
                  className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
                />
              </div>

              {error && (
                <p className="text-[#FF6B6B] text-xs bg-[#2A1616] border border-[#4A2323] rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#3DDC84] hover:bg-[#34C476] transition-colors text-[#0F1A14] font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    Update password
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
