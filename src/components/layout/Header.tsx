'use client';

import React, { useState, useEffect } from 'react';
import { useEco } from '../../context/EcoContext';
import {
  Bell,
  Sparkles,
  Flame,
  Crown,
  Bot,
  Shield,
  Menu,
  X,
  CheckCircle2,
  Clock,
  Radio,
  LogIn,
  LogOut,
  UserCheck,
  Sun,
  Moon,
  MapPin,
} from 'lucide-react';
import { MainTab } from '../../types';

export const Header: React.FC = () => {
  const { profile, role, setRole, activeTab, setActiveTab, alerts, toasts, removeToast, isMobileMenuOpen, toggleMobileMenu, isAuthenticated, openAuthModal, logout, clearAlert, clearAllAlerts, theme, toggleTheme, userLocation, isLocating, detectUserLocation } = useEco();
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = (tab: MainTab): string => {
    switch (tab) {
      case 'overview':
        return 'CITY GUARDIAN ARENA';
      case 'report-waste':
        return 'WASTE DISPOSAL // PROTOCOL';
      case 'contributions':
        return 'CONTRIBUTION MATRIX';
      case 'eco-ai':
        return 'AI HANDLER COPILOT';
      case 'nearby':
        return 'WORLD MAP & DISCOVERY';
      case 'redeem-rewards':
        return 'REWARD VAULT';
      case 'my-rewards':
        return 'ACTIVE VOUCHERS';
      case 'partner-network':
        return 'ECO PARTNERS DIRECTORY';
      case 'community-feed':
        return 'SOCIAL HUB // COMMUNITY';
      case 'community-groups':
        return 'SQUADS & CLUBS';
      case 'community-profile':
        return 'PLAYER PROFILE';
      case 'market':
        return 'ECO MARKETPLACE';
      case 'industry-demand':
        return 'INDUSTRY DEMAND BOARD';
      case 'matching':
        return 'AI MATCH MATRIX';
      case 'reuse-ideas':
        return 'BUILD FROM WASTE';
      case 'community-projects':
        return 'GUILD PROJECTS';
      case 'ecofood':
        return 'ECOFOOD SURPLUS MARKET';
      case 'ecofood-partner':
        return 'RESTAURANT PARTNER PORTAL';
      case 'ecofood-ngo':
        return 'NGO FOOD RESCUE ALLIANCE';
      case 'government-connect':
        return 'CIVIC & GOV CONNECT';
      case 'civic-reporting':
        return 'CIVIC ISSUE TRACKER';
      case 'challenges':
        return 'DAILY PROTOCOL & CHALLENGES';
      case 'leaderboard':
        return 'ARENA RANKING';
      case 'rewards':
        return 'REWARDS VAULT';
      case 'campus-monitor':
        return 'CITY MONITOR';
      case 'energy':
        return 'ENERGY ANALYTICS';
      case 'water':
        return 'WATER ANALYTICS';
      case 'waste-analytics':
        return 'WASTE COMPOSITION';
      case 'admin-overview':
        return 'COMMAND CENTER // ADMIN';
      case 'cleanup-operations':
        return 'CLEANUP DISPATCH';
      case 'material-flow':
        return 'MATERIAL FLOW MATRIX';
      case 'user-management':
        return 'USER DIRECTORY';
      case 'impact-dashboard':
        return 'GLOBAL IMPACT DASHBOARD';
      case 'csr-hub':
        return 'CSR IMPACT HUB // ARENA';
      case 'csr-missions':
        return 'LIVE CSR SPONSORED MISSIONS';
      case 'csr-projects':
        return 'DISCOVER CSR PROJECTS';
      case 'csr-funding':
        return 'CSR FUNDING CENTER // PIPELINE';
      case 'csr-impact':
        return 'CSR IMPACT INTELLIGENCE';
      case 'csr-leaderboard':
        return 'CSR GLOBAL RANKING // LEADERBOARD';
      case 'csr-reports':
        return 'CSR IMPACT AUDIT REPORTS';
      default:
        return 'CITY GUARDIAN ARENA';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/70 dark:bg-[#050B08]/75 backdrop-blur-xl border-b border-slate-200/60 dark:border-[#12281D]/60 shadow-sm px-3 sm:px-4 md:px-6 py-2.5 flex items-center justify-between font-mono select-none">
      {/* Toast Notification Container */}
      <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex flex-col gap-2 max-w-none sm:max-w-sm w-auto pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3 rounded-lg border text-xs font-mono shadow-2xl flex items-center justify-between backdrop-blur-md animate-in slide-in-from-top-4 ${
              toast.type === 'success'
                ? 'bg-[#09120D] border-[#00FF66] text-[#00FF66] shadow-[#00FF66]/20'
                : toast.type === 'warning'
                ? 'bg-[#09120D] border-[#F5C518] text-[#F5C518] shadow-[#F5C518]/20'
                : 'bg-[#09120D] border-red-500 text-red-400 shadow-red-500/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{toast.message}</span>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-white ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Left: Mobile Toggle & Live Event Indicator */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-[#FF007A] hover:text-white p-1 rounded hover:bg-[#0D0F17] transition-all"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Live Event Ticker Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border border-[#E52521]/40 px-2 sm:px-3 py-1 rounded-xl text-xs shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#FF007A] animate-ping flex-shrink-0" />
          <span className="text-[#FF007A] font-black tracking-wider text-[11px] sm:text-xs">🍄 MARIO x CLAN 🏰</span>
          <span className="text-slate-500 hidden sm:inline text-[10px] font-bold">VILLAGE DEFENSE</span>
        </div>
      </div>

      {/* Center: Player XP & Info Bar */}
      <div className="hidden lg:flex items-center gap-4 bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border border-[#E52521]/30 px-4 py-1.5 rounded-xl shadow-sm">
        {/* Initial Badge Box */}
        <div className="w-8 h-8 rounded bg-[#FF007A]/20 border border-[#FF007A] flex items-center justify-center text-[#FF007A] font-black text-xs">
          {profile.playerNumber || '#456'}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[10px] font-bold">VILLAGE CHIEF // HERO ⭐</span>
            <span className="text-white font-bold text-xs tracking-wide uppercase">{profile.name}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#03E5B7]/20 border border-[#03E5B7]/40 text-[#03E5B7] rounded font-bold">
              LVL 12
            </span>
          </div>
          {/* XP Progress bar */}
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-32 bg-[#07080E] h-1.5 rounded-full overflow-hidden border border-[#1D2133]">
              <div className="bg-[#FF007A] h-full rounded-full glow-pink" style={{ width: '84%' }} />
            </div>
            <span className="text-[9px] text-[#03E5B7] font-bold">8,420 / 10,000 XP</span>
          </div>
        </div>
      </div>

      {/* Right: HUD Stats & Time Indicator */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Eco Points / Debarred Admin Status */}
        <div
          onClick={() => setActiveTab('redeem-rewards')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border transition-all shadow-sm ${
            role === 'admin'
              ? 'border-red-500/60 bg-red-950/20'
              : 'border-[#FFC700]/50 hover:border-[#FFC700] glow-gold cursor-pointer'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${role === 'admin' ? 'text-red-400' : 'text-[#FFC700]'}`} />
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-slate-400 leading-none font-bold">
              {role === 'admin' ? 'CONTEST STATUS' : 'ECO CASH POOL'}
            </span>
            <span className={`text-xs font-black leading-tight ${
              role === 'admin' ? 'text-red-400 font-mono' : 'text-[#FFC700]'
            }`}>
              {role === 'admin' ? 'DEBARRED (0 Pts)' : `₹${profile.ecoPoints.toLocaleString()} Pts`}
            </span>
          </div>
        </div>

        {/* Streak Days */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border border-slate-200/70 dark:border-[#FF007A]/40 shadow-sm">
          <Flame className="w-3.5 h-3.5 text-[#FF007A]" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-slate-500 leading-none font-bold">POWER-UP STREAK</span>
            <span className="text-xs font-bold text-white leading-tight">12 DAYS</span>
          </div>
        </div>

        {/* Global Rank */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border border-slate-200/70 dark:border-[#03E5B7]/40 shadow-sm">
          <Crown className="w-3.5 h-3.5 text-[#03E5B7]" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-slate-500 leading-none font-bold">CLAN RANK 🏆</span>
            <span className="text-xs font-bold text-[#03E5B7] leading-tight">#27 / 456</span>
          </div>
        </div>

        {/* Clock & Sync Status */}
        <div className="hidden xl:flex flex-col text-right bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border border-slate-200/70 dark:border-[#1D2133] px-2.5 py-1 rounded-xl shadow-sm">
          <span className="text-[9px] text-slate-500 font-bold">VILLAGE CLOCK ⏳</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-white font-black tracking-widest">{timeString || '14:28:42'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#03E5B7] animate-ping" />
            <span className="text-[9px] text-[#03E5B7] font-bold">LIVE</span>
          </div>
        </div>

        
        {/* Real GPS Location Status & Selector */}
        <button
          onClick={() => detectUserLocation()}
          disabled={isLocating}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border border-slate-200/70 dark:border-[#1D2133] hover:border-[#03E5B7] text-slate-200 text-xs font-mono font-bold transition-all shadow-sm group"
          title={`GPS Location: ${userLocation.fullAddress}. Click to re-detect live GPS.`}
        >
          <MapPin className={`w-3.5 h-3.5 ${userLocation.isRealGps ? 'text-[#03E5B7]' : 'text-[#FFC700]'} ${isLocating ? 'animate-spin' : ''}`} />
          <span className="max-w-[110px] truncate">{userLocation.cityName}</span>
          {userLocation.isRealGps && (
            <span className="text-[9px] px-1 py-0.2 rounded bg-[#03E5B7]/20 text-[#03E5B7] font-black">GPS</span>
          )}
        </button>

        {/* Theme Switcher Toggle (Bright / Dark Mode) */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-mono font-bold transition-all shadow-sm bg-white/60 dark:bg-[#0D0F17]/70 backdrop-blur-md border-slate-200/70 dark:border-[#1D2133] hover:border-[#FFC700] text-slate-200"
          title={theme === 'light' ? 'Switch to Dark Cyber Theme' : 'Switch to Bright Light Theme'}
        >
          {theme === 'light' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span className="hidden sm:inline text-[11px] font-black text-amber-700">🍄 MARIO WHITE</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline text-[11px] font-bold text-indigo-300">🌙 CLAN NIGHT</span>
            </>
          )}
        </button>

        {/* AI Handler Launch */}
        <button
          onClick={() => setActiveTab('eco-ai')}
          className="p-1.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/50 text-[#00FF66] hover:bg-[#00FF66]/20 transition-all glow-green-sm"
          title="Eco AI Handler"
        >
          <Bot className="w-4 h-4" />
        </button>

        {/* System Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded bg-[#09120D] border border-[#12281D] text-slate-400 hover:text-white relative"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#00FF66] rounded-full animate-ping" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#09120D] border border-[#00FF66]/40 rounded-2xl shadow-2xl p-4 z-50 text-xs font-mono space-y-3 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#12281D] pb-2.5">
                <span className="font-bold text-[#00FF66] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#00FF66]" />
                  <span>SYSTEM ALERTS</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00FF66]/10 text-[#00FF66] font-bold border border-[#00FF66]/30">
                    {alerts.length}/5 RECENT
                  </span>
                  {alerts.length > 0 && (
                    <button
                      onClick={clearAllAlerts}
                      className="text-[10px] text-slate-400 hover:text-red-400 transition"
                      title="Clear all alerts"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-2.5 rounded-xl bg-[#050B08] border border-[#12281D] hover:border-[#00FF66]/40 transition-colors space-y-1 relative group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white text-xs line-clamp-1">{alt.title}</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            alt.severity === 'Critical'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : alt.severity === 'Warning'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40'
                          }`}
                        >
                          {alt.severity}
                        </span>
                        <button
                          onClick={() => clearAlert(alt.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-0.5"
                          title="Dismiss"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{alt.message}</p>
                    {alt.timestamp && (
                      <div className="text-[9px] text-slate-500 text-right">{alt.timestamp}</div>
                    )}
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No active system alerts.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Switch to Admin Button - Admin Accounts Only */}
        {(profile.role === 'admin' || role === 'admin') && (
          <button
            onClick={() => {
              const newRole = role === 'admin' ? 'student' : 'admin';
              setRole(newRole);
              if (newRole === 'admin') setActiveTab('admin');
              else setActiveTab('overview');
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#FF007A]/20 border border-[#FF007A]/70 text-white hover:bg-[#FF007A] text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,0,122,0.3)] font-mono glow-pink group"
            title={role === 'admin' ? "Switch to Citizen View" : "Switch to Government Control Suite"}
          >
            <Shield className="w-3.5 h-3.5 text-[#FF007A] group-hover:text-white transition-colors" />
            <span className="tracking-wide">{role === 'admin' ? 'VIEW AS CITIZEN' : 'VIEW AS GOVT'}</span>
          </button>
        )}

        {/* Authentication Button */}
        {isAuthenticated ? (
          <button
            onClick={logout}
            className="px-2.5 py-1 rounded bg-[#FF007A]/20 border border-[#FF007A]/50 text-[#FF007A] font-bold text-xs hover:bg-[#FF007A]/30 transition-all flex items-center gap-1.5 font-mono"
            title="Logout of EcoVerse"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        ) : (
          <button
            onClick={openAuthModal}
            className="px-3 py-1 rounded bg-gradient-to-r from-[#FF007A] to-[#03E5B7] text-[#07080E] font-black text-xs hover:brightness-110 transition-all shadow-[0_0_15px_rgba(3,229,183,0.3)] flex items-center gap-1.5 font-mono"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>ENTER KINGDOM 🏰</span>
          </button>
        )}
      </div>
    </header>
  );
};
