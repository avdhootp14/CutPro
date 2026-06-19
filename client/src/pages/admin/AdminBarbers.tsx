import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Scissors, Plus, X, Check } from 'lucide-react';

interface Barber {
  _id: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  specialization: string[];
  workingDays: string[];
  startTime: string;
  endTime: string;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  isAvailable: boolean;
  bio?: string;
  portfolioImages?: string[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AdminBarbers: React.FC = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm = {
    name: '',
    email: '',
    phone: '',
    password: '',
    experience: 0,
    specialization: [] as string[],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    startTime: '09:00',
    endTime: '19:00',
    bio: '',
    portfolioUrls: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        portfolioImages: formData.portfolioUrls.split(',').map(u => u.trim()).filter(u => u)
      };
      
      if (editingId) {
        // Exclude password if empty during edit
        if (!payload.password) delete (payload as any).password;
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
      email: barber.email,
      phone: barber.phone,
      experience: barber.experience,
      workingDays: barber.workingDays,
      startTime: barber.startTime,
      endTime: barber.endTime,
      bio: barber.bio || '',
      portfolioUrls: barber.portfolioImages ? barber.portfolioImages.join(', ') : ''
    });
    setEditingId(barber._id);
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(`/admin/barbers/${id}`, { isActive: !currentStatus }, { withCredentials: true });
      fetchBarbers();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
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
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Email</label>
              <input type="email" required className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Phone</label>
              <input type="tel" required className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Password {editingId && '(Leave blank to keep current)'}</label>
              <input type="password" required={!editingId} className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Experience (Years)</label>
              <input type="number" required className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.experience} onChange={e => setFormData({...formData, experience: parseInt(e.target.value) || 0})} />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Start Time</label>
                <input type="time" required className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">End Time</label>
                <input type="time" required className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-2">Working Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <button type="button" key={day} onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-[0.78rem] font-medium border transition-all ${
                      formData.workingDays.includes(day)
                        ? 'bg-accent/10 text-accent border-accent/20'
                        : 'text-gray-500 bg-white/[0.02] border-white/[0.06] hover:text-white'
                    }`}>
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Bio</label>
              <textarea className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40 min-h-[60px]" placeholder="Tell customers about this barber's style and background..." value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Portfolio Image URLs (Comma Separated)</label>
              <textarea className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40 min-h-[80px]" placeholder="https://imgur.com/image1.jpg, https://imgur.com/image2.jpg" value={formData.portfolioUrls} onChange={e => setFormData({...formData, portfolioUrls: e.target.value})}></textarea>
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
                <p><span className="text-gray-500">Email:</span> {barber.email}</p>
                <p><span className="text-gray-500">Phone:</span> {barber.phone}</p>
                <p><span className="text-gray-500">Hours:</span> {barber.startTime} – {barber.endTime}</p>
                {barber.rating > 0 && <p><span className="text-gray-500">Rating:</span> ⭐ {barber.rating.toFixed(1)} ({barber.totalReviews})</p>}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(barber)}
                  className="w-1/3 py-2 rounded-lg text-[0.8rem] font-medium border text-gray-400 border-gray-600 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleStatus(barber._id, barber.isActive)}
                  className={`w-2/3 py-2 rounded-lg text-[0.8rem] font-medium border transition-all ${
                    barber.isActive
                      ? 'text-red-400 border-red-500/20 hover:bg-red-500/10'
                      : 'text-green-400 border-green-500/20 hover:bg-green-500/10'
                  }`}
                >
                  {barber.isActive ? 'Deactivate' : 'Activate'}
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
