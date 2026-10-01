export type UserRole = "client" | "freelancer" | "admin";
export type ExperienceLevel = "entry" | "intermediate" | "expert";
export type AvailabilityStatus = "available" | "limited" | "booked";
export type ContractBudgetType = "fixed" | "hourly";
export type MilestoneStatus = "funded" | "in_review" | "revision" | "released" | "pending";
export type SortOption = "relevance" | "rate_asc" | "rate_desc" | "rating" | "newest";

export interface SkillBadge {
  name: string;
  verified: boolean;
}

export interface PortfolioItem {
  title: string;
  url: string;
  kind: "github" | "live" | "case-study";
}

export interface Review {
  id: string;
  client: string;
  rating: number;
  text: string;
  date: string;
}

export interface Freelancer {
  id: string;
  name: string;
  role: string;
  headline: string;
  location: string;
  languages: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  experience: ExperienceLevel;
  availability: AvailabilityStatus;
  skills: SkillBadge[];
  tags: string[];
  videoUrl: string;
  poster: string;
  bio: string;
  completionRate: number;
  earnings: number;
  responseTime: string;
  joinedAt: string;
  portfolio: PortfolioItem[];
  reviews: Review[];
}

export interface Project {
  id: string;
  title: string;
  client: string;
  budgetType: ContractBudgetType;
  budgetLabel: string;
  description: string;
  skills: string[];
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: MilestoneStatus;
}

export interface Conversation {
  id: string;
  peerName: string;
  peerRole: UserRole;
  lastMessage: string;
  unread: number;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  fromMe: boolean;
  text: string;
  at: string;
  attachment?: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  role: UserRole;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
}

export interface WaitlistStats {
  total: number;
  joinedCount: number;
  byRole: Record<string, number>;
  wave: number;
  capacity: number;
  remaining: number;
}

export type AppView = "waitlist" | "home" | "discover" | "profile" | "projects";
