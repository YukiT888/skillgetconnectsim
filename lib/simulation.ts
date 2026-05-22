import { DEVELOPMENT_PLANS, SIMULATION_CONFIG } from "@/config/simulationConfig";
import type {
  DevelopmentPlan,
  FinancialResult,
  SimulationFactors,
  SimulationInput,
  SocialMetrics,
  StudentEstimate,
} from "@/types/simulator";

function asNumber(value: number | "" | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function getDevelopmentPlan(planId: string): DevelopmentPlan {
  return (
    DEVELOPMENT_PLANS.find((plan) => plan.id === planId) ?? DEVELOPMENT_PLANS[0]
  );
}

export function getActiveMetrics(input: SimulationInput): SocialMetrics[] {
  return Object.entries(input.socialUrls)
    .filter(([, url]) => url.trim().length > 0)
    .map(([platform]) => input.socialMetrics[platform as keyof typeof input.socialMetrics])
    .filter((metrics): metrics is SocialMetrics => Boolean(metrics));
}

export function calculateEffectiveFollowers(input: SimulationInput): number {
  const metrics = getActiveMetrics(input);
  const totalFollowers = metrics.reduce(
    (sum, item) => sum + asNumber(item.followers),
    0,
  );
  const activeCount = metrics.length;
  const overlapMultiplier =
    activeCount <= 1 ? 1 : activeCount === 2 ? 0.8 : activeCount === 3 ? 0.7 : 0.6;

  return totalFollowers * overlapMultiplier;
}

export function calculateEngagementScore(input: SimulationInput): number {
  return getActiveMetrics(input).reduce((sum, item) => {
    const saves = item.savesUnknown ? 0 : asNumber(item.saves);
    return sum + asNumber(item.likes) + saves * 3 + asNumber(item.comments) * 5;
  }, 0);
}

export function calculateEstimatedStudents(input: SimulationInput): {
  standardRaw: number;
  factors: SimulationFactors;
} {
  const effectiveFollowers = calculateEffectiveFollowers(input);
  const engagementScore = calculateEngagementScore(input);
  const snsStudents =
    effectiveFollowers * SIMULATION_CONFIG.followerConversionRate +
    engagementScore * SIMULATION_CONFIG.engagementConversionRate;
  const communityStudents =
    asNumber(input.fanClubMembers) * SIMULATION_CONFIG.fanClubConversionRate +
    asNumber(input.offlineEventParticipants) *
      SIMULATION_CONFIG.offlineEventConversionRate;
  const existingStudentMigration =
    asNumber(input.currentStudents) * SIMULATION_CONFIG.existingStudentMigrationRate;
  const inquiryStudents =
    asNumber(input.monthlyInquiries) * SIMULATION_CONFIG.inquiryConversionRate;
  const pastBuyerStudents =
    asNumber(input.pastProductBuyers) * SIMULATION_CONFIG.pastBuyerConversionRate;

  let standardRaw =
    snsStudents +
    communityStudents +
    existingStudentMigration +
    inquiryStudents +
    pastBuyerStudents;

  if (input.businessStatus === "already_coaching") {
    standardRaw *= SIMULATION_CONFIG.existingCoachingMultiplier;
  }

  return {
    standardRaw,
    factors: {
      effectiveFollowers,
      engagementScore,
      snsStudents,
      communityStudents,
      existingStudentMigration,
      inquiryStudents,
      pastBuyerStudents,
    },
  };
}

function floorStudent(value: number): number {
  if (value > 0 && value < 1) return 1;
  return Math.floor(value);
}

export function calculateScenarioStudents(input: SimulationInput): StudentEstimate {
  const { standardRaw } = calculateEstimatedStudents(input);
  return {
    conservative: floorStudent(standardRaw * SIMULATION_CONFIG.conservativeMultiplier),
    standard: floorStudent(standardRaw),
    optimistic: floorStudent(standardRaw * SIMULATION_CONFIG.optimisticMultiplier),
  };
}

export function calculateRoyalty(revenue: number): number {
  if (revenue <= 200000) return Math.floor(revenue * 0.3);
  if (revenue <= 400000) {
    return Math.floor(200000 * 0.3 + (revenue - 200000) * 0.4);
  }
  return Math.floor(200000 * 0.3 + 200000 * 0.4 + (revenue - 400000) * 0.5);
}

export function calculateRevenue(students: number, studentPrice: number): number {
  return students * studentPrice;
}

export function calculateMonthlyCost(
  students: number,
  revenue: number,
  plan: DevelopmentPlan,
): Omit<FinancialResult, "students" | "revenue" | "profit" | "profitable"> {
  const baseFee = SIMULATION_CONFIG.baseMonthlyFee;
  const perStudentFee = students * SIMULATION_CONFIG.perStudentMonthlyFee;
  const developmentFee = plan.monthlyDevelopmentFee;
  const royalty = calculateRoyalty(revenue);
  const totalCost = baseFee + perStudentFee + developmentFee + royalty;

  return { baseFee, perStudentFee, developmentFee, royalty, totalCost };
}

export function calculateProfit(revenue: number, totalCost: number): number {
  return revenue - totalCost;
}

export function isProfitable(profit: number): boolean {
  return profit >= 0;
}

export function calculateFinancialResult(
  students: number,
  studentPrice: number,
  planId: string,
): FinancialResult {
  const plan = getDevelopmentPlan(planId);
  const revenue = calculateRevenue(students, studentPrice);
  const cost = calculateMonthlyCost(students, revenue, plan);
  const profit = calculateProfit(revenue, cost.totalCost);

  return {
    students,
    revenue,
    ...cost,
    profit,
    profitable: isProfitable(profit),
  };
}

export function calculateBreakEvenStudents(
  studentPrice: number,
  planId: string,
): number | null {
  for (let students = 1; students <= SIMULATION_CONFIG.maxBreakEvenStudents; students += 1) {
    const result = calculateFinancialResult(students, studentPrice, planId);
    if (result.profitable) return students;
  }
  return null;
}

export function getRecommendation(
  standardResult: FinancialResult,
  breakEvenStudents: number | null,
  studentPrice: number,
): string {
  if (studentPrice <= 12000 && breakEvenStudents === null) {
    return "現在の価格設定では、一定の生徒数を獲得しても利益が残りにくい構造です。提供内容に個別サポートやコミュニティ価値を加え、月額単価を上げる設計を検討してください。";
  }

  if (standardResult.profitable) {
    return "現在のSNS規模と価格設定であれば、初期段階から黒字化できる可能性があります。特に、ファンクラブやオフ会参加者がいる場合は、最初の募集対象を既存ファンに絞ることで、より現実的に初期生徒を獲得できます。";
  }

  const shortage =
    breakEvenStudents === null ? Number.POSITIVE_INFINITY : breakEvenStudents - standardResult.students;

  if (shortage > 0 && shortage <= 3) {
    return "現在の条件では黒字化まであと少しです。価格を無理に上げるよりも、まずは初期募集で数名を追加獲得する設計をした方が現実的です。無料説明会、先行募集、既存フォロワー向け限定案内などを組み合わせることで、黒字化ラインに近づけられます。";
  }

  return "現在の条件では、すぐに英会話スクールを本格開始するにはリスクがあります。まずは有料コミュニティ、個別相談、少人数モニター募集などで需要を検証し、実際に支払う意思のある見込み客を確認してから本格展開することを推奨します。";
}
