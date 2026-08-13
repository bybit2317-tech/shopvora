import { useState } from "react";
import { Store, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function AuthPage({ onLoggedIn }) {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (mode === "signup" && !agreedToTerms) {
      setError("You must agree to the Terms & Conditions to create a store.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setSuccess(true);
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
        setSuccess(true);
        if (onLoggedIn) onLoggedIn(data.user);
      }
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
            <h2 className="text-white text-lg font-semibold mb-2">
              {mode === "signup" ? "Account created" : "Welcome back"}
            </h2>
            <p className="text-[#8AA396] text-sm">
              {mode === "signup"
                ? "Check your email to confirm your account, then log in."
                : "You're logged in. Next: set up your store."}
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-white text-xl font-semibold mb-1">
              {mode === "signup" ? "Create your seller account" : "Log in to your store"}
            </h1>
            <p className="text-[#8AA396] text-sm mb-6">
              {mode === "signup" ? "Start selling in minutes. It's free." : "Enter your details to continue."}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
                  className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
                  className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
                />
              </div>

              {mode === "signup" && (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#3DDC84] shrink-0"
                  />
                  <span className="text-[#8AA396] text-xs leading-relaxed">
                    I agree to Shopvora's{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3DDC84] underline"
                    >
                      Terms & Conditions
                    </a>
                  </span>
                </label>
              )}

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
                    {mode === "signup" ? "Create account" : "Log in"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-[#8AA396] text-xs mt-5">
              {mode === "signup" ? "Already have a store?" : "New to Shopvora?"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "signup" ? "login" : "signup");
                  setError("");
                }}
                className="text-[#3DDC84] font-medium hover:underline"
              >
                {mode === "signup" ? "Log in" : "Sign up"}
              </button>
            </p>
          </>
        )}
      </div>

      <p className="text-[#4A5D51] text-xs mt-8 text-center max-w-xs">
        By continuing, you agree to set up a store you'll manage yourself. Shopvora never charges buyers.
      </p>
    </div>
  );
               }
