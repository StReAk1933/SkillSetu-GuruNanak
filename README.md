# SkillSetu
### AI-Enabled Skill Intelligence & Learning Platform for India's Official Statistical System

**SIH Problem Statement:** SIH26101  
**Organization:** Ministry of Statistics & Programme Implementation (MoSPI)  
**Theme:** Smart Education  
**Category:** Software  
**Team:** INFINEX  
**Institution:** CMR College of Engineering and Technology

---

## Overview

SkillSetu is a proposed competency-intelligence platform for India's official statistical workforce. It aims to move beyond tracking course completion and help government departments understand **what employees can actually do**, where competency gaps exist, how training changes capability, and how verified skills can support project allocation and workforce planning.

The core principle is:

> **Course completion is not the same as verified competency.**

SkillSetu combines competency profiles, assessments, practical evidence, learning recommendations, real-work matching, and workforce scenario planning in one connected workflow.

## The Problem

The project addresses four related challenges:

1. **Limited visibility into competency gaps:** An employee's designation or training history alone does not show whether they have the proficiency required for a role or project.
2. **Difficulty finding relevant training:** Officials may struggle to identify the most useful options from the iGOT Karmayogi learning ecosystem.
3. **Limited personalization and verification:** Generic training and course-completion records do not necessarily demonstrate that a skill has been acquired.
4. **Manual assessment creation:** Trainers spend time preparing quizzes and MCQs instead of focusing on teaching and mentoring.

## Proposed Solution

SkillSetu is organized around five connected capabilities.

### 1. Competency Digital Twin

Creates a living competency graph for an official using available information such as HR data, learning records, assessments, project requirements, and permitted work evidence. The profile represents competencies and proficiency and can be updated when new evidence becomes available.

### 2. Competency Verification

Uses assessments and practical evidence to help determine whether an employee can demonstrate a skill. Course completion is treated as learning evidence, not automatic proof of mastery.

**Intended flow:** Training → assessment → practical evidence → verified competency.

### 3. Personalized Learning Loop

Compares an employee's competencies with role requirements, identifies gaps, and recommends relevant learning. Proposed pathways include iGOT e-courses and relevant NSSTA/TPAC programmes.

AI-generated quizzes are intended to be grounded in uploaded learning material and checked against their source. Assessment results and learning progress can then inform competency updates and future recommendations.

### 4. Real-Work Matching

Compares project competency requirements with the verified competency profiles available across the workforce. It can help identify employees or teams that may fit a project, subject to project constraints and human review.

### 5. Workforce What-If Simulator and Training Impact

Models scenarios such as retirements, transfers, or emerging technology needs to highlight possible future competency shortages. It also compares competency evidence before and after training to help measure training impact—for example, a change from 42% to 74% represents a **32 percentage-point gain**.

## How It Works

1. **Ingest:** Collect available HR, iGOT, assessment, and project-requirement data.
2. **Build the Twin:** Create a competency graph and estimate proficiency from available evidence.
3. **Verify:** Use assessments and practical evidence to validate capability.
4. **Identify Gaps:** Compare verified/current competencies with role or project requirements.
5. **Recommend Learning:** Suggest relevant iGOT courses or NSSTA/TPAC programmes, with an explanation for the recommendation.
6. **Assess and Update:** Generate source-grounded quizzes, evaluate results, and update the competency profile when supported by evidence.
7. **Match and Plan:** Use verified competency information for project matching and workforce scenario planning.

## Intended Users

- **Government officials / employees:** Understand skill gaps, follow personalized learning paths, and build evidence of their competencies.
- **Trainers and training institutes:** Create assessments and understand learner misconceptions and competency gains.
- **Leadership and HR teams:** View competency gaps, support project/team matching, evaluate training impact, and explore workforce scenarios.

## Key Differentiators

- **Verified capability, not just course completion**
- **Living competency graph** that can be updated as new evidence arrives
- **Explainable learning recommendations**
- **AI quiz generation grounded in source material**
- **Project matching based on verified competencies**
- **What-if workforce planning** for retirements, transfers, and emerging skill needs
- **Training impact measurement** based on competency change

SkillSetu is intended to complement the iGOT Karmayogi learning ecosystem, not replace it.

## Proposed Technical Architecture

The following stack is proposed in the project presentation. It describes the intended architecture, not a claim that every integration is already implemented.

