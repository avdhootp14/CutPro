import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="pb-16">
      <div className="relative pt-40 pb-16 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,229,255,0.08),transparent_70%)] -top-[150px] -right-[100px] rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 sm:px-8 max-w-[1240px] relative z-10">
          <div className="text-center max-w-[640px] mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 text-accent text-[0.85rem] font-bold uppercase tracking-[0.2em] mb-4 text-shadow-accent relative before:content-[''] before:w-10 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:to-accent after:content-[''] after:w-10 after:h-[2px] after:bg-gradient-to-l after:from-transparent after:to-accent">
              <span>Get In Touch</span>
            </div>
            <h1 className="font-serif font-semibold text-[clamp(2rem,4vw,3.5rem)] leading-[1.2] mb-4">
              Contact <span className="text-accent text-shadow-accent">Us</span>
            </h1>
            <p className="text-gray-400 text-[1.1rem] leading-[1.8]">Have questions? We'd love to hear from you. Reach out anytime.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 max-w-[1240px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-start animate-fade-up animate-delay-[100ms]">

          {/* Contact Info Cards */}
          <div className="flex flex-col gap-4">
            <div className="card p-6 flex gap-5 items-start">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-accent/10 border border-accent/30 rounded-xl text-accent">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="font-sans text-[0.95rem] font-semibold mb-1">Visit Us</h4>
                <p className="text-gray-400 text-[0.88rem] leading-[1.6]">123 Main Street, Fashion District<br />Mumbai, Maharashtra 400001</p>
              </div>
            </div>
            <div className="card p-6 flex gap-5 items-start">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-accent/10 border border-accent/30 rounded-xl text-accent">
                <Phone size={22} />
              </div>
              <div>
                <h4 className="font-sans text-[0.95rem] font-semibold mb-1">Call Us</h4>
                <p className="text-gray-400 text-[0.88rem] leading-[1.6]">+91 98765 43210<br />+91 12345 67890</p>
              </div>
            </div>
            <div className="card p-6 flex gap-5 items-start">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-accent/10 border border-accent/30 rounded-xl text-accent">
                <Mail size={22} />
              </div>
              <div>
                <h4 className="font-sans text-[0.95rem] font-semibold mb-1">Email Us</h4>
                <p className="text-gray-400 text-[0.88rem] leading-[1.6]">hello@cutpro.com<br />support@cutpro.com</p>
              </div>
            </div>
            <div className="card p-6 flex gap-5 items-start">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-accent/10 border border-accent/30 rounded-xl text-accent">
                <Clock size={22} />
              </div>
              <div>
                <h4 className="font-sans text-[0.95rem] font-semibold mb-1">Working Hours</h4>
                <p className="text-gray-400 text-[0.88rem] leading-[1.6]">Mon – Sat: 9:00 AM – 10:00 PM<br />Sunday: 9:00 AM – 12:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card p-10">
            <h3 className="font-sans text-[1.3rem] font-semibold mb-2">Send a Message</h3>
            <p className="text-gray-400 text-[0.9rem] mb-8">We'll get back to you within 24 hours.</p>

            {submitted && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-md mb-6 font-medium text-center animate-fade-in">
                ✓ Message sent successfully! We'll be in touch soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 group">
                <label className="text-[0.85rem] font-medium text-gray-400 uppercase tracking-[0.08em] transition-colors group-focus-within:text-accent">Your Name</label>
                <input
                  className="bg-white/5 backdrop-blur-sm border border-white/10 text-white p-4 rounded-xl font-sans text-[0.95rem] outline-none transition-all duration-300 hover:bg-white/10 hover:border-white/20 focus:border-accent focus:shadow-[0_0_0_4px_rgba(212,175,55,0.15)] focus:bg-black/40 w-full placeholder-white/30"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 group">
                <label className="text-[0.85rem] font-medium text-gray-400 uppercase tracking-[0.08em] transition-colors group-focus-within:text-accent">Email Address</label>
                <input
                  className="bg-white/5 backdrop-blur-sm border border-white/10 text-white p-4 rounded-xl font-sans text-[0.95rem] outline-none transition-all duration-300 hover:bg-white/10 hover:border-white/20 focus:border-accent focus:shadow-[0_0_0_4px_rgba(212,175,55,0.15)] focus:bg-black/40 w-full placeholder-white/30"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 group">
                <label className="text-[0.85rem] font-medium text-gray-400 uppercase tracking-[0.08em] transition-colors group-focus-within:text-accent">Message</label>
                <textarea
                  className="bg-white/5 backdrop-blur-sm border border-white/10 text-white p-4 rounded-xl font-sans text-[0.95rem] outline-none transition-all duration-300 hover:bg-white/10 hover:border-white/20 focus:border-accent focus:shadow-[0_0_0_4px_rgba(212,175,55,0.15)] focus:bg-black/40 resize-none w-full placeholder-white/30"
                  rows={6}
                  placeholder="Tell us what's on your mind..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-accent btn-full btn-lg mt-2">
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
