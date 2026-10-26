import { create } from 'zustand'
import { createClient } from '@/lib/supabase'
import type {
  Profile,
  SocialLinks,
  Experience,
  Project,
  Skill,
  Education,
  Collaborator,
  CollabComment,
  CollabActivity,
  AIConfig,
  ModeId,
} from '@/types'

const LOCAL_STORAGE_KEY = 'devforge_portfolio_v2'
const COLLAB_CHANNEL_NAME = 'devforge_realtime_collab_channel'

// Rich initial data so DevForge looks stunning and complete immediately
const defaultProfile: Profile = {
  id: 'lead-dev-profile-01',
  username: 'alexrivera',
  name: 'Alex Rivera',
  tagline: 'Senior Distributed Systems & Full-Stack Architect',
  bio: 'Specializing in resilient cloud architectures, real-time developer tooling, and distributed consensus. 7+ years engineering mission-critical platforms handling millions of queries per second.',
  profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  resume_file: '',
  template_id: 'monolith',
  accent_color: '#00d2ff',
  custom_domain: 'alexrivera.dev',
  is_premium: true,
  views: 1840,
  created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
}

const defaultSocialLinks: SocialLinks = {
  id: 'lead-social-01',
  user_id: 'lead-dev-profile-01',
  github: 'https://github.com/alexrivera',
  linkedin: 'https://linkedin.com/in/alexrivera-architect',
  twitter: 'https://x.com/alexrivera_dev',
  website: 'https://alexrivera.dev',
  email: 'alex.rivera@devforge.studio',
  dribbble: '',
  youtube: '',
}

const defaultExperience: Experience[] = [
  {
    id: 'exp-1',
    user_id: 'lead-dev-profile-01',
    company: 'Chronos Labs',
    position: 'Staff Infrastructure Architect',
    location: 'San Francisco, CA (Hybrid)',
    start_date: '2022-03-01',
    end_date: null,
    is_current: true,
    description: 'Lead engineer for high-throughput distributed state machine. Reduced p99 query latency from 42ms to 6ms across 8 global cloud regions while managing $1.2M cloud infrastructure.',
    logo_url: '',
    display_order: 0,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'exp-2',
    user_id: 'lead-dev-profile-01',
    company: 'Veloce Systems',
    position: 'Senior Backend Engineer',
    location: 'Remote',
    start_date: '2020-01-15',
    end_date: '2022-02-28',
    is_current: false,
    description: 'Architected event-driven microservices ingestion pipeline processing 450,000 events/sec with Apache Kafka and Go. Authored core zero-allocation serializer library.',
    logo_url: '',
    display_order: 1,
    created_at: new Date(Date.now() - 120 * 86400000).toISOString(),
  },
  {
    id: 'exp-3',
    user_id: 'lead-dev-profile-01',
    company: 'Nexus Platforms',
    position: 'Software Engineer',
    location: 'Austin, TX',
    start_date: '2018-06-01',
    end_date: '2019-12-31',
    is_current: false,
    description: 'Designed interactive developer dashboards and high-speed telemetry streaming components using React, TypeScript, and WebSockets.',
    logo_url: '',
    display_order: 2,
    created_at: new Date(Date.now() - 180 * 86400000).toISOString(),
  },
]

