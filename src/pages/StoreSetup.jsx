import { useState } from "react";
import { Store, ArrowRight, Loader2, CheckCircle2, Copy, Check, Info, X } from "lucide-react";
import { supabase } from "../supabaseClient";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "Abuja (FCT)",
  "Other",
];

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function StoreSetup({ user, onStoreCreated }) {
  const [storeName, setStoreName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleNameChange = (value) => {
    setStoreName(value);
    if (!slugEdited) setSlug(slugify(value));
  };

  const handleSlugChange = (value) => {
    setSlugEdited(true);
    setSlug(slugify(value));
  };

  const handleSubmit = async () => {
    setError("");

    if (!storeName.trim()) return setError("Give your store a name to continue.");
    if (!slug.trim()) return setError("Your store needs a link — try a different name.");
    if (!whatsapp.trim()) return setError("Add a WhatsApp number so buyers can reach you.");

    setLoading(true);
    try {
      const { error: insertError } = await supabase.from("stores").insert({
        user_id: user.id,
        store_slug: slug,
        store_name: storeName.trim(),
        description: description.trim() || null,
        state: state || null,
        city: city.trim() || null,
        whatsapp_number: whatsapp.trim(),
        bank_account_name: bankAccountName.trim() || null,
        bank_name: bankName.trim() || null,
        bank_account_number: bankAccountNumber.trim() || null,
      });

      if (insertError) {
        if (insertError.code === "23505") {
          throw new Error("That store link is already taken. Try a different name.");
        }
        throw insertError;
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const storeUrl = `shopvora-store.netlify.app/${slug || "yourstore"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${storeUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0F1A14] flex flex-col items-center justify-center px-6 py-10 font-sans">
        <div className="w-full max-w-sm bg-[#16241C] rounded-2xl p-6 border border-[#22362A] shadow-2xl text-center">
          <CheckCircle2 size={40} className="text-[#3DDC84] mx-auto mb-4" />
          <h2 className="text-white text-lg font-semibold mb-2">Your store is live</h2>
          <p className="text-[#8AA396] text-sm mb-5">
            Share this link anywhere — TikTok, Instagram, WhatsApp, YouTube.
          </p>

          <div className="bg-[#0F1A14] border border-[#22362A] rounded-lg px-3.5 py-3 flex items-center justify-between gap-2 mb-5">
            <span className="text-[#3DDC84] text-sm font-medium truncate">{storeUrl}</span>
            <button
              onClick={handleCopy}
              className="shrink-0 w-8 h-8 rounded-md bg-[#22362A] flex items-center justify-center hover:bg-[#2C4132] transition-colors"
            >
              {copied ? <Check size={14} className="text-[#3DDC84]" /> : <Copy size={14} className="text-[#8AA396]" />}
            </button>
          </div>

          <button
            onClick={() => onStoreCreated && onStoreCreated()}
            className="w-full bg-[#3DDC84] hover:bg-[#34C476] transition-colors text-[#0F1A14] font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2"
          >
            Add your first product
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1A14] flex flex-col items-center px-6 py-10 font-sans">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#3DDC84] flex items-center justify-center">
          <Store size={20} className="text-[#0F1A14]" strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">Shopvora</span>
      </div>

      <div className="w-full max-w-sm bg-[#16241C] rounded-2xl p-6 border border-[#22362A] shadow-2xl">
        <h1 className="text-white text-xl font-semibold mb-1">Set up your store</h1>
        <p className="text-[#8AA396] text-sm mb-6">This takes about a minute.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Store name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Jane's Beauty Store"
              style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
              className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Your store link</label>
            <div className="flex items-center border border-[#22362A] rounded-lg overflow-hidden">
              <span className="px-3 py-2.5 text-[#4A5D51] text-sm bg-[#0F1A14] shrink-0">shopvora.app/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="janesbeauty"
                style={{ color: "#3DDC84", backgroundColor: "#0F1A14" }}
                className="w-full py-2.5 pr-3 text-sm placeholder-[#4A5D51] focus:outline-none"
              />
            </div>
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

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#3DDC84] hover:bg-[#34C476] transition-colors text-[#0F1A14] font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : (
              <>
                Create my store
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
