import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import { AVAILABLE_MODELS, loadModel } from "@site/src/utils/aiEngine";

export default function SettingsPage() {
  const [selectedModel, setSelectedModel] = useState<string>("gemini-nano");
  const [status, setStatus] = useState<string>("Ready");
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("preferred_ai_model");
    if (saved) setSelectedModel(saved);
  }, []);

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
    <Layout title="AI Model Configuration" description="Choose your local on-device AI model">
      <main className="container margin-vert--lg" style={{ maxWidth: "800px" }}>
        <h1>AI Model Settings</h1>
        <p>Select which AI engine executes your interactive lessons. Everything runs 100% locally in your browser memory.</p>

        <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
          {AVAILABLE_MODELS.map((m) => (
            <div
              key={m.id}
              onClick={() => !loading && handleModelSelect(m.id)}
              style={{
                border: selectedModel === m.id ? "2px solid var(--ifm-color-primary)" : "1px solid var(--ifm-color-emphasis-300)",
                borderRadius: "8px",
                padding: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                background: selectedModel === m.id ? "var(--ifm-color-primary-lightest)" : "transparent"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{m.name}</strong>
                <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>{m.size}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2rem", padding: "1rem", background: "var(--ifm-color-emphasis-100)", borderRadius: "8px" }}>
          <strong>Status:</strong> {status}
          {loading && (
            <div style={{ width: "100%", background: "#ccc", height: "8px", borderRadius: "4px", marginTop: "0.5rem", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, background: "var(--ifm-color-primary)", height: "100%", transition: "width 0.2s" }} />
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}