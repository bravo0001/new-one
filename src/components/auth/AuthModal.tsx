'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useEco } from '../../context/EcoContext';
import { useRouter } from 'next/navigation';

type RoleKey = 'citizen' | 'csr' | 'government';

interface RoleConfig {
  name: string;
  desc: string;
  idL: string;
  idP: string;
  mode: 'numeric' | 'text';
  check: (v: string) => true | string;
  pwL: string;
  go: string;
  accent: string;
  onAccent: string;
  okT: (n: string) => string;
  okX: string;
  demoId: string;
  demoPw: string;
}

const ROLES: Record<RoleKey, RoleConfig> = {
  citizen: {
    name: 'Citizen login',
    desc: 'Sign in with your email to track your eco impact.',
    idL: 'Gmail address',
    idP: 'citizen@gmail.com',
    mode: 'text',
    check: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid Gmail / email address.',
    pwL: 'Password',
    go: 'Sign in as Citizen',
    accent: '#1fb5a0',
    onAccent: '#08201c',
    okT: (n: string) => `Welcome, ${n.split('@')[0]}`,
    okX: 'Your citizen dashboard is ready. Access granted.',
    demoId: 'citizen@gmail.com',
    demoPw: 'password123',
  },
  csr: {
    name: 'CSR login',
    desc: 'Sign in with your corporate email to manage ESG funding.',
    idL: 'Gmail address',
    idP: 'csr@gmail.com',
    mode: 'text',
    check: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid corporate / Gmail address.',
    pwL: 'Password',
    go: 'Sign in as CSR',
    accent: '#ed1b76',
    onAccent: '#ffffff',
    okT: (n: string) => `Welcome, ${n.split('@')[0].toUpperCase()}`,
    okX: 'CSR Executive Portal unlocked. Accessing ESG missions.',
    demoId: 'csr@gmail.com',
    demoPw: 'password123',
  },
  government: {
    name: 'Government login',
    desc: 'Administrative access for verified civic authorities.',
    idL: 'Gmail address',
    idP: 'government@gmail.com',
    mode: 'text',
    check: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid Government / Gmail address.',
    pwL: 'Password',
    go: 'Open Admin Portal',
    accent: '#e6dcc3',
    onAccent: '#141211',
    okT: () => `Government Portal Unlocked`,
    okX: 'Signed in as civic administrator. Live city monitors are online.',
    demoId: 'government@gmail.com',
    demoPw: 'password123',
  },
};

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useEco();
  const router = useRouter();

  const [role, setRole] = useState<RoleKey>('citizen');
  const [idVal, setIdVal] = useState<string>('');
  const [pwVal, setPwVal] = useState<string>('');
  const [errMsg, setErrMsg] = useState<string>('');
  const [invalidField, setInvalidField] = useState<'id' | 'pw' | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isAuthModalOpen) return null;

  const config = ROLES[role];

  const handleRoleSelect = (r: RoleKey) => {
    setRole(r);
    setIdVal('');
    setPwVal('');
    setErrMsg('');
    setInvalidField(null);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 380);
  };

  const handleQuickFill = () => {
    setIdVal(config.demoId);
    setPwVal(config.demoPw);
    setErrMsg('');
    setInvalidField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg('');
    setInvalidField(null);

    const trimmedId = idVal.trim();
    const res = config.check(trimmedId);
    if (res !== true) {
      setInvalidField('id');
      setErrMsg(res);
      triggerShake();
      return;
    }

    if (pwVal.length < 4) {
      setInvalidField('pw');
      setErrMsg(`${config.pwL} must be at least 4 characters.`);
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      let targetEmail = trimmedId;
      if (!targetEmail.includes('@')) {
        targetEmail = `${targetEmail}@gmail.com`;
      }

      const lower = targetEmail.toLowerCase();
      let requestedRole: 'student' | 'corporate' | 'admin' = 'student';
      if (lower.includes('csr') || lower.includes('corporate') || lower.includes('esg') || role === 'csr') {
        requestedRole = 'corporate';
      } else if (lower.includes('government') || lower.includes('admin') || lower.includes('gov') || lower.includes('thakre') || role === 'government') {
        requestedRole = 'admin';
      } else {
        requestedRole = 'student';
      }

      const res = await login(targetEmail, pwVal, requestedRole);
      const destination = res?.portalPath || (requestedRole === 'admin' ? '/organization' : requestedRole === 'corporate' ? '/csr' : '/user');
      setIsSuccess(true);

      setTimeout(() => {
        closeAuthModal();
        router.push(destination);
      }, 1200);
    } catch (err: any) {
      setErrMsg(err.message || 'Authentication failed.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-md border-2 overflow-hidden shadow-2xl"
        style={{
          backgroundColor: '#1d1a19',
          borderColor: '#3a3532',
          borderTopWidth: '6px',
          borderTopColor: config.accent,
          color: '#f1ebdd',
          fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
        }}
      >
        {/* Modal Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-[#a79f92] hover:text-[#f1ebdd] p-1 z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Roles Tabs */}
        {!isSuccess && (
          <div className="p-4 pt-6 pb-2">
            <h2
              className="text-2xl font-normal mb-1"
              style={{
                fontFamily: '"Do Hyeon", "Arial Narrow", Impact, sans-serif',
              }}
            >
              Platform Access
            </h2>
            <p className="text-xs text-[#a79f92] mb-3">Choose who you are, then sign in.</p>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                type="button"
                onClick={() => handleRoleSelect('citizen')}
                className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded border-2 text-xs font-medium transition-all"
                style={{
                  backgroundColor: role === 'citizen' ? '#242020' : '#141211',
                  borderColor: role === 'citizen' ? ROLES.citizen.accent : '#3a3532',
                  color: role === 'citizen' ? '#f1ebdd' : '#a79f92',
                }}
              >
                <svg viewBox="0 0 100 100" className="w-6 h-6">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={role === 'citizen' ? ROLES.citizen.accent : 'currentColor'}
                    fill={role === 'citizen' ? ROLES.citizen.accent : 'none'}
                    fillOpacity={role === 'citizen' ? 0.18 : 0}
                    strokeWidth="5"
                  />
                </svg>
                <span>Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('csr')}
                className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded border-2 text-xs font-medium transition-all"
                style={{
                  backgroundColor: role === 'csr' ? '#242020' : '#141211',
                  borderColor: role === 'csr' ? ROLES.csr.accent : '#3a3532',
                  color: role === 'csr' ? '#f1ebdd' : '#a79f92',
                }}
              >
                <svg viewBox="0 0 100 100" className="w-6 h-6">
                  <path
                    d="M50 10 92 86H8Z"
                    stroke={role === 'csr' ? ROLES.csr.accent : 'currentColor'}
                    fill={role === 'csr' ? ROLES.csr.accent : 'none'}
                    fillOpacity={role === 'csr' ? 0.18 : 0}
                    strokeWidth="5"
                  />
                </svg>
                <span>CSR</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('government')}
                className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded border-2 text-xs font-medium transition-all"
                style={{
                  backgroundColor: role === 'government' ? '#242020' : '#141211',
                  borderColor: role === 'government' ? ROLES.government.accent : '#3a3532',
                  color: role === 'government' ? '#f1ebdd' : '#a79f92',
                }}
              >
                <svg viewBox="0 0 100 100" className="w-6 h-6">
                  <rect
                    x="12"
                    y="12"
                    width="76"
                    height="76"
                    stroke={role === 'government' ? ROLES.government.accent : 'currentColor'}
                    fill={role === 'government' ? ROLES.government.accent : 'none'}
                    fillOpacity={role === 'government' ? 0.18 : 0}
                    strokeWidth="5"
                  />
                </svg>
                <span>Government</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Form */}
        {!isSuccess ? (
          <form
            onSubmit={handleSubmit}
            className={`p-4 pt-1 ${isShaking ? 'animate-shake' : ''}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold">{config.name}</span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[10px] px-2 py-0.5 rounded border border-[#3a3532] text-[#a79f92] hover:text-[#f1ebdd]"
              >
                ⚡ Quick Fill
              </button>
            </div>
            <p className="text-xs text-[#a79f92] mb-3">{config.desc}</p>

            <label className="block text-xs font-medium mb-1 text-[#f1ebdd]">
              {config.idL}
            </label>
            <input
              type="text"
              inputMode={config.mode}
              placeholder={config.idP}
              value={idVal}
              onChange={(e) => {
                setIdVal(e.target.value);
                if (invalidField === 'id') setInvalidField(null);
              }}
              className="w-full rounded border-2 px-3 py-2 text-sm mb-3 outline-none"
              style={{
                backgroundColor: '#141211',
                borderColor: invalidField === 'id' ? '#ff6b6b' : '#3a3532',
                color: '#f1ebdd',
              }}
            />

            <label className="block text-xs font-medium mb-1 text-[#f1ebdd]">
              {config.pwL}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={pwVal}
              onChange={(e) => {
                setPwVal(e.target.value);
                if (invalidField === 'pw') setInvalidField(null);
              }}
              className="w-full rounded border-2 px-3 py-2 text-sm mb-1 outline-none"
              style={{
                backgroundColor: '#141211',
                borderColor: invalidField === 'pw' ? '#ff6b6b' : '#3a3532',
                color: '#f1ebdd',
              }}
            />

            <div className="text-[#ff8e8e] text-xs min-h-[1.4em] mb-3">
              {errMsg}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full border-0 rounded font-normal text-lg tracking-wider py-2.5 cursor-pointer hover:brightness-110 active:scale-95"
              style={{
                fontFamily: '"Do Hyeon", "Arial Narrow", Impact, sans-serif',
                backgroundColor: config.accent,
                color: config.onAccent,
              }}
            >
              {loading ? 'Verifying...' : config.go}
            </button>
          </form>
        ) : (
          <div className="p-8 text-center animate-in zoom-in-95">
            <h3
              className="text-xl font-normal mb-2"
              style={{
                fontFamily: '"Do Hyeon", "Arial Narrow", Impact, sans-serif',
              }}
            >
              {config.okT(idVal.trim())}
            </h3>
            <p className="text-xs text-[#a79f92] mb-4">{config.okX}</p>
            <span
              className="inline-block px-3 py-1 text-xs rounded font-bold"
              style={{
                backgroundColor: config.accent,
                color: config.onAccent,
              }}
            >
              Entering Portal...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
