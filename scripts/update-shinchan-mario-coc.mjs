import fs from 'fs';

let content = fs.readFileSync('src/components/game/ShinchanCollector.tsx', 'utf8');

// Update initial speech
content = content.replace(
  "const [shinchanSpeechText, setShinchanSpeechText] = useState('Indore Campus Cleanliness Patrol! ♻️');",
  "const [shinchanSpeechText, setShinchanSpeechText] = useState('Super Mario & Clan Village Patrol! 🍄🏰');"
);

// Update Shinchan quotes
const oldShinchanQuotes = `    const quotes = [
      'Nanako Didi is watching, I must clean Indore super fast! 😍✨',
      'Ooh! Carrying heavy trash for Indore Campus is fun~ 🍑✨',
      'Action Kamen Eco-Power Activated! ⚡',
      'Squid Game Guard Shinchan on Duty! ⭕',
      'Oops! Did I leave Shiro behind again? Hehe~ 🐕',
    ];`;

const newShinchanQuotes = `    const quotes = [
      'Princess & Clan Chief are watching, I must clean the Village super fast! 🍄⭐',
      'Ooh! Collecting heavy gold coins & recyclables for our Clan Village is fun~ 🪙✨',
      'Super Mario 1-UP Eco-Power Activated! 🍄⚡',
      'Clash Clan Hero Shinchan on Duty! 🏰⭐',
      'Oops! Did I leave Shiro behind in the Goblin Forest? Hehe~ 🐕',
    ];`;

content = content.replace(oldShinchanQuotes, newShinchanQuotes);

// Update Nanako quote
content = content.replace(
  "'Thank you for keeping our Indore campus so clean and green! 🌸✨',",
  "'Thank you for keeping our Clan Village so thriving, clean, and green! 🌸🏰',"
);

fs.writeFileSync('src/components/game/ShinchanCollector.tsx', content);
console.log('Updated ShinchanCollector.tsx with Super Mario & Clan Village quotes');

