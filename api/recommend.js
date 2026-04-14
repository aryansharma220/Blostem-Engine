import { buildRecommendationResponse, sendJson, validateUserProfile } from "./_lib.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const { userProfile } = req.body || {};
  const missingFields = validateUserProfile(userProfile);

  if (missingFields.length > 0) {
    return sendJson(res, 400, {
      error: "Invalid user profile",
      details: `Missing fields: ${missingFields.join(", ")}`,
    });
  }

  return sendJson(res, 200, buildRecommendationResponse(userProfile));
}