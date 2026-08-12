import { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";

const ADMIN_PASSWORD = "ndidi2022";

export default function AdminLogin({ onLoggedIn }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("shopvora_admin", "true");
      onLoggedIn();
    } else {
      setError("Incorrect password.");
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

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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
          onClick={handleSubmit}
          className="w-full bg-[#3DDC84] hover:bg-[#34C476] transition-colors text-[#0F1A14] font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2"
        >
          Log in
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
          }
