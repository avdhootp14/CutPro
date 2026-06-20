"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Star, Clock, Calendar, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface Barber {
  _id: string;
  name: string;
  specialization: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  startTime: string;
  endTime: string;
  workingDays: string[];
  bio?: string;
  portfolioImages?: string[];
}

const BarberProfile: React.FC = () => {
  const { shopSlug, barberId } = useParams() as any;
  const [barber, setBarber] = useState<Barber | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarber = async () => {
      try {
        const res = await axios.get(`/barbers?shopSlug=${shopSlug || ''}`);
        const barbers = res.data?.data || res.data?.barbers || res.data || [];
        const found = barbers.find((b: Barber) => b._id === barberId);
        if (found) setBarber(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBarber();
  }, [shopSlug, barberId]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="spinner" /></div>;
  }

  if (!barber) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-32">
        <h2 className="text-2xl font-bold text-white mb-4">Barber Not Found</h2>
        <Link href={`/${shopSlug || ''}/barbers`} className="btn btn-outline">Back to Barbers</Link>
      </div>
    );
  }

  return (
    <div className="pt-[120px] pb-20 bg-bgPrimary min-h-screen">
      <div className="container mx-auto px-4 sm:px-8 max-w-[1000px]">
        <Link href={`/${shopSlug || ''}/barbers`} className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-8 text-[0.85rem] uppercase tracking-wider font-medium">
          <ArrowLeft size={16} /> Back to Team
        </Link>

        {/* Header Profile Section */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0" />
          
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full bg-[#111721] border-2 border-white/10 flex items-center justify-center text-[3rem] text-accent font-serif font-bold shadow-[0_0_30px_rgba(212,175,55,0.1)]">
            {barber.name.charAt(0)}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-[2.5rem] md:text-[3rem] font-serif font-bold text-white leading-tight mb-2">{barber.name}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center gap-1.5 text-accent font-bold text-[0.95rem]">
                <Star size={18} className="fill-accent" />
                <span>{barber.rating > 0 ? barber.rating.toFixed(1) : 'New'}</span>
                {barber.totalReviews > 0 && <span className="text-gray-500 font-normal ml-1">({barber.totalReviews} reviews)</span>}
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="text-gray-400 text-[0.95rem]">{barber.experience} Years Exp.</div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8 max-w-[600px] text-[1.05rem]">
              {barber.bio || `${barber.name} is a master barber specializing in ${barber.specialization.join(', ')}. Book an appointment to experience premium grooming.`}
            </p>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
              {barber.specialization.map((spec, i) => (
                <span key={i} className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[0.85rem] text-gray-300">
                  {spec}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[0.85rem] text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-accent" />
                <span>{barber.startTime} - {barber.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-accent" />
                <span>{barber.workingDays.slice(0,3).map(d=>d.substring(0,3)).join(', ')}</span>
              </div>
            </div>

            <Link href={`/${shopSlug || ''}/book`} className="btn btn-accent px-10 py-3.5 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              Book Appointment
            </Link>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="mb-8 flex items-center gap-3">
          <ImageIcon size={24} className="text-accent" />
          <h2 className="text-[1.8rem] font-serif font-bold text-white">Portfolio</h2>
        </div>

        {barber.portfolioImages && barber.portfolioImages.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {barber.portfolioImages.map((img, i) => (
              <div key={i} className="break-inside-avoid rounded-xl overflow-hidden border border-white/10 bg-white/5 group relative">
                <img src={img} alt={`Portfolio ${i+1}`} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Star size={24} className="text-white/80" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl">
            <ImageIcon size={48} className="mx-auto mb-4 text-gray-600 opacity-50" />
            <p className="text-gray-400">No portfolio images uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarberProfile;
