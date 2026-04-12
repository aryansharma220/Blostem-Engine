import test from "node:test";
import assert from "node:assert/strict";
import app from "../app.js";

function startServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

const userProfile = {
  ageGroup: "20-30",
  incomeRange: "3-6L",
  goal: "short_term",
  horizon: "6-12 months",
  liquidityNeed: "high",
  riskLevel: "low",
};

test("GET /health returns ok", async () => {
  const { server, port } = await startServer();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(data, { status: "ok" });
  } finally {
    server.close();
  }
});

test("POST /api/recommend returns top 3 recommendations", async () => {
  const { server, port } = await startServer();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userProfile }),
    });

    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.recommendations.length, 3);
    assert.equal(data.recommendations[0].productId, "DMF002");
    assert.equal(data.metadata.totalProductsEvaluated, 20);
    assert.equal(data.metadata.weights.goal, 35);
    assert.ok(Array.isArray(data.metadata.tieBreakAudit));
  } finally {
    server.close();
  }
});

test("POST /api/explain returns deterministic explanation", async () => {
  const { server, port } = await startServer();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userProfile,
        product: { id: "DMF002" },
      }),
    });

    const first = await response.json();

    const secondResponse = await fetch(`http://127.0.0.1:${port}/api/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userProfile,
        product: { id: "DMF002" },
      }),
    });

    const second = await secondResponse.json();

    assert.equal(response.status, 200);
    assert.equal(first.explanation, second.explanation);
    assert.ok(first.explanation.length > 0);
  } finally {
    server.close();
  }
});