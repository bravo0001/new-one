import fs from 'fs';

let content = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');

// 1. Add Sun, Moon, MapPin to lucide-react imports
if (!content.includes('Sun,')) {
  content = content.replace(
    '  UserCheck,\n} from \'lucide-react\';',
    '  UserCheck,\n  Sun,\n  Moon,\n  MapPin,\n} from \'lucide-react\';'
  );
}

// 2. Destructure theme, toggleTheme, userLocation, isLocating, detectUserLocation from useEco()
if (!content.includes('theme, toggleTheme')) {
  content = content.replace(
    'const { profile, role, setRole, activeTab, setActiveTab, alerts, toasts, removeToast, isMobileMenuOpen, toggleMobileMenu, isAuthenticated, openAuthModal, logout, clearAlert, clearAllAlerts } = useEco();',
    'const { profile, role, setRole, activeTab, setActiveTab, alerts, toasts, removeToast, isMobileMenuOpen, toggleMobileMenu, isAuthenticated, openAuthModal, logout, clearAlert, clearAllAlerts, theme, toggleTheme, userLocation, isLocating, detectUserLocation } = useEco();'
  );
}

// 3. Add location badge and theme toggle before AI Handler button
const toggleButtons = `
        {/* Real GPS Location Status & Selector */}
        <button
          onClick={() => detectUserLocation()}
          disabled={isLocating}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0D0F17] border border-[#1D2133] hover:border-[#03E5B7] text-slate-200 text-xs font-mono font-bold transition-all shadow-sm group"
          title={\`GPS Location: \${userLocation.fullAddress}. Click to re-detect live GPS.\`}
        >
          <MapPin className={\`w-3.5 h-3.5 \${userLocation.isRealGps ? 'text-[#03E5B7]' : 'text-[#FFC700]'} \${isLocating ? 'animate-spin' : ''}\`} />
          <span className="max-w-[110px] truncate">{userLocation.cityName}</span>
          {userLocation.isRealGps && (
            <span className="text-[9px] px-1 py-0.2 rounded bg-[#03E5B7]/20 text-[#03E5B7] font-black">GPS</span>
          )}
        </button>

        {/* Theme Switcher Toggle (Bright / Dark Mode) */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-all shadow-sm bg-[#0D0F17] border-[#1D2133] hover:border-[#FFC700] text-slate-200"
          title={theme === 'light' ? 'Switch to Dark Cyber Theme' : 'Switch to Bright Light Theme'}
        >
          {theme === 'light' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span className="hidden sm:inline text-[11px] font-bold text-amber-600">BRIGHT</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline text-[11px] font-bold text-indigo-300">DARK</span>
            </>
          )}
        </button>
`;

if (!content.includes('Theme Switcher Toggle')) {
  content = content.replace(
    '{/* AI Handler Launch */}',
    `${toggleButtons}\n        {/* AI Handler Launch */}`
  );
}

fs.writeFileSync('src/components/layout/Header.tsx', content);
console.log('Updated Header.tsx with Theme toggle and Location badge');

