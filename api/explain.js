import { buildExplanationResponse, sendJson, validateUserProfile } from "./_lib.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const { userProfile, product } = req.body || {};
  const missingFields = validateUserProfile(userProfile);

  if (missingFields.length > 0) {
    return sendJson(res, 400, {
      error: "Invalid user profile",
      details: `Missing fields: ${missingFields.join(", ")}`,
    });
  }

  const response = buildExplanationResponse(userProfile, product?.id);

  if (!response) {
    return sendJson(res, 400, {
      error: "Invalid product",
      details: "Provide a valid product.id from /api/products.",
    });
  }

  return sendJson(res, 200, response);
}