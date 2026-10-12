"use client";

import React, { useState } from "react";
import { ContentType, CONTENT_TYPES, Creator, PortfolioItem } from "@/lib/types";
import { hueOf, uid } from "@/lib/utils";

interface JoinViewProps {
  onPublishProfile: (creator: Creator) => void;
  onShowToast: (msg: string) => void;
}

export default function JoinView({
  onPublishProfile,
  onShowToast,
}: JoinViewProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [headline, setHeadline] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [toolsStr, setToolsStr] = useState("");
  const [chosenTypes, setChosenTypes] = useState<ContentType[]>([]);
  const [workflow, setWorkflow] = useState("");

  // Verification checks
  const [toolsVerified, setToolsVerified] = useState(false);
  const [workflowVerified, setWorkflowVerified] = useState(false);
  const [pastWorkVerified, setPastWorkVerified] = useState(false);

  // Portfolio items
  const [p1Title, setP1Title] = useState("");
  const [p1Kind, setP1Kind] = useState<ContentType>("Video");
  const [p1Tool, setP1Tool] = useState("");

  const [p2Title, setP2Title] = useState("");
  const [p2Kind, setP2Kind] = useState<ContentType>("Video");
  const [p2Tool, setP2Tool] = useState("");

  const toggleType = (t: ContentType) => {
    setChosenTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const splitList = (s: string) =>
    s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !headline.trim() || !specialization.trim()) {
      onShowToast("Please fill in all required fields marked with *");
      return;
    }

    if (chosenTypes.length === 0) {
      onShowToast("Pick at least one content type");
      return;
    }

    const portfolio: PortfolioItem[] = [];
    if (p1Title.trim()) {
      portfolio.push({
        title: p1Title.trim(),
        kind: p1Kind,
        tool: p1Tool.trim() || "AI tools",
        hue: hueOf(p1Title.trim()),
      });
    }
    if (p2Title.trim()) {
      portfolio.push({
        title: p2Title.trim(),
        kind: p2Kind,
        tool: p2Tool.trim() || "AI tools",
        hue: hueOf(p2Title.trim()),
      });
    }

    const newCreator: Creator = {
      id: uid(),
      name: name.trim(),
      location: location.trim(),
      headline: headline.trim(),
      specialization: specialization.trim(),
      skills: splitList(skillsStr),
      tools: splitList(toolsStr),
      types: chosenTypes,
      workflow: workflow.trim(),
      verified: {
        tools: toolsVerified,
        workflows: workflowVerified,
        pastWork: pastWorkVerified,
      },
      portfolio,
    };

    onPublishProfile(newCreator);

    // Reset form
    setName("");
    setLocation("");
    setHeadline("");
    setSpecialization("");
    setSkillsStr("");
    setToolsStr("");
    setChosenTypes([]);
    setWorkflow("");
    setToolsVerified(false);
    setWorkflowVerified(false);
    setPastWorkVerified(false);
    setP1Title("");
    setP1Tool("");
    setP2Title("");
    setP2Tool("");

    onShowToast("Profile published!");
  };

  return (
    <section id="view-join" className="view active">
      <h2>Create your creator profile</h2>
      <p className="sub">
        Show your AI-generated work, tools, skills and workflow.
      </p>

      <form className="panel" id="creatorForm" onSubmit={handleSubmit}>
        <div className="row two">
          <div>
            <label htmlFor="cName">Name *</label>
            <input
              id="cName"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="cLoc">Location</label>
            <input
              id="cLoc"
              placeholder="City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="row two">
          <div>
            <label htmlFor="cHead">Headline *</label>
            <input
              id="cHead"
              required
              placeholder="AI filmmaker"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="cSpec">Specialization *</label>
            <input
              id="cSpec"
              required
              placeholder="Cinematic ads"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </div>
        </div>

        <label htmlFor="cSkills">Skills (comma separated)</label>
        <input
          id="cSkills"
          placeholder="Storyboarding, Prompt engineering"
          value={skillsStr}
          onChange={(e) => setSkillsStr(e.target.value)}
        />

        <label htmlFor="cTools">Tools / models (comma separated)</label>
        <input
          id="cTools"
          placeholder="Runway, Midjourney"
          value={toolsStr}
          onChange={(e) => setToolsStr(e.target.value)}
        />

        <label>Content types</label>
        <div className="chips" id="cTypes">
          {CONTENT_TYPES.map((t) => (
            <span
              key={t}
              className={`chip ${chosenTypes.includes(t) ? "on" : ""}`}
              onClick={() => toggleType(t)}
            >
              {t}
            </span>
          ))}
        </div>

        <label htmlFor="cFlow">Workflow</label>
        <textarea
          id="cFlow"
          placeholder="Describe how you go from brief to final output..."
          value={workflow}
          onChange={(e) => setWorkflow(e.target.value)}
        />

        <label>Verification signals (self-declared, demo)</label>
        <div className="checks">
          <label>
            <input
              type="checkbox"
              id="vTools"
              checked={toolsVerified}
              onChange={(e) => setToolsVerified(e.target.checked)}
            />{" "}
            Tools verified
          </label>
          <label>
            <input
              type="checkbox"
              id="vFlow"
              checked={workflowVerified}
              onChange={(e) => setWorkflowVerified(e.target.checked)}
            />{" "}
            Workflow verified
          </label>
          <label>
            <input
              type="checkbox"
              id="vWork"
              checked={pastWorkVerified}
              onChange={(e) => setPastWorkVerified(e.target.checked)}
            />{" "}
            Past work verified
          </label>
        </div>

        <label>Portfolio piece 1</label>
        <div className="row three">
          <input
            id="w1t"
            placeholder="Title"
            value={p1Title}
            onChange={(e) => setP1Title(e.target.value)}
          />
          <select
            id="w1k"
            value={p1Kind}
            onChange={(e) => setP1Kind(e.target.value as ContentType)}
          >
            {CONTENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            id="w1tool"
            placeholder="Tool used"
            value={p1Tool}
            onChange={(e) => setP1Tool(e.target.value)}
          />
        </div>

        <label>Portfolio piece 2 (optional)</label>
        <div className="row three">
          <input
            id="w2t"
            placeholder="Title"
            value={p2Title}
            onChange={(e) => setP2Title(e.target.value)}
          />
          <select
            id="w2k"
            value={p2Kind}
            onChange={(e) => setP2Kind(e.target.value as ContentType)}
          >
            {CONTENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            id="w2tool"
            placeholder="Tool used"
            value={p2Tool}
            onChange={(e) => setP2Tool(e.target.value)}
          />
        </div>

        <div className="actions">
          <button className="btn" type="submit">
            Publish profile
          </button>
        </div>
      </form>
    </section>
  );
}
