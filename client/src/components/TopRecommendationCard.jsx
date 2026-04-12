import { humanizeValue } from "../utils/labels";

function getDominantDriver(breakdown = {}) {
  const entries = Object.entries(breakdown);
  if (!entries.length) {
    return "overall fit";
  }

  const [driver] = entries.sort((a, b) => b[1] - a[1])[0];
  return driver;
}

function driverLabel(driver) {
  const labels = {
    goal: "goal fit",
    liquidity: "liquidity alignment",
    return: "return potential",
    risk: "risk alignment",
    tenure: "tenure fit",
  };

  return labels[driver] || humanizeValue(driver);
}

function buildIntelligenceNarrative(recommendation, alternatives, userProfile) {
  const nextBest = alternatives?.[0];
  if (!nextBest) {
    return "Current ranking remains stable because the strongest weighted signals align on goal and liquidity simultaneously.";
  }

  const scoreGap = Number((recommendation.score - nextBest.score).toFixed(2));
  const dominantDriver = getDominantDriver(recommendation.breakdown);
  const top = recommendation.breakdown || {};
  const alt = nextBest.breakdown || {};

  const deltas = {
    goal: Number(((top.goal ?? 0) - (alt.goal ?? 0)).toFixed(2)),
    liquidity: Number(((top.liquidity ?? 0) - (alt.liquidity ?? 0)).toFixed(2)),
    return: Number(((top.return ?? 0) - (alt.return ?? 0)).toFixed(2)),
    risk: Number(((top.risk ?? 0) - (alt.risk ?? 0)).toFixed(2)),
    tenure: Number(((top.tenure ?? 0) - (alt.tenure ?? 0)).toFixed(2)),
  };

  const isLowRiskUser = userProfile?.riskLevel === "low";
  const isHighLiquidityUser = userProfile?.liquidityNeed === "high";
  const isLongHorizonUser = ["12-24 months", "24+ months"].includes(userProfile?.horizon);

  if (isLowRiskUser && deltas.return < -1 && deltas.risk > 1) {
    return `Risk-penalty override detected: despite a ${Math.abs(deltas.return).toFixed(2)} lower return contribution versus the next option, this recommendation remains first because risk alignment adds +${deltas.risk.toFixed(2)} and preserves a net +${scoreGap} edge.`;
  }

  if (isHighLiquidityUser && isLongHorizonUser && deltas.liquidity > 1 && deltas.tenure < 0) {
    return `Horizon-liquidity conflict resolved in favor of flexibility: even with weaker tenure contribution (${deltas.tenure.toFixed(2)} delta), the model prioritizes liquidity (+${deltas.liquidity.toFixed(2)}) and keeps a +${scoreGap} lead.`;
  }

  if (deltas.tenure > 2 && deltas.return <= 0) {
    return `Tenure-dominance pattern: this option wins by matching the expected holding window better (+${deltas.tenure.toFixed(2)} tenure delta), which offsets return parity and secures a +${scoreGap} total advantage.`;
  }

  if (deltas.goal > 2) {
    return `Goal-anchor effect detected: the recommendation holds first place because goal fit adds +${deltas.goal.toFixed(2)} over the next option, resulting in a durable +${scoreGap} system lead.`;
  }

  if (deltas.return < 0) {
    return `Even with ${Math.abs(deltas.return).toFixed(2)} lower return contribution than the next option, the model still ranks this first because ${driverLabel(dominantDriver)} creates a net +${scoreGap} decision edge.`;
  }

  return `This option leads by +${scoreGap} over the next candidate, primarily driven by stronger ${driverLabel(dominantDriver)} in the weighted model.`;
}

export default function TopRecommendationCard({ recommendation, alternatives = [], userProfile }) {
  if (!recommendation) {
    return null;
  }

  const confidence = Math.max(0, Math.min(100, recommendation.confidence ?? 82));
  const confidenceBlocks = 10;
  const filledBlocks = Math.round((confidence / 100) * confidenceBlocks);
  const intelligenceNarrative = buildIntelligenceNarrative(recommendation, alternatives, userProfile);

  return (
    <section className="surface-accent relative rounded-[2rem] border-l-4 border-cyan-300 p-7 shadow-[0_0_0_1px_rgba(103,232,249,0.24),0_40px_130px_rgba(8,145,178,0.22)] animate-reveal lg:translate-y-1">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_24%,transparent_74%,rgba(255,255,255,0.03))]" />
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">[ Decision Output ]</p>

      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">System selected</p>
          <h2 className="brand-display text-6xl font-semibold text-cyan-100 md:text-7xl">{recommendation.productName}</h2>
          <p className="mt-1 text-sm text-slate-300">{humanizeValue(recommendation.category)} • Score {recommendation.score}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-emerald-300">
            Confidence: {"█".repeat(filledBlocks)}{"░".repeat(confidenceBlocks - filledBlocks)} {confidence}%
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Model certainty indicator</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">[ Why This Was Selected ]</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-100">
          {(recommendation.reasons || []).slice(0, 3).map((reason, index) => (
              <li key={`${recommendation.productId}-reason-${index}`} className="flex gap-2">
                <span className="text-cyan-300">→</span>
                <span>{reason}</span>
              </li>
          ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-200">[ Trade-off Analysis ]</p>
          <ul className="mt-3 space-y-2 text-sm text-amber-100">
          {(recommendation.tradeoffs || [recommendation.tradeOff]).map((item, index) => (
              <li key={`${recommendation.productId}-tradeoff-${index}`} className="flex gap-2">
                <span className="text-amber-200">!</span>
                <span>{item}</span>
              </li>
          ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">[ Behavioral Insight Layer ]</p>
        <p className="mt-2 text-sm text-slate-100">{recommendation.insight}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
        <p className="text-xs uppercase tracking-[0.28em] text-emerald-200">[ Non-Obvious Intelligence ]</p>
        <p className="mt-2 text-sm text-emerald-50">{intelligenceNarrative}</p>
      </div>
    </section>
  );
}
