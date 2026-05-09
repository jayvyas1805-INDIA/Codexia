// // import React, { useState, useEffect, useContext } from 'react';
// // import { useParams, Link, useNavigate } from 'react-router-dom';
// // import { AuthContext } from '../App';
// // import { UserAPI, PostAPI } from '../lib/storage';
// // import PostCard from '../components/PostCard';
// // import Modal from '../components/Modal';
// // import Navbar from '../components/Navbar';
// // import '../styles/Profile.css';

// // export default function Profile() {
// //   const { username } = useParams();
// //   const navigate = useNavigate();
// //   const { user: currentUser, login } = useContext(AuthContext);
// //   const [profileUser, setProfileUser] = useState(null);
// //   const [userPosts, setUserPosts] = useState([]);
// //   const [allUsers, setAllUsers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [isEditOpen, setIsEditOpen] = useState(false);
// //   const [editBio, setEditBio] = useState('');
// //   const [editAvatarColor, setEditAvatarColor] = useState('gray');
// //   const [editProfilePicture, setEditProfilePicture] = useState(null);
// //   const [previewImage, setPreviewImage] = useState(null);

// //   useEffect(() => {
// //     const user = UserAPI.getUserByUsername(username);
// //     if (!user) {
// //       navigate('/feed');
// //       return;
// //     }

// //     const posts = PostAPI.getPostsByAuthor(user.id);
// //     const users = UserAPI.getAllUsers();

// //     setProfileUser(user);
// //     setUserPosts(posts);
// //     setAllUsers(users);
// //     setEditBio(user.bio || '');
// //     setEditAvatarColor(user.avatarColor || 'gray');
// //     setEditProfilePicture(user.profilePicture || null);
// //     setPreviewImage(user.profilePicture || null);
// //     setLoading(false);
// //   }, [username, navigate]);

// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       // Check file size (max 2MB)
// //       if (file.size > 2 * 1024 * 1024) {
// //         alert('Image size must be less than 2MB');
// //         return;
// //       }

// //       // Check file type
// //       if (!file.type.startsWith('image/')) {
// //         alert('Please select a valid image file');
// //         return;
// //       }

// //       const reader = new FileReader();
// //       reader.onload = (event) => {
// //         const base64String = event.target.result;
// //         setEditProfilePicture(base64String);
// //         setPreviewImage(base64String);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleRemoveImage = () => {
// //     setEditProfilePicture(null);
// //     setPreviewImage(null);
// //   };

// //   const handleSaveProfile = () => {
// //     try {
// //       const updatedUser = UserAPI.updateUser(profileUser.id, {
// //         bio: editBio,
// //         avatarColor: editAvatarColor,
// //         profilePicture: editProfilePicture,
// //       });

// //       setProfileUser(updatedUser);

// //       // Update auth context if this is the current user
// //       if (currentUser && currentUser.id === profileUser.id) {
// //         login(updatedUser);
// //       }

// //       setIsEditOpen(false);
// //     } catch (error) {
// //       alert('Failed to update profile: ' + error.message);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-white flex items-center justify-center">
// //         <div className="text-gray-600">Loading...</div>
// //       </div>
// //     );
// //   }

// //   if (!profileUser) {
// //     return (
// //       <div className="min-h-screen bg-white">
// //         <Navbar />
// //         <div className="max-w-4xl mx-auto px-4 py-12 text-center">
// //           <p className="text-gray-600">User not found</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-white">
// //       <Navbar />

