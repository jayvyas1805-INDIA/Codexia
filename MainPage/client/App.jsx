import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Community from './pages/Community';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Problem from './pages/Problem';
import BestPractice from './pages/BestPractice';
import NotFound from './pages/NotFound';

// Auth context
export const AuthContext = React.createContext();

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    setUser(stored ? JSON.parse(stored) : null);
    setLoading(false);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-900" />;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function App() {
  
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };



  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/community/:id" element={<Community />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/problem/:id" element={<ProtectedRoute><Problem /></ProtectedRoute>} />
          <Route path="/best-practice" element={<ProtectedRoute><BestPractice /></ProtectedRoute>} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
