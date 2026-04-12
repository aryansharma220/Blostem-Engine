import test from "node:test";
import assert from "node:assert/strict";
import products from "../data/products.json" with { type: "json" };
import { scoreProduct } from "../services/scoringService.js";
import { buildRecommendations } from "../services/recommendationService.js";
import { buildExplanation } from "../services/explanationService.js";

const userProfile = {
  ageGroup: "20-30",
  incomeRange: "3-6L",
  goal: "short_term",
  horizon: "6-12 months",
  liquidityNeed: "high",
  riskLevel: "low",
};

test("scoreProduct returns a bounded deterministic score breakdown", () => {
  const product = products.find((item) => item.id === "DMF002");
  const scored = scoreProduct(userProfile, product, products);

  assert.equal(scored.productId, "DMF002");
  assert.equal(scored.score, 85.86);
  assert.equal(scored.breakdown.goal, 35);
  assert.equal(scored.breakdown.liquidity, 22.5);
  assert.equal(scored.breakdown.return, 12.86);
  assert.equal(scored.breakdown.risk, 5.5);
  assert.equal(scored.breakdown.tenure, 10);
  assert.ok(scored.score <= 100);
  assert.ok(scored.score >= 0);
});

test("buildRecommendations returns top 3 sorted recommendations with explanations", () => {
  const { recommendations, auditLog } = buildRecommendations(userProfile, products);

  assert.equal(recommendations.length, 3);
  assert.equal(recommendations[0].productId, "DMF002");
  assert.ok(recommendations[0].explanation.includes("Short Duration Debt Plus"));
  assert.ok(recommendations[0].tradeOff.length > 0);
  assert.ok(Array.isArray(auditLog));

  const scores = recommendations.map((item) => item.score);
  const sortedScores = [...scores].sort((a, b) => b - a);
  assert.deepEqual(scores, sortedScores);
});

test("buildExplanation is deterministic for the same inputs", () => {
  const product = products.find((item) => item.id === "DMF002");
  const scored = scoreProduct(userProfile, product, products);

  const first = buildExplanation({ userProfile, product, scoredProduct: scored });
  const second = buildExplanation({ userProfile, product, scoredProduct: scored });

  assert.deepEqual(first, second);
});

test("calibration profile: high liquidity + low risk still surfaces trade-offs deterministically", () => {
  const conflictProfile = {
    ageGroup: "30-45",
    incomeRange: "6-12L",
    goal: "wealth_growth",
    horizon: "0-6 months",
    liquidityNeed: "high",
    riskLevel: "low",
  };

  const { recommendations } = buildRecommendations(conflictProfile, products);

  assert.equal(recommendations.length, 3);
  assert.ok(recommendations.every((item) => typeof item.tradeOff === "string"));
  assert.ok(recommendations[0].score >= recommendations[1].score);
  assert.ok(recommendations[1].score >= recommendations[2].score);
});

test("missing field products are scored without crashing", () => {
  const sparseProduct = products.find((item) => item.id === "EDGE001");
  const scored = scoreProduct(userProfile, sparseProduct, products);

  assert.equal(scored.productId, "EDGE001");
  assert.ok(Number.isFinite(scored.score));
  assert.ok(scored.breakdown.tenure >= 0);
});