import { Settings as SettingsIcon, Save } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import '../../styles/dashboard.css';
export default function Settings() {
    return (<div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2 className="section-title">
              <SettingsIcon size={24}/>
              Settings
            </h2>

            {/* General Settings */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#000' }}>
                General Settings
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                    Platform Name
                  </label>
                  <input type="text" defaultValue="Codexia" className="filter-input" style={{ width: '100%' }}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                    Platform URL
                  </label>
                  <input type="text" defaultValue="https://codexia.com" className="filter-input" style={{ width: '100%' }}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                    Contact Email
                  </label>
                  <input type="email" defaultValue="admin@codexia.com" className="filter-input" style={{ width: '100%' }}/>
                </div>
              </div>
            </div>

            {/* Moderation Settings */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#000' }}>
                Moderation Settings
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                      Auto-ban after warnings
                    </label>
                    <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                      Automatically ban users after 3 warnings
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                      Require approval for new posts
                    </label>
                    <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                      Review posts before they're published
                    </p>
                  </div>
                  <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                      Enable auto-delete spam
                    </label>
                    <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                      Automatically remove detected spam content
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }}/>
                </div>
              </div>
            </div>

            {/* Community Settings */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#000' }}>
                Community Settings
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                    Minimum users to create community
                  </label>
                  <input type="number" defaultValue="10" className="filter-input" style={{ width: '100%' }}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
                    Moderation queue limit
                  </label>
                  <input type="number" defaultValue="100" className="filter-input" style={{ width: '100%' }}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                      Require manual approval for new communities
                    </label>
                    <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                      Admin must approve community creation requests
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }}/>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="card" style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#000' }}>
                Notification Settings
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                    Email notifications
                  </label>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                    Report notifications
                  </label>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                    User activity digest
                  </label>
                  <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }}/>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={18}/>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>);
}
