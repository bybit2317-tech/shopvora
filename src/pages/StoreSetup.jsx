import { useState } from "react";
import { Store, ArrowRight, Loader2, CheckCircle2, Copy, Check } from "lucide-react";
import { supabase } from "../supabaseClient";

const NIGERIAN_STATES = [
  "Lagos", "Abuja (FCT)", "Rivers", "Kano", "Oyo", "Kaduna", "Ogun", "Enugu",
  "Delta", "Anambra", "Edo", "Plateau", "Other",
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
    </div>
  );
    }
