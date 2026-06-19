import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, Scissors, CreditCard } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="pt-32 pb-16 bg-bgPrimary min-h-screen relative overflow-hidden">
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,229,255,0.06),transparent_70%)] top-0 left-0 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-8 max-w-[1240px] relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 pb-6 border-b border-white/10 animate-fade-up">
          <div>
            <h1 className="font-serif font-bold text-[2.5rem] leading-[1.2] mb-2">
              Welcome, <span className="text-accent text-shadow-accent">{user?.name || 'User'}</span>
            </h1>
            <p className="text-gray-400 text-[1.1rem]">Here's an overview of your account.</p>
          </div>
          <button onClick={logout} className="btn btn-ghost">Logout</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fade-up animate-delay-[100ms]">
          <div className="bg-bgSecondary/60 backdrop-blur-md border border-white/10 p-5 rounded-xl transition-all hover:-translate-y-1 hover:border-accent/40">
            <div className="text-gray-400 text-[0.85rem] font-medium uppercase tracking-[0.05em] mb-2">Total Bookings</div>
            <div className="font-serif font-bold text-[2rem] text-white leading-none">12</div>
          </div>
          <div className="bg-bgSecondary/60 backdrop-blur-md border border-white/10 p-5 rounded-xl transition-all hover:-translate-y-1 hover:border-accent/40">
            <div className="text-gray-400 text-[0.85rem] font-medium uppercase tracking-[0.05em] mb-2">Upcoming</div>
            <div className="font-serif font-bold text-[2rem] text-accent leading-none">2</div>
          </div>
          <div className="bg-bgSecondary/60 backdrop-blur-md border border-white/10 p-5 rounded-xl transition-all hover:-translate-y-1 hover:border-accent/40">
            <div className="text-gray-400 text-[0.85rem] font-medium uppercase tracking-[0.05em] mb-2">Total Spent</div>
            <div className="font-serif font-bold text-[2rem] text-white leading-none">₹8,490</div>
          </div>
          <div className="bg-bgSecondary/60 backdrop-blur-md border border-white/10 p-5 rounded-xl transition-all hover:-translate-y-1 hover:border-accent/40">
            <div className="text-gray-400 text-[0.85rem] font-medium uppercase tracking-[0.05em] mb-2">Reviews Given</div>
            <div className="font-serif font-bold text-[2rem] text-white leading-none">5</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 animate-fade-up animate-delay-[200ms]">
          {/* Appointments Panel */}
          <div className="card p-8">
            <h3 className="flex items-center gap-2 font-sans text-[1.2rem] font-semibold mb-6">
              <Calendar size={18} className="text-accent" /> Upcoming Appointments
            </h3>

            <div className="flex flex-col gap-4">
              <div className="bg-bgSecondary rounded-xl p-5 border border-white/10 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <strong className="text-[1.05rem] text-white font-medium">Classic Haircut + Beard</strong>
                  <span className="px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.05em] rounded bg-green-500/10 text-green-400 border border-green-500/20 whitespace-nowrap">Confirmed</span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-gray-400 text-[0.85rem]">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> Tomorrow</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> 2:30 PM</span>
                  <span className="flex items-center gap-1.5"><Scissors size={14} /> Mike Johnson</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 pt-4 border-t border-white/5">
                  <button className="btn btn-ghost btn-sm">Reschedule</button>
                  <button className="btn btn-outline btn-sm">Cancel</button>
                </div>
              </div>

              <div className="bg-bgSecondary rounded-xl p-5 border border-white/10 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <strong className="text-[1.05rem] text-white font-medium">Royal Package</strong>
                  <span className="px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.05em] rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 whitespace-nowrap">Pending Payment</span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-gray-400 text-[0.85rem]">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> 20 June 2026</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> 11:00 AM</span>
                  <span className="flex items-center gap-1.5"><Scissors size={14} /> Carlos Rivera</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 pt-4 border-t border-white/5">
                  <button className="btn btn-accent btn-sm"><CreditCard size={14} /> Pay ₹999</button>
                  <button className="btn btn-ghost btn-sm">Cancel</button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Panel */}
          <div className="card p-8 h-fit">
            <h3 className="flex items-center gap-2 font-sans text-[1.2rem] font-semibold mb-6">
              <User size={18} className="text-accent" /> Profile
            </h3>

            <div className="flex flex-col gap-4 text-[0.95rem]">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Name</span>
                <span className="text-white font-medium">{user?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Email</span>
                <span className="text-white font-medium">{user?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Phone</span>
                <span className="text-white font-medium">{user?.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Role</span>
                <span className="px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.05em] rounded bg-accent/10 text-accent border border-accent/20">{user?.role || 'Customer'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
