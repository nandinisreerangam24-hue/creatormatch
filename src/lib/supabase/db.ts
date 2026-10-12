import { createClient } from "./client";
import { Brief, Creator, Engagement, PortfolioItem } from "../types";
import { SEED_CREATORS } from "../sample-data";

export async function getSupabaseCreators(): Promise<Creator[] | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data: creatorsData, error: creatorsError } = await supabase
      .from("creators")
      .select("*")
      .order("created_at", { ascending: false });

    if (creatorsError || !creatorsData || creatorsData.length === 0) {
      return null;
    }

    const { data: portfolioData } = await supabase
      .from("portfolio_items")
      .select("*");

    return creatorsData.map((c: any) => {
      const items: PortfolioItem[] = (portfolioData || [])
        .filter((p: any) => p.creator_id === c.id)
        .map((p: any) => ({
          id: p.id,
          title: p.title,
          kind: p.kind,
          tool: p.tool,
          hue: p.hue,
          url: p.url,
          file_url: p.file_url,
        }));

      return {
        id: c.id,
        user_id: c.user_id,
        name: c.name,
        headline: c.headline,
        location: c.location || "",
        specialization: c.specialization,
        skills: c.skills || [],
        tools: c.tools || [],
        types: c.types || [],
        workflow: c.workflow || "",
        verified: {
          tools: !!c.verified_tools,
          workflows: !!c.verified_workflows,
          pastWork: !!c.verified_past_work,
        },
        portfolio: items,
        created_at: c.created_at,
      };
    });
  } catch (err) {
    console.warn("Supabase fetch failed, falling back to local data:", err);
    return null;
  }
}

export async function insertSupabaseCreator(creator: Creator): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  try {
    const { error: cErr } = await supabase.from("creators").insert({
      id: creator.id,
      user_id: creator.user_id || null,
      name: creator.name,
      headline: creator.headline,
      location: creator.location || null,
      specialization: creator.specialization,
      skills: creator.skills || [],
      tools: creator.tools || [],
      types: creator.types || [],
      workflow: creator.workflow || null,
      verified_tools: !!creator.verified.tools,
      verified_workflows: !!creator.verified.workflows,
      verified_past_work: !!creator.verified.pastWork,
    });

    if (cErr) {
      console.warn("Error inserting creator in Supabase:", cErr);
      return false;
    }

    if (creator.portfolio && creator.portfolio.length > 0) {
      const pItems = creator.portfolio.map((p) => ({
        creator_id: creator.id,
        title: p.title,
        kind: p.kind,
        tool: p.tool,
        hue: p.hue || 200,
      }));
      await supabase.from("portfolio_items").insert(pItems);
    }

    return true;
  } catch (err) {
    console.warn("Failed saving creator to Supabase:", err);
    return false;
  }
}

export async function getSupabaseBriefs(): Promise<Brief[] | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("briefs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return null;

    return data.map((b: any) => ({
      id: b.id,
      user_id: b.user_id,
      title: b.title,
      brand: b.brand,
      req: b.req,
      type: b.type,
      style: b.style,
      ratio: b.ratio,
      commercial: b.commercial || [],
      budget: b.budget,
      deadline: b.deadline,
      created: b.created_at,
    }));
  } catch {
    return null;
  }
}

export async function insertSupabaseBrief(brief: Brief): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("briefs").insert({
      id: brief.id,
      user_id: brief.user_id || null,
      title: brief.title,
      brand: brief.brand,
      req: brief.req,
      type: brief.type,
      style: brief.style,
      ratio: brief.ratio,
      commercial: brief.commercial || [],
      budget: brief.budget ? String(brief.budget) : null,
      deadline: brief.deadline || null,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSupabaseBrief(briefId: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("briefs").delete().eq("id", briefId);
    return !error;
  } catch {
    return false;
  }
}

export async function getSupabaseEngagements(): Promise<Engagement[] | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("engagements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return null;

    return data.map((g: any) => ({
      id: g.id,
      creatorId: g.creator_id,
      briefId: g.brief_id,
      stage: g.stage,
      revisions: g.revisions,
      created_at: g.created_at,
    }));
  } catch {
    return null;
  }
}

export async function insertSupabaseEngagement(eng: Engagement): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("engagements").insert({
      id: eng.id,
      creator_id: eng.creatorId,
      brief_id: eng.briefId,
      stage: eng.stage,
      revisions: eng.revisions,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function updateSupabaseEngagement(
  id: string,
  stage: number,
  revisions: number
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from("engagements")
      .update({ stage, revisions })
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSupabaseEngagement(id: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("engagements").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}
