'use client';

import React, { useState } from 'react';
import { useEco } from '../../context/EcoContext';
import { EcoChallenge } from '../../types';
import { Trophy, Clock, Users, Flame, Award, ArrowRight, CheckCircle2, X } from 'lucide-react';

export const ChallengesView: React.FC = () => {
  const { challenges, joinChallenge, setActiveTab } = useEco();
  const [selectedChallenge, setSelectedChallenge] = useState<EcoChallenge | null>(null);

  const heroChallenge = challenges[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mono animate-in fade-in duration-300">
      {/* Title */}
      <div className="bg-[#0D0F17] border border-[#FF007A]/50 rounded-lg p-5 space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FF007A]/20 border border-[#FF007A]/40 text-[#FF007A] text-xs font-mono font-bold">
          <Trophy className="w-3.5 h-3.5" />
          <span>SUPER MARIO ECO-ARENA TOURNAMENTS 🍄 ⭐</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-widest">ECO CHALLENGES</h1>
        <p className="text-xs text-[#03E5B7] font-bold">
          Compete in inter-hostel and department recycling sprints to win piggy bank cash prize pools and prestige badges.
        </p>
      </div>

      {/* Grand Hero Competition Banner */}
      <div className="relative overflow-hidden rounded-lg bg-[#0D0F17] border-2 border-[#FF007A] p-6 md:p-8 space-y-6 shadow-2xl glow-pink">
        {/* Poster overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: "url('/images/mario/mario-banner.jpg')" }}
        />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-3 py-1 rounded bg-[#FF007A] text-white font-mono font-black tracking-wider">
                PRIMARY ARENA SPRINT
              </span>
              <span className="text-xs font-mono text-[#03E5B7] font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FFC700]" /> 7 Days Left
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-widest">{heroChallenge.title}</h2>
            <p className="text-xs text-[#03E5B7] max-w-xl font-bold">{heroChallenge.subtitle}</p>
          </div>

          <div className="text-left md:text-right bg-[#07080E] border border-[#FFC700] p-4 rounded text-[#FFC700] glow-gold">
            <div className="text-[10px] text-slate-400 font-mono font-bold">TOTAL PRIZE POOL</div>
            <div className="text-3xl font-black text-[#FFC700] font-mono">
              ₹{heroChallenge.prizePoolInr.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="relative z-10 p-4 rounded bg-[#07080E] border border-[#1D2133] space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold">{heroChallenge.goalLabel}</span>
            <span className="text-[#FF007A] font-black">
              {heroChallenge.currentKg} / {heroChallenge.targetKg} kg (85.6%)
            </span>
          </div>
          <div className="w-full h-3 bg-[#0D0F17] rounded-full overflow-hidden p-0.5 border border-[#1D2133]">
            <div
              className="h-full bg-gradient-to-r from-[#FF007A] to-[#03E5B7] rounded-full transition-all duration-500 glow-pink"
              style={{ width: `${(heroChallenge.currentKg / heroChallenge.targetKg) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{heroChallenge.participantsCount} Players Active</span>
            <span>CO₂ Avoided: {heroChallenge.co2AvoidedTonnes} tonnes</span>
          </div>
        </div>

        {/* Leaderboard Preview Podium */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {heroChallenge.topTeams.map((team) => (
            <div
              key={team.rank}
              className="p-3 rounded bg-[#07080E] border border-[#1D2133] flex items-center justify-between font-mono"
            >
              <span className="font-bold text-white flex items-center gap-1.5">
                {team.rank === 1 && '🥇'}
                {team.rank === 2 && '🥈'}
                {team.rank === 3 && '🥉'}
                {team.teamName}
              </span>
              <span className="text-[#FF007A] font-black">{team.weightKg} kg</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="relative z-10 flex gap-3">
          <button
            onClick={() => joinChallenge(heroChallenge.id)}
            className="flex-1 py-3 rounded bg-[#FF007A] text-white font-black text-xs glow-pink hover:bg-[#FF007A]/90 transition-opacity"
          >
            {heroChallenge.isJoined ? 'Joined Challenge ✓' : 'Join Clean Campus Arena (+100 Pts)'}
          </button>
          <button
            onClick={() => setSelectedChallenge(heroChallenge)}
            className="px-6 py-3 rounded bg-[#07080E] border border-[#03E5B7] text-[#03E5B7] text-xs font-bold hover:bg-[#03E5B7]/20"
          >
            View Mission Rules
          </button>
        </div>
      </div>

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono">
          <div className="bg-[#0D0F17] border-2 border-[#FF007A] rounded-lg max-w-xl w-full p-6 space-y-6 animate-in zoom-in-95 glow-pink">
            <div className="flex items-center justify-between border-b border-[#1D2133] pb-3">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF007A]/20 text-[#FF007A] font-mono font-bold">
                  ARENA SPECIFICATION
                </span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedChallenge.title}</h2>
              </div>
              <button onClick={() => setSelectedChallenge(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
              <div className="p-3 rounded bg-[#07080E] border border-[#1D2133] space-y-1">
                <span className="text-slate-400 text-[10px]">PRIZE POOL</span>
                <div className="font-black text-[#FFC700] text-sm">₹{selectedChallenge.prizePoolInr.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded bg-[#07080E] border border-[#1D2133] space-y-1">
                <span className="text-slate-400 text-[10px]">CO₂ AVOIDED</span>
                <div className="font-bold text-[#03E5B7] text-sm">{selectedChallenge.co2AvoidedTonnes} tonnes</div>
              </div>
              <div className="p-3 rounded bg-[#07080E] border border-[#1D2133] space-y-1">
                <span className="text-slate-400 text-[10px]">PLAYERS</span>
                <div className="font-bold text-[#FF007A] text-sm">{selectedChallenge.participantsCount}</div>
              </div>
            </div>

            {/* Leaderboard Rankings in Modal */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-300 font-bold">LIVE TOP TEAMS LEADERBOARD:</span>
              <div className="space-y-2 text-xs">
                {selectedChallenge.topTeams.map((team) => (
                  <div key={team.rank} className="p-3 rounded bg-[#07080E] border border-[#1D2133] flex justify-between font-mono">
                    <span className="text-white font-bold">
                      #{team.rank} {team.teamName}
                    </span>
                    <span className="text-[#03E5B7] font-bold">{team.weightKg} kg recovered</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                joinChallenge(selectedChallenge.id);
                setSelectedChallenge(null);
              }}
              className="w-full py-3 rounded bg-[#FF007A] text-white text-xs font-black glow-pink hover:bg-[#FF007A]/90 transition-opacity"
            >
              Register & Enter Challenge Arena →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

