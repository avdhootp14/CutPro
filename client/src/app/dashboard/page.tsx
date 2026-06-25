"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { Calendar, Clock, User, Scissors, CreditCard, ChevronLeft, LogOut, Edit2, X, Check, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Appointment {
  _id: string;
  appointmentDate: string;
  startTime: string;
  status: string;
  paymentStatus: string;
  services: { name: string; price: number; discountPrice?: number; hasOffer?: boolean }[];
  barber: { name: string };
  totalAmount?: number;
}

const Dashboard: React.FC = () => {
  const { user, setUser, logout } = useAuth();
  const { socket } = useSocket();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'profile'>('upcoming');

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Resend Email State
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditPhone(user.phone || '');
      
      axios.get(`/appointments/customer/${user._id}`)
        .then(res => setAppointments(res.data?.data || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleAppointmentUpdated = () => {
      // Re-fetch appointments when an update occurs
      axios.get(`/appointments/customer/${user._id}`)
        .then(res => setAppointments(res.data?.data || []))
        .catch(console.error);
    };

    socket.on('appointment_updated', handleAppointmentUpdated);

    return () => {
      socket.off('appointment_updated', handleAppointmentUpdated);
    };
  }, [socket, user]);

  const upcomingAppointments = appointments.filter(a => ['pending', 'confirmed'].includes(a.status));
  const pastAppointments = appointments.filter(a => ['completed', 'cancelled'].includes(a.status));

  const totalSpent = appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + (a.totalAmount || a.services.reduce((sSum, s) => sSum + (s.hasOffer && s.discountPrice ? s.discountPrice : s.price), 0)), 0);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await axios.patch('/customer/profile', { name: editName, email: editEmail, phone: editPhone });
      const updatedUser = res.data?.data || res.data;
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResendEmail = async () => {
    setResendingEmail(true);
    setResendStatus('');
    try {
      await axios.post('/auth/resend-verification');
      setResendStatus('success');
    } catch (error) {
      console.error('Failed to resend verification email', error);
      setResendStatus('error');
    } finally {
      setResendingEmail(false);
    }
  };

  const renderAppointment = (appt: Appointment) => {
    const isUpcoming = ['pending', 'confirmed'].includes(appt.status);
    const dateObj = new Date(appt.appointmentDate);
    const dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const serviceNames = appt.services.map(s => s.name).join(' + ');
    const price = appt.totalAmount || appt.services.reduce((sum, s) => sum + (s.hasOffer && s.discountPrice ? s.discountPrice : s.price), 0);
    
    let statusColor = "bg-gray-500/10 text-gray-400 border-gray-500/20";
    if (appt.status === 'confirmed') statusColor = "bg-green-500/10 text-green-400 border-green-500/20";
    if (appt.status === 'pending') statusColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    if (appt.status === 'cancelled') statusColor = "bg-red-500/10 text-red-400 border-red-500/20";
    if (appt.status === 'completed') statusColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";

    return (
      <div key={appt._id} className="bg-bgSecondary rounded-xl p-5 border border-white/10 flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
          <strong className="text-[1.05rem] text-white font-medium">{serviceNames || 'Appointment'}</strong>
          <span className={`px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.05em] rounded border whitespace-nowrap ${statusColor}`}>
            {appt.status}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-gray-400 text-[0.85rem]">
          <span className="flex items-center gap-1.5"><Calendar size={14} /> {dateStr}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> {appt.startTime}</span>
          {appt.barber && <span className="flex items-center gap-1.5"><Scissors size={14} /> {appt.barber.name}</span>}
          <span className="flex items-center gap-1.5"><CreditCard size={14} /> ₹{price}</span>
        </div>
        
        {isUpcoming && (
          <div className="flex flex-wrap gap-3 mt-1 pt-4 border-t border-white/5">
            <button className="btn btn-ghost btn-sm" onClick={() => alert('Call the salon to reschedule.')}>Reschedule</button>
            <button className="btn btn-outline btn-sm" onClick={() => alert('Call the salon to cancel.')}>Cancel</button>
          </div>
        )}
      </div>
    );
  };

  const renderProfileContent = () => (
    <div className="flex flex-col gap-4 text-[0.95rem]">
      {isEditing ? (
        <>
          <div className="flex flex-col gap-2 py-2">
            <label className="text-[0.8rem] text-gray-400 uppercase tracking-wider font-bold">Full Name</label>
            <input 
              type="text" 
              className="bg-bgPrimary border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-accent focus:outline-none transition-colors"
              value={editName}
              onChange={e => setEditName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 py-2">
            <label className="text-[0.8rem] text-gray-400 uppercase tracking-wider font-bold">Email Address</label>
            <input 
              type="email" 
              className="bg-bgPrimary border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-accent focus:outline-none transition-colors"
              value={editEmail}
              onChange={e => setEditEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 py-2 mb-2">
            <label className="text-[0.8rem] text-gray-400 uppercase tracking-wider font-bold">Phone Number</label>
            <input 
              type="text" 
              className="bg-bgPrimary border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-accent focus:outline-none transition-colors"
              value={editPhone}
              onChange={e => setEditPhone(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button 
              className="btn btn-accent flex-1 flex items-center justify-center gap-2"
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              className="btn btn-ghost px-4"
              onClick={() => {
                setIsEditing(false);
                setEditName(user?.name || '');
                setEditEmail(user?.email || '');
                setEditPhone(user?.phone || '');
              }}
            >
              <X size={16} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-gray-400">Name</span>
            <span className="text-white font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-gray-400">Email</span>
            <span className="text-white font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-gray-400">Phone</span>
            <span className="text-white font-medium">{user?.phone}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-gray-400">Role</span>
            <span className="px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.05em] rounded bg-accent/10 text-accent border border-accent/20">
              {user?.role}
            </span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
            <button 
              className="btn btn-outline w-full flex items-center justify-center gap-2"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={16} /> Edit Profile
            </button>
            <button 
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-[0.9rem] font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Sign Out of Account
            </button>
          </div>
        </>
      )}
    </div>
  );

  if (!user) return null;

  return (
    <div className="pt-32 pb-16 bg-bgPrimary min-h-screen relative overflow-hidden">
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,229,255,0.06),transparent_70%)] top-0 left-0 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-8 max-w-[1240px] relative z-10">
        
        {/* Back Navigation */}
        <div className="mb-8 animate-fade-in flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors">
            <ChevronLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Verification Alert */}
        {user && !user.isVerified && (
          <div className="mb-8 animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-4 rounded-xl">
            <div className="flex items-start sm:items-center gap-3">
              <AlertTriangle size={20} className="shrink-0 mt-0.5 sm:mt-0" />
              <div className="text-[0.9rem]">
                <strong>Your email is not verified.</strong> 
                <p className="opacity-80">You cannot book appointments until you verify your email.</p>
              </div>
            </div>
            
            <button 
              onClick={handleResendEmail} 
              disabled={resendingEmail || resendStatus === 'success'}
              className="btn btn-outline btn-sm shrink-0 !border-yellow-500/30 !text-yellow-400 hover:!bg-yellow-500/10"
            >
              {resendingEmail ? 'Sending...' : resendStatus === 'success' ? 'Email Sent!' : 'Resend Email'}
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 pb-6 border-b border-white/10 animate-fade-up">
          <div>
            <h1 className="font-serif font-bold text-[2.5rem] leading-[1.2] mb-2">
              Welcome, <span className="text-accent text-shadow-accent">{user.name}</span>
            </h1>
            <p className="text-gray-400 text-[1.1rem]">Here's an overview of your account.</p>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost flex items-center gap-2">
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fade-up animate-delay-[100ms]">
          <div className="bg-bgSecondary/60 backdrop-blur-md border border-white/10 p-5 rounded-xl transition-all hover:-translate-y-1 hover:border-accent/40">
            <div className="text-gray-400 text-[0.85rem] font-medium uppercase tracking-[0.05em] mb-2">Total Bookings</div>
            <div className="font-serif font-bold text-[2rem] text-white leading-none">{appointments.length}</div>
          </div>
          <div className="bg-bgSecondary/60 backdrop-blur-md border border-white/10 p-5 rounded-xl transition-all hover:-translate-y-1 hover:border-accent/40">
            <div className="text-gray-400 text-[0.85rem] font-medium uppercase tracking-[0.05em] mb-2">Upcoming</div>
            <div className="font-serif font-bold text-[2rem] text-accent leading-none">{upcomingAppointments.length}</div>
          </div>
          <div className="bg-bgSecondary/60 backdrop-blur-md border border-white/10 p-5 rounded-xl transition-all hover:-translate-y-1 hover:border-accent/40">
            <div className="text-gray-400 text-[0.85rem] font-medium uppercase tracking-[0.05em] mb-2">Total Spent</div>
            <div className="font-serif font-bold text-[2rem] text-white leading-none">₹{totalSpent}</div>
          </div>
          <div className="bg-bgSecondary/60 backdrop-blur-md border border-white/10 p-5 rounded-xl transition-all hover:-translate-y-1 hover:border-accent/40">
            <div className="text-gray-400 text-[0.85rem] font-medium uppercase tracking-[0.05em] mb-2">Member Since</div>
            <div className="font-serif font-bold text-[1.5rem] text-white leading-tight">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] gap-8 animate-fade-up animate-delay-[200ms]">
          
          <div className="card p-6 sm:p-8">
            <div className="flex border-b border-white/10 mb-6 overflow-x-auto scrollbar-hide">
              <button 
                className={`px-5 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === 'upcoming' ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming Appointments
              </button>
              <button 
                className={`px-5 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === 'past' ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('past')}
              >
                Past History
              </button>
              <button 
                className={`px-5 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === 'profile' ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-white lg:hidden'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Settings
              </button>
            </div>

            {loading ? (
               <div className="py-10 text-center text-gray-400">Loading your data...</div>
            ) : (
              <>
                {activeTab === 'upcoming' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    {upcomingAppointments.length === 0 ? (
                      <div className="py-10 text-center text-gray-500 border border-white/5 rounded-xl bg-white/5">
                        You have no upcoming appointments.<br/>
                        <Link href="/" className="text-accent hover:underline mt-2 inline-block">Book one now!</Link>
                      </div>
                    ) : (
                      upcomingAppointments.map(renderAppointment)
                    )}
                  </div>
                )}

                {activeTab === 'past' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    {pastAppointments.length === 0 ? (
                      <div className="py-10 text-center text-gray-500 border border-white/5 rounded-xl bg-white/5">
                        No past appointments found.
                      </div>
                    ) : (
                      pastAppointments.map(renderAppointment)
                    )}
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="lg:hidden animate-fade-in">
                    {renderProfileContent()}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Profile Sidebar (Desktop Only) */}
          <div className="card p-6 sm:p-8 h-fit hidden lg:block">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2 font-sans text-[1.2rem] font-semibold">
                <User size={18} className="text-accent" /> Profile
              </h3>
            </div>
            
            {renderProfileContent()}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
