import { useState } from "react";
import { Store, ArrowRight, MessageCircle, Search, ShoppingCart, Star, Crown, Check, Menu, X } from "lucide-react";

export default function LandingPage({ onGetStarted, onLogin }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F1A14] font-sans text-white">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#22362A]">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#3DDC84] flex items-center justify-center">
            <Store size={18} className="text-[#0F1A14]" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg">Shopvora</span>
        </div>
        <button
          type="button"
          onClick={() => setShowMenu(true)}
          className="w-10 h-10 rounded-lg bg-[#16241C] border border-[#22362A] flex items-center justify-center"
        >
          <Menu size={20} className="text-[#8AA396]" />
        </button>
      </div>

      {showMenu && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-end">
          <div className="bg-[#16241C] w-72 h-full border-l border-[#22362A] p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-lg">Menu</span>
              <button type="button" onClick={() => setShowMenu(false)}>
                <X size={22} className="text-[#8AA396]" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => { setShowMenu(false); onGetStarted(); }}
                className="text-left text-white text-base font-semibold bg-[#3DDC84] text-[#0F1A14] rounded-lg px-4 py-3.5 mb-3"
              >
                Create Your Store
              </button>
              <button
                type="button"
                onClick={() => { setShowMenu(false); onLogin(); }}
                className="text-left text-[#8AA396] text-base px-4 py-3"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 pt-10 pb-12 text-center">
        <h1 className="text-[34px] leading-[1.15] font-extrabold max-w-sm mx-auto">
          Your business deserves its own online store
        </h1>
        <p className="text-[#A9BBB1] text-base mt-5 max-w-sm mx-auto leading-relaxed">
          Share one link anywhere — TikTok, Instagram, WhatsApp — and let customers browse, search, and order from you directly.
        </p>

        <div className="flex flex-col items-center gap-3 mt-8">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full max-w-[320px] bg-[#3DDC84] hover:bg-[#34C476] transition-colors text-[#0F1A14] font-bold text-base rounded-xl py-4 flex items-center justify-center gap-2"
          >
            Create Your Store <ArrowRight size={19} />
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="w-full max-w-[320px] border border-[#3A4F42] text-white font-semibold text-base rounded-xl py-4"
          >
            Log In
          </button>
        </div>

        <p className="text-[#4A5D51] text-sm mt-4">No card needed. Free to start.</p>

        <div className="flex items-center justify-center gap-1.5 mt-5">
          <span className="text-amber-400 text-base">★★★★★</span>
          <span className="text-[#8AA396] text-sm">Trusted by business owners across Nigeria</span>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="w-[260px] rounded-[30px] border-[6px] border-[#22362A] bg-[#0F1A14] overflow-hidden shadow-2xl">
            <div className="px-4 pt-5 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-md bg-[#3DDC84] flex items-center justify-center shrink-0">
                  <Store size={15} className="text-[#0F1A14]" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold leading-tight flex items-center gap-1">
                    Amaka's Closet
                    <span className="text-[8px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-400/40">
                      👑
                    </span>
                  </p>
                  <p className="text-[9px] text-[#4A5D51]">Lagos, Nigeria</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 mb-3">
                <span className="text-[#3DDC84] text-[10px]">★★★★★</span>
                <span className="text-[9px] text-[#8AA396] ml-1">4.9 (32)</span>
              </div>
              <div className="relative mb-3">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4A5D51]" />
                <div className="w-full bg-[#16241C] border border-[#22362A] rounded-md pl-8 pr-2 py-2 text-[10px] text-[#4A5D51]">
                  Search products
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#16241C] border border-[#22362A] rounded-lg overflow-hidden">
                  <div className="w-full h-16 bg-gradient-to-br from-[#1B3324] to-[#22362A]" />
                  <div className="p-2">
                    <p className="text-[9px] font-medium truncate">Ankara Dress</p>
                    <p className="text-[9px] text-[#3DDC84] font-semibold mt-0.5">₦18,000</p>
                  </div>
                </div>
                <div className="bg-[#16241C] border border-[#22362A] rounded-lg overflow-hidden">
                  <div className="w-full h-16 bg-gradient-to-br from-[#1B3324] to-[#22362A]" />
                  <div className="p-2">
                    <p className="text-[9px] font-medium truncate">Beaded Bag</p>
                    <p className="text-[9px] text-[#3DDC84] font-semibold mt-0.5">₦9,500</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#16241C] border-t border-[#22362A] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px]">
                <ShoppingCart size={13} className="text-[#3DDC84]" />
                2 items
              </div>
              <span className="text-[10px] text-[#3DDC84] font-semibold">₦27,500 · Review</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-12 border-t border-[#22362A]">
        <h2 className="text-2xl font-bold mb-4 leading-tight">
          Still selling only through social media?
        </h2>
        <p className="text-[#A9BBB1] text-base leading-relaxed mb-6">
          Your products can easily get buried on TikTok, Instagram, Facebook and WhatsApp. Shopvora gives your customers one place to see everything you sell, search for what they want, and order — no scrolling through hundreds of posts.
        </p>
        <button
          type="button"
          onClick={onGetStarted}
          className="bg-[#3DDC84] text-[#0F1A14] font-bold text-base rounded-xl px-6 py-3.5 flex items-center gap-2"
        >
          Create Your Store <ArrowRight size={18} />
        </button>
      </div>

      <div className="px-5 py-12 bg-[#16241C] border-y border-[#22362A]">
        <h2 className="text-2xl font-bold mb-1">How it works</h2>
        <p className="text-[#8AA396] text-base mb-8">Get your store live in 4 simple steps.</p>
        <div className="space-y-7">
          {[
            { n: "1", title: "Create your store", body: "Sign up and get your own unique store link." },
            { n: "2", title: "Add your products", body: "Upload photos, prices and descriptions — choose what to feature." },
            { n: "3", title: "Share your link", body: "Put it in your TikTok, Instagram, Facebook or WhatsApp bio, or use it in ads." },
            { n: "4", title: "Receive orders on WhatsApp", body: "Customers browse, add to cart, and send you the full order — ready to confirm." },
          ].map((step) => (
            <div key={step.n} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#3DDC84] text-[#0F1A14] flex items-center justify-center text-base font-bold shrink-0">
                {step.n}
              </div>
              <div>
                <p className="font-bold text-base mb-1">{step.title}</p>
                <p className="text-[#A9BBB1] text-base leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-12">
        <h2 className="text-2xl font-bold mb-6">Your customers can</h2>
        <div className="space-y-4">
          {[
            { icon: <Search size={18} />, text: "Search your products" },
            { icon: <ShoppingCart size={18} />, text: "Add products to cart" },
            { icon: <MessageCircle size={18} />, text: "Send their order directly to WhatsApp" },
            { icon: <Check size={18} />, text: "See exactly what they'll pay before ordering" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-[#3DDC84] shrink-0">{item.icon}</div>
              <p className="text-base text-[#D6E3DA]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-12 bg-[#16241C] border-y border-[#22362A]">
        <h2 className="text-2xl font-bold mb-4 leading-tight">
          Make your store look like your business
        </h2>
        <p className="text-[#A9BBB1] text-base leading-relaxed mb-6">
          Customize your storefront with your brand, banner, product photos and categories. Premium sellers can also upload their CAC certificate to build extra trust with customers.
        </p>
        <div className="flex items-center gap-2 text-[#3DDC84] text-sm font-medium">
          <Crown size={16} />
          Available on the Premium plan
        </div>
      </div>

      <div className="px-5 py-12">
        <h2 className="text-2xl font-bold mb-6">Why business owners choose Shopvora</h2>
        <div className="space-y-3.5">
          {[
            "Your own store link",
            "No complicated website setup",
            "Easy product management",
            "WhatsApp ordering, the way you already sell",
            "Mobile-friendly storefront",
            "Searchable, organized products",
          ].map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check size={18} className="text-[#3DDC84] shrink-0 mt-0.5" />
              <p className="text-base text-[#D6E3DA] leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-12 bg-[#16241C] border-y border-[#22362A]">
        <h2 className="text-2xl font-bold mb-4 leading-tight">
          Your store is open even when you're not
        </h2>
        <p className="text-[#A9BBB1] text-base leading-relaxed mb-3">
          A customer can visit your store, find what they want, add it to their cart, and send the order to your WhatsApp. When you come online, you'll see exactly what they ordered and can continue from there.
        </p>
        <p className="text-[#3DDC84] text-base font-semibold italic">Sell while you sleep.</p>
      </div>

      <div className="px-5 py-12">
        <h2 className="text-2xl font-bold mb-6">What sellers say</h2>
        <div className="bg-[#16241C] border border-[#22362A] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-[#22362A]" />
            <div>
              <p className="text-base font-semibold">Grace A.</p>
              <p className="text-sm text-[#8AA396]">Fashion Store Owner</p>
            </div>
          </div>
          <p className="text-base text-[#D6E3DA] leading-relaxed mb-3">
            "Shopvora made it so easy for me to get my products online. I've had more orders, and my customers love how simple it is to shop."
          </p>
          <span className="text-amber-400 text-sm">★★★★★</span>
        </div>
        <p className="text-[#4A5D51] text-sm mt-3 italic">More seller stories coming soon.</p>
      </div>

      <div className="px-5 py-14 text-center bg-[#1B3324] border-t border-[#3DDC84]">
        <h2 className="text-2xl font-bold mb-3 leading-tight">
          Ready to give your business its own online store?
        </h2>
        <p className="text-[#A9BBB1] text-base mb-7 leading-relaxed">
          Create your store today and start sharing one simple link with your customers.
        </p>
        <button
          type="button"
          onClick={onGetStarted}
          className="w-full max-w-[320px] bg-[#3DDC84] hover:bg-[#34C476] transition-colors text-[#0F1A14] font-bold text-base rounded-xl py-4 flex items-center justify-center gap-2 mx-auto"
        >
          Create Your Store <ArrowRight size={19} />
        </button>
        <button
          type="button"
          onClick={onLogin}
          className="text-[#8AA396] text-sm mt-4 underline"
        >
          Already have an account? Log in
        </button>
      </div>

      <div className="border-t border-[#22362A] px-5 py-8 text-center">
        <p className="text-[#4A5D51] text-sm">© 2026 Shopvora</p>
      </div>
    </div>
  );
}
