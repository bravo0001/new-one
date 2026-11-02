import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  initialUserProfile,
  initialWasteReports,
  initialMarketItems,
  initialIndustryDemands,
  initialBuildIdeas,
  initialCommunityProjects,
  initialChallenges,
  initialRewardItems,
  initialLeaderboard,
  initialCampusTelemetry,
  initialAiAlerts,
  initialSurplusFoodListings,
  initialNgoRequests,
  initialCivicReports,
  initialGovernmentPrograms,
  initialCleanupOperations,
  initialBusinessPartners,
  initialActivityFeed,
  initialNearbyPartners,
  initialRedeemedVouchers,
  initialSocialPosts,
  initialEcoClubGroups,
  initialEcoEvents,
  initialCsrCompanies,
  initialCsrMissions,
  initialCsrProjects,
  initialCsrReports,
} from '../data/mockData';

export interface DatabaseSchema {
  users: any[];
  wasteReports: any[];
  civicReports: any[];
  marketItems: any[];
  industryDemands: any[];
  buildIdeas: any[];
  communityProjects: any[];
  challenges: any[];
  rewards: any[];
  leaderboard: any[];
  telemetry: any;
  alerts: any[];
  surplusFoodListings: any[];
  ngoRequests: any[];
  governmentPrograms: any[];
  cleanupOperations: any[];
  businessPartners: any[];
  activityFeed: any[];
  nearbyPartners: any[];
  redeemedVouchers: any[];
  socialPosts: any[];
  ecoClubGroups: any[];
  ecoEvents: any[];
  csrCompanies: any[];
  csrMissions: any[];
  csrProjects: any[];
  csrReports: any[];
  meta: {
    initializedAt: string;
    lastUpdated: string;
    version: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'ecoverse_db.json');
const TMP_FILE = path.join(DATA_DIR, 'ecoverse_db.tmp.json');

// In-memory cache for ultra-fast access
let memoryDb: DatabaseSchema | null = null;
let lastMtime: number = 0;

function hashPasswordSimple(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 32).toString('hex');
}

function createDefaultUsers(): any[] {
  const users = [
    {
      id: 'usr-admin-1',
      name: 'Organization Admin',
      email: 'admin@ecoverse.gov',
      playerNumber: '#001',
      role: 'admin',
      ecoPoints: 12500,
      sustainabilityScore: 98,
      wasteRecoveredKg: 8500,
      co2SavedKg: 6400,
      communityContributions: 120,
      followersCount: 456,
      followingCount: 12,
      level: 'Organization Admin (Host)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      passwordPlain: 'admin123',
    },
    {
      id: 'usr-student-1',
      name: initialUserProfile.name || 'AARAV SHARMA',
      email: 'student@campus.edu',
      playerNumber: initialUserProfile.playerNumber || '#456',
      role: 'student',
      ecoPoints: initialUserProfile.ecoPoints || 480,
      sustainabilityScore: initialUserProfile.sustainabilityScore || 82,
      wasteRecoveredKg: initialUserProfile.wasteRecoveredKg || 142.5,
      co2SavedKg: initialUserProfile.co2SavedKg || 95.8,
      communityContributions: initialUserProfile.communityContributions || 14,
      followersCount: initialUserProfile.followersCount || 28,
      followingCount: initialUserProfile.followingCount || 15,
      level: initialUserProfile.level || 'Eco Vanguard (Tier 3)',
      avatar: initialUserProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      passwordPlain: 'student123',
    },
    {
      id: 'usr-business-1',
      name: 'Green Cafe Partner',
      email: 'partner@greencafe.com',
      playerNumber: '#102',
      role: 'business',
      ecoPoints: 1200,
      sustainabilityScore: 90,
      wasteRecoveredKg: 450,
      co2SavedKg: 310,
      communityContributions: 35,
      followersCount: 92,
      followingCount: 8,
      level: 'Eco Champion (Tier 4)',
      avatar: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=200',
      passwordPlain: 'partner123',
    },
    {
      id: 'usr-ngo-1',
      name: 'Robin Hood Food NGO',
      email: 'contact@foodrescue.ngo',
      playerNumber: '#204',
      role: 'ngo',
      ecoPoints: 3400,
      sustainabilityScore: 94,
      wasteRecoveredKg: 1200,
      co2SavedKg: 890,
      communityContributions: 88,
      followersCount: 310,
      followingCount: 22,
      level: 'Grandmaster Guardian (Tier 5)',
      avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=200',
      passwordPlain: 'ngo123',
    },
    {
      id: 'usr-corp-1',
      name: 'TechCorp India ESG',
      email: 'esg@techcorp.com',
      playerNumber: '#789',
      role: 'corporate',
      ecoPoints: 50000,
      sustainabilityScore: 99,
      wasteRecoveredKg: 25000,
      co2SavedKg: 18000,
      communityContributions: 240,
      followersCount: 890,
      followingCount: 45,
      level: 'Grandmaster Guardian (Tier 5)',
      avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200',
      passwordPlain: 'corp123',
    },
  ];

  return users.map((u) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPasswordSimple(u.passwordPlain, salt);
    const { passwordPlain, ...userWithoutPass } = u;
    return {
      ...userWithoutPass,
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString(),
    };
  });
}

