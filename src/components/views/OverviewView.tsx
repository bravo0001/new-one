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
  const { profile, wasteReports, setActiveTab, dailyMissions, completeDailyMission } = useEco();

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
      {/* HUD Header Banner */}
      <div className="bg-[#0D0F17] border border-[#FF007A]/50 rounded-lg p-4 md:p-6 space-y-3 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: "url('/images/squid-game/media_1787398142284.jpg')" }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="text-[10px] text-[#03E5B7] flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FF007A] animate-ping flex-shrink-0" />
            <span>◯ SQUID ECO-ARENA // CONTESTANT #456 CONTROL</span>
          </div>
          <button
            onClick={() => setActiveTab('eco-ai')}
            className="text-[10px] text-[#FF007A] border border-[#FF007A]/50 bg-[#160B18] px-3 py-1 rounded hover:bg-[#FF007A]/20 transition-all flex items-center gap-1 font-bold glow-pink"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>FRONT MAN COPILOT</span>
          </button>
        </div>

        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-widest flex items-center gap-3">
            CITY GUARDIAN <span className="text-[#FF007A]">SQUID ARENA</span>
          </h1>
          <p className="text-xs text-[#03E5B7] tracking-wider mt-0.5 font-bold">
            &quot;SURVIVE THE WASTE. DIVERT THE RECYCLABLES. WIN THE CASH POOL.&quot;
          </p>
        </div>

        <div className="relative z-10 pt-2 border-t border-[#1D2133] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px]">
          <span className="text-[#FF007A] flex items-center gap-1.5 font-bold">
            <span className="text-sm">◯ △ □</span>
            ROUND 7 // LIVE CAMPUS RECYCLING PROTOCOL
          </span>
          <span className="text-[#FFC700] font-bold">💰 VAULT POOL: ₹45.6 BILLION</span>
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
      <div className="bg-[#0D0F17] border-2 border-[#FF007A] rounded-lg p-5 md:p-6 relative overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 glow-pink">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-[10px] text-[#FF007A] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FF007A] animate-ping" />
            <span>PRIMARY MISSION // SQUID ARENA</span>
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
              <span>ENTER SQUID ARENA</span>
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
                className={`p-3 rounded bg-[#050B08] border transition-all flex items-center justify-between text-xs group ${
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
