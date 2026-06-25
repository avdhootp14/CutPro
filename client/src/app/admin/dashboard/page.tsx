"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import { useSocket } from '@/context/SocketContext';
import Link from 'next/link';

import { Users, Calendar, Scissors, Box, IndianRupee, TrendingUp, ArrowUpRight } from 'lucide-react';

interface Stats {
  totalAppointments: number;
  totalBarbers: number;
  totalCustomers: number;
  totalServices: number;
  recentAppointments: any[];
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/admin/stats', { withCredentials: true });
        setStats(data.data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      // Refresh stats on new bookings or updates
      axios.get('/admin/stats', { withCredentials: true })
        .then(({ data }) => setStats(data.data))
        .catch(err => console.error('Failed to refresh stats', err));
    };

    socket.on('appointment_created', handleUpdate);
    socket.on('appointment_updated', handleUpdate);

    return () => {
      socket.off('appointment_created', handleUpdate);
      socket.off('appointment_updated', handleUpdate);
    };
  }, [socket]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]"><div className="spinner" /></div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <p className="text-red-400">Failed to load dashboard stats.</p>
      </AdminLayout>
    );
  }

  const revenueCards = [
    { label: "Today's Revenue", value: stats.revenue.daily, accent: true },
    { label: 'This Week', value: stats.revenue.weekly },
    { label: 'This Month', value: stats.revenue.monthly },
    { label: 'Total Revenue', value: stats.revenue.total },
  ];

  const statCards = [
    { label: 'Appointments', value: stats.totalAppointments, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Barbers', value: stats.totalBarbers, icon: Scissors, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Services', value: stats.totalServices, icon: Box, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <AdminLayout>
      {/* Revenue Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee size={20} className="text-accent" />
          <h3 className="text-white text-[1.1rem] font-semibold">Revenue Overview</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {revenueCards.map((card, i) => (
            <div key={i} className={`rounded-xl p-5 border transition-all hover:-translate-y-1 ${card.accent ? 'bg-accent/[0.08] border-accent/20' : 'bg-white/[0.02] border-white/[0.06]'}`}>
              <p className="text-gray-400 text-[0.78rem] font-medium uppercase tracking-wider mb-2">{card.label}</p>
              <p className={`font-serif font-bold text-[1.8rem] leading-none ${card.accent ? 'text-accent' : 'text-white'}`}>
                ₹{card.value.toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* General Stats */}
      <div className="mb-8">
        <h3 className="text-white text-[1.1rem] font-semibold mb-4">At a Glance</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 transition-all hover:-translate-y-1 hover:border-white/[0.12]">
                <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon size={18} className={card.color} />
                </div>
                <p className="font-serif font-bold text-[1.8rem] text-white leading-none mb-1">{card.value}</p>
                <p className="text-gray-500 text-[0.8rem] font-medium">{card.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-white text-[1.1rem] font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/admin/barbers" className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:border-accent/30 hover:bg-accent/[0.03] transition-all group">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Scissors size={18} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-white text-[0.95rem] font-medium">Add Barber</p>
              <p className="text-gray-500 text-[0.78rem]">Add new barbers to your team</p>
            </div>
            <ArrowUpRight size={16} className="text-gray-600 group-hover:text-accent transition-colors" />
          </Link>
          <Link href="/admin/services" className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:border-accent/30 hover:bg-accent/[0.03] transition-all group">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Box size={18} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-white text-[0.95rem] font-medium">Manage Services</p>
              <p className="text-gray-500 text-[0.78rem]">Add services & change prices</p>
            </div>
            <ArrowUpRight size={16} className="text-gray-600 group-hover:text-accent transition-colors" />
          </Link>
          <Link href="/admin/offers" className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:border-accent/30 hover:bg-accent/[0.03] transition-all group">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-white text-[0.95rem] font-medium">Offers & Discounts</p>
              <p className="text-gray-500 text-[0.78rem]">Manage special promotions</p>
            </div>
            <ArrowUpRight size={16} className="text-gray-600 group-hover:text-accent transition-colors" />
          </Link>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white text-[1.05rem] font-semibold flex items-center gap-2">
            <Calendar size={16} className="text-accent" /> Recent Appointments
          </h3>
          <Link href="/admin/appointments" className="text-[0.78rem] text-accent hover:underline">View All →</Link>
        </div>
        
        {stats.recentAppointments.length === 0 ? (
          <p className="text-gray-500 text-[0.9rem]">No appointments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.88rem]">
              <thead>
                <tr className="border-b border-white/[0.06] text-gray-500 text-[0.78rem] uppercase tracking-wider">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Barber</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAppointments.map(app => (
                  <tr key={app._id} className="border-b border-white/[0.03] last:border-0">
                    <td className="py-3.5 font-medium text-white">{app.customer?.name || 'N/A'}</td>
                    <td className="py-3.5 text-gray-400">{app.barber?.name || 'N/A'}</td>
                    <td className="py-3.5 text-gray-400">{new Date(app.appointmentDate).toLocaleDateString()}</td>
                    <td className="py-3.5 text-gray-400">{app.startTime}</td>
                    <td className="py-3.5">
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
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
