# Blostem Insight Engine (MVP)

## Overview

Blostem Insight Engine is a decision-support system that converts user financial preferences and raw product data into **ranked, explainable financial recommendations**.

This is not a dashboard or chatbot. It is a **decision engine** designed to:

* Evaluate financial products (e.g., Fixed Deposits)
* Match them against user profiles
* Rank the best options
* Explain *why* those options are suitable

---

## Core Objective

Build a working MVP that:

1. Accepts user input (financial profile)
2. Evaluates a dataset of financial products
3. Scores and ranks products
4. Generates clear, human-readable explanations
5. Displays results with simple analytics

---

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Recharts (for charts)

### Backend

* Node.js
* Express.js

### Data

* Static JSON dataset (no external APIs required)

### Optional

* OpenAI / Claude API (for explanation generation fallback)

---

## Folder Structure

```
root/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── index.html
│
├── server/                 # Node backend
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── data/
│   │   └── products.json
│   └── index.js
│
├── README.md
└── package.json
```

---

## Data Model

### UserProfile

```json
{
  "ageGroup": "20-30",
  "incomeRange": "3-6L",
  "goal": "short_term",
  "horizon": "6-12 months",
  "liquidityNeed": "high",
  "riskLevel": "low"
}
```

### FinancialProduct

```json
{
  "id": "FD001",
  "name": "Bank A FD",
  "returnRate": 8.5,
  "tenure": "12 months",
  "liquidityScore": 7,
  "riskTag": "low",
  "minAmount": 10000
}
```

---

## Core Features

### 1. User Input Form

* Collect:

  * Age group
  * Income range
  * Investment goal
  * Time horizon
  * Liquidity preference
  * Risk appetite

---

### 2. Scoring Engine (IMPORTANT)

Implement a rule-based scoring system.

#### Scoring Weights:

* Goal Match → 35%
* Liquidity Match → 25%
* Return Rate → 20%
* Risk Match → 10%
* Tenure Match → 10%

#### Output:

```json
{
  "productId": "FD001",
  "score": 82,
  "breakdown": {
    "goal": 30,
    "liquidity": 20,
    "return": 18,
    "risk": 7,
    "tenure": 7
  }
}
```

---

### 3. Recommendation Engine

* Rank all products by score
* Return top 3
* Include:

  * Score
  * Key reason
  * Trade-off (optional)

---

### 4. Explanation Layer

Generate explanation like:

> "This FD is suitable because you prefer low risk and high liquidity, and it offers a competitive return for short-term investment."

Rules:

* Must be deterministic (no random output)
* If using LLM → add fallback logic

---

### 5. Insights Dashboard

Include:

* Bar chart: product scores
* Comparison table
* Optional: user segment tagging

---

## API Endpoints

### POST /api/recommend

Input:

```json
{
  "userProfile": {...}
}
```

Output:

```json
{
  "recommendations": [...]
}
```

---

### GET /api/products

Returns all products

---

### POST /api/explain

Input:

```json
{
  "userProfile": {...},
  "product": {...}
}
```

Output:

```json
{
  "explanation": "..."
}
```

---

## UI Pages

### 1. Home Page

* Input form
* CTA: "Get Recommendations"

### 2. Results Page

* Top 3 recommendations
* Scores
* Explanation
* Comparison chart

### 3. Insights Section

* Graphs
* Product comparison

---

## Key Constraints

* Must work fully offline (except optional AI API)
* No authentication required
* No real banking integration
* Keep UI minimal and functional
* Focus on correctness over design

---

## Definition of Done

The MVP is complete when:

* User submits profile
* System returns ranked recommendations
* Each recommendation has explanation
* Charts render correctly
* App runs locally and on deployment without errors

---

## Demo Flow (IMPORTANT)

1. Enter user profile
2. Click "Get Recommendations"
3. Show top 3 products
4. Explain why each was selected
5. Show comparison chart
6. Highlight decision logic

---

## Non-Goals

Do NOT build:

* Full ML pipeline
* Authentication system
* Real bank integrations
* Complex UI animations
* Generic chatbot interface

---

## Development Plan

* Setup project
* Create dataset
* Define scoring logic

* Build backend APIs
* Implement scoring engine

* Build frontend form + results UI

