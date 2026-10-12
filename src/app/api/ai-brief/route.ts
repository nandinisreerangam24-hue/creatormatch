import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid idea prompt." },
        { status: 400 }
      );
    }

    const trimmedPrompt = prompt.trim();
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // 1. Try Gemini API if key is present
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `You are an expert creative director. Turn this rough brief idea into a structured creative brief JSON for AI creators:
Idea: "${trimmedPrompt}"

Return strictly valid JSON with no markdown wrapping and no backticks:
{
  "title": "Short punchy brief title",
  "req": "Detailed campaign requirements including goal, audience, key message, deliverables, and revision rounds",
  "type": "Video" | "Animation" | "Graphic" | "Audio",
  "style": "Modern & clean" | "Cinematic" | "Minimal" | "Playful" | "Futuristic" | "Realistic" | "Anime" | "Retro",
  "ratio": "16:9" | "9:16" | "1:1" | "4:5" | "21:9",
  "commercial": ["Full commercial license", "Creator may show in portfolio", "Must disclose AI use"],
  "budget": 25000,
  "deadline": "2026-11-30"
}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText =
            data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
          const cleanedText = rawText.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleanedText);
          return NextResponse.json({ brief: parsed, isFallback: false });
        }
      } catch (err) {
        console.warn("Gemini generation failed, falling back to heuristics:", err);
      }
    }

    // 2. Try OpenAI API if key is present
    if (openaiKey) {
      try {
        const openaiRes = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openaiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a creative director. Return only raw JSON matching the required schema.",
                },
                {
                  role: "user",
                  content: `Generate a structured creative brief JSON from: "${trimmedPrompt}".
Schema:
{
  "title": string,
  "req": string,
  "type": "Video" | "Animation" | "Graphic" | "Audio",
  "style": "Modern & clean" | "Cinematic" | "Minimal" | "Playful" | "Futuristic" | "Realistic" | "Anime" | "Retro",
  "ratio": "16:9" | "9:16" | "1:1" | "4:5" | "21:9",
  "commercial": string[],
  "budget": number,
  "deadline": string (YYYY-MM-DD)
}`,
                },
              ],
              response_format: { type: "json_object" },
            }),
          }
        );

        if (openaiRes.ok) {
          const data = await openaiRes.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return NextResponse.json({ brief: parsed, isFallback: false });
        }
      } catch (err) {
        console.warn("OpenAI generation failed, falling back to heuristics:", err);
      }
    }

    // 3. Fallback Heuristics from index.html
    const hasWord = (text: string, words: string[]) =>
      new RegExp(`\\b(${words.join("|")})`, "i").test(text);

    let type = "Video";
    if (hasWord(trimmedPrompt, ["animation", "animated", "motion", "cartoon"])) {
      type = "Animation";
    } else if (
      hasWord(trimmedPrompt, [
        "poster",
        "graphic",
        "banner",
        "logo",
        "image",
        "packaging",
        "lookbook",
      ])
    ) {
      type = "Graphic";
    } else if (
      hasWord(trimmedPrompt, ["music", "audio", "jingle", "podcast", "voiceover"])
    ) {
      type = "Audio";
    }

    let style = "Modern & clean";
    const styles: Record<string, string[]> = {
      Cinematic: ["cinematic", "film"],
      Minimal: ["minimal", "simple"],
      Playful: ["playful", "fun", "kids"],
      Futuristic: ["futuristic", "sci-fi", "neon", "cyber"],
      Realistic: ["realistic", "photoreal"],
      Anime: ["anime"],
      Retro: ["retro", "vintage"],
    };
    for (const [st, terms] of Object.entries(styles)) {
      if (hasWord(trimmedPrompt, terms)) {
        style = st;
        break;
      }
    }

    let ratio = "16:9";
    if (
      hasWord(trimmedPrompt, [
        "reel",
        "story",
        "stories",
        "tiktok",
        "shorts",
        "vertical",
        "instagram",
      ])
    ) {
      ratio = "9:16";
    } else if (hasWord(trimmedPrompt, ["square", "feed post"])) {
      ratio = "1:1";
    }

    const commercial = ["Must disclose AI use", "Creator may show in portfolio"];
    if (
      hasWord(trimmedPrompt, [
        "ad",
        "ads",
        "advert",
        "campaign",
        "launch",
        "sell",
        "promo",
      ])
    ) {
      commercial.push("Full commercial license", "Paid-media / ads usage");
    }

    const words = trimmedPrompt.replace(/[.!?]/g, "").split(/\s+/);
    const title = words.slice(0, 6).join(" ");
    const reqText = `Goal: ${trimmedPrompt}\nDeliverables: 1 final ${type.toLowerCase()} in ${ratio}, plus 2 revision rounds.\nAudience: to be confirmed with the brand.\nShare tools used and the generation workflow with the final files.`;

    return NextResponse.json({
      brief: {
        title,
        req: reqText,
        type,
        style,
        ratio,
        commercial,
        budget: 25000,
        deadline: new Date(Date.now() + 14 * 86400000)
          .toISOString()
          .split("T")[0],
      },
      isFallback: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
