// Database types matching DevForge schema

export type ModeId = 'dark' | 'light' | 'sun' | 'c-mode'
export type TemplateId = ModeId | 'professional' | 'monolith' | 'terminal' | 'creative'

export interface Profile {
  id: string
  username: string
  name: string
  tagline: string
  bio: string
  profile_photo: string
  resume_file: string
  template_id: TemplateId
  accent_color: string
  custom_domain: string
  is_premium: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface SocialLinks {
  id: string
  user_id: string
  github: string
  linkedin: string
  twitter: string
  instagram?: string
  website: string
  email: string
  dribbble: string
  youtube: string
}

export interface Experience {
  id: string
  user_id: string
  company: string
  position: string
  location: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  logo_url: string
  display_order: number
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  tagline: string
  description: string
  tech_stack: string[]
  github_url: string
  live_url: string
  case_study_url: string
  images: string[]
  thumbnail: string
  is_featured: boolean
  display_order: number
  github_stars: number
  created_at: string
}

export interface Skill {
  id: string
  user_id: string
  category: SkillCategory
  name: string
  proficiency: SkillProficiency
  display_order: number
  created_at: string
}

export interface Education {
  id: string
  user_id: string
  institution: string
  degree: string
  field: string
  start_date: string
  end_date: string | null
  description: string
  logo_url: string
  display_order: number
  created_at: string
}

export interface Testimonial {
  id: string
  author: string
  role: string
  company: string
  avatar: string
  content: string
}

export interface ModeConfig {
  accentColor: string
  density: 'compact' | 'balanced' | 'roomy'
  fontFamily: 'sans' | 'mono' | 'serif'
  showTestimonials: boolean
  showMetrics: boolean
}

export type SkillCategory = 'frontend' | 'backend' | 'devops' | 'tools' | 'languages' | 'other'
export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface PortfolioData {
  profile: Profile
  social_links: SocialLinks | null
  experience: Experience[]
  projects: Project[]
  skills: Skill[]
  education: Education[]
  testimonials?: Testimonial[]
}

// Real-Time Collaboration Types
export type CollabRole = 'host' | 'editor' | 'reviewer' | 'viewer'

export interface Collaborator {
  id: string
  name: string
  avatar: string
  color: string
  role: CollabRole
  status: 'active' | 'idle' | 'typing'
  activeSection?: string
  lastActive: number
}

export interface CollabComment {
  id: string
  sectionId: string
  authorId: string
  authorName: string
  authorColor: string
  text: string
  createdAt: string
  resolved: boolean
  suggestedChange?: {
    field: string
    value: any
    description?: string
  }
}

export interface CollabActivity {
  id: string
  timestamp: string
  actor: string
  actorColor: string
  action: string
  details?: string
}

// AI Configuration Types
export type AITone = 'silicon_valley' | 'swiss_minimal' | 'cyberpunk' | 'systems_architect' | 'indie_hacker'

export interface AIConfig {
  tone: AITone
  targetRole: string
  customInstructions: string
  temperature: number
  includeMetrics: boolean
  conciseMode: boolean
}

// Chat message type
export interface AIChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: string
  action?: {
    type: 'UPDATE_TAGLINE' | 'UPDATE_BIO' | 'ADD_PROJECT' | 'ADD_SKILL'
    data: any
    label: string
  }
}