// //       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Profile Header */}
// //         <div className="card bg-white border border-gray-300 mb-8">
// //           <div className="flex items-start gap-6 mb-6">
// //             {profileUser.profilePicture ? (
// //               <img
// //                 src={profileUser.profilePicture}
// //                 alt={profileUser.username}
// //                 className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
// //               />
// //             ) : (
// //               <div className={`w-24 h-24 rounded-full bg-gradient-to-br flex items-center justify-center ${
// //                 profileUser.avatarColor === 'purple' ? 'from-purple-400 to-purple-700' :
// //                 profileUser.avatarColor === 'blue' ? 'from-blue-400 to-blue-700' :
// //                 profileUser.avatarColor === 'red' ? 'from-red-400 to-red-700' :
// //                 profileUser.avatarColor === 'green' ? 'from-green-400 to-green-700' :
// //                 'from-gray-300 to-gray-600'
// //               }`}>
// //                 <span className="text-4xl font-bold text-white">{profileUser.username.charAt(0).toUpperCase()}</span>
// //               </div>
// //             )}
// //             <div className="flex-1">
// //               <div className="flex items-center justify-between mb-2">
// //                 <h1 className="text-3xl font-bold text-gray-900">@{profileUser.username}</h1>
// //                 {currentUser && currentUser.id === profileUser.id && (
// //                   <button
// //                     onClick={() => setIsEditOpen(true)}
// //                     className="btn-secondary text-sm"
// //                   >
// //                     Edit Profile
// //                   </button>
// //                 )}
// //               </div>
// //               <p className="text-gray-600 mb-4">{profileUser.bio || 'No bio yet'}</p>
// //               <div className="flex gap-6">
// //                 <div>
// //                   <div className="text-2xl font-bold text-black">{profileUser.reputation}</div>
// //                   <div className="text-sm text-gray-600">Reputation</div>
// //                 </div>
// //                 <div>
// //                   <div className="text-2xl font-bold text-gray-700">{userPosts.length}</div>
// //                   <div className="text-sm text-gray-600">Posts</div>
// //                 </div>
// //                 <div>
// //                   <div className="text-2xl font-bold text-gray-800">
// //                     {profileUser.role === 'admin' ? 'Admin' : profileUser.role === 'moderator' ? 'Moderator' : 'Member'}
// //                   </div>
// //                   <div className="text-sm text-gray-400">Role</div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Member Since */}
// //           <div className="text-sm text-gray-600 border-t border-gray-300 pt-4">
// //             Member since {new Date(profileUser.createdAt).toLocaleDateString()}
// //           </div>
// //         </div>

// //         {/* Posts */}
// //         <div>
// //           <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts ({userPosts.length})</h2>

// //           {userPosts.length > 0 ? (
// //             <div className="space-y-4">
// //               {userPosts.map((post) => (
// //                 <PostCard
// //                   key={post.id}
// //                   post={post}
// //                   author={profileUser}
// //                   onVote={(updated) => {
// //                     setUserPosts(userPosts.map((p) => (p.id === updated.id ? updated : p)));
// //                   }}
// //                 />
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="text-center py-12 card bg-white">
// //               <p className="text-gray-600">This user hasn't posted yet</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Edit Profile Modal */}
// //       <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile" size="md">
// //         <div className="space-y-4">
// //           {/* Profile Picture Upload */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-900 mb-3">Profile Picture</label>
// //             <div className="flex flex-col items-center gap-4">
// //               {previewImage ? (
// //                 <img
// //                   src={previewImage}
// //                   alt="Preview"
// //                   className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
// //                 />
// //               ) : (
// //                 <div className={`w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center ${
// //                   editAvatarColor === 'purple' ? 'from-purple-400 to-purple-700' :
// //                   editAvatarColor === 'blue' ? 'from-blue-400 to-blue-700' :
// //                   editAvatarColor === 'red' ? 'from-red-400 to-red-700' :
// //                   editAvatarColor === 'green' ? 'from-green-400 to-green-700' :
// //                   'from-gray-300 to-gray-600'
// //                 }`}>
// //                   <span className="text-3xl font-bold text-white">{profileUser.username.charAt(0).toUpperCase()}</span>
// //                 </div>
// //               )}
// //               <div className="flex gap-2">
// //                 <input
// //                   type="file"
// //                   accept="image/*"
// //                   onChange={handleImageChange}
// //                   className="hidden"
// //                   id="profile-picture-input"
// //                 />
// //                 <label
// //                   htmlFor="profile-picture-input"
// //                   className="btn-primary text-sm cursor-pointer"
// //                 >
// //                   Upload Image
// //                 </label>
// //                 {editProfilePicture && (
// //                   <button
// //                     onClick={handleRemoveImage}
// //                     className="btn-secondary text-sm"
// //                   >
// //                     Remove
// //                   </button>
// //                 )}
// //               </div>
// //               <p className="text-xs text-gray-500">Max 2MB. JPG, PNG, GIF supported.</p>
// //             </div>
// //           </div>

