-- ==============================================================================
-- CreatorMatch: Full Supabase Database Schema & Seed Data
-- ==============================================================================
-- Run this in your Supabase Dashboard:
-- 1. Go to https://supabase.com -> Open your project
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New query", paste everything below, and click "Run" (or Ctrl + Enter)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Drop existing tables if re-running (safe order)
drop table if exists public.engagements cascade;
drop table if exists public.portfolio_items cascade;
drop table if exists public.briefs cascade;
drop table if exists public.creators cascade;
drop table if exists public.profiles cascade;

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked with Supabase Auth users)
-- ------------------------------------------------------------------------------
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text check (role in ('creator', 'brand')) default 'creator',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically insert a profile row when a new user signs up in Supabase
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'creator')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. CREATORS TABLE
-- ------------------------------------------------------------------------------
create table public.creators (
  id text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  headline text not null,
  location text,
  specialization text not null,
  skills text[] not null default '{}',
  tools text[] not null default '{}',
  types text[] not null default '{}',
  workflow text,
  verified_tools boolean not null default false,
  verified_workflows boolean not null default false,
  verified_past_work boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 3. PORTFOLIO ITEMS TABLE
-- ------------------------------------------------------------------------------
create table public.portfolio_items (
  id uuid default gen_random_uuid() primary key,
  creator_id text references public.creators(id) on delete cascade not null,
  title text not null,
  kind text not null,
  tool text not null,
  hue integer default 200,
  url text,
  file_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 4. BRIEFS TABLE
-- ------------------------------------------------------------------------------
create table public.briefs (
  id text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  title text not null,
  brand text not null,
  req text not null,
  type text not null,
  style text not null,
  ratio text not null,
  commercial text[] not null default '{}',
  budget text,
  deadline text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 5. ENGAGEMENTS TABLE
-- ------------------------------------------------------------------------------
create table public.engagements (
  id text primary key,
  creator_id text references public.creators(id) on delete cascade not null,
  brief_id text references public.briefs(id) on delete cascade not null,
  stage integer not null default 0 check (stage between 0 and 5),
  revisions integer not null default 0 check (revisions >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.creators enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.briefs enable row level security;
alter table public.engagements enable row level security;

-- Profiles: Anyone can view profiles; users can update their own
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Creators: Anyone can view; authenticated users & demo users can insert/update
create policy "Creators are viewable by everyone" on public.creators
  for select using (true);
create policy "Anyone can insert creators" on public.creators
  for insert with check (true);
create policy "Anyone can update creators" on public.creators
  for update using (true);

-- Portfolio Items: Anyone can view; anyone can insert
create policy "Portfolio items are viewable by everyone" on public.portfolio_items
  for select using (true);
create policy "Anyone can insert portfolio items" on public.portfolio_items
  for insert with check (true);

-- Briefs: Anyone can view; anyone can insert and delete
create policy "Briefs are viewable by everyone" on public.briefs
  for select using (true);
create policy "Anyone can insert briefs" on public.briefs
  for insert with check (true);
create policy "Anyone can delete briefs" on public.briefs
  for delete using (true);

-- Engagements: Anyone can view; anyone can insert, update, or delete
create policy "Engagements are viewable by everyone" on public.engagements
  for select using (true);
create policy "Anyone can insert engagements" on public.engagements
  for insert with check (true);
create policy "Anyone can update engagements" on public.engagements
  for update using (true);
create policy "Anyone can delete engagements" on public.engagements
  for delete using (true);

-- ------------------------------------------------------------------------------
-- 7. SEED DATA (The 8 AI creators & their portfolio pieces from index.html)
-- ------------------------------------------------------------------------------

-- c1: Aanya Rao
insert into public.creators (id, name, headline, location, specialization, skills, tools, types, workflow, verified_tools, verified_workflows, verified_past_work)
values (
  'c1', 'Aanya Rao', 'AI filmmaker', 'Hyderabad', 'Cinematic ads',
  array['Storyboarding', 'Prompt engineering', 'Video editing', 'Color grading'],
  array['Runway', 'Sora', 'Midjourney'],
  array['Video'],
  'Script, then storyboard in Midjourney, animate shots in Runway, final edit and grade in DaVinci. Two revision rounds included.',
  true, true, true
);
insert into public.portfolio_items (creator_id, title, kind, tool, hue) values
  ('c1', 'Neon City Teaser', 'Video', 'Runway', 262),
  ('c1', 'Sneaker Drop Ad', 'Video', 'Sora', 310),
  ('c1', 'Monsoon Short', 'Video', 'Runway', 200);

-- c2: Kabir Sheikh
insert into public.creators (id, name, headline, location, specialization, skills, tools, types, workflow, verified_tools, verified_workflows, verified_past_work)
values (
  'c2', 'Kabir Sheikh', 'AI animator', 'Mumbai', '3D motion graphics',
  array['Motion design', 'Character design', 'Prompt engineering'],
  array['Pika', 'Kling', 'Stable Diffusion'],
  array['Animation', 'Video'],
  'Concept art with Stable Diffusion, character consistency with LoRA, animation in Kling, cleanup in After Effects.',
  true, false, true
);
insert into public.portfolio_items (creator_id, title, kind, tool, hue) values
  ('c2', 'Robo Chef Loop', 'Animation', 'Pika', 24),
  ('c2', 'Logo Sting Pack', 'Animation', 'Kling', 160);

-- c3: Meera Nair
insert into public.creators (id, name, headline, location, specialization, skills, tools, types, workflow, verified_tools, verified_workflows, verified_past_work)
values (
  'c3', 'Meera Nair', 'Generative graphic designer', 'Kochi', 'Brand posters and packaging',
  array['Brand design', 'Typography', 'Prompt engineering'],
  array['Midjourney', 'Adobe Firefly', 'Stable Diffusion'],
  array['Graphic'],
  'Moodboard, 20 to 30 generations, pick 3 directions, refine in Photoshop, deliver print-ready files.',
  true, true, false
);
insert into public.portfolio_items (creator_id, title, kind, tool, hue) values
  ('c3', 'Spice Brand Posters', 'Graphic', 'Midjourney', 12),
  ('c3', 'Tea Packaging Set', 'Graphic', 'Firefly', 140),
  ('c3', 'Festival Banner', 'Graphic', 'Midjourney', 45);

-- c4: Rohan Verma
insert into public.creators (id, name, headline, location, specialization, skills, tools, types, workflow, verified_tools, verified_workflows, verified_past_work)
values (
  'c4', 'Rohan Verma', 'AI music and sound designer', 'Delhi', 'Jingles and sound design',
  array['Sound design', 'Audio mixing', 'Scriptwriting'],
  array['Suno', 'ElevenLabs'],
  array['Audio'],
  'Brief, lyric draft, generate 10 tracks with Suno, stem separation and final mix.',
  false, true, true
);
insert into public.portfolio_items (creator_id, title, kind, tool, hue) values
  ('c4', 'Chai Jingle', 'Audio', 'Suno', 280),
  ('c4', 'Podcast Intro Pack', 'Audio', 'ElevenLabs', 340);

-- c5: Sana Iqbal
insert into public.creators (id, name, headline, location, specialization, skills, tools, types, workflow, verified_tools, verified_workflows, verified_past_work)
values (
  'c5', 'Sana Iqbal', 'AI fashion visual artist', 'Bengaluru', 'Fashion lookbooks',
  array['Fashion styling', 'Image editing', 'Prompt engineering'],
  array['Midjourney', 'Flux', 'Photoshop'],
  array['Graphic', 'Video'],
  'Reference boards, model and fabric prompts, upscale, retouch, short motion loops for social.',
  true, false, false
);
insert into public.portfolio_items (creator_id, title, kind, tool, hue) values
  ('c5', 'Monsoon Lookbook', 'Graphic', 'Flux', 330),
  ('c5', 'Ethnic Edit Reel', 'Video', 'Midjourney', 15);

-- c6: Vikram Reddy
insert into public.creators (id, name, headline, location, specialization, skills, tools, types, workflow, verified_tools, verified_workflows, verified_past_work)
values (
  'c6', 'Vikram Reddy', 'Generative storyteller', 'Chennai', 'Explainer videos',
  array['Scriptwriting', 'Storyboarding', 'Video editing'],
  array['Runway', 'ElevenLabs', 'HeyGen'],
  array['Video', 'Audio'],
  'Script, AI voiceover, scene generation, captions, edit. Typical turnaround 5 days.',
  true, true, true
);
insert into public.portfolio_items (creator_id, title, kind, tool, hue) values
  ('c6', 'Fintech Explainer', 'Video', 'HeyGen', 220),
  ('c6', 'Health Awareness Short', 'Video', 'Runway', 120);

-- c7: Ishita Das
insert into public.creators (id, name, headline, location, specialization, skills, tools, types, workflow, verified_tools, verified_workflows, verified_past_work)
values (
  'c7', 'Ishita Das', 'AI animator for kids content', 'Kolkata', 'Kids and education animation',
  array['Character design', 'Motion design', 'Scriptwriting'],
  array['Pika', 'Leonardo', 'ElevenLabs'],
  array['Animation'],
  'Character sheet, consistent poses, short scenes in Pika, voice and music added at the end.',
  false, false, true
);
insert into public.portfolio_items (creator_id, title, kind, tool, hue) values
  ('c7', 'ABC Animals', 'Animation', 'Pika', 90),
  ('c7', 'Counting Fun', 'Animation', 'Leonardo', 55);

-- c8: Arjun Mehta
insert into public.creators (id, name, headline, location, specialization, skills, tools, types, workflow, verified_tools, verified_workflows, verified_past_work)
values (
  'c8', 'Arjun Mehta', 'AI product visualizer', 'Pune', 'Product 3D and mockups',
  array['3D modelling', 'Color grading', 'Image editing'],
  array['Flux', 'Stable Diffusion', 'Kling'],
  array['Graphic', 'Video'],
  'Product photos in, generate studio scenes, composite, short rotating video for ads.',
  true, false, false
);
insert into public.portfolio_items (creator_id, title, kind, tool, hue) values
  ('c8', 'Watch Studio Shots', 'Graphic', 'Flux', 190),
  ('c8', 'Bottle Spin Ad', 'Video', 'Kling', 250);
