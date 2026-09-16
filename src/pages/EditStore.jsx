import { useState, useEffect } from "react";
import { Store, ArrowRight, Loader2, CheckCircle2, Info, X, ArrowLeft } from "lucide-react";
import { supabase } from "../supabaseClient";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "Abuja (FCT)",
  "Other",
];

export default function EditStore({ user, onBack }) {
  const [storeId, setStoreId] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadStore();
  }, []);

  const loadStore = async () => {
    setLoadingPage(true);
    const { data } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setStoreId(data.id);
      setStoreName(data.store_name || "");
      setDescription(data.description || "");
      setState(data.state || "");
      setCity(data.city || "");
      setWhatsapp(data.whatsapp_number || "");
      setBankAccountName(data.bank_account_name || "");
      setBankName(data.bank_name || "");
      setBankAccountNumber(data.bank_account_number || "");
    }
    setLoadingPage(false);
  };

  const handleSubmit = async () => {
    setError("");

    if (!storeName.trim()) return setError("Give your store a name to continue.");
    if (!whatsapp.trim()) return setError("Add a WhatsApp number so buyers can reach you.");

    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from("stores")
        .update({
          store_name: storeName.trim(),
          description: description.trim() || null,
          state: state || null,
          city: city.trim() || null,
          whatsapp_number: whatsapp.trim(),
          bank_account_name: bankAccountName.trim() || null,
          bank_name: bankName.trim() || null,
          bank_account_number: bankAccountNumber.trim() || null,
        })
        .eq("id", storeId);

      if (updateError) throw updateError;

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPage) {
    return (
      <div className="min-h-screen bg-[#0F1A14] flex items-center justify-center">
        <Loader2 size={24} className="text-[#3DDC84] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1A14] flex flex-col items-center px-6 py-10 font-sans">
      <div className="w-full max-w-sm mb-4">
        <button
          type="button"
          onClick={() => onBack && onBack()}
          className="flex items-center gap-1 text-[#8AA396] text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#3DDC84] flex items-center justify-center">
          <Store size={20} className="text-[#0F1A14]" strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">Shopvora</span>
      </div>

      <div className="w-full max-w-sm bg-[#16241C] rounded-2xl p-6 border border-[#22362A] shadow-2xl">
        <h1 className="text-white text-xl font-semibold mb-1">Edit your store</h1>
        <p className="text-[#8AA396] text-sm mb-6">Update your details anytime.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Store name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Jane's Beauty Store"
              style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
              className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Short description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you sell?"
              rows={2}
              style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
              className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#8AA396] text-xs font-medium mb-1.5">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
                className="w-full border border-[#22362A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
              >
                <option value="">Select</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#8AA396] text-xs font-medium mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ikeja"
                style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
                className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8AA396] text-xs font-medium mb-1.5">WhatsApp number</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+234 800 000 0000"
              style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
              className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
            />
            <p className="text-[#4A5D51] text-xs mt-1.5">Buyers tap a button to message you here directly.</p>
          </div>

          <div className="pt-2 border-t border-[#22362A]">
            <div className="flex items-center justify-between mb-3 mt-3">
              <p className="text-[#8AA396] text-xs font-medium">
                Payment details <span className="text-[#3DDC84]">(optional)</span>
              </p>
              <button
                type="button"
                onClick={() => setShowBankInfo(true)}
                className="text-[#3DDC84] text-xs font-medium underline"
              >
                Learn more
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Account name</label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  placeholder="Jane Okafor"
                  style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
                  className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Bank name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Access Bank"
                  style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
                  className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Account number</label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="0123456789"
                  style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
                  className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-[#FF6B6B] text-xs bg-[#2A1616] border border-[#4A2323] rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {success && (
            <p className="text-[#3DDC84] text-xs bg-[#16241C] border border-[#22362A] rounded-lg px-3 py-2 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Store updated
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#3DDC84] hover:bg-[#34C476] transition-colors text-[#0F1A14] font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : (
              <>
                Save changes
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {showBankInfo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6">
          <div className="bg-[#16241C] w-full max-w-sm rounded-2xl border border-[#22362A] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold text-base">About payment details</h2>
              <button type="button" onClick={() => setShowBankInfo(false)}>
                <X size={20} className="text-[#8AA396]" />
              </button>
            </div>
            <p className="text-[#8AA396] text-sm leading-relaxed">
              This bank account is for your customers to pay you directly. Shopvora does not collect, hold, or forward any payment — money goes straight from the buyer to your account via WhatsApp.
            </p>
            <button
              type="button"
              onClick={() => setShowBankInfo(false)}
              className="w-full mt-4 bg-[#3DDC84] text-[#0F1A14] font-semibold text-sm rounded-lg py-2.5"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
