# Blostem Insight Engine (MVP)

Blostem Insight Engine is a deterministic decision engine that scores financial products against a user profile and returns ranked, explainable recommendations.

## Tech Stack

- Frontend: React + Vite + Tailwind + Recharts
- Backend: Node.js + Express
- Data: Static JSON dataset (offline)

## Project Structure

- client/ - React frontend
- server/ - Express backend
- requirements.md - product requirements

## Implemented Features (Current)

- Multi-category dataset (Fixed Deposits, Recurring Deposits, Debt Mutual Funds)
- Deterministic scoring engine using weighted rules
- Top-3 ranking engine with tie-break logic
- Deterministic explanation and trade-off generation
- APIs:
  - GET /api/products
  - POST /api/recommend
  - POST /api/explain
- Frontend flow:
  - User profile form
  - Recommendation cards
  - Score comparison chart
  - Breakdown table

## Run Locally

1. Install dependencies for both apps:

```bash
npm run install:all
```

1. Start backend (terminal 1):

```bash
npm run dev:server
```

1. Start frontend (terminal 2):

```bash
npm run dev:client
```

1. Open frontend at [http://localhost:5173](http://localhost:5173)

## Environment

Copy `.env.example` to `.env` if you want to override the API base URL for deployment.

For local development with separate frontend and backend processes, the default API base is `http://localhost:4000/api`.

## API Example

POST /api/recommend

```json
{
  "userProfile": {
    "ageGroup": "20-30",
    "incomeRange": "3-6L",
    "goal": "short_term",
    "horizon": "6-12 months",
    "liquidityNeed": "high",
    "riskLevel": "low"
  }
}
```

## Next Implementation Steps

- Add automated unit and integration tests
- Add downloadable/shareable report option
- Add optional LLM fallback behind feature flag
- Deploy frontend and backend
