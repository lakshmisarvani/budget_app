import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

export default function ResetPassword() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(data.message || 'Reset failed');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <p className="text-sm text-gray-600 mb-2">Email: <strong>{email}</strong></p>
        <Input label="OTP" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <Input label="New Password" name="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <Button text="Reset Password" />
        <p className="mt-4 text-sm text-center text-green-600">{message}</p>
      </form>
    </div>
  );
}
