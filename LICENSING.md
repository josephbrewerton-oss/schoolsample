```markdown
<!--
Copyright (c) 2026 Joseph Brewerton
Licensed under GNU AGPLv3 / Commercial Dual-License.
-->

Dedicated to St Joseph, and created in the spirit of the Catholic Church’s preferential option for the poor—providing equitable access to learning for all.

# ⚡ St Joseph's Edge Learning Engine

> **Zero-Marginal-Cost, Privacy-Preserving On-Device AI Tutoring Platform**  
> Powered by the UK National Curriculum (Oak National Academy) & Chrome Built-in AI (Gemini Nano).

[![Lighthouse Desktop](https://img.shields.io/badge/Lighthouse_Desktop-99%2F100-brightgreen)](https://pagespeed.web.dev/)
[![Lighthouse Accessibility](https://img.shields.io/badge/Accessibility-96%2F100-brightgreen)](https://pagespeed.web.dev/)
[![Best Practices](https://img.shields.io/badge/Best_Practices-100%2F100-brightgreen)](https://pagespeed.web.dev/)
[![SEO](https://img.shields.io/badge/SEO-100%2F100-brightgreen)](https://pagespeed.web.dev/)
[![Agentic Browsing](https://img.shields.io/badge/Agentic_Browsing-2%2F2-brightgreen)](https://pagespeed.web.dev/)
[![Privacy](https://img.shields.io/badge/Privacy-Zero_Data_Egress-blue)](#-privacy--zero-telemetry-architecture)
[![License: Dual AGPLv3 / Commercial](https://img.shields.io/badge/License-AGPLv3%20%2F%20Commercial-purple.svg)](#-licensing--terms)

---

## 🎯 Vision & Overview

Traditional EdTech and AI tutoring platforms rely on centralized cloud infrastructure, charging £5–£20 per student/month to offset API compute bills. This creates deep digital divides in bandwidth-constrained, emerging, and underfunded educational environments.

The **St Joseph's Engine** flips this paradigm. By running quantized neural inference entirely client-side via **Chrome Built-in AI (Gemini Nano)** and a deterministic substrate-based AST compiler, it delivers infinite, curriculum-aligned, interactive practice drills and Socratic tutoring at **£0.00 marginal compute cost**—with zero network egress, complete offline capability, and a verified 99/100 Lighthouse performance rating on static hosting.

---

## 🏗️ Core Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                              BROWSER TAB                                │
│                                                                         │
│   ┌────────────────────────┐              ┌──────────────────────────┐  │
│   │    React 18 / DOM      │ ◄──────────► │    IndexedDB Storage     │  │
│   │ (Learning Zone / Lab)  │              │ (Curriculum Cache & VFS) │  │
│   └───────────┬────────────┘              └──────────────────────────┘  │
│               │                                                         │
│               │ Substrate Message Dispatch (Hypercall)                  │
│               ▼                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                     Hypercall Substrate Bus                     │   │
│   │  - QuestionEngine Node (Stage-Calibrated AST Logic)             │   │
│   │  - LessonSynthesizer Node (IndexedDB Cache + Baseline Influx)   │   │
│   │  - Telemetry & Diagnostic Report Nodes                          │   │
│   └───────────────────────────┬─────────────────────────────────────┘   │
│                               │                                         │
│                               ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                Chrome Built-in AI (Gemini Nano)                 │   │
│   │               On-Device Neural Inference Engine                 │   │
│   └───────────────────────────┬─────────────────────────────────────┘   │
│                               │                                         │
│                               ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                 Pedagogical Governance Layer                    │   │
│   │  - Multi-Tier Developmental Calibration (KS1 sensory → KS4 GCSE)│   │
│   │  - Cognitive Trap & Misconception Extraction Engine             │   │
│   │  - Super Teacher Nano Socratic Voice & Text Engine              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

```

### Key Architectural Pillars

* **On-Device Neural Inference:** Leverages local WebGPU/NPU hardware acceleration via Chromium's `LanguageModel` (Prompt API) to stream Socratic feedback and compile lesson ASTs directly on the client.
* **Stage-Calibrated Governance:** Constrains small language models across developmental stages—enforcing sensory, tangible vocabulary for Key Stage 1 and formal quantitative syllabus standards ($F=ma$, vectors, momentum) for Key Stage 4.
* **Dual-Tier Lesson Delivery:** Instant optimistic UI updates paired with deep AI narrative synthesis (Axiom, Cognitive Trap, Inquiry Hook, Socratic Check).
* **Super Teacher Nano Voice Substrate:** Real-time on-device Socratic tutor providing 3-tier adaptive scaffolding (💡 Nudge, 🔍 Clue, 🧩 Step Breakdown) with speech synthesis integration.
* **Zero-Egress IndexedDB Persistence:** Caches curriculum trees, lesson records, and diagnostic progress locally (`EdgeLearningEngineDB`), enabling complete offline execution.
* **Complete UK Oak Syllabus Mapping:** Full structured coverage spanning KS1 through KS4 across Mathematics, Sciences, Humanities, and Modern Languages.

