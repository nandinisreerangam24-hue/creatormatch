import { Creator } from "./types";

export const SEED_CREATORS: Creator[] = [
  {
    id: "c1",
    name: "Aanya Rao",
    headline: "AI filmmaker",
    location: "Hyderabad",
    specialization: "Cinematic ads",
    skills: ["Storyboarding", "Prompt engineering", "Video editing", "Color grading"],
    tools: ["Runway", "Sora", "Midjourney"],
    types: ["Video"],
    workflow: "Script, then storyboard in Midjourney, animate shots in Runway, final edit and grade in DaVinci. Two revision rounds included.",
    verified: { tools: true, workflows: true, pastWork: true },
    portfolio: [
      { title: "Neon City Teaser", kind: "Video", tool: "Runway", hue: 262 },
      { title: "Sneaker Drop Ad", kind: "Video", tool: "Sora", hue: 310 },
      { title: "Monsoon Short", kind: "Video", tool: "Runway", hue: 200 }
    ]
  },
  {
    id: "c2",
    name: "Kabir Sheikh",
    headline: "AI animator",
    location: "Mumbai",
    specialization: "3D motion graphics",
    skills: ["Motion design", "Character design", "Prompt engineering"],
    tools: ["Pika", "Kling", "Stable Diffusion"],
    types: ["Animation", "Video"],
    workflow: "Concept art with Stable Diffusion, character consistency with LoRA, animation in Kling, cleanup in After Effects.",
    verified: { tools: true, workflows: false, pastWork: true },
    portfolio: [
      { title: "Robo Chef Loop", kind: "Animation", tool: "Pika", hue: 24 },
      { title: "Logo Sting Pack", kind: "Animation", tool: "Kling", hue: 160 }
    ]
  },
  {
    id: "c3",
    name: "Meera Nair",
    headline: "Generative graphic designer",
    location: "Kochi",
    specialization: "Brand posters and packaging",
    skills: ["Brand design", "Typography", "Prompt engineering"],
    tools: ["Midjourney", "Adobe Firefly", "Stable Diffusion"],
    types: ["Graphic"],
    workflow: "Moodboard, 20 to 30 generations, pick 3 directions, refine in Photoshop, deliver print-ready files.",
    verified: { tools: true, workflows: true, pastWork: false },
    portfolio: [
      { title: "Spice Brand Posters", kind: "Graphic", tool: "Midjourney", hue: 12 },
      { title: "Tea Packaging Set", kind: "Graphic", tool: "Firefly", hue: 140 },
      { title: "Festival Banner", kind: "Graphic", tool: "Midjourney", hue: 45 }
    ]
  },
  {
    id: "c4",
    name: "Rohan Verma",
    headline: "AI music and sound designer",
    location: "Delhi",
    specialization: "Jingles and sound design",
    skills: ["Sound design", "Audio mixing", "Scriptwriting"],
    tools: ["Suno", "ElevenLabs"],
    types: ["Audio"],
    workflow: "Brief, lyric draft, generate 10 tracks with Suno, stem separation and final mix.",
    verified: { tools: false, workflows: true, pastWork: true },
    portfolio: [
      { title: "Chai Jingle", kind: "Audio", tool: "Suno", hue: 280 },
      { title: "Podcast Intro Pack", kind: "Audio", tool: "ElevenLabs", hue: 340 }
    ]
  },
  {
    id: "c5",
    name: "Sana Iqbal",
    headline: "AI fashion visual artist",
    location: "Bengaluru",
    specialization: "Fashion lookbooks",
    skills: ["Fashion styling", "Image editing", "Prompt engineering"],
    tools: ["Midjourney", "Flux", "Photoshop"],
    types: ["Graphic", "Video"],
    workflow: "Reference boards, model and fabric prompts, upscale, retouch, short motion loops for social.",
    verified: { tools: true, workflows: false, pastWork: false },
    portfolio: [
      { title: "Monsoon Lookbook", kind: "Graphic", tool: "Flux", hue: 330 },
      { title: "Ethnic Edit Reel", kind: "Video", tool: "Midjourney", hue: 15 }
    ]
  },
  {
    id: "c6",
    name: "Vikram Reddy",
    headline: "Generative storyteller",
    location: "Chennai",
    specialization: "Explainer videos",
    skills: ["Scriptwriting", "Storyboarding", "Video editing"],
    tools: ["Runway", "ElevenLabs", "HeyGen"],
    types: ["Video", "Audio"],
    workflow: "Script, AI voiceover, scene generation, captions, edit. Typical turnaround 5 days.",
    verified: { tools: true, workflows: true, pastWork: true },
    portfolio: [
      { title: "Fintech Explainer", kind: "Video", tool: "HeyGen", hue: 220 },
      { title: "Health Awareness Short", kind: "Video", tool: "Runway", hue: 120 }
    ]
  },
  {
    id: "c7",
    name: "Ishita Das",
    headline: "AI animator for kids content",
    location: "Kolkata",
    specialization: "Kids and education animation",
    skills: ["Character design", "Motion design", "Scriptwriting"],
    tools: ["Pika", "Leonardo", "ElevenLabs"],
    types: ["Animation"],
    workflow: "Character sheet, consistent poses, short scenes in Pika, voice and music added at the end.",
    verified: { tools: false, workflows: false, pastWork: true },
    portfolio: [
      { title: "ABC Animals", kind: "Animation", tool: "Pika", hue: 90 },
      { title: "Counting Fun", kind: "Animation", tool: "Leonardo", hue: 55 }
    ]
  },
  {
    id: "c8",
    name: "Arjun Mehta",
    headline: "AI product visualizer",
    location: "Pune",
    specialization: "Product 3D and mockups",
    skills: ["3D modelling", "Color grading", "Image editing"],
    tools: ["Flux", "Stable Diffusion", "Kling"],
    types: ["Graphic", "Video"],
    workflow: "Product photos in, generate studio scenes, composite, short rotating video for ads.",
    verified: { tools: true, workflows: false, pastWork: false },
    portfolio: [
      { title: "Watch Studio Shots", kind: "Graphic", tool: "Flux", hue: 190 },
      { title: "Bottle Spin Ad", kind: "Video", tool: "Kling", hue: 250 }
    ]
  }
];
