"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, LogIn, Scissors } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate.push('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-32 px-4 relative overflow-hidden bg-bgPrimary">
      <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(0,229,255,0.08),transparent_70%)] top-[10%] right-[20%] rounded-full blur-[100px]" />
      
      <div className="w-full max-w-[460px] p-12 card border-t-2 border-t-accent animate-fade-up relative z-10">
        <div className="text-center mb-8">
          <Scissors size={32} className="text-accent mx-auto mb-4" />
          <h2 className="font-serif font-semibold text-[2rem] leading-[1.2] mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to manage your appointments</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 py-3.5 px-4 rounded-md mb-6 text-[0.9rem] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="form-group group">
            <label className="text-[0.85rem] font-medium text-gray-400 uppercase tracking-[0.08em] transition-colors group-focus-within:text-accent">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-accent" />
              <input 
                className="w-full bg-bgSecondary border border-white/10 text-white py-3.5 pr-4 pl-11 rounded-md font-sans text-[0.95rem] outline-none transition-all focus:border-accent focus:shadow-[0_0_0_4px_rgba(0,229,255,0.15)] focus:bg-bgCard" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-group group">
            <label className="text-[0.85rem] font-medium text-gray-400 uppercase tracking-[0.08em] transition-colors group-focus-within:text-accent">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-accent" />
              <input 
                className="w-full bg-bgSecondary border border-white/10 text-white py-3.5 pr-4 pl-11 rounded-md font-sans text-[0.95rem] outline-none transition-all focus:border-accent focus:shadow-[0_0_0_4px_rgba(0,229,255,0.15)] focus:bg-bgCard" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-accent btn-full btn-lg mt-2" disabled={loading}>
            {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-white/10 text-gray-400 text-[0.9rem]">
          <p>Don't have an account? <Link href="/register" className="text-accent font-semibold hover:underline">Create one</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
