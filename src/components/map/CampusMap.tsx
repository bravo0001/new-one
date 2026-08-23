'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertTriangle, CheckCircle, Zap, Droplet, Trash2, X, RefreshCw, Building2 } from 'lucide-react';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
};

export interface CityNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'normal' | 'attention' | 'critical';
  type: 'depot' | 'plant' | 'transit' | 'hub' | 'commercial';
  metric: string;
  details: string;
}

export const CampusMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<CityNode | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLoc({ lat: 22.7200, lng: 75.8500 }) // Fallback location
      );
    } else {
      setUserLoc({ lat: 22.7200, lng: 75.8500 });
    }
  }, []);

  const nodes: CityNode[] = [
    {
      id: 'node-indore-central',
      name: 'Indore Central Municipal Depot',
      lat: 22.7196,
      lng: 75.8577,
      status: 'normal',
      type: 'depot',
      metric: '⚡ Energy: 1,420 MWh Grid Load',
      details: 'Central municipal grid operating at 94% efficiency. Sub-station 4 balanced.',
    },
    {
      id: 'node-pithampur',
      name: 'Pithampur Industrial Recycling Plant',
      lat: 22.6150,
      lng: 75.6825,
      status: 'critical',
      type: 'plant',
      metric: '🏭 Waste: 42.1 Tons Recovered',
      details: 'Bulk plastic & e-waste processing facility. Heavy sorting active.',
    },
    {
      id: 'node-super-corridor',
      name: 'Super Corridor Smart Transit Zone',
      lat: 22.7545,
      lng: 75.8240,
      status: 'attention',
      type: 'transit',
      metric: '💧 Water: 410 kL/day Smart Grid',
      details: 'IoT acoustic leak detectors active across 14 km pipeline network.',
    },
    {
      id: 'node-rau-hub',
      name: 'Rau Urban Circular Economy Hub',
      lat: 22.6710,
      lng: 75.8165,
      status: 'normal',
      type: 'hub',
      metric: '♻️ Recycling: 9.8 Tons Processed',
      details: 'Community material collection & upcycling center operating smoothly.',
    },
    {
      id: 'node-vijay-nagar',
      name: 'Vijay Nagar Commercial Sector',
      lat: 22.7560,
      lng: 75.8910,
      status: 'normal',
      type: 'commercial',
      metric: '⚡ Solar Auxiliary Active',
      details: 'Rooftop commercial solar panels generating 120 kW surplus back to grid.',
    },
    {
      id: 'node-bhavarkua',
      name: 'Bhavarkua Metro Waste Station',
      lat: 22.6925,
      lng: 75.8650,
      status: 'normal',
      type: 'depot',
      metric: '🟢 Smart Waste Bins Optimal',
      details: 'Smart sensor bins operating at 42% average capacity. Collection queued.',
    },
  ];

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Dynamically import leaflet to prevent Next.js SSR errors
    import('leaflet').then((L) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const mapCenter = userLoc ? [userLoc.lat, userLoc.lng] : [22.7196, 75.8577];

      // Initialize Leaflet Map centered on Indore Metropolitan City
      const map = L.map(mapContainerRef.current!, {
        center: mapCenter as [number, number],
        zoom: 13,
        zoomControl: false,
      });

      mapInstanceRef.current = map;

      // Add Google Maps Street View tile layer
      L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(map);

      // Add User Location Marker with Emoji
      if (userLoc) {
        const userIcon = L.divIcon({
          className: 'custom-user-marker',
          html: `
            <div class="relative flex flex-col items-center justify-center cursor-pointer group">
              <div class="w-12 h-12 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-2xl shadow-2xl transform group-hover:scale-110 transition-all z-50">
                🙋‍♂️
              </div>
              <span class="absolute top-0 right-0 w-4 h-4 rounded-full bg-blue-400 animate-ping"></span>
              <div class="text-[12px] font-black text-blue-700 bg-white px-2 py-0.5 rounded absolute -bottom-6 whitespace-nowrap shadow-md border border-blue-200 z-50">You are here</div>
            </div>
          `,
          iconSize: [48, 64],
          iconAnchor: [24, 32],
        });
        
        L.marker([userLoc.lat, userLoc.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
      }

      // Custom Zoom Control placed in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add Telemetry Line Connections (Polylines) across city zones
      const lineCoords: [number, number][] = [
        [22.7560, 75.8910], // Vijay Nagar
        [22.7545, 75.8240], // Super Corridor
        [22.7196, 75.8577], // Central Depot
        [22.6925, 75.8650], // Bhavarkua
        [22.6710, 75.8165], // Rau Hub
        [22.6150, 75.6825], // Pithampur
      ];

      L.polyline(lineCoords, {
        color: '#03E5B7',
        weight: 2,
        dashArray: '5, 8',
        opacity: 0.7,
      }).addTo(map);

      // Render GPS Markers for each city node
      nodes.forEach((node) => {
        const isCritical = node.status === 'critical';
        const isAttention = node.status === 'attention';

        const color = isCritical ? '#FF007A' : isAttention ? '#FFC700' : '#03E5B7';
        const glowClass = isCritical ? 'glow-pink' : isAttention ? 'glow-gold' : 'glow-teal';
        const iconSymbol = node.type === 'plant' ? '🏭' : node.type === 'depot' ? '🏬' : node.type === 'transit' ? '💧' : '♻️';

        const distText = userLoc ? `<div class="text-[11px] font-black text-gray-800 bg-white/90 px-1.5 py-0.5 rounded shadow-sm absolute -bottom-5 whitespace-nowrap border border-gray-200 z-40">${calculateDistance(userLoc.lat, userLoc.lng, node.lat, node.lng)} km</div>` : '';

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="relative flex flex-col items-center justify-center cursor-pointer group">
              <div class="w-10 h-10 rounded-full bg-[#07080E] border-2 border-[${color}] flex items-center justify-center text-lg shadow-lg ${glowClass} transform group-hover:scale-110 transition-all z-40">
                <span>${iconSymbol}</span>
              </div>
              ${isCritical ? `<span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FF007A] animate-ping"></span>` : ''}
              ${distText}
            </div>
          `,
          iconSize: [40, 56],
          iconAnchor: [20, 28],
        });

        const marker = L.marker([node.lat, node.lng], { icon: customIcon }).addTo(map);

        marker.on('click', () => {
          setSelectedNode(node);
          map.panTo([node.lat, node.lng], { animate: true });
        });
      });

      setIsLoaded(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLoc]);

  return (
    <div className="bg-[#0D0F17] border border-[#1D2133] rounded-lg p-5 space-y-4 font-mono shadow-xl relative overflow-hidden">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#1D2133] pb-3">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2 tracking-wider">
            <MapPin className="w-4 h-4 text-[#FF007A]" />
            INDORE METROPOLITAN LIVE CITY GPS TELEMETRY MAP
          </h3>
          <p className="text-[11px] text-[#03E5B7] font-bold">
            Real-time municipal IoT sensors, industrial recycling plants & smart city grid indicators.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-[#03E5B7] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#03E5B7]" /> Normal Grid
          </span>
          <span className="flex items-center gap-1 text-[#FFC700] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FFC700]" /> High Load
          </span>
          <span className="flex items-center gap-1 text-[#FF007A] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FF007A] animate-ping" /> Anomaly Alert
          </span>
        </div>
      </div>

      {/* Real Interactive Leaflet Container */}
      <div className="relative w-full h-96 bg-[#07080E] rounded border border-[#1D2133] overflow-hidden z-10">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Selected Node Floating Telemetry Card */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full bg-[#07080E]/95 border-2 border-[#FF007A] p-4 rounded-lg space-y-2 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-2 glow-pink">
            <div className="flex items-center justify-between border-b border-[#1D2133] pb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {selectedNode.type === 'plant' ? '🏭' : selectedNode.type === 'depot' ? '🏬' : selectedNode.type === 'transit' ? '💧' : '♻️'}
                </span>
                <h4 className="font-black text-white text-xs tracking-wider">{selectedNode.name}</h4>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white font-bold">
                <X className="w-4 h-4 text-[#FF007A]" />
              </button>
            </div>

            <div className="text-xs space-y-1">
              <div className="font-black text-[#FF007A] flex items-center gap-1">
                {selectedNode.metric}
              </div>
              <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                {selectedNode.details}
              </p>
              <div className="flex items-center justify-between text-[10px] text-[#03E5B7] pt-1 font-bold">
                <span>GPS: {selectedNode.lat.toFixed(4)}° N, {selectedNode.lng.toFixed(4)}° E</span>
                {userLoc && (
                  <span className="text-[#FFC700] bg-[#FFC700]/10 px-2 py-0.5 rounded-full border border-[#FFC700]/20">
                    Distance: {calculateDistance(userLoc.lat, userLoc.lng, selectedNode.lat, selectedNode.lng)} km
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
