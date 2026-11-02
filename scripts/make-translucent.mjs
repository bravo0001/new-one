import fs from 'fs';

// 1. Update Header.tsx
let header = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');

// Header container to translucent
header = header.replace(
  'sticky top-0 z-30 bg-[#050B08]/95 backdrop-blur-md border-b border-[#12281D]',
  'sticky top-0 z-30 bg-white/70 dark:bg-[#050B08]/75 backdrop-blur-xl border-b border-slate-200/60 dark:border-[#12281D]/60 shadow-sm'
);

// Event ticker badge to translucent
header = header.replace(
  'bg-[#0D0F17] border border-[#FF007A]/50 px-2 sm:px-3 py-1 rounded text-xs',
  'bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border border-[#E52521]/40 px-2 sm:px-3 py-1 rounded-xl text-xs shadow-sm'
);

// Center Player bar to translucent
header = header.replace(
  'hidden lg:flex items-center gap-4 bg-[#0D0F17] border border-[#FF007A]/40 px-4 py-1.5 rounded-lg shadow-md',
  'hidden lg:flex items-center gap-4 bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border border-[#E52521]/30 px-4 py-1.5 rounded-xl shadow-sm'
);

// Eco Cash Pool to translucent
header = header.replace(
  'flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0D0F17] border transition-all',
  'flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border transition-all shadow-sm'
);

// Streak to translucent
header = header.replace(
  'hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0D0F17] border border-[#FF007A]/40',
  'hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border border-slate-200/70 dark:border-[#FF007A]/40 shadow-sm'
);

// Rank to translucent
header = header.replace(
  'hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0D0F17] border border-[#03E5B7]/40',
  'hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border border-slate-200/70 dark:border-[#03E5B7]/40 shadow-sm'
);

// Clock to translucent
header = header.replace(
  'hidden xl:flex flex-col text-right',
  'hidden xl:flex flex-col text-right bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border border-slate-200/70 dark:border-[#1D2133] px-2.5 py-1 rounded-xl shadow-sm'
);

// GPS button to translucent
header = header.replace(
  'rounded-lg bg-[#0D0F17] border border-[#1D2133] hover:border-[#03E5B7]',
  'rounded-xl bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border border-slate-200/70 dark:border-[#1D2133] hover:border-[#03E5B7]'
);

// Theme button to translucent
header = header.replace(
  'rounded-lg border text-xs font-mono font-bold transition-all shadow-sm bg-[#0D0F17] border-[#1D2133]',
  'rounded-xl border text-xs font-mono font-bold transition-all shadow-sm bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border-slate-200/70 dark:border-[#1D2133]'
);

fs.writeFileSync('src/components/layout/Header.tsx', header);
console.log('Made Header (nav bar) translucent');

// 2. Update Sidebar.tsx
let sidebar = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

sidebar = sidebar.replace(
  'hidden md:flex flex-col w-64 bg-[#07080E] border-r border-[#1D2133] h-screen sticky top-0 z-40 select-none font-mono',
  'hidden md:flex flex-col w-64 bg-white/70 dark:bg-[#07080E]/75 backdrop-blur-xl border-r border-slate-200/60 dark:border-[#1D2133]/60 h-screen sticky top-0 z-40 select-none font-mono shadow-sm'
);

sidebar = sidebar.replace(
  'relative flex flex-col w-72 max-w-[85vw] bg-[#07080E] border-r border-[#1D2133] h-full shadow-2xl z-10 select-none font-mono animate-in slide-in-from-left duration-200',
  'relative flex flex-col w-72 max-w-[85vw] bg-white/85 dark:bg-[#07080E]/85 backdrop-blur-xl border-r border-slate-200/60 dark:border-[#1D2133]/60 h-full shadow-2xl z-10 select-none font-mono animate-in slide-in-from-left duration-200'
);

sidebar = sidebar.replace(
  'p-4 border-b border-[#1D2133] space-y-1 bg-[#0D0F17] font-mono',
  'p-4 border-b border-slate-200/60 dark:border-[#1D2133]/60 space-y-1 bg-white/50 dark:bg-[#0D0F17]/50 backdrop-blur-md font-mono'
);

