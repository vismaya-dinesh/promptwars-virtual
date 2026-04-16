import React, { useState, useEffect, memo, useMemo } from 'react';
import { AlertTriangle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default memo(function AnomalyFeed({ alerts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredAlerts = useMemo(() => {
    if (!alerts) return [];
    if (!debouncedSearch) return alerts;
    return alerts.filter(a => a.message.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [alerts, debouncedSearch]);
  if (!alerts) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col">
       <div className="flex justify-between items-center mb-6">
         <h3 className="text-lg font-bold font-syne flex items-center gap-2 text-white">
           <AlertTriangle size={18} className="text-critical" aria-hidden="true" /> Active Anomalies
         </h3>
         <div className="relative">
           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Filter alerts..." 
             className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
         </div>
       </div>
       <div className="space-y-4 flex-1 overflow-y-auto" role="alert" aria-live="assertive">
          <AnimatePresence>
            {filteredAlerts.map(alert => (
               <motion.div 
                 layout
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 key={alert.id}
                 className={`p-4 rounded-xl border relative overflow-hidden ${alert.severity === 'critical' ? 'bg-critical/10 border-critical/40 text-rose-200' : 'bg-amber-500/10 border-amber-500/40 text-amber-200'}`}
               >
                  <div className="font-semibold text-sm mb-1 uppercase tracking-wider opacity-80">{alert.severity} PRIORITY</div>
                  <div className="flex gap-2 items-center">
                     {alert.severity === 'critical' && <span className="absolute left-0 top-0 bottom-0 w-1 bg-critical animate-pulse"></span>}
                     {alert.message}
                  </div>
               </motion.div>
            ))}
          </AnimatePresence>
       </div>
    </div>
  );
})
