import { Icon } from "./IconSystem";
import { humanizeValue, profileFieldLabels } from "../utils/labels";

function getTopLabel(recommendations) {
  return recommendations?.[0]?.productName ?? "No result";
}

function getTopScore(recommendations) {
  return recommendations?.[0]?.score ?? 0;
}

function getChangeList(baseProfile, comparisonProfile) {
  if (!baseProfile || !comparisonProfile) {
    return [];
  }

  return ["riskLevel", "liquidityNeed", "horizon"].filter(
    (field) => baseProfile[field] !== comparisonProfile[field],
  );
}

function ProfileChip({ label, value }) {
  return (
    <span className="rounded-full border border-cyan-500/20 bg-[#0b1117] px-3 py-1 text-xs text-[#e6edf3]">
      {label}: {humanizeValue(value)}
    </span>
  );
}

function factorLabel(field) {
  const labels = {
    goal: "Goal fit",
    liquidity: "Liquidity",
    return: "Return potential",
    risk: "Risk alignment",
    tenure: "Tenure",
  };

  return labels[field] || field;
}

function formatDelta(value) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}`;
}

function ScenarioCard({ title, accent, recommendations, metadata, profile, delay }) {
  const score = getTopScore(recommendations);
  const product = getTopLabel(recommendations);
  const topRecommendation = recommendations?.[0];

  return (
    <article
      className={`rounded-[2rem] border p-5 animate-reveal ${accent}`}
      style={{ animationDelay: delay }}
    >
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-400">
        <Icon name="compare" className="h-4 w-4 text-cyan-300" />
        {title}
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-white">{score}</h3>
      <p className="mt-1 text-sm text-[#9fb3c8]">Top product: {product}</p>
      <p className="mt-1 text-sm text-[#9fb3c8]">Evaluated: {metadata?.totalProductsEvaluated ?? 0}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {profile ? (
          <>
            <ProfileChip label="Risk" value={profile.riskLevel} />
            <ProfileChip label="Liquidity" value={profile.liquidityNeed} />
            <ProfileChip label="Horizon" value={profile.horizon} />
          </>
        ) : null}
      </div>

      {recommendations?.[0]?.explanation ? (
        <p className="mt-4 rounded-2xl border border-cyan-500/20 bg-[#0f1821] p-4 text-sm leading-6 text-[#e6edf3]">
          {recommendations[0].explanation}
        </p>
      ) : null}

      {topRecommendation ? (
        <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-[#0d151d] p-4 text-xs text-[#9fb3c8]">
          <p className="uppercase tracking-[0.3em] text-cyan-400">Why this score</p>
          <p className="mt-2 leading-5">
            Higher goal, liquidity, return, risk, and tenure scores combine into a deterministic total. The bars below show the strongest contributors.
          </p>
        </div>
      ) : null}
    </article>
  );
}

function ScoreDeltaBars({ baselineBreakdown, comparisonBreakdown }) {
  const fields = ["goal", "liquidity", "return", "risk", "tenure"];

  return (
    <div className="surface-soft tone-cyan section-rail-cyan grid gap-3 rounded-[1.75rem] p-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
          Δ
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Rationale explainer</p>
          <p className="text-sm text-[#9fb3c8]">Visual breakdown of which score factors changed between scenarios.</p>
        </div>
      </div>

      <div className="grid gap-3">
        {fields.map((field) => {
          const baselineValue = baselineBreakdown?.[field] ?? 0;
          const comparisonValue = comparisonBreakdown?.[field] ?? 0;
          const delta = comparisonValue - baselineValue;

          return (
            <div key={field} className="grid gap-2">
              <div className="flex items-center justify-between text-xs text-[#9fb3c8]">
                <span>{factorLabel(field)}</span>
                <span className={delta >= 0 ? "text-cyan-300" : "text-[#ffb020]"}>{formatDelta(delta)}</span>
              </div>
              <div className="relative h-1.5 rounded bg-gray-800">
                <div className="absolute inset-y-0 left-0 h-1.5 rounded bg-cyan-700/60" style={{ width: `${Math.max(8, (baselineValue / 35) * 100)}%` }} />
                <div className="absolute inset-y-0 left-0 h-1.5 rounded bg-cyan-400" style={{ width: `${Math.max(8, (comparisonValue / 35) * 100)}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-cyan-400/80">
                <span>Base {baselineValue.toFixed(2)}</span>
                <span>New {comparisonValue.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ComparisonSection({
  baselineRecommendations,
  comparisonRecommendations,
  baselineMetadata,
  comparisonMetadata,
  baselineProfile,
  comparisonProfile,
}) {
  const changedFields = getChangeList(baselineProfile, comparisonProfile);

  if (!baselineRecommendations?.length || !comparisonRecommendations?.length) {
    return null;
  }

  const scoreDelta = getTopScore(comparisonRecommendations) - getTopScore(baselineRecommendations);

  return (
    <section className="surface-shell tone-cyan section-rail-cyan grid gap-4 rounded-[2rem] p-5 animate-reveal">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-300">
            <Icon name="compare" className="h-4 w-4" />
            Scenario compare
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">See how the recommendation shifts</h2>
        </div>
        <p className="text-sm text-[#9fb3c8]">
          Score delta: <span className="font-semibold text-white">{scoreDelta >= 0 ? "+" : ""}{scoreDelta.toFixed(2)}</span>
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScenarioCard
          title="Scenario A - Baseline"
          accent="surface-soft tone-neutral section-rail-cyan border-cyan-500/20"
          recommendations={baselineRecommendations}
          metadata={baselineMetadata}
          profile={baselineProfile}
          delay="0ms"
        />
        <ScenarioCard
          title="Scenario B - Contrast"
          accent="surface-soft tone-green section-rail-green border-cyan-500/20"
          recommendations={comparisonRecommendations}
          metadata={comparisonMetadata}
          profile={comparisonProfile}
          delay="120ms"
        />
      </div>

      <ScoreDeltaBars
        baselineBreakdown={baselineRecommendations?.[0]?.breakdown}
        comparisonBreakdown={comparisonRecommendations?.[0]?.breakdown}
      />

      <div className="surface-soft tone-green section-rail-green rounded-[1.5rem] p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Changed inputs</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {changedFields.length ? (
            changedFields.map((field) => (
              <span key={field} className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                {profileFieldLabels[field] || field}: {humanizeValue(baselineProfile[field])} → {humanizeValue(comparisonProfile[field])}
              </span>
            ))
          ) : (
            <span className="text-sm text-[#9fb3c8]">The contrast scenario currently matches the baseline.</span>
          )}
        </div>
      </div>
    </section>
  );
}