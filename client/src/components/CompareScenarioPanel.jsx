function SelectField({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[#e6edf3]">
      {label}
      <select
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="surface-input rounded-2xl p-3 text-sm outline-none transition-all duration-300 ease-in-out"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function FieldBadge({ label, value }) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-[#0b1117] p-3">
      <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-400">{label}</p>
      <p className="mt-2 text-sm text-white">{value}</p>
    </div>
  );
}

export default function CompareScenarioPanel({
  baseProfile,
  comparisonProfile,
  onFieldChange,
  onRunComparison,
  onSaveSnapshot,
  loading,
  error,
  comparisonReady,
}) {
  if (!baseProfile || !comparisonProfile) {
    return null;
  }

  return (
    <section className="surface-accent grid gap-4 rounded-[2rem] p-5 animate-reveal">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Compare scenario mode</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Tune risk, liquidity, and horizon side by side</h2>
          <p className="mt-1 text-sm text-[#9fb3c8]">
            Your original profile stays fixed on the left while the contrast scenario can be adjusted on the right.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSaveSnapshot}
            disabled={!comparisonReady}
            className="rounded-full border border-cyan-500/20 bg-[#0b1117] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:border-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save snapshot
          </button>
          <button
            type="button"
            onClick={onRunComparison}
            disabled={loading}
            className="rounded-full border border-cyan-500/20 bg-cyan-400 px-5 py-2 text-sm font-semibold text-[#05070a] transition-all duration-300 ease-in-out hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-[#2a323b]"
          >
            {loading ? "Comparing..." : comparisonReady ? "Refresh comparison" : "Run comparison"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface-soft rounded-[2rem] p-4 transition-all duration-300 ease-in-out hover:-translate-y-0.5">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Original profile</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <FieldBadge label="Risk" value={baseProfile.riskLevel} />
            <FieldBadge label="Liquidity" value={baseProfile.liquidityNeed} />
            <FieldBadge label="Horizon" value={baseProfile.horizon} />
            <FieldBadge label="Goal" value={baseProfile.goal} />
          </div>
        </div>

        <div className="surface-accent rounded-[2rem] p-4 transition-all duration-300 ease-in-out hover:-translate-y-0.5">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Scenario B</p>
          <div className="mt-4 grid gap-3">
            <SelectField
              label="Risk Appetite"
              value={comparisonProfile.riskLevel}
              onChange={(value) => onFieldChange("riskLevel", value)}
              options={["low", "medium", "high"]}
            />
            <SelectField
              label="Liquidity Need"
              value={comparisonProfile.liquidityNeed}
              onChange={(value) => onFieldChange("liquidityNeed", value)}
              options={["high", "medium", "low"]}
            />
            <SelectField
              label="Time Horizon"
              value={comparisonProfile.horizon}
              onChange={(value) => onFieldChange("horizon", value)}
              options={["0-6 months", "6-12 months", "12-24 months", "24+ months"]}
            />
          </div>
        </div>
      </div>

      {error ? <p className="rounded-2xl border border-[#ffb020]/20 bg-[#ffb020]/10 p-3 text-sm text-[#ffb020]">{error}</p> : null}
    </section>
  );
}