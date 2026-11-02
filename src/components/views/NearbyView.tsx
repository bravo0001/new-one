'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEco } from '../../context/EcoContext';
import { NearbyPartner } from '../../types';
import {
  MapPin,
  Gift,
  Star,
  Clock,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Store,
  X,
  Compass,
} from 'lucide-react';

export const NearbyView: React.FC = () => {
  const { nearbyPartners, selectedPartnerOnMap, selectPartnerOnMap, setActiveTab, redeemPartnerVoucher, userLocation, isLocating, detectUserLocation, setUserLocationManually, theme } = useEco();

  const userLat = userLocation?.lat || 12.9716;
  const userLng = userLocation?.lng || 77.5946;

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [rewardsOnly, setRewardsOnly] = useState<boolean>(false);
  const [selectedRadius, setSelectedRadius] = useState<number>(2000); // 2km default
  const [detailPartner, setDetailPartner] = useState<NearbyPartner | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstanceRef = useRef<any>(null);

  const filterCategories = ['All', 'Cafés', 'Restaurants', 'Shops', 'Rewards', 'Food Rescue', 'Recycling', 'NGOs'];

  const filteredPartners = nearbyPartners.filter((partner) => {
    // Distance radius filter
    if (partner.distanceMeters > selectedRadius) return false;
    // Rewards-only mode filter
    if (rewardsOnly && !partner.acceptsEcoPoints) return false;
    // Category filter
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Rewards') return partner.acceptsEcoPoints;
    if (selectedCategory === 'Food Rescue') return partner.foodRescueAvailable;
    return partner.category === selectedCategory;
  });

  const activePartner = selectedPartnerOnMap || filteredPartners[0] || nearbyPartners[0];

  // Leaflet.js Real GPS Map Binding via CDN
  useEffect(() => {
    if (!mapRef.current) return;

    let isMounted = true;

    // Inject Leaflet CSS
    if (!document.getElementById('leaflet-css-cdn')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const loadLeafletScript = () => {
      return new Promise<any>((resolve) => {
        if ((window as any).L) {
          resolve((window as any).L);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve((window as any).L);
        document.head.appendChild(script);
      });
    };

    const renderRealMap = async () => {
      const L = await loadLeafletScript();
      if (!isMounted || !mapRef.current || !L) return;

      // Cleanup existing instance
      if (leafletInstanceRef.current) {
        leafletInstanceRef.current.remove();
        leafletInstanceRef.current = null;
      }

      // Center map on SAGE University, Indore (22.7196, 75.8577)
      const map = L.map(mapRef.current, {
        center: [userLat, userLng],
        zoom: 14,
        zoomControl: true,
      });

      // CartoDB Dark Matter Real Street Map Tiles
      const tileUrl = theme === 'light'
        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(map);

      // USER LOCATION MARKER - Pulsing Blue
      const userIcon = L.divIcon({
        className: 'custom-user-leaflet-pin',
        html: `<div class="flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <div class="relative flex items-center justify-center">
            <span class="w-8 h-8 rounded-full bg-blue-500/40 animate-ping absolute"></span>
            <span class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-2xl flex items-center justify-center text-[10px] text-white font-bold">🔵</span>
          </div>
          <span class="mt-1 text-[10px] px-2.5 py-0.5 rounded-full bg-blue-950/95 border border-blue-400 text-blue-200 font-mono font-extrabold shadow-2xl whitespace-nowrap">YOU ARE HERE</span>
        </div>`,
        iconSize: [110, 42],
        iconAnchor: [55, 21],
      });

      L.marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`<div style="color:#000; font-weight:bold;">🔵 YOU ARE HERE<br><span style="font-weight:normal; font-size:11px;">${userLocation?.fullAddress || userLocation?.cityName || 'Current Area'}</span></div>`);

      // PARTNER MAP MARKERS BOUND TO REAL GPS COORDINATES
      filteredPartners.forEach((partner) => {
        const isSelected = activePartner?.id === partner.id;

        const partnerIcon = L.divIcon({
          className: 'custom-partner-leaflet-pin',
          html: `<div class="px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-2xl border text-xs font-mono font-bold cursor-pointer whitespace-nowrap transition-transform ${
            isSelected
              ? 'bg-[#FF007A] text-white border-white scale-110 shadow-[#FF007A]/80 z-30 ring-4 ring-[#FF007A]/40'
              : partner.acceptsEcoPoints
              ? 'bg-[#0D0F17] text-[#FFC700] border-[#FFC700]/70 hover:scale-105 shadow-[#FFC700]/20'
              : 'bg-[#0D0F17] text-slate-200 border-slate-700 hover:scale-105'
          }">
            <span>${partner.logo}</span>
            <span>${partner.name}</span>
          </div>`,
          iconSize: [140, 32],
          iconAnchor: [70, 16],
        });

        const marker = L.marker([partner.lat || userLat, partner.lng || userLng], { icon: partnerIcon }).addTo(map);

        marker.on('click', () => {
          selectPartnerOnMap(partner.id);
        });
      });

      // Pan to active partner if selected
      if (activePartner && activePartner.lat && activePartner.lng) {
        map.panTo([activePartner.lat, activePartner.lng], { animate: true });
      }

      leafletInstanceRef.current = map;
    };

    renderRealMap();

    return () => {
      isMounted = false;
      if (leafletInstanceRef.current) {
        leafletInstanceRef.current.remove();
        leafletInstanceRef.current = null;
      }
    };
  }, [filteredPartners, selectedPartnerOnMap, userLocation.lat, userLocation.lng, theme]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Location Top Bar */}
      <div className="bg-squid-card border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#03E5B7] animate-ping" />
            <span>📍 REAL GPS LOCATION</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">SAGE University / Current Campus Area</h1>
          <p className="text-xs text-slate-400">
            {filteredPartners.length} sustainable partners within {(selectedRadius / 1000).toFixed(1)} km
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('redeem-rewards')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold hover:border-[#FFC700] hover:text-[#FFC700] transition-colors flex items-center gap-1.5"
          >
            <Gift className="w-4 h-4 text-[#FFC700]" />
            <span>Redeem Eco Points</span>
          </button>
        </div>
      </div>

      {/* Filter Bar & Radius Controls */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#0D0F17] border border-slate-800">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#03E5B7] text-slate-950 font-bold shadow-md shadow-[#03E5B7]/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Controls: Rewards Toggle & Distance Radius */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Rewards-Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
              <input
                type="checkbox"
                checked={rewardsOnly}
                onChange={(e) => setRewardsOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-[#FFC700] focus:ring-0"
              />
              <span className="font-bold text-[#FFC700] flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" /> Show Rewards Near Me
              </span>
            </label>

            {/* Radius Selector */}
            <div className="flex items-center gap-1 text-xs font-mono bg-slate-900 border border-slate-800 rounded-xl p-1 overflow-x-auto">
              <span className="text-slate-400 px-2">Radius:</span>
              {[500, 1000, 2000, 5000].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRadius(r)}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    selectedRadius === r ? 'bg-[#FF007A] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAP & SIDE DETAILS DUAL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INTERACTIVE LEAFLET REAL MAP CONTAINER (2 Cols) */}
        <div className="lg:col-span-2 relative bg-[#07080E] border-2 border-slate-800 rounded-3xl h-[340px] sm:h-[420px] md:h-[480px] overflow-hidden shadow-2xl">
          {/* Leaflet Dynamic Map Container Div */}
          <div ref={mapRef} className="w-full h-full z-0" />

          {/* Map Attribution Overlay Badge */}
          <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-[10px] font-mono text-[#03E5B7] font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5 pointer-events-none truncate">
            <Compass className="w-3.5 h-3.5 text-[#03E5B7] animate-spin flex-shrink-0" />
            <span className="truncate">REAL DYNAMIC LEAFLET MAP • GPS MARKERS LOCKED</span>
          </div>

          {/* COMPACT MAP POPUP CARD (Active Selected Marker) */}
          {activePartner && (
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 z-20 bg-[#0D0F17]/95 border border-slate-700 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3">
                <img
                  src={activePartner.imageUrl}
                  alt={activePartner.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{activePartner.name}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      ⭐ {activePartner.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activePartner.distanceMeters} m away</p>
                  <div className="text-[11px] font-mono text-[#FFC700] font-bold">
                    🎁 {activePartner.rewardsOffer}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setDetailPartner(activePartner)}
                  className="px-3.5 py-2 rounded-xl bg-[#03E5B7] text-slate-950 font-bold text-xs glow-teal"
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR: NEARBY BUSINESS CARDS LIST */}
        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
          <h3 className="text-xs font-mono font-bold text-slate-400 tracking-wider">
            NEARBY ECO PARTNERS ({filteredPartners.length})
          </h3>

          <div className="space-y-3">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activePartner?.id === partner.id
                    ? 'bg-squid-card border-[#03E5B7] shadow-lg shadow-[#03E5B7]/10'
                    : 'bg-[#07080E] border-slate-800 hover:border-slate-700'
                }`}
                onClick={() => selectPartnerOnMap(partner.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{partner.logo}</span>
                    <h4 className="font-bold text-white text-sm">{partner.name}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#03E5B7] font-bold">
                    📍 {partner.distanceMeters} m
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-2">{partner.address}</p>

                {partner.acceptsEcoPoints && (
                  <div className="p-2.5 rounded-xl bg-[#FFC700]/10 border border-[#FFC700]/30 text-xs text-[#FFC700] font-mono font-bold mb-3 flex items-center justify-between">
                    <span>🎁 {partner.rewardsOffer}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500 font-mono">⭐ {partner.rating} Rating</span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectPartnerOnMap(partner.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-bold hover:text-white"
                    >
                      View on Map
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailPartner(partner);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#FF007A] text-white text-[11px] font-bold"
                    >
                      View Rewards
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BUSINESS DETAIL DRAWER MODAL */}
      {detailPartner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0F17] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{detailPartner.logo}</span>
                <div>
                  <h3 className="text-base font-bold text-white">{detailPartner.name}</h3>
                  <p className="text-xs text-slate-400">📍 {detailPartner.distanceMeters} m away • ⭐ {detailPartner.rating}</p>
                </div>
              </div>
              <button onClick={() => setDetailPartner(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {detailPartner.badges.map((b, i) => (
                <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#03E5B7]/15 text-[#03E5B7] border border-[#03E5B7]/30 font-mono">
                  {b}
                </span>
              ))}
            </div>

            {/* Eco Food Section if available */}
            {detailPartner.foodRescueAvailable && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF007A]/15 to-transparent border border-[#FF007A]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-[#FF007A]" /> Today's EcoFood Rescue
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF007A] text-white font-mono font-bold">
                    {detailPartner.surplusMealsCount} Servings
                  </span>
                </div>
                <div className="text-xs text-slate-300 flex justify-between items-center">
                  <span>Paneer Rice Bowl / Surplus Snack Box</span>
                  <span className="font-mono font-bold text-[#03E5B7]">₹{detailPartner.surplusPriceInr}</span>
                </div>
                <button
                  onClick={() => {
                    setDetailPartner(null);
                    setActiveTab('ecofood');
                  }}
                  className="w-full py-2 rounded-xl bg-[#FF007A] text-white text-xs font-bold glow-pink"
                >
                  View EcoFood Marketplace →
                </button>
              </div>
            )}

            {/* Redeemable Rewards List */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-400">AVAILABLE ECO REWARDS</h4>

              <div className="p-3.5 rounded-xl bg-[#07080E] border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">₹50 OFF Voucher</div>
                  <div className="text-[11px] text-[#FFC700] font-mono">100 Eco Points</div>
                </div>
                <button
                  onClick={() => {
                    redeemPartnerVoucher('₹50 OFF Voucher', detailPartner.name, 100, 50);
                    setDetailPartner(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FFC700] text-slate-950 font-bold text-xs"
                >
                  Redeem
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#07080E] border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">₹100 OFF Dining Voucher</div>
                  <div className="text-[11px] text-[#FFC700] font-mono">200 Eco Points</div>
                </div>
                <button
                  onClick={() => {
                    redeemPartnerVoucher('₹100 OFF Dining Voucher', detailPartner.name, 200, 100);
                    setDetailPartner(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FFC700] text-slate-950 font-bold text-xs"
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