function createInitialDatabase(): DatabaseSchema {
  return {
    users: createDefaultUsers(),
    wasteReports: JSON.parse(JSON.stringify(initialWasteReports)),
    civicReports: JSON.parse(JSON.stringify(initialCivicReports)),
    marketItems: JSON.parse(JSON.stringify(initialMarketItems)),
    industryDemands: JSON.parse(JSON.stringify(initialIndustryDemands)),
    buildIdeas: JSON.parse(JSON.stringify(initialBuildIdeas)),
    communityProjects: JSON.parse(JSON.stringify(initialCommunityProjects)),
    challenges: JSON.parse(JSON.stringify(initialChallenges)),
    rewards: JSON.parse(JSON.stringify(initialRewardItems)),
    leaderboard: JSON.parse(JSON.stringify(initialLeaderboard)),
    telemetry: JSON.parse(JSON.stringify(initialCampusTelemetry)),
    alerts: JSON.parse(JSON.stringify(initialAiAlerts)),
    surplusFoodListings: JSON.parse(JSON.stringify(initialSurplusFoodListings)),
    ngoRequests: JSON.parse(JSON.stringify(initialNgoRequests)),
    governmentPrograms: JSON.parse(JSON.stringify(initialGovernmentPrograms)),
    cleanupOperations: JSON.parse(JSON.stringify(initialCleanupOperations)),
    businessPartners: JSON.parse(JSON.stringify(initialBusinessPartners)),
    activityFeed: JSON.parse(JSON.stringify(initialActivityFeed)),
    nearbyPartners: JSON.parse(JSON.stringify(initialNearbyPartners)),
    redeemedVouchers: JSON.parse(JSON.stringify(initialRedeemedVouchers)),
    socialPosts: JSON.parse(JSON.stringify(initialSocialPosts)),
    ecoClubGroups: JSON.parse(JSON.stringify(initialEcoClubGroups)),
    ecoEvents: JSON.parse(JSON.stringify(initialEcoEvents)),
    csrCompanies: JSON.parse(JSON.stringify(initialCsrCompanies)),
    csrMissions: JSON.parse(JSON.stringify(initialCsrMissions)),
    csrProjects: JSON.parse(JSON.stringify(initialCsrProjects)),
    csrReports: JSON.parse(JSON.stringify(initialCsrReports)),
    meta: {
      initializedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
    },
  };
}

class DatabaseEngine {
  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  public getDb(): DatabaseSchema {
    this.ensureDirectory();

    if (!fs.existsSync(DB_FILE)) {
      const initial = createInitialDatabase();
      this.writeDb(initial);
      memoryDb = initial;
      return memoryDb;
    }

    try {
      const stat = fs.statSync(DB_FILE);
      if (!memoryDb || stat.mtimeMs > lastMtime) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        memoryDb = JSON.parse(content);
        lastMtime = stat.mtimeMs;
      }
      return memoryDb!;
    } catch (err) {
      console.error('Error reading database file, using memory or recreating:', err);
      if (!memoryDb) {
        memoryDb = createInitialDatabase();
        this.writeDb(memoryDb);
      }
      return memoryDb;
    }
  }

  public writeDb(dbData: DatabaseSchema) {
    this.ensureDirectory();
    dbData.meta.lastUpdated = new Date().toISOString();
    memoryDb = dbData;
    try {
      const jsonStr = JSON.stringify(dbData, null, 2);
      fs.writeFileSync(TMP_FILE, jsonStr, 'utf-8');
      fs.renameSync(TMP_FILE, DB_FILE);
      const stat = fs.statSync(DB_FILE);
      lastMtime = stat.mtimeMs;
    } catch (err) {
      console.error('Error writing database to disk:', err);
    }
  }

  public getCollection<K extends keyof Omit<DatabaseSchema, 'meta' | 'telemetry'>>(
    collectionName: K
  ): DatabaseSchema[K] {
    const data = this.getDb();
    if (!data[collectionName]) {
      (data as any)[collectionName] = [];
    }
    return data[collectionName];
  }

  public getItemById<K extends keyof Omit<DatabaseSchema, 'meta' | 'telemetry'>>(
    collectionName: K,
    id: string
  ): any | null {
    const items = this.getCollection(collectionName) as any[];
    return items.find((item) => item.id === id || item._id === id) || null;
  }

  public insertItem<K extends keyof Omit<DatabaseSchema, 'meta' | 'telemetry'>>(
    collectionName: K,
    item: any
  ): any {
    const data = this.getDb();
    if (!data[collectionName]) {
      (data as any)[collectionName] = [];
    }
    const collection = data[collectionName] as any[];

    if (!item.id) {
      item.id = `${String(collectionName).slice(0, 3).toUpperCase()}-${Date.now()}`;
    }

    collection.unshift(item);
    this.writeDb(data);
    return item;
  }

  public updateItem<K extends keyof Omit<DatabaseSchema, 'meta' | 'telemetry'>>(
    collectionName: K,
    id: string,
    updates: Partial<any>
  ): any | null {
    const data = this.getDb();
    const collection = (data[collectionName] as any[]) || [];
    const index = collection.findIndex((item) => item.id === id || item._id === id);

    if (index === -1) return null;

    collection[index] = { ...collection[index], ...updates };
    this.writeDb(data);
    return collection[index];
  }

  public deleteItem<K extends keyof Omit<DatabaseSchema, 'meta' | 'telemetry'>>(
    collectionName: K,
    id: string
  ): boolean {
    const data = this.getDb();
    const collection = (data[collectionName] as any[]) || [];
    const initialLen = collection.length;
    const filtered = collection.filter((item) => item.id !== id && item._id !== id);

    if (filtered.length !== initialLen) {
      (data as any)[collectionName] = filtered;
      this.writeDb(data);
      return true;
    }
    return false;
  }

  public purgeCollection<K extends keyof Omit<DatabaseSchema, 'meta' | 'telemetry'>>(
    collectionName: K
  ): void {
    const data = this.getDb();
    (data as any)[collectionName] = [];
    this.writeDb(data);
  }

  public resetDatabase(): DatabaseSchema {
    const initial = createInitialDatabase();
    this.writeDb(initial);
    return initial;
  }
}

export const db = new DatabaseEngine();

