import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Scissors, Star, Sparkles, Award
} from 'lucide-react';

const SERVICES_PREVIEW = [
  { icon: <Scissors size={28} />, name: 'Classic Haircut', desc: 'Precision cuts tailored to your face shape and personal style.', price: '₹499', duration: '45 min', image: '/images/service-haircut.png' },
  { icon: <Sparkles size={28} />, name: 'Beard Sculpting', desc: 'Expert beard trimming, shaping, and hot towel treatment.', price: '₹349', duration: '30 min', image: '/images/service-beard.png' },
  { icon: <Award size={28} />, name: 'Royal Package', desc: 'Full haircut, beard trim, facial, and head massage combo.', price: '₹999', duration: '90 min', image: '/images/service-royal.png' },
  { icon: <Star size={28} />, name: 'Hair Coloring', desc: 'Premium hair coloring with salon-grade products.', price: '₹799', duration: '60 min', image: '/images/service-coloring.png' },
];

const TESTIMONIALS = [
  { name: 'Rahul S.', rating: 5, text: 'Best barbershop in the city! The attention to detail is unmatched. My go-to place for every haircut.', avatar: 'RS' },
  { name: 'Amit K.', rating: 5, text: 'The online booking system is so convenient. No more waiting in queues. And the barbers are truly skilled!', avatar: 'AK' },
  { name: 'Vikram P.', rating: 5, text: 'The Royal Package is worth every penny. You walk out feeling like a new person. Highly recommended!', avatar: 'VP' },
];

const STATS = [
  { value: '5000+', label: 'Happy Clients' },
  { value: '15+', label: 'Expert Barbers' },
  { value: '4.9', label: 'Avg Rating' },
  { value: '8+', label: 'Years Experience' },
];

