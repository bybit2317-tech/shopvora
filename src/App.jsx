import { useState } from "react";
import AuthPage from "./pages/AuthPage";

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <AuthPage onLoggedIn={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-[#0F1A14] flex items-center justify-center text-white">
      <p>Logged in! Store setup page coming next.</p>
    </div>
  );
      }
