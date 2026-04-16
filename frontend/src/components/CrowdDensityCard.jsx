import React, { useEffect, useState, Component } from 'react';
import { Map as MapIcon } from 'lucide-react';
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

class MapErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Map Error caught:", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const IS_DUMMY_KEY = API_KEY === 'dummy_maps_key' || API_KEY === 'your_maps_api_key_here' || API_KEY === '';

function HeatmapLayer({ crowd_density }) {
  const map = useMap();
  const visualization = useMapsLibrary('visualization');
  const [heatmap, setHeatmap] = useState(null);

  useEffect(() => {
    if (!visualization || !map) return;

    const heatmapInstance = new visualization.HeatmapLayer({
      radius: 40,
      opacity: 0.8,
    });
    setHeatmap(heatmapInstance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visualization, map]);

  useEffect(() => {
    if (!heatmap || !window.google) return;
    
    // Convert sections to dummy coordinates around a central venue
    const points = [
      { location: new window.google.maps.LatLng(37.7749, -122.4194), weight: crowd_density.section_a || 10 },
      { location: new window.google.maps.LatLng(37.7750, -122.4180), weight: crowd_density.section_b || 10 },
      { location: new window.google.maps.LatLng(37.7740, -122.4194), weight: crowd_density.section_c || 10 },
      { location: new window.google.maps.LatLng(37.7740, -122.4180), weight: crowd_density.section_d || 10 },
    ];
    
    heatmap.setData(points);
    heatmap.setMap(map);

    return () => {
      heatmap.setMap(null);
    };
  }, [heatmap, crowd_density]);

  return null;
}

const SimpleGrid = ({ crowd_density }) => (
  <div className="grid grid-cols-2 gap-4 h-64">
     {Object.entries(crowd_density).map(([section, density]) => {
        let colorClass = density > 80 ? 'bg-critical/20 border-critical/50 text-rose-200' : density > 50 ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200';
        return (
          <button 
            key={section} 
            className={`border rounded-xl flex flex-col justify-center items-center transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${colorClass}`}
            aria-label={`${section.replace('_', ' ')} density is ${density}%`}
          >
            <span className="text-lg uppercase tracking-wider font-bold mb-2">{section.replace('_', ' ')}</span>
            <span className="text-3xl font-bold font-syne">{density}%</span>
          </button>
        )
     })}
  </div>
);

export default React.memo(function CrowdDensityCard({ crowd_density }) {
  const [mapError, setMapError] = useState(false);

  if (!crowd_density) return null;

  return (
    <div className="col-span-1 lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl relative overflow-hidden" aria-live="polite">
      <div className="flex items-center gap-2 mb-4">
        <MapIcon className="text-blue-500" />
        <h2 className="text-xl font-bold font-syne">Live Crowd Density</h2>
        <span className="ml-auto flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
      </div>
      
      {IS_DUMMY_KEY || mapError ? (
        <SimpleGrid crowd_density={crowd_density} />
      ) : (
        <MapErrorBoundary fallback={<SimpleGrid crowd_density={crowd_density} />}>
          <div className="h-64 rounded-xl overflow-hidden border border-white/10">
            <APIProvider apiKey={API_KEY} onLoadError={() => setMapError(true)}>
              <Map
                defaultZoom={15}
                defaultCenter={{ lat: 37.7745, lng: -122.4187 }}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapId="VENUE_MAP_ID"
              >
                 <HeatmapLayer crowd_density={crowd_density} />
              </Map>
            </APIProvider>
          </div>
        </MapErrorBoundary>
      )}
    </div>
  );
});
