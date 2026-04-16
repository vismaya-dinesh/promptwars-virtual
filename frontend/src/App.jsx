import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AttendeeDashboard from './pages/AttendeeDashboard';
import StaffOperations from './pages/StaffOperations';
import Navigation from './components/Navigation';

function App() {
  const [venueState, setVenueState] = useState(null);
  
  useEffect(() => {
    // Dynamically determine WebSocket URL
    const wsUrl = import.meta.env.DEV 
      ? 'ws://localhost:8000/ws' 
      : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      setVenueState(JSON.parse(event.data));
    };
    return () => ws.close();
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navigation />
        <main className="flex-1 p-4 pt-24 lg:p-8 lg:pt-28 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Navigate to="/attendee" replace />} />
              <Route path="/attendee" element={<AttendeeDashboard state={venueState} />} />
              <Route path="/staff" element={<StaffOperations state={venueState} />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