---

## 📊 Performance & Benchmarks

Audited on production builds via Google PageSpeed Insights:

| Metric | Desktop Production Audit | Legacy Cloud EdTech Baseline |
| --- | --- | --- |
| **Performance** | **99 / 100** | ~44 / 100 |
| **Accessibility** | **96 / 100** | ~100 / 100 |
| **Best Practices** | **100 / 100** | ~100 / 100 |
| **SEO** | **100 / 100** | ~85 / 100 |
| **Agentic Browsing** | **2 / 2 (Pass)** | 0 / 2 |
| **Marginal Compute Cost** | **£0.00** | £5–£20 / student / mo |
| **Data Egress** | **0 Bytes** | Continuous API Streaming |

---

## 🔒 Privacy & Zero-Telemetry Architecture

* **Zero Telemetry:** No pupil profiles, student queries, voice recordings, or behavioral data are transmitted to cloud AI providers.
* **Local Processing:** Pedagogical evaluations, Socratic reasoning, and telemetry remain inside the client's browser sandbox and local IndexedDB tables.
* **Safeguarding & Compliance:** Adheres to UK GDPR and the Data Protection Act 2018. Eliminates Data Protection Officer (DPO) and Keeping Children Safe in Education (KCSIE) procurement friction by removing external data pipelines entirely.

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18.0.0 or higher)
* Chromium-based browser with Built-in AI flags enabled (`chrome://flags/#optimization-guide-on-device-model` set to *Enabled BypassPerfRequirement* and `chrome://flags/#prompt-api-for-gemini-nano` set to *Enabled*).

### Installation

```bash
git clone [https://github.com/josephbrewerton-oss/schoolsample.git](https://github.com/josephbrewerton-oss/schoolsample.git)
cd schoolsample
npm install

```

### Local Development

```bash
npm run start

```

Runs the local development instance at `http://localhost:3000/schoolsample/learning-zone`.

### Production Build & Deployment

```bash
# Build optimized static bundle
npm run build

# Deploy to GitHub Pages (PowerShell)
$env:GIT_USER="josephbrewerton-oss"
npm run deploy

# Deploy to GitHub Pages (CMD / Bash)
set GIT_USER=josephbrewerton-oss && npm run deploy

```

---

## 🗺️ Roadmap & Field Testing

* [x] On-device Prompt API integration & Hypercall dispatch engine
* [x] Developmental prompt calibration across UK Key Stages (KS1–KS4)
* [x] Super Teacher Nano on-device Socratic tutor with Web Speech API
* [x] Complete Oak National Academy curriculum mapping
* [x] Offline IndexedDB caching and fallback synthesis
* [ ] Field trial deployment across low-connectivity test environments (Nigeria Pilot)
* [ ] Dynamic WASSCE / JAMB curriculum mapping layer
* [ ] Peer-to-peer WebRTC class-wide progress sync & offline QR exports

---

## ⚖️ Licensing & Terms

### 1. Platform & Engine Source Code (Dual Licensing)

The software engine, AST compilers, hypercall dispatch system, and UI components are available under a dual-licensing model:

* **Open-Source Edition (GNU AGPL v3.0):**
Free for community use, open-source educational initiatives, and self-hosted environments. Any modifications, network services, or integrated works based on this platform must also be published under the GNU AGPL v3.0.
* **Commercial & Institutional Licensing:**
For proprietary integrations, closed-source Multi-Academy Trust (MAT) deployments, managed SaaS hosting, or custom enterprise SLAs without AGPL copyleft obligations, commercial licenses must be purchased directly from the copyright holder.

### 2. Upstream Educational Content & Curriculum (OGL v3.0)

Curriculum frameworks, question structures, misconception taxonomies, and lesson sequences incorporate public educational datasets provided by Oak National Academy, used under the Open Government Licence v3.0:

* **Attribution:** Contains public sector information licensed under the Open Government Licence v3.0. Sourced from Oak National Academy.
* **Licence Reference:** [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)
* **Non-Endorsement:** This software is an independent platform and is not endorsed, sponsored, or certified by Oak National Academy or the UK Department for Education.

```

```
