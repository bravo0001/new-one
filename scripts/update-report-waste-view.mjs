import fs from 'fs';

let content = fs.readFileSync('src/components/views/ReportWasteView.tsx', 'utf8');

// 1. Destructure userLocation, detectUserLocation, isLocating from useEco()
content = content.replace(
  'const { reportWaste, setActiveTab, profile, addToast } = useEco();',
  'const { reportWaste, setActiveTab, profile, addToast, userLocation, detectUserLocation, isLocating } = useEco();'
);

// 2. Initialize location from userLocation
content = content.replace(
  'const [location, setLocation] = useState(\'Block B, North Gate\');',
  'const [location, setLocation] = useState(userLocation?.fullAddress || \'Local Campus / Area\');\n\n  useEffect(() => {\n    if (userLocation?.fullAddress) {\n      setLocation(userLocation.fullAddress);\n    }\n  }, [userLocation?.fullAddress]);'
);

// 3. Replace static select with dynamic input & GPS button
const oldPicker = `          {/* Location Picker */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#03E5B7]" /> CAMPUS LOCATION
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#07080E] border border-[#1D2133] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF007A] font-mono"
            >
              <option value="Block B, North Gate">Block B, North Gate</option>
              <option value="Electronics Lab 2, 2nd Floor">Electronics Lab 2</option>
              <option value="Hostel Block A, Backyard">Hostel Block A</option>
              <option value="Main Canteen Loading Bay">Main Canteen</option>
            </select>
          </div>`;

const newPicker = `          {/* Location Picker */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#03E5B7]" /> REPORT LOCATION / GPS
              </label>
              <button
                type="button"
                onClick={async () => {
                  await detectUserLocation();
                  if (userLocation?.fullAddress) {
                    setLocation(userLocation.fullAddress);
                  }
                }}
                disabled={isLocating}
                className="text-[10px] text-[#03E5B7] hover:underline flex items-center gap-1 font-mono font-bold"
              >
                <span>{isLocating ? 'Locating...' : '📍 Auto-Detect GPS'}</span>
              </button>
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Block B North Gate or exact GPS Address"
              className="w-full bg-[#07080E] border border-[#1D2133] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF007A] font-mono"
            />
          </div>`;

content = content.replace(oldPicker, newPicker);

// 4. Update Card Title
content = content.replace(
  'INDORE CAMPUS LIVE GRID TELEMETRY MAP',
  `LIVE GIS TELEMETRY MAP ({userLocation?.cityName ? userLocation.cityName.toUpperCase() : 'CAMPUS'})`
);

// 5. Update AI Hub string
content = content.replace(
  'Nearest collection hub is <strong className="text-[#03E5B7]">Indore Hub #2 (240m away)</strong>.',
  'Nearest collection hub is <strong className="text-[#03E5B7]">{userLocation?.cityName || \'Regional\'} Hub #2 (240m away)</strong>.'
);

fs.writeFileSync('src/components/views/ReportWasteView.tsx', content);
console.log('Updated ReportWasteView.tsx with dynamic location and GPS detect');

