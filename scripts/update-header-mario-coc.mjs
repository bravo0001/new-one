import fs from 'fs';

let content = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');

// Update getPageTitle
content = content.replace(
  "case 'overview':\n        return 'CITY GUARDIAN ARENA';",
  "case 'overview':\n        return '🍄 CLAN VILLAGE & KINGDOM 🏰';"
);

content = content.replace(
  "case 'redeem-rewards':\n        return 'REWARD VAULT';",
  "case 'redeem-rewards':\n        return 'TREASURE & REWARD VAULT 🪙';"
);

content = content.replace(
  "case 'nearby':\n        return 'WORLD MAP & DISCOVERY';",
  "case 'nearby':\n        return 'CLAN WORLD MAP & DISCOVERY 🗺️';"
);

// Update event badge
content = content.replace(
  '<span className="text-[#FF007A] font-black tracking-wider text-[11px] sm:text-xs">◯ SQUID ARENA</span>',
  '<span className="text-[#FF007A] font-black tracking-wider text-[11px] sm:text-xs">🍄 MARIO x CLAN 🏰</span>'
);

content = content.replace(
  '<span className="text-slate-400 hidden sm:inline text-[10px]">ZERO WASTE RAID</span>',
  '<span className="text-slate-500 hidden sm:inline text-[10px] font-bold">VILLAGE DEFENSE</span>'
);

// Update player badge
content = content.replace(
  '<span className="text-slate-400 text-[10px]">CONTESTANT // {profile.playerNumber || \'#456\'}</span>',
  '<span className="text-slate-500 text-[10px] font-bold">VILLAGE CHIEF // HERO ⭐</span>'
);

// Update streak & rank
content = content.replace(
  '<span className="text-[9px] text-slate-400 leading-none">SURVIVAL STREAK</span>',
  '<span className="text-[9px] text-slate-500 leading-none font-bold">POWER-UP STREAK</span>'
);

content = content.replace(
  '<span className="text-[9px] text-slate-400 leading-none">RANK</span>',
  '<span className="text-[9px] text-slate-500 leading-none font-bold">CLAN RANK 🏆</span>'
);

content = content.replace(
  '<span className="text-[9px] text-slate-400">ARENA TIMER</span>',
  '<span className="text-[9px] text-slate-500 font-bold">VILLAGE CLOCK ⏳</span>'
);

// Update theme toggle text
content = content.replace(
  '<span className="hidden sm:inline text-[11px] font-bold text-amber-600">BRIGHT</span>',
  '<span className="hidden sm:inline text-[11px] font-black text-amber-700">🍄 MARIO WHITE</span>'
);

content = content.replace(
  '<span className="hidden sm:inline text-[11px] font-bold text-indigo-300">DARK</span>',
  '<span className="hidden sm:inline text-[11px] font-bold text-indigo-300">🌙 CLAN NIGHT</span>'
);

// Update join button
content = content.replace(
  '<span>JOIN ARENA</span>',
  '<span>ENTER KINGDOM 🏰</span>'
);

fs.writeFileSync('src/components/layout/Header.tsx', content);
console.log('Updated Header.tsx with Super Mario & Clash of Clans village styling');

