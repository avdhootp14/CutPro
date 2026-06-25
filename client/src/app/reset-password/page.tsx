"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Lock, Save, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link might be expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-[460px] p-12 card border-t-2 border-t-red-500 relative z-10 text-center">
        <h2 className="text-red-400 font-semibold text-[1.5rem] mb-4">Invalid Link</h2>
        <p className="text-gray-300 mb-6">Your password reset link is missing or invalid.</p>
        <Link href="/forgot-password" className="btn btn-accent inline-block">
          Request New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-[460px] p-12 card border-t-2 border-t-green-500 relative z-10 text-center">
        <ShieldCheck size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-white font-semibold text-[1.5rem] mb-4">Password Reset!</h2>
        <p className="text-gray-300 mb-8">Your password has been successfully reset. You can now log in with your new password.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="btn btn-accent">
            Customer Login
          </Link>
          <Link href="/admin/login" className="btn btn-secondary border border-white/20">
            Admin Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[460px] p-12 card border-t-2 border-t-accent animate-fade-up relative z-10">
      <div className="text-center mb-8">
        <h2 className="font-serif font-semibold text-[2rem] leading-[1.2] mb-2">Create New Password</h2>
        <p className="text-gray-400">Please enter your new password below.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 py-3.5 px-4 rounded-md mb-6 text-[0.9rem] text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="form-group group">
          <label className="text-[0.85rem] font-medium text-gray-400 uppercase tracking-[0.08em] transition-colors group-focus-within:text-accent">New Password</label>
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

        <div className="form-group group">
          <label className="text-[0.85rem] font-medium text-gray-400 uppercase tracking-[0.08em] transition-colors group-focus-within:text-accent">Confirm Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-accent" />
            <input 
              className="w-full bg-bgSecondary border border-white/10 text-white py-3.5 pr-4 pl-11 rounded-md font-sans text-[0.95rem] outline-none transition-all focus:border-accent focus:shadow-[0_0_0_4px_rgba(0,229,255,0.15)] focus:bg-bgCard" 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
        </div>

        <button type="submit" className="btn btn-accent btn-full btn-lg mt-2" disabled={loading}>
          {loading ? 'Saving...' : <><Save size={18} /> Reset Password</>}
        </button>
      </form>
    </div>
  );
};

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-32 px-4 relative overflow-hidden bg-bgPrimary">
      <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(212,175,55,0.08),transparent_70%)] top-[10%] right-[20%] rounded-full blur-[100px]" />
      <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;
