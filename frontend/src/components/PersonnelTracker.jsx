import React, { memo } from 'react';
import { MapPin } from 'lucide-react';

export default memo(function PersonnelTracker({ personnel }) {
  if (!personnel) return null;

  return (
    <div className="grid grid-cols-2 gap-6">
      {personnel.map((p, i) => (
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
  );
})
