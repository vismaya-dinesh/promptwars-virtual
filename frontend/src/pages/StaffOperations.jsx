import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Users, MapPin, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

export default function StaffOperations({ state }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (state) {
      setHistory(prev => {
        const newHist = [...prev, { time: new Date().toLocaleTimeString(), ...state.crowd_density }];
        return newHist.slice(-20); // Keep last 20
      });
    }
  }, [state]);

  if (!state) return <div className="text-center text-slate-500 mt-20 animate-pulse">Awaiting telemetry...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <header className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold font-syne text-white">Command Operations</h1>
          <p className="text-slate-400 text-sm mt-1">Live facility monitoring & deployment.</p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-white/5">
           <Activity size={14} className="text-emerald-400" /> System Nominal
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics & Map */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl h-80 relative">
              <h3 className="text-lg font-bold font-syne mb-4 flex items-center gap-2"><Users size={18} className="text-blue-400"/> Facility Crowd Index</h3>
              <div className="h-56 w-full -ml-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={history}>
                     <XAxis dataKey="time" hide />
                     <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                     <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px'}} />
                     <Line type="monotone" dataKey="section_a" stroke="#3b82f6" strokeWidth={2} dot={false} />
                     <Line type="monotone" dataKey="section_c" stroke="#f59e0b" strokeWidth={2} dot={false} />
                     <Line type="monotone" dataKey="section_d" stroke="#10b981" strokeWidth={2} dot={false} />
                   </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-6">
              {state.personnel.map((p, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                   <div className="bg-blue-500/20 p-3 rounded-full">
                     <MapPin className="text-blue-400" />
                   </div>
                   <div>
                     <div className="text-sm text-slate-400 capitalize">{p.role} Unit</div>
                     <div className="font-bold text-white">{p.location}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Alerts Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
           <h3 className="text-lg font-bold font-syne mb-6 flex items-center gap-2">
             <AlertTriangle size={18} className="text-critical" /> Active Anomalies
           </h3>
           <div className="space-y-4">
              <AnimatePresence>
                {state.alerts.map(alert => (
                   <motion.div 
                     layout
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
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

      </div>
    </motion.div>
  );
}
