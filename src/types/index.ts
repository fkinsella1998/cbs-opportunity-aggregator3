export interface Student {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  onboarding_done: boolean;
  created_at: string;
}

export interface SessionData {
  student_id: string;
  email: string;
  first_name: string;
  last_name: string;
  onboarding_done: boolean;
}

export type EmploymentTypePref = "full_time" | "internship" | "both";
export type SponsorshipPref = "required" | "not_required" | "open";

export interface Profile {
  id: string;
  student_id: string;
  resume_url?: string;
  resume_text?: string;
  resume_parsed?: ParsedResume;
  graduation_year?: 2026 | 2027;
  industry_interests: string[];
  function_interests: string[];
  employment_type_pref?: EmploymentTypePref;
  sponsorship_pref: SponsorshipPref;
  created_at: string;
  updated_at: string;
}

export interface ParsedResume {
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  summary?: string;
}

export interface WorkExperience {
  company: string;
  title: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface Education {
  school: string;
  degree?: string;
  field?: string;
  grad_year?: number;
}

export type CompanyStage =
  | "Pre-Seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Growth"
  | "Other";

export type EmploymentType = "Full-time" | "Internship" | "Part-time" | "Project";

export type OpportunityStatus = "Pending" | "Live" | "Closed";

export type AlumniPresence = "Yes" | "No" | "Unknown";

export type OpportunitySource = "BuildInNYC" | "TrueUp" | "CMC" | string;

export interface Opportunity {
  id: string;
  company_name: string;
  role_title: string;
  industry?: string;
  function?: string;
  company_stage?: CompanyStage;
  employment_type?: EmploymentType;
  location?: string;
  description?: string;
  application_link?: string;
  application_deadline?: string;
  has_cbs_alumni: AlumniPresence;
  source: OpportunitySource;
  source_url?: string;
  status: OpportunityStatus;
  went_live_at: string;
  view_count: number;
  click_count: number;
  bookmark_count: number;
  application_count: number;
}

export interface OpportunityWithMeta extends Opportunity {
  is_bookmarked?: boolean;
  has_applied?: boolean;
  alumni?: Alumni[];
}

export interface Alumni {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  title?: string;
  email?: string;
  linkedin_url?: string;
  graduation_year?: number;
}

export interface Professor {
  professor_id: string;
  first_name: string;
  last_name: string;
  department: string;
  bio: string;
  columbia_profile_url: string;
  industry_tags: string[];
  is_open_to_outreach: boolean;
}

export interface FeedFilters {
  industry?: string[];
  function?: string[];
  stage?: CompanyStage[];
  employment_type?: EmploymentType[];
  cbs_alumni_only?: boolean;
  new_this_week?: boolean;
}

export interface Contributor {
  id: string;
  name: string;
  email: string;
  organization: string;
  source_tag: string;
  requires_approval: boolean;
  is_active: boolean;
}

export interface PostOpportunityPayload {
  company_name: string;
  role_title: string;
  function?: string;
  company_stage?: CompanyStage;
  employment_type?: EmploymentType;
  location?: string;
  description?: string;
  application_link?: string;
  application_deadline?: string;
  has_cbs_alumni?: AlumniPresence;
}
