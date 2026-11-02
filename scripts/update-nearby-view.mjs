import fs from 'fs';

let content = fs.readFileSync('src/components/views/NearbyView.tsx', 'utf8');

// 1. Destructure from useEco()
content = content.replace(
  'const { nearbyPartners, selectedPartnerOnMap, selectPartnerOnMap, setActiveTab, redeemPartnerVoucher } = useEco();',
  'const { nearbyPartners, selectedPartnerOnMap, selectPartnerOnMap, setActiveTab, redeemPartnerVoucher, userLocation, isLocating, detectUserLocation, setUserLocationManually, theme } = useEco();'
);

// 2. Update map center and user icon coordinates
content = content.replace(
  '// Center map on SAGE University, Indore (22.7196, 75.8577)\n      const map = L.map(mapRef.current, {\n        center: [22.7196, 75.8577],',
  `// Center map on User's real location\n      const userLat = userLocation?.lat || 12.9716;\n      const userLng = userLocation?.lng || 77.5946;\n      const map = L.map(mapRef.current, {\n        center: [userLat, userLng],`
);

// 3. Tile layer dependent on theme
content = content.replace(
  `      // CartoDB Dark Matter Real Street Map Tiles\n      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {\n        maxZoom: 19,\n        attribution: '&copy; OpenStreetMap &copy; CARTO',\n      }).addTo(map);`,
  `      // Street Map Tiles - Positron for light theme, Dark Matter for dark theme\n      const tileUrl = theme === 'light'\n        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'\n        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';\n      L.tileLayer(tileUrl, {\n        maxZoom: 19,\n        attribution: '&copy; OpenStreetMap &copy; CARTO',\n      }).addTo(map);`
);

// 4. Update user marker coordinates and popup
content = content.replace(
  `      L.marker([22.7196, 75.8577], { icon: userIcon })\n        .addTo(map)\n        .bindPopup('<div style="color:#000; font-weight:bold;">🔵 YOU ARE HERE<br><span style="font-weight:normal; font-size:11px;">SAGE University Campus, Indore</span></div>');`,
  `      L.marker([userLat, userLng], { icon: userIcon })\n        .addTo(map)\n        .bindPopup(\`<div style="color:#000; font-weight:bold;">🔵 YOU ARE HERE<br><span style="font-weight:normal; font-size:11px;">\${userLocation?.fullAddress || userLocation?.cityName || 'Current Area'}</span></div>\`);`
);

// 5. Update partner coordinates fallback
content = content.replace(
  'const marker = L.marker([partner.lat || 22.7196, partner.lng || 75.8577], { icon: partnerIcon }).addTo(map);',
  'const marker = L.marker([partner.lat || userLat, partner.lng || userLng], { icon: partnerIcon }).addTo(map);'
);

// 6. Update map useEffect dependencies to re-center when userLocation changes
content = content.replace(
  '}, [filteredPartners, selectedPartnerOnMap]);',
  '}, [filteredPartners, selectedPartnerOnMap, userLocation.lat, userLocation.lng, theme]);'
);

// 7. Update Top Bar HTML
const oldTopBar = `      {/* Location Top Bar */}
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
      </div>`;

const newTopBar = `      {/* Location Top Bar with Indian City Selector and Real GPS */}
      <div className="bg-squid-card border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className={\`w-2.5 h-2.5 rounded-full \${userLocation.isRealGps ? 'bg-[#03E5B7]' : 'bg-[#FFC700]'} animate-ping\`} />
            <span className="font-bold">{userLocation.isRealGps ? '📍 REAL SATELLITE GPS ACQUIRED' : '📍 REGION LOCATION (INDIA)'}</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">{userLocation.areaName || userLocation.cityName}, {userLocation.cityName}</h1>
          <p className="text-xs text-slate-400 max-w-xl truncate">
            {userLocation.fullAddress} • {filteredPartners.length} sustainable partners within {(selectedRadius / 1000).toFixed(1)} km
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Indian City Selector */}
          <select
            value={userLocation.cityName}
            onChange={(e) => {
              const val = e.target.value;
              const indianCities: Record<string, { lat: number; lng: number; area: string }> = {
                'New Delhi': { lat: 28.6139, lng: 77.2090, area: 'Connaught Place / Central' },
                'Bengaluru': { lat: 12.9716, lng: 77.5946, area: 'Koramangala / Indiranagar' },
                'Mumbai': { lat: 19.0760, lng: 72.8777, area: 'BKC / Bandra' },
                'Hyderabad': { lat: 17.3850, lng: 78.4867, area: 'HITEC City' },
                'Chennai': { lat: 13.0827, lng: 80.2707, area: 'Anna Nagar' },
                'Kolkata': { lat: 22.5726, lng: 88.3639, area: 'Salt Lake Sector 5' },
                'Pune': { lat: 18.5204, lng: 73.8567, area: 'Shivaji Nagar' },
                'Ahmedabad': { lat: 23.0225, lng: 72.5714, area: 'SG Highway' },
                'Jaipur': { lat: 26.9124, lng: 75.7873, area: 'Malviya Nagar' },
                'Lucknow': { lat: 26.8467, lng: 80.9462, area: 'Gomti Nagar' },
                'Indore': { lat: 22.7196, lng: 75.8577, area: 'Vijay Nagar' },
                'Chandigarh': { lat: 30.7333, lng: 76.7794, area: 'Sector 17' },
              };
              if (indianCities[val]) {
                const c = indianCities[val];
                setUserLocationManually(c.lat, c.lng, val, c.area);
              }
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold font-mono focus:outline-none focus:border-[#03E5B7]"
          >
            <option value={userLocation.cityName}>Current: {userLocation.cityName}</option>
            <option value="New Delhi">New Delhi (NCR)</option>
            <option value="Bengaluru">Bengaluru (KA)</option>
            <option value="Mumbai">Mumbai (MH)</option>
            <option value="Hyderabad">Hyderabad (TG)</option>
            <option value="Chennai">Chennai (TN)</option>
            <option value="Kolkata">Kolkata (WB)</option>
            <option value="Pune">Pune (MH)</option>
            <option value="Ahmedabad">Ahmedabad (GJ)</option>
            <option value="Jaipur">Jaipur (RJ)</option>
            <option value="Lucknow">Lucknow (UP)</option>
            <option value="Indore">Indore (MP)</option>
            <option value="Chandigarh">Chandigarh (PB)</option>
          </select>

          {/* Live GPS Auto-Detect Button */}
          <button
            onClick={() => detectUserLocation()}
            disabled={isLocating}
            className="px-3.5 py-2 rounded-xl bg-[#03E5B7]/15 border border-[#03E5B7]/60 text-[#03E5B7] text-xs font-bold font-mono hover:bg-[#03E5B7]/25 transition-all flex items-center gap-1.5"
            title="Auto-detect real GPS location"
          >
            <Navigation className={\`w-3.5 h-3.5 \${isLocating ? 'animate-spin' : ''}\`} />
            <span>{isLocating ? 'Locating...' : '🎯 Auto GPS'}</span>
          </button>

          <button
            onClick={() => setActiveTab('redeem-rewards')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold hover:border-[#FFC700] hover:text-[#FFC700] transition-colors flex items-center gap-1.5"
          >
            <Gift className="w-4 h-4 text-[#FFC700]" />
            <span className="hidden sm:inline">Redeem Points</span>
          </button>
        </div>
      </div>`;

content = content.replace(oldTopBar, newTopBar);

fs.writeFileSync('src/components/views/NearbyView.tsx', content);
console.log('Updated NearbyView.tsx with real GPS detection and dynamic center');

