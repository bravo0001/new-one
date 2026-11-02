import fs from 'fs';

let content = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

// Update brand header
content = content.replace(
  '<span className="text-[#FF007A] text-lg font-bold">◯ △ □</span>',
  '<span className="text-xl">🍄 🏰 ⭐</span>'
);

content = content.replace(
  'SQUID EDITION',
  'MARIO x CLAN'
);

content = content.replace(
  '<span>CONTESTANT ARENA // R7</span>',
  '<span>CLAN VILLAGE // WORLD 1-1</span>'
);

content = content.replace(
  '<span className="text-[#FF007A] flex items-center gap-1 font-bold">\n            <span className="w-1.5 h-1.5 rounded-full bg-[#FF007A] inline-block animate-ping" />\n            GAME ACTIVE\n          </span>',
  '<span className="text-emerald-600 flex items-center gap-1 font-bold">\n            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />\n            SHIELD ACTIVE 🛡️\n          </span>'
);

// Update player role button
content = content.replace(
  '#456 PLAYER',
  'CHIEF / MARIO ⭐'
);

// Update section title
content = content.replace(
  "title: 'SURVIVAL ARENA',",
  "title: 'CLAN VILLAGE & KINGDOM',",
);

fs.writeFileSync('src/components/layout/Sidebar.tsx', content);
console.log('Updated Sidebar.tsx with Super Mario & Clash of Clans village styling');