// //           {/* Avatar Color Selector */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-900 mb-3">Avatar Color (fallback)</label>
// //             <div className="flex gap-3">
// //               {['gray', 'purple', 'blue', 'red', 'green'].map((color) => (
// //                 <button
// //                   key={color}
// //                   onClick={() => setEditAvatarColor(color)}
// //                   className={`w-10 h-10 rounded-full bg-gradient-to-br transition-all border-2 ${
// //                     editAvatarColor === color ? 'border-black scale-110' : 'border-gray-300'
// //                   } ${
// //                     color === 'purple' ? 'from-purple-400 to-purple-700' :
// //                     color === 'blue' ? 'from-blue-400 to-blue-700' :
// //                     color === 'red' ? 'from-red-400 to-red-700' :
// //                     color === 'green' ? 'from-green-400 to-green-700' :
// //                     'from-gray-300 to-gray-600'
// //                   }`}
// //                   title={color.charAt(0).toUpperCase() + color.slice(1)}
// //                 />
// //               ))}
// //             </div>
// //           </div>

// //           {/* Bio Input */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-900 mb-2">Bio</label>
// //             <textarea
// //               value={editBio}
// //               onChange={(e) => setEditBio(e.target.value)}
// //               className="input-field resize-none"
// //               rows="4"
// //               placeholder="Tell us about yourself..."
// //               maxLength={200}
// //             />
// //             <p className="text-xs text-gray-600 mt-1">{editBio.length}/200</p>
// //           </div>

// //           {/* Action Buttons */}
// //           <div className="flex gap-3 justify-end">
// //             <button onClick={() => setIsEditOpen(false)} className="btn-secondary">
// //               Cancel
// //             </button>
// //             <button onClick={handleSaveProfile} className="btn-primary">
// //               Save Changes
// //             </button>
// //           </div>
// //         </div>
// //       </Modal>
// //     </div>
// //   );
// // }


// import React, { useState, useEffect, useContext} from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../App';
// import { getMeApi } from '../apis/api.js';
// import PostCard from '../components/PostCard';
// import Modal from '../components/Modal';
// import Navbar from '../components/Navbar';
// import '../styles/Profile.css';

// export default function Profile() {
//   const navigate = useNavigate();
//   const { user: currentUser, login } = useContext(AuthContext);

//   const [profileUser, setProfileUser] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [editBio, setEditBio] = useState('');
//   const [editAvatarColor, setEditAvatarColor] = useState('gray');
//   const [editProfilePicture, setEditProfilePicture] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);const { username } = useParams();

// useEffect(() => {
//   const fetchProfile = async () => {
//     try {
//       setLoading(true);

//       const res = await getUserByUsernameApi(username);
//       setProfileUser(res.data);
//     } catch (error) {
//       alert(error.message || "User not found");
//       navigate("/feed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchProfile();
// }, [username, navigate]);

//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         setLoading(true);

//         const res = await getMeApi();
//         const user = res.data;

//         setProfileUser(user);
//         setEditBio(user.bio || '');
//         setEditAvatarColor(user.avatarColor || 'gray');
//         setEditProfilePicture(user.profilePicture || null);
//         setPreviewImage(user.profilePicture || null);

//         setUserPosts([]);
//       } catch (error) {
//         alert(error.message || 'Failed to fetch user');
//         navigate('/login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMe();
//   }, [navigate]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         alert('Image size must be less than 2MB');
//         return;
//       }

//       if (!file.type.startsWith('image/')) {
//         alert('Please select a valid image file');
//         return;
//       }

//       const reader = new FileReader();

