import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("shopvora_install_dismissed");
    if (dismissed) return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("shopvora_install_dismissed", "true");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-[#16241C] border border-[#3DDC84] rounded-2xl px-4 py-3.5 shadow-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#3DDC84] flex items-center justify-center shrink-0">
          <Download size={18} className="text-[#0F1A14]" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">Install Shopvora</p>
          <p className="text-[#8AA396] text-xs">Add it to your home screen for quick access</p>
        </div>
        <button
          type="button"
          onClick={handleInstall}
          className="shrink-0 bg-[#3DDC84] text-[#0F1A14] text-xs font-bold rounded-lg px-3.5 py-2"
        >
          Install
        </button>
        <button type="button" onClick={handleDismiss} className="shrink-0 text-[#4A5D51]">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
