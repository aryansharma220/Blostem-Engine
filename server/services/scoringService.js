export const WEIGHTS = {
  goal: 35,
  liquidity: 25,
  returnRate: 20,
  risk: 10,
  tenure: 10,
};

const RISK_LEVELS = ["low", "medium", "high"];

function normalize(value, min, max) {
  if (max === min) {
    return 1;
  }

  return (value - min) / (max - min);
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapHorizonToMonths(horizon = "") {
  const map = {
    "0-6 months": 6,
    "6-12 months": 12,
    "12-24 months": 24,
    "24+ months": 36,
  };

  return map[horizon] || 12;
}

function scoreGoalMatch(userProfile, product) {
  const goal = userProfile.goal;
  const goalFit = Array.isArray(product.goalFitTags)
    ? product.goalFitTags.includes(goal)
    : false;

  return goalFit ? WEIGHTS.goal : WEIGHTS.goal * 0.35;
}

function scoreLiquidityMatch(userProfile, product) {
  const need = userProfile.liquidityNeed;
  const liquidity = toNumber(product.liquidityScore, 5.5);

  let closeness = 0.5;

  if (need === "high") {
    closeness = liquidity / 10;
  } else if (need === "medium") {
    closeness = 1 - Math.abs(liquidity - 6) / 10;
  } else if (need === "low") {
    closeness = 1 - liquidity / 12;
  }

  return Math.max(0, Math.min(WEIGHTS.liquidity, closeness * WEIGHTS.liquidity));
}

function scoreReturnRate(product, products) {
  const rates = products
    .map((item) => Number(item.returnRate))
    .filter((value) => Number.isFinite(value));

  if (!rates.length) {
    return WEIGHTS.returnRate * 0.5;
  }

  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);

  const productRate = toNumber(product.returnRate, (minRate + maxRate) / 2);
  const normalized = normalize(productRate, minRate, maxRate);
  return normalized * WEIGHTS.returnRate;
}

function scoreRiskMatch(userProfile, product) {
  const userRisk = RISK_LEVELS.indexOf(userProfile.riskLevel || "low");
  const productRisk = RISK_LEVELS.indexOf(product.riskTag || "low");
  const distance = Math.abs(userRisk - productRisk);

  const scoreFactor = distance === 0 ? 1 : distance === 1 ? 0.55 : 0.2;
  return scoreFactor * WEIGHTS.risk;
}

function scoreTenureMatch(userProfile, product) {
  const desiredMonths = mapHorizonToMonths(userProfile.horizon);
  const tenureMonths = toNumber(product.tenureMonths, desiredMonths);
  const distance = Math.abs(desiredMonths - tenureMonths);

  let scoreFactor = 0.35;
  if (distance <= 3) {
    scoreFactor = 1;
  } else if (distance <= 8) {
    scoreFactor = 0.7;
  } else if (distance <= 14) {
    scoreFactor = 0.45;
  }

  return scoreFactor * WEIGHTS.tenure;
}

function buildTradeOffMessage(product) {
  const returnRate = toNumber(product.returnRate, 7.2);
  const liquidityScore = toNumber(product.liquidityScore, 5.5);

  if (returnRate >= 8 && liquidityScore <= 5) {
    return "Higher return, but liquidity is relatively limited.";
  }

  if (returnRate < 7.2 && liquidityScore >= 8) {
    return "Better liquidity, but returns are modest compared with alternatives.";
  }

  if (product.riskTag === "medium") {
    return "Return potential is stronger, with slightly higher risk than low-risk products.";
  }

  return "Balanced profile with no major trade-off against your preferences.";
}

export function scoreProduct(userProfile, product, products) {
  const breakdown = {
    goal: scoreGoalMatch(userProfile, product),
    liquidity: scoreLiquidityMatch(userProfile, product),
    return: scoreReturnRate(product, products),
    risk: scoreRiskMatch(userProfile, product),
    tenure: scoreTenureMatch(userProfile, product),
  };

  const score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  return {
    productId: product.id,
    productName: product.name,
    category: product.category,
    score: Number(score.toFixed(2)),
    breakdown: {
      goal: Number(breakdown.goal.toFixed(2)),
      liquidity: Number(breakdown.liquidity.toFixed(2)),
      return: Number(breakdown.return.toFixed(2)),
      risk: Number(breakdown.risk.toFixed(2)),
      tenure: Number(breakdown.tenure.toFixed(2)),
    },
    tradeOff: buildTradeOffMessage(product),
  };
}
