import fs from 'fs';

let content = fs.readFileSync('src/context/EcoContext.tsx', 'utf8');

content = content.replace(
  "location: item.location || 'Indore Campus Tech Lab',",
  "location: item.location || `${userLocation.cityName} Tech Lab`,"
);

content = content.replace(
  "location: 'Indore Industrial Zone',",
  "location: `${userLocation.cityName} Industrial Zone`,"
);

content = content.replace(
  "location: 'Indore Campus',",
  "location: `${userLocation.cityName} Campus`,"
);

content = content.replace(
  "location: issue.location || 'Indore Campus Perimeter',",
  "location: issue.location || `${userLocation.areaName || userLocation.cityName}, ${userLocation.cityName}`,"
);

content = content.replace(
  "authorityTag: 'Indore Municipal Corporation / ULB',",
  "authorityTag: `${userLocation.cityName} Municipal Corporation / ULB`,"
);

fs.writeFileSync('src/context/EcoContext.tsx', content);
console.log('Updated EcoContext.tsx fallback locations to be dynamic');

