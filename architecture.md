# School AI Portal (Schoolsample) — System Architecture & Context

## 1. Project Overview & Commercial Thesis
The School AI Portal is a zero-marginal-cost, privacy-first interactive learning and revision system built on Docusaurus and static WebAssembly/IndexedDB technologies.

* **Zero Cloud Compute Costs:** Socratic evaluation, semantic misconception checks, state management, and text-to-speech audio feedback run 100% client-side in the student's browser.
* **UK GDPR / Safeguarding Compliance:** Zero student data, voice audio, or quiz answers are sent to external API endpoints. Everything stays within the local browser sandbox.
* **Multi-Stream Coverage:** Combines DfE-aligned national curriculum lessons (Oak National Academy) with independent modules (Parish / Catholic Faith Formation, Staff CPD).

---

## 2. Core Architecture & Data Pipeline

### Compact AST Format
To minimize bundle size and allow instant local evaluation, lessons are compiled into a single-character key Abstract Syntax Tree (AST):
* `tp`: Challenge type (e.g., `'quiz'`, `'input'`)
* `co`: Content / question prompt
* `m`: Multiple-choice options array
* `r`: Misconception feedback pairs (`[trigger_phrase, guidance_explanation]`)
* `c`: Correct answer

### File Structure & Paths
* `scripts/ingest-oak.ts`: Ingestion compiler script that transforms raw lesson definitions into AST JSON files.
* `static/manifests/master_catalog.json`: Lightweight index of all available modules (`slug`, `title`, `keyStage`, `subject`, `stream`, `icon`).
* `static/manifests/[lesson-slug].json`: Individual micro-manifest files lazy-loaded into browser IndexedDB on demand.
* `src/components/`: Client-side interactive lesson viewers, stream filters, audio synthesis drivers, and terminal companions.

---

## 3. Active Streams & Cohort Codes
1. **Academic (Oak National Academy):**
   * `states-of-matter` (`OAK-SCI3`)
   * `angles-triangles` (`OAK-MTH3`)
   * `romans-britain` (`OAK-HIS2`)
   * `cell-biology` (`OAK-SCI4`)
2. **Faith & Formation:**
   * `first-holy-communion` (`FHC-A`)
   * `gcse-re-trinity` (`RE-TRIN`)
3. **CPD / Vocational:**
   * Reserved for staff safeguarding, GDPR, and pedagogical training modules.

---

## 4. Key Commands

```powershell
# Compile AST manifests and master catalog
npm run ingest:oak

# Start local development server
npm run start

# Build static production bundle
npm run build

# Deploy live to GitHub Pages (josephbrewerton-oss.github.io/schoolsample/)
$env:GIT_USER="josephbrewerton-oss"; npm run deploy