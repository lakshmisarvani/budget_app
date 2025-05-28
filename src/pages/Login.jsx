import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(form);
    if (res?.accessToken) {
      localStorage.setItem('token', res.accessToken);
      setMessage('Login successful');
      setTimeout(() => {
        navigate('/dashboard'); // Redirect after login success
      }, 1000);
    } else {
      setMessage(res?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <Input label="Email" name="email" value={form.email} onChange={handleChange} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

        <div className="flex items-center justify-between mt-4">
          <Button text="Login" />
          <Link to="/forgot-password" className="text-sm text-blue-600 underline hover:text-blue-800">
            Forgot password?
          </Link>
        </div>

        <p className="mt-4 text-sm text-center text-green-600">{message}</p>
      </form>
    </div>
  );
}
