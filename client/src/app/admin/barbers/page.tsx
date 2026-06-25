"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import { Scissors, Plus, X, Check } from 'lucide-react';

interface Barber {
  _id: string;
  name: string;
  phone: string;
  experience: number;
  specialization: string[];
  workingHours: { day: string; startTime: string; endTime: string; isWorking: boolean }[];
  rating: number;
  totalReviews: number;
  isActive: boolean;
  isAvailable: boolean;
  bio?: string;
  portfolioImages?: string[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PRE_STYLES = ['Fade', 'Buzz Cut', 'Beard Trim', 'Hair Coloring', 'Straight Razor Shave', 'Classic Scissor Cut', 'Kids Haircut', 'Blowout', 'Perm'];

const AdminBarbers: React.FC = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [customStyle, setCustomStyle] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm = {
    name: '',
    phone: '',
    experience: 0,
    specialization: [] as string[],
    workingHours: DAYS.map(day => ({
      day,
      startTime: '09:00',
      endTime: '19:00',
      isWorking: day !== 'Sunday'
    })),
    bio: '',
    portfolioImages: [] as string[]
  };

  const [formData, setFormData] = useState(emptyForm);

  const fetchBarbers = async () => {
    try {
      const { data } = await axios.get('/admin/barbers', { withCredentials: true });
      setBarbers(data.data);
    } catch (error) {
      console.error('Failed to fetch barbers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBarbers(); }, []);

  const handleAddStyle = (style: string) => {
    if (style.trim() && !formData.specialization.includes(style.trim())) {
      setFormData(prev => ({ ...prev, specialization: [...prev.specialization, style.trim()] }));
    }
  };

  const handleRemoveStyle = (style: string) => {
    setFormData(prev => ({ ...prev, specialization: prev.specialization.filter(s => s !== style) }));
  };

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const uploadData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      uploadData.append('images', e.target.files[i]);
    }
    
    setUploadingPortfolio(true);
    try {
      const { data } = await axios.post('/upload/images', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newUrls = data.data.urls.join(', ');
      setFormData(prev => ({
        ...prev,
        portfolioImages: [...prev.portfolioImages, ...data.data.urls]
      }));
    } catch (error) {
      console.error('Failed to upload images', error);
      alert('Failed to upload portfolio. Make sure Cloudinary keys are configured in backend.');
    } finally {
      setUploadingPortfolio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData
      };
      
      if (editingId) {
        await axios.put(`/admin/barbers/${editingId}`, payload, { withCredentials: true });
      } else {
        await axios.post('/admin/barbers', payload, { withCredentials: true });
      }
      
      setShowAddForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchBarbers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save barber.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (barber: Barber) => {
    setFormData({
      ...emptyForm,
      name: barber.name,
      phone: barber.phone,
      experience: barber.experience,
      specialization: barber.specialization || [],
      workingHours: barber.workingHours && barber.workingHours.length > 0 ? barber.workingHours : DAYS.map(day => ({
        day,
        startTime: '09:00',
        endTime: '19:00',
        isWorking: day !== 'Sunday'
      })),
      bio: barber.bio || '',
      portfolioImages: barber.portfolioImages || []
    });
    setEditingId(barber._id);
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      portfolioImages: prev.portfolioImages.filter(url => url !== urlToRemove)
    }));
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(`/admin/barbers/${id}`, { isActive: !currentStatus }, { withCredentials: true });
      fetchBarbers();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleWorkingHourChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      workingHours: prev.workingHours.map(wh => wh.day === day ? { ...wh, [field]: value } : wh)
    }));
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <p className="text-gray-500 text-[0.85rem]">{barbers.length} barbers registered</p>
        </div>
        <button 
          onClick={() => showAddForm ? cancelForm() : setShowAddForm(true)} 
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[0.85rem] font-medium transition-all ${showAddForm ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' : 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20'}`}
        >
          {showAddForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Barber</>}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-6">
          <h3 className="text-white text-[1rem] font-semibold mb-5">{editingId ? 'Edit Barber' : 'Add New Barber'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Full Name</label>
              <input type="text" required className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Phone</label>
              <input type="tel" required className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Experience (Years)</label>
              <input type="number" required className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.experience} onChange={e => setFormData({...formData, experience: parseInt(e.target.value) || 0})} />
            </div>
            <div className="md:col-span-2">
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-2">Working Hours</label>
              <div className="flex flex-col gap-3">
                {formData.workingHours.map((wh) => (
                  <div key={wh.day} className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] p-3 rounded-lg">
                    <div className="w-28 flex items-center gap-2 cursor-pointer" onClick={() => handleWorkingHourChange(wh.day, 'isWorking', !wh.isWorking)}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${wh.isWorking ? 'bg-accent border-accent text-black' : 'border-white/20'}`}>
                        {wh.isWorking && <Check size={12} strokeWidth={4} />}
                      </div>
                      <span className={`text-[0.85rem] font-medium select-none ${wh.isWorking ? 'text-white' : 'text-gray-500'}`}>{wh.day}</span>
                    </div>
                    
                    {wh.isWorking ? (
                      <div className="flex-1 flex gap-3">
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-gray-500 text-[0.7rem] uppercase hidden sm:block">Start</span>
                          <input type="time" required className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-1.5 px-3 rounded-md text-[0.85rem] outline-none focus:border-accent/40" value={wh.startTime} onChange={e => handleWorkingHourChange(wh.day, 'startTime', e.target.value)} />
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-gray-500 text-[0.7rem] uppercase hidden sm:block">End</span>
                          <input type="time" required className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-1.5 px-3 rounded-md text-[0.85rem] outline-none focus:border-accent/40" value={wh.endTime} onChange={e => handleWorkingHourChange(wh.day, 'endTime', e.target.value)} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 text-gray-500 text-[0.85rem] italic">Off</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Barber Styles & Specialties</label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.specialization.map(style => (
                  <span key={style} className="px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-lg text-[0.8rem] font-medium flex items-center gap-1.5">
                    {style}
                    <button type="button" onClick={() => handleRemoveStyle(style)} className="hover:text-red-400"><X size={14} /></button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 items-center flex-wrap">
                <select 
                  className="bg-white/[0.04] border border-white/[0.08] text-white py-2 px-3 rounded-lg text-[0.85rem] outline-none cursor-pointer"
                  onChange={e => {
                    if (e.target.value) {
                      handleAddStyle(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" className="bg-[#111721]">Select Pre-Style</option>
                  {PRE_STYLES.map(s => <option key={s} value={s} className="bg-[#111721]">{s}</option>)}
                </select>
                
                <span className="text-gray-500 text-[0.85rem] font-medium px-2">or</span>
                
                <div className="flex gap-2 flex-1 min-w-[200px]">
                  <input
                    type="text" placeholder="Add custom style..."
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] text-white py-2 px-3 rounded-lg text-[0.85rem] outline-none focus:border-accent/40"
                    value={customStyle}
                    onChange={e => setCustomStyle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddStyle(customStyle);
                        setCustomStyle('');
                      }
                    }}
                  />
                  <button type="button" onClick={() => { handleAddStyle(customStyle); setCustomStyle(''); }} className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[0.85rem] transition-all">Add</button>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Bio / Background</label>
              <textarea className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40 min-h-[60px]" placeholder="Tell customers about this barber's background..." value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Portfolio Images</label>
              <div className="flex flex-col gap-3">
                {formData.portfolioImages.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {formData.portfolioImages.map((url, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/[0.08] w-24 h-24">
                        <img src={url} alt="Portfolio" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(url)}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <label className={`cursor-pointer px-4 py-2.5 rounded-lg text-[0.85rem] font-medium border transition-all ${uploadingPortfolio ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20'}`}>
                    {uploadingPortfolio ? 'Uploading...' : 'Upload Images'}
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handlePortfolioUpload} disabled={uploadingPortfolio} />
                  </label>
                  <p className="text-gray-500 text-[0.7rem]">Select one or multiple images from your device.</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-[0.85rem] font-medium bg-accent text-black hover:bg-accent/90 transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : <><Check size={16} /> {editingId ? 'Update Barber' : 'Save Barber'}</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Barbers Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-[40vh]"><div className="spinner" /></div>
      ) : barbers.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Scissors size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-[1rem] font-medium">No barbers yet</p>
          <p className="text-[0.85rem] mt-1">Click "Add Barber" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {barbers.map(barber => (
            <div key={barber._id} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-[0.9rem]">
                    {barber.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-[0.95rem]">{barber.name}</p>
                    <p className="text-gray-500 text-[0.78rem]">{barber.experience} yrs experience</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider rounded ${barber.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {barber.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 text-[0.82rem] text-gray-400 mb-4">
                <p><span className="text-gray-500">Phone:</span> {barber.phone}</p>
                <p><span className="text-gray-500">Hours:</span> Flexible</p>
                {barber.rating > 0 && <p><span className="text-gray-500">Rating:</span> ⭐ {barber.rating.toFixed(1)} ({barber.totalReviews})</p>}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.location.href = `/admin/barbers/${barber._id}`}
                  className="w-1/3 py-2 rounded-lg text-[0.8rem] font-medium border text-accent border-accent hover:bg-accent/10 transition-all text-center"
                >
                  Stats
                </button>
                <button
                  onClick={() => handleEdit(barber)}
                  className="w-1/3 py-2 rounded-lg text-[0.8rem] font-medium border text-gray-400 border-gray-600 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleStatus(barber._id, barber.isActive)}
                  className={`w-1/3 py-2 rounded-lg text-[0.8rem] font-medium border transition-all ${
                    barber.isActive
                      ? 'text-red-400 border-red-500/20 hover:bg-red-500/10'
                      : 'text-green-400 border-green-500/20 hover:bg-green-500/10'
                  }`}
                >
                  {barber.isActive ? 'Deact.' : 'Act.'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBarbers;