* Add charts + comparison

* Add explanation logic


* Testing + bug fixing


* Final polish + deployment

---

## Final Note

This project should feel like a **decision engine**, not a generic finance app.

Focus on:

* Clear logic
* Working system
* Strong explanation

Avoid:

* Overengineering
* Feature bloat
* Chatbot-first design



Build **Track 03: Data Analytics & Insights**. It is the cleanest fit for a one-week MVP because the brief explicitly rewards a **working build**, not slides, and scores submissions on **relevance, execution, innovation, narrative, and potential**. A data/decision engine is much easier to make real, explain clearly, and demo convincingly than a generic chatbot or a broad enterprise automation tool. 

# Recommended MVP

## Project title

**Blostem Insight Engine**

## One-line product definition

A fintech decision engine that takes a user profile and a product dataset, then returns the **best-matched financial option** with a transparent explanation and simple analytics.

## Why this is shortlist-friendly

It matches the track’s core theme: turning raw data into actionable decisions. It also gives you a strong demo story: **input → scoring → ranked recommendations → explanation → insight dashboard**. 

---

# Exact Requirements Document

## 1) Problem statement

Most users cannot compare financial products properly because the data is fragmented, jargon-heavy, and not personalized. The product should convert a raw profile plus product data into a ranked, explainable recommendation.

## 2) Target user

A basic fintech user such as:

* a first-time saver
* a low-risk investor
* a user comparing fixed deposits
* a user trying to understand which option matches their goal

## 3) MVP objective

Deliver a functioning web app that:

1. accepts user preferences,
2. scores multiple financial products,
3. ranks the best options,
4. explains the ranking,
5. shows a simple insight dashboard.

## 4) Scope

### In scope

* Profile form
* Product dataset
* Rule-based or lightweight scoring engine
* Ranked recommendations
* Explainability layer
* Dashboard with charts
* Downloadable/shareable result page

### Out of scope

* Real banking integrations
* Account opening / payment flow
* KYC
* Mobile app
* Full ML training pipeline
* Complex authentication

---

# Functional Requirements

## FR1 — User input

The app must collect:

* age group
* income range
* savings goal
* investment horizon
* liquidity preference
* risk appetite
* preferred language (optional)

## FR2 — Product dataset

The app must load a product list containing:

* product name
* rate / return
* tenure
* liquidity rules
* minimum amount
* category
* risk tag
* special conditions

A static JSON file is enough for MVP.

## FR3 — Scoring engine

The app must score each product against the profile using weighted rules.

### Suggested scoring formula

* Goal match: 35%
* Liquidity fit: 25%
* Return/rate: 20%
* Risk compatibility: 10%
* Tenure compatibility: 10%

The output should be a numeric score plus a reason breakdown.

## FR4 — Recommendation output

The system must return:

* top 3 recommendations
* score for each
* key reason for each recommendation
* one-line “best for you because…” summary

## FR5 — Explainability layer

For every recommendation, the app must generate plain-language reasoning such as:

* why it matched
* what tradeoff it made
* what the user is giving up

This is important because judges will look for thinking, not just output.

## FR6 — Insight dashboard

The app must show at least 2 charts:

* score comparison across products
* product fit by user segment or goal

## FR7 — Demo-ready result page

The app must have a single result screen that shows:

* user profile
* ranked recommendations
* explanations
* charts
* “next step” CTA

---

# Non-Functional Requirements

## NFR1 — Reliability

The app must work without external dependency failure. If LLM calls fail, the system must still return rule-based explanations.

## NFR2 — Speed

Recommendation response should be near-instant, ideally under 2 seconds for local/demo use.

## NFR3 — Clarity

The UI must be minimal and readable. No clutter.

## NFR4 — Demo stability

The app must run locally and on deployment with no manual setup beyond environment variables.

## NFR5 — Judging fit

The product must look like a real decision tool, not a generic dashboard.

---

# System Design

## Recommended architecture

* **Frontend:** React + Tailwind
* **Backend:** Node.js + Express
* **Data store:** MongoDB or static JSON for MVP
* **Scoring layer:** Pure JavaScript rule engine
* **Optional explanation layer:** OpenAI/Claude API
* **Charts:** Recharts or Chart.js

## Why this stack

