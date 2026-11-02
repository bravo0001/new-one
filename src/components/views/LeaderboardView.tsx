'use client';

import React, { useState } from 'react';
import { useEco } from '../../context/EcoContext';
import { Award, Trophy, Crown } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, profile, role } = useEco();
  const [activeCategory, setActiveCategory] = useState<'Students' | 'Teams' | 'Departments' | 'Hostels'>('Students');

  const firstPlace = leaderboard[0];
  const secondPlace = leaderboard[1];
  const thirdPlace = leaderboard[2];

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mono animate-in fade-in duration-300">
      {/* Admin Debarred Banner */}
      {role === 'admin' && (
        <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/60 flex items-center justify-between text-xs text-red-300">
          <div className="flex items-center gap-2">
            <span className="text-base">🚫</span>
            <span>
              <strong>ADMIN DEBARRED STATUS:</strong> As system administrator & host, you are debarred from earning contestant XP or ranking in the citizen leaderboard.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/40 text-[10px]">
            HOST AUDITOR
          </span>
        </div>
      )}

      {/* Title */}
      <div className="bg-[#0D0F17] border border-[#FF007A]/50 rounded-lg p-5 space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FF007A]/20 border border-[#FF007A]/40 text-[#FF007A] text-xs font-mono font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>SUPER MARIO CLAN RANKING LADDER // WORLD 1-1</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-widest">MARIO x CLAN ECO LEADERBOARD 🍄 ⭐</h1>
        <p className="text-xs text-[#03E5B7] font-bold">
          Global standings of contestants driving circular economy diversion & surviving elimination rounds.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded bg-[#0D0F17] border border-[#1D2133]">
        {(['Students', 'Teams', 'Departments', 'Hostels'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveCategory(tab)}
            className={`px-5 py-2 rounded text-xs font-black transition-all ${
              activeCategory === tab
                ? 'bg-[#FF007A] text-white shadow-md glow-pink'
                : 'text-slate-400 hover:text-white hover:bg-[#07080E]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Podium Showcase (Top 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* 2nd Place */}
        {secondPlace ? (
          <div className="bg-[#0D0F17] border border-[#03E5B7]/50 rounded-lg p-6 text-center space-y-3 relative order-2 sm:order-1 sm:mt-6 shadow-md">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto ring-2 ring-[#03E5B7] relative">
              <img src={secondPlace.avatar} alt={secondPlace.name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#03E5B7] font-black">🥈 RANK #2</div>
              <div className="font-bold text-white text-sm">{secondPlace.name}</div>
              <div className="text-xs text-[#03E5B7] font-mono font-bold">{secondPlace.points.toLocaleString()} XP</div>
            </div>
          </div>
        ) : null}

        {/* 1st Place Champion */}
        {firstPlace ? (
          <div className="bg-[#0D0F17] border-2 border-[#FFC700] rounded-lg p-6 text-center space-y-3 relative order-1 sm:order-2 shadow-2xl glow-gold">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded bg-[#FFC700] text-[#07080E] font-mono font-black text-[10px] flex items-center gap-1">
              <Crown className="w-3 h-3" /> ARENA CHAMPION
            </div>
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto ring-4 ring-[#FFC700] relative">
              <img src={firstPlace.avatar} alt={firstPlace.name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#FFC700] font-black">🥇 RANK #1</div>
              <div className="font-black text-white text-base">{firstPlace.name}</div>
              <div className="text-xs text-[#FFC700] font-mono font-black">{firstPlace.points.toLocaleString()} XP</div>
              <div className="text-[10px] text-slate-400 font-mono">{firstPlace.wasteRecoveredKg} kg diverted</div>
            </div>
          </div>
        ) : null}

        {/* 3rd Place */}
        {thirdPlace ? (
          <div className="bg-[#0D0F17] border border-[#FF007A]/50 rounded-lg p-6 text-center space-y-3 relative order-3 sm:mt-10 shadow-md">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto ring-2 ring-[#FF007A] relative">
              <img src={thirdPlace.avatar} alt={thirdPlace.name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#FF007A] font-black">🥉 RANK #3</div>
              <div className="font-bold text-white text-sm">{thirdPlace.name}</div>
              <div className="text-xs text-[#FF007A] font-mono font-bold">{thirdPlace.points.toLocaleString()} XP</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Leaderboard Rankings Table */}
      <div className="bg-[#0D0F17] border border-[#1D2133] rounded-lg overflow-hidden font-mono">
        <div className="p-4 border-b border-[#1D2133] text-xs text-slate-400 flex items-center justify-between font-bold">
          <span>CONTESTANT STANDINGS</span>
          <span>SQUID CAMPUS ARENA</span>
        </div>

        <div className="divide-y divide-[#1D2133]">
          {leaderboard.map((user) => {
            const isMe = (profile.playerNumber && user.playerNumber === profile.playerNumber) || (profile.name && user.name.toLowerCase().includes(profile.name.toLowerCase()));
            const displayName = isMe ? `${profile.name} (You)` : user.name;
            return (
              <div
                key={user.rank}
                className={`p-4 flex items-center justify-between text-xs transition-colors ${
                  isMe
                    ? 'bg-[#FF007A]/15 border-l-4 border-l-[#FF007A]'
                    : 'hover:bg-[#07080E]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`font-mono font-black w-6 ${
                      user.rank <= 3 ? 'text-[#FFC700]' : 'text-slate-400'
                    }`}
                  >
                    #{user.rank}
                  </span>
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-[#1D2133]" />
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{displayName}</span>
                      <span className="text-[10px] font-mono text-[#FF007A] font-black">{user.playerNumber}</span>
                      {user.badge && (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-[#03E5B7]/20 text-[#03E5B7] border border-[#03E5B7]/30 font-mono font-bold">
                          {user.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Waste: {user.wasteRecoveredKg}kg • CO₂: {user.co2SavedKg}kg
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="font-black text-[#FF007A]">{user.points.toLocaleString()} XP</div>
                  <div className="text-[10px] text-[#03E5B7]">Score: {user.score}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
