import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      if (res?.user) {
        // Save user and tokens (if any) in localStorage
        if (res.accessToken) localStorage.setItem('accessToken', res.accessToken);
        if (res.refreshToken) localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.user));
        setMessageType('success');
        setMessage('Login successful');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setMessageType('error');
        setMessage(res?.message || 'Login failed');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Login failed. Please try again.');
      console.error('Login error:', error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
        <Input
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between mt-4">
          <Button text="Login" type="submit" />
          <Link to="/forgot-password" className="text-sm text-blue-600 underline hover:text-blue-800">
            Forgot password?
          </Link>
        </div>

        {message && (
          <p
            className={`mt-4 text-sm text-center ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {message}
          </p>
        )}

        <div className="mt-6 mb-4 text-center text-gray-500">OR Sign in with Google</div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center border border-gray-300 rounded py-2 hover:bg-gray-100 bg-white"
          title="Sign in with Google"
        >
          <FcGoogle size={24} />
        </button>
      </form>
    </div>
  );
}





// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { loginUser } from '../utils/api';
// import Input from '../components/Input';
// import Button from '../components/Button';
// import { FcGoogle } from 'react-icons/fc';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await loginUser(form);
//       if (res?.user) {
//         setMessage('Login successful');
//         setTimeout(() => {
//           navigate('/dashboard');
//         }, 1000);
//       } else {
//         setMessage(res?.message || 'Login failed');
//       }
//     } catch (error) {
//       setMessage('Login failed. Please try again.');
//       console.error('Login error:', error);
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = 'http://localhost:5000/api/auth/google';
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
//         <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
//         <Input label="Email" name="email" value={form.email} onChange={handleChange} />
//         <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

//         <div className="flex items-center justify-between mt-4">
//           <Button text="Login" />
//           <Link to="/forgot-password" className="text-sm text-blue-600 underline hover:text-blue-800">
//             Forgot password?
//           </Link>
//         </div>

//         <p className="mt-4 text-sm text-center text-green-600">{message}</p>

//         <div className="mt-6 mb-4 text-center text-gray-500">OR Sign in with Google</div>

//         <button
//           type="button"
//           onClick={handleGoogleLogin}
//           className="w-full flex items-center justify-center border border-gray-300 rounded py-2 hover:bg-gray-100 bg-white"
//           title="Sign in with Google"
//         >
//           <FcGoogle size={24} />
//         </button>
//       </form>
//     </div>
//   );
// }





// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { loginUser } from '../utils/api';
// import Input from '../components/Input';
// import Button from '../components/Button';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await loginUser(form);
//     if (res?.accessToken && res?.refreshToken && res?.user) {
//       localStorage.setItem('accessToken', res.accessToken);
//       localStorage.setItem('refreshToken', res.refreshToken);
//       localStorage.setItem('user', JSON.stringify(res.user));
//       setMessage('Login successful');
//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 1000);
//     } else {
//       setMessage(res?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
//         <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
//         <Input label="Email" name="email" value={form.email} onChange={handleChange} />
//         <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
//         <div className="flex items-center justify-between mt-4">
//           <Button text="Login" />
//           <Link to="/forgot-password" className="text-sm text-blue-600 underline hover:text-blue-800">
//             Forgot password?
//           </Link>
//         </div>
//         <p className="mt-4 text-sm text-center text-green-600">{message}</p>
//       </form>
//     </div>
//   );
// }

// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { loginUser } from '../utils/api';
// import Input from '../components/Input';
// import Button from '../components/Button';
// import { FcGoogle } from 'react-icons/fc'; // Flat color Google icon

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await loginUser(form);
//     if (res?.accessToken && res?.refreshToken && res?.user) {
//       localStorage.setItem('accessToken', res.accessToken);
//       localStorage.setItem('refreshToken', res.refreshToken);
//       localStorage.setItem('user', JSON.stringify(res.user));
//       setMessage('Login successful');
//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 1000);
//     } else {
//       setMessage(res?.message || 'Login failed');
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = 'http://localhost:5000/api/auth/google';
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
//         <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
//         <Input label="Email" name="email" value={form.email} onChange={handleChange} />
//         <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

//         <div className="flex items-center justify-between mt-4">
//           <Button text="Login" />
//           <Link to="/forgot-password" className="text-sm text-blue-600 underline hover:text-blue-800">
//             Forgot password?
//           </Link>
//         </div>

//         <p className="mt-4 text-sm text-center text-green-600">{message}</p>

//         {/* Divider */}
//         <div className="mt-6 mb-4 text-center text-gray-500">OR sign in with Google</div>

//         {/* Google Button 
//         <button
//           type="button"
//           onClick={handleGoogleLogin}
//           className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
//         >
//           Sign in with Google
//         </button>
//         */}
//         {/* Google Icon Button */}
// {/* Google Icon Button */}
// <button
//   type="button"
//   onClick={handleGoogleLogin}
//   className="w-full flex items-center justify-center border border-gray-300 rounded py-2 hover:bg-gray-100 bg-white"
//   title="Sign in with Google"
// >
//   <FcGoogle size={24} />
// </button>


//       </form>
//     </div>
//   );
// }



// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { loginUser } from '../utils/api';
// import Input from '../components/Input';
// import Button from '../components/Button';
// import { FcGoogle } from 'react-icons/fc';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   // Classic (email/password) login
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const res = await loginUser(form);
//   //   if (res?.accessToken && res?.refreshToken && res?.user) {
//   //     localStorage.setItem('accessToken', res.accessToken);
//   //     localStorage.setItem('refreshToken', res.refreshToken);
//   //     localStorage.setItem('user', JSON.stringify(res.user));
//   //     setMessage('Login successful');
//   //     setTimeout(() => {
//   //       navigate('/dashboard');
//   //     }, 1000);
//   //   } else {
//   //     setMessage(res?.message || 'Login failed');
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await loginUser(form);
//     if (res?.user) {
//       setMessage('Login successful');
//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 1000);
//     } else {
//       setMessage(res?.message || 'Login failed');
//     }
//   } catch (error) {
//     setMessage('Login failed. Please try again.');
//     console.error('Login error:', error);
//   }
// };

//   // Google OAuth: redirect to backend, which will set cookies and redirect to /dashboard
//   const handleGoogleLogin = () => {
//     window.location.href = 'http://localhost:5000/api/auth/google'; // your backend URL
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
//         <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
//         <Input label="Email" name="email" value={form.email} onChange={handleChange} />
//         <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

//         <div className="flex items-center justify-between mt-4">
//           <Button text="Login" />
//           <Link to="/forgot-password" className="text-sm text-blue-600 underline hover:text-blue-800">
//             Forgot password?
//           </Link>
//         </div>

//         <p className="mt-4 text-sm text-center text-green-600">{message}</p>

//         {/* Divider */}
//         <div className="mt-6 mb-4 text-center text-gray-500">OR Sign in with Google</div>

//         {/* Google Icon Button */}
//         <button
//           type="button"
//           onClick={handleGoogleLogin}
//           className="w-full flex items-center justify-center border border-gray-300 rounded py-2 hover:bg-gray-100 bg-white"
//           title="Sign in with Google"
//         >
//           <FcGoogle size={24} />
//         </button>
//       </form>
//     </div>
//   );
// }




// import { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { loginUser } from '../utils/api';
// import Input from '../components/Input';
// import Button from '../components/Button';
// import { FcGoogle } from 'react-icons/fc'; // Flat color Google icon

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   // Google OAuth success handler
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const accessToken = params.get('accessToken');
//     const refreshToken = params.get('refreshToken');
//     const id = params.get('id');
//     const name = params.get('name');
//     const email = params.get('email');

//     if (accessToken && refreshToken && id && name && email) {
//       // Clear the URL params after storing tokens
//       window.history.replaceState({}, document.title, window.location.pathname);

//       localStorage.setItem('accessToken', accessToken);
//       localStorage.setItem('refreshToken', refreshToken);
//       localStorage.setItem('user', JSON.stringify({ id, name, email }));
//       navigate('/dashboard');
//     }
//     // Only run on mount
//     // eslint-disable-next-line
//   }, [navigate]);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await loginUser(form);
//     if (res?.accessToken && res?.refreshToken && res?.user) {
//       localStorage.setItem('accessToken', res.accessToken);
//       localStorage.setItem('refreshToken', res.refreshToken);
//       localStorage.setItem('user', JSON.stringify(res.user));
//       setMessage('Login successful');
//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 1000);
//     } else {
//       setMessage(res?.message || 'Login failed');
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = 'http://localhost:5000/api/auth/google/'; // Change if backend URL changes
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
//         <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
//         <Input label="Email" name="email" value={form.email} onChange={handleChange} />
//         <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

//         <div className="flex items-center justify-between mt-4">
//           <Button text="Login" />
//           <Link to="/forgot-password" className="text-sm text-blue-600 underline hover:text-blue-800">
//             Forgot password?
//           </Link>
//         </div>

//         <p className="mt-4 text-sm text-center text-green-600">{message}</p>

//         {/* Divider */}
//         <div className="mt-6 mb-4 text-center text-gray-500">OR Signin with Google</div>

//         {/* Google Icon Button */}
//         <button
//           type="button"
//           onClick={handleGoogleLogin}
//           className="w-full flex items-center justify-center border border-gray-300 rounded py-2 hover:bg-gray-100 bg-white"
//           title="Sign in with Google"
//         >
//           <FcGoogle size={24} />
//         </button>
//       </form>
//     </div>
//   );
// }

