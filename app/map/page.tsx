'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';

// --- Type Definition ---
interface MapPin {
  lat: number;
  lng: number;
  type: 'urgent' | 'medium' | 'healthy' | 'event';
  title: string;
  description: string;
  category: string;
  date: string;
  timeline?: any[];
}

// --- Dynamic Import (Vital for Next.js) ---
const MapWithNoSSR = dynamic(
  () => import('./map').then((mod) => mod.default),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex flex-col items-center justify-center h-full w-full bg-green-50 text-green-700">
        <div className="text-lg font-semibold animate-pulse">Loading Map...</div>
      </div>
    )
  }
);

export default function MapPage() {
  const [activeMapFilter, setActiveMapFilter] = useState<string>('all');
  
  // NOTE: Changed from pixels (x,y) to coordinates (lat,lng)
  // Ensure your data uses real coordinates like below (Example: Kuala Lumpur)
  const [mapPins] = useState<MapPin[]>([
    { 
      lat: 3.1390, 
      lng: 101.6869, 
      type: 'urgent', 
      title: 'Pothole Alert', 
      description: 'Deep hole on the main road.', 
      category: 'Infrastructure', 
      date: '2023-10-01', 
      timeline: [] 
    },
    { 
      lat: 3.1420, 
      lng: 101.6900, 
      type: 'healthy', 
      title: 'Park Cleaned', 
      description: 'Community cleanup successful.', 
      category: 'Environment', 
      date: '2023-10-02', 
      timeline: [] 
    },
    { 
      lat: 3.1350, 
      lng: 101.6800, 
      type: 'event', 
      title: 'Charity Run', 
      description: 'Annual 5km run starting line.', 
      category: 'Community', 
      date: '2023-11-15'
    },
  ]);

  const user = { name: 'Benjamin' };
  const notifications = [{ read: false }]; 
  const navigateTo = (path: string) => console.log('Navigate to', path);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col overflow-hidden">
      
      {/* --- Header --- */}
      <div style={{display: 'flex', flexDirection: 'column', position: 'fixed', right: 0, zIndex: 50, width: '100%'}}>
        <div className="bg-white shadow-sm border-b border-green-100">
        </div>

        {/* --- Filter Bar --- */}
        <div className="bg-white px-4 py-3 border-b border-green-100">
          <div className="flex flex-wrap gap-2">
            {['all', 'events', 'reports'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveMapFilter(filter)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeMapFilter === filter
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'events' ? 'Events' : 'Reports'}
              </button>
            ))}
          </div>
        </div>   
      </div>

      {/* --- Map Container --- */}
      <div 
        style={{
          width: "100%",
          // Using your specific height calculation
          height: "calc(100vh - (72.79px + 52.8px + 76.79px))", 
          marginTop: "calc(72.79px + 52.8px)",
          marginBottom: "76.79px",
          position: "relative",
          zIndex: 0 // Keep this 0 so header (z-index 50) stays on top
        }}
      >
        <MapWithNoSSR 
            mapPins={mapPins} 
            activeMapFilter={activeMapFilter} 
        />
      </div>
    </div>
  );
}