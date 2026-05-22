import type { DevelopmentPlan, SocialPlatform } from "@/types/simulator";

export const SOCIAL_PLATFORMS: { key: SocialPlatform; label: string }[] = [
  { key: "youtube", label: "YouTube" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "x", label: "X" },
];

export const SIMULATION_CONFIG = {
  minStudentPrice: 8000,
  maxStudentPrice: 50000,
  studentPriceStep: 1000,
  baseMonthlyFee: 50000,
  perStudentMonthlyFee: 2500,
  followerConversionRate: 0.0003,
  engagementConversionRate: 0.002,
  fanClubConversionRate: 0.05,
  offlineEventConversionRate: 0.15,
  existingStudentMigrationRate: 0.3,
  inquiryConversionRate: 0.2,
  pastBuyerConversionRate: 0.1,
  existingCoachingMultiplier: 1.2,
  conservativeMultiplier: 0.5,
  optimisticMultiplier: 1.5,
  maxBreakEvenStudents: 500,
};

export const DEVELOPMENT_PLANS: DevelopmentPlan[] = [
  {
    id: "no_initial_12",
    name: "初期費用なし・12ヶ月分割",
    initialFee: 0,
    totalDevelopmentFee: 550000,
    monthlyDevelopmentFee: 45833,
    months: 12,
    description:
      "初期費用を抑えて早く始めたい方向け。ただし月額負担はやや高めです。",
  },
  {
    id: "no_initial_24",
    name: "初期費用なし・24ヶ月分割",
    initialFee: 0,
    totalDevelopmentFee: 600000,
    monthlyDevelopmentFee: 25000,
    months: 24,
    description: "月額負担を抑えて開始したい方向けです。",
  },
  {
    id: "initial_100k_12",
    name: "初期費用100,000円・12ヶ月分割",
    initialFee: 100000,
    totalDevelopmentFee: 550000,
    monthlyDevelopmentFee: 37500,
    months: 12,
    description: "初期費用を一部支払い、月額負担を抑えたい方向けです。",
  },
  {
    id: "initial_100k_24",
    name: "初期費用100,000円・24ヶ月分割",
    initialFee: 100000,
    totalDevelopmentFee: 600000,
    monthlyDevelopmentFee: 20833,
    months: 24,
    description: "月額負担を最も抑えたい方向けです。",
  },
];
