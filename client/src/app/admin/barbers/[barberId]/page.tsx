"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import { ArrowLeft, User, Calendar, CheckCircle, XCircle, DollarSign, Clock } from 'lucide-react';

interface BarberStats {
  barber: {
    _id: string;
    name: string;
    phone: string;
    experience: number;
    rating: number;
    totalReviews: number;
    avatar: string;
  };
  todayStats: {
    totalAppointments: number;
    pendingAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    todayRevenue: number;
  };
  totalStats: {
    totalRevenue: number;
    totalAppointmentsCompleted: number;
  };
  recentAppointments: any[];
}

const BarberStatsPage: React.FC = () => {
  const { barberId } = useParams() as any;
  const [stats, setStats] = useState<BarberStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`/admin/barbers/${barberId}/stats`, { withCredentials: true });
        setStats(data.data);
      } catch (err: any) {
        console.error('Failed to fetch barber stats:', err);
        setError(err.response?.data?.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    
    if (barberId) fetchStats();
  }, [barberId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="spinner" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <p className="text-red-400 mb-4">{error || 'Barber not found'}</p>
          <Link href="/admin/barbers" className="btn btn-outline">
            Back to Barbers
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <Link href="/admin/barbers" className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-4 text-[0.85rem] uppercase tracking-wider font-medium">
          <ArrowLeft size={16} /> Back to Barbers
        </Link>
        
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-[1.5rem]">
            {stats.barber.avatar ? (
              <img src={stats.barber.avatar} alt={stats.barber.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              stats.barber.name.charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{stats.barber.name}</h1>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span>{stats.barber.experience} yrs exp</span>
              {stats.barber.rating > 0 && <span>⭐ {stats.barber.rating.toFixed(1)} ({stats.barber.totalReviews} reviews)</span>}
              <span>📞 {stats.barber.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Today's Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 flex flex-col items-center justify-center text-center">
            <Calendar className="text-accent mb-2" size={24} />
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Today</h3>
            <p className="text-2xl font-bold text-white">{stats.todayStats.totalAppointments}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 flex flex-col items-center justify-center text-center">
            <Clock className="text-yellow-400 mb-2" size={24} />
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Pending</h3>
            <p className="text-2xl font-bold text-white">{stats.todayStats.pendingAppointments}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 flex flex-col items-center justify-center text-center">
            <CheckCircle className="text-green-400 mb-2" size={24} />
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Completed</h3>
            <p className="text-2xl font-bold text-white">{stats.todayStats.completedAppointments}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 flex flex-col items-center justify-center text-center">
            <XCircle className="text-red-400 mb-2" size={24} />
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Cancelled</h3>
            <p className="text-2xl font-bold text-white">{stats.todayStats.cancelledAppointments}</p>
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 flex flex-col items-center justify-center text-center">
            <DollarSign className="text-accent mb-2" size={24} />
            <h3 className="text-accent text-xs uppercase tracking-wider mb-1">Today's Revenue</h3>
            <p className="text-2xl font-bold text-white">${stats.todayStats.todayRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">All-Time Performance</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-gray-400">Total Revenue Generated</span>
              <span className="text-xl font-bold text-accent">${stats.totalStats.totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-gray-400">Total Appointments Completed</span>
              <span className="text-xl font-bold text-white">{stats.totalStats.totalAppointmentsCompleted}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Appointments</h2>
          {stats.recentAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent appointments</p>
          ) : (
            <div className="space-y-3">
              {stats.recentAppointments.map((app: any) => (
                <div key={app._id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white text-sm">{app.customer?.name || 'Walk-in'}</p>
                    <p className="text-gray-500 text-xs">{new Date(app.appointmentDate).toLocaleDateString()} at {app.startTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-accent text-sm font-medium">${app.totalPrice}</p>
                    <span className={`text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded ${
                      app.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                      app.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BarberStatsPage;
