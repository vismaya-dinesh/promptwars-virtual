import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Map, Clock, Coffee, Siren, X, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AttendeeDashboard({ state }) {
  const [isConcessionsOpen, setIsConcessionsOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [sosStatus, setSosStatus] = useState('idle'); // idle, confirming, sent

  if (!state) return <div className="text-center text-slate-500 mt-20 animate-pulse">Connecting to venue sensors...</div>;

  const { wait_times, crowd_density } = state;

  const handleSOSConfirm = () => {
    setSosStatus('sent');
    setTimeout(() => {
      setIsSOSOpen(false);
      setSosStatus('idle');
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-6xl mx-auto space-y-6 relative"
    >
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to VenueFlow</h1>
        <p className="text-slate-400">Live venue intelligence. Optimized for your experience.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heatmap Card */}
        <div className="col-span-1 lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Map className="text-blue-500" />
            <h2 className="text-xl font-bold font-syne">Live Crowd Density</h2>
            <span className="ml-auto flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 h-64">
             {Object.entries(crowd_density).map(([section, density]) => {
                let colorClass = density > 80 ? 'bg-critical/20 border-critical/50 text-critical' : density > 50 ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500';
                return (
                  <div key={section} className={`border rounded-xl flex flex-col justify-center items-center transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-blue-400 ${colorClass}`}>
                    <span className="text-lg uppercase tracking-wider font-bold mb-2">{section.replace('_', ' ')}</span>
                    <span className="text-3xl font-bold font-syne">{density}%</span>
                  </div>
                )
             })}
          </div>
        </div>

        {/* Wait Times Vertical Strip */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <h3 className="font-bold flex items-center gap-2 mb-6 font-syne"><Clock size={18} className="text-amber-500"/> Wait Times</h3>
             
             <div className="space-y-4">
               {Object.entries(wait_times).map(([key, time]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-slate-300 capitalize text-sm">{key.replace('_', ' ')}</span>
                    <span className="font-bold text-lg font-syne bg-white/10 px-3 py-1 rounded-md">{time} min</span>
                  </div>
               ))}
             </div>
          </div>

          <button onClick={() => setIsConcessionsOpen(true)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] cursor-pointer hover:scale-[1.02]">
             <Coffee size={18} /> Order Concessions
          </button>
          
          <button onClick={() => setIsSOSOpen(true)} className="w-full bg-critical/10 border border-critical/30 hover:bg-critical/20 text-critical font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all relative overflow-hidden group cursor-pointer hover:scale-[1.02]">
             <span className="absolute inset-0 w-full h-full bg-critical/20 scale-0 group-hover:scale-100 rounded-xl transition-transform duration-300 origin-center ease-out"></span>
             <Siren size={18} className="relative z-10" /> <span className="relative z-10">Emergency SOS</span>
          </button>
        </div>

      </div>

      <AnimatePresence>
        {isConcessionsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-xl font-bold font-syne flex items-center gap-2"><Coffee size={20} className="text-blue-400" /> Express Order</h3>
                <button onClick={() => setIsConcessionsOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { name: 'Hot Dog & Soda Combo', price: '$12' },
                  { name: 'Premium Craft Beer', price: '$14' },
                  { name: 'Bottled Water', price: '$5' },
                  { name: 'Nachos with Cheese', price: '$8' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:border-blue-500/50 transition-colors cursor-pointer group">
                    <span className="font-semibold">{item.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 font-syne">{item.price}</span>
                      <button className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors text-sm font-bold">Add</button>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => { alert('Order placed! Pick up at Food Stand 1 in 10 minutes.'); setIsConcessionsOpen(false); }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-4 transition-all"
                >
                  Checkout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isSOSOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a0f11] border border-critical/50 rounded-3xl w-full max-w-sm shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden text-center p-8"
            >
              {sosStatus === 'idle' ? (
                <>
                  <div className="w-20 h-20 bg-critical/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={40} className="text-critical" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-syne">Trigger SOS?</h3>
                  <p className="text-slate-400 mb-8 mx-auto -mt-2.5">Security and medical staff will be dispatched to your location immediately.</p>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={handleSOSConfirm}
                      className="w-full bg-critical border border-critical backdrop-blur-2xl hover:bg-red-500 text-white font-bold py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    >
                      Confirm SOS
                    </button>
                    <button 
                      onClick={() => setIsSOSOpen(false)}
                      className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-slate-300 font-bold py-4 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-8"
                >
                  <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={50} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-400 mb-2 font-syne">SOS Dispatched</h3>
                  <p className="text-slate-300">Help is on the way to your location. Stay calm.</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
