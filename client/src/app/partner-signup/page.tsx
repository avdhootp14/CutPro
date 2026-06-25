"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import axios from 'axios';
import { User, Mail, Lock, Phone, Scissors, Store, MapPin } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import indianDistrictsData from '@/data/indianDistricts.json';

const PartnerRegister: React.FC = () => {
  const [form, setForm] = useState({ 
    name: '', email: '', phone: '', password: '', shopName: '',
    country: '', state: '', district: '', city: '', address: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.phone || !form.password || !form.shopName || !form.country || !form.state || !form.district || !form.city || !form.address) {
      setError('Please fill out all required fields including location.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/register-partner', form);
      setTimeout(() => {
        navigate.push('/admin/login');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  // Extract districts if Country is India
  const availableDistricts = useMemo(() => {
    if (form.country === 'IN' && form.state) {
      const stateObj = State.getStateByCodeAndCountry(form.state, 'IN');
      if (stateObj) {
        // Find matching state in our JSON
        const matchedState = indianDistrictsData.states.find(
          s => s.state.toLowerCase() === stateObj.name.toLowerCase() || 
               s.state.toLowerCase().includes(stateObj.name.toLowerCase()) ||
               stateObj.name.toLowerCase().includes(s.state.toLowerCase())
        );
        if (matchedState) return matchedState.districts;
      }
    }
    return [];
  }, [form.country, form.state]);

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 relative overflow-hidden bg-[#0A0D14] pt-20">
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.08),transparent_70%)] top-[-10%] right-[-10%] rounded-full blur-[100px]" />
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.05),transparent_70%)] bottom-[-10%] left-[-10%] rounded-full blur-[100px]" />
      
      <div className="w-full max-w-[650px] p-6 md:p-8 card border border-white/10 bg-white/[0.02] backdrop-blur-xl animate-fade-up relative z-10 rounded-2xl shadow-2xl">
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/* PERSONAL DETAILS */}
          <div>
            <h3 className="text-white text-[0.9rem] font-semibold border-b border-white/10 pb-2 mb-3">Owner Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
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
          </div>

          {/* SALON DETAILS */}
          <div className="mt-2">
            <h3 className="text-white text-[0.9rem] font-semibold border-b border-white/10 pb-2 mb-3">Salon Details & Location</h3>
            <div className="form-group group mb-3">
              <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider mb-1 block transition-colors group-focus-within:text-accent">Salon Name</label>
              <div className="relative">
                <Scissors size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-accent" />
                <input 
                  className="w-full bg-white/[0.03] border border-white/10 text-white py-2.5 pr-3 pl-9 rounded-lg text-[0.85rem] outline-none transition-all focus:border-accent/50 focus:bg-white/[0.05]" 
                  type="text" name="shopName" placeholder="e.g. Xpressions Studio" onChange={handleChange} required 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Country</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={e => setForm({...form, country: e.target.value, state: '', district: '', city: ''})}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 text-white py-2.5 px-3 rounded-lg text-[0.85rem] outline-none cursor-pointer appearance-none"
                >
                  <option value="" className="bg-[#111721]">Select Country</option>
                  {Country.getAllCountries().map(c => (
                    <option key={c.isoCode} value={c.isoCode} className="bg-[#111721]">{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider mb-1 block">State</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={e => setForm({...form, state: e.target.value, district: '', city: ''})}
                  required disabled={!form.country}
                  className="w-full bg-white/[0.03] border border-white/10 text-white py-2.5 px-3 rounded-lg text-[0.85rem] outline-none cursor-pointer appearance-none disabled:opacity-50"
                >
                  <option value="" className="bg-[#111721]">Select State</option>
                  {form.country && State.getStatesOfCountry(form.country).map(s => (
                    <option key={s.isoCode} value={s.isoCode} className="bg-[#111721]">{s.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider mb-1 block">District</label>
                {form.country === 'IN' && availableDistricts.length > 0 ? (
                  <select
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 text-white py-2.5 px-3 rounded-lg text-[0.85rem] outline-none cursor-pointer appearance-none"
                  >
                    <option value="" className="bg-[#111721]">Select District</option>
                    {availableDistricts.map(d => (
                      <option key={d} value={d} className="bg-[#111721]">{d}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text" name="district" placeholder="e.g. Pune"
                    required
                    value={form.district} onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/10 text-white py-2.5 px-3 rounded-lg text-[0.85rem] outline-none focus:border-accent/40"
                  />
                )}
              </div>

              <div>
                <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider mb-1 block">City / Town / Village</label>
                {form.country === 'IN' ? (
                  <input
                    type="text" name="city" placeholder="e.g. Malkapur"
                    required
                    value={form.city} onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/10 text-white py-2.5 px-3 rounded-lg text-[0.85rem] outline-none focus:border-accent/40"
                  />
                ) : (
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required disabled={!form.state}
                    className="w-full bg-white/[0.03] border border-white/10 text-white py-2.5 px-3 rounded-lg text-[0.85rem] outline-none cursor-pointer appearance-none disabled:opacity-50"
                  >
                    <option value="" className="bg-[#111721]">Select City</option>
                    {form.country && form.state && City.getCitiesOfState(form.country, form.state).map(c => (
                      <option key={c.name} value={c.name} className="bg-[#111721]">{c.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="form-group group">
              <label className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider mb-1 block transition-colors group-focus-within:text-accent">Full Street Address</label>
              <textarea 
                className="w-full bg-white/[0.03] border border-white/10 text-white py-2.5 px-3 rounded-lg text-[0.85rem] outline-none transition-all focus:border-accent/50 focus:bg-white/[0.05] min-h-[60px]" 
                name="address" placeholder="e.g. Shop No 14, Ground Floor, Phoenix Mall" onChange={handleChange} required 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-accent text-black font-bold py-3 rounded-lg mt-3 hover:bg-accent/90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 text-[0.95rem]" disabled={loading}>
            {loading ? 'Registering...' : 'Launch Your Platform'}
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
