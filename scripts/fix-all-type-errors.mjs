import fs from 'fs';

// 1. Fix src/context/EcoContext.tsx
let eco = fs.readFileSync('src/context/EcoContext.tsx', 'utf8');

// Ensure theme is in EcoContextType
if (!eco.includes("theme: 'light' | 'dark';")) {
  eco = eco.replace(
    /interface EcoContextType \{([\s\S]*?)adminActiveSection:/,
    (match, p1) => `interface EcoContextType {${p1}theme: 'light' | 'dark';\n  setTheme: (t: 'light' | 'dark') => void;\n  toggleTheme: () => void;\n  adminActiveSection:`
  );
}

// Ensure adminActiveSection and theme are in Provider value
if (!eco.includes('adminActiveSection,\n        setAdminActiveSection,')) {
  eco = eco.replace(
    /value=\{\{\s*isMobileMenuOpen,[\s\S]*?setActiveTab,\s*profile,/,
    (match) => match.replace(
      'setActiveTab,\n        profile,',
      'setActiveTab,\n        adminActiveSection,\n        setAdminActiveSection,\n        theme,\n        setTheme,\n        toggleTheme,\n        profile,'
    )
  );
}

fs.writeFileSync('src/context/EcoContext.tsx', eco);
console.log('Fixed EcoContext.tsx interface and provider values');

// 2. Fix src/components/views/NearbyView.tsx
let nearby = fs.readFileSync('src/components/views/NearbyView.tsx', 'utf8');

// Insert userLat & userLng definition right after useEco()
if (!nearby.includes('const userLat = userLocation?.lat')) {
  nearby = nearby.replace(
    'const { nearbyPartners, selectedPartnerOnMap, selectPartnerOnMap, setActiveTab, redeemPartnerVoucher, userLocation, isLocating, detectUserLocation, setUserLocationManually, theme } = useEco();',
    `const { nearbyPartners, selectedPartnerOnMap, selectPartnerOnMap, setActiveTab, redeemPartnerVoucher, userLocation, isLocating, detectUserLocation, setUserLocationManually, theme } = useEco();\n\n  const userLat = userLocation?.lat || 12.9716;\n  const userLng = userLocation?.lng || 77.5946;`
  );
}

// Center map on userLat, userLng
nearby = nearby.replace(
  /center:\s*\[22\.7196,\s*75\.8577\],/,
  'center: [userLat, userLng],'
);

// Map tiles respecting theme
nearby = nearby.replace(
  /L\.tileLayer\('https:\/\/\{s\}\.basemaps\.cartocdn\.com\/dark_all\/\{z\}\/\{x\}\/\{y\}\{r\}\.png',[\s\S]*?\}\)\.addTo\(map\);/,
  `const tileUrl = theme === 'light'\n        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'\n        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';\n      L.tileLayer(tileUrl, {\n        maxZoom: 19,\n        attribution: '&copy; OpenStreetMap &copy; CARTO',\n      }).addTo(map);`
);

// User marker coordinates and popup
nearby = nearby.replace(
  /L\.marker\(\[22\.7196,\s*75\.8577\], \{ icon: userIcon \}\)[\s\S]*?\.bindPopup\(.*?\);/,
  `L.marker([userLat, userLng], { icon: userIcon })\n        .addTo(map)\n        .bindPopup(\`<div style="color:#000; font-weight:bold;">🔵 YOU ARE HERE<br><span style="font-weight:normal; font-size:11px;">\${userLocation?.fullAddress || userLocation?.cityName || 'Current Area'}</span></div>\`);`
);

fs.writeFileSync('src/components/views/NearbyView.tsx', nearby);
console.log('Fixed NearbyView.tsx with userLat/userLng and dynamic theme tiles');

