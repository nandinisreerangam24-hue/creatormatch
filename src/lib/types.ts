export type ContentType = "Video" | "Animation" | "Graphic" | "Audio";

export type EngagementStageName = 
  | "Invited" 
  | "Accepted" 
  | "In production" 
  | "Review" 
  | "Delivered" 
  | "Completed";

export const STAGES: EngagementStageName[] = [
  "Invited", 
  "Accepted", 
  "In production", 
  "Review", 
  "Delivered", 
  "Completed"
];

export const CONTENT_TYPES: ContentType[] = [
  "Video", 
  "Animation", 
  "Graphic", 
  "Audio"
];

export const COMMERCIAL_OPTIONS: string[] = [
  "Full commercial license",
  "Brand owns all final rights",
  "Creator may show in portfolio",
  "Must disclose AI use",
  "Exclusivity for 6 months",
  "Paid-media / ads usage"
];

export const STYLES: string[] = [
  "Modern & clean",
  "Cinematic",
  "Minimal",
  "Playful",
  "Futuristic",
  "Realistic",
  "Anime",
  "Retro"
];

export const ASPECT_RATIOS: string[] = [
  "16:9",
  "9:16",
  "1:1",
  "4:5",
  "21:9"
];

export interface VerificationSignals {
  tools: boolean;
  workflows: boolean;
  pastWork: boolean;
}

export interface PortfolioItem {
  id?: string;
  title: string;
  kind: ContentType | string;
  tool: string;
  hue?: number;
  url?: string;
  file_url?: string;
}

export interface Creator {
  id: string;
  user_id?: string;
  name: string;
  headline: string;
  location?: string;
  specialization: string;
  skills: string[];
  tools: string[];
  types: ContentType[] | string[];
  workflow: string;
  verified: VerificationSignals;
  portfolio: PortfolioItem[];
  created_at?: string;
}

export interface Brief {
  id: string;
  user_id?: string;
  title: string;
  brand: string;
  req: string;
  type: ContentType | string;
  style: string;
  ratio: string;
  commercial: string[];
  budget?: string | number;
  deadline?: string;
  created: string;
}

export interface Engagement {
  id: string;
  creatorId: string;
  briefId: string;
  stage: number;
  revisions: number;
  created_at?: string;
  // Joined fields for display
  creator?: Creator;
  brief?: Brief;
}

export interface FilterState {
  q: string;
  spec: string;
  tool: string;
  type: string;
  skills: string[];
  verified: boolean;
}

export type UserRole = "creator" | "brand";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  created_at?: string;
}
