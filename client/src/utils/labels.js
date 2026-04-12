export function humanizeValue(value = "") {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const profileFieldLabels = {
  riskLevel: "Risk",
  liquidityNeed: "Liquidity",
  horizon: "Horizon",
  goal: "Goal",
};

export const goalOptions = [
  { value: "short_term", label: "Short-term" },
  { value: "wealth_growth", label: "Wealth Growth" },
  { value: "capital_preservation", label: "Capital Preservation" },
  { value: "goal_based_saving", label: "Goal-based Saving" },
];

export const liquidityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const riskOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
