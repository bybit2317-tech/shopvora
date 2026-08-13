import { useState, useEffect } from "react";
import { Store, Loader2, LogOut, Users, Ban, CheckCircle2, Flag, Tag, Plus, Trash2 } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function AdminDashboard({ onLogout }) {
  const [stores, setStores] = useState([]);
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [activeTab, setActiveTab] = useState("sellers");
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: storeData } = await supabase
      .from("stores")
      .select("*")
      .order("created_at", { ascending: false });

    setStores(storeData || []);

    const { data: reportData } = await supabase
      .from("reports")
      .select("*, stores(store_name, whatsapp_number)")
      .order("created_at", { ascending: false });

    setReports(reportData || []);

    const { data: catData } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    setCategories(catData || []);

    setLoading(false);
  };

  const toggleSuspend = async (store) => {
    setTogglingId(store.id);
    try {
      const { error } = await supabase
        .from("stores")
        .update({ suspended: !store.suspended })
        .eq("id", store.id);
      if (error) throw error;

      setStores((prev) =>
        prev.map((s) => (s.id === store.id ? { ...s, suspended: !store.suspended } : s))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim() || addingCategory) return;
    setAddingCategory(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({ name: newCategory.trim() })
        .select()
        .single();
      if (error) throw error;

      setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategory("");
    } catch (err) {
      console.error(err);
    } finally {
      setAddingCategory(false);
    }
  };

  const deleteCategory = async (id) => {
    setDeletingCategoryId(id);
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;

      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingCategoryId(null);
    }
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

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#16241C] border border-[#22362A] rounded-xl p-4 flex items-center gap-3">
          <Users size={20} className="text-[#3DDC84]" />
          <div>
            <p className="text-white font-semibold text-lg leading-tight">{stores.length}</p>
            <p className="text-[#8AA396] text-xs">Sellers</p>
          </div>
        </div>
        <div className="bg-[#16241C] border border-[#22362A] rounded-xl p-4 flex items-center gap-3">
          <Flag size={20} className="text-[#FF6B6B]" />
          <div>
            <p className="text-white font-semibold text-lg leading-tight">{reports.length}</p>
            <p className="text-[#8AA396] text-xs">Reports</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("sellers")}
          className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border ${
            activeTab === "sellers"
              ? "bg-[#3DDC84] text-[#0F1A14] border-[#3DDC84]"
              : "bg-[#16241C] text-[#8AA396] border-[#22362A]"
          }`}
        >
          Sellers
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reports")}
          className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border ${
            activeTab === "reports"
              ? "bg-[#3DDC84] text-[#0F1A14] border-[#3DDC84]"
              : "bg-[#16241C] text-[#8AA396] border-[#22362A]"
          }`}
        >
          Reports
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border ${
            activeTab === "categories"
              ? "bg-[#3DDC84] text-[#0F1A14] border-[#3DDC84]"
              : "bg-[#16241C] text-[#8AA396] border-[#22362A]"
          }`}
        >
          Categories
        </button>
      </div>

      {activeTab === "sellers" && (
        <>
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
                  className={`border rounded-xl px-4 py-3 ${
                    s.suspended
                      ? "bg-[#2A1616] border-[#4A2323]"
                      : "bg-[#16241C] border-[#22362A]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{s.store_name}</p>
                      <p className="text-[#4A5D51] text-xs mt-0.5">
                        {s.store_slug} · {[s.city, s.state].filter(Boolean).join(", ") || "No location"}
                      </p>
                      <p className="text-[#4A5D51] text-xs mt-0.5">
                        Joined {new Date(s.created_at).toLocaleDateString()}
                      </p>
                      {s.suspended && (
                        <span className="inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded bg-[#332020] text-[#FF6B6B]">
                          Suspended
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSuspend(s)}
                      disabled={togglingId === s.id}
                      className={`shrink-0 flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border ${
                        s.suspended
                          ? "bg-[#1B3324] border-[#3DDC84] text-[#3DDC84]"
                          : "bg-[#0F1A14] border-[#22362A] text-[#8AA396]"
                      }`}
                    >
                      {togglingId === s.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : s.suspended ? (
                        <>
                          <CheckCircle2 size={12} /> Unsuspend
                        </>
                      ) : (
                        <>
                          <Ban size={12} /> Suspend
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "reports" && (
        <>
          <h2 className="text-[#8AA396] text-xs font-medium uppercase tracking-wide mb-3">
            All reports
          </h2>

          {reports.length === 0 ? (
            <p className="text-[#4A5D51] text-sm text-center py-10">No reports yet.</p>
          ) : (
            <div className="space-y-2">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#16241C] border border-[#22362A] rounded-xl px-4 py-3"
                >
                  <p className="text-white text-sm font-medium">
                    {r.stores?.store_name || "Unknown store"}
                  </p>
                  <p className="text-[#FF6B6B] text-xs mt-1">{r.reason}</p>
                  {r.details && (
                    <p className="text-[#8AA396] text-xs mt-1">{r.details}</p>
                  )}
                  {r.stores?.whatsapp_number && (
                    <p className="text-[#4A5D51] text-xs mt-1">
                      Seller WhatsApp: {r.stores.whatsapp_number}
                    </p>
                  )}
                  <p className="text-[#4A5D51] text-xs mt-1">
                    {new Date(r.created_at).toLocaleDateString()} at{" "}
                    {new Date(r.created_at).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "categories" && (
        <>
          <h2 className="text-[#8AA396] text-xs font-medium uppercase tracking-wide mb-3">
            Manage categories
          </h2>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              placeholder="New category name"
              style={{ color: "#FFFFFF", backgroundColor: "#16241C" }}
              className="flex-1 border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
            />
            <button
              type="button"
              onClick={addCategory}
              disabled={!newCategory.trim() || addingCategory}
              className="shrink-0 bg-[#3DDC84] text-[#0F1A14] rounded-lg p-2.5 disabled:opacity-50"
            >
              {addingCategory ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
            </button>
          </div>

          {categories.length === 0 ? (
            <p className="text-[#4A5D51] text-sm text-center py-10">No categories yet.</p>
          ) : (
            <div className="space-y-2">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#16241C] border border-[#22362A] rounded-xl px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-[#4A5D51]" />
                    <p className="text-white text-sm">{c.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCategory(c.id)}
                    disabled={deletingCategoryId === c.id}
                    className="text-[#FF6B6B]"
                  >
                    {deletingCategoryId === c.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
           }
