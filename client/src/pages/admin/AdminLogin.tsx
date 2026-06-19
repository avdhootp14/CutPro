import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, ShieldCheck, Store, Eye, EyeOff } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role !== 'admin') {
        setError('Access denied. This portal is only for shop owners.');
        setLoading(false);
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0B0E14]">
      {/* Subtle background effects */}
      <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,229,255,0.04),transparent_70%)] top-[20%] left-[10%] rounded-full blur-[120px]" />
      <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(212,175,55,0.04),transparent_70%)] bottom-[10%] right-[15%] rounded-full blur-[120px]" />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center">
            <Store size={26} className="text-accent" />
          </div>
          <h1 className="font-serif text-[1.8rem] font-bold text-white tracking-wide mb-1">CUTPRO</h1>
          <p className="text-gray-500 text-[0.88rem]">Shop Owner Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={18} className="text-accent" />
            <h2 className="text-white text-[1.1rem] font-semibold">Sign In</h2>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 py-3 px-4 rounded-lg mb-5 text-[0.85rem] text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  placeholder="admin@cutpro.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-3 pr-4 pl-10 rounded-lg text-[0.9rem] outline-none focus:border-accent/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-3 pr-10 pl-10 rounded-lg text-[0.9rem] outline-none focus:border-accent/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 mt-2 rounded-lg text-[0.88rem] font-semibold bg-accent text-black hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : <><LogIn size={17} /> Access Dashboard</>}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 text-[0.82rem] hover:text-gray-400 transition-colors">
            ← Back to CutPro website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
