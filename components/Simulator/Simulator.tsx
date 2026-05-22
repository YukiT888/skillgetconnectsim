"use client";

import { useEffect, useMemo, useState } from "react";
import { DEVELOPMENT_PLANS, SIMULATION_CONFIG } from "@/config/simulationConfig";
import { ContactForm } from "@/components/Simulator/ContactForm";
import { FinalResult } from "@/components/Simulator/FinalResult";
import { LeadEstimateResult } from "@/components/Simulator/LeadEstimateResult";
import { PriceSimulation } from "@/components/Simulator/PriceSimulation";
import { StepBusinessStatus } from "@/components/Simulator/StepBusinessStatus";
import { StepCommunity } from "@/components/Simulator/StepCommunity";
import { StepIndicator } from "@/components/Simulator/StepIndicator";
import { StepSocialMetrics } from "@/components/Simulator/StepSocialMetrics";
import { StepSocialUrls } from "@/components/Simulator/StepSocialUrls";
import {
  calculateBreakEvenStudents,
  calculateEstimatedStudents,
  calculateFinancialResult,
  calculateScenarioStudents,
  getRecommendation,
} from "@/lib/simulation";
import { validateStep } from "@/lib/validation";
import type { SimulationInput } from "@/types/simulator";

const storageKey = "skillget-connect-simulator-input";

const steps = [
  "現在の状況",
  "SNS URL",
  "SNS数値",
  "コミュニティ",
  "見込み生徒",
  "価格設定",
  "最終結果",
  "問い合わせ",
];

const initialInput: SimulationInput = {
  businessStatus: null,
  currentMonthlyPrice: "",
  currentStudents: "",
  monthlyInquiries: "",
  hasSoldPaidProduct: undefined,
  pastProductMaxPrice: "",
  pastProductBuyers: "",
  socialUrls: {
    youtube: "",
    instagram: "",
    tiktok: "",
    x: "",
  },
  socialMetrics: {},
  hasFanClub: false,
  fanClubMembers: "",
  hasOfflineEvent: false,
  offlineEventParticipants: "",
  studentPrice: 30000,
  developmentPlanId: DEVELOPMENT_PLANS[0].id,
};

export function Simulator() {
  const [input, setInput] = useState<SimulationInput>(initialInput);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        // Restore persisted form state once after mount so SSR markup remains stable.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInput({ ...initialInput, ...JSON.parse(saved) });
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(input));
  }, [hydrated, input]);

  const estimateData = useMemo(() => calculateEstimatedStudents(input), [input]);
  const estimate = useMemo(() => calculateScenarioStudents(input), [input]);
  const scenarioResults = useMemo(
    () => ({
      conservative: calculateFinancialResult(
        estimate.conservative,
        input.studentPrice,
        input.developmentPlanId,
      ),
      standard: calculateFinancialResult(
        estimate.standard,
        input.studentPrice,
        input.developmentPlanId,
      ),
      optimistic: calculateFinancialResult(
        estimate.optimistic,
        input.studentPrice,
        input.developmentPlanId,
      ),
    }),
    [estimate, input.developmentPlanId, input.studentPrice],
  );
  const breakEvenStudents = useMemo(
    () => calculateBreakEvenStudents(input.studentPrice, input.developmentPlanId),
    [input.developmentPlanId, input.studentPrice],
  );
  const recommendation = useMemo(
    () =>
      getRecommendation(
        scenarioResults.standard,
        breakEvenStudents,
        input.studentPrice,
      ),
    [breakEvenStudents, input.studentPrice, scenarioResults.standard],
  );

  const update = (patch: Partial<SimulationInput>) => {
    setInput((current) => ({ ...current, ...patch }));
    setErrors({});
  };

  const goNext = () => {
    const nextErrors = validateStep(currentStep, input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setCurrentStep((step) => Math.min(steps.length - 1, step + 1));
    requestAnimationFrame(() =>
      document.getElementById("simulator-card")?.scrollIntoView({ behavior: "smooth" }),
    );
  };

  const goBack = () => {
    setErrors({});
    setCurrentStep((step) => Math.max(0, step - 1));
  };

  const jumpToContact = () => {
    setCurrentStep(7);
    requestAnimationFrame(() =>
      document.getElementById("simulator-card")?.scrollIntoView({ behavior: "smooth" }),
    );
  };

  const content = (() => {
    if (currentStep === 0) {
      return <StepBusinessStatus input={input} errors={errors} update={update} />;
    }
    if (currentStep === 1) {
      return <StepSocialUrls input={input} errors={errors} update={update} />;
    }
    if (currentStep === 2) {
      return <StepSocialMetrics input={input} errors={errors} update={update} />;
    }
    if (currentStep === 3) {
      return <StepCommunity input={input} errors={errors} update={update} />;
    }
    if (currentStep === 4) {
      return (
        <LeadEstimateResult
          estimate={estimate}
          factors={estimateData.factors}
          onNext={goNext}
        />
      );
    }
    if (currentStep === 5) {
      return <PriceSimulation input={input} errors={errors} update={update} />;
    }
    if (currentStep === 6) {
      return (
        <FinalResult
          estimate={estimate}
          standardResult={scenarioResults.standard}
          scenarioResults={scenarioResults}
          studentPrice={input.studentPrice}
          developmentPlanId={input.developmentPlanId}
          breakEvenStudents={breakEvenStudents}
          recommendation={recommendation}
          onContact={jumpToContact}
        />
      );
    }
    return (
      <ContactForm
        simulationInput={input}
        estimatedStudents={estimate}
        selectedScenario={scenarioResults.standard}
        breakEvenStudents={breakEvenStudents}
      />
    );
  })();

  return (
    <div
      id="simulator-card"
      className="overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:rounded-xl sm:p-6 lg:p-8"
    >
      <div className="mb-6">
        <p className="text-sm font-semibold text-cyan-700">Simulation</p>
        <h2 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
          英会話スクール収益シミュレーター
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          入力内容はこのブラウザの localStorage に保存されます。戻るボタンを押しても入力値は保持されます。
        </p>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="mt-8">{content}</div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={currentStep === 0}
          className="w-full rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          戻る
        </button>
        {currentStep !== 4 && currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="w-full rounded-md bg-navy-900 px-6 py-3 text-sm font-bold text-white hover:bg-navy-800 sm:w-auto"
          >
            次へ
          </button>
        ) : null}
      </div>

      <div className="mt-6 rounded-md bg-slate-50 p-4 text-xs leading-6 text-slate-500">
        基本料金は月額{SIMULATION_CONFIG.baseMonthlyFee.toLocaleString()}円、生徒ごとの費用は1人あたり月額{SIMULATION_CONFIG.perStudentMonthlyFee.toLocaleString()}円として試算します。
      </div>
    </div>
  );
}
