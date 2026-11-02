import fs from 'fs';

let content = fs.readFileSync('src/components/map/CampusMap.tsx', 'utf8');

// 1. Add useEco import if not present
if (!content.includes('import { useEco }')) {
  content = `import { useEco } from '../../context/EcoContext';\n` + content;
}

// 2. Destructure userLocation and theme
const oldCompStart = `export const CampusMap: React.FC<{ minimal?: boolean }> = ({ minimal = false }) => {\n  const mapContainerRef = useRef<HTMLDivElement>(null);\n  const mapInstanceRef = useRef<any>(null);\n  const [selectedNode, setSelectedNode] = useState<CityNode | null>(null);\n  const [isLoaded, setIsLoaded] = useState(false);\n  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);`;

const newCompStart = `export const CampusMap: React.FC<{ minimal?: boolean }> = ({ minimal = false }) => {\n  const { userLocation, theme } = useEco();\n  const mapContainerRef = useRef<HTMLDivElement>(null);\n  const mapInstanceRef = useRef<any>(null);\n  const [selectedNode, setSelectedNode] = useState<CityNode | null>(null);\n  const [isLoaded, setIsLoaded] = useState(false);`;

content = content.replace(oldCompStart, newCompStart);

// Remove the old navigator.geolocation effect
const oldGeoEffect = `  useEffect(() => {\n    if (navigator.geolocation) {\n      navigator.geolocation.getCurrentPosition(\n        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),\n        () => setUserLoc({ lat: 22.7200, lng: 75.8500 }) // Fallback location\n      );\n    } else {\n      setUserLoc({ lat: 22.7200, lng: 75.8500 });\n    }\n  }, []);`;

content = content.replace(oldGeoEffect, '// Dynamic location bound to EcoContext userLocation');

// Make nodes dynamic around userLocation
const oldNodes = `  const nodes: CityNode[] = [
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
      type: 'station',
      metric: '📊 Smart Bins: 88% Fill Rate',
      details: 'Compactor status nominal. Fleet dispatch recommended in 45 mins.',
    },
  ];`;

const newNodes = `  const baseLat = userLocation?.lat || 12.9716;
  const baseLng = userLocation?.lng || 77.5946;
  const city = userLocation?.cityName || 'Regional';

  const nodes: CityNode[] = [
    {
      id: 'node-central',
      name: \`\${city} Central Municipal Depot\`,
      lat: baseLat + 0.003,
      lng: baseLng + 0.004,
      status: 'normal',
      type: 'depot',
      metric: '⚡ Energy: 1,420 MWh Grid Load',
      details: \`Central \${city} municipal grid operating at 94% efficiency. Sub-station 4 balanced.\`,
    },
    {
      id: 'node-industrial',
      name: \`\${city} Industrial Recycling Plant\`,
      lat: baseLat - 0.006,
      lng: baseLng + 0.007,
      status: 'critical',
      type: 'plant',
      metric: '🏭 Waste: 42.1 Tons Recovered',
      details: 'Bulk plastic & e-waste processing facility. Heavy sorting active.',
    },
    {
      id: 'node-transit',
      name: \`\${city} Smart Transit Zone\`,
      lat: baseLat + 0.007,
      lng: baseLng - 0.005,
      status: 'attention',
      type: 'transit',
      metric: '💧 Water: 410 kL/day Smart Grid',
      details: 'IoT acoustic leak detectors active across pipeline network.',
    },
    {
      id: 'node-circular',
      name: \`\${city} Circular Economy Hub\`,
      lat: baseLat - 0.005,
      lng: baseLng - 0.006,
      status: 'normal',
      type: 'hub',
      metric: '♻️ Recycling: 9.8 Tons Processed',
      details: 'Community material collection & upcycling center operating smoothly.',
    },
    {
      id: 'node-commercial',
      name: \`\${city} Commercial Sector\`,
      lat: baseLat + 0.008,
      lng: baseLng + 0.003,
      status: 'normal',
      type: 'commercial',
      metric: '⚡ Solar Auxiliary Active',
      details: 'Rooftop commercial solar panels generating 120 kW surplus back to grid.',
    },
    {
      id: 'node-metro',
      name: \`\${city} Metro Waste Station\`,
      lat: baseLat - 0.003,
      lng: baseLng + 0.004,
      status: 'normal',
      type: 'station',
      metric: '📊 Smart Bins: 88% Fill Rate',
      details: 'Compactor status nominal. Fleet dispatch recommended in 45 mins.',
    },
  ];`;

