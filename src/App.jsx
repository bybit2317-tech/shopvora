import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import StoreSetup from "./pages/StoreSetup";

export default function App() {
  const [user, setUser] = useState(null);
  const [storeCreated, setStoreCreated] = useState(false);

  if (!user) {
    return <AuthPage onLoggedIn={(u) => setUser(u)} />;
  }

  if (!storeCreated) {
    return <StoreSetup user={user} onStoreCreated={() => setStoreCreated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0F1A14] flex items-center justify-center text-white">
      <p>Store created! Product upload page coming next.</p>
    </div>
  );
}
