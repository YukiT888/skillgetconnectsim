type StepIndicatorProps = {
  steps: string[];
  currentStep: number;
};

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-cyan-700">
              STEP {currentStep + 1} / {steps.length}
            </p>
            <p className="mt-1 font-bold text-navy-900">{steps[currentStep]}</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white">
            {currentStep + 1}
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-cyan-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="hidden overflow-x-auto pb-2 sm:block">
        <div className="flex min-w-max gap-2">
        {steps.map((step, index) => {
          const active = index === currentStep;
          const complete = index < currentStep;
          return (
            <div
              key={step}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold ${
                active
                  ? "border-cyan-500 bg-cyan-50 text-cyan-800"
                  : complete
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  active
                    ? "bg-cyan-600 text-white"
                    : complete
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {index + 1}
              </span>
              {step}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
