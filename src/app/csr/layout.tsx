import React from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { AuthModal } from '../../components/auth/AuthModal';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { SquidCyberBackground } from '../../components/layout/SquidCyberBackground';

export default function CsrLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen relative">
        <SquidCyberBackground />
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <Header />
          <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
            {children}
          </main>
        </div>
        <AuthModal />
      </div>
    </AuthGuard>
  );
}
