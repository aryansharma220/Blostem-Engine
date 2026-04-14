import { getAllProducts, getProductById } from "../server/services/productService.js";
import { buildRecommendations } from "../server/services/recommendationService.js";
import { buildExplanation } from "../server/services/explanationService.js";
import { scoreProduct, WEIGHTS } from "../server/services/scoringService.js";

const REQUIRED_FIELDS = ["ageGroup", "incomeRange", "goal", "horizon", "liquidityNeed", "riskLevel"];

export function validateUserProfile(userProfile) {
  return REQUIRED_FIELDS.filter((field) => !userProfile?.[field]);
}

export function buildRecommendationResponse(userProfile) {
  const products = getAllProducts();
  const { recommendations, auditLog } = buildRecommendations(userProfile, products);

  return {
    recommendations,
    metadata: {
      totalProductsEvaluated: products.length,
      topScore: recommendations[0]?.score ?? 0,
      weights: {
        goal: WEIGHTS.goal,
        liquidity: WEIGHTS.liquidity,
        return: WEIGHTS.returnRate,
        risk: WEIGHTS.risk,
        tenure: WEIGHTS.tenure,
      },
      tieBreakAudit: auditLog,
    },
  };
}

export function buildExplanationResponse(userProfile, productId) {
  const resolvedProduct = productId ? getProductById(productId) : null;

  if (!resolvedProduct) {
    return null;
  }

  const products = getAllProducts();
  const scoredProduct = scoreProduct(userProfile, resolvedProduct, products);
  const explanation = buildExplanation({
    userProfile,
    product: resolvedProduct,
    scoredProduct,
  });

  return {
    explanation: explanation.summary,
    reasons: explanation.reasons,
    tradeoffs: explanation.tradeoffs,
    insight: explanation.insight,
  };
}

export function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}