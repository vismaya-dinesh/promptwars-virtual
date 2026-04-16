import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AttendeeDashboard from './pages/AttendeeDashboard';
import Navigation from './components/Navigation';
import { subscribeToVenueState } from './firebase';

const StaffOperations = lazy(() => import('./pages/StaffOperations'));

function App() {
  const [venueState, setVenueState] = useState(null);
  
  useEffect(() => {
    let intervalId;
    let hasData = false;

    const unsubscribe = subscribeToVenueState((data) => {
      hasData = true;
      setVenueState(data);
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    });

    const fallbackTimeout = setTimeout(() => {
      if (!hasData) {
        const poll = async () => {
          try {
            const res = await fetch('/api/state');
            if (res.ok) setVenueState(await res.json());
          } catch (e) {}
        };
        poll();
        intervalId = setInterval(poll, 2000);
      }
    }, 2000);

    return () => {
      unsubscribe();
      clearTimeout(fallbackTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <Router>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white p-2 rounded z-50">Skip to content</a>
      <div className="min-h-screen flex flex-col font-sans">
        <Navigation />
        <main id="main-content" className="flex-1 p-4 pt-24 lg:p-8 lg:pt-28 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Navigate to="/attendee" replace />} />
              <Route path="/attendee" element={<AttendeeDashboard state={venueState} />} />
              <Route path="/staff" element={
                <Suspense fallback={<div className="text-center mt-20">Loading Command Operations...</div>}>
                  <StaffOperations state={venueState} />
                </Suspense>
              } />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
