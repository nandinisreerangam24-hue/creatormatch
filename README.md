# CreatorMatch — AI Content Creator Marketplace

CreatorMatch is an AI-native marketplace connecting specialized AI creators (AI filmmakers, animators, generative designers, music/sound artists) with brands and creative agencies. Built for the Kampus.VC hackathon challenge *"AI Content Creator Marketplace"*.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables (preserving prototype visual system)
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security + Email Auth)
- **AI Brief Builder**: Google Gemini / OpenAI with client-side keyword heuristics fallback
- **Hosting & Deployment**: Vercel

---

## 📁 Project Structure

```text
creatormatch/
├── .env.local.example          # Template for all environment variables
├── .gitignore                  # Git ignore rules
├── next.config.mjs             # Next.js configuration
├── package.json                # Project dependencies and npm scripts
├── postcss.config.js           # PostCSS configuration for Tailwind
├── tailwind.config.ts          # Tailwind setup mapping dark theme colors
├── tsconfig.json               # TypeScript path aliases and compiler options
├── README.md                   # This guide
└── src/
    ├── app/
    │   ├── api/
    │   │   └── ai-brief/
    │   │       └── route.ts    # AI brief generation endpoint (Gemini/OpenAI/Rules)
    │   ├── globals.css         # Dark theme styling, badges, cards, and modal styles
    │   ├── layout.tsx          # Root layout and metadata
    │   └── page.tsx            # Main application tab switcher & state manager
    ├── components/
    │   ├── Header.tsx          # App header with logo and auth badge
    │   ├── Navigation.tsx      # Tab switcher (Discover, Briefs, Engagements, Join)
    │   ├── DiscoverView.tsx    # Creator search, multi-skill & tool filtering
    │   ├── CreatorCard.tsx     # Creator card with verification status & portfolio button
    │   ├── CreatorModal.tsx    # Modal view for detailed creator workflow & invite flow
    │   ├── BriefsView.tsx      # Brief publishing & AI-assisted brief builder
    │   ├── EngagementsView.tsx # 6-stage lifecycle progress & revision tracker
    │   ├── JoinView.tsx        # Creator onboarding form
    │   └── Toast.tsx           # Floating toast notifications
    └── lib/
        ├── types.ts            # TypeScript interfaces for all entities
        ├── sample-data.ts      # 8 seed AI creators from index.html
        ├── utils.ts            # Color hues, initials, unique helpers
        └── supabase/
            └── client.ts       # Supabase browser client
```

---

## 🚀 Quick Start Guide for Beginners

### 1. Open Terminal & Navigate to Project
```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\creatormatch
```

### 2. Configure Environment Variables
Copy the example file to `.env.local`:
```powershell
copy .env.local.example .env.local
```
*(You can run the app immediately in local prototype mode; Supabase credentials can be filled in during Phase 2).*

### 3. Start the Local Development Server
```powershell
npm run dev
```

### 4. Open in Your Browser
Open [http://localhost:3000](http://localhost:3000) in Chrome, Edge, or Firefox.

---

## 🧭 Roadmap (8 Phases)

1. **Phase 1: Project Setup & Baseline Structure** ✅ (Current)
2. **Phase 2: Database Schema & Supabase Seed** (Tables, Relations, RLS policies, SQL seed script)
3. **Phase 3: Discover & Profiles** (Fetching live creators from Supabase, multi-filter search, verification signals)
4. **Phase 4: Authentication & Creator Profiles** (Supabase Email Auth, Creator vs Brand roles)
5. **Phase 5: Briefs & AI Brief Builder** (Brand briefs in Postgres, Gemini/OpenAI integration)
6. **Phase 6: Engagements Tracking** (Invite to brief, 6-stage lifecycle, revision workflow)
7. **Phase 7: Testing & Bug Fixes** (Mobile responsiveness check, edge cases, error states)
8. **Phase 8: Production Deployment to Vercel** (Live HTTPS URL, demo script & slide outline)
