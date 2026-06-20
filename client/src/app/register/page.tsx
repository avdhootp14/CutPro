"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import axios from 'axios';
import { User, Mail, Lock, Phone, Scissors } from 'lucide-react';

const Register: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/auth/register', { ...form, role: 'customer' });
      navigate.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h2 className="font-serif font-semibold text-[2rem] leading-[1.2] mb-2">Create Account</h2>
          <p className="text-gray-400">Join CutPro for premium grooming</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 py-3.5 px-4 rounded-md mb-6 text-[0.9rem] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="form-group group">
            <label className="text-[0.85rem] font-medium text-gray-400 uppercase tracking-[0.08em] transition-colors group-focus-within:text-accent">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-accent" />
              <input 
                className="w-full bg-bgSecondary border border-white/10 text-white py-3.5 pr-4 pl-11 rounded-md font-sans text-[0.95rem] outline-none transition-all focus:border-accent focus:shadow-[0_0_0_4px_rgba(0,229,255,0.15)] focus:bg-bgCard" 
                type="text" 
                name="name" 
                placeholder="John Doe" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="form-group group">
            <label className="text-[0.85rem] font-medium text-gray-400 uppercase tracking-[0.08em] transition-colors group-focus-within:text-accent">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-accent" />
              <input 
                className="w-full bg-bgSecondary border border-white/10 text-white py-3.5 pr-4 pl-11 rounded-md font-sans text-[0.95rem] outline-none transition-all focus:border-accent focus:shadow-[0_0_0_4px_rgba(0,229,255,0.15)] focus:bg-bgCard" 
                type="email" 
                name="email" 
                placeholder="john@example.com" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-group group">
            <label className="text-[0.85rem] font-medium text-gray-400 uppercase tracking-[0.08em] transition-colors group-focus-within:text-accent">Phone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-accent" />
              <input 
                className="w-full bg-bgSecondary border border-white/10 text-white py-3.5 pr-4 pl-11 rounded-md font-sans text-[0.95rem] outline-none transition-all focus:border-accent focus:shadow-[0_0_0_4px_rgba(0,229,255,0.15)] focus:bg-bgCard" 
                type="tel" 
                name="phone" 
                placeholder="98765 43210" 
                onChange={handleChange} 
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
                name="password" 
                placeholder="Create a strong password" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-accent btn-full btn-lg mt-2" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-white/10 text-gray-400 text-[0.9rem]">
          <p>Already have an account? <Link href="/login" className="text-accent font-semibold hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
