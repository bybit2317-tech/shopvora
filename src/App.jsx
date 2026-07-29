import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import AuthPage from "./pages/AuthPage";
import StoreSetup from "./pages/StoreSetup";
import ProductUpload from "./pages/ProductUpload";
import StorePage from "./pages/StorePage";

export default function App() {
  const [user, setUser] = useState(null);
  const [storeCreated, setStoreCreated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [storeSlug, setStoreSlug] = useState(null);

  useEffect(() => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
    if (path.length > 0) {
      setStoreSlug(path);
      setCheckingSession(false);
      return;
    }
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      setUser(session.user);
      await checkStoreExists(session.user.id);
    }
    setCheckingSession(false);
  };

  const checkStoreExists = async (userId) => {
    const { data } = await supabase
      .from("stores")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (data) setStoreCreated(true);
  };

  const handleLoggedIn = async (loggedInUser) => {
    setUser(loggedInUser);
    await checkStoreExists(loggedInUser.id);
  };

  if (checkingSession) {
    return <div className="min-h-screen bg-[#0F1A14]" />;
  }

  if (storeSlug) {
    return <StorePage slug={storeSlug} />;
  }

  if (!user) {
    return <AuthPage onLoggedIn={handleLoggedIn} />;
  }

  if (!storeCreated) {
    return <StoreSetup user={user} onStoreCreated={() => setStoreCreated(true)} />;
  }

  return <ProductUpload user={user} />;
      }
