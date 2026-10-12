"use client";

import React, { useState } from "react";
import { Brief, Creator } from "@/lib/types";
import { hueOf, initials } from "@/lib/utils";

interface CreatorModalProps {
  creator: Creator | null;
  briefs: Brief[];
  onClose: () => void;
  onInvite: (creatorId: string, briefId: string) => void;
  onGoToBriefs: () => void;
}

export default function CreatorModal({
  creator,
  briefs,
  onClose,
  onInvite,
  onGoToBriefs,
}: CreatorModalProps) {
  const [selectedBriefId, setSelectedBriefId] = useState<string>(
    briefs.length > 0 ? briefs[0].id : ""
  );

  if (!creator) return null;

  const v = creator.verified || { tools: false, workflows: false, pastWork: false };
  const avatarBg = `hsl(${hueOf(creator.name)}, 55%, 45%)`;

  const handleInvite = () => {
    if (!selectedBriefId && briefs.length > 0) {
      onInvite(creator.id, briefs[0].id);
    } else if (selectedBriefId) {
      onInvite(creator.id, selectedBriefId);
    }
  };

  return (
    <div
      className="overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <button
          className="btn ghost small close"
          style={{ float: "right" }}
          onClick={onClose}
        >
          Close
        </button>

        <div className="top" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className="avatar" style={{ background: avatarBg }}>
            {initials(creator.name)}
          </div>
          <div>
            <h2>{creator.name}</h2>
            <div className="muted">
              {creator.headline}
              {creator.location ? ` - ${creator.location}` : ""}
            </div>
          </div>
        </div>

        <p style={{ marginTop: "12px" }}>
          <b>Specialization:</b> {creator.specialization}
        </p>

        <label>Tools / models</label>
        <div>
          {(creator.tools || []).map((t) => (
            <span key={t} className="tag tool">
              {t}
            </span>
          ))}
        </div>

        <label>Skills</label>
        <div>
          {(creator.skills || []).map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>

        <label>Content types</label>
        <div>
          {(creator.types || []).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        <label>Workflow</label>
        <p style={{ whiteSpace: "pre-line" }}>{creator.workflow || "Not provided"}</p>

        <label>Verification signals</label>
        <div className="sig">
          <div>
            <span>Tools verified</span>
            <span className={v.tools ? "ok" : "no"}>
              {v.tools ? "✓ Verified" : "Not yet"}
            </span>
          </div>
          <div>
            <span>Workflow verified</span>
            <span className={v.workflows ? "ok" : "no"}>
              {v.workflows ? "✓ Verified" : "Not yet"}
            </span>
          </div>
          <div>
            <span>Past work verified</span>
            <span className={v.pastWork ? "ok" : "no"}>
              {v.pastWork ? "✓ Verified" : "Not yet"}
            </span>
          </div>
        </div>

        <label>AI portfolio</label>
        <div className="port">
          {(creator.portfolio || []).map((w, idx) => {
            const hue = w.hue || hueOf(w.title || `work-${idx}`);
            const bg = `linear-gradient(135deg, hsl(${hue}, 60%, 38%), hsl(${(hue + 50) % 360}, 55%, 24%))`;
            return (
              <div key={idx} className="work" style={{ background: bg }}>
                <span className="kind">{w.kind}</span>
                <b>{w.title}</b>
                <span>Made with {w.tool || "AI tools"}</span>
              </div>
            );
          })}
        </div>

        <label>Invite to a brief</label>
        {briefs.length > 0 ? (
          <div className="row two" style={{ marginTop: "6px" }}>
            <select
              value={selectedBriefId}
              onChange={(e) => setSelectedBriefId(e.target.value)}
            >
              {briefs.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
            <button className="btn green" onClick={handleInvite}>
              Invite creator
            </button>
          </div>
        ) : (
          <div className="empty" style={{ marginTop: "6px" }}>
            <b>No briefs yet</b>
            Publish a brief first, then invite creators.
            <div className="actions" style={{ justifyContent: "center" }}>
              <button
                className="btn small"
                onClick={() => {
                  onClose();
                  onGoToBriefs();
                }}
              >
                Create a brief
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
