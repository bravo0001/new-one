'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEco } from '../../context/EcoContext';
import { MapPin, AlertTriangle, CheckCircle, Zap, Droplet, Trash2, X, RefreshCw, Building2 } from 'lucide-react';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

export interface CityNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'normal' | 'attention' | 'critical';
  type: 'depot' | 'plant' | 'transit' | 'hub' | 'commercial' | 'station';
  metric: string;
  details: string;
}

export const CampusMap: React.FC<{ minimal?: boolean }> = ({ minimal = false }) => {
  const { userLocation, theme } = useEco();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<CityNode | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const baseLat = userLocation?.lat || 12.9716;
  const baseLng = userLocation?.lng || 77.5946;
  const city = userLocation?.cityName || 'Regional';

  const nodes: CityNode[] = [
    {
      id: 'node-central',
      name: `${city} Central Municipal Depot`,
      lat: baseLat + 0.003,
      lng: baseLng + 0.004,
      status: 'normal',
      type: 'depot',
      metric: '⚡ Energy: 1,420 MWh Grid Load',
      details: `Central ${city} municipal grid operating at 94% efficiency. Sub-station 4 balanced.`,
    },
    {
      id: 'node-industrial',
      name: `${city} Industrial Recycling Plant`,
      lat: baseLat - 0.006,
      lng: baseLng + 0.007,
      status: 'critical',
      type: 'plant',
      metric: '🏭 Waste: 42.1 Tons Recovered',
      details: 'Bulk plastic & e-waste processing facility. Heavy sorting active.',
    },
    {
      id: 'node-transit',
      name: `${city} Smart Transit Zone`,
      lat: baseLat + 0.007,
      lng: baseLng - 0.005,
      status: 'attention',
      type: 'transit',
      metric: '💧 Water: 410 kL/day Smart Grid',
      details: 'IoT acoustic leak detectors active across pipeline network.',
    },
    {
      id: 'node-circular',
      name: `${city} Circular Economy Hub`,
      lat: baseLat - 0.005,
      lng: baseLng - 0.006,
      status: 'normal',
      type: 'hub',
      metric: '♻️ Recycling: 9.8 Tons Processed',
      details: 'Community material collection & upcycling center operating smoothly.',
    },
    {
      id: 'node-commercial',
      name: `${city} Commercial Sector`,
      lat: baseLat + 0.008,
      lng: baseLng + 0.003,
      status: 'normal',
      type: 'commercial',
      metric: '⚡ Solar Auxiliary Active',
      details: 'Rooftop commercial solar panels generating 120 kW surplus back to grid.',
    },
    {
      id: 'node-metro',
      name: `${city} Metro Waste Station`,
      lat: baseLat - 0.003,
      lng: baseLng + 0.004,
      status: 'normal',
      type: 'station',
      metric: '📊 Smart Bins: 88% Fill Rate',
      details: 'Compactor status nominal. Fleet dispatch recommended in 45 mins.',
    },
  ];

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import leaflet to prevent Next.js SSR errors
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const mapCenter: [number, number] = [baseLat, baseLng];

      // Initialize Leaflet Map centered on User GPS location
      const map = L.map(mapContainerRef.current, {
        center: mapCenter,
        zoom: 13,
        zoomControl: false,
      });

      mapInstanceRef.current = map;

      // Select tile URL based on theme
      const tileUrl =
        theme === 'light'
          ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(map);

      // Add User Location Marker
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex flex-col items-center justify-center cursor-pointer group">
            <div class="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-xl shadow-2xl transform group-hover:scale-110 transition-all z-50">
              📍
            </div>
            <span class="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <div class="text-[11px] font-black text-emerald-800 bg-white px-2 py-0.5 rounded absolute -bottom-5 whitespace-nowrap shadow-md border border-emerald-200 z-50">${userLocation?.cityName || 'You are here'}</div>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 25],
      });
      L.marker([baseLat, baseLng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);

      // Custom Zoom Control placed in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add Telemetry Line Connections across city zones
      const lineCoords: [number, number][] = nodes.map((n) => [n.lat, n.lng] as [number, number]);
      lineCoords.push([baseLat, baseLng]);

      L.polyline(lineCoords, {
        color: '#059669',
        weight: 2,
        dashArray: '5, 8',
        opacity: 0.7,
      }).addTo(map);

      // Render GPS Markers for each city node
      nodes.forEach((node) => {
        const isCritical = node.status === 'critical';
        const isAttention = node.status === 'attention';

        const color = isCritical ? '#e11d48' : isAttention ? '#d97706' : '#059669';
        const glowClass = isCritical ? 'glow-pink' : isAttention ? 'glow-gold' : 'glow-teal';
        const iconSymbol =
          node.type === 'plant'
            ? '🏭'
            : node.type === 'depot'
            ? '🏬'
            : node.type === 'transit'
            ? '💧'
            : node.type === 'hub'
            ? '♻️'
            : node.type === 'commercial'
            ? '⚡'
            : '📊';

        const distText = `<div class="text-[11px] font-black text-gray-800 bg-white/90 px-1.5 py-0.5 rounded shadow-sm absolute -bottom-5 whitespace-nowrap border border-gray-200 z-40">${calculateDistance(
          baseLat,
          baseLng,
          node.lat,
          node.lng
        )} km</div>`;

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="relative flex flex-col items-center justify-center cursor-pointer group">
              <div class="w-10 h-10 rounded-full bg-slate-900 border-2 border-[${color}] flex items-center justify-center text-lg shadow-lg ${glowClass} transform group-hover:scale-110 transition-all z-40">
                <span>${iconSymbol}</span>
              </div>
              ${isCritical ? `<span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#e11d48] animate-ping"></span>` : ''}
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
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [baseLat, baseLng, theme, userLocation?.cityName]);

  return (
    <div className={`bg-squid-card border border-slate-200 dark:border-[#1D2133] rounded-lg ${minimal ? 'p-0' : 'p-5'} space-y-4 font-mono shadow-xl relative overflow-hidden`}>
      {/* Map Header */}
      {!minimal && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-[#1D2133] pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-wider">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-[#FF007A]" />
              {city.toUpperCase()} METROPOLITAN LIVE CITY GPS TELEMETRY MAP
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-[#03E5B7] font-bold">
              Real-time municipal IoT sensors, industrial recycling plants & smart city grid indicators.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-[#03E5B7] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#03E5B7]" /> Normal Grid
            </span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-[#FFC700] font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-[#FFC700]" /> High Load
            </span>
            <span className="flex items-center gap-1 text-rose-600 dark:text-[#FF007A] font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 dark:bg-[#FF007A] animate-ping" /> Anomaly Alert
            </span>
          </div>
        </div>
      )}

      {/* Real Interactive Leaflet Container */}
      <div className={`relative w-full ${minimal ? 'h-44' : 'h-96'} bg-slate-100 dark:bg-[#07080E] rounded border border-slate-200 dark:border-[#1D2133] overflow-hidden z-10`}>
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Selected Node Bottom Drawer Info Overlay */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-[#0D0F17]/95 border border-slate-200 dark:border-[#1D2133] rounded-xl p-3 shadow-2xl backdrop-blur-md z-30 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {selectedNode.type === 'plant' ? '🏭' : selectedNode.type === 'depot' ? '🏬' : selectedNode.type === 'transit' ? '💧' : '♻️'}
                </span>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">{selectedNode.name}</h4>
                  <p className="text-[10px] text-emerald-600 dark:text-[#03E5B7] font-bold">{selectedNode.metric}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{selectedNode.details}</p>
          </div>
        )}
      </div>
    </div>
  );
};