const defaultProjects: Project[] = [
  {
    id: 'proj-1',
    user_id: 'lead-dev-profile-01',
    title: 'ChronosDB',
    tagline: 'Distributed Raft-Consensus Key-Value Engine with LSM-Tree Storage',
    description: 'An open-source, ultra-low latency distributed key-value store built in Go. Features strict linearizability with Raft, memtable write-ahead logging, and sub-millisecond p99 read performance.',
    tech_stack: ['Go', 'Raft', 'gRPC', 'LSM-Tree', 'Docker'],
    github_url: 'https://github.com/alexrivera/chronos-db',
    live_url: 'https://chronos-db.docs.devforge.studio',
    case_study_url: '',
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    is_featured: true,
    display_order: 0,
    github_stars: 1240,
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
  {
    id: 'proj-2',
    user_id: 'lead-dev-profile-01',
    title: 'DevCanvas Studio',
    tagline: 'Real-Time Multiplayer Architecture Canvas for Engineering Teams',
    description: 'Collaborative architectural diagramming and live code projection tool with zero-lag CRDT synchronization, web workers, and bi-directional code synthesis.',
    tech_stack: ['TypeScript', 'React 19', 'WebSockets', 'Canvas API', 'Tailwind CSS'],
    github_url: 'https://github.com/alexrivera/devcanvas',
    live_url: 'https://devcanvas.app',
    case_study_url: '',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    is_featured: true,
    display_order: 1,
    github_stars: 870,
    created_at: new Date(Date.now() - 70 * 86400000).toISOString(),
  },
  {
    id: 'proj-3',
    user_id: 'lead-dev-profile-01',
    title: 'HyperLog Observability',
    tagline: 'Zero-Overhead eBPF Distributed Tracing for Cloud-Native Workloads',
    description: 'Kernel-level distributed tracing collector leveraging eBPF to trace HTTP/gRPC packet flow across microservices without application-level instrumentation.',
    tech_stack: ['Rust', 'eBPF', 'OpenTelemetry', 'Kubernetes', 'Prometheus'],
    github_url: 'https://github.com/alexrivera/hyperlog',
    live_url: 'https://hyperlog.dev',
    case_study_url: '',
    images: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    is_featured: true,
    display_order: 2,
    github_stars: 2150,
    created_at: new Date(Date.now() - 100 * 86400000).toISOString(),
  },
]

const defaultSkills: Skill[] = [
  { id: 'sk-1', user_id: 'lead-dev-profile-01', category: 'languages', name: 'TypeScript', proficiency: 'expert', display_order: 0, created_at: '' },
  { id: 'sk-2', user_id: 'lead-dev-profile-01', category: 'languages', name: 'Go', proficiency: 'expert', display_order: 1, created_at: '' },
  { id: 'sk-3', user_id: 'lead-dev-profile-01', category: 'languages', name: 'Rust', proficiency: 'advanced', display_order: 2, created_at: '' },
  { id: 'sk-4', user_id: 'lead-dev-profile-01', category: 'languages', name: 'Python', proficiency: 'advanced', display_order: 3, created_at: '' },
  { id: 'sk-5', user_id: 'lead-dev-profile-01', category: 'backend', name: 'Distributed Systems & Raft', proficiency: 'expert', display_order: 4, created_at: '' },
  { id: 'sk-6', user_id: 'lead-dev-profile-01', category: 'backend', name: 'PostgreSQL & Redis', proficiency: 'expert', display_order: 5, created_at: '' },
  { id: 'sk-7', user_id: 'lead-dev-profile-01', category: 'backend', name: 'Apache Kafka & gRPC', proficiency: 'expert', display_order: 6, created_at: '' },
  { id: 'sk-8', user_id: 'lead-dev-profile-01', category: 'frontend', name: 'React 19 & Next.js', proficiency: 'expert', display_order: 7, created_at: '' },
  { id: 'sk-9', user_id: 'lead-dev-profile-01', category: 'frontend', name: 'Tailwind CSS & WebGL', proficiency: 'advanced', display_order: 8, created_at: '' },
  { id: 'sk-10', user_id: 'lead-dev-profile-01', category: 'devops', name: 'Kubernetes & Docker', proficiency: 'expert', display_order: 9, created_at: '' },
  { id: 'sk-11', user_id: 'lead-dev-profile-01', category: 'devops', name: 'AWS & Terraform', proficiency: 'advanced', display_order: 10, created_at: '' },
]

const defaultEducation: Education[] = [
  {
    id: 'edu-1',
    user_id: 'lead-dev-profile-01',
    institution: 'University of California, Berkeley',
    degree: 'B.S.',
    field: 'Electrical Engineering & Computer Science (EECS)',
    start_date: '2014-08-15',
    end_date: '2018-05-20',
    description: 'Focus on distributed algorithms, operating systems, and computer architecture. Dean’s Honors List.',
    logo_url: '',
    display_order: 0,
    created_at: new Date(Date.now() - 250 * 86400000).toISOString(),
  },
]

const defaultCollaborators: Collaborator[] = [
  {
    id: 'collab-host',
    name: 'Alex Rivera (You)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    color: '#00d2ff',
    role: 'host',
    status: 'active',
    activeSection: 'hero',
    lastActive: Date.now(),
  },
  {
    id: 'collab-2',
    name: 'Elena Vance',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    color: '#10b981',
    role: 'reviewer',
    status: 'active',
    activeSection: 'projects',
    lastActive: Date.now() - 15000,
  },
  {
    id: 'collab-3',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    color: '#a855f7',
    role: 'editor',
    status: 'typing',
    activeSection: 'experience',
    lastActive: Date.now() - 5000,
  },
]

const defaultComments: CollabComment[] = [
  {
    id: 'comm-1',
    sectionId: 'hero',
    authorId: 'collab-2',
    authorName: 'Elena Vance',
    authorColor: '#10b981',
    text: 'Love the tagline! Consider emphasizing your sub-millisecond p99 latency metric right in the first sentence for high-frequency trading & infra recruiters.',
    createdAt: '10 mins ago',
    resolved: false,
    suggestedChange: {
      field: 'tagline',
      value: 'Staff Infrastructure Architect | Sub-Millisecond Distributed Systems',
      description: 'Tighten tagline for infrastructure leaders',
    },
  },
  {
    id: 'comm-2',
    sectionId: 'projects',
    authorId: 'collab-3',
    authorName: 'Marcus Chen',
    authorColor: '#a855f7',
    text: 'ChronosDB project looks top-tier. Added the Docker and LSM-Tree tags so recruiters immediately spot system-level depth.',
    createdAt: '25 mins ago',
    resolved: true,
  },
]

const defaultActivity: CollabActivity[] = [
  {
    id: 'act-1',
    timestamp: 'Just now',
    actor: 'Marcus Chen',
    actorColor: '#a855f7',
    action: 'Modified project tags on ChronosDB',
    details: 'Added LSM-Tree, Raft',
  },
  {
    id: 'act-2',
    timestamp: '5m ago',
    actor: 'Elena Vance',
    actorColor: '#10b981',
    action: 'Left review comment on Hero section',
  },
  {
    id: 'act-3',
    timestamp: '12m ago',
    actor: 'Gemini AI Copilot',
    actorColor: '#00d2ff',
    action: 'Optimized project descriptions with metric benchmarks',
  },
  {
    id: 'act-4',
    timestamp: '18m ago',
    actor: 'Alex Rivera (You)',
    actorColor: '#00d2ff',
    action: 'Switched default layout to Monolith Minimalist',
  },
]

const defaultAIConfig: AIConfig = {
  tone: 'silicon_valley',
  targetRole: 'Staff / Senior Distributed Systems Architect',
  customInstructions: 'Focus on latency reduction, resilience, and high concurrency. Avoid hyperbole.',
  temperature: 0.7,
  includeMetrics: true,
  conciseMode: true,
}

export interface PortfolioState {
  // Data
  profile: Profile | null
  socialLinks: SocialLinks | null
  experience: Experience[]
  projects: Project[]
  skills: Skill[]
  education: Education[]

  // Real-Time Collaboration State
  collaborators: Collaborator[]
  comments: CollabComment[]
  activityFeed: CollabActivity[]
  activeSection: string
  collabRoomId: string
  isCollabLive: boolean
  isSimulatedPeerActive: boolean

  // AI Configuration State
  aiConfig: AIConfig
  isAIGenerating: boolean
  aiLastGeneratedText: string | null

  // UI State
  isLoading: boolean
  error: string | null
  selectedTemplate: string
  activeStudioTab: 'builder' | 'ide' | 'ai' | 'collab' | 'preview'
  previewDevice: 'desktop' | 'tablet' | 'mobile'

  // Beginner Flow & Modes
  currentStep: 'front' | 'modes' | 'details' | 'portfolio'
  activeMode: ModeId
  setCurrentStep: (step: 'front' | 'modes' | 'details' | 'portfolio') => void
  setActiveMode: (mode: ModeId) => void
  getPortfolioScore: () => {
    score: number
    rating: string
    breakdown: {
      hasName: boolean
      hasTitle: boolean
      hasEmail: boolean
      hasBio: boolean
      hasSkills: boolean
      hasProjects: boolean
      hasSocial: boolean
    }
    tips: string[]
  }

  // Actions
  fetchPortfolio: (userId?: string) => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  updateSocialLinks: (updates: Partial<SocialLinks>) => Promise<void>

  // Experience
  addExperience: (data: Omit<Experience, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  updateExperience: (id: string, data: Partial<Experience>) => Promise<void>
  deleteExperience: (id: string) => Promise<void>

  // Projects
  addProject: (data: Omit<Project, 'id' | 'user_id' | 'created_at' | 'github_stars'>) => Promise<void>
  updateProject: (id: string, data: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>

  // Skills
  addSkill: (data: Omit<Skill, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  updateSkill: (id: string, data: Partial<Skill>) => Promise<void>
  deleteSkill: (id: string) => Promise<void>

  // Education
  addEducation: (data: Omit<Education, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  updateEducation: (id: string, data: Partial<Education>) => Promise<void>
  deleteEducation: (id: string) => Promise<void>

  // Collaboration Actions
  setActiveSection: (section: string) => void
  addComment: (sectionId: string, text: string, suggestedChange?: { field: string; value: any; description?: string }) => void
  resolveComment: (commentId: string) => void
  applyCommentSuggestion: (commentId: string) => void
  deleteComment: (commentId: string) => void
  addCollaborator: (name: string, role: Collaborator['role']) => void
  removeCollaborator: (id: string) => void
  toggleSimulatedPeers: () => void
  broadcastState: () => void

  // AI Actions
  setAIConfig: (updates: Partial<AIConfig>) => void
  generateWithAI: (task: string, prompt?: string, customContext?: any) => Promise<string>
  applyAISuggestion: (field: 'tagline' | 'bio' | 'project', value: any, extraId?: string) => void

  // Template & UI
  setTemplate: (templateId: string) => void
  setActiveStudioTab: (tab: 'builder' | 'ide' | 'ai' | 'collab' | 'preview') => void
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void
  resetToDefaults: () => void
}

// BroadcastChannel for instant multi-tab real-time sync
let collabBroadcast: BroadcastChannel | null = null
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    collabBroadcast = new BroadcastChannel(COLLAB_CHANNEL_NAME)
  }
} catch {
  // ignore if not supported
}

export const usePortfolioStore = create<PortfolioState>((set, get) => {
  // Try to load cached data
  const loadSavedData = () => {
    if (typeof window === 'undefined') return null
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return null
  }

  const saved = loadSavedData()

  const initialState = {
    profile: saved?.profile || defaultProfile,
    socialLinks: saved?.socialLinks || defaultSocialLinks,
    experience: saved?.experience || defaultExperience,
    projects: saved?.projects || defaultProjects,
    skills: saved?.skills || defaultSkills,
    education: saved?.education || defaultEducation,
    collaborators: defaultCollaborators,
    comments: saved?.comments || defaultComments,
    activityFeed: defaultActivity,
    activeSection: 'hero',
    collabRoomId: 'devforge-room-' + Math.floor(1000 + Math.random() * 9000),
    isCollabLive: true,
    isSimulatedPeerActive: true,
    aiConfig: defaultAIConfig,
    isAIGenerating: false,
    aiLastGeneratedText: null,
    isLoading: false,
    error: null,
    selectedTemplate: saved?.profile?.template_id || 'dark',
    activeStudioTab: 'builder' as const,
    previewDevice: 'desktop' as const,
    currentStep: (saved?.currentStep as any) || 'front',
    activeMode: (saved?.activeMode as ModeId) || 'dark',
  }

  // Setup broadcast receiver
  if (collabBroadcast) {
    collabBroadcast.onmessage = (event) => {
      if (event.data?.type === 'SYNC_STATE') {
        const payload = event.data.payload
        set({
          profile: payload.profile,
          socialLinks: payload.socialLinks,
          experience: payload.experience,
          projects: payload.projects,
          skills: payload.skills,
          education: payload.education,
          selectedTemplate: payload.profile?.template_id || get().selectedTemplate,
        })
      } else if (event.data?.type === 'COLLAB_ACTIVITY') {
        set((state) => ({
          activityFeed: [event.data.payload, ...state.activityFeed].slice(0, 50),
        }))
      } else if (event.data?.type === 'NEW_COMMENT') {
        set((state) => ({
          comments: [event.data.payload, ...state.comments],
        }))
      }
    }
  }

  // Internal helper to persist and broadcast
  const saveAndBroadcast = (updatedState: Partial<PortfolioState>, activityMessage?: string) => {
    const currentState = { ...get(), ...updatedState }
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            profile: currentState.profile,
            socialLinks: currentState.socialLinks,
            experience: currentState.experience,
            projects: currentState.projects,
            skills: currentState.skills,
            education: currentState.education,
            comments: currentState.comments,
          })
        )
      }
    } catch {
      // ignore
    }

    if (collabBroadcast) {
      collabBroadcast.postMessage({
        type: 'SYNC_STATE',
        payload: {
          profile: currentState.profile,
          socialLinks: currentState.socialLinks,
          experience: currentState.experience,
          projects: currentState.projects,
          skills: currentState.skills,
          education: currentState.education,
        },
      })
    }

    if (activityMessage) {
      const newActivity: CollabActivity = {
        id: 'act-' + Date.now(),
        timestamp: 'Just now',
        actor: 'Alex Rivera (You)',
        actorColor: '#00d2ff',
        action: activityMessage,
      }
      set((state) => ({
        ...updatedState,
        activityFeed: [newActivity, ...state.activityFeed].slice(0, 50),
      }))

      if (collabBroadcast) {
        collabBroadcast.postMessage({
          type: 'COLLAB_ACTIVITY',
          payload: newActivity,
        })
      }
    } else {
      set(updatedState)
    }
  }

  return {
    ...initialState,

    broadcastState: () => {
      saveAndBroadcast({})
    },

    fetchPortfolio: async (_userId?: string) => {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      try {
        const { data: profileData } = await supabase.from('profiles').select('*').limit(1).single()
        if (profileData) {
          set({
            profile: profileData,
            selectedTemplate: profileData.template_id || 'monolith',
            isLoading: false,
          })
          return
        }
      } catch {
        // use local persistent state
      }
      set({ isLoading: false })
    },

    updateProfile: async (updates) => {
      const current = get().profile || defaultProfile
      const updated: Profile = {
        ...current,
        ...updates,
        updated_at: new Date().toISOString(),
      }
      saveAndBroadcast({ profile: updated, selectedTemplate: updated.template_id }, 'Updated profile metadata')
    },

    updateSocialLinks: async (updates) => {
      const current = get().socialLinks || defaultSocialLinks
      const updated: SocialLinks = { ...current, ...updates }
      saveAndBroadcast({ socialLinks: updated }, 'Updated social communication links')
    },

    addExperience: async (data) => {
      const current = get().experience
      const newExp: Experience = {
        ...data,
        id: 'exp-' + Date.now(),
        user_id: get().profile?.id || 'lead-dev-profile-01',
        created_at: new Date().toISOString(),
      }
      const updated = [...current, newExp]
      saveAndBroadcast({ experience: updated }, `Added career milestone at ${data.company}`)
    },

    updateExperience: async (id, data) => {
      const current = get().experience
      const updated = current.map((item) => (item.id === id ? { ...item, ...data } : item))
      saveAndBroadcast({ experience: updated }, 'Modified career experience')
    },

    deleteExperience: async (id) => {
      const current = get().experience
      const updated = current.filter((item) => item.id !== id)
      saveAndBroadcast({ experience: updated }, 'Removed career experience milestone')
    },

    addProject: async (data) => {
      const current = get().projects
      const newProj: Project = {
        ...data,
        id: 'proj-' + Date.now(),
        user_id: get().profile?.id || 'lead-dev-profile-01',
        github_stars: Math.floor(50 + Math.random() * 500),
        created_at: new Date().toISOString(),
      }
      const updated = [...current, newProj]
      saveAndBroadcast({ projects: updated }, `Added new engineering project: ${data.title}`)
    },

    updateProject: async (id, data) => {
      const current = get().projects
      const updated = current.map((item) => (item.id === id ? { ...item, ...data } : item))
      saveAndBroadcast({ projects: updated }, `Updated project: ${data.title || 'details'}`)
    },

    deleteProject: async (id) => {
      const current = get().projects
      const updated = current.filter((item) => item.id !== id)
      saveAndBroadcast({ projects: updated }, 'Archived engineering project')
    },

    addSkill: async (data) => {
      const current = get().skills
      const newSkill: Skill = {
        ...data,
        id: 'sk-' + Date.now(),
        user_id: get().profile?.id || 'lead-dev-profile-01',
        created_at: new Date().toISOString(),
      }
      const updated = [...current, newSkill]
      saveAndBroadcast({ skills: updated }, `Added tech capability: ${data.name}`)
    },

    updateSkill: async (id, data) => {
      const current = get().skills
      const updated = current.map((item) => (item.id === id ? { ...item, ...data } : item))
      saveAndBroadcast({ skills: updated }, 'Updated skill taxonomy')
    },

    deleteSkill: async (id) => {
      const current = get().skills
      const updated = current.filter((item) => item.id !== id)
      saveAndBroadcast({ skills: updated }, 'Removed skill badge')
    },

    addEducation: async (data) => {
      const current = get().education
      const newEdu: Education = {
        ...data,
        id: 'edu-' + Date.now(),
        user_id: get().profile?.id || 'lead-dev-profile-01',
        created_at: new Date().toISOString(),
      }
      const updated = [...current, newEdu]
      saveAndBroadcast({ education: updated }, `Added education: ${data.institution}`)
    },

    updateEducation: async (id, data) => {
      const current = get().education
      const updated = current.map((item) => (item.id === id ? { ...item, ...data } : item))
      saveAndBroadcast({ education: updated }, 'Updated education credential')
    },

    deleteEducation: async (id) => {
      const current = get().education
      const updated = current.filter((item) => item.id !== id)
      saveAndBroadcast({ education: updated }, 'Removed academic credential')
    },

    setActiveSection: (section) => {
      set({ activeSection: section })
    },

    addComment: (sectionId, text, suggestedChange) => {
      const newComment: CollabComment = {
        id: 'comm-' + Date.now(),
        sectionId,
        authorId: 'collab-host',
        authorName: 'Alex Rivera (You)',
        authorColor: '#00d2ff',
        text,
        createdAt: 'Just now',
        resolved: false,
        suggestedChange,
      }
      const updated = [newComment, ...get().comments]
      saveAndBroadcast({ comments: updated }, `Dropped review comment on ${sectionId} section`)
    },

    resolveComment: (commentId) => {
      const updated = get().comments.map((c) => (c.id === commentId ? { ...c, resolved: !c.resolved } : c))
      saveAndBroadcast({ comments: updated }, 'Updated comment status')
    },

    applyCommentSuggestion: (commentId) => {
      const comment = get().comments.find((c) => c.id === commentId)
      if (!comment || !comment.suggestedChange) return
      const { field, value } = comment.suggestedChange
      if (field === 'tagline' || field === 'bio') {
        get().updateProfile({ [field]: value })
      }
      get().resolveComment(commentId)
    },

    deleteComment: (commentId) => {
      const updated = get().comments.filter((c) => c.id !== commentId)
      saveAndBroadcast({ comments: updated }, 'Removed review comment')
    },

    addCollaborator: (name, role) => {
      const colors = ['#f59e0b', '#ec4899', '#3b82f6', '#14b8a6', '#8b5cf6']
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      const newCollab: Collaborator = {
        id: 'collab-' + Date.now(),
        name,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        color: randomColor,
        role,
        status: 'active',
        activeSection: 'projects',
        lastActive: Date.now(),
      }
      set((state) => ({
        collaborators: [...state.collaborators, newCollab],
      }))
    },

    removeCollaborator: (id) => {
      set((state) => ({
        collaborators: state.collaborators.filter((c) => c.id !== id),
      }))
    },

    toggleSimulatedPeers: () => {
      set((state) => ({ isSimulatedPeerActive: !state.isSimulatedPeerActive }))
    },

    setAIConfig: (updates) => {
      set((state) => ({
        aiConfig: { ...state.aiConfig, ...updates },
      }))
    },

    generateWithAI: async (task, prompt, customContext) => {
      set({ isAIGenerating: true, error: null })
      try {
        const state = get()
        const context = customContext || {
          name: state.profile?.name,
          tagline: state.profile?.tagline,
          bio: state.profile?.bio,
          skills: state.skills.map((s) => s.name),
          projects: state.projects,
          experience: state.experience,
        }

        const res = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task,
            prompt,
            context,
            config: state.aiConfig,
          }),
        })

        const data = await res.json()
        if (!data.success) {
          throw new Error(data.error || 'AI generation failed')
        }

        set({
          isAIGenerating: false,
          aiLastGeneratedText: data.text,
        })

        // Log to activity feed
        const newActivity: CollabActivity = {
          id: 'act-' + Date.now(),
          timestamp: 'Just now',
          actor: 'Gemini AI Assistant',
          actorColor: '#00d2ff',
          action: `Generated AI recommendation for ${task.replace(/_/g, ' ')}`,
        }
        set((s) => ({ activityFeed: [newActivity, ...s.activityFeed].slice(0, 50) }))

        return data.text
      } catch (err: any) {
        set({ isAIGenerating: false, error: err.message })
        throw err
      }
    },

    applyAISuggestion: (field, value, extraId) => {
      if (field === 'tagline') {
        get().updateProfile({ tagline: value })
      } else if (field === 'bio') {
        get().updateProfile({ bio: value })
      } else if (field === 'project' && extraId) {
        get().updateProject(extraId, value)
      }
    },

    setTemplate: (templateId) => {
      get().updateProfile({ template_id: templateId as any })
      set({ selectedTemplate: templateId })
    },

    setActiveStudioTab: (tab) => {
      set({ activeStudioTab: tab })
    },

    setPreviewDevice: (device) => {
      set({ previewDevice: device })
    },

    setCurrentStep: (step) => {
      set({ currentStep: step })
      if (typeof window !== 'undefined') {
        try {
          const current = get()
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            profile: current.profile,
            socialLinks: current.socialLinks,
            experience: current.experience,
            projects: current.projects,
            skills: current.skills,
            education: current.education,
            currentStep: step,
            activeMode: current.activeMode,
          }))
        } catch {
          // ignore
        }
      }
    },

    setActiveMode: (mode) => {
      set({ activeMode: mode, selectedTemplate: mode })
      get().updateProfile({ template_id: mode as any })
    },

    getPortfolioScore: () => {
      const { profile, projects, skills, socialLinks } = get()
      let score = 0
      const tips: string[] = []

      const hasName = Boolean(profile?.name && profile.name.trim().length > 1)
      const hasTitle = Boolean(profile?.tagline && profile.tagline.trim().length > 3)
      const hasEmail = Boolean(socialLinks?.email && socialLinks.email.includes('@'))
      const hasBio = Boolean(profile?.bio && profile.bio.trim().length > 25)
      const hasSkills = Boolean(skills && skills.length >= 3)
      const hasProjects = Boolean(projects && projects.length >= 1)
      const hasSocial = Boolean(socialLinks?.github || socialLinks?.linkedin || socialLinks?.website)

      if (hasName) score += 15; else tips.push('Add your full name')
      if (hasTitle) score += 15; else tips.push('Add your professional title or aspirational role')
      if (hasEmail) score += 15; else tips.push('Add a valid contact email')
      if (hasBio) score += 20; else tips.push('Write a short bio or click ✨ AI Write Bio')
      if (hasSkills) score += 15; else tips.push('Add at least 3 skills to showcase your toolset')
      if (hasProjects) score += 10; else tips.push('Add at least 1 project you built or are proud of')
      if (projects && projects.length >= 2) score += 5; else if (hasProjects) tips.push('Add a 2nd project to demonstrate your breadth')
      if (hasSocial) score += 5; else tips.push('Include a GitHub, LinkedIn, or personal website link')

      let rating = 'Getting Started'
      if (score >= 90) rating = '🌟 Outstanding / 100% Ready'
      else if (score >= 75) rating = '🚀 Strong Portfolio'
      else if (score >= 50) rating = '👍 Good Foundation'

      return {
        score: Math.min(100, score),
        rating,
        breakdown: {
          hasName,
          hasTitle,
          hasEmail,
          hasBio,
          hasSkills,
          hasProjects,
          hasSocial,
        },
        tips,
      }
    },

    resetToDefaults: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
      }
      set({
        profile: defaultProfile,
        socialLinks: defaultSocialLinks,
        experience: defaultExperience,
        projects: defaultProjects,
        skills: defaultSkills,
        education: defaultEducation,
        comments: defaultComments,
        selectedTemplate: 'dark',
        activeMode: 'dark',
        currentStep: 'front',
      })
    },
  }
})
