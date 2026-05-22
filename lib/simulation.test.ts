import { describe, expect, it } from "vitest";
import {
  calculateBreakEvenStudents,
  calculateEffectiveFollowers,
  calculateEngagementScore,
  calculateFinancialResult,
  calculateRoyalty,
  calculateScenarioStudents,
} from "@/lib/simulation";
import type { SimulationInput } from "@/types/simulator";

function baseInput(overrides: Partial<SimulationInput> = {}): SimulationInput {
  return {
    businessStatus: "starting_new",
    currentMonthlyPrice: "",
    currentStudents: "",
    monthlyInquiries: "",
    hasSoldPaidProduct: false,
    pastProductMaxPrice: "",
    pastProductBuyers: "",
    socialUrls: {
      youtube: "",
      instagram: "https://www.instagram.com/sample",
      tiktok: "",
      x: "",
    },
    socialMetrics: {
      instagram: {
        followers: 10000,
        likes: 500,
        saves: 100,
        savesUnknown: false,
        comments: 20,
      },
    },
    hasFanClub: false,
    fanClubMembers: "",
    hasOfflineEvent: false,
    offlineEventParticipants: "",
    studentPrice: 30000,
    developmentPlanId: "no_initial_12",
    ...overrides,
  };
}

describe("simulation calculations", () => {
  it("calculates progressive royalty tiers", () => {
    expect(calculateRoyalty(200000)).toBe(60000);
    expect(calculateRoyalty(300000)).toBe(100000);
    expect(calculateRoyalty(500000)).toBe(190000);
  });

  it("applies follower overlap and engagement weighting", () => {
    const input = baseInput({
      socialUrls: {
        youtube: "https://www.youtube.com/@sample",
        instagram: "https://www.instagram.com/sample",
        tiktok: "",
        x: "",
      },
      socialMetrics: {
        youtube: {
          followers: 5000,
          likes: 100,
          saves: 20,
          savesUnknown: false,
          comments: 10,
        },
        instagram: {
          followers: 10000,
          likes: 500,
          saves: 100,
          savesUnknown: false,
          comments: 20,
        },
      },
    });

    expect(calculateEffectiveFollowers(input)).toBe(12000);
    expect(calculateEngagementScore(input)).toBe(1110);
  });

  it("uses zero saves when saves are unknown", () => {
    const input = baseInput({
      socialMetrics: {
        instagram: {
          followers: 10000,
          likes: 500,
          saves: "",
          savesUnknown: true,
          comments: 20,
        },
      },
    });

    expect(calculateEngagementScore(input)).toBe(600);
  });

  it("estimates scenario students with business and sales history adjustments", () => {
    const input = baseInput({
      businessStatus: "already_coaching",
      currentStudents: 20,
      monthlyInquiries: 10,
      hasFanClub: true,
      fanClubMembers: 100,
      hasOfflineEvent: true,
      offlineEventParticipants: 20,
      hasSoldPaidProduct: true,
      pastProductBuyers: 30,
    });

    expect(calculateScenarioStudents(input)).toEqual({
      conservative: 14,
      standard: 28,
      optimistic: 42,
    });
  });

  it("calculates financial results and break-even students", () => {
    const result = calculateFinancialResult(8, 30000, "no_initial_24");

    expect(result).toMatchObject({
      students: 8,
      revenue: 240000,
      baseFee: 50000,
      perStudentFee: 20000,
      developmentFee: 25000,
      royalty: 76000,
      totalCost: 171000,
      profit: 69000,
      profitable: true,
    });
    expect(calculateBreakEvenStudents(30000, "no_initial_24")).toBe(5);
  });
});
