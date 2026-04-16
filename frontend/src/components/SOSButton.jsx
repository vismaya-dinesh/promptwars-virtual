import React, { useState, memo } from 'react';
import { Siren, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default memo(function SOSButton() {
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [sosStatus, setSosStatus] = useState('idle'); // idle, confirming, sent

  const handleSOSConfirm = () => {
    setSosStatus('sent');
    setTimeout(() => {
      setIsSOSOpen(false);
      setSosStatus('idle');
    }, 3000);
  };

  return (
    <>
      <button 
        onClick={() => setIsSOSOpen(true)} 
        className="w-full bg-critical/10 border border-critical/30 hover:bg-critical/20 text-critical font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all relative overflow-hidden group cursor-pointer hover:scale-[1.02]"
      >
         <span className="absolute inset-0 w-full h-full bg-critical/20 scale-0 group-hover:scale-100 rounded-xl transition-transform duration-300 origin-center ease-out"></span>
         <Siren size={18} className="relative z-10" /> <span className="relative z-10">Emergency SOS</span>
      </button>

      <AnimatePresence>
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
    </>
  );
})