const Home: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const base = `/${shopSlug || ''}`;

  return (
    <div className="pb-16 bg-bgPrimary">

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden" id="hero">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero-bg.png)' }}
        >
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-r from-black/80 to-transparent" />
        </div>

        <div className="container relative z-10 pt-32 pb-16 mx-auto px-4 sm:px-8 max-w-[1240px]">
          <div className="max-w-[600px] animate-fade-up">
            <div className="flex items-center gap-2 text-accent text-[0.8rem] font-bold uppercase tracking-[0.2em] mb-4">
              <span className="text-accent opacity-70">/</span> WELCOME TO CUTPRO <span className="text-accent opacity-70">/</span>
            </div>
            
            <h1 className="font-serif font-bold leading-[1.1] tracking-tight text-[clamp(3.5rem,8vw,5.5rem)] mb-6 text-white">
              Perfect<br />
              Perfect<br />
              modern<br />
              styling
            </h1>
            
            <p className="text-[1.1rem] text-gray-300 leading-[1.8] mb-10 max-w-[480px]">
              We provide a comprehensive menu of traditional and contemporary services. Remember... Its not just a groom, its an experience!
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to={`${base}/book`} className="btn btn-outline hover:bg-white/5 py-4 px-10 text-[0.85rem] tracking-[0.2em]" id="hero-book-btn">
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ ABOUT US ═══════════════════════════ */}
      <section className="bg-bgPrimary pt-[120px] pb-[60px]" id="about">
        <div className="container mx-auto px-4 sm:px-8 max-w-[1240px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center text-center">
            
            {/* Left Image */}
            <div className="hidden md:block w-full aspect-[3/4] bg-[#111721] rounded-2xl overflow-hidden animate-fade-up border border-white/5 relative group">
               <img src="/images/barber-1.png" alt="Barber" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>

            <div className="px-4 animate-fade-up animate-delay-[200ms]">
              <h2 className="font-serif font-bold text-[2.5rem] mb-2 text-white">About Us</h2>
              <div className="flex items-center justify-center gap-2 text-accent text-[0.7rem] font-bold uppercase tracking-[0.3em] mb-8">
                DISCOVER OUR STORY
              </div>
              <p className="text-gray-400 text-[1rem] leading-[1.8] mb-6">
                At CutPro, you will find an atmosphere of high-end sophistication mixed with modern amenities. We've brought back the traditional barbershop vibe and elevated it for the modern trendsetter.
              </p>
              <p className="text-gray-400 text-[1rem] leading-[1.8]">
                Every haircut is executed with precision, style, and an uncompromising attention to detail.
              </p>
            </div>

            {/* Right Image */}
            <div className="hidden md:block w-full aspect-[3/4] bg-[#111721] rounded-2xl overflow-hidden animate-fade-up border border-white/5 relative group">
              <img src="/images/service-haircut.png" alt="Haircut Service" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════ STATS BAR ═══════════════════════════ */}
      <section className="bg-bgSecondary py-16 border-y border-white/5">
        <div className="container mx-auto px-4 sm:px-8 max-w-[1240px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8 text-center">
            {STATS.map((s, i) => (
              <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="block font-serif text-[2.5rem] font-bold text-accent">{s.value}</span>
                <span className="text-[0.75rem] text-gray-400 uppercase tracking-[0.2em] mt-2 block">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ SERVICES ═══════════════════════════ */}
      <section className="py-[120px] bg-bgPrimary" id="services-preview">
        <div className="container mx-auto px-4 sm:px-8 max-w-[1240px]">
          <div className="text-center max-w-[640px] mx-auto mb-16 animate-fade-up">
            <h2 className="font-serif font-bold text-[2.5rem] mb-2 text-white">Our Services</h2>
            <div className="flex items-center justify-center gap-2 text-accent text-[0.7rem] font-bold uppercase tracking-[0.3em] mb-8">
              WHAT WE OFFER
            </div>
            <p className="text-gray-400 text-[1.1rem] leading-[1.8]">From classic cuts to full grooming experiences — every visit is tailored to perfection.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES_PREVIEW.map((service, i) => (
              <div key={i} className="card p-0 flex flex-col group overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                {service.image && (
                  <div className="w-full h-48 overflow-hidden relative">
                     <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                     <div className="absolute inset-0 bg-gradient-to-t from-bgCard via-transparent to-transparent"></div>
                  </div>
                )}
                <div className="p-7 flex flex-col gap-3 flex-1">
                  <div className="w-12 h-12 flex items-center justify-center bg-accent/10 rounded-xl text-accent shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:bg-accent group-hover:text-black transition-colors duration-300">
                    {service.icon}
                  </div>
                  <h3 className="font-sans text-[1.25rem] font-bold mt-2">{service.name}</h3>
                  <p className="text-gray-400 text-[0.9rem] leading-[1.6] flex-1">{service.desc}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
                    <span className="text-[0.75rem] uppercase tracking-[0.1em] text-gray-500">{service.duration}</span>
                    <span className="text-[1.2rem] font-serif font-bold text-accent">{service.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to={`${base}/services`} className="btn btn-outline" id="view-all-services">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ TESTIMONIALS ═══════════════════════════ */}
      <section className="py-[120px] bg-bgSecondary" id="testimonials">
        <div className="container mx-auto px-4 sm:px-8 max-w-[1240px]">
          <div className="text-center max-w-[640px] mx-auto mb-16 animate-fade-up">
            <h2 className="font-serif font-bold text-[2.5rem] mb-2 text-white">Testimonials</h2>
            <div className="flex items-center justify-center gap-2 text-accent text-[0.7rem] font-bold uppercase tracking-[0.3em] mb-8">
              CLIENT LOVE
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-8 flex flex-col gap-5 animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-gray-400 text-[0.95rem] leading-[1.7] flex-1 italic font-serif text-[1.1rem]">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5 font-bold text-[0.8rem] uppercase tracking-[0.1em]">
                  <div className="w-10 h-10 rounded-[2px] bg-[#111721] border border-white/5 flex items-center justify-center text-accent">{t.avatar}</div>
                  <span>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CTA BANNER ═══════════════════════════ */}
      <section className="relative py-[100px] text-center bg-bgPrimary border-t border-white/5 overflow-hidden">
        <div className="container relative z-10 animate-fade-up mx-auto px-4 sm:px-8 max-w-[1240px]">
          <h2 className="font-serif font-bold text-[2.5rem] mb-2 text-white">Ready for a Fresh Look?</h2>
          <div className="flex items-center justify-center gap-2 text-accent text-[0.7rem] font-bold uppercase tracking-[0.3em] mb-8">
            BOOK ONLINE
          </div>
          <p className="text-gray-400 text-[1rem] max-w-[500px] mx-auto mb-10">Book your appointment in under 60 seconds and experience the CutPro difference.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to={`${base}/book`} className="btn btn-accent" id="cta-book-btn">
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