//       reader.onload = (event) => {
//         const base64String = event.target.result;
//         setEditProfilePicture(base64String);
//         setPreviewImage(base64String);
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = () => {
//     setEditProfilePicture(null);
//     setPreviewImage(null);
//   };

//   const handleSaveProfile = () => {
//     const updatedUser = {
//       ...profileUser,
//       bio: editBio,
//       avatarColor: editAvatarColor,
//       profilePicture: editProfilePicture,
//     };

//     setProfileUser(updatedUser);

//     if (currentUser && currentUser._id === profileUser._id) {
//       login(updatedUser);
//       localStorage.setItem('user', JSON.stringify(updatedUser));
//     }

//     setIsEditOpen(false);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-gray-600">Loading...</div>
//       </div>
//     );
//   }

//   if (!profileUser) {
//     return (
//       <div className="min-h-screen bg-white">
//         <Navbar />
//         <div className="max-w-4xl mx-auto px-4 py-12 text-center">
//           <p className="text-gray-600">User not found</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar />

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Profile Header */}
//         <div className="card bg-white border border-gray-300 mb-8">
//           <div className="flex items-start gap-6 mb-6">
//             {profileUser.profilePicture ? (
//               <img
//                 src={profileUser.profilePicture}
//                 alt={profileUser.username}
//                 className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
//               />
//             ) : (
//               <div
//                 className={`w-24 h-24 rounded-full bg-gradient-to-br flex items-center justify-center ${
//                   profileUser.avatarColor === 'purple'
//                     ? 'from-purple-400 to-purple-700'
//                     : profileUser.avatarColor === 'blue'
//                     ? 'from-blue-400 to-blue-700'
//                     : profileUser.avatarColor === 'red'
//                     ? 'from-red-400 to-red-700'
//                     : profileUser.avatarColor === 'green'
//                     ? 'from-green-400 to-green-700'
//                     : 'from-gray-300 to-gray-600'
//                 }`}
//               >
//                 <span className="text-4xl font-bold text-white">
//                   {profileUser.username?.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//             )}

//             <div className="flex-1">
//               <div className="flex items-center justify-between mb-2">
//                 <h1 className="text-3xl font-bold text-gray-900">
//                   @{profileUser.username}
//                 </h1>

//                 {currentUser && currentUser._id === profileUser._id && (
//                   <button
//                     onClick={() => setIsEditOpen(true)}
//                     className="btn-secondary text-sm"
//                   >
//                     Edit Profile
//                   </button>
//                 )}
//               </div>

//               <p className="text-gray-600 mb-4">
//                 {profileUser.bio || 'No bio yet'}
//               </p>

//               <div className="flex gap-6">
//                 <div>
//                   <div className="text-2xl font-bold text-black">
//                     {profileUser.reputation || 0}
//                   </div>
//                   <div className="text-sm text-gray-600">Reputation</div>
//                 </div>

//                 <div>
//                   <div className="text-2xl font-bold text-gray-700">
//                     {userPosts.length}
//                   </div>
//                   <div className="text-sm text-gray-600">Posts</div>
//                 </div>

//                 <div>
//                   <div className="text-2xl font-bold text-gray-800">
//                     {profileUser.role === 'admin'
//                       ? 'Admin'
//                       : profileUser.role === 'moderator'
//                       ? 'Moderator'
//                       : 'User'}
//                   </div>
//                   <div className="text-sm text-gray-400">Role</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Member Since */}
//           <div className="text-sm text-gray-600 border-t border-gray-300 pt-4">
//             Member since{' '}
//             {profileUser.createdAt
//               ? new Date(profileUser.createdAt).toLocaleDateString()
//               : 'N/A'}
//           </div>
//         </div>

//         {/* Posts */}
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">
//             Posts ({userPosts.length})
//           </h2>

//           {userPosts.length > 0 ? (
//             <div className="space-y-4">
//               {userPosts.map((post) => (
//                 <PostCard
//                   key={post._id}
//                   post={post}
//                   author={profileUser}
//                   onVote={(updated) => {
//                     setUserPosts(
//                       userPosts.map((p) =>
//                         p._id === updated._id ? updated : p
//                       )
//                     );
//                   }}
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12 card bg-white">
//               <p className="text-gray-600">This user hasn't posted yet</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Edit Profile Modal */}
//       <Modal
//         isOpen={isEditOpen}
//         onClose={() => setIsEditOpen(false)}
//         title="Edit Profile"
//         size="md"
//       >
//         <div className="space-y-4">
//           {/* Profile Picture Upload */}
//           <div>
//             <label className="block text-sm font-medium text-gray-900 mb-3">
//               Profile Picture
//             </label>

//             <div className="flex flex-col items-center gap-4">
//               {previewImage ? (
//                 <img
//                   src={previewImage}
//                   alt="Preview"
//                   className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
//                 />
//               ) : (
//                 <div
//                   className={`w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center ${
//                     editAvatarColor === 'purple'
//                       ? 'from-purple-400 to-purple-700'
//                       : editAvatarColor === 'blue'
//                       ? 'from-blue-400 to-blue-700'
//                       : editAvatarColor === 'red'
//                       ? 'from-red-400 to-red-700'
//                       : editAvatarColor === 'green'
//                       ? 'from-green-400 to-green-700'
//                       : 'from-gray-300 to-gray-600'
//                   }`}
//                 >
//                   <span className="text-3xl font-bold text-white">
//                     {profileUser.username?.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//               )}

