import fs from 'fs';

let content = fs.readFileSync('src/components/views/EnergyAnalyticsView.tsx', 'utf8');

// 1. Destructure userLocation from useEco()
content = content.replace(
  'const { addToast } = useEco();',
  'const { addToast, userLocation } = useEco();'
);

// 2. Make fetchLiveEnergyTelemetry use userLocation
content = content.replace(
  'const res = await fetch(\n        \'https://api.open-meteo.com/v1/forecast?latitude=22.7196&longitude=75.8577&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,direct_normal_irradiance,global_tilted_irradiance&hourly=temperature_2m,direct_normal_irradiance,global_tilted_irradiance,wind_speed_10m\'\n      );',
  `const lat = userLocation?.lat || 22.7196;\n      const lng = userLocation?.lng || 75.8577;\n      const res = await fetch(\n        \`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lng}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,direct_normal_irradiance,global_tilted_irradiance&hourly=temperature_2m,direct_normal_irradiance,global_tilted_irradiance,wind_speed_10m\`\n      );`
);

// 3. Update useEffect dependency
content = content.replace(
  'useEffect(() => {\n    fetchLiveEnergyTelemetry();\n    const interval = setInterval(fetchLiveEnergyTelemetry, 60000);\n    return () => clearInterval(interval);\n  }, []);',
  'useEffect(() => {\n    fetchLiveEnergyTelemetry();\n    const interval = setInterval(fetchLiveEnergyTelemetry, 60000);\n    return () => clearInterval(interval);\n  }, [userLocation.lat, userLocation.lng]);'
);

// 4. Update the display strings
content = content.replace(
  '<span className="text-slate-500">• Lat: 22.7196° N, Lng: 75.8577° E (Indore Region)</span>',
  '<span className="text-slate-500">• Lat: {userLocation.lat.toFixed(4)}° N, Lng: {userLocation.lng.toFixed(4)}° E ({userLocation.cityName} Region)</span>'
);

content = content.replace(
  '{ name: \'Indore Central Substation #1\', loadKw: Math.round((liveData?.estimatedSolarKw || 1400) * 0.45), status: \'Optimal\', pct: \'45%\' },\n            { name: \'Pithampur Heavy Industrial Grid\', loadKw: Math.round((liveData?.estimatedSolarKw || 1400) * 0.85), status: \'Peak Demand\', pct: \'85%\' },\n            { name: \'Super Corridor Smart Microgrid\', loadKw: Math.round((liveData?.estimatedSolarKw || 1400) * 0.32), status: \'Clean Solar Surplus\', pct: \'32%\' },',
  `{ name: \`\${userLocation.cityName} Central Substation #1\`, loadKw: Math.round((liveData?.estimatedSolarKw || 1400) * 0.45), status: 'Optimal', pct: '45%' },\n            { name: \`\${userLocation.areaName || userLocation.cityName} Regional Grid\`, loadKw: Math.round((liveData?.estimatedSolarKw || 1400) * 0.85), status: 'Peak Demand', pct: '85%' },\n            { name: \`\${userLocation.cityName} Smart Microgrid\`, loadKw: Math.round((liveData?.estimatedSolarKw || 1400) * 0.32), status: 'Clean Solar Surplus', pct: '32%' },`
);

fs.writeFileSync('src/components/views/EnergyAnalyticsView.tsx', content);
console.log('Updated EnergyAnalyticsView.tsx with dynamic location data');

