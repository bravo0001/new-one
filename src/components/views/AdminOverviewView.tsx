'use client';

import React, { useState } from 'react';
import { useEco } from '../../context/EcoContext';
import {
  Shield,
  Activity,
  Trash2,
  AlertTriangle,
  Recycle,
  Building,
  ShoppingBag,
  Utensils,
  MessageSquare,
  Truck,
  HardHat,
  Search,
} from 'lucide-react';

export const AdminOverviewView: React.FC = () => {
  const {
    role,
    wasteReports,
    civicReports,
    marketItems,
    surplusFoodListings,
    communityProjects,
    socialPosts,
    industryDemands,
    cleanupOperations,
    activityFeed,
    deleteWasteReport,
    deleteCivicReport,
    deleteMarketItem,
    deleteSurplusFoodListing,
    deleteCommunityProject,
    deleteSocialPost,
    deleteIndustryDemand,
    deleteCleanupOperation,
    deleteActivityFeedItem,
    purgeSectionData,
  } = useEco();

  const [activeSection, setActiveSection] = useState<string>('waste-reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmPurgeSection, setConfirmPurgeSection] = useState<string | null>(null);

  const sectionsList = [
    { key: 'waste-reports', label: 'Waste Reports', icon: Recycle, count: wasteReports.length, color: 'text-green-600' },
    { key: 'civic-reports', label: 'Civic Reports', icon: Building, count: civicReports.length, color: 'text-[#f97316]' },
    { key: 'market-items', label: 'EcoMarket Items', icon: ShoppingBag, count: marketItems.length, color: 'text-[#1e3a8a]' },
    { key: 'surplus-food', label: 'Surplus Food', icon: Utensils, count: surplusFoodListings.length, color: 'text-[#FFC700]' },
    { key: 'community-projects', label: 'Guild Projects', icon: HardHat, count: communityProjects.length, color: 'text-[#A855F7]' },
    { key: 'social-posts', label: 'Social Feed Posts', icon: MessageSquare, count: socialPosts.length, color: 'text-[#38BDF8]' },
    { key: 'industry-demands', label: 'Industry Demands', icon: FactoryIcon, count: industryDemands.length, color: 'text-[#F97316]' },
    { key: 'cleanup-ops', label: 'Cleanup Dispatches', icon: Truck, count: cleanupOperations.length, color: 'text-[#EC4899]' },
    { key: 'activity-feed', label: 'Activity Ticker', icon: Activity, count: activityFeed.length, color: 'text-[#10B981]' },
  ];

  function FactoryIcon(props: any) {
    return (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    );
  }

  const handlePurgeConfirmed = () => {
    if (confirmPurgeSection) {
      purgeSectionData(confirmPurgeSection);
      setConfirmPurgeSection(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300 font-sans select-none">
      {/* Title & Front Man Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50 p-6 rounded-2xl border border-[#1e3a8a]/50 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f97316] text-gray-900 text-xs font-bold mb-2 shadow-md">
            <Shield className="w-3.5 h-3.5" />
            <span>◯ △ □ FRONT MAN // APEX ADMIN CONTROL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-wide">
            Master Data Moderation & Purge Center
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Full administrative privilege to view, delete, or purge user-submitted data across all sidebar sections.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-white border border-[#00FF66]/50 text-green-600 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
            <span>Admin Active: Thakre (Debarred 0 Pts)</span>
          </span>
        </div>
      </div>

      {/* Top Enterprise Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-squid-card border border-gray-200 space-y-1">
          <span className="text-[10px] text-gray-500">WASTE REPORTS</span>
          <div className="text-xl font-black text-green-600">{wasteReports.length}</div>
          <div className="text-[9px] text-gray-500">Citizen entries</div>
        </div>

        <div className="p-4 rounded-xl bg-squid-card border border-gray-200 space-y-1">
          <span className="text-[10px] text-gray-500">CIVIC REPORTS</span>
          <div className="text-xl font-black text-[#f97316]">{civicReports.length}</div>
          <div className="text-[9px] text-gray-500">Municipal issues</div>
        </div>

        <div className="p-4 rounded-xl bg-squid-card border border-gray-200 space-y-1">
          <span className="text-[10px] text-gray-500">MARKET ITEMS</span>
          <div className="text-xl font-black text-[#1e3a8a]">{marketItems.length}</div>
          <div className="text-[9px] text-gray-500">Listings</div>
        </div>

        <div className="p-4 rounded-xl bg-squid-card border border-gray-200 space-y-1">
          <span className="text-[10px] text-gray-500">SURPLUS FOOD</span>
          <div className="text-xl font-black text-[#FFC700]">{surplusFoodListings.length}</div>
          <div className="text-[9px] text-gray-500">Donations</div>
        </div>

        <div className="p-4 rounded-xl bg-squid-card border border-gray-200 space-y-1">
          <span className="text-[10px] text-gray-500">GUILD PROJECTS</span>
          <div className="text-xl font-black text-[#A855F7]">{communityProjects.length}</div>
          <div className="text-[9px] text-gray-500">User builds</div>
        </div>

        <div className="p-4 rounded-xl bg-squid-card border border-gray-200 space-y-1">
          <span className="text-[10px] text-gray-500">SOCIAL POSTS</span>
          <div className="text-xl font-black text-[#38BDF8]">{socialPosts.length}</div>
          <div className="text-[9px] text-gray-500">Feed items</div>
        </div>
      </div>

      {/* Main Section Navigation Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {sectionsList.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.key;
            return (
              <button
                key={sec.key}
                onClick={() => setActiveSection(sec.key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#f97316] text-gray-900 shadow-lg  scale-105'
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-[#1e3a8a]/50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gray-900' : sec.color}`} />
                <span>{sec.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-black/30 text-gray-900' : 'bg-[#1D2133] text-gray-500'
                }`}>
                  {sec.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar: Search + Purge Section Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-200">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search in this section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-900 placeholder-slate-600 focus:outline-none focus:border-[#1e3a8a]"
            />
          </div>

          <button
            onClick={() => setConfirmPurgeSection(activeSection)}
            className="w-full sm:w-auto px-4 py-2 bg-red-950/60 hover:bg-red-900 border border-red-500/60 text-red-400 hover:text-gray-900 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>PURGE ALL ITEMS IN THIS SECTION</span>
          </button>
        </div>
      </div>

      {/* SECTION CONTENT LIST */}
      <div className="space-y-4">
        {/* 1. WASTE REPORTS SECTION */}
        {activeSection === 'waste-reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wasteReports
              .filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <div key={item.id} className="bg-squid-card border border-gray-200 rounded-xl p-4 space-y-3 hover:border-gray-300 transition flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans font-bold text-green-600">{item.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f97316]/20 text-[#f97316] border border-[#1e3a8a]/40">
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-500">📍 {item.location} • {item.estimatedQuantityKg} kg</p>
                    <p className="text-[11px] text-gray-500">Reported by: {item.reportedBy} ({item.timestamp})</p>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Points: +{item.pointsAwarded} XP</span>
                    <button
                      onClick={() => deleteWasteReport(item.id)}
                      className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-gray-900 border border-red-500/50 rounded text-xs font-bold transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            {wasteReports.length === 0 && (
              <div className="col-span-2 p-8 text-center bg-squid-card rounded-xl text-gray-500 text-xs">
                No waste reports in database.
              </div>
            )}
          </div>
        )}

        {/* 2. CIVIC REPORTS SECTION */}
        {activeSection === 'civic-reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {civicReports
              .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.location.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <div key={item.id} className="bg-squid-card border border-gray-200 rounded-xl p-4 space-y-3 hover:border-gray-300 transition flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans font-bold text-[#f97316]">{item.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 border border-amber-500/40">
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-500">📍 {item.location} • Category: {item.category}</p>
                    <p className="text-[11px] text-gray-500">Reported Time: {item.reportedTime || 'Recent'}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Authority: {item.authorityTag}</span>
                    <button
                      onClick={() => deleteCivicReport(item.id)}
                      className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-gray-900 border border-red-500/50 rounded text-xs font-bold transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            {civicReports.length === 0 && (
              <div className="col-span-2 p-8 text-center bg-squid-card rounded-xl text-gray-500 text-xs">
                No civic reports found.
              </div>
            )}
          </div>
        )}

        {/* 3. ECOMARKET ITEMS SECTION */}
        {activeSection === 'market-items' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketItems
              .filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.sellerName.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <div key={item.id} className="bg-squid-card border border-gray-200 rounded-xl p-4 space-y-3 hover:border-gray-300 transition flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans font-bold text-[#1e3a8a]">{item.id}</span>
                      <span className="font-bold text-[#FFC700]">₹{item.priceInr}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                    <p className="text-[11px] text-gray-500">Seller: {item.sellerName} • {item.condition}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Qty: {item.quantity}</span>
                    <button
                      onClick={() => deleteMarketItem(item.id)}
                      className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-gray-900 border border-red-500/50 rounded text-xs font-bold transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            {marketItems.length === 0 && (
              <div className="col-span-2 p-8 text-center bg-squid-card rounded-xl text-gray-500 text-xs">
                No marketplace listings.
              </div>
            )}
          </div>
        )}

        {/* 4. SURPLUS FOOD LISTINGS */}
        {activeSection === 'surplus-food' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {surplusFoodListings
              .filter((f) => f.foodName.toLowerCase().includes(searchQuery.toLowerCase()) || f.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <div key={item.id} className="bg-squid-card border border-gray-200 rounded-xl p-4 space-y-3 hover:border-gray-300 transition flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans font-bold text-[#FFC700]">{item.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">{item.foodName}</h3>
                    <p className="text-xs text-gray-500">📍 {item.location} • {item.availableServings} Servings ({item.quantityLabel})</p>
                    <p className="text-[11px] text-gray-500">Partner: {item.restaurantName} • Pickup: {item.pickupWindow}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Price: ₹{item.discountedPriceInr}</span>
                    <button
                      onClick={() => deleteSurplusFoodListing(item.id)}
                      className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-gray-900 border border-red-500/50 rounded text-xs font-bold transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            {surplusFoodListings.length === 0 && (
              <div className="col-span-2 p-8 text-center bg-squid-card rounded-xl text-gray-500 text-xs">
                No surplus food listings.
              </div>
            )}
          </div>
        )}

        {/* 5. COMMUNITY PROJECTS SECTION */}
        {activeSection === 'community-projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityProjects
              .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.creatorName.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <div key={item.id} className="bg-squid-card border border-gray-200 rounded-xl p-4 space-y-3 hover:border-gray-300 transition flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans font-bold text-[#A855F7]">{item.id}</span>
                      <span className="text-[10px] font-bold text-gray-500">{item.studentsJoined} members</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                    <p className="text-[11px] text-gray-500">Creator: {item.creatorName} • Target: {item.materialsTarget} {item.materialsUnit}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400">Progress: {item.progressPercentage}%</span>
                    <button
                      onClick={() => deleteCommunityProject(item.id)}
                      className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-gray-900 border border-red-500/50 rounded text-xs font-bold transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            {communityProjects.length === 0 && (
              <div className="col-span-2 p-8 text-center bg-squid-card rounded-xl text-gray-500 text-xs">
                No community projects.
              </div>
            )}
          </div>
        )}

        {/* 6. SOCIAL FEED POSTS */}
        {activeSection === 'social-posts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialPosts
              .filter((p) => p.content.toLowerCase().includes(searchQuery.toLowerCase()) || p.authorName.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <div key={item.id} className="bg-squid-card border border-gray-200 rounded-xl p-4 space-y-3 hover:border-gray-300 transition flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans font-bold text-[#38BDF8]">{item.authorName}</span>
                      <span className="text-[10px] text-gray-500">{item.locationTag}</span>
                    </div>
                    <p className="text-xs text-gray-900 leading-relaxed">{item.content}</p>
                    <div className="text-[10px] text-gray-500">❤️ {item.likesCount} Likes • 💬 {item.comments?.length || 0} Comments</div>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-end">
                    <button
                      onClick={() => deleteSocialPost(item.id)}
                      className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-gray-900 border border-red-500/50 rounded text-xs font-bold transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete Post</span>
                    </button>
                  </div>
                </div>
              ))}
            {socialPosts.length === 0 && (
              <div className="col-span-2 p-8 text-center bg-squid-card rounded-xl text-gray-500 text-xs">
                No social feed posts.
              </div>
            )}
          </div>
        )}

        {/* 7. INDUSTRY DEMANDS SECTION */}
        {activeSection === 'industry-demands' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {industryDemands
              .filter((d) => d.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || d.materialNeeded.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <div key={item.id} className="bg-squid-card border border-gray-200 rounded-xl p-4 space-y-3 hover:border-gray-300 transition flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans font-bold text-[#F97316]">{item.id}</span>
                      <span className="font-bold text-green-600">₹{item.offerPricePerKgInr}/kg</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">{item.companyName}</h3>
                    <p className="text-xs text-gray-500">Material: {item.materialNeeded} • Required: {item.requiredQuantity}</p>
                    <p className="text-[11px] text-gray-500">📍 {item.location}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Remaining: {item.remainingQuantityKg} kg</span>
                    <button
                      onClick={() => deleteIndustryDemand(item.id)}
                      className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-gray-900 border border-red-500/50 rounded text-xs font-bold transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            {industryDemands.length === 0 && (
              <div className="col-span-2 p-8 text-center bg-squid-card rounded-xl text-gray-500 text-xs">
                No industry demands.
              </div>
            )}
          </div>
        )}

        {/* 8. CLEANUP OPS */}
        {activeSection === 'cleanup-ops' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cleanupOperations.map((item) => (
              <div key={item.id} className="bg-squid-card border border-gray-200 rounded-xl p-4 space-y-3 hover:border-gray-300 transition flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-sans font-bold text-[#EC4899]">{item.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EC4899]/20 text-[#EC4899]">
                      {item.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">Location: {item.location}</h3>
                  <p className="text-xs text-gray-500">Team: {item.assignedTeam} • Priority: {item.priority}</p>
                  <p className="text-[11px] text-gray-500">Est. Waste: {item.estimatedWasteKg} kg</p>
                </div>

                <div className="pt-2 border-t border-gray-200 flex items-center justify-end">
                  <button
                    onClick={() => deleteCleanupOperation(item.id)}
                    className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-gray-900 border border-red-500/50 rounded text-xs font-bold transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 9. ACTIVITY FEED */}
        {activeSection === 'activity-feed' && (
          <div className="space-y-3">
            {activityFeed.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex justify-between items-center text-xs hover:border-[#1e3a8a]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-500 w-16 flex-shrink-0">
                    {item.timestamp}
                  </span>
                  <span className="text-gray-700">
                    <strong className="text-gray-900 font-bold">{item.userOrOrg}</strong> {item.actionText}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.statusBadge && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#f97316]/15 text-[#f97316] border border-[#1e3a8a]/30">
                      {item.statusBadge}
                    </span>
                  )}
                  <button
                    onClick={() => deleteActivityFeedItem(item.id)}
                    className="p-1 text-gray-500 hover:text-red-400 transition"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONFIRMATION PURGE MODAL */}
      {confirmPurgeSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white border border-red-500/60 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-sm">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-black text-base text-gray-900">CONFIRM SECTION-WIDE DATA PURGE</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to delete all user-submitted entries in <strong className="text-gray-900 font-bold">{confirmPurgeSection.toUpperCase()}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmPurgeSection(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-600 rounded-lg text-xs font-bold transition"
              >
                CANCEL
              </button>
              <button
                onClick={handlePurgeConfirmed}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-gray-900 rounded-lg text-xs font-bold transition shadow-lg flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>CONFIRM PURGE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