sidebar = sidebar.replace(
  'px-3 py-2 bg-[#0D0F17] border-b border-[#1D2133] flex items-center justify-between text-xs font-sans',
  'px-3 py-2 bg-white/50 dark:bg-[#0D0F17]/50 backdrop-blur-md border-b border-slate-200/60 dark:border-[#1D2133]/60 flex items-center justify-between text-xs font-sans'
);

sidebar = sidebar.replace(
  'p-3 border-t border-[#1D2133] bg-[#0D0F17]',
  'p-3 border-t border-slate-200/60 dark:border-[#1D2133]/60 bg-white/50 dark:bg-[#0D0F17]/50 backdrop-blur-md'
);

fs.writeFileSync('src/components/layout/Sidebar.tsx', sidebar);
console.log('Made Sidebar (side nav) translucent');

// 3. Update OverviewView.tsx Countdown & Protocol panels
let overview = fs.readFileSync('src/components/views/OverviewView.tsx', 'utf8');

// Top Hero Banner Protocol Card
overview = overview.replace(
  'bg-[#0D0F17] border border-[#1D2133] rounded-lg p-5 md:p-6 relative overflow-hidden space-y-4 shadow-xl',
  'bg-white/70 dark:bg-[#0D0F17]/75 backdrop-blur-xl border border-slate-200/80 dark:border-[#1D2133]/70 rounded-2xl p-5 md:p-6 relative overflow-hidden space-y-4 shadow-xl ring-1 ring-white/60 dark:ring-white/5'
);

// Countdown Protocol Panel
overview = overview.replace(
  '{/* ⏱️ TRIPLE COUNTDOWN CLOCKS — Counter-Clockwise */}\n      <div className="bg-[#0D0F17] border border-[#1D2133] rounded-xl p-5 space-y-4">',
  `{/* ⏱️ TRIPLE COUNTDOWN CLOCKS — Counter-Clockwise (TRANSLUCENT PROTOCOL PANEL) */}\n      <div className="bg-white/70 dark:bg-[#0D0F17]/75 backdrop-blur-xl border border-slate-200/80 dark:border-[#1D2133]/70 rounded-2xl p-5 space-y-4 shadow-xl ring-1 ring-white/60 dark:ring-white/5">`
);

// Primary Mission Card
overview = overview.replace(
  'bg-[#0D0F17] border-2 border-[#FF007A] rounded-lg p-5 md:p-6 relative overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 glow-pink',
  'bg-white/70 dark:bg-[#0D0F17]/75 backdrop-blur-xl border-2 border-[#E52521] rounded-2xl p-5 md:p-6 relative overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 shadow-xl ring-1 ring-white/60 dark:ring-white/5'
);

// Daily Protocol Panel
overview = overview.replace(
  '{/* DAILY PROTOCOL WIDGET */}\n        <div className="bg-[#09120D] border border-[#12281D] rounded-lg p-5 space-y-4">',
  `{/* DAILY PROTOCOL WIDGET (TRANSLUCENT) */}\n        <div className="bg-white/70 dark:bg-[#09120D]/75 backdrop-blur-xl border border-slate-200/80 dark:border-[#12281D]/70 rounded-2xl p-5 space-y-4 shadow-xl ring-1 ring-white/60 dark:ring-white/5">`
);

// Daily Protocol task item rows
overview = overview.replace(
  'p-3 rounded bg-[#050B08] border transition-all flex items-center justify-between text-xs group',
  'p-3 rounded-xl backdrop-blur-md bg-white/75 dark:bg-[#050B08]/75 border border-slate-200/70 dark:border-[#12281D] transition-all flex items-center justify-between text-xs group shadow-sm'
);

// Leaderboard widget next to daily protocol
overview = overview.replace(
  '{/* SQUID ARENA LEADERBOARD WIDGET */}\n        <div className="bg-[#09120D] border border-[#12281D] rounded-lg p-5 space-y-4">',
  `{/* LEADERBOARD WIDGET (TRANSLUCENT) */}\n        <div className="bg-white/70 dark:bg-[#09120D]/75 backdrop-blur-xl border border-slate-200/80 dark:border-[#12281D]/70 rounded-2xl p-5 space-y-4 shadow-xl ring-1 ring-white/60 dark:ring-white/5">`
);

fs.writeFileSync('src/components/views/OverviewView.tsx', overview);
console.log('Made Countdown Protocol & Daily Protocol panels translucent');

