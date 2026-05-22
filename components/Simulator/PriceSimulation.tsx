import { DEVELOPMENT_PLANS, SIMULATION_CONFIG } from "@/config/simulationConfig";
import { ErrorSummary, Field, SectionTitle } from "@/components/Simulator/FormControls";
import { formatCurrency } from "@/lib/formatting";
import type { SimulationInput } from "@/types/simulator";

type Props = {
  input: SimulationInput;
  errors: Record<string, string>;
  update: (patch: Partial<SimulationInput>) => void;
};

export function PriceSimulation({ input, errors, update }: Props) {
  const setPrice = (value: string | number) => {
    const parsed = Number(value);
    update({
      studentPrice: Number.isFinite(parsed)
        ? Math.min(
            SIMULATION_CONFIG.maxStudentPrice,
            Math.max(SIMULATION_CONFIG.minStudentPrice, Math.floor(parsed / 1000) * 1000),
          )
        : SIMULATION_CONFIG.minStudentPrice,
    });
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="価格シミュレーション"
        description="生徒への月額提供価格と開発費プランを選ぶと、結果画面で黒字化ラインを即時に確認できます。"
      />
      <ErrorSummary errors={errors} />
      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <p className="text-sm font-semibold leading-7 text-slate-700">
          生徒への月額提供価格：{" "}
          <span className="block text-2xl font-bold text-navy-900 sm:inline sm:text-xl">
            {formatCurrency(input.studentPrice)} / 月
          </span>
        </p>
        <input
          type="range"
          min={SIMULATION_CONFIG.minStudentPrice}
          max={SIMULATION_CONFIG.maxStudentPrice}
          step={SIMULATION_CONFIG.studentPriceStep}
          value={input.studentPrice}
          onChange={(event) => setPrice(event.target.value)}
          className="mt-5 w-full accent-cyan-600"
        />
        <div className="mt-4 max-w-full sm:max-w-xs">
          <Field
            label="数値入力"
            type="number"
            unit="円"
            value={input.studentPrice}
            min={SIMULATION_CONFIG.minStudentPrice}
            max={SIMULATION_CONFIG.maxStudentPrice}
            onChange={setPrice}
            error={errors.studentPrice}
          />
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h3 className="text-lg font-bold text-navy-900">開発費プラン</h3>
          <p className="text-xs text-slate-500">
            表示金額はすべて税抜きです。実際の請求時には消費税が加算されます。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {DEVELOPMENT_PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => update({ developmentPlanId: plan.id })}
              className={`w-full rounded-lg border p-4 text-left transition sm:p-5 ${
                input.developmentPlanId === plan.id
                  ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100"
                  : "border-slate-200 bg-white hover:border-cyan-300"
              }`}
            >
              <p className="font-bold text-navy-900">{plan.name}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 text-sm min-[420px]:grid-cols-2">
                <p className="rounded-md bg-white/70 p-3">初期費用<br /><b>{formatCurrency(plan.initialFee)}</b></p>
                <p className="rounded-md bg-white/70 p-3">月額開発費<br /><b>{formatCurrency(plan.monthlyDevelopmentFee)}</b></p>
                <p className="rounded-md bg-white/70 p-3">開発費総額<br /><b>{formatCurrency(plan.totalDevelopmentFee)}</b></p>
                <p className="rounded-md bg-white/70 p-3">分割期間<br /><b>{plan.months}ヶ月</b></p>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{plan.description}</p>
            </button>
          ))}
        </div>
        {errors.developmentPlanId ? (
          <p className="mt-2 text-sm text-red-600">{errors.developmentPlanId}</p>
        ) : null}
      </div>
    </div>
  );
}
