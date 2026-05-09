import { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, Camera } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import '../../styles/dashboard.css';
import { getMeApi } from '../../apis/api';
const adminData = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@codexia.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    role: 'Super Admin',
    joinDate: '2023-01-15',
    lastLogin: '2024-03-15 14:30',
    avatar: 'JD',
    bio: 'Platform administrator with full system access and moderation capabilities.',
    permissions: [
        'User Management',
        'Community Approval',
        'Content Moderation',
        'Report Management',
        'Analytics Access',
        'System Settings',
        'Admin User Management',
    ],
    activityLog: [
        { action: 'Suspended user "John Smith"', date: '2024-03-15' },
        { action: 'Approved community "Python Dev"', date: '2024-03-14' },
        { action: 'Removed post #4521', date: '2024-03-13' },
        { action: 'Promoted "Jane Wilson" to Moderator', date: '2024-03-12' },
        { action: 'Updated platform settings', date: '2024-03-11' },
    ],
};
export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(adminData);
  const [formData, setFormData] = useState({
    name: adminData.name,
    email: adminData.email,
    phone: adminData.phone,
    location: adminData.location,
    bio: adminData.bio,
  });

  useEffect(() => {
    let mounted = true;
    const fetchMe = async () => {
      try {
        const res = await getMeApi();
        if (!mounted) return;
        if (res?.data) {
          const u = res.data;
          const p = {
            id: u._id || u.id,
            name: u.username || u.name || (u.email || '').split('@')[0],
            email: u.email || adminData.email,
            phone: u.phone || adminData.phone,
            location: u.location || adminData.location,
            role: u.role || adminData.role,
            joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : adminData.joinDate,
            lastLogin: u.lastLogin || adminData.lastLogin,
            avatar: u.profilePicture || (u.username ? u.username.charAt(0).toUpperCase() : adminData.avatar),
            bio: u.bio || adminData.bio,
          };
          setProfile(p);
          setFormData({ name: p.name, email: p.email, phone: p.phone, location: p.location, bio: p.bio });
        }
      } catch (err) {
        // keep local adminData as fallback
      }
    };
    fetchMe();
    return () => { mounted = false; };
  }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSave = () => {
        setIsEditing(false);
        // Save logic would go here
    };
    return (<div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2 className="section-title">
              <User size={24}/>
              Admin Profile
            </h2>

            {/* Profile Header Card */}
            <div className="card mb-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-6 items-start flex-1">
                  {/* Profile Picture */}
                  <div className="relative flex-shrink-0 group">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={!isEditing}/>
                    <div className="w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold flex-shrink-0 relative overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110" style={{
            background: profileImage
                ? `url(${profileImage}) center/cover`
                : 'linear-gradient(135deg, #1a1a1a 0%, #505050 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }} onClick={() => isEditing && fileInputRef.current?.click()}>
                      {!profileImage && adminData.avatar}
                      {isEditing && (<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Camera size={24} className="text-white"/>
                        </div>)}
                    </div>
                  </div>

                  <div className="flex-1">
                    {isEditing ? (<>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-field w-full mb-3 text-2xl font-bold"/>
                        <textarea name="bio" value={formData.bio} onChange={handleInputChange} className="input-field w-full min-h-16"/>
                      </>) : (<>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                          {formData.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{formData.bio}</p>
                      </>)}
                    <span className="badge badge-primary inline-block mb-4">
                      {profile.role}
                    </span>
                  </div>
                </div>

                {isEditing ? (<div className="flex gap-2">
                    <button className="btn-primary flex items-center gap-2" onClick={handleSave}>
                      <Save size={16}/>
                      Save
                    </button>
                    <button className="btn-secondary flex items-center gap-2" onClick={() => setIsEditing(false)}>
                      <X size={16}/>
                      Cancel
                    </button>
                  </div>) : (<button className="px-6 py-2.5 bg-black text-white rounded-lg font-medium flex items-center gap-2 hover:bg-gray-900 transition-all hover:shadow-lg hover:shadow-black/30" onClick={() => setIsEditing(true)} style={{ whiteSpace: 'nowrap' }}>
                    <Edit size={18}/>
                    Edit Profile
                  </button>)}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="card">
                <h3 className="text-base font-bold mb-4 text-gray-900">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <Mail size={20} className="text-gray-700 mt-1 flex-shrink-0"/>
                    <div className="flex-1">
                      {isEditing ? (<input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field w-full"/>) : (<>
                          <p className="text-xs text-gray-600 mb-1">Email</p>
                          <p className="text-sm text-gray-900 font-medium">{formData.email}</p>
                        </>)}
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <Phone size={20} className="text-gray-700 mt-1 flex-shrink-0"/>
                    <div className="flex-1">
                      {isEditing ? (<input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field w-full"/>) : (<>
                          <p className="text-xs text-gray-600 mb-1">Phone</p>
                          <p className="text-sm text-gray-900 font-medium">{formData.phone}</p>
                        </>)}
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <MapPin size={20} className="text-gray-700 mt-1 flex-shrink-0"/>
                    <div className="flex-1">
                      {isEditing ? (<input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input-field w-full"/>) : (<>
                          <p className="text-xs text-gray-600 mb-1">Location</p>
                          <p className="text-sm text-gray-900 font-medium">{formData.location}</p>
                        </>)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="card">
                <h3 className="text-base font-bold mb-4 text-gray-900">Account Information</h3>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <Calendar size={20} className="text-gray-600 mt-1 flex-shrink-0"/>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Join Date</p>
                      <p className="text-sm text-gray-900 font-medium">{profile.joinDate}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <Shield size={20} className="text-gray-600 mt-1 flex-shrink-0"/>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Last Login</p>
                      <p className="text-sm text-gray-900 font-medium">{profile.lastLogin}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <Shield size={20} className="text-gray-700 mt-1 flex-shrink-0"/>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Role</p>
                      <p className="text-sm text-gray-900 font-medium">{profile.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="card mb-6">
              <h3 className="text-base font-bold mb-4 text-gray-900">Permissions & Roles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {adminData.permissions.map((permission, index) => (<div key={index} className="px-4 py-3 bg-gray-100 rounded-lg flex items-center gap-2 border border-gray-300">
                    <div className="w-2 h-2 rounded-full bg-green-600"/>
                    <span className="text-sm text-gray-900 font-medium">{permission}</span>
                  </div>))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-base font-bold mb-4 text-gray-900">Recent Activity</h3>
              <div className="space-y-1">
                {adminData.activityLog.map((log, index) => (<div key={index} className={`py-3 flex justify-between items-center ${index < adminData.activityLog.length - 1 ? 'border-b border-gray-300' : ''}`}>
                    <p className="text-sm text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-600">{log.date}</p>
                  </div>))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
