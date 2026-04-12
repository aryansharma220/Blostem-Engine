import { getAllProducts, getProductById } from "../services/productService.js";
import { buildRecommendations } from "../services/recommendationService.js";
import { buildExplanation } from "../services/explanationService.js";
import { scoreProduct, WEIGHTS } from "../services/scoringService.js";

function validateUserProfile(userProfile) {
  const requiredFields = [
    "ageGroup",
    "incomeRange",
    "goal",
    "horizon",
    "liquidityNeed",
    "riskLevel",
  ];

  const missingFields = requiredFields.filter((field) => !userProfile?.[field]);
  return missingFields;
}

export function getProducts(req, res) {
  res.json({ products: getAllProducts() });
}

export function recommendProducts(req, res) {
  const { userProfile } = req.body;
  const missingFields = validateUserProfile(userProfile);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Invalid user profile",
      details: `Missing fields: ${missingFields.join(", ")}`,
    });
  }

  const products = getAllProducts();
  const { recommendations, auditLog } = buildRecommendations(userProfile, products);

  return res.json({
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
  });
}

export function explainProduct(req, res) {
  const { userProfile, product } = req.body;

  const missingFields = validateUserProfile(userProfile);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Invalid user profile",
      details: `Missing fields: ${missingFields.join(", ")}`,
    });
  }

  const resolvedProduct = product?.id ? getProductById(product.id) : null;

  if (!resolvedProduct) {
    return res.status(400).json({
      error: "Invalid product",
      details: "Provide a valid product.id from /api/products.",
    });
  }

  const products = getAllProducts();
  const scoredProduct = scoreProduct(userProfile, resolvedProduct, products);
  const explanation = buildExplanation({
    userProfile,
    product: resolvedProduct,
    scoredProduct,
  });

  return res.json({
    explanation: explanation.summary,
    reasons: explanation.reasons,
    tradeoffs: explanation.tradeoffs,
    insight: explanation.insight,
  });
}
