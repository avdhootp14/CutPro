"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import axios from 'axios';
import { User, Mail, Lock, Phone, Scissors, Store, Link as LinkIcon } from 'lucide-react';

const PartnerRegister: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', shopName: '', shopSlug: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Auto-format slug: lowercase, replace spaces with hyphens, remove special chars
    if (e.target.name === 'shopSlug') {
      value = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Manual Validation
    if (!form.name || !form.email || !form.phone || !form.password || !form.shopName || !form.shopSlug) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/register-partner', form);
      // Wait for 1.5 seconds, then send them to login
      setTimeout(() => {
        navigate.push('/admin/login');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 relative overflow-hidden bg-[#0A0D14]">
      {/* Background Gradients */}
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.08),transparent_70%)] top-[-10%] right-[-10%] rounded-full blur-[100px]" />
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.05),transparent_70%)] bottom-[-10%] left-[-10%] rounded-full blur-[100px]" />
      
      <div className="w-full max-w-[550px] p-6 md:p-8 card border border-white/10 bg-white/[0.02] backdrop-blur-xl animate-fade-up relative z-10 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-3 text-accent shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <Store size={22} />
          </div>
          <h2 className="font-serif font-bold text-[1.75rem] text-white leading-tight mb-1">Partner with CutPro</h2>
          <p className="text-gray-400 text-[0.95rem]">Create your salon's digital booking platform</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 py-3 px-4 rounded-lg mb-6 text-[0.85rem] text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="form-group group">
              <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider mb-1 block transition-colors group-focus-within:text-accent">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-accent" />
                <input 
                  className="w-full bg-white/[0.03] border border-white/10 text-white py-2.5 pr-3 pl-9 rounded-lg text-[0.85rem] outline-none transition-all focus:border-accent/50 focus:bg-white/[0.05]" 
                  type="text" name="name" placeholder="John Doe" onChange={handleChange} required 
                />
              </div>
            </div>
            
            <div className="form-group group">
              <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider mb-1 block transition-colors group-focus-within:text-accent">Phone Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-accent" />
                <input 
                  className="w-full bg-white/[0.03] border border-white/10 text-white py-2.5 pr-3 pl-9 rounded-lg text-[0.85rem] outline-none transition-all focus:border-accent/50 focus:bg-white/[0.05]" 
                  type="tel" name="phone" placeholder="98765 43210" onChange={handleChange} required 
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="form-group group">
              <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider mb-1 block transition-colors group-focus-within:text-accent">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-accent" />
                <input 
                  className="w-full bg-white/[0.03] border border-white/10 text-white py-2.5 pr-3 pl-9 rounded-lg text-[0.85rem] outline-none transition-all focus:border-accent/50 focus:bg-white/[0.05]" 
                  type="email" name="email" placeholder="owner@salon.com" onChange={handleChange} required 
                />
              </div>
            </div>

            <div className="form-group group">
              <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider mb-1 block transition-colors group-focus-within:text-accent">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-accent" />
                <input 
                  className="w-full bg-white/[0.03] border border-white/10 text-white py-2.5 pr-3 pl-9 rounded-lg text-[0.85rem] outline-none transition-all focus:border-accent/50 focus:bg-white/[0.05]" 
                  type="password" name="password" placeholder="Create a password" onChange={handleChange} required 
                />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-white/10 my-1"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="form-group group">
              <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider mb-1 block transition-colors group-focus-within:text-accent">Salon Name</label>
              <div className="relative">
                <Scissors size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-accent" />
                <input 
                  className="w-full bg-white/[0.03] border border-white/10 text-white py-2.5 pr-3 pl-9 rounded-lg text-[0.85rem] outline-none transition-all focus:border-accent/50 focus:bg-white/[0.05]" 
                  type="text" name="shopName" placeholder="e.g. Xpressions Studio" onChange={handleChange} required 
                />
              </div>
            </div>

            <div className="form-group group">
              <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider mb-1 block transition-colors group-focus-within:text-accent">Desired URL Slug</label>
              <div className="relative">
                <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-accent" />
                <input 
                  className="w-full bg-white/[0.03] border border-white/10 text-accent font-bold py-2.5 pr-3 pl-9 rounded-lg text-[0.85rem] outline-none transition-all focus:border-accent/50 focus:bg-white/[0.05]" 
                  type="text" name="shopSlug" value={form.shopSlug} placeholder="xpressions" onChange={handleChange} required 
                />
              </div>
            </div>
          </div>
          
          {form.shopSlug && (
            <p className="text-[0.75rem] text-gray-400 font-medium text-center">
              Your website will be: <span className="text-accent">cutpro.com/{form.shopSlug}</span>
            </p>
          )}

          <button type="submit" className="w-full bg-accent text-black font-bold py-3 rounded-lg mt-2 hover:bg-accent/90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 text-[0.95rem]" disabled={loading}>
            {loading ? 'Creating Platform...' : 'Launch Your Platform'}
          </button>
        </form>

        <div className="text-center mt-5 pt-5 border-t border-white/5 text-gray-500 text-[0.8rem]">
          <p>Already a partner? <Link href="/admin/login" className="text-accent font-semibold hover:underline">Log in to Dashboard</Link></p>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;
