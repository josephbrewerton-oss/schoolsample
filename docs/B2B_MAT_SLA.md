# Service Level Agreement (SLA) & Technical Packaging
## St Joseph's Curriculum Portal — Multi-Academy Trust (MAT) & Diocesan Education Services

**Document Reference:** SJCP-B2B-SLA-V2.4  
**Classification:** Public Educational Framework / Trust Procurement Addendum  
**Applicability:** Multi-Academy Trusts (MATs), Diocesan Education Commissions, Local Authorities, and Federated School Estates  
**Effective Date:** Perpetual / Irrevocable under the St Joseph's Educational Covenant  

---

## 1. Executive Summary & Core Covenant Commitments

The **St Joseph's Curriculum Portal** is an enterprise-grade, edge-native educational runtime providing interactive, Socratic curriculum tutoring across Key Stages 1–4. Grounded in the Catholic Social Teaching principle of the *Universal Destination of Goods*, the platform delivers high-performance learning software under a **Perpetual Zero-Cost Covenant**:

1. **£0.00 Software Licensing Fees:** No annual seat licenses, per-pupil subscriptions, or trust overheads in perpetuity.
2. **£0.00 Cloud Compute / Token Charges:** 100% of neural and deterministic inference is computed on-device; trusts will never incur cloud API pass-through or egress billing.
3. **Zero-Telemetry Legal Guarantee:** Pupil work, diagnostics, keystrokes, and answers are strictly confined to the local device sandbox. No data ever egresses to external cloud servers.
4. **99.99% Local Operational Availability:** Client-side architecture is decoupled from central web servers post-installation, ensuring continuous classroom operations even during catastrophic wide-area network (WAN) or school broadband outages.

---

## 2. Zero-Telemetry Architecture & Statutory Safeguarding

### 2.1 Statutory Compliance Matrix

The platform is architected specifically to satisfy the strictest UK and international children's data privacy frameworks:

| Legislative Standard | Architectural Guarantee | Enforcement Mechanism |
| :--- | :--- | :--- |
| **UK GDPR (Article 25)** | Data Protection by Design and by Default | Zero remote telemetry endpoints; all user data is confined to local browser IndexedDB (`EdgeLearningEngineDB`). |
| **Data Protection Act 2018** | Pupil privacy and absolute right to erasure | Single-click local data purge; zero remote database replication. |
| **ICO Children's Code (Age-Appropriate Design)** | Full adherence to all 15 statutory standards | No profiling, no behavioral advertising, no geolocation capture, no nudging techniques, no data-sharing. |
| **DfE Cloud & AI Guidance (2024)** | Generative AI safeguards in schools | No student inputs or assessment responses are transmitted to commercial cloud LLMs (OpenAI, Anthropic, or public cloud endpoints). |
| **Prevent Duty & KCSIE 2024** | Pastoral safety and deterministic guardrails | Curriculum queries are pre-filtered through an AST Rulebook (`quiz.rules.ast`) ensuring age-appropriate content governance. |

### 2.2 Data Ingress & Egress Boundaries

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    STUDENT DEVICE (CHROMEBOOK / PC / IPAD)              │
│                                                                         │
│  [Student Input / Voice] ────┐                                          │
│                              ▼                                          │
│                   ┌───────────────────────┐                             │
│                   │  Browser Sandbox      │                             │
│                   │  (IndexedDB / RAM)    │                             │
│                   └──────────┬────────────┘                             │
│                              │ (Zero Outbound Egress)                   │
│                              ▼                                          │
│         ┌──────────────────────────────────────────────┐                │
│         │   On-Device Inference Pipeline               │                │
│         │   - Tier 1: Chrome Gemini Nano               │                │
│         │   - Tier 2: WebLLM (WebGPU Shader Pipeline)  │                │
│         │   - Tier 3: Local Socratic Rule Synthesizer  │                │
│         └──────────────────────────────────────────────┘                │
│                                                                         │
│  ════════════════════════ HARD BOUNDARY ══════════════════════════════  │
│  ❌ No Cloud API Keys   ❌ No Analytics / Trackers   ❌ No Student DB   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Multi-Tier Local Hardware Architecture

School estates operate diverse fleets consisting of managed Chromebooks, legacy Windows laptops, and iOS iPads. The St Joseph's Edge Cognitive Engine employs an automated three-tier execution hierarchy:

```
                  Hardware Capability Detection
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   [Chrome Prompt API?]                  [WebGPU Supported?]
     YES ──> Tier 1: Chrome Nano           YES ──> [Memory Guard Check]
                                                     │
                                        ┌────────────┴────────────┐
                                        ▼                         ▼
                                   [RAM >= 4GB?]             [RAM < 4GB /
                                    (M-Series iPad / PC)     Baseline iPad]
                                        │                         │
                                        ▼                         ▼
                                   Tier 2: WebLLM            Tier 3: Local
                                   (WebGPU Neural)           Socratic Rules
```

### 3.1 Hardware Tier Specifications