| Layer | Proposed technology / role |
|---|---|
| Web interface | React, REST-based frontend, dashboards |
| Backend/API | Python, FastAPI |
| Structured data | PostgreSQL |
| Semantic search | pgvector / vector database |
| AI and NLP | Open LLM, RAG, Hugging Face, spaCy, embeddings |
| Integration | APIs/adapters for learning and programme data, subject to access |
| Deployment | Docker, Kubernetes, government-cloud-ready design |
| Security | Role-Based Access Control (RBAC), authentication/SSO where available, encryption, audit logs |

## Feasibility, Risks, and Mitigations

- **External API access:** During prototyping, use clearly labelled sample/seeded data if live iGOT or NSSTA/TPAC access is unavailable. Production integration requires authorized access.
- **Evidence quality:** Use assessments and practical tasks as primary competency evidence; work-artifact analysis should be permitted and appropriately governed.
- **AI reliability:** Ground generated questions in source material, validate outputs, use confidence thresholds, and allow subject-matter-expert review.
- **Matching accuracy:** Consider competency level, recency, role rules, and project constraints; treat recommendations as decision support.
- **Forecast uncertainty:** Present scenario ranges and assumptions rather than treating simulations as certain predictions.
- **Privacy and security:** Apply role-based access, data minimization, encryption, audit logging, and relevant government security requirements.

## Expected Impact

- Better visibility into individual and department-level competency gaps
- More relevant learning recommendations
- Improved ability to verify skills after training
- Less manual effort in preparing assessments
- Better evidence of training effectiveness
- Better-informed project/team allocation
- Earlier identification of possible future skill shortages
- Support for a more capable official statistical workforce

## Proposed Success Metrics

Potential measures include:

- Verified competency gain
- Competency verification rate
- Skill-gap closure rate
- Time required to find relevant training
- Project-match precision
- Time-to-skill
- Training impact / ROI
- Assessment-generation and review time

Metrics should be established with pilot users and measured against a baseline.

## Rollout Approach

1. **Pilot:** Test with a small statistical unit or 1–2 departments; validate competency verification and matching workflows.
2. **Scale:** Expand to additional statistical cadres and departments using integration adapters.
3. **Broader deployment:** Explore expansion to State Statistical Bureaus and other suitable government organizations after pilot validation.

## Important Implementation Notes

- The architecture and integrations described here are proposed; do not represent them as live or completed unless they have actually been implemented.
- Official iGOT, HR, and NSSTA/TPAC integrations depend on authorized access and available interfaces.
- Competency scores should be explainable and evidence-based. A score is an estimate of proficiency, not an unquestionable judgment about an employee.
- High-impact decisions about staffing or competency should retain appropriate human oversight.

## References / Ecosystem

- iGOT Karmayogi
- Mission Karmayogi / Karmayogi Competency Model
- Ministry of Statistics & Programme Implementation (MoSPI)
- National Statistical Systems Training Academy (NSSTA)
- Retrieval-Augmented Generation (RAG) research
- NIST AI Risk Management Framework (AI RMF 1.0)

---

*SkillSetu is a proposed SIH solution concept. Features, integrations, and impact measures should be validated through implementation and a pilot deployment.*

## Running locally

### Main dashboard

Requirements: Node.js 20.19+ (or 22.12+) and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173). To create
a production build, run `npm run build`.

### Connected demo data and Gemini features

The root React demo stores shared employee, verification, and learning state in
the browser's `localStorage`. Use the workspace menu to switch between the
demo employee and reviewer views; this role switch is for local prototyping
only and is not authentication or production authorization.

The local Vite development server provides the `/api/assistant/message`,
`/api/quiz/generate`, and `/api/quiz/grade` endpoints. Gemini calls run only
server-side. To enable them, copy `.env.example` to `.env` and set
`GEMINI_API_KEY` to a key kept private on your machine. Without a key, the app
uses clearly labelled built-in demo responses and questions. Never add a real
key to `VITE_*` variables or source control.

These Vite middleware endpoints are for the local demo and are not included in
the static production build. A deployed application needs a server-side API
implementation with real authentication, authorization, rate limiting, and
shared durable storage before it can safely serve multiple users.

### Training impact and ROI demo

Requirements: Python 3.9+.

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m streamlit run app.py
```

Open the local URL printed by Streamlit (normally http://localhost:8501).

### Standalone competency module

The independently runnable module is in `sih-project-member-one/`:

```bash
cd sih-project-member-one
npm ci
npm run dev
```

Open the local URL printed by Vite.
