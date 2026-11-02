import fs from 'fs';

// 1. Fix src/app/page.tsx
let pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');
pageContent = pageContent.replace(
  'const { isAuthenticated, token, role } = useEco();',
  'const { isAuthenticated, token, role, activeTab } = useEco();'
);
fs.writeFileSync('src/app/page.tsx', pageContent);
console.log('Fixed src/app/page.tsx');

// 2. Fix src/components/views/ReportWasteView.tsx
let wasteContent = fs.readFileSync('src/components/views/ReportWasteView.tsx', 'utf8');
wasteContent = wasteContent.replace(
  'severity: mlData ? mlData.severity : \'High\',',
  `severity: mlData ? (mlData.severity === 'HIGH PRIORITY' ? 'High' : mlData.severity === 'MODERATE' ? 'Medium' : 'Low') : 'High',`
);
fs.writeFileSync('src/components/views/ReportWasteView.tsx', wasteContent);
console.log('Fixed src/components/views/ReportWasteView.tsx');

// 3. Fix src/context/EcoContext.tsx
let ecoContent = fs.readFileSync('src/context/EcoContext.tsx', 'utf8');

// Add theme to interface
if (!ecoContent.includes('theme: \'light\' | \'dark\';')) {
  ecoContent = ecoContent.replace(
    '// Nearby, Rewards & Social State\n  nearbyPartners:',
    '// Theme System\n  theme: \'light\' | \'dark\';\n  setTheme: (t: \'light\' | \'dark\') => void;\n  toggleTheme: () => void;\n\n  // Nearby, Rewards & Social State\n  nearbyPartners:'
  );
}

// Add theme state & toggle implementation
if (!ecoContent.includes('const [theme, setThemeState] = useState')) {
  const themeStateCode = `  // Theme State (Defaulting to bright / light theme)
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecoverse_theme', t);
      if (t === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = (localStorage.getItem('ecoverse_theme') as 'light' | 'dark') || 'light';
      setTheme(savedTheme);
    }
  }, []);
`;
  ecoContent = ecoContent.replace(
    '// Nearby, Rewards & Social State Providers',
    `${themeStateCode}\n  // Nearby, Rewards & Social State Providers`
  );
}

// Add adminActiveSection, setAdminActiveSection, theme, setTheme, toggleTheme to provider value
if (!ecoContent.includes('adminActiveSection,\n        setAdminActiveSection,')) {
  ecoContent = ecoContent.replace(
    '        activeTab,\n        setActiveTab,',
    '        activeTab,\n        setActiveTab,\n        adminActiveSection,\n        setAdminActiveSection,\n        theme,\n        setTheme,\n        toggleTheme,'
  );
}

fs.writeFileSync('src/context/EcoContext.tsx', ecoContent);
console.log('Fixed src/context/EcoContext.tsx');

