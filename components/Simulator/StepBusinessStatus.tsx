import { ErrorSummary, Field, SectionTitle } from "@/components/Simulator/FormControls";
import type { BusinessStatus, SimulationInput } from "@/types/simulator";

type Props = {
  input: SimulationInput;
  errors: Record<string, string>;
  update: (patch: Partial<SimulationInput>) => void;
};

function toNumber(value: string): number | "" {
  if (value === "") return "";
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : "";
}

export function StepBusinessStatus({ input, errors, update }: Props) {
  const setStatus = (businessStatus: BusinessStatus) => {
    update({
      businessStatus,
      ...(businessStatus === "already_coaching"
        ? { hasSoldPaidProduct: undefined, pastProductMaxPrice: "", pastProductBuyers: "" }
        : { currentMonthlyPrice: "", currentStudents: "", monthlyInquiries: "" }),
    });
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="現在の状況"
        description="現在の事業フェーズに合わせて、見込み生徒数の補正に使う情報を入力してください。"
      />
      <ErrorSummary errors={errors} />
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["already_coaching", "すでにコーチングを行っている"],
          ["starting_new", "これから英会話学校を始めたい"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value as BusinessStatus)}
            className={`min-h-14 rounded-lg border p-4 text-left font-semibold leading-6 transition ${
              input.businessStatus === value
                ? "border-cyan-500 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-100"
                : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {input.businessStatus === "already_coaching" ? (
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
          <Field
            label="現在の生徒の客単価"
            type="number"
            unit="円"
            value={input.currentMonthlyPrice ?? ""}
            onChange={(value) => update({ currentMonthlyPrice: toNumber(value) })}
            error={errors.currentMonthlyPrice}
          />
          <Field
            label="現在の生徒数"
            type="number"
            unit="人"
            value={input.currentStudents ?? ""}
            onChange={(value) => update({ currentStudents: toNumber(value) })}
            error={errors.currentStudents}
          />
          <Field
            label="直近1ヶ月の問い合わせ数"
            type="number"
            unit="件"
            value={input.monthlyInquiries ?? ""}
            onChange={(value) => update({ monthlyInquiries: toNumber(value) })}
            error={errors.monthlyInquiries}
          />
        </div>
      ) : null}

      {input.businessStatus === "starting_new" ? (
        <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">
            過去に有料商品を販売したことがありますか？
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              [true, "はい"],
              [false, "いいえ"],
            ].map(([value, label]) => (
              <button
                key={String(value)}
                type="button"
                onClick={() =>
                  update({
                    hasSoldPaidProduct: value as boolean,
                    ...(!value ? { pastProductMaxPrice: "", pastProductBuyers: "" } : {}),
                  })
                }
                className={`min-h-12 rounded-md border px-5 py-3 text-sm font-semibold ${
                  input.hasSoldPaidProduct === value
                    ? "border-cyan-500 bg-cyan-50 text-cyan-800"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {label as string}
              </button>
            ))}
          </div>
          {errors.hasSoldPaidProduct ? (
            <p className="text-sm text-red-600">{errors.hasSoldPaidProduct}</p>
          ) : null}
          {input.hasSoldPaidProduct ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="過去に販売した商品の最高単価"
                type="number"
                unit="円"
                value={input.pastProductMaxPrice ?? ""}
                onChange={(value) => update({ pastProductMaxPrice: toNumber(value) })}
                error={errors.pastProductMaxPrice}
              />
              <Field
                label="過去に販売した人数"
                type="number"
                unit="人"
                value={input.pastProductBuyers ?? ""}
                onChange={(value) => update({ pastProductBuyers: toNumber(value) })}
                error={errors.pastProductBuyers}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
