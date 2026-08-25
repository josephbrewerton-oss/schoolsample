// src/pages/settings.tsx
import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import { AVAILABLE_MODELS, loadModel } from "@site/src/utils/aiEngine";
import SExprViewRenderer from "@site/src/components/SExprViewRenderer";
import { parseSExpr } from "@site/src/utils/sexprParser";
import { SExprAST } from "@site/src/types/sexpr";
import { getVfsView, saveVfsView, bootstrapVfsViews } from "@site/src/services/dbStore";
import { Channels } from "@site/src/utils/channelBus";
import { useCurriculumStandard } from "@site/src/hooks/useCurriculumStandard";
import { CurriculumProviderKey } from "@site/src/data/curriculumRegistry";

const DEFAULT_CHEAT_SHEET_VIEW = `(view :className "card padding--md margin-bottom--md"
  (header :level 3 "Dynamic Cheat Sheet (VFS Loaded)")
  (text "This UI is fetched directly from IndexedDB VFS storage at runtime.")
  (box :className "row"
    (badge :variant "success" "Offline Ready")
    (badge :variant "secondary" "VFS IndexedDB"))
  (button :action "system:ping" :payload "vfs-node-01" "Test Action"))`;

export default function SettingsPage(): JSX.Element {
  // Curriculum Standard state
  const [curriculumStandard, setCurriculumStandard] = useCurriculumStandard();

  // AI Engine states
  const [selectedModel, setSelectedModel] = useState<string>("gemini-nano");
  const [status, setStatus] = useState<string>("Ready");
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Accessibility & Educator states
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [teacherMode, setTeacherMode] = useState<boolean>(false);

  // VFS & S-Expression states
  const [vfsSource, setVfsSource] = useState<string>("");
  const [dynamicAst, setDynamicAst] = useState<SExprAST | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const loadViewFromVFS = async () => {
    try {
      await bootstrapVfsViews({
        "/sys/views/cheat_sheet.lisp": DEFAULT_CHEAT_SHEET_VIEW,
      });

      const raw = await getVfsView("/sys/views/cheat_sheet.lisp");
      if (raw) {
        setVfsSource(raw);
        const ast = parseSExpr(raw);
        setDynamicAst(ast);
      }
    } catch (err) {
      console.error("VFS Load Failure:", err);
    }
  };

  useEffect(() => {
    const savedModel = localStorage.getItem("preferred_ai_model");
    const storedFont = localStorage.getItem("app_font_size") as "normal" | "large" | "xlarge" | null;
    const storedContrast = localStorage.getItem("app_high_contrast") === "true";
    const storedTeacher = localStorage.getItem("app_teacher_mode") === "true";

    if (savedModel) setSelectedModel(savedModel);
    if (storedFont) setFontSize(storedFont);
    if (storedContrast) setHighContrast(true);
    if (storedTeacher) setTeacherMode(true);

    loadViewFromVFS();
  }, []);

  const applyAccessibility = (newFont: string, newContrast: boolean, newTeacher: boolean) => {
    localStorage.setItem("app_font_size", newFont);
    localStorage.setItem("app_high_contrast", String(newContrast));
    localStorage.setItem("app_teacher_mode", String(newTeacher));

    document.documentElement.classList.toggle("high-contrast-mode", newContrast);
    document.documentElement.setAttribute("data-font-size", newFont);
  };

  const handleModelSelect = async (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("preferred_ai_model", modelId);

    if (modelId !== "gemini-nano") {
      setLoading(true);
      setStatus("Downloading & loading weights into browser WebGPU cache...");
      try {
        await loadModel(modelId, (text, pct) => {
          setStatus(text);
          setProgress(pct);
        });
        setStatus("Model successfully loaded and cached offline.");
      } catch (err: any) {
        setStatus("Error: " + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setStatus("Using Chrome Built-in AI (Nano). Zero download needed.");
      setProgress(0);
    }
  };

  const handleVfsAction = (action: string, payload?: any) => {
    Channels.UI_ACTIONS.send({ action, payload });
  };

  const handleSaveVfsEdit = async () => {
    try {
      await saveVfsView("/sys/views/cheat_sheet.lisp", vfsSource);
      const parsed = parseSExpr(vfsSource);
      setDynamicAst(parsed);
      setIsEditing(false);
    } catch (err: any) {
      alert("Syntax Error parsing S-Expression: " + err.message);
    }
  };

  return (
    <Layout title="Settings & Accessibility" description="Choose local on-device AI model, visual accessibility, and teacher tools">
      <main className="container margin-vert--lg" style={{ maxWidth: "800px" }}>
        <h1>⚙️ System Settings & Accessibility</h1>
        <p style={{ color: "var(--ifm-color-emphasis-700)" }}>
          Preferences and VFS file trees are stored 100% locally on this device.
        </p>

        {/* Section 1: Curriculum Framework Standard */}
        <section style={{ border: "1px solid var(--ifm-color-emphasis-300)", borderRadius: "8px", padding: "1.25rem", marginTop: "1.5rem" }}>
          <h2>📚 Curriculum Standard & Regional Scope</h2>
          <p style={{ fontSize: "0.9rem", opacity: 0.85, marginBottom: "1rem" }}>
            Select the curriculum taxonomy framework and regional constraints for on-device question generation.
          </p>

          <select
            value={curriculumStandard}
            onChange={(e) => setCurriculumStandard(e.target.value as CurriculumProviderKey)}
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid var(--ifm-color-emphasis-400)",
              fontSize: "0.95rem",
              background: "var(--ifm-background-surface-color)",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            <option value="uk_oak">UK National Curriculum (Oak National Academy)</option>
            <option value="international">International / Universal (Cambridge & IB Aligned)</option>
          </select>

          <div
            style={{
              marginTop: "1rem",
              padding: "0.85rem 1rem",
              borderRadius: "6px",
              background: curriculumStandard === "uk_oak" ? "rgba(37, 99, 235, 0.08)" : "rgba(16, 185, 129, 0.08)",
              borderLeft: curriculumStandard === "uk_oak" ? "4px solid #2563eb" : "4px solid #10b981",
              fontSize: "0.85rem",
            }}
          >
            {curriculumStandard === "uk_oak" ? (
              <>
                <strong>🇬🇧 UK National Curriculum Active:</strong>
                <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.2rem" }}>
                  <li>Key Stage 1–4 hierarchical taxonomy with UK-specific topics.</li>
                  <li>Standard British English spelling (<em>colour, neutralise</em>) and currency (£/p).</li>
                  <li>UK schooling terminology (<em>full stop, speech marks</em>).</li>
                </ul>
              </>
            ) : (
              <>
                <strong>🌐 International / Universal Curriculum Active:</strong>
                <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.2rem" }}>
                  <li>Filters out region-locked UK modules while retaining universal STEM & humanities.</li>
                  <li>Strict SI Metric units (m, kg, s, °C) and universal trade entities.</li>
                  <li>Globally neutral academic English.</li>
                </ul>
              </>
            )}
          </div>
        </section>

        {/* Section 2: Accessibility */}
        <section style={{ border: "1px solid var(--ifm-color-emphasis-300)", borderRadius: "8px", padding: "1.25rem", marginTop: "1.5rem" }}>
          <h2>👁️ Visual & Low-Vision Support</h2>
          
          <div style={{ marginTop: "1rem" }}>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>Text Scaling</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["normal", "large", "xlarge"] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setFontSize(size);
                    applyAccessibility(size, highContrast, teacherMode);
                  }}
                  className={`button ${fontSize === size ? "button--primary" : "button--secondary"}`}
                >
                  {size === "normal" ? "Standard (100%)" : size === "large" ? "Large (125%)" : "Extra Large (150%)"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--ifm-color-emphasis-200)" }}>
            <div>
              <strong>High Contrast Mode</strong>
              <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                Maximizes visual borders and sharpens text contrast for low-vision readability.
              </div>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              style={{ transform: "scale(1.4)", cursor: "pointer" }}
              onChange={(e) => {
                setHighContrast(e.target.checked);
                applyAccessibility(fontSize, e.target.checked, teacherMode);
              }}
            />
          </div>
        </section>

        {/* Section 3: Teacher / Facilitator Mode */}
        <section style={{ border: "1px solid var(--ifm-color-emphasis-300)", borderRadius: "8px", padding: "1.25rem", marginTop: "1.5rem" }}>
          <h2>🎓 Teacher & Facilitator Mode</h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem" }}>
            <div>
              <strong>Enable Teacher View</strong>
              <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                Displays semantic misconception feedback, target answers, and AST diagnostic inspector panels during lessons.
              </div>
            </div>
            <input
              type="checkbox"
              checked={teacherMode}
              style={{ transform: "scale(1.4)", cursor: "pointer" }}
              onChange={(e) => {
                setTeacherMode(e.target.checked);
                applyAccessibility(fontSize, highContrast, e.target.checked);
              }}
            />
          </div>
        </section>

        {/* Section 4: AI Engine Selection */}
        <section style={{ border: "1px solid var(--ifm-color-emphasis-300)", borderRadius: "8px", padding: "1.25rem", marginTop: "1.5rem" }}>
          <h2>🤖 On-Device AI Engine</h2>
          <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>
            Select which offline model powers the Socratic tutor.
          </p>

          <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
            {AVAILABLE_MODELS.map((m) => (
              <div
                key={m.id}
                onClick={() => !loading && handleModelSelect(m.id)}
                style={{
                  border: selectedModel === m.id ? "2px solid var(--ifm-color-primary)" : "1px solid var(--ifm-color-emphasis-300)",
                  borderRadius: "8px",
                  padding: "1rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  background: selectedModel === m.id ? "var(--ifm-color-primary-lightest)" : "transparent",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{m.name}</strong>
                  <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>{m.size}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1.25rem", padding: "1rem", background: "var(--ifm-color-emphasis-100)", borderRadius: "8px" }}>
            <strong>Status:</strong> {status}
            {loading && (
              <div style={{ width: "100%", background: "#ccc", height: "8px", borderRadius: "4px", marginTop: "0.5rem", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, background: "var(--ifm-color-primary)", height: "100%", transition: "width 0.2s" }} />
              </div>
            )}
          </div>
        </section>

        {/* Section 5: Live VFS S-Expression Engine */}
        <section style={{ border: "1px solid var(--ifm-color-emphasis-300)", borderRadius: "8px", padding: "1.25rem", marginTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <h2>📑 IndexedDB VFS View: <code>/sys/views/cheat_sheet.lisp</code></h2>
            <button
              type="button"
              className="button button--secondary button--sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Lisp Source"}
            </button>
          </div>

          {isEditing && (
            <div style={{ marginBottom: "1rem" }}>
              <textarea
                value={vfsSource}
                onChange={(e) => setVfsSource(e.target.value)}
                rows={7}
                style={{
                  width: "100%",
                  fontFamily: "monospace",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid var(--ifm-color-emphasis-400)",
                  background: "var(--ifm-background-surface-color)",
                  color: "inherit"
                }}
              />
              <button
                type="button"
                className="button button--primary button--sm margin-top--xs"
                onClick={handleSaveVfsEdit}
              >
                Save & Hot-Reload to IndexedDB
              </button>
            </div>
          )}

          {dynamicAst ? (
            <SExprViewRenderer ast={dynamicAst} onAction={handleVfsAction} />
          ) : (
            <p>Loading view from IndexedDB...</p>
          )}
        </section>
      </main>
    </Layout>
  );
}