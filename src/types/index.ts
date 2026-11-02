export type UserRole = 'student' | 'admin' | 'business' | 'ngo' | 'corporate';

export type MainTab =
  // Main & Discover
  | 'overview'
  | 'report-waste'
  | 'contributions'
  | 'eco-ai'
  // Nearby & Rewards
  | 'nearby'
  | 'redeem-rewards'
  | 'my-rewards'
  | 'partner-network'
  // Community Social
  | 'community-feed'
  | 'community-groups'
  | 'community-events'
  | 'community-profile'
  // Circular Economy
  | 'market'
  | 'industry-demand'
  | 'matching'
  | 'reuse-ideas'
  | 'community-projects'
  // EcoFood Surplus Network
  | 'ecofood'
  | 'ecofood-partner'
  | 'ecofood-ngo'
  | 'ecofood-analytics'
  // Government & Civic
  | 'government-connect'
  | 'civic-reporting'
  | 'government-impact'
  // Community Arena
  | 'challenges'
  | 'leaderboard'
  | 'rewards'
  // Campus Intelligence & Admin
  | 'campus-monitor'
  | 'energy'
  | 'water'
  | 'waste-analytics'
  // Admin Operations
  | 'admin'
  | 'admin-overview'
  | 'cleanup-operations'
  | 'material-flow'
  | 'user-management'
  // Impact
  | 'impact-dashboard'
  // Corporate Impact Arena (CSR)
  | 'csr-hub'
  | 'csr-missions'
  | 'csr-projects'
  | 'csr-funding'
  | 'csr-impact'
  | 'csr-leaderboard'
  | 'csr-reports';

export interface UserProfile {
  name: string;
  playerNumber: string;
  role?: UserRole;
  sustainabilityScore: number;
  scoreChangeMonth: number;
  co2SavedKg: number;
  co2GoalKg: number;
  wasteRecoveredKg: number;
  wasteGoalKg: number;
  communityContributions: number;
  ecoPoints: number;
  level: string;
  avatar: string;
  rank: number;
  followingCount: number;
  followersCount: number;
  isFollowing?: boolean;
}

export interface WasteReport {
  id: string;
  title: string;
  location: string;
  detectedMaterials: string[];
  estimatedQuantityKg: number;
  severity: 'Low' | 'Medium' | 'High';
  recyclablePercentage: number;
  status: 'Reported' | 'AI Verified' | 'Assigned' | 'Cleaned' | 'Rejected';
  reportedBy: string;
  timestamp: string;
  pointsAwarded: number;
  imageUrl: string;
  nearestCollectionPoint: string;
  distanceMeters: number;
}

export interface MarketItem {
  id: string;
  title: string;
  category: 'E-Waste' | 'Plastic' | 'Metal' | 'Paper' | 'Electronics' | 'Furniture' | 'Reusable Items';
  quantity: string;
  priceInr: number;
  pointsCost?: number;
  description?: string;
  location: string;
  sellerName: string;
  sellerAvatar: string;
  condition: 'Good' | 'Fair' | 'Like New' | 'Raw Waste';
  imageUrl: string;
  pickupAvailable: boolean;
  postedTime: string;
}

export interface IndustryDemand {
  id: string;
  companyName: string;
  logo: string;
  materialNeeded: string;
  requiredQuantity: string;
  remainingQuantityKg: number;
  offerPricePerKgInr: number;
  location: string;
  pickupAvailable: boolean;
  matchScore: number;
  urgency: 'High' | 'Medium' | 'Normal';
}

export interface BuildIdea {
  id: string;
  wasteSource: string;
  title: string;
  description: string;
  imageUrl: string;
  materialsRequired: string[];
  estimatedCostInr: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  environmentalImpact: string;
  peopleRequired: number;
  steps: string[];
}

export interface CommunityProject {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatar: string;
  description: string;
  progressPercentage: number;
  materialsTarget: number;
  materialsCurrent: number;
  materialsUnit: string;
  studentsJoined: number;
  reusedImpactLabel: string;
  materialsList: string[];
  recentActivity: { user: string; action: string; time: string }[];
}

export interface DailyMission {
  id: string;
  type: 'waste-report' | 'recycle' | 'cleanup' | 'surplus-food' | 'civic' | 'social' | 'community-project';
  text: string;
  xp: number;
  points: number;
  done: boolean;
  targetTab?: MainTab;
  dateKey: string;
}

