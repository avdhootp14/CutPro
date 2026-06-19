import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { User, Lock, Mail, Phone, Check, AlertCircle } from 'lucide-react';
import { Country, State, City } from 'country-state-city';

const AdminSettings: React.FC = () => {
  const { user, setUser } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    shopName: '',
    shopLogo: '',
    country: '',
    state: '',
    district: '',
    city: '',
    address: '',
  });
  


  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        shopName: user.shopName || '',
        shopLogo: user.shopLogo || '',
        country: user.country || '',
        state: user.state || '',
        district: user.district || '',
        city: user.city || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    // Check if anything actually changed
    if (
      user &&
      profileData.name === (user.name || '') &&
      profileData.email === (user.email || '') &&
      profileData.phone === (user.phone || '') &&
      profileData.shopName === (user.shopName || '') &&
      profileData.shopLogo === (user.shopLogo || '') &&
      profileData.country === (user.country || '') &&
      profileData.state === (user.state || '') &&
      profileData.district === (user.district || '') &&
      profileData.city === (user.city || '') &&
      profileData.address === (user.address || '')
    ) {
      setProfileMessage({ type: 'error', text: 'No changes made to save.' });
      return;
    }

    setProfileLoading(true);

    try {
      const { data } = await axios.put('/admin/profile', profileData, { withCredentials: true });
      setUser(data.data);
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setProfileMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordLoading(true);

    try {
      await axios.post('/admin/request-password-reset', {}, { withCredentials: true });
      setPasswordMessage({ type: 'success', text: 'Password reset link sent to your email!' });
    } catch (error: any) {
      setPasswordMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to send reset link' 
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-white text-[1.5rem] font-semibold">Settings</h2>
        <p className="text-gray-400 text-[0.9rem]">Manage your profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Profile Settings */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-white/[0.06] pb-4">
            <User size={20} className="text-accent" />
            <h3 className="text-white text-[1.1rem] font-semibold">Profile Information</h3>
          </div>

          {profileMessage && (
            <div className={`flex items-center gap-2 p-3 rounded-lg mb-5 text-[0.85rem] ${
              profileMessage.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {profileMessage.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={e => setProfileData({...profileData, name: e.target.value})}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 pr-4 pl-10 rounded-lg text-[0.9rem] outline-none focus:border-accent/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  required
                  value={profileData.email}
                  onChange={e => setProfileData({...profileData, email: e.target.value})}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 pr-4 pl-10 rounded-lg text-[0.9rem] outline-none focus:border-accent/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Shop Name</label>
              <input
                type="text"
                placeholder="e.g. Xpressions Studio"
                value={profileData.shopName}
                onChange={e => setProfileData({...profileData, shopName: e.target.value})}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.9rem] outline-none focus:border-accent/40 transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Shop Logo URL (Optional)</label>
              <input
                type="text"
                placeholder="https://example.com/logo.png"
                value={profileData.shopLogo}
                onChange={e => setProfileData({...profileData, shopLogo: e.target.value})}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.9rem] outline-none focus:border-accent/40 transition-colors"
              />
              <p className="text-gray-500 text-[0.7rem] mt-1.5">Paste a direct image link (Imgur, Cloudinary, etc.)</p>
            </div>

            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="tel"
                  required
                  value={profileData.phone}
                  onChange={e => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 pr-4 pl-10 rounded-lg text-[0.9rem] outline-none focus:border-accent/40 transition-colors"
                />
              </div>
            </div>
            
            <div className="w-full h-px bg-white/10 my-2"></div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Country</label>
                <select
                  value={profileData.country}
                  onChange={e => {
                    setProfileData({...profileData, country: e.target.value, state: '', city: ''});
                  }}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.9rem] outline-none focus:border-accent/40 cursor-pointer appearance-none"
                >
                  <option value="" className="bg-[#111721]">Select Country</option>
                  {Country.getAllCountries().map(c => (
                    <option key={c.isoCode} value={c.isoCode} className="bg-[#111721]">{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">State</label>
                <select
                  value={profileData.state}
                  onChange={e => {
                    setProfileData({...profileData, state: e.target.value, city: ''});
                  }}
                  disabled={!profileData.country}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.9rem] outline-none focus:border-accent/40 cursor-pointer appearance-none disabled:opacity-50"
                >
                  <option value="" className="bg-[#111721]">Select State</option>
                  {profileData.country && State.getStatesOfCountry(profileData.country).map(s => (
                    <option key={s.isoCode} value={s.isoCode} className="bg-[#111721]">{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">City</label>
                <select
                  value={profileData.city}
                  onChange={e => setProfileData({...profileData, city: e.target.value})}
                  disabled={!profileData.state}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.9rem] outline-none focus:border-accent/40 cursor-pointer appearance-none disabled:opacity-50"
                >
                  <option value="" className="bg-[#111721]">Select City</option>
                  {profileData.country && profileData.state && City.getCitiesOfState(profileData.country, profileData.state).map(c => (
                    <option key={c.name} value={c.name} className="bg-[#111721]">{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">District (Optional)</label>
                <input
                  type="text" placeholder="e.g. Pune"
                  value={profileData.district} onChange={e => setProfileData({...profileData, district: e.target.value})}
                  className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.9rem] outline-none focus:border-accent/40"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Full Address</label>
              <textarea
                placeholder="e.g. Shop No 14, Phoenix Mall"
                value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.9rem] outline-none focus:border-accent/40 min-h-[60px]"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="mt-4 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-[0.85rem] font-medium bg-accent/10 text-accent border border-accent/20 hover:bg-accent hover:text-black transition-all disabled:opacity-50"
            >
              {profileLoading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 h-fit">
          <div className="flex items-center gap-2 mb-6 border-b border-white/[0.06] pb-4">
            <Lock size={20} className="text-accent" />
            <h3 className="text-white text-[1.1rem] font-semibold">Security & Password</h3>
          </div>

          {passwordMessage && (
            <div className={`flex items-center gap-2 p-3 rounded-lg mb-5 text-[0.85rem] ${
              passwordMessage.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {passwordMessage.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.01] border border-white/[0.04] p-4 rounded-lg">
            <div>
              <p className="text-white font-medium text-[0.95rem]">Change Password</p>
              <p className="text-gray-500 text-[0.8rem] mt-0.5">Receive a secure link to reset your password.</p>
            </div>
            <button
              onClick={handlePasswordSubmit}
              disabled={passwordLoading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-medium bg-white/[0.04] text-white border border-white/[0.08] hover:bg-white/[0.08] transition-all disabled:opacity-50 whitespace-nowrap"
            >
              <Lock size={14} className="text-gray-400" />
              {passwordLoading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </div>
        </div>
        
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