content = content.replace(oldNodes, newNodes);

// Update map initialization
content = content.replace(
  'const mapCenter = userLoc ? [userLoc.lat, userLoc.lng] : [22.7196, 75.8577];\n\n      // Initialize Leaflet Map centered on Indore Metropolitan City\n      const map = L.map(mapContainerRef.current!, {\n        center: mapCenter as [number, number],',
  'const mapCenter = [baseLat, baseLng];\n\n      // Initialize Leaflet Map centered on User GPS location\n      const map = L.map(mapContainerRef.current!, {\n        center: mapCenter as [number, number],'
);

// Update tile layer to respect light/dark theme
content = content.replace(
  `      // Add Google Maps Street View tile layer\n      L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {\n        maxZoom: 20,\n        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']\n      }).addTo(map);`,
  `      const tileUrl = theme === 'light'\n        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'\n        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';\n      L.tileLayer(tileUrl, {\n        maxZoom: 19,\n        attribution: '&copy; OpenStreetMap &copy; CARTO',\n      }).addTo(map);`
);

// Update user marker
content = content.replace(
  `      // Add User Location Marker with Emoji\n      if (userLoc) {\n        const userIcon = L.divIcon({\n          className: 'custom-user-marker',\n          html: \`\n            <div class="relative flex flex-col items-center justify-center cursor-pointer group">\n              <div class="w-12 h-12 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-2xl shadow-2xl transform group-hover:scale-110 transition-all z-50">\n                🙋‍♂️\n              </div>\n              <span class="absolute top-0 right-0 w-4 h-4 rounded-full bg-blue-400 animate-ping"></span>\n              <div class="text-[12px] font-black text-blue-700 bg-white px-2 py-0.5 rounded absolute -bottom-6 whitespace-nowrap shadow-md border border-blue-200 z-50">You are here</div>\n            </div>\n          \`,\n          iconSize: [48, 64],\n          iconAnchor: [24, 32],\n        });\n        \n        L.marker([userLoc.lat, userLoc.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);\n      }`,
  `      const userIcon = L.divIcon({\n        className: 'custom-user-marker',\n        html: \`\n          <div class="relative flex flex-col items-center justify-center cursor-pointer group">\n            <div class="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-xl shadow-2xl transform group-hover:scale-110 transition-all z-50">\n              📍\n            </div>\n            <span class="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>\n            <div class="text-[11px] font-black text-emerald-800 bg-white px-2 py-0.5 rounded absolute -bottom-5 whitespace-nowrap shadow-md border border-emerald-200 z-50">\${userLocation?.cityName || 'You are here'}</div>\n          </div>\n        \`,\n        iconSize: [40, 50],\n        iconAnchor: [20, 25],\n      });\n      L.marker([baseLat, baseLng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);`
);

// Update telemetry lines
content = content.replace(
  `      // Add Telemetry Line Connections (Polylines) across city zones\n      const lineCoords: [number, number][] = [\n        [22.7560, 75.8910], // Vijay Nagar\n        [22.7545, 75.8240], // Super Corridor\n        [22.7196, 75.8577], // Central Depot\n        [22.6925, 75.8650], // Bhavarkua\n        [22.6710, 75.8165], // Rau Hub\n        [22.6150, 75.6825], // Pithampur\n      ];`,
  `      const lineCoords: [number, number][] = nodes.map(n => [n.lat, n.lng]);\n      lineCoords.push([baseLat, baseLng]);`
);

// Update useEffect dependency
content = content.replace(
  '}, [userLoc]);',
  '}, [baseLat, baseLng, theme]);'
);

// Update Title
content = content.replace(
  'INDORE METROPOLITAN LIVE CITY GPS TELEMETRY MAP',
  `{userLocation?.cityName ? userLocation.cityName.toUpperCase() : 'METROPOLITAN'} LIVE CITY GPS TELEMETRY MAP`
);

fs.writeFileSync('src/components/map/CampusMap.tsx', content);
console.log('Updated CampusMap.tsx with dynamic user location and theme support');

