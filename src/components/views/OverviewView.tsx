'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEco } from '../../context/EcoContext';
import { CampusMap } from '../map/CampusMap';
import {
  Camera,
  MapPin,
  Gift,
  Bot,
  Globe,
  Trophy,
  CheckSquare,
  Square,
  ArrowRight,
  Target,
  Sparkles,
  Users,
  Clock,
  Shield,
  Activity,
  Flame,
  ChevronRight,
  Timer,
  CalendarDays,
  CalendarClock,
} from 'lucide-react';

// ─── Counter-Clockwise Countdown Ring Component ───
interface CountdownRingProps {
  label: string;
  icon: React.ReactNode;
  progress: number;
  centerText: string;
  subText: string;
  color: string;
  glowClass?: string;
  size?: number;
}

const CountdownRing: React.FC<CountdownRingProps> = ({
  label, icon, progress, centerText, subText, color, glowClass = '', size = 120,
}) => {
  const strokeWidth = 5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(1, progress)));

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{label}</span>
      <div className={`relative ${glowClass}`} style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#1D2133" strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
            style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-lg font-black" style={{ color }}>{centerText}</div>
          <div className="text-[8px] text-slate-400 font-bold">{subText}</div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[10px] font-bold" style={{ color }}>
        {icon}
      </div>
    </div>
  );
};

// ─── Time helpers ───
const getSecondsUntilMidnight = (): number => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
};

const getSecondsUntilEndOfWeek = (): number => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSunday = 7 - dayOfWeek;
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + daysUntilSunday);
  endOfWeek.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((endOfWeek.getTime() - now.getTime()) / 1000));
};

const getSecondsUntilEndOfYear = (): number => {
  const now = new Date();
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  return Math.max(0, Math.floor((endOfYear.getTime() - now.getTime()) / 1000));
};

