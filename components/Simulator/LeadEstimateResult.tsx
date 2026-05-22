import { formatNumber, formatPeople } from "@/lib/formatting";
import type { SimulationFactors, StudentEstimate } from "@/types/simulator";

type Props = {
  estimate: StudentEstimate;
  factors: SimulationFactors;
  onNext: () => void;
};

export function LeadEstimateResult({ estimate, factors, onNext }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">見込み生徒数</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          あなたの現在の発信状況から、初期の見込み生徒数は以下の範囲と想定されます。
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["保守的シナリオ", estimate.conservative, "bg-slate-50"],
          ["標準シナリオ", estimate.standard, "bg-cyan-50"],
          ["強気シナリオ", estimate.optimistic, "bg-emerald-50"],
        ].map(([label, value, tone]) => (
          <div
            key={String(label)}
            className={`rounded-lg border border-slate-200 p-4 sm:p-5 ${tone}`}
          >
            <p className="text-sm font-semibold text-slate-600">{label}</p>
            <p className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
              {formatPeople(value as number)}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <h3 className="font-bold text-slate-800">算出に使った主な要素</h3>
        <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <p>有効フォロワー数：{formatNumber(factors.effectiveFollowers)}人</p>
          <p>エンゲージメントスコア：{formatNumber(factors.engagementScore)}</p>
          <p>SNS経由見込み：{formatNumber(factors.snsStudents)}人</p>
          <p>コミュニティ経由見込み：{formatNumber(factors.communityStudents)}人</p>
          <p>既存生徒・問い合わせ・販売実績補正：{formatNumber(factors.existingStudentMigration + factors.inquiryStudents + factors.pastBuyerStudents)}人</p>
        </div>
      </div>
      <div className="rounded-lg bg-navy-900 p-4 text-white sm:p-5">
        <p className="text-sm leading-7 text-slate-200">
          次に、月額価格を設定して、黒字化ラインを確認しましょう。
        </p>
        <button
          type="button"
          onClick={onNext}
          className="mt-4 w-full rounded-md bg-cyan-400 px-5 py-3 text-sm font-bold text-navy-900 hover:bg-cyan-300 sm:w-auto"
        >
          価格シミュレーションへ進む
        </button>
      </div>
    </div>
  );
}
