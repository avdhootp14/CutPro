import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User, Scissors, Check, CreditCard, Banknote } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRazorpay } from 'react-razorpay';
import { useAuth } from '../context/AuthContext';

interface Service {
  _id: string;
  name: string;
  price: number;
  duration: number;
}

interface Barber {
  _id: string;
  name: string;
}

const MOCK_SERVICES: Service[] = [
  { _id: '1', name: 'Classic Haircut', price: 499, duration: 45 },
  { _id: '2', name: 'Beard Sculpting', price: 349, duration: 30 },
  { _id: '3', name: 'Royal Package', price: 999, duration: 90 },
  { _id: '4', name: 'Hair Coloring', price: 799, duration: 60 },
  { _id: '5', name: 'Hot Towel Shave', price: 399, duration: 40 },
];

const MOCK_BARBERS: Barber[] = [
  { _id: '1', name: 'Mike Johnson' },
  { _id: '2', name: 'James Wilson' },
  { _id: '3', name: 'Carlos Rivera' },
];



const Book: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { Razorpay } = useRazorpay();
  
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [barbers, setBarbers] = useState<Barber[]>(MOCK_BARBERS);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, bRes] = await Promise.all([
          axios.get(`/services?shopSlug=${shopSlug || ''}`),
          axios.get(`/barbers?shopSlug=${shopSlug || ''}`)
        ]);
        const sData = sRes.data?.data || sRes.data?.services || sRes.data || [];
        const bData = bRes.data?.data || bRes.data?.barbers || bRes.data || [];
        if (sData.length > 0) setServices(sData);
        if (bData.length > 0) setBarbers(bData);
      } catch { /* Use mock data */ }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedBarber || !selectedDate || selectedServices.length === 0) {
        setAvailableSlots([]);
        return;
      }
      try {
        setLoadingSlots(true);
        const serviceIds = selectedServices.map(s => s._id).join(',');
        const res = await axios.get(`/appointments/available-slots?barberId=${selectedBarber._id}&date=${selectedDate}&services=${serviceIds}`);
        setAvailableSlots(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch slots", error);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedBarber, selectedDate, selectedServices]);

  const toggleService = (service: Service) => {
    setSelectedServices(prev =>
      prev.find(s => s._id === service._id)
        ? prev.filter(s => s._id !== service._id)
        : [...prev, service]
    );
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const handleBook = async () => {
    if (!user) {
      alert("Please log in to book an appointment.");
      navigate("/login");
      return;
    }

    try {
      setBookingLoading(true);
      
      // 1. Create Appointment
      const appointmentData = {
        customer: user._id,
        barber: selectedBarber?._id,
        services: selectedServices.map(s => s._id),
        appointmentDate: selectedDate,
        startTime: selectedTime,
        paymentMethod
      };
      
      const res = await axios.post('/appointments/book', appointmentData);
      const appointment = res.data.data;

      // 2. Handle Payment
      if (paymentMethod === 'online') {
        const orderRes = await axios.post('/payment/create-order', { appointmentId: appointment._id });
        const { orderId, amount, currency, key } = orderRes.data.data;

        const options = {
          key: key,
          amount: amount.toString(),
          currency: currency,
          name: "CUTPRO",
          description: "Salon Appointment Payment",
          order_id: orderId,
          handler: async (response: any) => {
            try {
              await axios.post('/payment/verify', {
                appointmentId: appointment._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              alert('Payment successful and appointment booked!');
              navigate('/dashboard');
            } catch (err) {
              console.error(err);
              alert('Payment verification failed.');
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || ""
          },
          theme: {
            color: "#D4AF37"
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        alert('Appointment booked successfully! You can pay cash at the salon.');
        navigate('/dashboard');
      }

    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const getMinDate = () => {
    const d = new Date();
    // Don't add a day, let them book today if slots are available
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 bg-bgPrimary relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,229,255,0.08),transparent_70%)] top-[10%] left-[50%] -translate-x-1/2 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[640px] mx-auto relative z-10">
        <div className="text-center animate-fade-up mb-10">
          <h2 className="font-serif font-semibold text-[clamp(2rem,4vw,3rem)] leading-[1.2] mb-3">
            Book Your <span className="text-accent text-shadow-accent">Appointment</span>
          </h2>
          <p className="text-gray-400">Complete the steps below to secure your spot.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between relative mb-12 max-w-[400px] mx-auto animate-fade-up animate-delay-[100ms] before:content-[''] before:absolute before:top-1/2 before:left-0 before:w-full before:h-[2px] before:bg-white/10 before:-translate-y-1/2 before:-z-10">
          {['Services', 'Details', 'Confirm'].map((label, i) => (
            <div 
              key={i} 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[0.9rem] transition-all duration-300 relative bg-bgPrimary ${
                step > i + 1 
                  ? 'bg-accent text-bgPrimary shadow-[0_0_15px_rgba(0,229,255,0.4)] border-2 border-accent' 
                  : step === i + 1 
                    ? 'text-accent border-2 border-accent shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                    : 'text-gray-500 border-2 border-white/20'
              }`}
            >
              {step > i + 1 ? <Check size={16} /> : i + 1}
              <span className={`absolute -bottom-7 whitespace-nowrap text-[0.8rem] font-medium transition-colors ${step >= i + 1 ? 'text-accent' : 'text-gray-500'}`}>{label}</span>
            </div>
          ))}
        </div>

        <div className="card p-8 sm:p-10 animate-fade-up animate-delay-[200ms]">

          {/* STEP 1: Services */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="flex items-center gap-2 font-sans text-[1.2rem] font-semibold mb-6">
                <Scissors size={20} className="text-accent" /> Select Services
              </h3>
              <div className="flex flex-col gap-3">
                {services.map(service => (
                  <div
                    key={service._id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex justify-between items-center ${
                      selectedServices.find(s => s._id === service._id) 
                        ? 'bg-accent/10 border-accent/50 shadow-[0_0_15px_rgba(0,229,255,0.1)]' 
                        : 'bg-bgSecondary border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                    onClick={() => toggleService(service)}
                  >
                    <div>
                      <strong className="block text-[1.05rem] font-medium text-white mb-1">{service.name}</strong>
                      <div className="text-gray-400 text-[0.85rem]">{service.duration} min</div>
                    </div>
                    <span className="text-accent font-bold text-[1.1rem]">₹{service.price}</span>
                  </div>
                ))}
              </div>

              {selectedServices.length > 0 && (
                <div className="mt-6 p-4 bg-accent/10 rounded-xl flex justify-between items-center border border-accent/20">
                  <span className="text-gray-300 font-medium">{selectedServices.length} service(s) · {totalDuration} min</span>
                  <strong className="text-accent text-[1.2rem]">₹{totalPrice}</strong>
                </div>
              )}

              <button className="btn btn-accent btn-full btn-lg mt-8" disabled={selectedServices.length === 0} onClick={() => setStep(2)}>
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: Barber, Date, Time */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="flex items-center gap-2 font-sans text-[1.2rem] font-semibold mb-6">
                <User size={20} className="text-accent" /> Choose Barber & Time
              </h3>

              <div className="flex flex-col gap-6">
                <div className="form-group group">
                  <label className="text-[0.85rem] font-medium text-gray-400 uppercase tracking-[0.08em] transition-colors group-focus-within:text-accent">Preferred Barber</label>
                  <select 
                    className="w-full bg-bgSecondary border border-white/10 text-white p-3.5 rounded-md font-sans text-[0.95rem] outline-none transition-all focus:border-accent focus:shadow-[0_0_0_4px_rgba(0,229,255,0.15)] focus:bg-bgCard appearance-none cursor-pointer" 
                    value={selectedBarber?._id || ''} 
                    onChange={e => setSelectedBarber(barbers.find(b => b._id === e.target.value) || null)}
                  >
                    <option value="">Any Available Barber</option>
                    {barbers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>

                <div className="form-group group">
                  <label className="text-[0.85rem] font-medium text-gray-400 uppercase tracking-[0.08em] transition-colors group-focus-within:text-accent">Appointment Date</label>
                  <input 
                    className="w-full bg-bgSecondary border border-white/10 text-white p-3.5 rounded-md font-sans text-[0.95rem] outline-none transition-all focus:border-accent focus:shadow-[0_0_0_4px_rgba(0,229,255,0.15)] focus:bg-bgCard [color-scheme:dark]" 
                    type="date" 
                    min={getMinDate()} 
                    value={selectedDate} 
                    onChange={e => setSelectedDate(e.target.value)} 
                  />
                </div>

                {selectedDate && selectedBarber ? (
                  <div className="animate-fade-in">
                    <label className="text-[0.85rem] font-medium text-gray-400 uppercase tracking-[0.08em] block mb-3">Available Slots</label>
                    {loadingSlots ? (
                      <div className="text-gray-400 text-sm">Loading slots...</div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {availableSlots.map(t => (
                          <button 
                            key={t} 
                            className={`py-2 rounded-md font-medium text-[0.9rem] transition-all duration-300 border ${
                              selectedTime === t 
                                ? 'bg-accent text-bgPrimary border-accent shadow-[0_0_15px_rgba(0,229,255,0.3)]' 
                                : 'bg-bgSecondary text-gray-300 border-white/10 hover:border-accent/50 hover:text-accent'
                            }`} 
                            onClick={() => setSelectedTime(t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        No slots available for this date.
                      </div>
                    )}
                  </div>
                ) : selectedDate && !selectedBarber ? (
                  <div className="text-accent text-sm">Please select a barber first.</div>
                ) : null}
              </div>

              <div className="flex gap-4 mt-8">
                <button className="btn btn-ghost flex-1" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-accent flex-[2]" disabled={!selectedDate || !selectedTime} onClick={() => setStep(3)}>Continue</button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmation */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="flex items-center gap-2 font-sans text-[1.2rem] font-semibold mb-6">
                <Calendar size={20} className="text-accent" /> Confirm Booking
              </h3>

              <div className="bg-bgSecondary rounded-xl p-6 border border-white/10">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start pb-4 border-b border-white/10">
                    <span className="text-gray-400">Services</span>
                    <strong className="text-right max-w-[60%]">{selectedServices.map(s => s.name).join(', ')}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-gray-400">Duration</span>
                    <strong>{totalDuration} min</strong>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-gray-400">Barber</span>
                    <strong>{selectedBarber?.name || 'Any Available'}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-gray-400">Date</span>
                    <strong className="text-right">{new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-gray-400">Time</span>
                    <strong>{selectedTime}</strong>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[1.1rem] font-medium text-gray-300">Total</span>
                    <span className="text-[1.5rem] font-bold text-accent">₹{totalPrice}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 animate-fade-up animate-delay-[300ms]">
                <h4 className="text-[1rem] font-medium text-white mb-3">Payment Method</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${paymentMethod === 'online' ? 'bg-accent/10 border-accent shadow-[0_0_15px_rgba(212,175,55,0.15)] text-accent' : 'bg-bgSecondary border-white/10 text-gray-400 hover:border-white/30'}`}
                    onClick={() => setPaymentMethod('online')}
                  >
                    <CreditCard size={24} />
                    <span className="font-semibold text-[0.9rem]">Pay Online</span>
                  </button>
                  <button 
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${paymentMethod === 'cash' ? 'bg-accent/10 border-accent shadow-[0_0_15px_rgba(212,175,55,0.15)] text-accent' : 'bg-bgSecondary border-white/10 text-gray-400 hover:border-white/30'}`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <Banknote size={24} />
                    <span className="font-semibold text-[0.9rem]">Pay at Salon</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button className="btn btn-ghost flex-1" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-accent flex-[2]" onClick={handleBook} disabled={bookingLoading}>
                  {bookingLoading ? 'Processing...' : <><Check size={18} /> Confirm & Book</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;
