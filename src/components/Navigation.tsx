"use client";

import React from "react";

export type TabType = "discover" | "briefs" | "engagements" | "join";

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  engagementCount?: number;
}

export default function Navigation({
  activeTab,
  onTabChange,
  engagementCount = 0,
}: NavigationProps) {
  return (
    <nav id="tabs">
      <button
        type="button"
        className={activeTab === "discover" ? "active" : ""}
        onClick={() => onTabChange("discover")}
      >
        Discover
      </button>
      <button
        type="button"
        className={activeTab === "briefs" ? "active" : ""}
        onClick={() => onTabChange("briefs")}
      >
        Briefs
      </button>
      <button
        type="button"
        className={activeTab === "engagements" ? "active" : ""}
        onClick={() => onTabChange("engagements")}
      >
        Engagements {engagementCount > 0 ? `(${engagementCount})` : ""}
      </button>
      <button
        type="button"
        className={activeTab === "join" ? "active" : ""}
        onClick={() => onTabChange("join")}
      >
        Join as creator
      </button>
    </nav>
  );
}
