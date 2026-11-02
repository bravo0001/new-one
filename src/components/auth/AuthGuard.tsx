'use client';

import React, { useEffect, useState } from 'react';
import { useEco } from '../../context/EcoContext';
import { useRouter } from 'next/navigation';
import { SquidCyberBackground } from '../layout/SquidCyberBackground';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useEco();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && (!isAuthenticated || !token)) {
      router.replace('/');
    }
  }, [isClient, isAuthenticated, token, router]);

  if (!isClient) {
    return null;
  }

  if (!isAuthenticated || !token) {
    return (
      <div className="flex min-h-screen relative items-center justify-center bg-[#07080E] select-none">
        <SquidCyberBackground />
        <div className="relative z-10 flex flex-col items-center">
          <span className="inline-block w-10 h-10 border-4 border-[#FF007A] border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-[#03E5B7] font-mono tracking-widest text-sm animate-pulse">
            AUTHENTICATION REQUIRED // REDIRECTING TO SIGN IN...
          </h2>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
