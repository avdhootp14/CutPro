"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tag, Percent } from 'lucide-react';

interface Service {
  _id: string;
  name: string;
  price: number;
  category: string;
  hasOffer: boolean;
  discountPrice?: number;
  isActive: boolean;
}

const AdminOffers: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

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

  const toggleOffer = async (service: Service) => {
    setSaving(service._id);
    try {
      await axios.put(`/admin/services/${service._id}`, {
        hasOffer: !service.hasOffer,
        discountPrice: service.hasOffer ? undefined : Math.round(service.price * 0.8)
      }, { withCredentials: true });
      fetchServices();
    } catch (error) {
      console.error('Failed to update offer', error);
    } finally {
      setSaving(null);
    }
  };

  const updateDiscountPrice = async (id: string, discountPrice: number) => {
    setSaving(id);
    try {
      await axios.put(`/admin/services/${id}`, { discountPrice }, { withCredentials: true });
      fetchServices();
    } catch (error) {
      console.error('Failed to update discount', error);
    } finally {
      setSaving(null);
    }
  };

  const activeOffers = services.filter(s => s.hasOffer);
  const noOffers = services.filter(s => !s.hasOffer && s.isActive);

  return (
    <AdminLayout>
      {/* Active Offers */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={18} className="text-accent" />
          <h3 className="text-white text-[1.1rem] font-semibold">Active Offers ({activeOffers.length})</h3>
        </div>

        {activeOffers.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
            <Tag size={40} className="mx-auto mb-3 opacity-20 text-gray-500" />
            <p className="text-gray-500 text-[0.9rem]">No active offers. Enable a discount on any service below.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeOffers.map(service => (
              <div key={service._id} className="bg-accent/[0.04] border border-accent/20 rounded-xl p-5 relative">
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 text-[0.68rem] font-bold uppercase bg-accent/10 text-accent rounded">
                    {service.discountPrice ? Math.round(((service.price - service.discountPrice) / service.price) * 100) : 0}% OFF
                  </span>
                </div>
                <p className="text-white font-medium text-[1rem] mb-1">{service.name}</p>
                <p className="text-gray-500 text-[0.78rem] mb-3">{service.category}</p>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-accent font-bold text-[1.4rem]">₹{service.discountPrice}</span>
                  <span className="text-gray-500 line-through text-[0.9rem]">₹{service.price}</span>
                  <span className="text-green-400 text-[0.78rem] ml-1">Save ₹{service.price - (service.discountPrice || 0)}</span>
                </div>

                {/* Edit discount price inline */}
                <div className="flex items-center gap-2 mb-4">
                  <label className="text-gray-400 text-[0.75rem]">Offer Price:</label>
                  <input
                    type="number"
                    min={0}
                    max={service.price}
                    defaultValue={service.discountPrice}
                    onBlur={e => {
                      const val = parseInt(e.target.value) || 0;
                      if (val !== service.discountPrice) updateDiscountPrice(service._id, val);
                    }}
                    className="w-24 bg-white/[0.06] border border-white/[0.1] text-white py-1.5 px-3 rounded text-[0.85rem] outline-none focus:border-accent/40"
                  />
                </div>

                <button
                  onClick={() => toggleOffer(service)}
                  disabled={saving === service._id}
                  className="w-full py-2 rounded-lg text-[0.8rem] font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all"
                >
                  {saving === service._id ? 'Updating...' : 'Remove Offer'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Services without offers */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Percent size={18} className="text-gray-400" />
          <h3 className="text-white text-[1.1rem] font-semibold">Add Discount to Services</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[30vh]"><div className="spinner" /></div>
        ) : noOffers.length === 0 ? (
          <p className="text-gray-500 text-[0.9rem]">All services already have offers.</p>
        ) : (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full text-left text-[0.88rem]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/[0.06] text-gray-500 text-[0.75rem] uppercase tracking-wider">
                  <th className="py-3 px-5 font-medium">Service</th>
                  <th className="py-3 px-5 font-medium">Category</th>
                  <th className="py-3 px-5 font-medium">Current Price</th>
                  <th className="py-3 px-5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {noOffers.map(service => (
                  <tr key={service._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-5 text-white font-medium">{service.name}</td>
                    <td className="py-3 px-5">
                      <span className="px-2 py-0.5 text-[0.7rem] font-medium bg-white/[0.05] text-gray-300 rounded">{service.category}</span>
                    </td>
                    <td className="py-3 px-5 text-white">₹{service.price}</td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => toggleOffer(service)}
                        disabled={saving === service._id}
                        className="px-3 py-1.5 rounded-lg text-[0.78rem] font-medium bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all disabled:opacity-50"
                      >
                        {saving === service._id ? 'Enabling...' : 'Enable Offer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOffers;
