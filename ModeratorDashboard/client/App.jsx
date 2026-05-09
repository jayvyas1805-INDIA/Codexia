import "./styles/moderatords.css";

import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Index from "./pages/Index.jsx";
import Users from "./pages/Users.jsx";
import Reports from "./pages/Reports.jsx";
import Content from "./pages/Content.jsx";
import Announcements from "./pages/Announcements.jsx";
import Community from "./pages/Community.jsx";
import UserDetail from "./pages/UserDetail.jsx";
import ModeratorDashboard from "./pages/ModeratorDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

const App = () => {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // remove token from URL after saving
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    setAuthReady(true);
  }, []);

  if (!authReady) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/content" element={<Content />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/:id" element={<Community />} />
          <Route path="/user/:userId" element={<UserDetail />} />
          <Route
            path="/moderator/community/:communityId"
            element={<ModeratorDashboard />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")).render(<App />);