"use client";

import { useState } from "react";
import { Field, SectionTitle } from "@/components/Simulator/FormControls";
import { submitContact } from "@/lib/contact";
import { formatCurrency, formatPeople } from "@/lib/formatting";
import { validateContact } from "@/lib/validation";
import type {
  ContactInput,
  FinancialResult,
  SimulationInput,
  StudentEstimate,
} from "@/types/simulator";

type Props = {
  simulationInput: SimulationInput;
  estimatedStudents: StudentEstimate;
  selectedScenario: FinancialResult;
  breakEvenStudents: number | null;
};

const initialContact: ContactInput = {
  name: "",
  email: "",
  phoneOrLine: "",
  activityName: "",
  primarySnsUrl: "",
  message: "",
};

export function ContactForm({
  simulationInput,
  estimatedStudents,
  selectedScenario,
  breakEvenStudents,
}: Props) {
  const [contact, setContact] = useState<ContactInput>(initialContact);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (patch: Partial<ContactInput>) => {
    setContact((current) => ({ ...current, ...patch }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateContact(contact);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    await submitContact({
      contact,
      simulationInput,
      estimatedStudents,
      selectedScenario,
      breakEvenStudents,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-bold text-emerald-800">送信ありがとうございました。</p>
        <p className="mt-2 text-sm text-emerald-700">
          入力いただいた内容を確認のうえ、担当者よりご連絡いたします。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <SectionTitle
        title="問い合わせフォーム"
        description="シミュレーション結果を紐づけて送信します。現時点では仮送信としてコンソールに出力します。"
      />
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
        <p className="text-sm font-bold text-navy-900">送信される結果サマリー</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <p className="rounded-md bg-white/80 p-3">
            標準見込み<br />
            <b>{formatPeople(estimatedStudents.standard)}</b>
          </p>
          <p className="rounded-md bg-white/80 p-3">
            月間売上<br />
            <b>{formatCurrency(selectedScenario.revenue)}</b>
          </p>
          <p className="rounded-md bg-white/80 p-3">
            月間利益<br />
            <b className={selectedScenario.profitable ? "text-emerald-700" : "text-red-700"}>
              {formatCurrency(selectedScenario.profit)}
            </b>
          </p>
          <p className="rounded-md bg-white/80 p-3">
            黒字化人数<br />
            <b>{breakEvenStudents === null ? "500人以上" : formatPeople(breakEvenStudents)}</b>
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="名前"
          value={contact.name}
          onChange={(value) => update({ name: value })}
          error={errors.name}
        />
        <Field
          label="メールアドレス"
          type="email"
          value={contact.email}
          onChange={(value) => update({ email: value })}
          error={errors.email}
        />
        <Field
          label="電話番号またはLINE"
          type="tel"
          value={contact.phoneOrLine}
          onChange={(value) => update({ phoneOrLine: value })}
        />
        <Field
          label="活動名"
          value={contact.activityName}
          onChange={(value) => update({ activityName: value })}
        />
        <Field
          label="主なSNS URL"
          type="url"
          value={contact.primarySnsUrl}
          onChange={(value) => update({ primarySnsUrl: value })}
        />
      </div>
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">相談内容</span>
        <textarea
          value={contact.message}
          onChange={(event) => update({ message: event.target.value })}
          className="mt-2 min-h-36 w-full rounded-md border border-slate-300 px-3 py-3 text-base outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-md bg-cyan-600 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-700 sm:w-auto"
      >
        相談内容を送信する
      </button>
    </form>
  );
}
