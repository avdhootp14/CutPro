import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

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
  isAvailable: boolean;
  avatar?: string;
}

const FALLBACK_BARBERS: Barber[] = [
  { _id: '1', name: 'Mike Johnson', specialization: ['Fades', 'Classic Cuts'], experience: 8, rating: 4.9, totalReviews: 312, startTime: '09:00', endTime: '18:00', workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], isAvailable: true, avatar: '/images/barber-1.png' },
  { _id: '2', name: 'Sarah Wilson', specialization: ['Beard Styling', 'Hair Color'], experience: 6, rating: 4.8, totalReviews: 245, startTime: '10:00', endTime: '19:00', workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'], isAvailable: true, avatar: '/images/barber-2.png' },
  { _id: '3', name: 'David Brown', specialization: ['Kids Cuts', 'Modern Styles'], experience: 5, rating: 4.7, totalReviews: 189, startTime: '09:00', endTime: '17:00', workingDays: ['Tuesday','Wednesday','Thursday','Friday','Saturday'], isAvailable: false, avatar: '/images/barber-1.png' },
  { _id: '4', name: 'Carlos Rivera', specialization: ['Hot Towel Shave', 'Fades'], experience: 10, rating: 5.0, totalReviews: 420, startTime: '08:00', endTime: '16:00', workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], isAvailable: true, avatar: '/images/barber-2.png' },
];

const Barbers: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/barbers?shopSlug=${shopSlug || ''}`);
        const data = res.data?.data || res.data?.barbers || res.data || [];
        setBarbers(Array.isArray(data) && data.length > 0 ? data : FALLBACK_BARBERS);
      } catch {
        setBarbers(FALLBACK_BARBERS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="pb-16">
      <div className="relative pt-40 pb-16 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,229,255,0.08),transparent_70%)] -top-[150px] -right-[100px] rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 sm:px-8 max-w-[1240px] relative z-10">
          <div className="text-center max-w-[640px] mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 text-accent text-[0.85rem] font-bold uppercase tracking-[0.2em] mb-4 text-shadow-accent relative before:content-[''] before:w-10 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:to-accent after:content-[''] after:w-10 after:h-[2px] after:bg-gradient-to-l after:from-transparent after:to-accent">
              <span>The Team</span>
            </div>
            <h1 className="font-serif font-semibold text-[clamp(2rem,4vw,3.5rem)] leading-[1.2] mb-4">
              Our Master <span className="text-accent text-shadow-accent">Barbers</span>
            </h1>
            <p className="text-gray-400 text-[1.1rem] leading-[1.8]">Each barber is a specialist in their craft with years of dedicated experience.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 max-w-[1240px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-up animate-delay-[100ms]">
          {barbers.map((barber, i) => (
            <Link to={`/${shopSlug || ''}/barbers/${barber._id}`} key={barber._id} className="card overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-2 transition-all duration-300" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="relative w-full aspect-square bg-bgSecondary overflow-hidden group">
                <img
                  src={barber.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(barber.name)}&background=1c1c1c&color=00e5ff&size=160&font-size=0.4&bold=true`}
                  alt={barber.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-[0.75rem] font-semibold border backdrop-blur-sm shadow-lg ${
                  barber.isAvailable 
                    ? 'bg-green-500/15 text-green-400 border-green-500/20' 
                    : 'bg-red-500/15 text-red-400 border-red-500/20'
                }`}>
                  {barber.isAvailable ? 'Available' : 'Busy'}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-sans text-[1.15rem] font-semibold mb-1">{barber.name}</h3>
                <p className="text-gray-400 text-[0.85rem] mb-4">{barber.experience}+ Years Experience</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(barber.specialization || []).map((spec, j) => (
                    <span key={j} className="badge badge-accent">{spec}</span>
                  ))}
                </div>

                <div className="flex gap-6 pt-4 border-t border-white/10 mt-auto">
                  <div className="flex items-center gap-1.5 text-[0.85rem] text-gray-400">
                    <Star size={14} className="text-accent fill-accent" />
                    <strong className="text-white">{barber.rating || '0'}</strong>
                    <span>({barber.totalReviews || 0})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[0.85rem] text-gray-400">
                    <Clock size={14} className="text-accent" />
                    <span>{barber.startTime} – {barber.endTime}</span>
                  </div>
                </div>

                <Link to="/book" className="btn btn-outline btn-sm btn-full mt-6">
                  Book with {barber.name.split(' ')[0]}
                </Link>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Barbers;
