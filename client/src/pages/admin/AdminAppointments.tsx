import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Calendar, Search } from 'lucide-react';

interface Appointment {
  _id: string;
  appointmentDate: string;
  startTime: string;
  status: string;
  customer: { name: string; email: string; phone: string };
  barber: { name: string };
  services: { name: string; price: number }[];
  totalPrice: number;
}

const AdminAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get('/admin/appointments', { withCredentials: true });
        setAppointments(data.data);
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filtered = appointments.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = search === '' || 
      app.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.barber?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  return (
    <AdminLayout>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by customer or barber..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] text-white py-2.5 pr-4 pl-10 rounded-lg text-[0.88rem] outline-none focus:border-accent/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(statusCounts).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-[0.78rem] font-medium transition-all border ${
                filter === key
                  ? 'bg-accent/10 text-accent border-accent/20'
                  : 'text-gray-400 bg-white/[0.02] border-white/[0.06] hover:text-white'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)} ({count})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[40vh]"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-[1rem] font-medium">No appointments found</p>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.88rem]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/[0.06] text-gray-500 text-[0.75rem] uppercase tracking-wider">
                  <th className="py-3.5 px-5 font-medium">Customer</th>
                  <th className="py-3.5 px-5 font-medium">Phone</th>
                  <th className="py-3.5 px-5 font-medium">Barber</th>
                  <th className="py-3.5 px-5 font-medium">Date</th>
                  <th className="py-3.5 px-5 font-medium">Time</th>
                  <th className="py-3.5 px-5 font-medium">Services</th>
                  <th className="py-3.5 px-5 font-medium">Total</th>
                  <th className="py-3.5 px-5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5 font-medium text-white">{app.customer?.name || 'N/A'}</td>
                    <td className="py-3.5 px-5 text-gray-400">{app.customer?.phone || '-'}</td>
                    <td className="py-3.5 px-5 text-gray-300">{app.barber?.name || 'Unassigned'}</td>
                    <td className="py-3.5 px-5 text-gray-400">{new Date(app.appointmentDate).toLocaleDateString()}</td>
                    <td className="py-3.5 px-5 text-gray-400">{app.startTime}</td>
                    <td className="py-3.5 px-5 text-gray-400 max-w-[200px] truncate">{app.services?.map(s => s.name).join(', ')}</td>
                    <td className="py-3.5 px-5 text-white font-medium">₹{app.totalPrice}</td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider rounded ${
                        app.status === 'confirmed' || app.status === 'completed' ? 'bg-green-500/10 text-green-400' : 
                        app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {app.status}
                      </span>
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

export default AdminAppointments;
