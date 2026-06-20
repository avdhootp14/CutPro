"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Scissors, Globe, Heart, Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  const { shopSlug } = useParams() as any;
  const base = `/${shopSlug || ''}`;

  return (
    <footer className="bg-bgSecondary border-t border-white/10 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-8 max-w-[1240px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href={base} className="flex items-center gap-2 font-serif text-[1.4rem] font-bold text-white mb-2">
              <Scissors size={20} className="text-accent" />
              <span>CUTPRO</span>
            </Link>
            <p className="text-gray-400 text-[0.9rem] leading-relaxed">
              Premium grooming experience for the modern gentleman. Where tradition meets style.
            </p>
            <div className="flex gap-3 mt-2">
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:text-accent hover:border-accent hover:bg-accent/10 hover:-translate-y-1" aria-label="Website">
                <Globe size={18} />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:text-accent hover:border-accent hover:bg-accent/10 hover:-translate-y-1" aria-label="Favorites">
                <Heart size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-[1.1rem] font-semibold text-white mb-3">Quick Links</h4>
            <Link href={`${base}/services`} className="text-gray-400 text-[0.9rem] transition-colors duration-300 hover:text-accent hover:translate-x-1 inline-block">Our Services</Link>
            <Link href={`${base}/barbers`} className="text-gray-400 text-[0.9rem] transition-colors duration-300 hover:text-accent hover:translate-x-1 inline-block">Meet the Team</Link>
            <Link href={`${base}/book`} className="text-gray-400 text-[0.9rem] transition-colors duration-300 hover:text-accent hover:translate-x-1 inline-block">Book Appointment</Link>
            <Link href={`${base}/contact`} className="text-gray-400 text-[0.9rem] transition-colors duration-300 hover:text-accent hover:translate-x-1 inline-block">Contact Us</Link>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-[1.1rem] font-semibold text-white mb-3">Services</h4>
            <Link href={`${base}/services`} className="text-gray-400 text-[0.9rem] transition-colors duration-300 hover:text-accent hover:translate-x-1 inline-block">Haircuts</Link>
            <Link href={`${base}/services`} className="text-gray-400 text-[0.9rem] transition-colors duration-300 hover:text-accent hover:translate-x-1 inline-block">Beard Grooming</Link>
            <Link href={`${base}/services`} className="text-gray-400 text-[0.9rem] transition-colors duration-300 hover:text-accent hover:translate-x-1 inline-block">Hot Towel Shave</Link>
            <Link href={`${base}/services`} className="text-gray-400 text-[0.9rem] transition-colors duration-300 hover:text-accent hover:translate-x-1 inline-block">Hair Coloring</Link>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-[1.1rem] font-semibold text-white mb-3">Get in Touch</h4>
            <div className="flex items-start gap-3 text-gray-400 text-[0.9rem]">
              <MapPin size={16} className="text-accent shrink-0 mt-1" />
              <span>123 Main Street, City</span>
            </div>
            <div className="flex items-start gap-3 text-gray-400 text-[0.9rem]">
              <Phone size={16} className="text-accent shrink-0 mt-1" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-start gap-3 text-gray-400 text-[0.9rem]">
              <Mail size={16} className="text-accent shrink-0 mt-1" />
              <span>hello@cutpro.com</span>
            </div>
            <div className="flex items-start gap-3 text-gray-400 text-[0.9rem]">
              <Clock size={16} className="text-accent shrink-0 mt-1" />
              <span>Mon-Sat: 9 AM – 11 PM <br/>
                Sunday: 9 AM to 12 PM
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-gray-500 text-[0.85rem]">&copy; {new Date().getFullYear()} CutPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
