"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Box,
  Tag,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Store,
  ExternalLink,
  Settings
} from 'lucide-react';

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { to: '/admin/barbers', label: 'Barbers', icon: Scissors },
  { to: '/admin/services', label: 'Services & Prices', icon: Box },
  { to: '/admin/offers', label: 'Offers & Discounts', icon: Tag },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const navigate = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-[#0B0E14] overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-[#0F1219] border-r border-white/[0.06] fixed h-full z-50">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-[72px] border-b border-white/[0.06]">
          <Store size={22} className="text-accent" />
          <span className="font-serif text-[1.3rem] font-bold text-white tracking-wider">CUTPRO</span>
          <span className="ml-auto text-[0.6rem] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
          {sidebarLinks.map(link => {
            const isActive = pathname === link.to;
            const Icon = link.icon;
            return (
              <Link key={link.to}
                href={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[0.88rem] font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-accent' : 'text-gray-500 group-hover:text-gray-300'} />
                {link.label}
                {isActive && <ChevronRight size={14} className="ml-auto text-accent/60" />}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="border-t border-white/[0.06] px-4 py-4">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent text-[0.85rem] font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[0.85rem] font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-gray-500 text-[0.7rem] truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-[0.82rem] font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Mobile */}
      <aside className={`fixed left-0 top-0 h-full w-[280px] bg-[#0F1219] border-r border-white/[0.06] z-50 transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Store size={22} className="text-accent" />
            <span className="font-serif text-[1.3rem] font-bold text-white tracking-wider">CUTPRO</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
            <X size={22} />
          </button>
        </div>
        <nav className="px-3 py-6 flex flex-col gap-1">
          {sidebarLinks.map(link => {
            const isActive = pathname === link.to;
            const Icon = link.icon;
            return (
              <Link key={link.to}
                href={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[0.88rem] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] px-4 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-[0.82rem] font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0B0E14]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Mobile menu + Page Info */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-gray-400 hover:text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={22} />
              </button>
              <div>
                <div className="flex items-center gap-2 text-[0.72rem] text-gray-500 mb-0.5">
                  <span>Admin</span>
                  <ChevronRight size={10} />
                  <span className="text-gray-400">{sidebarLinks.find(l => l.to === pathname)?.label || 'Panel'}</span>
                </div>
                <h2 className="text-white font-semibold text-[1.15rem] leading-tight">
                  {pathname === '/admin/dashboard' 
                    ? <>Welcome back, <span className="text-accent">{user?.name?.split(' ')[0] || 'Admin'}</span> 👋</>
                    : sidebarLinks.find(l => l.to === pathname)?.label || 'Admin Panel'
                  }
                </h2>
              </div>
            </div>

            {/* Right: Date + Visit Site */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-white text-[0.82rem] font-medium">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-gray-500 text-[0.72rem]">
                  {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/[0.06]" />
              <Link href="/" 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.78rem] font-medium text-gray-400 bg-white/[0.03] border border-white/[0.06] hover:text-accent hover:border-accent/20 transition-all"
              >
                <ExternalLink size={13} />
                Visit Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
