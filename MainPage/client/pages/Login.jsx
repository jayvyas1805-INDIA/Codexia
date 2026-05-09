// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { UserAPI } from '../lib/storage';
// import { AuthContext } from '../App';
// import '../styles/Login.css';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const user = UserAPI.login(email, password);
//       login(user);
//       navigate('/feed');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center px-4">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <Link to="/" className="inline-flex items-center gap-2 mb-6">
//             <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
//               <polygon points="16,2 24,14 8,14" fill="rgb(0 0 0)" />
//               <polygon points="8,14 8,28 16,28" fill="rgb(107 114 128)" />
//               <polygon points="24,14 16,28 24,28" fill="rgb(55 65 81)" />
//             </svg>
//             <span className="text-xl font-bold text-black">
//               Codexia
//             </span>
//           </Link>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
//           <p className="text-gray-600">Sign in to your Codexia account</p>
//         </div>

//         {/* Form Card */}
//         <div className="card bg-white">
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 autoComplete="off"
//                 spellCheck="false"
//                 className="input-field"
//                 placeholder="you@example.com"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 autoComplete="off"
//                 spellCheck="false"
//                 className="input-field"
//                 placeholder="••••••••"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {loading ? 'Signing in...' : 'Sign In'}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               Don't have an account?{' '}
//               <Link to="/register" className="text-black hover:text-gray-700 font-medium">
//                 Create one
//               </Link>
//             </p>
//           </div>

//           {/* Demo account info */}
//           <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
//             <p className="text-xs text-gray-700 mb-2">Demo Account:</p>
//             <p className="text-sm text-gray-700">
//               <span className="text-gray-900 font-medium">Email:</span> codewizard@codexia.dev
//             </p>
//             <p className="text-sm text-gray-700">
//               <span className="text-gray-900 font-medium">Password:</span> password123
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <p className="text-center text-gray-600 text-sm mt-6">
//           By signing in, you agree to our Terms of Service and Privacy Policy
//         </p>
//       </div>
//     </div>
//   );
// }
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { loginUserApi, saveAuthData } from '../apis/api';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        emailOrUsername: email.trim(),
        password,
      };

      const response = await loginUserApi(payload);

      saveAuthData(response);

      if (login) {
        login(response?.data?.user);
      }

      navigate('/feed');
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 24,14 8,14" fill="rgb(0 0 0)" />
              <polygon points="8,14 8,28 16,28" fill="rgb(107 114 128)" />
              <polygon points="24,14 16,28 24,28" fill="rgb(55 65 81)" />
            </svg>
            <span className="text-xl font-bold text-black">
              Codexia
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Codexia account</p>
        </div>

        <div className="card bg-white">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email or Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                spellCheck="false"
                className="input-field"
                placeholder="Enter email or username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                spellCheck="false"
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-black hover:text-gray-700 font-medium">
                Create one
              </Link>
            </p>
          </div>

          {/* <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <p className="text-xs text-gray-700 mb-2">Demo Account:</p>
            <p className="text-sm text-gray-700">
              <span className="text-gray-900 font-medium">Email:</span> codewizard@codexia.dev
            </p>
            <p className="text-sm text-gray-700">
              <span className="text-gray-900 font-medium">Password:</span> password123
            </p>
          </div> */}
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}