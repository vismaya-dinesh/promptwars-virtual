import { Link, useLocation } from 'react-router-dom';
import { Activity, ShieldAlert } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const getNavClass = (path) => {
    return location.pathname === path
      ? "text-blue-500 border-b-2 border-blue-500 pb-1 font-semibold"
      : "text-slate-400 hover:text-white transition-colors pb-1";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center px-6 shadow-xl">
      <div className="text-xl font-bold tracking-wider mr-10 flex items-center gap-2">
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.6)]"></span>
        <span style={{fontFamily: 'Syne'}}>VenueFlow</span>
      </div>
      
      <div className="flex gap-6 text-sm font-medium tracking-wide">
        <Link to="/attendee" className={`${getNavClass('/attendee')} flex items-center gap-2`}>
          <Activity size={16} />
          ATTENDEE LIVE
        </Link>
        <Link to="/staff" className={`${getNavClass('/staff')} flex items-center gap-2`}>
          <ShieldAlert size={16} />
          STAFF OPS
        </Link>
      </div>
    </nav>
  );
}
