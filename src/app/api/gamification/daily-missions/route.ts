import { NextResponse } from 'next/server';

export async function GET() {
  const dateStr = new Date().toISOString().split('T')[0];
  const missions = [
    {
      id: `mission-waste-${dateStr}`,
      type: 'waste-report',
      text: 'Report one waste item with photo',
      xp: 50,
      points: 50,
      done: false,
      targetTab: 'report-waste',
      dateKey: dateStr,
    },
    {
      id: `mission-recycle-${dateStr}`,
      type: 'recycle',
      text: 'List recyclable scrap on EcoMarket',
      xp: 100,
      points: 100,
      done: false,
      targetTab: 'market',
      dateKey: dateStr,
    },
    {
      id: `mission-cleanup-${dateStr}`,
      type: 'cleanup',
      text: 'Join an active campus cleanup challenge',
      xp: 150,
      points: 150,
      done: false,
      targetTab: 'challenges',
      dateKey: dateStr,
    },
    {
      id: `mission-food-${dateStr}`,
      type: 'surplus-food',
      text: 'Claim or list a surplus meal on EcoFood',
      xp: 100,
      points: 100,
      done: false,
      targetTab: 'ecofood',
      dateKey: dateStr,
    },
    {
      id: `mission-civic-${dateStr}`,
      type: 'civic',
      text: 'File a municipal infrastructure complaint',
      xp: 80,
      points: 80,
      done: false,
      targetTab: 'government-connect',
      dateKey: dateStr,
    },
    {
      id: `mission-social-${dateStr}`,
      type: 'social',
      text: 'Post an environmental action on community feed',
      xp: 60,
      points: 60,
      done: false,
      targetTab: 'community-feed',
      dateKey: dateStr,
    },
  ];

  return NextResponse.json(missions);
}

