import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ShieldCheck, CheckCircle } from 'lucide-react';

const AdminResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await axios.put(`/admin/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link might be expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0B0E14]">
        <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,255,100,0.04),transparent_70%)] top-[20%] left-[10%] rounded-full blur-[120px]" />
        <div className="w-full max-w-[420px] bg-white/[0.03] border border-white/[0.08] rounded-2xl p-10 text-center relative z-10">
          <CheckCircle size={50} className="text-green-500 mx-auto mb-5" />
          <h2 className="text-white text-[1.4rem] font-semibold mb-2">Password Reset!</h2>
          <p className="text-gray-400 text-[0.95rem] mb-6">
            Your password has been changed successfully. You will be redirected to the login page momentarily.
          </p>
          <Link to="/admin/login" className="text-accent hover:underline text-[0.9rem]">
            Click here to log in now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0B0E14]">
      {/* Subtle background effects */}
      <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,229,255,0.04),transparent_70%)] top-[20%] left-[10%] rounded-full blur-[120px]" />
      
      <div className="w-full max-w-[420px] relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={26} className="text-accent" />
          </div>
          <h1 className="font-serif text-[1.8rem] font-bold text-white tracking-wide mb-1">Reset Password</h1>
          <p className="text-gray-500 text-[0.88rem]">Enter your new secure password</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 py-3 px-4 rounded-lg mb-5 text-[0.85rem] text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">New Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-3 pr-4 pl-10 rounded-lg text-[0.9rem] outline-none focus:border-accent/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-3 pr-4 pl-10 rounded-lg text-[0.9rem] outline-none focus:border-accent/40 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 mt-2 rounded-lg text-[0.88rem] font-semibold bg-accent text-black hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Save New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;