export interface EcoChallenge {
  id: string;
  title: string;
  subtitle: string;
  prizePoolInr: number;
  durationDays: number;
  goalLabel: string;
  targetKg: number;
  currentKg: number;
  participantsCount: number;
  co2AvoidedTonnes: number;
  topTeams: { rank: number; teamName: string; weightKg: number }[];
  isJoined?: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  category: 'Voucher' | 'Food' | 'Merch' | 'Bonus' | 'Cafés' | 'Restaurants' | 'Shops' | 'Bookstores' | 'Entertainment' | 'Mobility' | 'Sustainable Products';
  icon: string;
  description: string;
  businessName?: string;
  distanceMeters?: number;
  discountInr?: number;
  redeemed?: boolean;
}

export interface LeaderboardUser {
  rank: number;
  playerNumber: string;
  name: string;
  avatar: string;
  points: number;
  score: number;
  wasteRecoveredKg: number;
  co2SavedKg: number;
  badge?: string;
  category?: 'Student' | 'Volunteer' | 'Organization' | 'Business' | 'NGO' | 'Administrator';
}

export interface CampusTelemetry {
  energy: {
    changeMonth: number;
    anomalyDetected: boolean;
    dailyData: { day: string; blockA: number; blockB: number; hostel3: number; canteen: number }[];
    buildingUsage: { name: string; currentKw: number; status: 'Normal' | 'High' | 'Critical' }[];
  };
  water: {
    changeMonth: number;
    leakageDetected: boolean;
    dailyData: { day: string; hostel1: number; hostel2: number; hostel3: number; canteen: number }[];
    locations: { name: string; status: '🟢 Normal' | '🟡 Attention' | '🔴 Leakage'; details: string }[];
  };
  waste: {
    totalKg: number;
    recycledKg: number;
    reusedKg: number;
    landfillKg: number;
    composition: { name: string; percentage: number; color: string }[];
    dailyData: { day: string; total: number; recycled: number; reused: number }[];
  };
}

export interface AIAlert {
  id: string;
  title: string;
  type: 'Energy' | 'Water' | 'Waste';
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  recommendation: string;
  estimatedSavings: string;
  timestamp?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  options?: { label: string; actionText: string }[];
}

export interface SurplusFoodListing {
  id: string;
  restaurantName: string;
  restaurantLogo: string;
  foodName: string;
  category: 'Meals' | 'Bakery' | 'Groceries' | 'Restaurants' | 'Cafés';
  quantityLabel: string;
  originalPriceInr: number;
  discountedPriceInr: number;
  discountPercentage: number;
  pickupWindow: string;
  availableServings: number;
  location: string;
  status: 'Available' | 'Reserved' | 'Donated' | 'Pending Review';
  bestBeforeInfo: string;
  imageUrl: string;
}

export interface NGORequest {
  id: string;
  ngoName: string;
  ngoLogo: string;
  needsDescription: string;
  quantityNeeded: string;
  pickupStatus: string;
  distanceKm: number;
  matchScore: number;
}

export interface CivicReport {
  id: string;
  title: string;
  category: 'Illegal Dumping' | 'Water Leakage' | 'Garbage Accumulation' | 'Polluted Water' | 'Plastic Waste';
  location: string;
  severity: 'High' | 'Medium' | 'Low';
  confirmationsCount: number;
  status: 'Reported' | 'Assigned' | 'Resolved';
  authorityTag: string;
  reportedTime: string;
  imageUrl: string;
}

export interface GovernmentProgram {
  id: string;
  organization: string;
  programName: string;
  coverage: string;
  ecoverseAlignment: string;
  status: string;
  portalUrl: string;
}

export interface CleanupOperation {
  id: string;
  location: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedWasteKg: number;
  assignedTeam: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed';
}

export interface BusinessPartner {
  id: string;
  businessName: string;
  category: string;
  location: string;
  foodRescuedKg: number;
  mealsDonated: number;
  ecoScore: number;
  badges: string[];
  status: string;
  logo: string;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  userOrOrg: string;
  actionText: string;
  statusBadge?: string;
  type: 'waste' | 'food' | 'ngo' | 'industry' | 'project';
}

