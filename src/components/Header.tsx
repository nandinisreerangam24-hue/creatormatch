"use client";

import React from "react";

interface HeaderProps {
  userEmail?: string | null;
  userRole?: string | null;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export default function Header({
  userEmail,
  userRole,
  onOpenAuth,
  onSignOut,
}: HeaderProps) {
  return (
    <header>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div className="logo">C</div>
        <div>
          <h1>CreatorMatch</h1>
          <small>AI-native marketplace for AI creators and brands</small>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {userEmail ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="badge" style={{ textTransform: "capitalize" }}>
              {userRole || "User"}
            </span>
            <span className="muted" style={{ fontSize: "12px", display: "none" }}>
              {userEmail}
            </span>
            <button className="btn ghost small" onClick={onSignOut}>
              Sign out
            </button>
          </div>
        ) : (
          onOpenAuth && (
            <button className="btn ghost small" onClick={onOpenAuth}>
              Sign in
            </button>
          )
        )}
      </div>
    </header>
  );
}
