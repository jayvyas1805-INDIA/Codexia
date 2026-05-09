import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import '../../styles/dashboard.css';
import { isAuthenticated } from '../../apis/api';
export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const handleProfileClick = () => {
        navigate('/dashboard/profile');
    };
  // Attempt to open the MainPage and request its token via postMessage
  const requestTokenFromMain = () => {
    const mainUrl = import.meta.env.VITE_MAINPAGE_URL || 'http://localhost:5173';
    const win = window.open(mainUrl, 'MainPageWindow');
    if (!win) return;

    const handleMessage = (e) => {
      if (!e || !e.data) return;
      if (e.data.type === 'TOKEN_RESPONSE') {
        window.removeEventListener('message', handleMessage);
        if (e.data.token) {
          try { localStorage.setItem('token', e.data.token); } catch (err) {}
          // also store user if available
          if (e.data.user) {
            try { localStorage.setItem('user', JSON.stringify(e.data.user)); } catch (err) {}
          }
          window.location.reload();
        } else {
          // no token available on MainPage
          // leave window open for user to login
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // attempt to send request repeatedly (page may be loading)
    let tries = 0;
    const interval = setInterval(() => {
      tries += 1;
      if (win.closed || tries > 20) { clearInterval(interval); window.removeEventListener('message', handleMessage); return; }
      try { win.postMessage({ type: 'TOKEN_REQUEST' }, mainUrl); } catch (err) {}
    }, 300);
  };

  return (<nav className="dashboard-navbar">
      <div className="navbar-search">
        <input type="text" placeholder="Search users, communities, reports..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input"/>
      </div>
      <div className="navbar-actions">
        <button className="navbar-action-button" title="Notifications">
          <Bell size={20}/>
          <div className="notification-badge"></div>
        </button>
        {/* <button className="profile-button" onClick={handleProfileClick} title="View Profile">
          <div className="profile-avatar">JD</div>
          <span>John Doe</span>
          <User size={16}/>
        </button> */}
      </div>
      {!isAuthenticated() && (<div style={{ position: 'absolute', left: 260, right: 0, bottom: -38, padding: '8px 16px', background: '#fff7ed', borderTop: '1px solid var(--color-border)', color: '#92400e', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
        Not signed in — some admin data requires login.
        <button onClick={() => requestTokenFromMain()} style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #ffd7a7', background: '#fff', cursor: 'pointer' }}>Open MainPage</button>
        <button onClick={() => {
          const t = window.prompt('Paste admin JWT token from MainPage (will be saved to localStorage)');
          if (t) {
            localStorage.setItem('token', t);
            window.location.reload();
          }
        }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ffd7a7', background: '#fff', cursor: 'pointer' }}>Paste Token</button>
      </div>)}
    </nav>);
}
