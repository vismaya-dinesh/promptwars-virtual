import React, { memo } from 'react';
import { Clock } from 'lucide-react';

export default memo(function WaitTimePanel({ wait_times }) {
  if (!wait_times) return null;

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden shadow-xl" aria-live="polite">
       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
       <h3 className="font-bold flex items-center gap-2 mb-6 font-syne text-white">
         <Clock size={18} className="text-amber-500" aria-hidden="true" /> Wait Times
       </h3>
       
       <div className="space-y-4">
         {Object.entries(wait_times).map(([key, time]) => (
            <div key={key} className="flex items-center justify-between pointer-events-none" aria-label={`Wait time for ${key.replace('_', ' ')} is ${time} minutes`}>
              <span className="text-slate-300 capitalize text-sm">{key.replace('_', ' ')}</span>
              <span className="font-bold text-lg font-syne bg-white/10 px-3 py-1 rounded-md text-white">{time} min</span>
            </div>
         ))}
       </div>
    </div>
  );
})
