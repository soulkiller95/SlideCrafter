"use client";

import { useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState(10);
  const [linesPerSlide, setLinesPerSlide] = useState(10);
  const [theme, setTheme] = useState("dark");

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingPpt, setLoadingPpt] = useState(false);

  const [outline, setOutline] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");

  const themes = [
    { id: "dark", label: "Dark Modern", bg: "#0B0B10", text: "#FFFFFF", accent: "#5B5BFF" },
    { id: "light", label: "Light Professional", bg: "#FFFFFF", text: "#111111", accent: "#2563EB" },
    { id: "corporate", label: "Corporate Blue", bg: "#F6F7FB", text: "#111827", accent: "#0F766E" },
    { id: "neon", label: "Neon Cyber", bg: "#000000", text: "#00FFCC", accent: "#FF00FF" },
    { id: "ocean", label: "Ocean Breeze", bg: "#0F172A", text: "#E2E8F0", accent: "#38BDF8" },
    { id: "sunset", label: "Sunset Glow", bg: "#4C1D11", text: "#FFF7ED", accent: "#FB923C" },
    { id: "forest", label: "Deep Forest", bg: "#1A2F1A", text: "#F0FDF4", accent: "#4ADE80" },
    { id: "minimal", label: "Minimalist", bg: "#FFFFFF", text: "#000000", accent: "#000000" }
  ];

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  async function generatePreview() {
    setLoadingPreview(true);
    setOutline(null);
    setDownloadUrl("");

    try {
      const res = await fetch("/api/generate-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          topic,
          slides,
          linesPerSlide
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to generate preview");

      setOutline(data);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingPreview(false);
    }
  }

  async function downloadPpt() {
    if (!outline) return alert("Please generate preview first.");

    setLoadingPpt(true);
    setDownloadUrl("");

    try {
      const res = await fetch("/api/generate-ppt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outline,
          theme
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to generate PPT");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingPpt(false);
    }
  }

  return (
    <div className="container animate-enter">
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1>SlideCrafter AI Generator</h1>
        <p className="subtitle">
          Transform your ideas into professional presentations in seconds.
          Generate structured outlines and export directly to PowerPoint.
        </p>
      </div>

      <div className="glass-card">
        <div className="input-group">
          <label>Topic Title</label>
          <input
            placeholder="e.g. The Future of Artificial Intelligence"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Presentation Prompt</label>
          <textarea
            rows={5}
            placeholder='Describe your presentation in detail. Example: "Create a 10-slide presentation about AI trends in 2025, focusing on generative models, ethical concerns, and industrial applications."'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label>Slide Count ({slides})</label>
            <input
              type="range"
              min={5}
              max={20}
              value={slides}
              onChange={(e) => setSlides(Number(e.target.value))}
              style={{ padding: 0, height: 40 }}
            />
          </div>

          <div className="input-group">
            <label>Content Density (Lines: {linesPerSlide})</label>
            <input
              type="range"
              min={8}
              max={15}
              value={linesPerSlide}
              onChange={(e) => setLinesPerSlide(Number(e.target.value))}
              style={{ padding: 0, height: 40 }}
            />
          </div>
        </div>

        <div className="action-bar">
          <button
            className="btn-primary"
            onClick={generatePreview}
            disabled={loadingPreview || !prompt.trim()}
          >
            {loadingPreview ? (
              "✨ Analyzing & Generating..."
            ) : (
              "✨ Generate Preview"
            )}
          </button>
        </div>
      </div>

      {/* Preview Section */}
      {outline && (
        <div className="glass-card animate-enter">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0 }}>Presentation Preview</h2>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn-primary"
                onClick={downloadPpt}
                disabled={loadingPpt}
                style={{ padding: '12px 24px', fontSize: '0.9rem' }}
              >
                {loadingPpt ? "Processing..." : "Download .pptx"}
              </button>

              {downloadUrl && (
                <a href={downloadUrl} download="presentation.pptx" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
                    Save File
                  </button>
                </a>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ marginBottom: 12, display: 'block' }}>Choose Designer Theme</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  style={{
                    background: t.bg,
                    border: theme === t.id ? `2px solid ${t.accent}` : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 8,
                    padding: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    transform: theme === t.id ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: theme === t.id ? `0 4px 12px ${t.accent}40` : 'none'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: 40,
                    background: t.accent,
                    borderRadius: 4,
                    opacity: 0.8
                  }} />
                  <span style={{
                    color: (t.bg === '#FFFFFF' || t.bg === '#F6F7FB') ? '#000' : '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textShadow: (t.bg === '#FFFFFF' || t.bg === '#F6F7FB') ? 'none' : '0 1px 2px rgba(0,0,0,0.5)'
                  }}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{
            background: currentTheme.bg,
            padding: 32,
            borderRadius: 16,
            border: `1px solid ${currentTheme.accent}40`,
            transition: 'background 0.3s ease'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 32, borderBottom: `2px solid ${currentTheme.accent}20`, paddingBottom: 20 }}>
              <h2 style={{ color: currentTheme.text, fontSize: '2rem', transition: 'color 0.3s ease' }}>{outline.title}</h2>
              {outline.subtitle && <p style={{ color: currentTheme.accent, fontSize: '1.2rem', fontWeight: 500 }}>{outline.subtitle}</p>}
            </div>

            {outline.slides.map((s, index) => (
              <div key={index} className="preview-slide" style={{ background: currentTheme.bg, borderColor: `${currentTheme.accent}30` }}>
                <div className="slide-badge" style={{ background: currentTheme.accent, color: (currentTheme.bg === '#FFFFFF' || currentTheme.bg === '#F6F7FB') ? '#fff' : '#000' }}>Slide {index + 1}</div>
                <div className="slide-header" style={{ borderColor: `${currentTheme.accent}20` }}>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', color: currentTheme.text }}>{s.title}</h3>
                </div>

                <div className="slide-content">
                  <ul style={{ color: currentTheme.text, opacity: 0.9 }}>
                    {s.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                {s.speakerNotes && (
                  <div className="speaker-notes" style={{ color: currentTheme.text, opacity: 0.6, borderColor: `${currentTheme.accent}20` }}>
                    <strong>Speaker:</strong> {s.speakerNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}