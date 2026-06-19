import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, X, Check, Box, Pencil, Trash2 } from 'lucide-react';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  hasOffer: boolean;
  discountPrice?: number;
  isActive: boolean;
}

const CATEGORIES = ['Hair', 'Beard', 'Spa', 'Facial', 'Color', 'Kids', 'Other'];

const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedDefaults, setSelectedDefaults] = useState<string[]>([]);
  const [addingDefaults, setAddingDefaults] = useState(false);

  const FALLBACK_SERVICES = [
    { name: 'Classic Haircut', description: 'Precision cut tailored to your face shape.', price: 499, duration: 45, category: 'Hair' },
    { name: 'Beard Sculpting', description: 'Expert beard trimming and shaping.', price: 349, duration: 30, category: 'Beard' },
    { name: 'Royal Package', description: 'Haircut + Beard + Facial + Head Massage.', price: 999, duration: 90, category: 'Spa' },
    { name: 'Hair Coloring', description: 'Premium coloring with salon-grade products.', price: 799, duration: 60, category: 'Color' },
    { name: 'Kids Haircut', description: 'Fun and gentle haircuts for the little ones.', price: 299, duration: 30, category: 'Kids' },
    { name: 'Hot Towel Shave', description: 'Traditional straight razor shave with hot towel treatment.', price: 399, duration: 40, category: 'Beard' },
    { name: 'Charcoal Facial', description: 'Deep cleansing facial with activated charcoal.', price: 599, duration: 45, category: 'Facial' },
    { name: 'Hair Spa Treatment', description: 'Deep conditioning and scalp therapy for healthy hair.', price: 699, duration: 60, category: 'Spa' },
  ];

  const toggleDefault = (name: string) => {
    setSelectedDefaults(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const handleAddDefaults = async () => {
    if (selectedDefaults.length === 0) return;
    setAddingDefaults(true);
    try {
      const servicesToAdd = FALLBACK_SERVICES.filter(s => selectedDefaults.includes(s.name));
      for (const service of servicesToAdd) {
        await axios.post('/admin/services', service, { withCredentials: true });
      }
      fetchServices();
      setSelectedDefaults([]);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add some services.');
    } finally {
      setAddingDefaults(false);
    }
  };

  const emptyForm = { name: '', description: '', price: 0, duration: 30, category: 'Hair', hasOffer: false, discountPrice: 0 };
  const [formData, setFormData] = useState(emptyForm);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get('/services');
      setServices(data.data);
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`/admin/services/${editingId}`, formData, { withCredentials: true });
      } else {
        await axios.post('/admin/services', formData, { withCredentials: true });
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchServices();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      hasOffer: service.hasOffer,
      discountPrice: service.discountPrice || 0
    });
    setEditingId(service._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to disable this service?')) return;
    try {
      await axios.delete(`/admin/services/${id}`, { withCredentials: true });
      fetchServices();
    } catch (error) {
      console.error('Failed to delete service', error);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <p className="text-gray-500 text-[0.85rem]">{services.length} services available</p>
        <button 
          onClick={() => showForm ? cancelForm() : setShowForm(true)} 
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[0.85rem] font-medium transition-all border ${showForm ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20'}`}
        >
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Service</>}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-6">
          <h3 className="text-white text-[1rem] font-semibold mb-5">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Service Name</label>
              <input type="text" required className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Category</label>
              <select className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#0F1219]">{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Price (₹)</label>
              <input type="number" required min={0} className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Duration (minutes)</label>
              <input type="number" required min={1} className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: parseInt(e.target.value) || 0})} />
            </div>
            <div className="md:col-span-2">
              <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Description</label>
              <textarea className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40 min-h-[80px] resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>

            {/* Offer Toggle */}
            <div className="md:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.hasOffer ? 'bg-accent' : 'bg-white/10'}`} onClick={() => setFormData({...formData, hasOffer: !formData.hasOffer})}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.hasOffer ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-white text-[0.88rem] font-medium">Enable Special Offer / Discount</span>
              </label>
              {formData.hasOffer && (
                <div className="mt-4 max-w-xs">
                  <label className="text-gray-400 text-[0.75rem] font-medium uppercase tracking-wider block mb-1.5">Discounted Price (₹)</label>
                  <input type="number" required min={0} className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 px-4 rounded-lg text-[0.88rem] outline-none focus:border-accent/40" value={formData.discountPrice || ''} onChange={e => setFormData({...formData, discountPrice: parseInt(e.target.value) || 0})} />
                  {formData.price > 0 && formData.discountPrice > 0 && (
                    <p className="text-green-400 text-[0.78rem] mt-2">
                      {Math.round(((formData.price - formData.discountPrice) / formData.price) * 100)}% off (Save ₹{formData.price - formData.discountPrice})
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-[0.85rem] font-medium bg-accent text-black hover:bg-accent/90 transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : <><Check size={16} /> {editingId ? 'Update Service' : 'Save Service'}</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Table */}
      {loading ? (
        <div className="flex items-center justify-center h-[40vh]"><div className="spinner" /></div>
      ) : services.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8">
          <div className="text-center mb-8">
            <Box size={48} className="mx-auto mb-4 text-accent/50" />
            <h3 className="text-white text-[1.2rem] font-semibold mb-2">No services found</h3>
            <p className="text-gray-400 text-[0.95rem]">Get started quickly by selecting predefined services from our template below, or create your own custom service.</p>
          </div>
          
          <div className="bg-[#0b0e14] border border-white/[0.05] rounded-xl p-6">
            <h4 className="text-white font-medium mb-4 flex items-center gap-2"><Check size={18} className="text-accent" /> Predefined Templates</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {FALLBACK_SERVICES.map((s, idx) => (
                <div 
                  key={idx}
                  onClick={() => toggleDefault(s.name)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedDefaults.includes(s.name) ? 'bg-accent/10 border-accent/40 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'bg-white/[0.02] border-white/[0.05] hover:border-white/20'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-white font-medium text-[0.85rem]">{s.name}</span>
                    <span className="text-accent text-[0.8rem] font-bold">₹{s.price}</span>
                  </div>
                  <div className="text-gray-500 text-[0.7rem]">{s.duration} min • {s.category}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setSelectedDefaults(FALLBACK_SERVICES.map(s => s.name))} className="btn btn-ghost py-2 px-4 text-[0.8rem]">Select All</button>
              <button 
                onClick={handleAddDefaults} 
                disabled={selectedDefaults.length === 0 || addingDefaults} 
                className="btn btn-accent py-2 px-6 text-[0.85rem] disabled:opacity-50"
              >
                {addingDefaults ? 'Adding...' : `Add Selected (${selectedDefaults.length})`}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.88rem]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/[0.06] text-gray-500 text-[0.75rem] uppercase tracking-wider">
                  <th className="py-3.5 px-5 font-medium">Service</th>
                  <th className="py-3.5 px-5 font-medium">Category</th>
                  <th className="py-3.5 px-5 font-medium">Duration</th>
                  <th className="py-3.5 px-5 font-medium">Price</th>
                  <th className="py-3.5 px-5 font-medium">Offer</th>
                  <th className="py-3.5 px-5 font-medium">Status</th>
                  <th className="py-3.5 px-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5">
                      <p className="text-white font-medium">{service.name}</p>
                      <p className="text-gray-500 text-[0.75rem] max-w-[250px] truncate">{service.description}</p>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 text-[0.7rem] font-medium bg-white/[0.05] text-gray-300 rounded">{service.category}</span>
                    </td>
                    <td className="py-3.5 px-5 text-gray-400">{service.duration} mins</td>
                    <td className="py-3.5 px-5">
                      {service.hasOffer ? (
                        <div>
                          <span className="text-accent font-bold">₹{service.discountPrice}</span>
                          <span className="text-gray-500 line-through ml-2 text-[0.78rem]">₹{service.price}</span>
                        </div>
                      ) : (
                        <span className="text-white font-medium">₹{service.price}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      {service.hasOffer ? (
                        <span className="px-2 py-0.5 text-[0.68rem] font-bold uppercase bg-accent/10 text-accent rounded">
                          {Math.round(((service.price - (service.discountPrice || 0)) / service.price) * 100)}% OFF
                        </span>
                      ) : (
                        <span className="text-gray-600 text-[0.78rem]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 text-[0.68rem] font-bold uppercase rounded ${service.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {service.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(service)} className="p-2 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition-all" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(service._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Disable">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminServices;
