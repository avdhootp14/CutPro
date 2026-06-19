import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Scissors, Search, MapPin, Store, ArrowRight, Star, ChevronDown } from 'lucide-react';
import { Country, State, City } from 'country-state-city';

interface Shop {
  _id: string;
  shopName: string;
  shopSlug: string;
  shopLogo: string;
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  address?: string;
}

const PlatformHome: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search Filters
  const [filters, setFilters] = useState({
    country: '',
    state: '',
    district: '',
    city: '',
    searchQuery: ''
  });



  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        const res = await axios.get('/shop/directory');
        setShops(res.data.data);
      } catch (err) {
        console.error("Failed to fetch shop directory", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDirectory();
  }, []);

  // Extract unique locations for fallback if needed, but now using full lists
  // const uniqueCountries = useMemo(() => [...new Set(shops.map(s => s.country).filter(Boolean))], [shops]);
  // const uniqueStates = useMemo(() => [...new Set(shops.map(s => s.state).filter(Boolean))], [shops]);
  // const uniqueDistricts = useMemo(() => [...new Set(shops.map(s => s.district).filter(Boolean))], [shops]);
  // const uniqueCities = useMemo(() => [...new Set(shops.map(s => s.city).filter(Boolean))], [shops]);

  // Filter shops based on selections
  const filteredShops = useMemo(() => {
    return shops.filter(shop => {
      if (filters.country && shop.country !== filters.country) return false;
      if (filters.state && shop.state !== filters.state) return false;
      if (filters.district && shop.district !== filters.district) return false;
      if (filters.city && shop.city !== filters.city) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = shop.shopName?.toLowerCase().includes(query);
        const matchesSlug = shop.shopSlug?.toLowerCase().includes(query);
        if (!matchesName && !matchesSlug) return false;
      }
      return true;
    });
  }, [shops, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col font-sans">
      
      {/* Platform Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-bgPrimary/80 backdrop-blur-lg border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Scissors size={20} className="text-accent" />
            </div>
            <span className="font-serif font-bold text-xl tracking-wider text-white">CUT<span className="text-accent">PRO</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/partner-signup" className="text-[0.9rem] text-gray-300 hover:text-white font-medium transition-colors hidden md:block">
              For Businesses
            </Link>
            <Link to="/admin/login" className="btn btn-outline text-[0.85rem] px-5 py-2">
              Salon Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[100svh] px-4 overflow-hidden flex flex-col justify-between pt-20"> {/* pt-20 accounts for fixed navbar */}
        {/* Immersive Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img 
            src="/images/premium_salon_hero.png" 
            alt="Premium Salon" 
            className="w-full h-full object-cover opacity-[0.35] scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" 
          />
          {/* Complex Gradient Overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-bgPrimary via-bgPrimary/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-bgPrimary via-transparent to-bgPrimary opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A0D14_100%)] opacity-60" />
        </div>
        
        {/* Centered Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center container mx-auto max-w-6xl text-center relative z-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-white text-[0.85rem] font-bold tracking-widest uppercase mb-6 md:mb-8 backdrop-blur-md shadow-[0_10px_30px_rgba(212,175,55,0.1)]">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.8)]" /> The Elite Grooming Network
          </div>
          
          <h1 className="text-[3.5rem] sm:text-[5rem] md:text-[7rem] font-serif font-bold text-white leading-[0.9] mb-6 md:mb-8 relative w-full">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] sm:text-[10rem] md:text-[14rem] text-white/[0.03] whitespace-nowrap pointer-events-none select-none">CUTPRO</span>
            Elevate Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF2CD] to-[#D4AF37] italic filter drop-shadow-[0_0_25px_rgba(212,175,55,0.4)]">Signature Look.</span>
          </h1>
          
          <p className="text-gray-300 text-[1rem] md:text-xl max-w-2xl mx-auto mb-0 font-light tracking-wide leading-relaxed">
            Exclusive access to top-tier barbers and master stylists. <br className="hidden md:block"/> Because your appearance is your best introduction.
          </p>
        </div>

        {/* Bottom Elements: Floating Dock + Marquee */}
        <div className="relative z-30 w-full flex flex-col items-center pb-6 md:pb-8 animate-fade-up animate-delay-[200ms]">
          
          {/* Floating Search Dock */}
          <div className="container mx-auto px-4 sm:px-8 max-w-5xl mb-6">
            <div className="p-[1px] rounded-[24px] md:rounded-[40px] bg-gradient-to-b from-white/20 to-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <div className="bg-[#0A0D14]/90 backdrop-blur-2xl p-1.5 md:p-2 rounded-[23px] md:rounded-[39px] flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                  
                  <div className="w-full md:w-auto flex-1 flex items-center px-4 py-2 md:py-0">
                    <Search size={16} className="text-gray-500 mr-2 shrink-0" />
                    <input 
                      type="text" 
                      name="searchQuery"
                      value={filters.searchQuery}
                      onChange={handleFilterChange}
                      placeholder="Search salon name..." 
                      className="w-full bg-transparent border-none outline-none text-white text-[0.9rem] placeholder:text-gray-500 py-2"
                    />
                  </div>

                  <div className="w-full md:w-auto flex items-center px-4 py-2 md:py-0 relative group">
                    <MapPin size={16} className="text-gray-500 mr-2 shrink-0" />
                    <div className="relative w-full max-w-[130px]">
                      <select 
                        name="country" 
                        value={filters.country} 
                        onChange={e => setFilters({...filters, country: e.target.value, state: '', city: ''})}
                        className="w-full bg-transparent border-none outline-none text-gray-300 text-[0.9rem] appearance-none cursor-pointer pr-6 py-2"
                      >
                        <option value="" className="bg-[#111721]">Country</option>
                        {Country.getAllCountries().map(c => <option key={c.isoCode} value={c.isoCode} className="bg-[#111721]">{c.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-accent transition-colors" />
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex items-center px-4 py-2 md:py-0 relative group">
                    <MapPin size={16} className="text-gray-500 mr-2 shrink-0" />
                    <div className="relative w-full max-w-[130px]">
                      <select 
                        name="state" 
                        value={filters.state} 
                        onChange={e => setFilters({...filters, state: e.target.value, city: ''})}
                        disabled={!filters.country}
                        className="w-full bg-transparent border-none outline-none text-gray-300 text-[0.9rem] appearance-none cursor-pointer disabled:opacity-50 pr-6 py-2"
                      >
                        <option value="" className="bg-[#111721]">State</option>
                        {filters.country && State.getStatesOfCountry(filters.country).map(s => <option key={s.isoCode} value={s.isoCode} className="bg-[#111721]">{s.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-accent transition-colors" />
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex items-center px-4 py-2 md:py-0 relative group">
                    <MapPin size={16} className="text-gray-500 mr-2 shrink-0" />
                    <div className="relative w-full max-w-[130px]">
                      <select 
                        name="city" 
                        value={filters.city} 
                        onChange={e => setFilters({...filters, city: e.target.value})}
                        disabled={!filters.state}
                        className="w-full bg-transparent border-none outline-none text-gray-300 text-[0.9rem] appearance-none cursor-pointer disabled:opacity-50 pr-6 py-2"
                      >
                        <option value="" className="bg-[#111721]">City / District</option>
                        {filters.country && filters.state && City.getCitiesOfState(filters.country, filters.state).map(c => <option key={c.name} value={c.name} className="bg-[#111721]">{c.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-accent transition-colors" />
                    </div>
                  </div>

                </div>
                
                <button className="bg-gradient-to-r from-accent to-[#E6C665] text-black font-bold px-8 py-3 rounded-[16px] md:rounded-[30px] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shrink-0 w-full md:w-auto shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  Discover Now
                </button>
              </div>
            </div>
          </div>

        {/* Premium Glass Marquee */}
        <div className="w-full bg-[#0A0D14]/50 backdrop-blur-md border-y border-white/10 py-2.5 md:py-3 overflow-hidden relative z-20 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center">
          <div className="flex whitespace-nowrap animate-marquee">
            {Array(4).fill("PRECISION • MASTERY • LUXURY • ELEGANCE • STYLE • GROOMING • EXCELLENCE • ").map((text, i) => (
              <span key={i} className="text-[0.7rem] md:text-[0.8rem] font-bold tracking-[0.3em] mx-4 text-accent/80">{text}</span>
            ))}
          </div>
        </div>
        
        </div>
      </div>

      {/* Directory Grid */}
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl pb-32 pt-20 relative z-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold text-white">
            {filteredShops.length} {filteredShops.length === 1 ? 'Salon' : 'Salons'} Found
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner" /></div>
        ) : filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShops.map((shop, index) => {
              const isFeatured = index === 0 && filteredShops.length > 2;
              const bentoClasses = isFeatured 
                ? "md:col-span-2 md:row-span-2 h-full" 
                : "col-span-1 row-span-1 h-[400px]"; // Taller cards for elegance
                
              return (
                <Link 
                  key={shop._id}
                  to={`/${shop.shopSlug}`} 
                  className={`group relative bg-[#0A0D14] border border-white/5 hover:border-accent/40 rounded-[30px] overflow-hidden transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)] hover:-translate-y-2 flex flex-col w-full block ${bentoClasses}`}
                >
                    
                    {/* Top Section: Image Cover */}
                    <div className={`relative w-full ${isFeatured ? 'h-3/5' : 'h-[55%]'} bg-[#111721] overflow-hidden`}>
                      {/* Image or Premium Fallback Gradient */}
                      {shop.shopLogo ? (
                        <img src={shop.shopLogo} alt={shop.shopName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#111721] to-[#0A0D14] group-hover:scale-110 transition-transform duration-700">
                          {/* Abstract placeholder pattern */}
                          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.4)_0%,transparent_70%)]" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Scissors size={isFeatured ? 64 : 48} className="text-white/10" />
                          </div>
                        </div>
                      )}
                      
                      {/* Rating Badge Overlay */}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <Star size={12} className="fill-accent text-accent" />
                        <span className="text-[0.75rem] font-bold text-white">4.9</span>
                      </div>
                      
                      {/* Image Bottom Gradient to blend into content */}
                      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0A0D14] to-transparent" />
                    </div>

                    {/* Bottom Section: Content Area */}
                    <div className={`relative flex flex-col flex-1 z-10 ${isFeatured ? 'p-8' : 'p-6'} bg-[#0A0D14]`}>
                      {isFeatured && (
                        <div className="text-accent text-[0.7rem] uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Featured Partner
                        </div>
                      )}
                      
                      <h3 className={`${isFeatured ? 'text-4xl' : 'text-2xl'} font-serif font-bold text-white mb-2 group-hover:text-accent transition-colors line-clamp-1`}>
                        {shop.shopName || "Untitled Salon"}
                      </h3>
                      
                      <div className="flex items-start gap-2 text-[0.85rem] text-gray-400 mb-6 flex-1">
                        <MapPin size={14} className="mt-1 text-gray-500 shrink-0" />
                        <span className="line-clamp-2 leading-relaxed font-light">
                          {[
                            shop.city, 
                            (shop.state && shop.country) ? (State.getStateByCodeAndCountry(shop.state, shop.country)?.name || shop.state) : shop.state
                          ].filter(Boolean).join(', ') || 'Location pending'}
                        </span>
                      </div>

                      {/* Animated Book Button Area */}
                      <div className={`mt-auto pt-4 border-t border-white/5 flex items-center justify-between group-hover:border-accent/30 transition-colors duration-500`}>
                        <div className="flex flex-col">
                          <span className="text-[0.65rem] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Availability</span>
                          <span className="text-[0.85rem] font-medium text-white">Book Appointment</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500 group-hover:scale-110 shadow-lg">
                          <ArrowRight size={16} className="text-white group-hover:text-black transition-colors duration-500" />
                        </div>
                      </div>
                    </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl">
            <Store size={48} className="mx-auto mb-4 text-gray-600 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">No salons found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query to find more salons.</p>
            <button 
              onClick={() => setFilters({country: '', state: '', district: '', city: '', searchQuery: ''})}
              className="mt-6 btn btn-outline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default PlatformHome;
