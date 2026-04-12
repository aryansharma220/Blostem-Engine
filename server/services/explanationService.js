function getTopDrivers(breakdown) {
  return Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => key);
}

function labelDriver(driver) {
  const labels = {
    goal: "your investment goal",
    liquidity: "your liquidity preference",
    return: "its return potential",
    risk: "your risk preference",
    tenure: "your time horizon",
  };

  return labels[driver] || driver;
}

function getDriverReason(driver) {
  const map = {
    goal: "Your investment goal is a strong match for this product.",
    liquidity: "Liquidity level aligns with your preference.",
    return: "Return potential is competitive for your profile.",
    risk: "Risk level is aligned with your risk appetite.",
    tenure: "Tenure aligns well with your time horizon.",
  };

  return map[driver] || "This factor supports your profile match.";
}

function getInsight(userProfile) {
  if (userProfile?.liquidityNeed === "high") {
    return "Users with high liquidity preference are typically matched with short-duration instruments over fixed long-term options.";
  }

  if (userProfile?.riskLevel === "low") {
    return "Low-risk users are usually guided toward stable products where downside variance is limited.";
  }

  return "Recommendation quality improves when goal, tenure, and risk stay aligned.";
}

export function buildExplanation({ userProfile, product, scoredProduct }) {
  const topDrivers = getTopDrivers(scoredProduct.breakdown);
  const [primary, secondary] = topDrivers;

  const reasons = [getDriverReason(primary), getDriverReason(secondary)];

  if (userProfile.riskLevel === "low" && product.riskTag === "low") {
    reasons.push("Risk profile is conservative and closely aligned.");
  } else if (userProfile.riskLevel !== product.riskTag) {
    reasons.push("Overall fit remains strong despite a slight risk mismatch.");
  }

  return {
    summary: `${product.name} aligns strongly with ${labelDriver(primary)} and ${labelDriver(secondary)}.`,
    reasons,
    tradeoffs: [scoredProduct.tradeOff],
    insight: getInsight(userProfile),
  };
}
