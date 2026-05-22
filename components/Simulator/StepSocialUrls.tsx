import { SOCIAL_PLATFORMS } from "@/config/simulationConfig";
import { ErrorSummary, Field, SectionTitle } from "@/components/Simulator/FormControls";
import type { SimulationInput, SocialPlatform } from "@/types/simulator";

type Props = {
  input: SimulationInput;
  errors: Record<string, string>;
  update: (patch: Partial<SimulationInput>) => void;
};

export function StepSocialUrls({ input, errors, update }: Props) {
  const setUrl = (platform: SocialPlatform, url: string) => {
    update({ socialUrls: { ...input.socialUrls, [platform]: url } });
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="SNS URL入力"
        description="入力されたSNSのみ、次のステップでフォロワー数と反応数の入力欄を表示します。"
      />
      <ErrorSummary errors={errors} />
      <div className="grid gap-4 sm:grid-cols-2">
        {SOCIAL_PLATFORMS.map(({ key, label }) => (
          <Field
            key={key}
            label={`${label} URL`}
            type="url"
            value={input.socialUrls[key]}
            placeholder={
              key === "youtube"
                ? "https://www.youtube.com/@..."
                : key === "x"
                  ? "https://x.com/..."
                  : `https://www.${key}.com/...`
            }
            onChange={(value) => setUrl(key, value)}
            error={errors[`socialUrls.${key}`]}
          />
        ))}
      </div>
    </div>
  );
}
