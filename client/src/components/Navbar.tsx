"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';

import { useAuth } from '../context/AuthContext';
import { Scissors, Menu, X, ChevronRight } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { shopSlug } = useParams() as any;
  
  const [shopName, setShopName] = useState('CUTPRO');
  const [shopLogo, setShopLogo] = useState('');

  useEffect(() => {
    if (shopSlug) {
      axios.get(`/shop/${shopSlug}`).then(res => {
        setShopName(res.data.data.shopName);
        setShopLogo(res.data.data.shopLogo);
      }).catch(err => console.error(err));
    }
  }, [shopSlug]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { to: `/${shopSlug || ''}`, label: 'Home' },
    { to: `/${shopSlug || ''}/services`, label: 'Services' },
    { to: `/${shopSlug || ''}/barbers`, label: 'Our Barbers' },
    { to: `/${shopSlug || ''}/contact`, label: 'Contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'barber') return '/barber-dashboard';
    return '/dashboard';
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-[#0B0B0B]/90 backdrop-blur-xl border-b border-white/10 py-3'
            : 'py-5'
        }`}
      >
        <div className="container flex items-center justify-between mx-auto px-4 sm:px-8 max-w-[1240px]">
          <Link href={`/${shopSlug || ''}`} className="flex items-center gap-2 font-serif text-[1.4rem] font-bold text-white tracking-[0.1em]">
            {shopLogo ? (
              <img src={shopLogo} alt={shopName} className="h-8 object-contain" />
            ) : (
              <Scissors size={22} strokeWidth={2.5} className="text-accent" />
            )}
            <span>{shopName}</span>
          </Link>

          <div className="hidden lg:flex gap-10">
            {navLinks.map(link => {
              const isActive = pathname === link.to;
              return (
                <Link key={link.to}
                  href={link.to}
                  className={`relative flex items-center gap-1 text-[0.85rem] font-bold tracking-[0.1em] uppercase transition-colors duration-300 ${
                    isActive ? 'text-accent' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {isActive && <span className="text-accent opacity-70">/</span>}
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link href={getDashboardPath()} className="btn btn-ghost btn-sm">
                  {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button onClick={logout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">
                  Sign In
                </Link>
                <Link href="/book" className="btn btn-accent btn-sm">
                  Book Now <ChevronRight size={16} />
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden text-white bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[999] transition-all duration-500 ease-out ${
          mobileOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 w-[320px] max-w-[85vw] h-full bg-bgSecondary border-l border-white/10 pt-20 px-8 pb-8 flex flex-col gap-8 transition-transform duration-500 ease-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map(link => (
              <Link key={link.to}
                href={link.to}
                className="py-4 text-[1.1rem] font-medium text-gray-400 border-b border-white/10 transition-colors duration-300 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3 mt-auto">
            {user ? (
              <>
                <Link href={getDashboardPath()} className="btn btn-outline btn-full">
                  {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button onClick={logout} className="btn btn-ghost btn-full">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline btn-full">Sign In</Link>
                <Link href="/book" className="btn btn-accent btn-full">Book Now</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
