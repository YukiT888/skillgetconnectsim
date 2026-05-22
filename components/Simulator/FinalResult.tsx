import { getDevelopmentPlan } from "@/lib/simulation";
import { formatCurrency, formatPeople } from "@/lib/formatting";
import type { FinancialResult, StudentEstimate } from "@/types/simulator";

type Props = {
  estimate: StudentEstimate;
  standardResult: FinancialResult;
  scenarioResults: {
    conservative: FinancialResult;
    standard: FinancialResult;
    optimistic: FinancialResult;
  };
  studentPrice: number;
  developmentPlanId: string;
  breakEvenStudents: number | null;
  recommendation: string;
  onContact: () => void;
};

function ProfitBadge({ profitable }: { profitable: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        profitable ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}
    >
      {profitable ? "黒字" : "赤字"}
    </span>
  );
}

export function FinalResult({
  estimate,
  standardResult,
  scenarioResults,
  studentPrice,
  developmentPlanId,
  breakEvenStudents,
  recommendation,
  onContact,
}: Props) {
  const plan = getDevelopmentPlan(developmentPlanId);
  const shortage =
    breakEvenStudents === null ? null : Math.max(0, breakEvenStudents - estimate.standard);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">最終結果</h2>
        <p className="mt-3 text-sm text-slate-600">
          表示金額はすべて税抜きです。実際の請求時には消費税が加算されます。
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-semibold text-slate-600">月間利益</p>
          <p
            className={`mt-3 break-words text-3xl font-bold sm:text-4xl ${
              standardResult.profitable ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {formatCurrency(standardResult.profit)}
          </p>
          <div className="mt-4">
            <ProfitBadge profitable={standardResult.profitable} />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-semibold text-slate-600">黒字化に必要な生徒数</p>
          <p className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
            {breakEvenStudents === null ? "500人以上" : formatPeople(breakEvenStudents)}
          </p>
          {shortage !== null ? (
            <p className="mt-3 text-sm text-slate-600">
              現在の標準見込み生徒数は {formatPeople(estimate.standard)} のため、
              {shortage === 0
                ? "黒字化ラインに到達しています。"
                : `あと ${formatPeople(shortage)} 獲得できれば黒字化が見込めます。`}
            </p>
          ) : null}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-semibold text-slate-600">選択条件</p>
          <p className="mt-3 font-bold text-navy-900">{formatCurrency(studentPrice)} / 月</p>
          <p className="mt-2 text-sm text-slate-600">{plan.name}</p>
          <p className="mt-2 text-sm text-slate-600">
            見込み生徒数：{formatPeople(estimate.standard)}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <h3 className="font-bold text-navy-900">月間費用内訳</h3>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <p>基本料金：<b>{formatCurrency(standardResult.baseFee)}</b></p>
          <p>生徒従量費用：<b>{formatCurrency(standardResult.perStudentFee)}</b></p>
          <p>開発費月額：<b>{formatCurrency(standardResult.developmentFee)}</b></p>
          <p>ロイヤリティ：<b>{formatCurrency(standardResult.royalty)}</b></p>
        </div>
        <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          ロイヤリティは一律料率ではなく、売上20万円まで30%、20万円超〜40万円まで40%、40万円超の部分に50%を適用する超過累進方式です。
        </div>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <p>月間売上：<b>{formatCurrency(standardResult.revenue)}</b></p>
          <p>月間総費用：<b>{formatCurrency(standardResult.totalCost)}</b></p>
          <p>月間利益：<b>{formatCurrency(standardResult.profit)}</b></p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <h3 className="font-bold text-navy-900">3シナリオ収益比較</h3>
        </div>
        <div className="grid gap-3 p-4 md:hidden">
          {[
            ["保守的", scenarioResults.conservative],
            ["標準", scenarioResults.standard],
            ["強気", scenarioResults.optimistic],
          ].map(([label, result]) => {
            const financial = result as FinancialResult;
            return (
              <div key={label as string} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-navy-900">{label as string}シナリオ</p>
                  <ProfitBadge profitable={financial.profitable} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <p className="rounded-md bg-slate-50 p-3">生徒数<br /><b>{formatPeople(financial.students)}</b></p>
                  <p className="rounded-md bg-slate-50 p-3">売上<br /><b>{formatCurrency(financial.revenue)}</b></p>
                  <p className="rounded-md bg-slate-50 p-3">費用<br /><b>{formatCurrency(financial.totalCost)}</b></p>
                  <p className="rounded-md bg-slate-50 p-3">利益<br /><b className={financial.profitable ? "text-emerald-700" : "text-red-700"}>{formatCurrency(financial.profit)}</b></p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3">シナリオ</th>
                <th className="px-5 py-3">生徒数</th>
                <th className="px-5 py-3">売上</th>
                <th className="px-5 py-3">費用</th>
                <th className="px-5 py-3">利益</th>
                <th className="px-5 py-3">判定</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["保守的", scenarioResults.conservative],
                ["標準", scenarioResults.standard],
                ["強気", scenarioResults.optimistic],
              ].map(([label, result]) => {
                const financial = result as FinancialResult;
                return (
                  <tr key={label as string} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-semibold">{label as string}</td>
                    <td className="px-5 py-4">{formatPeople(financial.students)}</td>
                    <td className="px-5 py-4">{formatCurrency(financial.revenue)}</td>
                    <td className="px-5 py-4">{formatCurrency(financial.totalCost)}</td>
                    <td
                      className={`px-5 py-4 font-bold ${
                        financial.profitable ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {formatCurrency(financial.profit)}
                    </td>
                    <td className="px-5 py-4">
                      <ProfitBadge profitable={financial.profitable} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 sm:p-5">
        <h3 className="font-bold text-navy-900">推奨コメント</h3>
        <p className="mt-3 text-sm leading-7 text-slate-700">{recommendation}</p>
        <button
          type="button"
          onClick={onContact}
          className="mt-5 w-full rounded-md bg-navy-900 px-5 py-3 text-sm font-bold text-white hover:bg-navy-800 sm:w-auto"
        >
          この結果で相談する
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600 sm:p-5">
        本シミュレーションは、入力されたSNS情報や活動状況をもとにした概算です。実際の生徒獲得数、売上、利益を保証するものではありません。正式な事業計画や契約条件は、個別相談のうえ決定されます。
      </div>
    </div>
  );
}
