'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngExpression } from 'leaflet';

export interface MapPin {
  lat: number;
  lng: number;
  type: 'urgent' | 'medium' | 'healthy' | 'event';
  title: string;
  description: string;
  category: string;
  date: string;
  timeline?: any[];
}

interface MapComponentProps {
  mapPins: MapPin[];
  activeMapFilter: string;
}

(L.Icon.Default.prototype as any)._getIconUrl = {};
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker() {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 15);
    });
  }, [map]);

  const userIcon = new L.DivIcon({
    className: 'bg-transparent',
    html: '<div style="font-size: 2rem; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));">📍</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30] 
  });

  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

const createCustomIcon = (type: string) => {
  let emoji = '🟣';
  if (type === 'urgent') emoji = '🔴';
  else if (type === 'medium') emoji = '🟡';
  else if (type === 'healthy') emoji = '🟢';
  else if (type === 'event') emoji = '🔵';

  return new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="hover:scale-125 transition-transform duration-200" style="font-size: 1.5rem; line-height: 1; cursor: pointer;">${emoji}</div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12]
  });
};

const MapComponent = ({ mapPins, activeMapFilter }: MapComponentProps) => {
  const defaultCenter: LatLngExpression = [3.1390, 101.6869]; 

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={13} 
      style={{ height: "100%", width: "100%", background: '#e5e7eb' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <LocationMarker />
      {mapPins.map((value, index) => {
        if (activeMapFilter === "reports" && value.timeline === undefined) return null;
        if (activeMapFilter === "events" && value.timeline !== undefined) return null;

        return (
          <Marker 
            key={index} 
            position={[value.lat, value.lng]} 
            icon={createCustomIcon(value.type)}
          >
            <Popup maxWidth={300} className="custom-popup">
               <div className="w-full text-left font-sans">
                  <div className="flex justify-center mb-2 w-full">
                     <div className="flex gap-2 bg-gray-600 w-min p-2 rounded-2xl shadow-sm">
                        <div style={{
                          background: value.type === 'urgent' ? "#ff0000" : value.type === 'healthy' ? "#009600" : value.type === 'medium' ? "#ff9600" : "#001eff",
                          height: "0.5rem", width: "0.5rem", borderRadius: "50%",
                          boxShadow: `0 0 5px ${value.type === 'urgent' ? "red" : "green"}`
                        }}/>
                     </div>
                  </div>
                  <div className="text-green-800 font-bold text-lg mb-1">{value.title}</div>
                  <div className="text-gray-600 mb-2 text-sm">
                    <span className="font-semibold text-green-700 block text-xs uppercase mb-1">Description</span> 
                    {value.description}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      {value.category}
                    </div>
                    <div className="text-gray-400 text-xs">{value.date}</div>
                  </div>
               </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;