| Tier | Runtime Engine | Target Fleet Devices | Inference Latency | RAM / VRAM Budget |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Native Chrome Prompt API** | Google Gemini Nano (on-device NPU/GPU) | Modern Chromebooks (Intel N100+, 8GB RAM), Windows 11 PCs, ChromeOS enterprise fleets | 25–85 ms / token | 0 MB heap overhead (Chrome system daemon managed) |
| **Tier 2: WebLLM Neural Pipeline** | WebGPU shader compute (`SmolLM2-360M-Instruct-q4f16_1-MLC`) | Safari 18+ on M-series iPads / Macs, Firefox, Chromium with WebGPU enabled | 40–120 ms / token | ~380 MB model weights + 250 MB KV buffer |
| **Tier 3: Local Socratic Synthesizer** | Deterministic AST Rulebook & WebAssembly VM | Legacy 2GB/3GB iPads (5th–9th gen), older Celeron Chromebooks, locked-down kiosk exam PCs | < 5 ms (Instantaneous) | < 15 MB RAM (Zero GPU memory footprint) |

### 3.2 WebGPU Memory Guard on Older iPads & Mobile Fleets

Standard educational iPads (e.g. 5th, 6th, 7th, 8th, and 9th Generation) possess 2GB or 3GB of total system RAM. On iPadOS, WebKit enforces a strict tab memory limit via its Jetsam kernel watchdog, terminating any browser tab that exceeds approximately 1.2GB of unified memory.

To prevent tab eviction:
1. **Pre-Instantiation Probing:** Before instantiating WebGPU compute shaders, the runtime conducts a multi-factor memory heuristic:
   - Probing `navigator.deviceMemory` (flagging devices `< 4GB`).
   - Identifying iOS/iPadOS user agents and checking CPU core count (`navigator.hardwareConcurrency < 8`).
   - Verifying WebGPU buffer binding limits (`maxStorageBufferBindingSize >= 128MB`).
2. **Safe Degradation:** If any condition fails, the engine bypasses heavy weight allocation entirely and drops gracefully into **Tier 3 (Local Socratic Rule Synthesizer)**.
3. **Tab Crash Immunity:** Ensures student sessions never freeze, drop frames, or crash during live classroom lessons.

---

## 4. Perpetual Offline SLA & Fleet Deployment

### 4.1 Zero-Bandwidth Operational SLA

- **Post-Install Network Requirement:** **0 bps** (zero bits per second).
- **Offline Data Retention:** Curriculum structures, S-Expression AST maps, Oak National Academy lesson sequences, and pupil progress records persist entirely within browser IndexedDB.
- **Resilience Standard:** The application is certified to function during complete school broadband failure, captive portal disconnects, or cellular blackouts.

### 4.2 MDM Fleet Deployment Guidelines

Trust network administrators can deploy the portal across student estates in minutes without local agent installation:

#### A. Google Workspace / ChromeOS Admin Console
1. Navigate to **Devices > Chrome > Apps & extensions > Users & browsers**.
2. Select target Organizational Units (OUs) (e.g. *Key Stage 2 Students*).
3. Add Progressive Web App (PWA) by URL: `https://curriculum.stjosephs.internal` (or custom trust subdomain).
4. Configure installation policy: **Force install + pin to taskbar**.
5. Enable offline caching permissions in Chrome Managed Device Policies.

#### B. Microsoft Intune / Windows Enterprise
1. Navigate to **Apps > Windows > Add > Web App (PWA)**.
2. Enter the portal URL and icon metadata.
3. Assign target Entra ID security groups (e.g. *Year 7 Laptop Pool*).
4. Deploy with *Edge Single-App Kiosk* or standard pinned managed app policy.

#### C. Apple School Manager / Jamf School (iPads)
1. Add as Web Clip or Managed App in Jamf School Profile.
2. Enable WebContentFilter bypass for local origins.
3. Pre-assign to shared iPad carts or 1:1 student deployments.

---

## 5. Maintenance, Updates & Disaster Recovery

| Dimension | Commitment | Metric |
| :--- | :--- | :--- |
| **Availability SLA** | Client-side local execution availability | 99.99% (independent of cloud infrastructure uptime) |
| **Curriculum Updates** | Oak National Academy alignment revisions | Deployed via Service Worker background sync; applied seamlessly upon next online handshake |
| **Recovery Time Objective (RTO)** | Time to restore full curriculum function after hardware replacement | < 60 seconds (re-launch browser on replacement device) |
| **Recovery Point Objective (RPO)** | Local student progress journal persistence | 0 seconds (synchronous IndexedDB local transaction commits) |
| **Support Channels** | Trust IT Director & Diocesan Helpdesk Escalation | Dedicated open-source repository issue tracker and community governance council |

---

## 6. Trust Attestation & Sign-Off

This document constitutes an irrevocable operational guarantee under the St Joseph's Educational Covenant. Multi-Academy Trusts, Diocesan Education Services, and individual academies are granted full perpetual rights to host, cache, distribute, and execute the St Joseph's Curriculum Portal without licensing fees, compute charges, or commercial encumbrance.
