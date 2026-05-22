import { ErrorSummary, Field, SectionTitle } from "@/components/Simulator/FormControls";
import type { SimulationInput } from "@/types/simulator";

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

export function StepCommunity({ input, errors, update }: Props) {
  return (
    <div className="space-y-6">
      <SectionTitle
        title="ファンコミュニティ入力"
        description="SNS以外の濃い接点がある場合、初期生徒の獲得確度として反映します。"
      />
      <ErrorSummary errors={errors} />
      <div className="space-y-4">
        <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <input
            type="checkbox"
            checked={input.hasFanClub}
            onChange={(event) =>
              update({
                hasFanClub: event.target.checked,
                fanClubMembers: event.target.checked ? input.fanClubMembers : "",
              })
            }
            className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600"
          />
          <span className="font-semibold text-slate-700">
            フォロワー向けのファンクラブ・有料コミュニティがある
          </span>
        </label>
        {input.hasFanClub ? (
          <Field
            label="ファンクラブまたはコミュニティの参加人数"
            type="number"
            unit="人"
            value={input.fanClubMembers ?? ""}
            onChange={(value) => update({ fanClubMembers: toNumber(value) })}
            error={errors.fanClubMembers}
          />
        ) : null}

        <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <input
            type="checkbox"
            checked={input.hasOfflineEvent}
            onChange={(event) =>
              update({
                hasOfflineEvent: event.target.checked,
                offlineEventParticipants: event.target.checked
                  ? input.offlineEventParticipants
                  : "",
              })
            }
            className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600"
          />
          <span className="font-semibold text-slate-700">
            オフ会を実施したことがある
          </span>
        </label>
        {input.hasOfflineEvent ? (
          <Field
            label="直近または平均のオフ会参加人数"
            type="number"
            unit="人"
            value={input.offlineEventParticipants ?? ""}
            onChange={(value) =>
              update({ offlineEventParticipants: toNumber(value) })
            }
            error={errors.offlineEventParticipants}
          />
        ) : null}
      </div>
    </div>
  );
}
