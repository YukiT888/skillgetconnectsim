export type BusinessStatus = "already_coaching" | "starting_new";

export type SocialPlatform = "youtube" | "instagram" | "tiktok" | "x";

export type SocialUrl = {
  platform: SocialPlatform;
  url: string;
};

export type SocialMetrics = {
  followers: number | "";
  likes: number | "";
  saves: number | "";
  savesUnknown: boolean;
  comments: number | "";
};

export type DevelopmentPlan = {
  id: string;
  name: string;
  initialFee: number;
  totalDevelopmentFee: number;
  monthlyDevelopmentFee: number;
  months: number;
  description: string;
};

export type SimulationInput = {
  businessStatus: BusinessStatus | null;
  currentMonthlyPrice?: number | "";
  currentStudents?: number | "";
  monthlyInquiries?: number | "";
  hasSoldPaidProduct?: boolean;
  pastProductMaxPrice?: number | "";
  pastProductBuyers?: number | "";
  socialUrls: Record<SocialPlatform, string>;
  socialMetrics: Partial<Record<SocialPlatform, SocialMetrics>>;
  hasFanClub: boolean;
  fanClubMembers?: number | "";
  hasOfflineEvent: boolean;
  offlineEventParticipants?: number | "";
  studentPrice: number;
  developmentPlanId: string;
};

export type StudentEstimate = {
  conservative: number;
  standard: number;
  optimistic: number;
};

export type FinancialResult = {
  students: number;
  revenue: number;
  baseFee: number;
  perStudentFee: number;
  developmentFee: number;
  royalty: number;
  totalCost: number;
  profit: number;
  profitable: boolean;
};

export type ContactInput = {
  name: string;
  email: string;
  phoneOrLine: string;
  activityName: string;
  primarySnsUrl: string;
  message: string;
};

export type SimulationFactors = {
  effectiveFollowers: number;
  engagementScore: number;
  snsStudents: number;
  communityStudents: number;
  existingStudentMigration: number;
  inquiryStudents: number;
  pastBuyerStudents: number;
};
