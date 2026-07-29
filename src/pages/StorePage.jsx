import { useState, useEffect } from "react";
import { Store, Package, Loader2 } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function StorePage({ slug }) {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadStore();
  }, [slug]);

  const loadStore = async () => {
    setLoading(true);
    const { data: storeData } = await supabase
      .from("stores")
      .select("*")
      .eq("store_slug", slug)
      .single();

    if (!storeData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setStore(storeData);

    const { data: prodData } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeData.id)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    setProducts(prodData || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1A14] flex items-center justify-center">
        <Loader2 size={24} className="text-[#3DDC84] animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0F1A14] flex flex-col items-center justify-center px-6 text-center">
        <Store size={28} className="text-[#4A5D51] mb-3" />
        <p className="text-white font-medium">Store not found</p>
        <p className="text-[#8AA396] text-sm mt-1">Check the link and try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1A14] px-6 py-8 font-sans">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-lg bg-[#3DDC84] flex items-center justify-center shrink-0">
          <Store size={20} className="text-[#0F1A14]" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-white font-semibold text-lg leading-tight">{store.store_name}</h1>
          {(store.city || store.state) && (
            <p className="text-[#4A5D51] text-xs">
              {[store.city, store.state].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </div>

      {store.description && (
        <p className="text-[#8AA396] text-sm mt-3 mb-6 leading-relaxed">{store.description}</p>
      )}

      <h2 className="text-[#8AA396] text-xs font-medium uppercase tracking-wide mb-3 mt-2">
        Products ({products.length})
      </h2>

      {products.length === 0 ? (
        <div className="text-center py-14 border border-dashed border-[#22362A] rounded-xl">
          <Package size={24} className="text-[#4A5D51] mx-auto mb-2" />
          <p className="text-[#4A5D51] text-sm">No products yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <div
              key={p.id}
              className={`bg-[#16241C] border rounded-xl overflow-hidden ${
                p.featured ? "border-[#3DDC84]" : "border-[#22362A]"
              }`}
            >
              <div className="w-full h-32 bg-[#0F1A14] flex items-center justify-center relative">
                {p.photo_url ? (
                  <img
                    src={p.photo_url}
                    alt={p.name}
                    className={`w-full h-full object-cover ${!p.in_stock ? "opacity-40" : ""}`}
                  />
                ) : (
                  <Package size={20} className="text-[#4A5D51]" />
                )}
                {!p.in_stock && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                      Out of stock
                    </span>
                  </span>
                )}
                {p.featured && p.in_stock && (
                  <span className="absolute top-1.5 left-1.5 bg-[#3DDC84] text-[#0F1A14] text-[9px] font-semibold px-1.5 py-0.5 rounded">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-white text-xs font-medium truncate">{p.name}</p>
                <p className="text-[#3DDC84] text-xs font-semibold mt-0.5">
                  ₦{Number(p.price).toLocaleString()}
                </p>
                {p.description && (
                  <p className="text-[#4A5D51] text-[10px] mt-1 line-clamp-2">{p.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
      }