// --- NEW NEARBY MAP, REWARDS & SOCIAL TYPES ---

export interface NearbyPartner {
  id: string;
  name: string;
  category: 'Cafés' | 'Restaurants' | 'Shops' | 'Recycling' | 'NGOs' | 'Rewards' | 'Food Rescue';
  logo: string;
  x: number; // Map X%
  y: number; // Map Y%
  lat: number; // Real GPS Latitude
  lng: number; // Real GPS Longitude
  distanceMeters: number;
  rating: number;
  address: string;
  isOpen: boolean;
  isEcoPartner: boolean;
  acceptsEcoPoints: boolean;
  badges: string[];
  rewardsOffer: string;
  pointsCost: number;
  discountInr: number;
  foodRescueAvailable: boolean;
  surplusMealsCount?: number;
  surplusPriceInr?: number;
  imageUrl: string;
}

export interface RedeemedVoucher {
  id: string;
  voucherCode: string;
  businessName: string;
  businessLogo: string;
  rewardTitle: string;
  discountInr: number;
  pointsCost: number;
  redeemedDate: string;
  expiryDate: string;
  status: 'Active' | 'Used' | 'Expired';
  qrCodePlaceholder: string;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface SocialPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge: string;
  postType: 'Photo' | 'Contribution' | 'Achievement' | 'Idea' | 'Project' | 'Local Issue' | 'Food Rescue';
  timestamp: string;
  locationTag: string;
  content: string;
  imageUrl?: string;
  impactBadge?: string;
  pointsEarned?: number;
  likesCount: number;
  isLiked?: boolean;
  comments: PostComment[];
  sharesCount: number;
  partnerLink?: { partnerId: string; partnerName: string };
}

export interface EcoClubGroup {
  id: string;
  name: string;
  membersCount: number;
  topics: string[];
  logo: string;
  isJoined?: boolean;
  description: string;
}

export interface EcoEvent {
  id: string;
  title: string;
  dateTime: string;
  location: string;
  attendingCount: number;
  goalLabel: string;
  isJoined?: boolean;
  imageUrl: string;
}

export interface CsrCompany {
  id: string;
  name: string;
  logo: string;
  csrBudgetInr: number;
  allocatedInr: number;
  remainingInr: number;
  activeProjects: number;
  completedProjects: number;
  impactScore: number;
  rank: number;
  rankShift: number;
  badges: string[];
}

export interface CsrMission {
  id: string;
  title: string;
  subtitle: string;
  sponsorName: string;
  sponsorLogo: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC' | 'LEGENDARY';
  targetKg: number;
  currentKg: number;
  timeRemaining: string;
  playersCount: number;
  campusesCount: number;
  ngoPartnersCount: number;
  prizePoolInr: number;
  xpReward: number;
  ecoPointsReward: number;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  isJoined?: boolean;
}

export interface CsrProject {
  id: string;
  title: string;
  location: string;
  category: string;
  goalKg: number;
  fundingRequiredInr: number;
  fundingCurrentInr: number;
  ngoOperatorName: string;
  ngoVerified: boolean;
  participantsCount: number;
  expectedImpact: string;
  budgetBreakdown: { category: string; amountInr: number }[];
  status: 'PENDING' | 'APPROVED' | 'FUNDED' | 'ACTIVE' | 'COMPLETED' | 'VERIFIED';
}

export interface CsrReport {
  id: string;
  companyName: string;
  projectTitle: string;
  investmentInr: number;
  wasteRecoveredKg: number;
  participantsCount: number;
  campusesCount: number;
  partnersCount: number;
  missionsCompleted: number;
  impactScore: number;
  statusPercentage: number;
  generatedDate: string;
}

export interface UserActivityLogItem {
  id: string;
  title: string;
  location: string;
  type: 'Waste Reports' | 'Recycling' | 'Cleanup' | 'Projects' | 'Challenges';
  details: string;
  status: string;
  points: number;
  timestamp: string;
  badge: string;
  imageUrl?: string;
  icon: string;
}



export interface UserLocationState {
  lat: number;
  lng: number;
  cityName: string;
  areaName: string;
  fullAddress: string;
  isRealGps: boolean;
  accuracy?: number;
}
