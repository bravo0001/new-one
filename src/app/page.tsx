'use client';

import React, { useEffect } from 'react';
import { useEco } from '../context/EcoContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { AuthModal } from '../components/auth/AuthModal';

import { OverviewView } from '../components/views/OverviewView';
import { ReportWasteView } from '../components/views/ReportWasteView';
import { MyContributionsView } from '../components/views/MyContributionsView';
import { EcoAiCopilot } from '../components/ai/EcoAiCopilot';

// Discover, Nearby Map & Rewards Views
import { NearbyView } from '../components/views/NearbyView';
import { RedeemRewardsView } from '../components/views/RedeemRewardsView';
import { MyRewardsView } from '../components/views/MyRewardsView';
import { PartnerNetworkView } from '../components/views/PartnerNetworkView';

// Community Social Views
import { CommunityFeedView } from '../components/views/CommunityFeedView';
import { CommunityGroupsView } from '../components/views/CommunityGroupsView';
import { CommunityProfileView } from '../components/views/CommunityProfileView';

// Circular Economy Views
import { EcoMarketView } from '../components/views/EcoMarketView';
import { IndustryDemandView } from '../components/views/IndustryDemandView';
import { MatchingSystemView } from '../components/views/MatchingSystemView';
import { BuildFromWasteView } from '../components/views/BuildFromWasteView';
import { CommunityProjectsView } from '../components/views/CommunityProjectsView';
import { ChallengesView } from '../components/views/ChallengesView';
import { LeaderboardView } from '../components/views/LeaderboardView';
import { RewardsView } from '../components/views/RewardsView';
import { CampusMonitorView } from '../components/views/CampusMonitorView';
import { EnergyAnalyticsView } from '../components/views/EnergyAnalyticsView';
import { WaterAnalyticsView } from '../components/views/WaterAnalyticsView';
import { WasteAnalyticsView } from '../components/views/WasteAnalyticsView';
import { ImpactDashboardView } from '../components/views/ImpactDashboardView';

// EcoFood, Government, & Admin Views
import { EcoFoodView } from '../components/views/EcoFoodView';
import { EcoFoodPartnerView } from '../components/views/EcoFoodPartnerView';
import { EcoFoodNgoView } from '../components/views/EcoFoodNgoView';
import { GovernmentConnectView } from '../components/views/GovernmentConnectView';
import { CivicReportingView } from '../components/views/CivicReportingView';
import { AdminOverviewView } from '../components/views/AdminOverviewView';
import { AdminSuiteView } from '../components/views/AdminSuiteView';
import { CleanupOperationsView } from '../components/views/CleanupOperationsView';
import { MaterialFlowView } from '../components/views/MaterialFlowView';
import { UserManagementView } from '../components/views/UserManagementView';
import { ShinchanCollector } from '../components/game/ShinchanCollector';
import { SquidCyberBackground } from '../components/layout/SquidCyberBackground';

// Corporate Impact Arena (CSR) Views
import { CsrHubView } from '../components/views/csr/CsrHubView';
import { CsrMissionsView } from '../components/views/csr/CsrMissionsView';
import { CsrProjectsView } from '../components/views/csr/CsrProjectsView';
import { CsrFundingView } from '../components/views/csr/CsrFundingView';
import { CsrImpactDashboardView } from '../components/views/csr/CsrImpactDashboardView';
import { CsrLeaderboardView } from '../components/views/csr/CsrLeaderboardView';
import { CsrReportsView } from '../components/views/csr/CsrReportsView';
import { AuthGateView } from '../components/auth/AuthGateView';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, token, role, activeTab } = useEco();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && token) {
      if (role === 'admin') {
        router.push('/organization');
      } else if (role === 'corporate') {
        router.push('/csr');
      } else {
        router.push('/user');
      }
    }
  }, [isAuthenticated, token, role, router]);

  if (!isAuthenticated || !token) {
    return <AuthGateView />;
  }

  // Loading state while redirecting
  const renderActiveView = () => {
    // If role is set to Corporate Sponsor and overview is selected, show CSR Hub
    if (role === 'corporate' && activeTab === 'overview') {
      return <CsrHubView />;
    }

    // If role is set to Admin (Front Man) and overview is selected, show Admin Overview
    if (role === 'admin' && activeTab === 'overview') {
      return <AdminOverviewView />;
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'report-waste':
        return <ReportWasteView />;
      case 'contributions':
        return <MyContributionsView />;
      case 'eco-ai':
        return <EcoAiCopilot />;

      // Corporate Impact Arena (CSR)
      case 'csr-hub':
        return <CsrHubView />;
      case 'csr-missions':
        return <CsrMissionsView />;
      case 'csr-projects':
        return <CsrProjectsView />;
      case 'csr-funding':
        return <CsrFundingView />;
      case 'csr-impact':
        return <CsrImpactDashboardView />;
      case 'csr-leaderboard':
        return <CsrLeaderboardView />;
      case 'csr-reports':
        return <CsrReportsView />;

      // Discover, Nearby Map & Rewards
      case 'nearby':
        return <NearbyView />;
      case 'redeem-rewards':
        return <RedeemRewardsView />;
      case 'my-rewards':
        return <MyRewardsView />;
      case 'partner-network':
        return <PartnerNetworkView />;

      // Community Social
      case 'community-feed':
        return <CommunityFeedView />;
      case 'community-groups':
      case 'community-events':
        return <CommunityGroupsView />;
      case 'community-profile':
        return <CommunityProfileView />;

      // Circular Economy
      case 'market':
        return <EcoMarketView />;
      case 'industry-demand':
        return <IndustryDemandView />;
      case 'matching':
        return <MatchingSystemView />;
      case 'reuse-ideas':
        return <BuildFromWasteView />;
      case 'community-projects':
        return <CommunityProjectsView />;

      // EcoFood Surplus Network
      case 'ecofood':
        return <EcoFoodView />;
      case 'ecofood-partner':
        return <EcoFoodPartnerView />;
      case 'ecofood-ngo':
        return <EcoFoodNgoView />;

      // Government & Civic
      case 'government-connect':
        return <GovernmentConnectView />;
      case 'civic-reporting':
        return <CivicReportingView />;

      // Admin Operations
      case 'admin':
        return <AdminSuiteView />;
      case 'admin-overview':
        return <AdminOverviewView />;
      case 'cleanup-operations':
        return <CleanupOperationsView />;
      case 'material-flow':
        return <MaterialFlowView />;
      case 'user-management':
        return <UserManagementView />;

      // Arena & Rewards
      case 'challenges':
        return <ChallengesView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'rewards':
        return <RewardsView />;

      // Campus Intelligence
      case 'campus-monitor':
        return <CampusMonitorView />;
      case 'energy':
        return <EnergyAnalyticsView />;
      case 'water':
        return <WaterAnalyticsView />;
      case 'waste-analytics':
        return <WasteAnalyticsView />;
      case 'impact-dashboard':
        return <ImpactDashboardView />;

      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex min-h-screen relative items-center justify-center bg-[#07080E]">
      <SquidCyberBackground />
      <div className="relative z-10 flex flex-col items-center">
        <span className="inline-block w-12 h-12 border-4 border-[#FF007A] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-[#03E5B7] font-mono tracking-widest text-xl animate-pulse">ROUTING TO PORTAL...</h2>
      </div>
    </div>
  );
}
