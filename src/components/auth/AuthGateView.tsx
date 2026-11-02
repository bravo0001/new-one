'use client';

import React, { useState, useEffect } from 'react';
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
  help: string;
  alt: string;
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
    desc: 'Sign in with your email to track your civic & eco impact.',
    idL: 'Gmail address',
    idP: 'citizen@gmail.com',
    mode: 'text',
    check: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid Gmail / email address.',
    pwL: 'Password',
    go: 'Sign in as Citizen',
    help: 'Forgot password?',
    alt: 'Need an account?',
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
    help: 'Forgot password?',
    alt: 'Partner onboarding',
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
    help: 'Forgot password?',
    alt: 'Admin directory',
    accent: '#e6dcc3',
    onAccent: '#141211',
    okT: () => `Government Portal Unlocked`,
    okX: 'Signed in as civic administrator. Live city monitors are online.',
    demoId: 'government@gmail.com',
    demoPw: 'password123',
  },
};

export const AuthGateView: React.FC = () => {
  const { login, logout } = useEco();
  const router = useRouter();

  const [role, setRole] = useState<RoleKey>('citizen');
  const [idVal, setIdVal] = useState<string>('');
  const [pwVal, setPwVal] = useState<string>('');
  const [errMsg, setErrMsg] = useState<string>('');
  const [invalidField, setInvalidField] = useState<'id' | 'pw' | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [redirectPath, setRedirectPath] = useState<string>('/user');

  const config = ROLES[role];

  // Reset inputs when switching roles
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
      // Connect to authentication provider
      let targetEmail = trimmedId;
      if (!targetEmail.includes('@')) {
        targetEmail = `${targetEmail}@gmail.com`;
      }

      // Smart role detection: recognize Citizen, CSR, or Government by email ID or active role tab
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
      setRedirectPath(destination);

      // Show success screen
      setIsSuccess(true);

      // Seamless redirect to the corresponding citizen, csr, or government panel
      setTimeout(() => {
        router.push(destination);
      }, 1200);
    } catch (err: any) {
      setErrMsg(err.message || 'Authentication rejected by central controller.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
    setIsSuccess(false);
    setIdVal('');
    setPwVal('');
    setErrMsg('');
    setInvalidField(null);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-x-hidden select-none"
      style={{
        backgroundColor: '#141211',
        color: '#f1ebdd',
        fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
      }}
    >
      {/* Background Ghost Watermark SVG */}
      <div
        className="fixed inset-0 grid place-items-center pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          className="transition-all duration-500"
          style={{
            width: 'min(120vw, 900px)',
            height: 'auto',
            opacity: 0.07,
          }}
        >
          {role === 'citizen' && (
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={config.accent}
              strokeWidth="5"
            />
          )}
          {role === 'csr' && (
            <path
              d="M50 10 92 86H8Z"
              fill="none"
              stroke={config.accent}
              strokeWidth="5"
            />
          )}
          {role === 'government' && (
            <rect
              x="12"
              y="12"
              width="76"
              height="76"
              fill="none"
              stroke={config.accent}
              strokeWidth="5"
            />
          )}
        </svg>
      </div>

      <main className="relative z-10 w-full max-w-[440px]">
        {/* Main Title */}
        <h1
          className="text-left font-normal tracking-wide m-0 mb-1.5"
          style={{
            fontFamily: '"Do Hyeon", "Arial Narrow", Impact, sans-serif',
            fontSize: 'clamp(2.4rem, 9vw, 3.4rem)',
            lineHeight: 1,
            letterSpacing: '0.02em',
          }}
        >
          Game Access
        </h1>
        <p className="text-[#a79f92] text-sm md:text-base m-0 mb-6">
          Choose who you are, then sign in.
        </p>

        {/* Roles Selector Tabs */}
        {!isSuccess && (
          <div
            className="grid grid-cols-3 gap-2.5 mb-4"
            role="tablist"
            aria-label="Account type"
          >
            {/* Citizen Tab (Circle) */}
            <button
              type="button"
              role="tab"
              aria-selected={role === 'citizen'}
              onClick={() => handleRoleSelect('citizen')}
              className="flex flex-col items-center gap-2 py-3.5 px-2 rounded-md font-medium text-sm transition-all duration-200 outline-none focus-visible:ring-2"
              style={{
                backgroundColor: role === 'citizen' ? '#242020' : '#1d1a19',
                borderColor: role === 'citizen' ? ROLES.citizen.accent : '#3a3532',
                borderWidth: '2px',
                borderStyle: 'solid',
                color: role === 'citizen' ? '#f1ebdd' : '#a79f92',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-9 h-9">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={role === 'citizen' ? ROLES.citizen.accent : 'currentColor'}
                  fill={role === 'citizen' ? ROLES.citizen.accent : 'none'}
                  fillOpacity={role === 'citizen' ? 0.18 : 0}
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Citizen</span>
            </button>

            {/* CSR Tab (Triangle) */}
            <button
              type="button"
              role="tab"
              aria-selected={role === 'csr'}
              onClick={() => handleRoleSelect('csr')}
              className="flex flex-col items-center gap-2 py-3.5 px-2 rounded-md font-medium text-sm transition-all duration-200 outline-none focus-visible:ring-2"
              style={{
                backgroundColor: role === 'csr' ? '#242020' : '#1d1a19',
                borderColor: role === 'csr' ? ROLES.csr.accent : '#3a3532',
                borderWidth: '2px',
                borderStyle: 'solid',
                color: role === 'csr' ? '#f1ebdd' : '#a79f92',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-9 h-9">
                <path
                  d="M50 10 92 86H8Z"
                  stroke={role === 'csr' ? ROLES.csr.accent : 'currentColor'}
                  fill={role === 'csr' ? ROLES.csr.accent : 'none'}
                  fillOpacity={role === 'csr' ? 0.18 : 0}
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
              </svg>
              <span>CSR</span>
            </button>

            {/* Government Tab (Square) */}
            <button
              type="button"
              role="tab"
              aria-selected={role === 'government'}
              onClick={() => handleRoleSelect('government')}
              className="flex flex-col items-center gap-2 py-3.5 px-2 rounded-md font-medium text-sm transition-all duration-200 outline-none focus-visible:ring-2"
              style={{
                backgroundColor: role === 'government' ? '#242020' : '#1d1a19',
                borderColor: role === 'government' ? ROLES.government.accent : '#3a3532',
                borderWidth: '2px',
                borderStyle: 'solid',
                color: role === 'government' ? '#f1ebdd' : '#a79f92',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-9 h-9">
                <rect
                  x="12"
                  y="12"
                  width="76"
                  height="76"
                  stroke={role === 'government' ? ROLES.government.accent : 'currentColor'}
                  fill={role === 'government' ? ROLES.government.accent : 'none'}
                  fillOpacity={role === 'government' ? 0.18 : 0}
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Government</span>
            </button>
          </div>
        )}

        {/* Dynamic Form Panel */}
        {!isSuccess ? (
          <form
            onSubmit={handleSubmit}
            noValidate
            className={`rounded-md p-6 border-2 transition-all duration-300 ${isShaking ? 'animate-shake' : ''}`}
            style={{
              backgroundColor: '#1d1a19',
              borderColor: '#3a3532',
              borderTopWidth: '6px',
              borderTopColor: config.accent,
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <h2
                className="m-0 font-normal text-2xl"
                style={{
                  fontFamily: '"Do Hyeon", "Arial Narrow", Impact, sans-serif',
                  lineHeight: 1.1,
                }}
              >
                {config.name}
              </h2>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs px-2 py-0.5 rounded border border-[#3a3532] text-[#a79f92] hover:text-[#f1ebdd] hover:border-[#a79f92] transition-colors"
                title="Fill with valid credentials"
              >
                ⚡ Quick Fill
              </button>
            </div>

            <p className="m-0 mb-4 text-[#a79f92] text-sm leading-relaxed">
              {config.desc}
            </p>

            {/* ID Input */}
            <label
              htmlFor="game-id"
              className="block font-medium text-sm mb-1.5 text-[#f1ebdd]"
            >
              {config.idL}
            </label>
            <input
              id="game-id"
              type="text"
              autoComplete="username"
              inputMode={config.mode}
              placeholder={config.idP}
              value={idVal}
              onChange={(e) => {
                setIdVal(e.target.value);
                if (invalidField === 'id') setInvalidField(null);
              }}
              aria-invalid={invalidField === 'id'}
              className="w-full rounded border-2 px-3.5 py-3 text-base mb-4 outline-none transition-colors"
              style={{
                backgroundColor: '#141211',
                borderColor: invalidField === 'id' ? '#ff6b6b' : '#3a3532',
                color: '#f1ebdd',
              }}
            />

            {/* Password Input */}
            <label
              htmlFor="game-pw"
              className="block font-medium text-sm mb-1.5 text-[#f1ebdd]"
            >
              {config.pwL}
            </label>
            <input
              id="game-pw"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={pwVal}
              onChange={(e) => {
                setPwVal(e.target.value);
                if (invalidField === 'pw') setInvalidField(null);
              }}
              aria-invalid={invalidField === 'pw'}
              className="w-full rounded border-2 px-3.5 py-3 text-base mb-2 outline-none transition-colors"
              style={{
                backgroundColor: '#141211',
                borderColor: invalidField === 'pw' ? '#ff6b6b' : '#3a3532',
                color: '#f1ebdd',
              }}
            />

            {/* Error Message */}
            <div
              className="text-[#ff8e8e] text-xs md:text-sm min-h-[1.4em] mb-3 font-normal"
              role="alert"
            >
              {errMsg}
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full border-0 rounded font-normal text-xl tracking-wider py-3.5 cursor-pointer transition-transform duration-100 hover:brightness-110 active:scale-95 disabled:opacity-50"
              style={{
                fontFamily: '"Do Hyeon", "Arial Narrow", Impact, sans-serif',
                backgroundColor: config.accent,
                color: config.onAccent,
              }}
            >
              {loading ? 'Verifying Credentials...' : config.go}
            </button>

            {/* Sub Links */}
            <div className="flex justify-between mt-4 text-xs text-[#a79f92]">
              <a
                href="#help"
                onClick={(e) => {
                  e.preventDefault();
                  handleQuickFill();
                }}
                className="hover:underline text-[#a79f92]"
              >
                {config.help}
              </a>
              <a
                href="#alt"
                onClick={(e) => {
                  e.preventDefault();
                  handleRoleSelect(
                    role === 'citizen' ? 'csr' : role === 'csr' ? 'government' : 'citizen'
                  );
                }}
                className="hover:underline text-[#a79f92]"
              >
                {config.alt}
              </a>
            </div>
          </form>
        ) : (
          /* Success Screen (ok section) */
          <section
            className="text-center rounded-md p-9 border-2 animate-in zoom-in-95 duration-300"
            style={{
              backgroundColor: '#1d1a19',
              borderColor: config.accent,
            }}
          >
            <div className="flex justify-center mb-3">
              <svg viewBox="0 0 100 100" className="w-16 h-16 animate-bounce">
                {role === 'citizen' && (
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={config.accent}
                    strokeWidth="5"
                    strokeLinejoin="round"
                  />
                )}
                {role === 'csr' && (
                  <path
                    d="M50 10 92 86H8Z"
                    fill="none"
                    stroke={config.accent}
                    strokeWidth="5"
                    strokeLinejoin="round"
                  />
                )}
                {role === 'government' && (
                  <rect
                    x="12"
                    y="12"
                    width="76"
                    height="76"
                    fill="none"
                    stroke={config.accent}
                    strokeWidth="5"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </div>

            <h2
              className="text-2xl md:text-3xl font-normal mb-1.5"
              style={{
                fontFamily: '"Do Hyeon", "Arial Narrow", Impact, sans-serif',
                lineHeight: 1.1,
              }}
            >
              {config.okT(idVal.trim())}
            </h2>
            <p className="text-[#a79f92] text-sm mb-6 leading-relaxed">
              {redirectPath === '/organization' ? 'Government Admin Suite active. Redirecting to Government Panel...' : redirectPath === '/csr' ? 'CSR Executive Portal unlocked. Redirecting to CSR Panel...' : 'Citizen dashboard ready. Redirecting to Citizen Panel...'}
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => router.push(redirectPath)}
                className="w-full py-3 rounded text-lg font-normal cursor-pointer transition-transform hover:brightness-110 active:scale-98"
                style={{
                  fontFamily: '"Do Hyeon", "Arial Narrow", Impact, sans-serif',
                  backgroundColor: config.accent,
                  color: config.onAccent,
                }}
              >
                Proceed to {redirectPath === '/organization' ? 'Government' : redirectPath === '/csr' ? 'CSR' : 'Citizen'} Panel →
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full bg-transparent border-2 border-[#3a3532] text-[#f1ebdd] rounded py-2 px-4 text-xs font-inherit cursor-pointer hover:border-[#a79f92] transition-colors"
              >
                Sign out
              </button>
            </div>
          </section>
        )}
      </main>

      <style jsx global>{`
        @keyframes shake {
          25% {
            transform: translateX(-7px);
          }
          75% {
            transform: translateX(7px);
          }
        }
        .animate-shake {
          animation: shake 0.35s ease-in-out;
        }
      `}</style>
    </div>
  );
};