For a one-week hackathon, you should optimize for **speed, control, and reliability**. A pure JS scoring engine is faster than training a model and easier to debug. Use LLMs only for explanation polish, not as the core logic.

---

# Data Model

## UserProfile

* id
* ageGroup
* incomeRange
* goal
* horizon
* liquidityNeed
* riskLevel
* language

## FinancialProduct

* id
* name
* category
* returnRate
* tenure
* liquidityScore
* minimumAmount
* riskTag
* conditions

## Recommendation

* userId
* productId
* totalScore
* scoreBreakdown
* explanation
* timestamp

---

# API Requirements

## POST `/api/recommend`

Input: user profile + product list
Output: ranked recommendations

## GET `/api/products`

Returns all products in dataset

## POST `/api/explain`

Input: selected product + user profile
Output: human-readable explanation

## GET `/api/insights`

Returns aggregate stats for charts

---

# UX Requirements

## Main screens

1. **Landing / input form**
2. **Recommendations page**
3. **Comparison view**
4. **Insight dashboard**

## UX rules

* One primary CTA per screen
* No complex navigation
* Use short labels
* Keep finance jargon out of the UI
* Show “why this was selected” prominently

---

# What will actually make it shortlisted

## 1) Strong relevance

The project must clearly fit Track 03 and not drift into a generic finance app. The guide explicitly says submissions that straddle multiple tracks without focus are evaluated lower. 

## 2) Visible execution

The app must work end-to-end. A clean, functioning build matters more than feature count. The evaluation weights technical execution heavily. 

## 3) A non-obvious insight

Do not just show “top FD by rate.” Add an insight like:

* “best for short-term safety”
* “best for liquidity-first users”
* “best if you need access before maturity”

That makes the product look designed, not copied.

## 4) A clear demo narrative

Your story should be:

> “I took a messy product comparison problem and built a decision engine that explains the best option for a specific user.”

## 5) A believable scale story

The judge should immediately see how this could become a real fintech layer for India. The guide explicitly values potential and scale. 

---

# Step-by-step build plan for 7 days

## Day 1 — Freeze scope

Deliverables:

* Finalized problem statement
* 10–15 sample products in JSON
* scoring rules
* wireframe for 4 screens

Non-negotiable:

* choose one user type
* do not add banking integrations
* do not add login

## Day 2 — Build backend logic

Deliverables:

* product loader
* scoring function
* ranking API
* explanation generator stub

Goal:

* make recommendation output work from Postman or curl before frontend exists

## Day 3 — Build frontend shell

Deliverables:

* landing form
* results screen
* product cards
* responsive layout

Goal:

* user can input profile and see ranked results

## Day 4 — Add insights and charts

Deliverables:

* score comparison chart
* segment breakdown chart
* comparison table

Goal:

* make the app look like a real decision tool

## Day 5 — Add explainability and polish

Deliverables:

* human-readable reasoning
* fallback logic if LLM fails
* cleaner text
* validation messages

Goal:

* remove generic chatbot feel

## Day 6 — Test and harden

Deliverables:

* test edge cases
* fix bad inputs
* ensure deployment works
* record demo flow

Goal:

* zero broken screens in live demo

## Day 7 — Final presentation assets

Deliverables:

* 90-second demo video
* short README
* architecture diagram
* sample dataset explanation

Goal:

* make the submission easy to understand in under 2 minutes

---

# Acceptance Criteria

Your MVP is ready only if all of these are true:

* it runs end-to-end
* it maps clearly to Track 03
* it returns ranked recommendations
* it explains the recommendation in simple language
* it includes a dashboard
* it can be demoed live without manual intervention
* it looks polished enough to trust

---

# What to avoid

* full ML model training
* real-time bank integration
* overdesigned UI
* multi-track confusion
* generic “AI finance assistant” framing
* chatbot-first product with no decision logic

That kind of build looks shallow and usually loses to a narrower but better-executed product.

---

# Final recommendation

Build **Blostem Insight Engine** as a **decision engine with explainability**, not as a dashboard and not as a chatbot. That is the highest-probability shortlist strategy for a one-week build under this rule set. 

If you need the next step, I will turn this into a **complete PRD + folder structure + API contract + 7-day execution checklist**.
