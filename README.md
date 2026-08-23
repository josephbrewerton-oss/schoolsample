<!--
Copyright (c) 2026 Joseph Brewerton
Licensed under GNU AGPLv3 / Commercial Dual-License.
-->

# ⚡ St Joseph's Edge Learning Engine

> **Zero-Marginal-Cost, Privacy-Preserving On-Device AI Tutoring Platform**  
> Powered by the UK National Curriculum (Oak National Academy) & Chrome Built-in AI (Gemini Nano).

[![Lighthouse Desktop](https://img.shields.io/badge/Lighthouse_Desktop-98%2F100-brightgreen)](https://pagespeed.web.dev/)
[![Lighthouse Mobile](https://img.shields.io/badge/Lighthouse_Mobile-79%2F100-green)](https://pagespeed.web.dev/)
[![Privacy](https://img.shields.io/badge/Privacy-Zero_Data_Egress-blue)](#-privacy--zero-telemetry-architecture)
[![License: Dual AGPLv3 / Commercial](https://img.shields.io/badge/License-AGPLv3%20%2F%20Commercial-purple.svg)](#%EF%B8%8F-licensing--terms)

---

## 🎯 Vision & Overview

Traditional EdTech and AI tutoring platforms rely on heavy cloud infrastructure, charging £5–£20 per student/month to offset third-party API compute bills. This creates deep digital divides in bandwidth-constrained and emerging markets.

The **St Joseph's Engine** flips this paradigm. By running quantized neural inference entirely client-side via **Chrome Built-in AI (Gemini Nano)**, it delivers infinite, curriculum-aligned, interactive practice drills at **£0.00 marginal compute cost**—with zero network egress, complete offline capability, and 60 FPS UI performance.

---

## 🏗️ Core Architecture

```text
┌───────────────────────────────────────────────────────────────┐
│                          BROWSER TAB                          │
│                                                               │
│   ┌─────────────────────┐            ┌────────────────────┐   │
│   │   React 18 / DOM    │ ◄────────► │ IndexedDB Storage  │   │
│   │  (Interactive Lab)  │            │  (Telemetry & VFS) │   │
│   └──────────┬──────────┘            └────────────────────┘   │
│              │                                                │
│              │ WebRTC DataChannel                             │
│              ▼                                                │
│   ┌───────────────────────────────────────────────────────┐   │
│   │                 WebRTC Worker Daemon                  │   │
│   │  - Single-Flight Concurrency Lock                     │   │
│   │  - Domain Archetype Router (Maths/Science/Humanities) │   │
│   └──────────────────────────┬────────────────────────────┘   │
│                              │                                │
│                              ▼                                │
│   ┌───────────────────────────────────────────────────────┐   │
│   │            Chrome Built-in AI (Gemini Nano)           │   │
│   │              On-Device Neural Inference               │   │
│   └──────────────────────────┬────────────────────────────┘   │
│                              │                                │
│                              ▼                                │
│   ┌───────────────────────────────────────────────────────┐   │
│   │                   AST Flow Governor                   │   │
│   │  - Deterministic Lisp S-Expression Parsing            │   │
│   │  - Scratchpad Math & Fact Verification                │   │
│   │  - Dynamic Distractor Shuffling                       │   │
│   └───────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘

Key Architectural PillarsOn-Device Neural Inference: Leverages local WebGPU/NPU hardware acceleration via the Window AI Prompt API to stream tokens directly on the client.Isolated WebRTC Daemon: Inference workloads run in a sandboxed daemon decoupled from the main DOM thread via WebRTC DataChannels, eliminating UI stutter and frame drops.AST Flow Governor: Small edge models are constrained through deterministic Lisp S-expression schemas ((:route "quiz:mcq" ...)). The engine validates scratchpad calculations and enforces strict answer-key placement before rendering.Complete Offline Persistence: Built on IndexedDB (EdgeLearningEngineDB), caching curriculum manifests, student streaks, and diagnostic metrics locally without external database syncs.Full Oak Syllabus Integration: Pre-indexed key stages (KS1–KS4) and modules covering Mathematics, Science, Humanities, and Modern Languages mapped from Oak National Academy.📊 Performance & BenchmarksAudited on production builds via Google PageSpeed Insights:MetricDesktop AuditMobile AuditLegacy Cloud EdTech BaselinePerformance98 / 10079 / 100~44 / 100Accessibility96 / 10096 / 100~100 / 100Best Practices100 / 100100 / 100~100 / 100SEO100 / 100100 / 100~85 / 100Inference Cost£0.00£0.00£5–£20 / student / moData Egress0 Bytes0 BytesContinuous API Streaming🔒 Privacy & Zero-Telemetry ArchitectureThis platform is engineered as an offline-first, client-side learning environment:Zero Telemetry: No pupil profiles, interaction telemetry, voice recordings, or behavioral data are transmitted to external servers or cloud AI providers.Local Processing: Pedagogical AST evaluations and peer-to-peer data transfers execute client-side or across local network WebRTC DataChannels.Safeguarding & Compliance: Eliminates DPO and KCSIE procurement friction for UK Multi-Academy Trusts (MATs) and international school boards by adhering strictly to GDPR and UK Data Protection Act 2018 standards without requiring Data Processing Addendums (DPAs).🚀 Getting StartedPrerequisitesNode.js (v18.0.0 or higher)Chromium-based browser with Built-in AI flags enabled (chrome://flags/#optimization-guide-on-device-model set to Enabled BypassPerfRequirement).InstallationBashgit clone [https://github.com/josephbrewerton-oss/schoolsample.git](https://github.com/josephbrewerton-oss/schoolsample.git)
cd schoolsample
npm install
Local DevelopmentBashnpm run start
Starts the local dev server at http://localhost:3000/schoolsample/practice-lab.Production Build & DeploymentBash# Build static production artifacts
npm run build

# Deploy directly to GitHub Pages
npm run deploy
🗺️ Roadmap & Field Testing[x] On-device Prompt API integration & WebRTC inference daemon[x] Lisp S-expression AST Flow Governor & answer validation[x] Complete Oak National Academy curriculum mapping (KS1–KS4)[x] Client-side diagnostic telemetry & IndexedDB persistence[ ] Field trial deployment across low-connectivity test environments (Nigeria Pilot)[ ] Dynamic WASSCE / JAMB curriculum mapping layer[ ] Offline class-wide progress sync via peer-to-peer WebRTC & QR exports⚖️ Licensing & Terms1. Platform & Engine Source Code (Dual Licensing)The software engine, AST compilers, WebRTC communication layer, and UI components are available under a dual-licensing model:Open-Source Edition (GNU AGPL v3.0):Free for community use, open-source educational initiatives, and self-hosted environments. Any modifications, network services, or integrated works based on this platform must also be published under the GNU AGPL v3.0.Commercial & Institutional Licensing:For proprietary integrations, closed-source Multi-Academy Trust (MAT) deployments, managed SaaS hosting, or custom enterprise SLAs without AGPL copyleft obligations, commercial licenses must be purchased directly from the copyright holder.2. Upstream Educational Content & Curriculum (OGL v3.0)Curriculum frameworks, question banks, misconception data, and lesson sequences incorporate public educational datasets provided by Oak National Academy, used under the Open Government Licence v3.0 (OGL v3.0):Attribution: Contains public sector information licensed under the Open Government Licence v3.0. Sourced from Oak National Academy.Licence Reference: Open Government Licence v3.0Non-Endorsement: This software is an independent platform and is not endorsed, sponsored, or certified by Oak National Academy or the UK Department for Education.Third-Party Rights: Select third-party media, diagrams, or literary excerpts present in upstream lesson materials remain the copyright of th
