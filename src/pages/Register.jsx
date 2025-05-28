import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(form);
    setMessage(res?.message || 'Registration failed');

    if (res?.message === 'User already exists') {
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <Input label="Name" name="name" value={form.name} onChange={handleChange} />
        <Input label="Email" name="email" value={form.email} onChange={handleChange} />
        <Input label="Password" name="password" value={form.password} type="password" onChange={handleChange} />

        <div className="flex items-center justify-between mt-4">
          <Button text="Register" />
          <p className="text-sm text-blue-600">
            Already have an account?{' '}
            <Link to="/login" className="underline hover:text-blue-800">
              Login here
            </Link>
          </p>
        </div>

        <p className="mt-4 text-sm text-center text-green-600">{message}</p>
      </form>
    </div>
  );
}
