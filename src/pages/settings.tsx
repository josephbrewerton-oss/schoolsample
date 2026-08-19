import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import { AVAILABLE_MODELS, loadModel } from "@site/src/utils/aiEngine";

export default function SettingsPage(): JSX.Element {
  // AI Engine states
  const [selectedModel, setSelectedModel] = useState<string>("gemini-nano");
  const [status, setStatus] = useState<string>("Ready");
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Accessibility & Educator states
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [teacherMode, setTeacherMode] = useState<boolean>(false);

  useEffect(() => {
    // Load saved preferences
    const savedModel = localStorage.getItem("preferred_ai_model");
    const storedFont = localStorage.getItem("app_font_size") as "normal" | "large" | "xlarge" | null;
    const storedContrast = localStorage.getItem("app_high_contrast") === "true";
    const storedTeacher = localStorage.getItem("app_teacher_mode") === "true";

    if (savedModel) setSelectedModel(savedModel);
    if (storedFont) setFontSize(storedFont);
    if (storedContrast) setHighContrast(true);
    if (storedTeacher) setTeacherMode(true);
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

  return (
    <Layout title="Settings & Accessibility" description="Choose local on-device AI model, visual accessibility, and teacher tools">
      <main className="container margin-vert--lg" style={{ maxWidth: "800px" }}>
        <h1>⚙️ System Settings & Accessibility</h1>
        <p style={{ color: "var(--ifm-color-emphasis-700)" }}>
          Preferences are stored 100% locally on your device without tracking cookies or external servers.
        </p>

        {/* Section 1: Accessibility */}
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

        {/* Section 2: Teacher / Facilitator Mode */}
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

        {/* Section 3: AI Engine Selection */}
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
      </main>
    </Layout>
  );
}