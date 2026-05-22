import type { ChangeEvent } from "react";

type FieldProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "email" | "tel" | "url";
  placeholder?: string;
  unit?: string;
  error?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
};

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  unit,
  error,
  disabled,
  min,
  max,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold leading-6 text-slate-700">{label}</span>
      <div className="mt-2 flex overflow-hidden rounded-md border border-slate-300 bg-white focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100">
        <input
          className="min-h-12 min-w-0 flex-1 px-3 py-3 text-base outline-none disabled:bg-slate-100 disabled:text-slate-400"
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange(event.target.value)
          }
        />
        {unit ? (
          <span className="flex min-w-11 items-center justify-center border-l border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
            {unit}
          </span>
        ) : null}
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </label>
  );
}

export function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}

export function ErrorSummary({ errors }: { errors: Record<string, string> }) {
  const values = Object.values(errors);
  if (!values.length) return null;
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {values[0]}
    </div>
  );
}
