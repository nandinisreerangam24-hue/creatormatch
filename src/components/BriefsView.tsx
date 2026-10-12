"use client";

import React, { useState } from "react";
import {
  ASPECT_RATIOS,
  Brief,
  COMMERCIAL_OPTIONS,
  CONTENT_TYPES,
  STYLES,
} from "@/lib/types";
import { uid } from "@/lib/utils";

interface BriefsViewProps {
  briefs: Brief[];
  onPublishBrief: (brief: Brief) => void;
  onDeleteBrief: (briefId: string) => void;
  onFindMatchingCreators: (brief: Brief) => void;
  onShowToast: (msg: string) => void;
}

export default function BriefsView({
  briefs,
  onPublishBrief,
  onDeleteBrief,
  onFindMatchingCreators,
  onShowToast,
}: BriefsViewProps) {
  const [roughIdea, setRoughIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiNote, setShowAiNote] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [req, setReq] = useState("");
  const [type, setType] = useState<string>("Video");
  const [style, setStyle] = useState<string>("Modern & clean");
  const [ratio, setRatio] = useState<string>("16:9");
  const [selectedCommercial, setSelectedCommercial] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");

  const toggleCommercial = (item: string) => {
    setSelectedCommercial((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const hasWord = (text: string, words: string[]) => {
    return new RegExp(`\\b(${words.join("|")})`, "i").test(text);
  };

  // AI brief builder handler
  const handleBuildBrief = async () => {
    const idea = roughIdea.trim();
    if (idea.length < 10) {
      onShowToast("Write a slightly longer idea first");
      return;
    }

    setIsGenerating(true);

    try {
      // First attempt to call the server API endpoint
      const response = await fetch("/api/ai-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: idea }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.brief) {
          setTitle(data.brief.title || "");
          setReq(data.brief.req || "");
          if (data.brief.type) setType(data.brief.type);
          if (data.brief.style) setStyle(data.brief.style);
          if (data.brief.ratio) setRatio(data.brief.ratio);
          if (Array.isArray(data.brief.commercial)) {
            setSelectedCommercial(data.brief.commercial);
          }
          if (data.brief.budget) setBudget(String(data.brief.budget));
          if (data.brief.deadline) setDeadline(data.brief.deadline);
          setShowAiNote(data.isFallback === true);
          onShowToast("Brief drafted! Review and edit below.");
          setIsGenerating(false);
          return;
        }
      }
    } catch {
      // Fallback to client-side rule heuristic matching index.html
    }

    // Client-side rule heuristics fallback
    let detectedType = "Video";
    if (hasWord(idea, ["animation", "animated", "motion", "cartoon"])) {
      detectedType = "Animation";
    } else if (
      hasWord(idea, [
        "poster",
        "graphic",
        "banner",
        "logo",
        "image",
        "packaging",
        "lookbook",
      ])
    ) {
      detectedType = "Graphic";
    } else if (
      hasWord(idea, ["music", "audio", "jingle", "podcast", "voiceover"])
    ) {
      detectedType = "Audio";
    }

    let detectedStyle = "Modern & clean";
    const styleMap: Record<string, string[]> = {
      Cinematic: ["cinematic", "film"],
      Minimal: ["minimal", "simple"],
      Playful: ["playful", "fun", "kids"],
      Futuristic: ["futuristic", "sci-fi", "neon", "cyber"],
      Realistic: ["realistic", "photoreal"],
      Anime: ["anime"],
      Retro: ["retro", "vintage"],
    };
    Object.keys(styleMap).forEach((k) => {
      if (hasWord(idea, styleMap[k])) detectedStyle = k;
    });

    let detectedRatio = "16:9";
    if (
      hasWord(idea, [
        "reel",
        "story",
        "stories",
        "tiktok",
        "shorts",
        "vertical",
        "instagram",
      ])
    ) {
      detectedRatio = "9:16";
    } else if (hasWord(idea, ["square", "feed post"])) {
      detectedRatio = "1:1";
    } else if (hasWord(idea, ["youtube", "website", "landscape", "tv"])) {
      detectedRatio = "16:9";
    }

    const comm = ["Must disclose AI use", "Creator may show in portfolio"];
    if (
      hasWord(idea, [
        "ad",
        "ads",
        "advert",
        "campaign",
        "launch",
        "sell",
        "promo",
      ])
    ) {
      comm.push("Full commercial license");
      comm.push("Paid-media / ads usage");
    }

    const words = idea.replace(/[.!?]/g, "").split(/\s+/);
    setTitle(words.slice(0, 6).join(" "));
    setReq(
      `Goal: ${idea}\nDeliverables: 1 final ${detectedType.toLowerCase()} in ${detectedRatio}, plus 2 revision rounds.\nAudience: to be confirmed with the brand.\nShare tools used and the generation workflow with the final files.`
    );
    setType(detectedType);
    setStyle(detectedStyle);
    setRatio(detectedRatio);
    setSelectedCommercial(comm);
    setShowAiNote(true);
    setIsGenerating(false);
    onShowToast("Brief drafted. Review and edit below.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !brand.trim() || !req.trim()) {
      onShowToast("Please fill in all required fields");
      return;
    }

    const newBrief: Brief = {
      id: uid(),
      title: title.trim(),
      brand: brand.trim(),
      req: req.trim(),
      type,
      style,
      ratio,
      commercial: selectedCommercial,
      budget: budget.trim(),
      deadline: deadline.trim(),
      created: new Date().toISOString(),
    };

    onPublishBrief(newBrief);
    // Reset form
    setTitle("");
    setBrand("");
    setReq("");
    setSelectedCommercial([]);
    setBudget("");
    setDeadline("");
    setRoughIdea("");
    setShowAiNote(false);
    onShowToast("Brief published");
  };

  return (
    <section id="view-briefs" className="view active">
      <h2>Creative briefs</h2>
      <p className="sub">
        Write a brief yourself, or turn a rough idea into a structured one.
      </p>

      {/* AI Brief Builder Panel */}
      <div className="panel">
        <b>AI-assisted brief builder</b>
        <p className="muted">
          Type your rough idea. The builder fills in the form below. You can edit
          everything.
        </p>
        <textarea
          id="roughIdea"
          placeholder="Example: We are launching a new energy drink and want a futuristic vertical Instagram reel ad..."
          value={roughIdea}
          onChange={(e) => setRoughIdea(e.target.value)}
        />
        <div className="actions">
          <button
            className="btn green"
            onClick={handleBuildBrief}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate brief"}
          </button>
        </div>
        {showAiNote && (
          <p className="note" id="aiNote">
            Demo mode: this builder uses smart keyword heuristics. You can also connect
            a real AI API key in .env.local!
          </p>
        )}
      </div>

      {/* Brief Form */}
      <form className="panel" id="briefForm" onSubmit={handleSubmit}>
        <b>Brief details</b>
        <div className="row two">
          <div>
            <label htmlFor="bTitle">Brief title *</label>
            <input
              id="bTitle"
              required
              placeholder="Summer launch reel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bBrand">Brand / agency *</label>
            <input
              id="bBrand"
              required
              placeholder="Your brand name"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
        </div>

        <label htmlFor="bReq">Campaign requirements *</label>
        <textarea
          id="bReq"
          required
          placeholder="Goal, audience, key message, deliverables..."
          value={req}
          onChange={(e) => setReq(e.target.value)}
        />

        <div className="row three">
          <div>
            <label htmlFor="bType">Content type</label>
            <select
              id="bType"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bStyle">Style</label>
            <select
              id="bStyle"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bRatio">Format / aspect ratio</label>
            <select
              id="bRatio"
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
            >
              {ASPECT_RATIOS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label>Commercial-use requirements</label>
        <div className="checks" id="bCommercial">
          {COMMERCIAL_OPTIONS.map((c) => (
            <label key={c}>
              <input
                type="checkbox"
                value={c}
                checked={selectedCommercial.includes(c)}
                onChange={() => toggleCommercial(c)}
              />{" "}
              {c}
            </label>
          ))}
        </div>

        <div className="row two">
          <div>
            <label htmlFor="bBudget">Budget (INR)</label>
            <input
              id="bBudget"
              type="number"
              min="0"
              placeholder="25000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bDeadline">Deadline</label>
            <input
              id="bDeadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>

        <div className="actions">
          <button className="btn" type="submit">
            Publish brief
          </button>
        </div>
      </form>

      {/* Published Briefs List */}
      <h2 style={{ marginTop: "20px" }}>Published briefs</h2>
      <div id="briefList">
        {briefs.length > 0 ? (
          briefs.map((b) => (
            <div key={b.id} className="brief">
              <h3>{b.title}</h3>
              <div className="muted">{b.brand}</div>
              <p style={{ margin: "8px 0", whiteSpace: "pre-line" }}>{b.req}</p>
              <div>
                <span className="tag">{b.type}</span>
                <span className="tag">{b.style}</span>
                <span className="tag">{b.ratio}</span>
                {b.budget ? <span className="tag">INR {b.budget}</span> : null}
                {b.deadline ? <span className="tag">Due {b.deadline}</span> : null}
              </div>
              <div style={{ marginTop: "6px" }}>
                {(b.commercial || []).map((comm) => (
                  <span key={comm} className="tag tool">
                    {comm}
                  </span>
                ))}
              </div>
              <div className="actions">
                <button
                  className="btn small"
                  onClick={() => onFindMatchingCreators(b)}
                >
                  Find matching creators
                </button>
                <button
                  className="btn danger small"
                  onClick={() => {
                    if (
                      confirm(
                        "Delete this brief and its associated engagements?"
                      )
                    ) {
                      onDeleteBrief(b.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty">
            <b>No briefs yet</b>
            Fill in the form above and publish your first brief.
          </div>
        )}
      </div>
    </section>
  );
}
