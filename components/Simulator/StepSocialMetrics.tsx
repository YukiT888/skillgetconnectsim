import { SOCIAL_PLATFORMS } from "@/config/simulationConfig";
import { ErrorSummary, Field, SectionTitle } from "@/components/Simulator/FormControls";
import type { SimulationInput, SocialMetrics, SocialPlatform } from "@/types/simulator";

type Props = {
  input: SimulationInput;
  errors: Record<string, string>;
  update: (patch: Partial<SimulationInput>) => void;
};

const emptyMetrics: SocialMetrics = {
  followers: "",
  likes: "",
  saves: "",
  savesUnknown: false,
  comments: "",
};

function toNumber(value: string): number | "" {
  if (value === "") return "";
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : "";
}

export function StepSocialMetrics({ input, errors, update }: Props) {
  const activePlatforms = SOCIAL_PLATFORMS.filter(({ key }) =>
    input.socialUrls[key].trim(),
  );

  const setMetric = (
    platform: SocialPlatform,
    patch: Partial<SocialMetrics>,
  ) => {
    const current = input.socialMetrics[platform] ?? emptyMetrics;
    update({
      socialMetrics: {
        ...input.socialMetrics,
        [platform]: { ...current, ...patch },
      },
    });
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="フォロワー数・エンゲージメント入力"
        description="直近3〜5投稿の平均値を入力してください。極端に伸びた投稿だけでなく、通常投稿の平均に近い数字を入力すると、より現実的な結果になります。"
      />
      <ErrorSummary errors={errors} />
      <div className="space-y-5">
        {activePlatforms.map(({ key, label }) => {
          const metrics = input.socialMetrics[key] ?? emptyMetrics;
          return (
            <div
              key={key}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <h3 className="mb-4 text-lg font-bold text-navy-900">{label}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="現在のフォロワー数"
                  type="number"
                  unit="人"
                  value={metrics.followers}
                  onChange={(value) => setMetric(key, { followers: toNumber(value) })}
                  error={errors[`socialMetrics.${key}.followers`]}
                />
                <Field
                  label="平均いいね数"
                  type="number"
                  unit="件"
                  value={metrics.likes}
                  onChange={(value) => setMetric(key, { likes: toNumber(value) })}
                  error={errors[`socialMetrics.${key}.likes`]}
                />
                <div>
                  <Field
                    label="平均保存数"
                    type="number"
                    unit="件"
                    value={metrics.savesUnknown ? 0 : metrics.saves}
                    disabled={metrics.savesUnknown}
                    onChange={(value) => setMetric(key, { saves: toNumber(value) })}
                    error={errors[`socialMetrics.${key}.saves`]}
                  />
                  <label className="mt-3 flex min-h-11 items-center gap-3 rounded-md bg-slate-50 px-3 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={metrics.savesUnknown}
                      onChange={(event) =>
                        setMetric(key, {
                          savesUnknown: event.target.checked,
                          saves: event.target.checked ? 0 : metrics.saves,
                        })
                      }
                      className="h-5 w-5 rounded border-slate-300 text-cyan-600"
                    />
                    保存数が分からない
                  </label>
                </div>
                <Field
                  label="平均コメント数"
                  type="number"
                  unit="件"
                  value={metrics.comments}
                  onChange={(value) => setMetric(key, { comments: toNumber(value) })}
                  error={errors[`socialMetrics.${key}.comments`]}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
