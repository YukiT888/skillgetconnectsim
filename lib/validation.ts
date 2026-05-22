import { SIMULATION_CONFIG, SOCIAL_PLATFORMS } from "@/config/simulationConfig";
import type { ContactInput, SimulationInput, SocialPlatform } from "@/types/simulator";

export type ValidationErrors = Record<string, string>;

const urlPatterns: Record<SocialPlatform, RegExp> = {
  youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i,
  instagram: /^(https?:\/\/)?(www\.)?instagram\.com\//i,
  tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\//i,
  x: /^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//i,
};

function isEmptyNumber(value: number | "" | undefined): boolean {
  return value === "" || value === undefined || !Number.isInteger(value) || value < 0;
}

export function validateStep(step: number, input: SimulationInput): ValidationErrors {
  const errors: ValidationErrors = {};

  if (step === 0) {
    if (!input.businessStatus) errors.businessStatus = "現在の状況を選択してください。";
    if (input.businessStatus === "already_coaching") {
      if (isEmptyNumber(input.currentMonthlyPrice)) {
        errors.currentMonthlyPrice = "現在の生徒の客単価を入力してください。";
      }
      if (isEmptyNumber(input.currentStudents)) {
        errors.currentStudents = "現在の生徒数を入力してください。";
      }
      if (isEmptyNumber(input.monthlyInquiries)) {
        errors.monthlyInquiries = "直近1ヶ月の問い合わせ数を入力してください。";
      }
    }
    if (input.businessStatus === "starting_new") {
      if (input.hasSoldPaidProduct === undefined) {
        errors.hasSoldPaidProduct = "有料商品を販売したことがあるか選択してください。";
      }
      if (input.hasSoldPaidProduct) {
        if (isEmptyNumber(input.pastProductMaxPrice)) {
          errors.pastProductMaxPrice = "過去に販売した商品の最高単価を入力してください。";
        }
        if (isEmptyNumber(input.pastProductBuyers)) {
          errors.pastProductBuyers = "過去に販売した人数を入力してください。";
        }
      }
    }
  }

  if (step === 1) {
    const hasAnyUrl = SOCIAL_PLATFORMS.some(({ key }) => input.socialUrls[key].trim());
    if (!hasAnyUrl) errors.socialUrls = "少なくとも1つのSNS URLを入力してください。";

    SOCIAL_PLATFORMS.forEach(({ key, label }) => {
      const url = input.socialUrls[key].trim();
      if (url && !urlPatterns[key].test(url)) {
        errors[`socialUrls.${key}`] = `${label}のURL形式が正しくありません。`;
      }
    });
  }

  if (step === 2) {
    SOCIAL_PLATFORMS.forEach(({ key, label }) => {
      if (!input.socialUrls[key].trim()) return;
      const metrics = input.socialMetrics[key];
      if (!metrics || isEmptyNumber(metrics.followers)) {
        errors[`socialMetrics.${key}.followers`] = `${label}のフォロワー数を入力してください。`;
      }
      if (!metrics || isEmptyNumber(metrics.likes)) {
        errors[`socialMetrics.${key}.likes`] = `${label}のいいね数を入力してください。`;
      }
      if (!metrics || isEmptyNumber(metrics.comments)) {
        errors[`socialMetrics.${key}.comments`] = `${label}のコメント数を入力してください。`;
      }
      if (!metrics || (!metrics.savesUnknown && isEmptyNumber(metrics.saves))) {
        errors[`socialMetrics.${key}.saves`] =
          "保存数を入力するか、「保存数が分からない」を選択してください。";
      }
    });
  }

  if (step === 3) {
    if (input.hasFanClub && isEmptyNumber(input.fanClubMembers)) {
      errors.fanClubMembers = "ファンクラブまたはコミュニティの参加人数を入力してください。";
    }
    if (input.hasOfflineEvent && isEmptyNumber(input.offlineEventParticipants)) {
      errors.offlineEventParticipants = "直近または平均のオフ会参加人数を入力してください。";
    }
  }

  if (step === 5) {
    if (
      input.studentPrice < SIMULATION_CONFIG.minStudentPrice ||
      input.studentPrice > SIMULATION_CONFIG.maxStudentPrice
    ) {
      errors.studentPrice = "提供価格は8,000円以上50,000円以下で入力してください。";
    }
    if (!input.developmentPlanId) {
      errors.developmentPlanId = "開発費プランを選択してください。";
    }
  }

  return errors;
}

export function validateContact(input: ContactInput): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!input.name.trim()) errors.name = "名前を入力してください。";
  if (!input.email.trim()) {
    errors.email = "メールアドレスを入力してください。";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = "メールアドレス形式で入力してください。";
  }
  return errors;
}
