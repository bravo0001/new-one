'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, Briefcase, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { useEco } from '../../context/EcoContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useEco();
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'corporate' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLoginView) {
        if (!email || !password) {
          throw new Error('Please fill in all required fields.');
        }
        await login(email, password, role);
        setSuccessMsg('Access Granted! Welcome to EcoVerse Arena.');
        setTimeout(() => {
          closeAuthModal();
          resetForm();
        }, 1200);
      } else {
        if (!name || !email || !password) {
          throw new Error('Please fill in all required fields.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await register(name, email, password, role);
        setSuccessMsg('Registration Successful! Logging you in...');
        setTimeout(() => {
          closeAuthModal();
          resetForm();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#07080E] border border-[#FF007A]/40 rounded-xl shadow-[0_0_50px_rgba(255,0,122,0.25)] overflow-hidden font-sans text-white">
        {/* Top Decorative Cyber Banner */}
        <div className="h-1.5 bg-gradient-to-r from-[#FF007A] via-[#FFC700] to-[#03E5B7]" />

        {/* Modal Header */}
        <div className="p-5 border-b border-[#1D2133] flex items-center justify-between bg-[#0D0F17]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#FF007A] text-sm font-bold">◯ △ □</span>
              <span className="text-xs font-mono font-bold tracking-widest text-[#03E5B7]">
                AUTH PROTOCOL // V2.0
              </span>
            </div>
            <h2 className="text-xl font-black tracking-wide text-white mt-1">
              {isLoginView ? 'CONTESTANT LOGIN' : 'NEW PLAYER REGISTRATION'}
            </h2>
          </div>
          <button
            onClick={() => {
              closeAuthModal();
              resetForm();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1D2133] transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[#FF007A]" />
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#0D0F17] border-b border-[#1D2133] font-mono text-xs font-bold">
          <button
            type="button"
            onClick={toggleView}
            className={`py-2 text-center rounded transition-all ${
              isLoginView
                ? 'bg-[#FF007A] text-white shadow-md glow-pink'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            LOGIN ARENA
          </button>
          <button
            type="button"
            onClick={toggleView}
            className={`py-2 text-center rounded transition-all ${
              !isLoginView
                ? 'bg-[#03E5B7] text-[#07080E] shadow-md glow-teal'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#FF007A]/10 border border-[#FF007A]/40 flex items-start gap-2.5 text-xs text-[#FF007A] font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-[#03E5B7]/10 border border-[#03E5B7]/40 flex items-start gap-2.5 text-xs text-[#03E5B7] font-medium animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {!isLoginView && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Player 456"
                  className="w-full pl-9 pr-3 py-2 bg-[#0D0F17] border border-[#1D2133] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#03E5B7] transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
                Email Address
              </label>
              <button
                type="button"
                onClick={() => {
                  setEmail('thakrethe@gmail.com');
                  setPassword('thakrethe@gmail.com');
                }}
                className="text-[10px] font-mono text-[#03E5B7] hover:underline flex items-center gap-1"
              >
                <Shield className="w-3 h-3 text-[#03E5B7]" />
                <span>Admin Quick Fill (thakrethe@gmail.com)</span>
              </button>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="thakrethe@gmail.com"
                className="w-full pl-9 pr-3 py-2 bg-[#0D0F17] border border-[#1D2133] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#03E5B7] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-[#0D0F17] border border-[#1D2133] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#03E5B7] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
              Role Identity
            </label>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                  role === 'student'
                    ? 'bg-[#03E5B7]/20 border-[#03E5B7] text-[#03E5B7] font-bold'
                    : 'bg-[#0D0F17] border-[#1D2133] text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Player</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('corporate')}
                className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                  role === 'corporate'
                    ? 'bg-[#FFC700]/20 border-[#FFC700] text-[#FFC700] font-bold'
                    : 'bg-[#0D0F17] border-[#1D2133] text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>CSR Corporate</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-[#FF007A] via-[#FFC700] to-[#03E5B7] font-mono font-bold text-sm text-[#07080E] hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(3,229,183,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#07080E] border-t-transparent rounded-full animate-spin" />
            ) : isLoginView ? (
              'AUTHENTICATE & ENTER'
            ) : (
              'REGISTER & ENTER ARENA'
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#0D0F17] border-t border-[#1D2133] text-center text-[10px] text-slate-500 font-mono">
          SECURED BY MONGOOSE & JWT ENCRYPTION // ECOVERSE DB
        </div>
      </div>
    </div>
  );
};
