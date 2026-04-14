# Deciora

Deciora is an explainable fintech decision system that transforms user preferences and product data into ranked, defensible recommendations with explicit trade-off reasoning.

## Problem Statement

Retail investing interfaces are usually search-and-filter experiences. Users get a list of products, but not a decision. In practice, this creates three recurring failures:

- People do not understand which trade-offs they are accepting.
- Platforms optimize for product exposure, not user fit.
- Recommendations are often opaque, making them hard to trust.

In short, most systems show options. Very few systems make and explain decisions.

## Solution Overview

Deciora is designed as a decision layer, not a static dashboard.

High-level flow:

1. Collect structured user inputs (goal, horizon, liquidity, risk, and profile context).
2. Score every product through a deterministic weighted model.
3. Rank products with tie-break logic to ensure stable ordering.
4. Return top recommendations with rationale, trade-offs, and system insight.
5. Allow scenario comparison to show how decisions shift when user preferences shift.

This keeps the process transparent from input to final recommendation.

## System Design

### 1. Input Layer

The system accepts explicit decision signals:

- Age group
- Income range
- Investment goal
- Time horizon
- Liquidity need
- Risk appetite

Inputs are validated before scoring to avoid low-quality recommendations from incomplete profiles.

### 2. Decision Model

Each product is evaluated across five weighted signals:

- Goal fit
- Liquidity alignment
- Return potential
- Risk alignment
- Tenure alignment

The model is deterministic and auditable. The same profile and product universe always produce the same result.

### 3. Ranking Engine

All products are scored and sorted. In tied-score cases, deterministic tie-break rules are applied (risk alignment, then goal alignment, then stable identifier ordering). This prevents random ranking drift across runs.

### 4. Explanation Layer

For every top recommendation, the system generates:

- Decision rationale (why this ranked highest)
- Trade-off analysis (what is gained and what is sacrificed)
- Structured insight (behavioral and dataset-level signals)

This turns the recommendation from a score into a decision narrative.

### 5. Scenario Engine

The interface supports baseline vs. contrast profiles, enabling users to test how recommendation outcomes shift under different risk, liquidity, or horizon assumptions.

## Decision Logic

The scoring model is a weighted sum:

Score(product, profile) =
0.35 * goal_fit +
0.25 * liquidity_fit +
0.20 * return_score +
0.10 * risk_fit +
0.10 * tenure_fit

Current operational weights:

- Goal match: 35%
- Liquidity match: 25%
- Return contribution: 20%
- Risk match: 10%
- Tenure match: 10%

Engineering constraints and rules:

- Deterministic outputs (no random ranking behavior)
- Input validation for required profile fields
- Explicit tie-break strategy for equal scores
- Explainability attached to ranked outputs

## Key Capabilities

### Core Engine

- Profile-to-decision scoring pipeline
- Product ranking with deterministic ordering
- Top recommendation selection with confidence framing

### Explainability

- [DECISION RATIONALE] output for each top recommendation
- [WEIGHTED SIGNAL CONTRIBUTION] transparency view
- Trade-off analysis for realistic expectation setting

### Intelligence Layer

- System insights derived from model behavior
- Non-obvious narrative across competing options
- Behavioral segmentation and dataset pattern detection

### Scenario Simulation

- Baseline vs. scenario-B comparison
- Saved timeline snapshots for decision history

## Intelligence and Insights

The system goes beyond static rule output. It produces decision intelligence in four forms:

- Pattern detection across the product universe
- Behavioral alignment for user preference profiles
- Trade-off reasoning between top-ranked alternatives
- System-level insight summarizing dominant decision signals

This helps users understand not only what to choose, but why the model chose it.

## Scalability and Real-World Applicability

Deciora is designed to map into production fintech workflows:

- Banking and neo-banking recommendation flows
- Wealth advisory pre-screening experiences
- Product marketplaces that need explainable ranking

Why this can scale beyond prototype stage:

- Weight model is configurable by business context
- Scoring and explanation logic are modularized service layers
- API-first architecture supports integration into external clients
- Deployment supports a single-unit Vercel setup (frontend + serverless APIs)

## Example Flow

Example profile:

- Goal: short term
- Horizon: 6-12 months
- Liquidity need: high
- Risk appetite: low

System processing:

1. Loads product universe.
2. Computes weighted score for each product.
3. Applies deterministic tie-breaks where needed.
4. Returns top-ranked options and confidence indicators.
5. Produces rationale and trade-off explanation for the selected recommendation.

Result:

- A ranked recommendation set
- Transparent weighted signal contribution
- A clear explanation of why the top choice is selected over alternatives

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend logic: Node.js, Express service modules
- Data: Structured JSON product dataset
- Deployment: Vercel (static frontend + serverless API routes)

## Local Run

1. Install all dependencies:

```bash
npm run install:all
```

2. Start backend in terminal 1:

```bash
npm run dev:server
```

3. Start frontend in terminal 2:

```bash
npm run dev:client
```

4. Open:

- http://localhost:5173

## Vercel Deployment (Single Unit)

This repository is configured to deploy as one Vercel project:

- Frontend static output from `client/dist`
- API routes served from `/api/*` via serverless functions

Deployment steps:

1. Push `main` to GitHub.
2. Import repository into Vercel.
3. Keep root directory as repository root.
4. Ensure env var is set:
   - `VITE_API_BASE_URL=/api`
5. Deploy and verify:
   - `/api/health`
   - `/api/products`

## Limitations and Future Work

Current limitations:

- Static product dataset (no live market feed)
- Rule-based scoring without adaptive learning
- No user outcome feedback loop yet

Next improvements:

- Real-time rate and product ingestion
- Feedback-based calibration of signal weights
- Policy constraints per partner institution
- Offline evaluation suite for recommendation quality metrics

## Final Positioning

Deciora demonstrates how decision engines can replace static product listings with intelligent, explainable, and operationally trustworthy financial recommendations.
