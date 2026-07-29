import { useState, useEffect } from "react";
import { Store, ArrowRight, Loader2, CheckCircle2, Upload, Package, Copy, Check, X, Pencil, Trash2 } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function ProductUpload({ user }) {
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [existingPhotoUrls, setExistingPhotoUrls] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const MAX_PHOTOS = 5;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingPage(true);
    const { data: storeData } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", user.id)
      .single();
    setStore(storeData);

    const { data: catData } = await supabase.from("categories").select("*").order("name");
    setCategories(catData || []);

    if (storeData) {
      const { data: prodData } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeData.id)
        .order("created_at", { ascending: false });
      setProducts(prodData || []);
    }
    setLoadingPage(false);
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalExisting = existingPhotoUrls.length;
    const room = MAX_PHOTOS - totalExisting - photoFiles.length;
    const toAdd = files.slice(0, Math.max(room, 0));

    const combined = [...photoFiles, ...toAdd];
    setPhotoFiles(combined);
    setPhotoPreviews(combined.map((f) => URL.createObjectURL(f)));
    e.target.value = "";
  };

  const removeNewPhoto = (index) => {
    const newFiles = photoFiles.filter((_, i) => i !== index);
    setPhotoFiles(newFiles);
    setPhotoPreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const removeExistingPhoto = (index) => {
    setExistingPhotoUrls(existingPhotoUrls.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setDescription("");
    setCategoryId("");
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setExistingPhotoUrls([]);
    setSuccess(false);
    setError("");
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setName(p.name || "");
    setPrice(p.price != null ? String(p.price) : "");
    setDescription(p.description || "");
    setCategoryId(p.category_id || "");
    setExistingPhotoUrls(p.photo_urls && p.photo_urls.length > 0 ? p.photo_urls : (p.photo_url ? [p.photo_url] : []));
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setSuccess(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyStoreLink = () => {
    const link = `https://shopvora-store.netlify.app/${store?.store_slug}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSubmit = async () => {
    setError("");

    if (!name.trim()) return setError("Give your product a name.");
    if (!price || Number(price) <= 0) return setError("Add a valid price.");
    if (!store) return setError("Store not found. Try refreshing the page.");

    setLoading(true);
    try {
      let newPhotoUrls = [];

      for (const file of photoFiles) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${store.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        newPhotoUrls.push(urlData.publicUrl);
      }

      const finalPhotoUrls = [...existingPhotoUrls, ...newPhotoUrls];

      const payload = {
        name: name.trim(),
        price: Number(price),
        description: description.trim() || null,
        category_id: categoryId || null,
        photo_url: finalPhotoUrls[0] || null,
        photo_urls: finalPhotoUrls.length > 0 ? finalPhotoUrls : null,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("products").insert({
          store_id: store.id,
          ...payload,
        });
        if (insertError) throw insertError;
      }

      setSuccess(true);
      resetForm();
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const { error: deleteError } = await supabase.from("products").delete().eq("id", id);
      if (deleteError) throw deleteError;
      setConfirmDeleteId(null);
      if (editingId === id) resetForm();
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const totalPhotoCount = existingPhotoUrls.length + photoPreviews.length;

  if (loadingPage) {
    return (
      <div className="min-h-screen bg-[#0F1A14] flex items-center justify-center">
        <Loader2 size={24} className="text-[#3DDC84] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1A14] px-6 py-8 font-sans">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#3DDC84] flex items-center justify-center">
          <Store size={16} className="text-[#0F1A14]" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">{store?.store_name}</p>
          <p className="text-[#4A5D51] text-xs">shopvora-store.netlify.app/{store?.store_slug}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={copyStoreLink}
        className="w-full flex items-center justify-between gap-2 bg-[#16241C] border border-[#22362A] rounded-lg px-3.5 py-2.5 mb-6 hover:border-[#3DDC84] transition-colors"
      >
        <span className="text-[#8AA396] text-xs truncate">
          shopvora-store.netlify.app/{store?.store_slug}
        </span>
        <span className="flex items-center gap-1 text-[#3DDC84] text-xs font-medium shrink-0">
          {linkCopied ? (
            <>
              <Check size={14} /> Copied
            </>
          ) : (
            <>
              <Copy size={14} /> Copy link
            </>
          )}
        </span>
      </button>

      <div className="bg-[#16241C] rounded-2xl p-5 border border-[#22362A] shadow-2xl mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-lg font-semibold">
            {editingId ? "Edit product" : "Add a product"}
          </h1>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-[#8AA396] text-xs flex items-center gap-1 hover:text-white"
            >
              <X size={14} /> Cancel
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[#8AA396] text-xs font-medium mb-1.5">
              Photos ({totalPhotoCount}/{MAX_PHOTOS})
            </label>

            {(existingPhotoUrls.length > 0 || photoPreviews.length > 0) && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {existingPhotoUrls.map((src, i) => (
                  <div key={`existing-${i}`} className="relative w-full h-20 rounded-lg overflow-hidden bg-[#0F1A14] border border-[#22362A]">
                    <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(i)}
                      className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
                {photoPreviews.map((src, i) => (
                  <div key={`new-${i}`} className="relative w-full h-20 rounded-lg overflow-hidden bg-[#0F1A14] border border-[#22362A]">
                    <img src={src} alt={`New photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(i)}
                      className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {totalPhotoCount < MAX_PHOTOS && (
              <label className="flex items-center justify-center gap-2 border border-dashed border-[#3A4F42] rounded-lg h-24 cursor-pointer bg-[#0F1A14]">
                <div className="flex flex-col items-center gap-1.5 text-[#4A5D51]">
                  <Upload size={20} />
                  <span className="text-xs">
                    {totalPhotoCount === 0 ? "Tap to add photos" : "Add another photo"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Product name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Red Handbag"
              style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
              className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Price (₦)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="25000"
              style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
              className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
              className="w-full border border-[#22362A] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#8AA396] text-xs font-medium mb-1.5">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product"
              rows={2}
              style={{ color: "#FFFFFF", backgroundColor: "#0F1A14" }}
              className="w-full border border-[#22362A] rounded-lg px-3.5 py-2.5 text-sm placeholder-[#4A5D51] focus:outline-none focus:ring-2 focus:ring-[#3DDC84] focus:border-transparent resize-none"
            />
          </div>

          {error && (
            <p className="text-[#FF6B6B] text-xs bg-[#2A1616] border border-[#4A2323] rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {success && (
            <p className="text-[#3DDC84] text-xs bg-[#16241C] border border-[#22362A] rounded-lg px-3 py-2 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> {editingId ? "Product updated" : "Product added to your store"}
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
                {editingId ? "Save changes" : "Add product"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-[#8AA396] text-xs font-medium uppercase tracking-wide mb-3">
          Your products ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-[#22362A] rounded-xl">
            <Package size={24} className="text-[#4A5D51] mx-auto mb-2" />
            <p className="text-[#4A5D51] text-sm">No products yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <div key={p.id} className="bg-[#16241C] border border-[#22362A] rounded-xl overflow-hidden">
                <div className="w-full h-28 bg-[#0F1A14] flex items-center justify-center">
                  {p.photo_url ? (
                    <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={20} className="text-[#4A5D51]" />
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-white text-xs font-medium truncate">{p.name}</p>
                  <p className="text-[#3DDC84] text-xs font-semibold mt-0.5">
                    ₦{Number(p.price).toLocaleString()}
                  </p>
                  <span className={`inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded ${
                    p.in_stock ? "bg-[#1B3324] text-[#3DDC84]" : "bg-[#332020] text-[#FF6B6B]"
                  }`}>
                    {p.in_stock ? "In stock" : "Out of stock"}
                  </span>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#0F1A14] border border-[#22362A] rounded-md py-1.5 text-[10px] text-[#8AA396] hover:border-[#3DDC84] hover:text-[#3DDC84]"
                    >
                      <Pencil size={11} /> Edit
                    </button>

                    {confirmDeleteId === p.id ? (
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="flex-1 flex items-center justify-center gap-1 bg-[#332020] border border-[#4A2323] rounded-md py-1.5 text-[10px] text-[#FF6B6B] disabled:opacity-60"
                      >
                        {deletingId === p.id ? <Loader2 size={11} className="animate-spin" /> : "Confirm?"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(p.id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-[#0F1A14] border border-[#22362A] rounded-md py-1.5 text-[10px] text-[#8AA396] hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
