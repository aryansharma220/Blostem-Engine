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

function buildSystemInsight(recommendation, userProfile) {
  if (userProfile?.liquidityNeed === "high") {
    return "Users with high liquidity preference are consistently matched with short-duration debt instruments over fixed deposits due to better flexibility-adjusted returns.";
  }

  if (userProfile?.riskLevel === "low") {
    return "Low-risk users are systematically routed to instruments that preserve capital stability while maintaining meaningful liquidity and return efficiency.";
  }

  return `The engine prioritizes ${driverLabel(getDominantDriver(recommendation.breakdown))} as the primary decision signal for this profile segment.`;
}

function buildBehavioralSegment(userProfile) {
  if (userProfile?.liquidityNeed === "high" && userProfile?.riskLevel === "low") {
    return "Behavioral segment: safety-first accumulator";
  }

  if (userProfile?.liquidityNeed === "high") {
    return "Behavioral segment: flexibility-led allocator";
  }

  if (userProfile?.riskLevel === "high") {
    return "Behavioral segment: return-seeking explorer";
  }

  return "Behavioral segment: balanced planner";
}

function buildDatasetPatterns(products = []) {
  if (!products.length) {
    return ["Dataset pattern: limited catalogue context available."];
  }

  const shortDurationCount = products.filter((product) => (product.tenureMonths ?? 0) <= 12).length;
  const highLiquidityCount = products.filter((product) => (product.liquidityScore ?? 0) >= 8).length;
  const categoryCounts = products.reduce((accumulator, product) => {
    const key = product.category || "unknown";
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  const dominantCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "mixed";

  return [
    `Dataset pattern: ${shortDurationCount} of ${products.length} instruments are short-duration, so flexibility is a recurring theme across the catalog.`,
    `Dataset pattern: ${highLiquidityCount} products score high on liquidity, creating a strong bias toward quick-access instruments.`,
    `Dataset pattern: ${driverLabel(dominantCategory)} appears most frequently in the catalog mix, shaping the recommendation distribution.`,
  ];
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

export default function TopRecommendationCard({ recommendation, alternatives = [], userProfile, products = [] }) {
  if (!recommendation) {
    return null;
  }

  const confidence = Math.max(0, Math.min(100, recommendation.confidence ?? 82));
  const confidenceBlocks = 10;
  const filledBlocks = Math.round((confidence / 100) * confidenceBlocks);
  const systemInsight = buildSystemInsight(recommendation, userProfile);
  const intelligenceNarrative = buildIntelligenceNarrative(recommendation, alternatives, userProfile);
  const behavioralSegment = buildBehavioralSegment(userProfile);
  const datasetPatterns = buildDatasetPatterns(products);

  return (
    <section className="surface-accent tone-cyan decision-glow section-rail-cyan relative rounded-[2rem] border-l-4 border-cyan-400 p-7 animate-reveal lg:translate-y-1">
      <p className="text-xs uppercase tracking-widest text-cyan-400">[ Decision Output ]</p>

      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[#9fb3c8]">System selected</p>
          <h2 className="brand-display text-3xl font-bold text-cyan-300 md:text-5xl">{recommendation.productName}</h2>
          <p className="mt-1 text-sm text-[#9fb3c8]">{humanizeValue(recommendation.category)} • Score {recommendation.score}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-[#00ff9f]">
            Confidence: {"█".repeat(filledBlocks)}{"░".repeat(confidenceBlocks - filledBlocks)} {confidence}%
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#9fb3c8]">Model certainty indicator</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="py-1">
          <p className="text-xs uppercase tracking-widest text-cyan-400">[ DECISION RATIONALE ]</p>
          <ul className="mt-3 space-y-2 text-sm text-[#e6edf3]">
            <li className="flex gap-2">
              <span className="text-cyan-300">✔</span>
              <span>Liquidity requirement ({userProfile?.liquidityNeed || "current"}) strongly matches product flexibility.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-300">✔</span>
              <span>Investment horizon aligns with short-duration structure.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-300">✔</span>
              <span>Return optimized within {userProfile?.riskLevel || "current"}-risk constraint.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[#ffb020]/20 bg-[#ffb020]/10 p-4 section-rail-warning">
          <p className="text-xs uppercase tracking-widest text-[#ffb020]">[ Trade-off Analysis ]</p>
          <ul className="mt-3 space-y-2 text-sm text-[#ffb020]">
            {(recommendation.tradeoffs || [recommendation.tradeOff]).map((item, index) => (
              <li key={`${recommendation.productId}-tradeoff-${index}`} className="flex gap-2">
                <span className="text-[#ffb020]">!</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 border-t border-cyan-500/20 pt-4">
        <p className="text-xs uppercase tracking-widest text-cyan-400">[ Behavioral Segmentation ]</p>
        <p className="mt-2 text-sm text-[#e6edf3]">{behavioralSegment}</p>
        <p className="mt-2 text-sm text-[#9fb3c8]">This profile is grouped with users who prioritize the same decision trade-offs.</p>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-[#0f1821] p-4 section-rail-green">
        <p className="text-xs uppercase tracking-widest text-[#00ff9f]">[ Dataset Pattern Detection ]</p>
        <ul className="mt-3 space-y-2 text-sm text-[#e6edf3]">
          {datasetPatterns.map((pattern, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-cyan-300">→</span>
              <span>{pattern}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-[#0f1821] p-4 section-rail-green">
        <p className="text-xs uppercase tracking-widest text-[#00ff9f]">[ System Insight ]</p>
        <p className="mt-2 text-sm text-[#e6edf3]">{systemInsight}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-[#0f1821] p-4 section-rail-green">
        <p className="text-xs uppercase tracking-widest text-[#00ff9f]">[ Non-Obvious Intelligence ]</p>
        <p className="mt-2 text-sm text-[#e6edf3]">{intelligenceNarrative}</p>
      </div>
    </section>
  );
}
