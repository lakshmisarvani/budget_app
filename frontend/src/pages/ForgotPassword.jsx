import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok && data.message === 'OTP sent to email') {
        alert('OTP sent to your email.');
        setTimeout(() => {
          navigate('/reset-password', { state: { email } }); // Pass email to next page
        }, 500);
      }
    } catch (err) {
      setMessage('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <Input label="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button text="Send OTP" />
        <p className="mt-4 text-sm text-center text-green-600">{message}</p>
      </form>
    </div>
  );
}
