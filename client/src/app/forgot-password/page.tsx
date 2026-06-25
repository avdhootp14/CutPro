"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-32 px-4 relative overflow-hidden bg-bgPrimary">
      <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(212,175,55,0.08),transparent_70%)] top-[10%] right-[20%] rounded-full blur-[100px]" />
      
      <div className="w-full max-w-[460px] p-12 card border-t-2 border-t-accent animate-fade-up relative z-10">
        <Link href="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-6 text-[0.85rem] uppercase tracking-wider font-medium">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="text-center mb-8">
          <h2 className="font-serif font-semibold text-[2rem] leading-[1.2] mb-2">Forgot Password</h2>
          <p className="text-gray-400">Enter your email and we'll send you a secure link to reset your password.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 py-3.5 px-4 rounded-md mb-6 text-[0.9rem] text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl text-center">
            <h3 className="text-green-400 font-semibold text-[1.2rem] mb-2">Email Sent!</h3>
            <p className="text-gray-300 text-[0.9rem]">
              If an account with that email exists, we've sent a password reset link to it. Please check your inbox (and spam folder).
            </p>
          </div>
        ) : (
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

            <button type="submit" className="btn btn-accent btn-full btn-lg mt-2" disabled={loading}>
              {loading ? 'Sending...' : <><Send size={18} /> Send Reset Link</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
