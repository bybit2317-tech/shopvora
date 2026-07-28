import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import StoreSetup from "./pages/StoreSetup";
import ProductUpload from "./pages/ProductUpload";

export default function App() {
  const [user, setUser] = useState(null);
  const [storeCreated, setStoreCreated] = useState(false);

  if (!user) {
    return <AuthPage onLoggedIn={(u) => setUser(u)} />;
  }

  if (!storeCreated) {
    return <StoreSetup user={user} onStoreCreated={() => setStoreCreated(true)} />;
  }

  return <ProductUpload user={user} />;
}
