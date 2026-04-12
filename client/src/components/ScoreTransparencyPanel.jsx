import { useMemo, useState } from "react";

function formatDelta(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
}

function getWeightList(weights) {
  if (!weights) {
    return [
      { key: "goal", label: "Goal fit", weight: 35 },
      { key: "liquidity", label: "Liquidity", weight: 25 },
      { key: "return", label: "Return potential", weight: 20 },
      { key: "risk", label: "Risk alignment", weight: 10 },
      { key: "tenure", label: "Tenure fit", weight: 10 },
    ];
  }

  return [
    { key: "goal", label: "Goal fit", weight: weights.goal },
    { key: "liquidity", label: "Liquidity", weight: weights.liquidity },
    { key: "return", label: "Return potential", weight: weights.return },
    { key: "risk", label: "Risk alignment", weight: weights.risk },
    { key: "tenure", label: "Tenure fit", weight: weights.tenure },
  ];
}

function explainDelta(delta) {
  if (delta > 1) {
    return "improved strongly";
  }

  if (delta > 0) {
    return "improved slightly";
  }

  if (delta < -1) {
    return "dropped meaningfully";
  }

  if (delta < 0) {
    return "dropped slightly";
  }

  return "stayed flat";
}

export default function ScoreTransparencyPanel({ baseline, comparison, weights }) {
  const [technicalView, setTechnicalView] = useState(false);
  const fields = useMemo(() => getWeightList(weights), [weights]);

  if (!baseline?.breakdown) {
    return null;
  }

  return (
    <section className="surface-shell grid gap-4 rounded-[2rem] p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">[ WEIGHTED SIGNAL CONTRIBUTION ]</p>
          <h3 className="mt-2 text-xl font-semibold text-white">What the engine weighted</h3>
          <p className="mt-1 text-sm text-[#9fb3c8]">Plain language by default, with technical values on demand.</p>
        </div>
        <button
          type="button"
          onClick={() => setTechnicalView((prev) => !prev)}
          className="rounded-full border border-cyan-500/20 bg-[#0b1117] px-4 py-2 text-sm font-semibold text-[#e6edf3] transition-all duration-300 ease-in-out hover:border-cyan-400/40"
          aria-label="Toggle technical score explanation view"
        >
          {technicalView ? "Plain view" : "Technical view"}
        </button>
      </div>

      <div className="grid gap-3">
        {fields.map((field) => {
          const baselineValue = baseline.breakdown[field.key] ?? 0;
          const comparisonValue = comparison?.breakdown?.[field.key] ?? baselineValue;
          const delta = comparisonValue - baselineValue;
          const fillWidth = Math.max(8, Math.min(100, (baselineValue / field.weight) * 100));

          return (
            <article key={field.key} className="rounded-2xl border border-cyan-500/20 bg-[#0b1117] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{field.label}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Weight {field.weight}%</p>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9fb3c8]">
                  <span>Signal strength</span>
                  <span>{baselineValue.toFixed(2)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded bg-gray-800">
                  <div
                    className="h-1.5 rounded bg-cyan-400 transition-all duration-300 ease-in-out"
                    style={{ width: `${fillWidth}%` }}
                  />
                </div>
              </div>

              {technicalView ? (
                <div className="mt-3 grid gap-2 text-sm text-[#9fb3c8] sm:grid-cols-3">
                  <p>Baseline: <span className="text-white">{baselineValue.toFixed(2)}</span></p>
                  <p>Scenario B: <span className="text-white">{comparisonValue.toFixed(2)}</span></p>
                  <p className={delta >= 0 ? "text-cyan-300" : "text-[#ffb020]"}>Delta: {formatDelta(delta)}</p>
                </div>
              ) : (
                <div className="mt-3 grid gap-2 text-sm text-[#9fb3c8]">
                  <p>
                    This factor {explainDelta(delta)} from <span className="text-white">{baselineValue.toFixed(2)}</span> to <span className="text-white">{comparisonValue.toFixed(2)}</span>.
                  </p>
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">Impact on total score: {field.weight}%</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