//               <div className="flex gap-2">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                   id="profile-picture-input"
//                 />

//                 <label
//                   htmlFor="profile-picture-input"
//                   className="btn-primary text-sm cursor-pointer"
//                 >
//                   Upload Image
//                 </label>

//                 {editProfilePicture && (
//                   <button
//                     onClick={handleRemoveImage}
//                     className="btn-secondary text-sm"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>

//               <p className="text-xs text-gray-500">
//                 Max 2MB. JPG, PNG, GIF supported.
//               </p>
//             </div>
//           </div>

//           {/* Avatar Color Selector */}
//           <div>
//             <label className="block text-sm font-medium text-gray-900 mb-3">
//               Avatar Color (fallback)
//             </label>

//             <div className="flex gap-3">
//               {['gray', 'purple', 'blue', 'red', 'green'].map((color) => (
//                 <button
//                   key={color}
//                   onClick={() => setEditAvatarColor(color)}
//                   className={`w-10 h-10 rounded-full bg-gradient-to-br transition-all border-2 ${
//                     editAvatarColor === color
//                       ? 'border-black scale-110'
//                       : 'border-gray-300'
//                   } ${
//                     color === 'purple'
//                       ? 'from-purple-400 to-purple-700'
//                       : color === 'blue'
//                       ? 'from-blue-400 to-blue-700'
//                       : color === 'red'
//                       ? 'from-red-400 to-red-700'
//                       : color === 'green'
//                       ? 'from-green-400 to-green-700'
//                       : 'from-gray-300 to-gray-600'
//                   }`}
//                   title={color.charAt(0).toUpperCase() + color.slice(1)}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Bio Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-900 mb-2">
//               Bio
//             </label>

//             <textarea
//               value={editBio}
//               onChange={(e) => setEditBio(e.target.value)}
//               className="input-field resize-none"
//               rows="4"
//               placeholder="Tell us about yourself..."
//               maxLength={200}
//             />

//             <p className="text-xs text-gray-600 mt-1">{editBio.length}/200</p>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 justify-end">
//             <button
//               onClick={() => setIsEditOpen(false)}
//               className="btn-secondary"
//             >
//               Cancel
//             </button>

