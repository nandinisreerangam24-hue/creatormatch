"use client";

import React from "react";
import { Creator, FilterState } from "@/lib/types";
import { unique, verifiedCount } from "@/lib/utils";
import CreatorCard from "./CreatorCard";

interface DiscoverViewProps {
  creators: Creator[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onViewPortfolio: (creator: Creator) => void;
  onResetFilters: () => void;
}

export default function DiscoverView({
  creators,
  filters,
  onFilterChange,
  onViewPortfolio,
  onResetFilters,
}: DiscoverViewProps) {
  // Extract unique options from the creators list
  const specializations = unique(creators.map((c) => c.specialization)).sort();

  const allTools = unique(
    creators.reduce<string[]>((acc, c) => acc.concat(c.tools || []), [])
  ).sort();

  const allSkills = unique(
    creators.reduce<string[]>((acc, c) => acc.concat(c.skills || []), [])
  ).sort();

  const contentTypes = ["Video", "Animation", "Graphic", "Audio"];

  // Toggle skill selection
  const handleToggleSkill = (skill: string) => {
    const isSelected = filters.skills.includes(skill);
    const updatedSkills = isSelected
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];
    onFilterChange({ ...filters, skills: updatedSkills });
  };

  // Filter creators logic
  const filteredCreators = creators.filter((c) => {
    if (filters.spec && c.specialization !== filters.spec) return false;
    if (filters.tool && !(c.tools || []).includes(filters.tool)) return false;
    if (filters.type && !(c.types as string[] || []).includes(filters.type)) return false;
    if (filters.verified && verifiedCount(c) === 0) return false;

    // All selected skills must be present on the creator
    for (const skill of filters.skills) {
      if (!(c.skills || []).includes(skill)) return false;
    }

    if (filters.q) {
      const query = filters.q.toLowerCase();
      const searchable = [
        c.name,
        c.headline,
        c.specialization,
        c.location || "",
        ...(c.skills || []),
        ...(c.tools || []),
      ]
        .join(" ")
        .toLowerCase();

      if (!searchable.includes(query)) return false;
    }

    return true;
  });

  return (
    <section id="view-discover" className="view active">
      <h2>Find AI creators</h2>
      <p className="sub">
        Search and filter by skills, specialization, tools and content type.
      </p>

      <div className="panel">
        <label htmlFor="q" style={{ marginTop: 0 }}>
          Search
        </label>
        <input
          id="q"
          placeholder="Name, headline, skill, tool..."
          value={filters.q}
          onChange={(e) => onFilterChange({ ...filters, q: e.target.value })}
        />

        <div className="row three">
          <div>
            <label htmlFor="fSpec">Specialization</label>
            <select
              id="fSpec"
              value={filters.spec}
              onChange={(e) =>
                onFilterChange({ ...filters, spec: e.target.value })
              }
            >
              <option value="">All specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fTool">Tool</label>
            <select
              id="fTool"
              value={filters.tool}
              onChange={(e) =>
                onFilterChange({ ...filters, tool: e.target.value })
              }
            >
              <option value="">All tools</option>
              {allTools.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fType">Content type</label>
            <select
              id="fType"
              value={filters.type}
              onChange={(e) =>
                onFilterChange({ ...filters, type: e.target.value })
              }
            >
              <option value="">All types</option>
              {contentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label>Skills (creator must have all selected)</label>
        <div className="chips">
          {allSkills.map((skill) => {
            const on = filters.skills.includes(skill);
            return (
              <span
                key={skill}
                className={`chip ${on ? "on" : ""}`}
                onClick={() => handleToggleSkill(skill)}
              >
                {skill}
              </span>
            );
          })}
        </div>

        <div className="checks">
          <label>
            <input
              type="checkbox"
              id="fVerified"
              checked={filters.verified}
              onChange={(e) =>
                onFilterChange({ ...filters, verified: e.target.checked })
              }
            />{" "}
            Verified creators only (tools, workflows or past work verified)
          </label>
        </div>

        <div className="actions">
          <button className="btn ghost small" onClick={onResetFilters}>
            Clear filters
          </button>
          <span
            className="muted"
            id="resultCount"
            style={{ alignSelf: "center" }}
          >
            {filteredCreators.length} creator
            {filteredCreators.length === 1 ? "" : "s"} found
          </span>
        </div>
      </div>

      <div className="grid">
        {filteredCreators.length > 0 ? (
          filteredCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onViewPortfolio={onViewPortfolio}
            />
          ))
        ) : (
          <div className="empty" style={{ gridColumn: "1 / -1" }}>
            <b>No creators match these filters</b>
            Try removing a skill or tool, or clear all filters.
            <div className="actions" style={{ justifyContent: "center" }}>
              <button className="btn small" onClick={onResetFilters}>
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
