import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import AuthPage from "./pages/AuthPage";
import StoreSetup from "./pages/StoreSetup";
import ProductUpload from "./pages/ProductUpload";

export default function App() {
  const [user, setUser] = useState(null);
  const [storeCreated, setStoreCreated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
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

  if (!user) {
    return <AuthPage onLoggedIn={handleLoggedIn} />;
  }

  if (!storeCreated) {
    return <StoreSetup user={user} onStoreCreated={() => setStoreCreated(true)} />;
  }

  return <ProductUpload user={user} />;
           }