//             <button onClick={handleSaveProfile} className="btn-primary">
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { getUserByUsernameApi, getPostsByUserApi } from "../apis/api";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import "../styles/Profile.css";

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, login } = useContext(AuthContext);

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editAvatarColor, setEditAvatarColor] = useState("gray");
  const [editProfilePicture, setEditProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        const res = await getUserByUsernameApi(username);
        const user = res.data;

        setProfileUser(user);
        setEditBio(user.bio || "");
        setEditAvatarColor(user.avatarColor || "gray");
        setEditProfilePicture(user.profilePicture || null);
        setPreviewImage(user.profilePicture || null);
        const postsRes = await getPostsByUserApi(user._id);
        setUserPosts(postsRes.data || []);
      } catch (error) {
        alert(error.message || "User not found");
        navigate("/feed");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, navigate]);

  const isOwnProfile =
    currentUser && String(currentUser._id) === String(profileUser?._id);

  const roleLabel =
    profileUser?.role === "ADMIN"
      ? "Admin"
      : profileUser?.role === "MODERATOR"
        ? "Moderator"
        : "User";

  const avatarGradient =
    profileUser?.avatarColor === "purple"
      ? "from-purple-400 to-purple-700"
      : profileUser?.avatarColor === "blue"
        ? "from-blue-400 to-blue-700"
        : profileUser?.avatarColor === "red"
          ? "from-red-400 to-red-700"
          : profileUser?.avatarColor === "green"
            ? "from-green-400 to-green-700"
            : "from-gray-300 to-gray-600";

  const editAvatarGradient =
    editAvatarColor === "purple"
      ? "from-purple-400 to-purple-700"
      : editAvatarColor === "blue"
        ? "from-blue-400 to-blue-700"
        : editAvatarColor === "red"
          ? "from-red-400 to-red-700"
          : editAvatarColor === "green"
            ? "from-green-400 to-green-700"
            : "from-gray-300 to-gray-600";

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      setEditProfilePicture(event.target.result);
      setPreviewImage(event.target.result);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setEditProfilePicture(null);
    setPreviewImage(null);
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      ...profileUser,
      bio: editBio,
      avatarColor: editAvatarColor,
      profilePicture: editProfilePicture,
    };

    setProfileUser(updatedUser);

    if (isOwnProfile) {
      login(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    setIsEditOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card bg-white border border-gray-300 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {profileUser.profilePicture ? (
              <img
                src={profileUser.profilePicture}
                alt={profileUser.username}
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div
                className={`w-28 h-28 rounded-full bg-gradient-to-br flex items-center justify-center ${avatarGradient}`}
              >
                <span className="text-5xl font-bold text-white">
                  {profileUser.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    @{profileUser.username}
                  </h1>

                  <p className="text-sm text-gray-500 mt-1">
                    {roleLabel} • Joined{" "}
                    {profileUser.createdAt
                      ? new Date(profileUser.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="btn-secondary text-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <p className="text-gray-700 mt-4">
                {profileUser.bio || "No bio added yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Useful Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card bg-white border border-gray-300">
            <div className="text-2xl font-bold text-black">
              {profileUser.reputation || 0}
            </div>
            <div className="text-sm text-gray-600">Reputation</div>
          </div>

          <div className="card bg-white border border-gray-300">
            <div className="text-2xl font-bold text-black">{roleLabel}</div>
            <div className="text-sm text-gray-600">Account Role</div>
          </div>

          <div className="card bg-white border border-gray-300">
            <div className="text-2xl font-bold text-black">
              {profileUser.status || "Active"}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>

        {/* About */}
        <div className="card bg-white border border-gray-300 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Username</div>
              <div className="font-medium text-gray-900">
                @{profileUser.username}
              </div>
            </div>

            <div>
              <div className="text-gray-500">Role</div>
              <div className="font-medium text-gray-900">{roleLabel}</div>
            </div>

            <div>
              <div className="text-gray-500">Reputation</div>
              <div className="font-medium text-gray-900">
                {profileUser.reputation || 0}
              </div>
            </div>

            <div>
              <div className="text-gray-500">Member Since</div>
              <div className="font-medium text-gray-900">
                {profileUser.createdAt
                  ? new Date(profileUser.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Empty activity placeholder */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Posts ({userPosts.length})
          </h2>

          {userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  author={profileUser}
                  onVote={(updated) => {
                    setUserPosts(
                      userPosts.map((p) =>
                        p._id === updated._id ? updated : p
                      )
                    );
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="card bg-white text-center py-10">
              <p className="text-gray-600">
                This user hasn’t posted anything yet.
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profile"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Profile Picture
            </label>

            <div className="flex flex-col items-center gap-4">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                />
              ) : (
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center ${editAvatarGradient}`}
                >
                  <span className="text-3xl font-bold text-white">
                    {profileUser.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-picture-input"
                />

                <label
                  htmlFor="profile-picture-input"
                  className="btn-primary text-sm cursor-pointer"
                >
                  Upload Image
                </label>

                {editProfilePicture && (
                  <button
                    onClick={handleRemoveImage}
                    className="btn-secondary text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500">
                Max 2MB. JPG, PNG, GIF supported.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Avatar Color fallback
            </label>

            <div className="flex gap-3">
              {["gray", "purple", "blue", "red", "green"].map((color) => (
                <button
                  key={color}
                  onClick={() => setEditAvatarColor(color)}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br transition-all border-2 ${editAvatarColor === color
                    ? "border-black scale-110"
                    : "border-gray-300"
                    } ${color === "purple"
                      ? "from-purple-400 to-purple-700"
                      : color === "blue"
                        ? "from-blue-400 to-blue-700"
                        : color === "red"
                          ? "from-red-400 to-red-700"
                          : color === "green"
                            ? "from-green-400 to-green-700"
                            : "from-gray-300 to-gray-600"
                    }`}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Bio
            </label>

            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="input-field resize-none"
              rows="4"
              placeholder="Tell us about yourself..."
              maxLength={200}
            />

            <p className="text-xs text-gray-600 mt-1">{editBio.length}/200</p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setIsEditOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button onClick={handleSaveProfile} className="btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}