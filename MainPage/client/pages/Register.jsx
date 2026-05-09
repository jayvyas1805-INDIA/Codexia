// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { UserAPI } from '../lib/storage';
// import { AuthContext } from '../App';
// import { registerUserApi } from '../apis/auth.api';
// import '../styles/Register.css';

// function validateEmail(email) {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

// // Move InputField outside component to prevent recreation on every render
// const InputField = React.memo(({ label, type = 'text', value, onChange, error, placeholder }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
//     <input
//       type={type}
//       value={value}
//       onChange={onChange}
//       autoComplete="off"
//       spellCheck="false"
//       className={`input-field ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
//       placeholder={placeholder}
//     />
//     {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
//   </div>
// ));

// InputField.displayName = 'InputField';

// export default function Register() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!username.trim()) {
//       newErrors.username = 'Username is required';
//     } else if (username.length < 3) {
//       newErrors.username = 'Username must be at least 3 characters';
//     }

//     if (!email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!validateEmail(email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     if (!password) {
//       newErrors.password = 'Password is required';
//     } else if (password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (password !== confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const user = UserAPI.register(username, email, password);
//       login(user);
//       navigate('/feed');
//     } catch (err) {
//       setErrors({ submit: err.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
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
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Join the Community</h1>
//           <p className="text-gray-600">Create your Codexia account</p>
//         </div>

//         {/* Form Card */}
//         <div className="card bg-white">
//           {errors.submit && (
//             <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
//               {errors.submit}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <InputField
//               label="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               error={errors.username}
//               placeholder="Choose your username"
//             />

//             <InputField
//               label="Email Address"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               error={errors.email}
//               placeholder="you@example.com"
//             />

//             <InputField
//               label="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               error={errors.password}
//               placeholder="At least 6 characters"
//             />

//             <InputField
//               label="Confirm Password"
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               error={errors.confirmPassword}
//               placeholder="Confirm your password"
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {loading ? 'Creating Account...' : 'Create Account'}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               Already have an account?{' '}
//               <Link to="/login" className="text-black hover:text-gray-700 font-medium">
//                 Sign in
//               </Link>
//             </p>
//           </div>

//           {/* Password requirement info */}
//           <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
//             <p className="text-xs text-gray-700 mb-2 font-medium">Password Requirements:</p>
//             <ul className="text-sm text-gray-700 space-y-1">
//               <li className={`flex items-center gap-2 ${password.length >= 6 ? 'text-green-600' : 'text-gray-600'}`}>
//                 <span>✓</span> At least 6 characters
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Footer */}
//         <p className="text-center text-gray-600 text-sm mt-6">
//           By creating an account, you agree to our Terms of Service and Privacy Policy
//         </p>
//       </div>
//     </div>
//   );
// }
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { registerUserApi, saveAuthData } from '../apis/api';
import '../styles/Register.css';

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const InputField = React.memo(({ label, type = 'text', value, onChange, error, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      autoComplete="off"
      spellCheck="false"
      className={`input-field ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
      placeholder={placeholder}
    />
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
));

InputField.displayName = 'InputField';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      };

      const response = await registerUserApi(payload);

      saveAuthData(response);

      if (login) {
        login(response?.data?.user);
      }

      navigate('/feed');
    } catch (err) {
      setErrors({
        submit: err?.message || 'Something went wrong during registration',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 24,14 8,14" fill="rgb(0 0 0)" />
              <polygon points="8,14 8,28 16,28" fill="rgb(107 114 128)" />
              <polygon points="24,14 16,28 24,28" fill="rgb(55 65 81)" />
            </svg>
            <span className="text-xl font-bold text-black">Codexia</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join the Community</h1>
          <p className="text-gray-600">Create your Codexia account</p>
        </div>

        <div className="card bg-white">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              placeholder="Choose your username"
            />

            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="you@example.com"
            />

            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="At least 6 characters"
            />

            <InputField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-black hover:text-gray-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <p className="text-xs text-gray-700 mb-2 font-medium">Password Requirements:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li className={`flex items-center gap-2 ${password.length >= 6 ? 'text-green-600' : 'text-gray-600'}`}>
                <span>✓</span> At least 6 characters
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}