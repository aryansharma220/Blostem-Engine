import { scoreProduct } from "./scoringService.js";
import { buildExplanation } from "./explanationService.js";

function tieBreaker(a, b) {
  if (b.score !== a.score) {
    return b.score - a.score;
  }

  if (a.breakdown.risk !== b.breakdown.risk) {
    return b.breakdown.risk - a.breakdown.risk;
  }

  if (a.breakdown.goal !== b.breakdown.goal) {
    return b.breakdown.goal - a.breakdown.goal;
  }

  return a.productId.localeCompare(b.productId);
}

export function buildRecommendations(userProfile, products) {
  const scored = products.map((product) => {
    const scoredProduct = scoreProduct(userProfile, product, products);

    return {
      ...scoredProduct,
      product,
    };
  });

  const ranked = [...scored].sort(tieBreaker);

  const auditLog = [];
  for (let index = 1; index < ranked.length; index += 1) {
    const previous = ranked[index - 1];
    const current = ranked[index];

    if (previous.score === current.score) {
      let ruleUsed = "productId";
      if (previous.breakdown.risk !== current.breakdown.risk) {
        ruleUsed = "risk";
      } else if (previous.breakdown.goal !== current.breakdown.goal) {
        ruleUsed = "goal";
      }

      auditLog.push({
        pair: [previous.productId, current.productId],
        tiedOnScore: previous.score,
        ruleUsed,
      });
    }
  }

  const recommendations = ranked.slice(0, 3).map((item) => {
    const explanation = buildExplanation({
      userProfile,
      product: item.product,
      scoredProduct: item,
    });

    return {
      productId: item.productId,
      productName: item.productName,
      category: item.category,
      score: item.score,
      confidence: Math.min(100, Math.round(item.score * 0.95)),
      breakdown: item.breakdown,
      tradeOff: item.tradeOff,
      explanation: explanation.summary,
      reasons: explanation.reasons,
      tradeoffs: explanation.tradeoffs,
      insight: explanation.insight,
    };
  });

  return {
    recommendations,
    auditLog,
  };
}
