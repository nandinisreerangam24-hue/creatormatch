"use client";

import React from "react";
import { Brief, Creator, Engagement, STAGES } from "@/lib/types";

interface EngagementsViewProps {
  engagements: Engagement[];
  creators: Creator[];
  briefs: Brief[];
  onAdvanceStage: (engagementId: string) => void;
  onRequestRevision: (engagementId: string) => void;
  onRemoveEngagement: (engagementId: string) => void;
}

export default function EngagementsView({
  engagements,
  creators,
  briefs,
  onAdvanceStage,
  onRequestRevision,
  onRemoveEngagement,
}: EngagementsViewProps) {
  if (!engagements.length) {
    return (
      <section id="view-engagements" className="view active">
        <h2>Engagements</h2>
        <p className="sub">Track each creator from invite to delivery.</p>
        <div className="empty">
          <b>No engagements yet</b>
          Open a creator profile and invite them to one of your briefs.
        </div>
      </section>
    );
  }

  return (
    <section id="view-engagements" className="view active">
      <h2>Engagements</h2>
      <p className="sub">Track each creator from invite to delivery.</p>

      <div id="engList">
        {engagements.map((g) => {
          const c = creators.find((x) => x.id === g.creatorId);
          const b = briefs.find((x) => x.id === g.briefId);
          if (!c || !b) return null;

          const pct = Math.round((g.stage / (STAGES.length - 1)) * 100);
          const currentStageName = STAGES[g.stage];

          return (
            <div key={g.id} className="eng">
              <b>{c.name}</b> <span className="muted">on</span>{" "}
              <b>{b.title}</b>
              <div className="muted" style={{ marginTop: "4px" }}>
                Status: {currentStageName} — Revisions: {g.revisions}
              </div>

              <div className="bar">
                <i style={{ width: `${pct}%` }}></i>
              </div>

              <div className="steps">
                {STAGES.map((s, idx) => (
                  <span
                    key={s}
                    className={idx <= g.stage ? "done" : ""}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="actions">
                {g.stage < STAGES.length - 1 && (
                  <button
                    className="btn small"
                    onClick={() => onAdvanceStage(g.id)}
                  >
                    Move to {STAGES[g.stage + 1]}
                  </button>
                )}

                {currentStageName === "Review" && (
                  <button
                    className="btn ghost small"
                    onClick={() => onRequestRevision(g.id)}
                  >
                    Request revision
                  </button>
                )}

                <button
                  className="btn danger small"
                  onClick={() => onRemoveEngagement(g.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
