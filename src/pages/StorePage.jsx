import { useState, useEffect } from "react";
import { Store, Package, Loader2, Plus, Minus, Check, ShoppingCart, X, Trash2, MessageCircle, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { supabase } from "../supabaseClient";

function ProductPhotos({ product, onOpenFullscreen }) {
  const photos = product.photo_urls && product.photo_urls.length > 0
    ? product.photo_urls
    : (product.photo_url ? [product.photo_url] : []);

  const [index, setIndex] = useState(0);

  const prevPhoto = (e) => {
    e.stopPropagation();
    setIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setIndex((i) => (i === photos.length - 1 ? 0 : i + 1));
  };

  if (photos.length === 0) {
    return (
      <div className="w-full h-32 bg-[#0F1A14] flex items-center justify-center">
        <Package size={20} className="text-[#4A5D51]" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-32 bg-[#0F1A14] cursor-pointer"
      onClick={() => onOpenFullscreen(photos, index)}
    >
      <img
        src={photos[index]}
        alt={product.name}
        className={`w-full h-full object-cover ${!product.in_stock ? "opacity-40" : ""}`}
      />

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevPhoto}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-0.5"
          >
            <ChevronLeft size={14} className="text-white" />
          </button>
          <button
            type="button"
            onClick={nextPhoto}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-0.5"
          >
            <ChevronRight size={14} className="text-white" />
          </button>
          <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center gap-1">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}

      {!product.in_stock && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="bg-black/70 text-white text-[10px] px-2 py-1 rounded">
            Out of stock
          </span>
        </span>
      )}
      {product.featured && product.in_stock && (
        <span className="absolute top-1.5 left-1.5 bg-[#3DDC84] text-[#0F1A14] text-[9px] font-semibold px-1.5 py-0.5 rounded">
          Featured
        </span>
      )}
    </div>
  );
}

export default function StorePage({ slug }) {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [fullscreenPhotos, setFullscreenPhotos] = useState(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

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

  const openFullscreen = (photos, index) => {
    setFullscreenPhotos(photos);
    setFullscreenIndex(index);
  };

  const closeFullscreen = () => {
    setFullscreenPhotos(null);
  };

  const prevFullscreen = () => {
    setFullscreenIndex((i) => (i === 0 ? fullscreenPhotos.length - 1 : i - 1));
  };

  const nextFullscreen = () => {
    setFullscreenIndex((i) => (i === fullscreenPhotos.length - 1 ? 0 : i + 1));
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const sendOrderOnWhatsApp = () => {
    if (!store.whatsapp_number || cart.length === 0) return;

    const lines = cart.map(
      (item) => `${item.qty}x ${item.name} - ₦${(item.qty * item.price).toLocaleString()}`
    );

    const message =
      `Hi, I'd like to order:\n\n` +
      lines.join("\n") +
      `\n\nTotal: ₦${cartTotal.toLocaleString()}` +
      `\n\n(via Shopvora - ${store.store_name})`;

    const cleanNumber = store.whatsapp_number.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

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
    <div className="min-h-screen bg-[#0F1A14] px-6 py-8 font-sans pb-24">
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
        <p className="text-[#8AA396] text-sm mt-3 mb-4 leading-relaxed">{store.description}</p>
      )}

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5D51]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products in this store"
          style={{ color: "#FFFFFF", backgroundColor: "#16241C" }}
          className="w-full border border-[#22362A] rounded-lg pl-9 pr-9 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A5D51]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <h2 className="text-[#8AA396] text-xs font-medium uppercase tracking-wide mb-3 mt-2">
        {searchTerm ? `Results (${filteredProducts.length})` : `Products (${products.length})`}
      </h2>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-14 border border-dashed border-[#22362A] rounded-xl">
          <Package size={24} className="text-[#4A5D51] mx-auto mb-2" />
          <p className="text-[#4A5D51] text-sm">
            {searchTerm ? `No products match "${searchTerm}".` : "No products yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((p) => {
            const inCart = cart.find((item) => item.id === p.id);
            return (
              <div
                key={p.id}
                className={`bg-[#16241C] border rounded-xl overflow-hidden ${
                  p.featured ? "border-[#3DDC84]" : "border-[#22362A]"
                }`}
              >
                <ProductPhotos product={p} onOpenFullscreen={openFullscreen} />

                <div className="p-2.5">
                  <p className="text-white text-xs font-medium truncate">{p.name}</p>
                  <p className="text-[#3DDC84] text-xs font-semibold mt-0.5">
                    ₦{Number(p.price).toLocaleString()}
                  </p>
                  {p.description && (
                    <p className="text-[#4A5D51] text-[10px] mt-1 line-clamp-2">{p.description}</p>
                  )}

                  {p.in_stock && (
                    <button
                      type="button"
                      onClick={() => addToCart(p)}
                      className={`w-full mt-2 flex items-center justify-center gap-1 rounded-md py-1.5 text-[10px] font-medium ${
                        inCart
                          ? "bg-[#1B3324] text-[#3DDC84] border border-[#3DDC84]"
                          : "bg-[#0F1A14] text-[#8AA396] border border-[#22362A]"
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check size={11} /> In cart ({inCart.qty})
                        </>
                      ) : (
                        <>
                          <Plus size={11} /> Add to cart
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cartCount > 0 && !showCart && (
        <button
          type="button"
          onClick={() => setShowCart(true)}
          className="fixed bottom-0 left-0 right-0 bg-[#16241C] border-t border-[#22362A] px-6 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-white text-sm">
            <ShoppingCart size={18} className="text-[#3DDC84]" />
            <span>{cartCount} item{cartCount > 1 ? "s" : ""} in cart</span>
          </div>
          <span className="text-[#3DDC84] text-xs font-medium">
            ₦{cartTotal.toLocaleString()} · Review
          </span>
        </button>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-black/70 flex items-end z-50">
          <div className="bg-[#16241C] w-full rounded-t-2xl border-t border-[#22362A] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#22362A]">
              <h2 className="text-white font-semibold text-base">Your order</h2>
              <button type="button" onClick={() => setShowCart(false)}>
                <X size={20} className="text-[#8AA396]" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-3 flex-1">
              {cart.length === 0 ? (
                <p className="text-[#4A5D51] text-sm text-center py-8">Your cart is empty.</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 border-b border-[#22362A] pb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.name}</p>
                        <p className="text-[#3DDC84] text-xs mt-0.5">
                          ₦{Number(item.price).toLocaleString()} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => decreaseQty(item.id)}
                          className="w-6 h-6 flex items-center justify-center bg-[#0F1A14] border border-[#22362A] rounded text-[#8AA396]"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-white text-sm w-4 text-center">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => increaseQty(item.id)}
                          className="w-6 h-6 flex items-center justify-center bg-[#0F1A14] border border-[#22362A] rounded text-[#8AA396]"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="ml-1 text-[#FF6B6B]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="px-5 py-4 border-t border-[#22362A]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#8AA396] text-sm">Total</span>
                  <span className="text-white font-semibold text-base">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={sendOrderOnWhatsApp}
                  className="w-full bg-[#3DDC84] hover:bg-[#34C476] transition-colors text-[#0F1A14] font-semibold text-sm rounded-lg py-3 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Send Order on WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {fullscreenPhotos && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center">
          <button
            type="button"
            onClick={closeFullscreen}
            className="absolute top-4 right-4 bg-black/50 rounded-full p-2 z-10"
          >
            <X size={22} className="text-white" />
          </button>

          <img
            src={fullscreenPhotos[fullscreenIndex]}
            alt="Product"
            className="max-w-full max-h-full object-contain"
          />

          {fullscreenPhotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevFullscreen}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2"
              >
                <ChevronLeft size={22} className="text-white" />
              </button>
              <button
                type="button"
                onClick={nextFullscreen}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2"
              >
                <ChevronRight size={22} className="text-white" />
              </button>
              <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-1.5">
                {fullscreenPhotos.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full ${i === fullscreenIndex ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
