"use client";

import React from "react";
import { TabType } from "./Navigation";

interface HeroIntroProps {
  onNavigate: (tab: TabType) => void;
  creatorCount?: number;
}

export default function HeroIntro({
  onNavigate,
  creatorCount = 8,
}: HeroIntroProps) {
  return (
    <div
      className="panel"
      style={{
        background:
          "linear-gradient(145deg, rgba(31, 35, 44, 0.95), rgba(24, 27, 34, 0.98))",
        border: "1px solid rgba(124, 92, 255, 0.35)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        padding: "24px 20px",
        marginBottom: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow orb */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124, 92, 255, 0.25) 0%, rgba(34, 211, 166, 0.05) 70%, transparent 100%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
          <span
            className="badge"
            style={{
              background: "rgba(124, 92, 255, 0.15)",
              border: "1px solid #7c5cff",
              color: "#b9a8ff",
              padding: "4px 10px",
              fontWeight: 600,
            }}
          >
            ✨ AI-Native Marketplace
          </span>
          <span
            className="badge"
            style={{
              background: "rgba(34, 211, 166, 0.12)",
              border: "1px solid #1d5c4b",
              color: "var(--brand2)",
              padding: "4px 10px",
            }}
          >
            Kampus.VC Hackathon 2026
          </span>
          <span
            className="muted"
            style={{ fontSize: "12px", marginLeft: "auto" }}
          >
            {creatorCount}+ Verified AI Artists Live
          </span>
        </div>

        <h1
          style={{
            fontSize: "26px",
            lineHeight: 1.3,
            fontWeight: 800,
            marginBottom: "10px",
            letterSpacing: "-0.02em",
          }}
        >
          Hire World-Class{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #a78bfa, #22d3a6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI Filmmakers, Animators &amp; Designers
          </span>
        </h1>

        <p
          className="muted"
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            maxWidth: "760px",
            marginBottom: "18px",
          }}
        >
          Skip the prompt trial-and-error. Connect directly with specialized
          generative creators with transparent generation pipelines (Runway,
          Midjourney, Kling, Flux), 3-tier verification, and clear commercial
          rights for brand campaigns.
        </p>

        {/* Action Feature Highlights */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(15, 17, 21, 0.6)",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              padding: "10px 12px",
            }}
          >
            <div style={{ color: "var(--brand2)", fontWeight: 700, fontSize: "14px" }}>
              ⚡ 10x Turnaround
            </div>
            <div className="muted" style={{ fontSize: "12px", marginTop: "2px" }}>
              High-fidelity ads &amp; motion loops delivered in days.
            </div>
          </div>

          <div
            style={{
              background: "rgba(15, 17, 21, 0.6)",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              padding: "10px 12px",
            }}
          >
            <div style={{ color: "#a78bfa", fontWeight: 700, fontSize: "14px" }}>
              🛡️ 3-Tier Verified
            </div>
            <div className="muted" style={{ fontSize: "12px", marginTop: "2px" }}>
              Proven tools, consistent workflows &amp; past client work.
            </div>
          </div>

          <div
            style={{
              background: "rgba(15, 17, 21, 0.6)",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              padding: "10px 12px",
            }}
          >
            <div style={{ color: "var(--warn)", fontWeight: 700, fontSize: "14px" }}>
              🤖 AI Brief Builder
            </div>
            <div className="muted" style={{ fontSize: "12px", marginTop: "2px" }}>
              Turn raw concept ideas into structured campaign briefs.
            </div>
          </div>

          <div
            style={{
              background: "rgba(15, 17, 21, 0.6)",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              padding: "10px 12px",
            }}
          >
            <div style={{ color: "#38bdf8", fontWeight: 700, fontSize: "14px" }}>
              📜 Commercial Safe
            </div>
            <div className="muted" style={{ fontSize: "12px", marginTop: "2px" }}>
              Pre-vetted licensing for paid-media ads &amp; asset rights.
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="actions" style={{ marginTop: 0 }}>
          <button
            className="btn"
            style={{ padding: "10px 20px" }}
            onClick={() => onNavigate("discover")}
          >
            🔍 Explore Creators
          </button>
          <button
            className="btn green"
            style={{ padding: "10px 18px" }}
            onClick={() => onNavigate("briefs")}
          >
            ✨ Create AI Brief
          </button>
          <button
            className="btn ghost"
            style={{ padding: "10px 18px" }}
            onClick={() => onNavigate("join")}
          >
            🚀 Join as Creator
          </button>
        </div>
      </div>
    </div>
  );
}