const formatHMS = (totalSec: number): string => {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const formatDHM = (totalSec: number): string => {
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return `${d}D ${String(h).padStart(2, '0')}H ${String(m).padStart(2, '0')}M`;
};

const TOTAL_DAY_SEC = 86400;
const TOTAL_WEEK_SEC = 604800;

export const OverviewView: React.FC = () => {
  const { profile, wasteReports, setActiveTab, dailyMissions, completeDailyMission, addToast, addEcoPoints } = useEco();

  const [isQuestionBlockBumping, setIsQuestionBlockBumping] = useState(false);
  const [coinPopups, setCoinPopups] = useState<{ id: number; text: string }[]>([]);

  const handleHitQuestionBlock = () => {
    setIsQuestionBlockBumping(true);
    setTimeout(() => setIsQuestionBlockBumping(false), 300);

    const newCoin = { id: Date.now(), text: '+50 🪙' };
    setCoinPopups((prev) => [...prev, newCoin]);
    setTimeout(() => {
      setCoinPopups((prev) => prev.filter((c) => c.id !== newCoin.id));
    }, 1000);

    if (addEcoPoints) addEcoPoints(50, 'Mario Lucky ? Block');
    if (addToast) addToast('⭐ YAHOO! You hit the Mario ? Block! +50 Eco Coins added to Clan Pool!', 'success');
  };

  const completedCount = dailyMissions.filter((t) => t.done).length;
  const progressPercent = dailyMissions.length > 0 ? Math.round((completedCount / dailyMissions.length) * 100) : 0;

  // ─── Live Countdown State ───
  const [dayRemain, setDayRemain] = useState(getSecondsUntilMidnight());
  const [weekRemain, setWeekRemain] = useState(getSecondsUntilEndOfWeek());
  const [yearRemain, setYearRemain] = useState(getSecondsUntilEndOfYear());
  const totalYearSec = useRef(365.25 * 86400);

  useEffect(() => {
    const interval = setInterval(() => {
      setDayRemain(getSecondsUntilMidnight());
      setWeekRemain(getSecondsUntilEndOfWeek());
      setYearRemain(getSecondsUntilEndOfYear());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 font-mono select-none animate-in fade-in duration-300">
      {/* 🍄 Super Mario Eco-Arena Hero Banner with Animated Graphics */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-sky-300 shadow-xl bg-gradient-to-r from-[#60B5FF] via-[#7DD3FC] to-[#BAE6FD] text-slate-900 p-5 sm:p-6 md:p-8 space-y-4">
        {/* Mario World Scene Background */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-overlay"
          style={{ backgroundImage: "url('/images/mario/mario-banner.jpg')" }}
        />

        {/* Floating Clouds Background Animation */}
        <div className="absolute top-2 inset-x-0 pointer-events-none overflow-hidden h-10 opacity-70 flex justify-between px-8">
          <span className="text-2xl animate-pulse select-none">☁️</span>
          <span className="text-xl animate-bounce select-none">☁️</span>
          <span className="text-3xl animate-pulse select-none">☁️</span>
        </div>

        {/* Top Ticker & Copilot Action */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-300 text-[11px] font-black text-slate-800 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping flex-shrink-0" />
            <span className="tracking-wider">🍄 SUPER MARIO WORLD 1-1 // CLAN ADVENTURE ARENA</span>
          </div>

          <button
            onClick={() => setActiveTab('eco-ai')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-slate-950 font-black text-xs transition-all shadow-md hover:scale-105 active:scale-95 border border-yellow-200"
          >
            <Bot className="w-4 h-4 text-red-600" />
            <span>MARIO AI COPILOT 🍄</span>
          </button>
        </div>

        {/* Main Banner Content */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wider drop-shadow-md flex flex-wrap items-center gap-2.5">
              <span className="text-slate-900 drop-shadow-xs">CITY GUARDIAN</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E52521] via-red-600 to-[#F59E0B] drop-shadow-[0_2px_10px_rgba(255,255,255,0.9)]">
                SUPER MARIO ARENA
              </span>
              <span className="inline-block animate-bounce text-2xl">⭐</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-800 font-extrabold tracking-wide leading-relaxed drop-shadow-xs">
              &quot;JUMP OVER CIVIC WASTE • HIT QUESTION BLOCKS • COLLECT RECYCLED COINS • RESCUE THE GREEN KINGDOM!&quot;
            </p>
          </div>

          {/* Right Side: Animated Mario Artwork & Interactive [?] Block */}
          <div className="flex items-center justify-center md:justify-end gap-3.5 relative">
            {/* Pop-up Coins Container */}
            <div className="absolute -top-7 right-14 pointer-events-none">
              {coinPopups.map((c) => (
                <div
                  key={c.id}
                  className="text-yellow-300 font-black text-base animate-bounce drop-shadow-[0_2px_8px_rgba(234,179,8,0.9)]"
                >
                  {c.text}
                </div>
              ))}
            </div>

            {/* Interactive Question Block */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={handleHitQuestionBlock}
                className={`w-14 h-14 rounded-xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-4 border-amber-200 shadow-xl flex items-center justify-center text-slate-950 font-black text-2xl cursor-pointer hover:brightness-110 transition-transform active:scale-95 ${
                  isQuestionBlockBumping ? 'scale-125 -translate-y-3' : 'animate-bounce'
                }`}
                title="Tap to hit the Lucky ? Block!"
                style={{
                  boxShadow: '0 6px 0 #b45309, 0 10px 15px rgba(0,0,0,0.3)',
                }}
              >
                ?
              </button>
              <span className="text-[9px] font-black text-amber-900 uppercase tracking-widest drop-shadow-xs">
                TAP BLOCK
              </span>
            </div>

            {/* Mario Jumping Avatar Frame */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-3 border-amber-300/80 shadow-2xl bg-sky-300/20 backdrop-blur-xs flex items-center justify-center group hover:scale-105 transition-transform">
              <img
                src="/images/mario/mario-banner.jpg"
                alt="Super Mario Jumping"
                className="w-full h-full object-cover object-center transform hover:scale-115 transition-transform duration-500"
              />
              <span className="absolute bottom-1 right-1 text-sm select-none animate-pulse">🍄</span>
            </div>
          </div>
        </div>

        {/* Lower Banner Info Strip */}
        <div className="relative z-10 pt-3 border-t border-sky-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-bold">
          <span className="flex items-center gap-2 text-slate-900 drop-shadow-xs font-black">
            <span className="text-base animate-pulse">🏰</span>
            <span>PEACH&apos;S CASTLE ECO-PROTOCOL // CLAN WORLD 1-1</span>
          </span>
          <span className="text-amber-900 bg-white/90 px-3 py-1 rounded-lg border border-amber-300 shadow-xs flex items-center gap-1.5 font-black">
            <span>⭐ STAR COIN VAULT: ₹45.6 BILLION (999,999 COINS)</span>
          </span>
        </div>
      </div>

      {/* ⏱️ TRIPLE COUNTDOWN CLOCKS — Counter-Clockwise */}
      <div className="bg-[#0D0F17] border border-[#1D2133] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1D2133] pb-3">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#FF007A]" />
            <div>
              <span className="text-[9px] text-slate-500 font-bold">ELIMINATION TIMERS</span>
              <h3 className="text-sm font-black text-white tracking-wider">COUNTDOWN PROTOCOL</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-[#03E5B7] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#03E5B7] animate-pulse" />
            LIVE SYNC
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 justify-items-center">
          {/* 24-Hour Daily Clock */}
          <CountdownRing
            label="DAILY RESET"
            icon={<><Clock className="w-3 h-3" /> 24H CYCLE</>}
            progress={dayRemain / TOTAL_DAY_SEC}
            centerText={formatHMS(dayRemain)}
            subText="UNTIL RESET"
            color="#FF007A"
            glowClass="glow-pink"
            size={130}
          />

          {/* 7-Day Weekly Clock */}
          <CountdownRing
            label="WEEKLY SPRINT"
            icon={<><CalendarDays className="w-3 h-3" /> 7-DAY CYCLE</>}
            progress={weekRemain / TOTAL_WEEK_SEC}
            centerText={formatDHM(weekRemain)}
            subText="UNTIL SUNDAY"
            color="#03E5B7"
            glowClass="glow-teal"
            size={130}
          />

          {/* Yearly Task Complexity Clock */}
          <CountdownRing
            label="YEARLY IMPACT"
            icon={<><CalendarClock className="w-3 h-3" /> TASK COMPLEXITY</>}
            progress={yearRemain / totalYearSec.current}
            centerText={`${Math.round((1 - yearRemain / totalYearSec.current) * 100)}%`}
            subText="YEAR ELAPSED"
            color="#FFC700"
            size={130}
          />
        </div>

        {/* Live ticker strip */}
        <div className="flex flex-wrap items-center justify-between text-[9px] border-t border-[#1D2133] pt-2 gap-2">
          <span className="text-slate-500 font-bold">TASK SYNC STATUS</span>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[#FF007A] font-bold">{dailyMissions.filter(t => !t.done).length} DAILY PENDING</span>
            <span className="text-[#03E5B7] font-bold">{completedCount}/{dailyMissions.length} COMPLETED</span>
            <span className="text-[#FFC700] font-bold">{progressPercent}% PROTOCOL</span>
          </div>
        </div>
      </div>

      {/* 🚀 FEATURED MISSION CARD */}
      <div className="bg-white/70 dark:bg-[#0D0F17]/75 backdrop-blur-xl border-2 border-[#E52521] rounded-2xl p-5 md:p-6 relative overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 shadow-xl ring-1 ring-white/60 dark:ring-white/5">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-[10px] text-[#FF007A] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FF007A] animate-ping" />
            <span>PRIMARY MISSION // MARIO VILLAGE ARENA</span>
          </div>

          <div>
            <h2 className="text-3xl font-black text-white tracking-wider">
              ZERO WASTE CAMPUS RAID
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              <span className="text-[#FF007A] font-bold">OBJECTIVE:</span> Divert <span className="text-[#03E5B7] font-bold">500 KG</span> of waste before the elimination timer expires.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="text-[#03E5B7] font-bold">COMMUNITY PROGRESS</span>
              <span className="text-[#FF007A] font-extrabold">85.6%</span>
            </div>
            <div className="w-full bg-[#07080E] h-3 rounded-full overflow-hidden border border-[#1D2133] p-0.5">
              <div className="bg-gradient-to-r from-[#FF007A] to-[#03E5B7] h-full rounded-full glow-pink transition-all duration-500" style={{ width: '85.6%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span className="text-[#03E5B7] font-bold">428 KG DIVERTED</span>
              <span>/ 500 KG TARGET</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('challenges')}
              className="px-5 py-2.5 bg-[#FF007A] text-white font-black text-xs rounded hover:bg-[#FF007A]/90 transition-all flex items-center gap-2 glow-pink"
            >
              <span>ENTER MARIO ARENA 🏰</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('nearby')}
              className="px-4 py-2.5 bg-[#07080E] border border-[#03E5B7] text-[#03E5B7] hover:text-white hover:bg-[#03E5B7]/20 font-bold text-xs rounded transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#03E5B7]" />
              <span>RADAR MAP</span>
            </button>
          </div>
        </div>

        <div className="bg-[#07080E] border border-[#1D2133] rounded-lg p-4 flex flex-col items-center justify-between relative min-h-[220px] radar-grid">
          <div className="relative w-36 h-36 rounded-full border border-[#FF007A]/40 flex items-center justify-center my-auto">
            <div className="w-24 h-24 rounded-full border border-[#03E5B7]/30 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#FF007A]/20 border border-[#FF007A] flex flex-col items-center justify-center text-center">
                <span className="text-base font-black text-[#FF007A] leading-none">428</span>
                <span className="text-[7px] text-[#03E5B7] font-bold leading-none mt-0.5">KG diverted</span>
              </div>
            </div>
            <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-[#FF007A] animate-ping" />
            <span className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-[#03E5B7]" />
          </div>

          <div className="w-full flex items-center justify-between text-[10px] border-t border-[#1D2133] pt-2">
            <span className="text-slate-400 font-bold">TIMER REMAINING</span>
            <span className="text-[#FFC700] font-black">{formatDHM(weekRemain)}</span>
          </div>
          <div className="w-full text-center text-[9px] text-[#03E5B7] font-bold mt-1">
            1,824 CONTESTANTS DEPLOYED ◯
          </div>
        </div>
      </div>

      {/* 📊 PROTOCOL & LEADERBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DAILY PROTOCOL WIDGET */}
        <div className="bg-[#09120D] border border-[#12281D] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#12281D] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[#00FF66]">⚡</span>
              <div>
                <span className="text-[9px] text-[#527A67]">DAILY PROTOCOL</span>
                <h3 className="text-base font-extrabold text-white">DAILY MISSIONS</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#FF007A] font-bold bg-[#FF007A]/10 border border-[#FF007A]/30 rounded px-2 py-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatHMS(dayRemain)}
              </span>
              <span className="text-lg font-bold text-[#00FF66]">{progressPercent}%</span>
            </div>
          </div>

          <div className="w-full bg-[#050B08] h-2 rounded-full overflow-hidden border border-[#12281D]">
            <div className="bg-[#00FF66] h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="space-y-2">
            {dailyMissions.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-xl backdrop-blur-md bg-white/75 dark:bg-[#050B08]/75 border border-slate-200/70 dark:border-[#12281D] transition-all flex items-center justify-between text-xs group shadow-sm ${
                  task.done
                    ? 'border-[#12281D] text-slate-500 line-through'
                    : 'border-[#12281D] text-white hover:border-[#00FF66]/50'
                }`}
              >
                <div
                  onClick={() => completeDailyMission(task.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  {task.done ? (
                    <CheckSquare className="w-4 h-4 text-[#00FF66] flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[#527A67] group-hover:text-[#00FF66] flex-shrink-0 transition-colors" />
                  )}
                  <span className={task.done ? 'line-through text-slate-500' : 'text-slate-100 font-bold'}>
                    {task.text}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {!task.done && task.targetTab && (
                    <button
                      onClick={() => setActiveTab(task.targetTab!)}
                      className="px-2 py-0.5 rounded bg-[#00FF66]/10 hover:bg-[#00FF66]/25 text-[#00FF66] text-[10px] font-bold border border-[#00FF66]/30 transition-all flex items-center gap-1"
                      title={`Go to ${task.targetTab}`}
                    >
                      <span>GO</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                  <span className={`text-[10px] font-bold ${task.done ? 'text-slate-600 line-through' : 'text-[#F5C518]'}`}>
                    +{task.xp} XP
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between text-[9px] border-t border-[#12281D] pt-2 gap-1">
            <span className="text-[#527A67] font-bold">AUTO-ASSIGNED TODAY</span>
            <span className="text-[#00FF66] font-bold flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {dailyMissions.length} TASKS · RESETS IN {formatHMS(dayRemain)}
            </span>
          </div>
        </div>

        {/* ARENA RANKING WIDGET */}
        <div className="bg-[#09120D] border border-[#12281D] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#12281D] pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#00FF66]" />
              <div>
                <span className="text-[9px] text-[#527A67]">ARENA RANKING</span>
                <h3 className="text-base font-extrabold text-white">TOP PLAYERS</h3>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="p-1 rounded bg-[#050B08] border border-[#12281D] text-[#00FF66] hover:border-[#00FF66]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded bg-[#050B08] border border-[#12281D] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-bold">01</span>
                <div className="w-7 h-7 rounded bg-[#F5C518]/20 border border-[#F5C518] flex items-center justify-center text-[#F5C518] font-bold text-[10px]">
                  AR
                </div>
                <div>
                  <span className="font-bold text-white">AARAV R.</span>
                  <p className="text-[9px] text-[#527A67]">LVL 18 // DIAMOND</p>
                </div>
              </div>
              <span className="text-[#00FF66] font-bold">10,840</span>
            </div>

            <div className="p-2.5 rounded bg-[#050B08] border border-[#12281D] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-bold">02</span>
                <div className="w-7 h-7 rounded bg-[#00FF66]/20 border border-[#00FF66] flex items-center justify-center text-[#00FF66] font-bold text-[10px]">
                  PR
                </div>
                <div>
                  <span className="font-bold text-white">PRIYA R.</span>
                  <p className="text-[9px] text-[#527A67]">LVL 15 // PLATINUM</p>
                </div>
              </div>
              <span className="text-[#00FF66] font-bold">9,240</span>
            </div>

            <div className="p-2.5 rounded bg-[#050B08] border border-[#12281D] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-bold">03</span>
                <div className="w-7 h-7 rounded bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-500 font-bold text-[10px]">
                  MK
                </div>
                <div>
                  <span className="font-bold text-white">MEERA K.</span>
                  <p className="text-[9px] text-[#527A67]">LVL 14 // GOLD</p>
                </div>
              </div>
              <span className="text-[#00FF66] font-bold">8,990</span>
            </div>

            <div className="p-3 rounded bg-[#00FF66]/10 border border-[#00FF66] flex items-center justify-between text-xs glow-green-sm">
              <div className="flex items-center gap-3">
                <span className="text-[#00FF66] font-bold">27</span>
                <span className="font-bold text-white">YOU // DHEERAJ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#00FF66] font-bold">8,420</span>
                <span className="text-[9px] text-[#00FF66]">▲ +3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📍 LIVE MAP & QUICK CONTROLS */}
      <div className="bg-[#09120D] border border-[#12281D] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-wider">
              LIVE CAMPUS ECO-GRID RADAR
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('report-waste')}
            className="px-3 py-1 bg-[#00FF66]/10 border border-[#00FF66]/40 text-[#00FF66] rounded text-xs font-bold hover:bg-[#00FF66]/20 transition-all"
          >
            + DISPOSE WASTE (+50 XP)
          </button>
        </div>
        <CampusMap />
      </div>
    </div>
  );
};
