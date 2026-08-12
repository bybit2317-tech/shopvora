import { useState, useEffect } from "react";
import { Store, Loader2, LogOut, Users } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function AdminDashboard({ onLogout }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("stores")
      .select("*")
      .order("created_at", { ascending: false });

    setStores(data || []);
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("shopvora_admin");
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1A14] flex items-center justify-center">
        <Loader2 size={24} className="text-[#3DDC84] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1A14] px-6 py-8 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#3DDC84] flex items-center justify-center">
            <Store size={16} className="text-[#0F1A14]" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Admin Dashboard</p>
            <p className="text-[#4A5D51] text-xs">Shopvora</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1 text-[#8AA396] text-xs"
        >
          <LogOut size={14} />
          Log out
        </button>
      </div>

      <div className="bg-[#16241C] border border-[#22362A] rounded-xl p-4 mb-6 flex items-center gap-3">
        <Users size={20} className="text-[#3DDC84]" />
        <div>
          <p className="text-white font-semibold text-lg leading-tight">{stores.length}</p>
          <p className="text-[#8AA396] text-xs">Total sellers</p>
        </div>
      </div>

      <h2 className="text-[#8AA396] text-xs font-medium uppercase tracking-wide mb-3">
        All sellers
      </h2>

      {stores.length === 0 ? (
        <p className="text-[#4A5D51] text-sm text-center py-10">No sellers yet.</p>
      ) : (
        <div className="space-y-2">
          {stores.map((s) => (
            <div
              key={s.id}
              className="bg-[#16241C] border border-[#22362A] rounded-xl px-4 py-3"
            >
              <p className="text-white text-sm font-medium">{s.store_name}</p>
              <p className="text-[#4A5D51] text-xs mt-0.5">
                {s.store_slug} · {[s.city, s.state].filter(Boolean).join(", ") || "No location"}
              </p>
              <p className="text-[#4A5D51] text-xs mt-0.5">
                Joined {new Date(s.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
    }
