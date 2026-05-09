import "./styles/base.css";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/dashboard/Users";
import Communities from "./pages/dashboard/Communities";
import Reports from "./pages/dashboard/Reports";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";
import Profile from "./pages/dashboard/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // 🔥 READ TOKEN FROM URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    setAuthReady(true);
  }, []);

  // ⛔ WAIT until token is stored
  if (!authReady) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/users" element={<Users />} />
            <Route path="/dashboard/communities" element={<Communities />} />
            <Route path="/dashboard/moderation" element={<Reports />} />
            <Route path="/dashboard/reports" element={<Reports />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const container = document.getElementById("root");

if (container) {
  const existingRoot = container._root;

  if (existingRoot) {
    existingRoot.render(<App />);
  } else {
    const root = createRoot(container);
    container._root = root;
    root.render(<App />);
  }
}