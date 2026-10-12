"use client";

import React from "react";
import { Creator } from "@/lib/types";
import { hueOf, initials, verifiedCount } from "@/lib/utils";

interface CreatorCardProps {
  creator: Creator;
  onViewPortfolio: (creator: Creator) => void;
}

export default function CreatorCard({
  creator,
  onViewPortfolio,
}: CreatorCardProps) {
  const n = verifiedCount(creator);
  const avatarBg = `hsl(${hueOf(creator.name)}, 55%, 45%)`;

  return (
    <div className="creator">
      <div className="top">
        <div className="avatar" style={{ background: avatarBg }}>
          {initials(creator.name)}
        </div>
        <div>
          <h3>{creator.name}</h3>
          <div className="muted">
            {creator.headline}
            {creator.location ? ` - ${creator.location}` : ""}
          </div>
        </div>
      </div>

      <div className="muted">
        Specialization:{" "}
        <b style={{ color: "var(--text)" }}>{creator.specialization}</b>
      </div>

      <div>
        {(creator.tools || []).map((t) => (
          <span key={t} className="tag tool">
            {t}
          </span>
        ))}
      </div>

      <div>
        {(creator.skills || []).map((s) => (
          <span key={s} className="tag">
            {s}
          </span>
        ))}
      </div>

      <div
        className="actions"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        {n > 0 ? (
          <span className="badge">✓ {n}/3 verified</span>
        ) : (
          <span className="badge none">Not verified yet</span>
        )}
        <button
          className="btn small"
          onClick={() => onViewPortfolio(creator)}
        >
          View portfolio
        </button>
      </div>
    </div>
  );
}
