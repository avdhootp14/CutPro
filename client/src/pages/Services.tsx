import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Scissors, Clock, Sparkles, Award, Star, Palette, Baby, MoreHorizontal } from 'lucide-react';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image?: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Hair: <Scissors size={24} />,
  Beard: <Sparkles size={24} />,
  Spa: <Award size={24} />,
  Facial: <Star size={24} />,
  Color: <Palette size={24} />,
  Kids: <Baby size={24} />,
  Other: <MoreHorizontal size={24} />,
};

const FALLBACK_SERVICES: Service[] = [
  { _id: '1', name: 'Classic Haircut', description: 'Precision cut tailored to your face shape.', price: 499, duration: 45, category: 'Hair', image: '/images/service-haircut.png' },
  { _id: '2', name: 'Beard Sculpting', description: 'Expert beard trimming and shaping with hot towel finish.', price: 349, duration: 30, category: 'Beard', image: '/images/service-beard.png' },
  { _id: '3', name: 'Royal Package', description: 'Haircut + Beard + Facial + Head Massage.', price: 999, duration: 90, category: 'Spa', image: '/images/service-royal.png' },
  { _id: '4', name: 'Hair Coloring', description: 'Premium coloring with salon-grade products.', price: 799, duration: 60, category: 'Color', image: '/images/service-coloring.png' },
  { _id: '5', name: 'Kids Haircut', description: 'Fun and gentle haircuts for the little ones.', price: 299, duration: 30, category: 'Kids', image: '/images/service-kids-haircut.png' },
  { _id: '6', name: 'Hot Towel Shave', description: 'Traditional straight razor shave with hot towel treatment.', price: 399, duration: 40, category: 'Beard', image: '/images/service-hot-towel.png' },
  { _id: '7', name: 'Charcoal Facial', description: 'Deep cleansing facial with activated charcoal.', price: 599, duration: 45, category: 'Facial', image: '/images/service-charcoal.png' },
  { _id: '8', name: 'Hair Spa Treatment', description: 'Deep conditioning and scalp therapy for healthy hair.', price: 699, duration: 60, category: 'Spa', image: '/images/service-hair-spa.png' },
];

const Services: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/services?shopSlug=${shopSlug || ''}`);
        const data = res.data?.data || res.data?.services || res.data || [];
        setServices(Array.isArray(data) && data.length > 0 ? data : FALLBACK_SERVICES);
      } catch {
        setServices(FALLBACK_SERVICES);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const categories = ['All', ...new Set(services.map(s => s.category || 'Other'))];
  const filtered = activeCategory === 'All' ? services : services.filter(s => s.category === activeCategory);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="pb-16">
      <div className="relative pt-40 pb-16 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,229,255,0.08),transparent_70%)] -top-[150px] -right-[100px] rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 sm:px-8 max-w-[1240px] relative z-10">
          <div className="text-center max-w-[640px] mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 text-accent text-[0.85rem] font-bold uppercase tracking-[0.2em] mb-4 text-shadow-accent relative before:content-[''] before:w-10 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:to-accent after:content-[''] after:w-10 after:h-[2px] after:bg-gradient-to-l after:from-transparent after:to-accent">
              <span>Our Menu</span>
            </div>
            <h1 className="font-serif font-semibold text-[clamp(2rem,4vw,3.5rem)] leading-[1.2] mb-4">
              Premium <span className="text-accent text-shadow-accent">Services</span>
            </h1>
            <p className="text-gray-400 text-[1.1rem] leading-[1.8]">Every service is crafted for perfection. Choose what suits you best.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 max-w-[1240px]">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap justify-center mb-12 animate-fade-up">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full text-[0.85rem] font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-to-br from-accent to-accent-dark text-black font-semibold border-transparent shadow-[0_4px_15px_rgba(0,229,255,0.3)]'
                  : 'bg-bgCard text-gray-400 border border-white/10 hover:border-accent/50 hover:text-accent'
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-up animate-delay-[200ms]">
          {filtered.map((service, i) => (
            <div key={service._id} className="card p-0 flex flex-col group overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}>
              {service.image && (
                <div className="w-full h-40 overflow-hidden relative">
                   <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                   <div className="absolute inset-0 bg-gradient-to-t from-bgCard via-transparent to-transparent"></div>
                </div>
              )}
              <div className="p-7 flex flex-col gap-3 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-12 h-12 flex items-center justify-center bg-accent/10 rounded-xl text-accent shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:bg-accent group-hover:text-black transition-colors duration-300">
                    {CATEGORY_ICONS[service.category] || CATEGORY_ICONS.Other}
                  </div>
                  <span className="badge badge-accent">{service.category || 'Other'}</span>
                </div>
                <h3 className="font-sans text-[1.1rem] font-semibold">{service.name}</h3>
                <p className="text-gray-400 text-[0.88rem] leading-[1.6] flex-1">{service.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[0.85rem]">
                    <Clock size={14} /> {service.duration} min
                  </div>
                  <div className="text-[1.25rem] font-bold text-accent">₹{service.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
