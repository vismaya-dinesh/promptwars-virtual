import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Map, Clock, Coffee, Siren, X, CheckCircle, AlertTriangle } from 'lucide-react';
import CrowdDensityCard from '../components/CrowdDensityCard';
import WaitTimePanel from '../components/WaitTimePanel';
import SOSButton from '../components/SOSButton';

export default function AttendeeDashboard({ state }) {
  const [isConcessionsOpen, setIsConcessionsOpen] = useState(false);
  if (!state) return <div className="h-full flex items-center justify-center pt-20 text-slate-400">Awaiting telemetry...</div>;
  const { wait_times, crowd_density } = state;

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
        <CrowdDensityCard crowd_density={crowd_density} />

        {/* Wait Times Vertical Strip */}
        <div className="space-y-6">
          <WaitTimePanel wait_times={wait_times} />

          <button onClick={() => setIsConcessionsOpen(true)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] cursor-pointer hover:scale-[1.02]">
             <Coffee size={18} /> Order Concessions
          </button>
          
          <SOSButton />
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


      </AnimatePresence>
    </motion.div>
  );
}
