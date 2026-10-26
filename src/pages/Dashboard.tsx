import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Layout,
  Plus,
  ExternalLink,
  Settings,
  UserCircle,
  Paintbrush,
  Loader2,
  Briefcase,
  GraduationCap,
  Code as CodeIcon,
  Rocket,
  Trash2,
  ChevronDown,
  Download,
  Github,
  CheckCircle,
  Linkedin,
  Instagram,
  Globe,
  Mail,
  Save,
  Building2,
  Sparkles,
  MessageSquare,
  Users,
  Eye,
  Laptop,
  Tablet,
  Smartphone,
  Copy,
  Check,
  RefreshCw,
  GitBranch,
  Shield,
  Layers,
  Edit3,
  Bot,
  HardDrive,
  Upload
} from 'lucide-react'
import JSZip from 'jszip'
import { usePortfolioStore } from '@/store/portfolioStore'
import { CollabHeader } from '@/components/CollabHeader'
import { CollabModal } from '@/components/CollabModal'
import { CollabCommentsDrawer } from '@/components/CollabCommentsDrawer'
import { CollabSplitCodeView } from '@/components/CollabSplitCodeView'
import { AIStudioPanel } from '@/components/AIStudioPanel'
import { AIChatBox } from '@/components/AIChatBox'
import { FileImportModal } from '@/components/FileImportModal'
import { ModeCustomizer } from '@/components/ModeCustomizer'
import { IDEStatusBar } from '@/components/IDEStatusBar'
import { templateComponents } from '@/templates'
import type { PortfolioData, TemplateId, Project, Experience, Skill, Education } from '@/types'

// Generic Modal Component
function Modal({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#141824] border border-[#21283b] w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#21283b]">
          <h2 className="text-base font-bold text-white uppercase tracking-tight font-mono">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const {
    profile,
    projects,
    experience,
    education,
    skills,
    socialLinks,
    selectedTemplate,
    activeStudioTab,
    previewDevice,
    collaborators,
    comments,
    activityFeed,
    collabRoomId,
    setTemplate,
    setActiveStudioTab,
    setPreviewDevice,
    updateProfile,
    updateSocialLinks,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    updateExperience,
    deleteExperience,
    addSkill,
    deleteSkill,
    addEducation,
    deleteEducation,
    generateWithAI,
    isAIGenerating,
    applyAISuggestion,
    resetToDefaults
  } = usePortfolioStore()

  // Modal & Drawer states
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false)
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false)
  const [isFileHubOpen, setIsFileHubOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<'project' | 'experience' | 'skill' | 'education' | 'profile' | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [quickAIField, setQuickAIField] = useState<'tagline' | 'bio' | null>(null)

  // Form states for modals
  const [projectForm, setProjectForm] = useState({
    title: '',
    tagline: '',
    description: '',
    tech_stack: 'TypeScript, React, Go',
    github_url: '',
    live_url: '',
    is_featured: true,
  })

  const [expForm, setExpForm] = useState({
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  })

  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'backend' as const,
    proficiency: 'expert' as const,
  })

  const [profileForm, setProfileForm] = useState({
    name: profile?.name || '',
    tagline: profile?.tagline || '',
    bio: profile?.bio || '',
    accent_color: profile?.accent_color || '#00d2ff',
    custom_domain: profile?.custom_domain || '',
    github: socialLinks?.github || '',
    linkedin: socialLinks?.linkedin || '',
    twitter: socialLinks?.twitter || '',
    website: socialLinks?.website || '',
    email: socialLinks?.email || '',
  })

  useEffect(() => {
    if (profile) {
      setProfileForm((prev) => ({
        ...prev,
        name: profile.name,
        tagline: profile.tagline,
        bio: profile.bio,
        accent_color: profile.accent_color,
        custom_domain: profile.custom_domain,
      }))
    }
  }, [profile])

  // Current compiled data
  const currentData: PortfolioData = {
    profile: profile!,
    social_links: socialLinks,
    experience,
    projects,
    skills,
    education,
  }

  // Handle Quick AI Polish for Hero
  const handleQuickAIPolish = async (field: 'tagline' | 'bio') => {
    setQuickAIField(field)
    try {
      const res = await generateWithAI(
        'generate_bio',
        `Polish this developer ${field} for high-caliber engineering recruiters in ${selectedTemplate} mode.`,
        { name: profile?.name, tagline: profile?.tagline, bio: profile?.bio }
      )
      const taglineMatch = res.match(/TAGLINE:\s*(.+)/i)
      const bioMatch = res.match(/BIO:\s*([\s\S]+)/i)

      if (field === 'tagline' && taglineMatch) {
        updateProfile({ tagline: taglineMatch[1].trim() })
      } else if (field === 'bio' && bioMatch) {
        updateProfile({ bio: bioMatch[1].trim() })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setQuickAIField(null)
    }
  }

  // Handle ZIP Export
  const handleExportZip = async () => {
    setIsExporting(true)
    try {
      const zip = new JSZip()
      zip.file('portfolio-data.json', JSON.stringify(currentData, null, 2))
      zip.file('package.json', JSON.stringify({
        name: `${profile?.username || 'developer'}-portfolio`,
        private: true,
        version: '1.0.0',
        type: 'module',
        dependencies: {
          react: '^19.0.0',
          'react-dom': '^19.0.0',
          'framer-motion': '^12.0.0',
          'lucide-react': '^0.470.0',
          tailwindcss: '^4.0.0'
        }
      }, null, 2))
      zip.file('README.md', `# ${profile?.name} - DevForge Portfolio\nGenerated in ${selectedTemplate} mode.`)

      const content = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `${profile?.username || 'dev'}-portfolio-devforge.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  // Active template component
  const ActiveTemplateComponent =
    templateComponents[selectedTemplate as TemplateId] || templateComponents.professional

  return (
    <div className="min-h-screen bg-[#0b0d13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top IDE Collab Header */}
      <CollabHeader
        onOpenInvite={() => setIsInviteModalOpen(true)}
        onOpenComments={() => setIsCommentsDrawerOpen(true)}
        onOpenChat={() => setIsChatBoxOpen((prev) => !prev)}
        onOpenFileHub={() => setIsFileHubOpen(true)}
        onExportZip={handleExportZip}
        isExporting={isExporting}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 overflow-auto">
        {/* TAB 1: Visual Portfolio Builder */}
        {activeStudioTab === 'builder' && (
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            {/* 4 MODES CUSTOMIZER WIDGET */}
            <ModeCustomizer />

            {/* Section 1: Hero & Persona Card */}
            <section className="p-6 rounded-2xl bg-[#141824] border border-[#21283b] shadow-xl relative group">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#21283b]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold">
                    H1
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight">Hero & Professional Headline</h2>
                    <p className="text-[11px] text-slate-400">Positioning, elevator pitch, and technical ethos</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickAIPolish('tagline')}
                    disabled={isAIGenerating}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-all disabled:opacity-40"
                    title="Prompt Gemini to polish tagline with impact benchmarks"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>{quickAIField === 'tagline' ? 'Polishing...' : 'AI Polish Tagline'}</span>
                  </button>

                  <button
                    onClick={() => setActiveModal('profile')}
                    className="p-1.5 rounded-lg bg-[#090b10] hover:bg-slate-800 text-slate-300 border border-[#21283b] transition-all"
                    title="Edit Hero Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-2xl font-black text-white">{profile?.name}</h3>
                    <p className="text-sm font-mono text-cyan-400 mt-0.5">{profile?.tagline}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full ring-2 ring-white/10"
                      style={{ backgroundColor: profile?.accent_color || '#00d2ff' }}
                      title="Accent Color"
                    />
                    <span className="text-[11px] font-mono text-slate-400">{profile?.custom_domain}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl font-sans bg-[#090b10] p-4 rounded-xl border border-[#21283b]/60">
                  {profile?.bio}
                </p>

                {/* Social links row */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-slate-400">
                  {socialLinks?.github && (
                    <a href={socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                      <Github className="w-3.5 h-3.5 text-slate-400" />
                      <span>{socialLinks.github.replace('https://github.com/', '@')}</span>
                    </a>
                  )}
                  {socialLinks?.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                      <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {socialLinks?.email && (
                    <a href={`mailto:${socialLinks.email}`} className="flex items-center gap-1 hover:text-white">
                      <Mail className="w-3.5 h-3.5 text-rose-400" />
                      <span>{socialLinks.email}</span>
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* Section 2: Projects Showcase */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold">
                    P
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      Engineering Projects ({projects.length})
                    </h2>
                    <p className="text-xs text-slate-400">Case studies, architecture breakdowns, and live systems</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingItem(null)
                    setProjectForm({
                      title: '',
                      tagline: '',
                      description: '',
                      tech_stack: 'Go, Raft, Docker',
                      github_url: '',
                      live_url: '',
                      is_featured: true,
                    })
                    setActiveModal('project')
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-600/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-[#141824] border border-[#21283b] hover:border-purple-500/40 transition-all flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                          {proj.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingItem(proj)
                              setProjectForm({
                                title: proj.title,
                                tagline: proj.tagline,
                                description: proj.description,
                                tech_stack: proj.tech_stack.join(', '),
                                github_url: proj.github_url,
                                live_url: proj.live_url,
                                is_featured: proj.is_featured,
                              })
                              setActiveModal('project')
                            }}
                            className="p-1 text-slate-400 hover:text-white rounded"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProject(proj.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-purple-400/90 font-mono mb-2">{proj.tagline}</p>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4 font-sans">
                        {proj.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {proj.tech_stack.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded bg-[#090b10] border border-[#21283b] text-[10px] font-mono text-cyan-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-[#21283b]">
                        {proj.github_url && (
                          <a href={proj.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                            <Github className="w-3 h-3" />
                            <span>Code</span>
                          </a>
                        )}
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-cyan-400">
                            <ExternalLink className="w-3 h-3" />
                            <span>Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Technical Skills & Career Experience */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Skills Card */}
              <div className="p-6 rounded-2xl bg-[#141824] border border-[#21283b] shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#21283b]">
                  <div className="flex items-center gap-2">
                    <CodeIcon className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Skills & Domains</h3>
                  </div>
                  <button
                    onClick={() => {
                      setSkillForm({ name: '', category: 'backend', proficiency: 'expert' })
                      setActiveModal('skill')
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono rounded-lg transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Skill</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s.id}
                      className="group flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#090b10] border border-[#21283b] text-xs font-mono text-slate-200 hover:border-emerald-500/40 transition-all"
                    >
                      <span className="text-emerald-400 font-bold">{s.name}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{s.proficiency}</span>
                      <button
                        onClick={() => deleteSkill(s.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Card */}
              <div className="p-6 rounded-2xl bg-[#141824] border border-[#21283b] shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#21283b]">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">Leadership & Experience</h3>
                  </div>
                  <button
                    onClick={() => {
                      setExpForm({
                        company: '',
                        position: '',
                        location: '',
                        start_date: '',
                        end_date: '',
                        is_current: false,
                        description: '',
                      })
                      setActiveModal('experience')
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono rounded-lg transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Role</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3.5 rounded-xl bg-[#090b10] border border-[#21283b] space-y-1.5 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{exp.position}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-slate-400">
                            {exp.start_date.slice(0, 7)} — {exp.is_current ? 'Present' : exp.end_date?.slice(0, 7)}
                          </span>
                          <button
                            onClick={() => deleteExperience(exp.id)}
                            className="p-1 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-cyan-400 font-mono">{exp.company} • {exp.location}</div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Collaborative Split Code View (IDE Mode) */}
        {activeStudioTab === 'ide' && <CollabSplitCodeView />}

        {/* TAB 3: AI Configuration & Prompt Lab */}
        {activeStudioTab === 'ai' && <AIStudioPanel />}

        {/* TAB 4: Peer Review & Collaboration Activity Hub */}
        {activeStudioTab === 'collab' && (
          <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="bg-[#141824] border border-[#21283b] p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                    Live Session Active
                  </span>
                  <span className="text-xs font-mono text-slate-400">#{collabRoomId}</span>
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight mt-1">
                  Multiplayer Collaboration & Audit Hub
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Connected peers can view real-time changes, annotate code lines, and leave inline suggestions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Manage Collaborators</span>
                </button>
                <button
                  onClick={() => setIsCommentsDrawerOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#090b10] hover:bg-slate-800 border border-[#21283b] text-white text-xs font-mono rounded-xl transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Review Comments ({comments.filter((c) => !c.resolved).length})</span>
                </button>
              </div>
            </div>

            {/* Collaborator Grid & Live Activity Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Connected Roster */}
              <div className="p-6 rounded-2xl bg-[#141824] border border-[#21283b] space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Connected Team Members ({collaborators.length})
                </h2>
                <div className="space-y-3">
                  {collaborators.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-[#090b10] border border-[#21283b] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="text-xs font-bold text-white">{c.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">
                            Role: <span className="text-emerald-400">{c.role}</span> • Status: <span className="text-cyan-400">{c.status}</span>
                          </div>
                        </div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="p-6 rounded-2xl bg-[#141824] border border-[#21283b] space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-cyan-400" />
                  Live Activity Timeline
                </h2>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {activityFeed.map((act) => (
                    <div key={act.id} className="p-3 rounded-xl bg-[#090b10] border border-[#21283b] text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-white" style={{ color: act.actorColor }}>
                          {act.actor}
                        </span>
                        <span className="text-slate-500">{act.timestamp}</span>
                      </div>
                      <p className="text-slate-300 font-sans">{act.action}</p>
                      {act.details && <p className="text-[10px] font-mono text-slate-400">{act.details}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Full Live Portfolio Preview */}
        {activeStudioTab === 'preview' && (
          <div className="min-h-screen bg-black flex flex-col items-center p-4 sm:p-6 space-y-4">
            {/* Viewport Control Bar */}
            <div className="w-full max-w-5xl flex items-center justify-between p-3 rounded-2xl bg-[#141824] border border-[#21283b] text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Active Mode:</span>
                <div className="flex items-center gap-1 bg-[#090b10] p-1 rounded-lg border border-[#21283b]">
                  {(['professional', 'monolith', 'terminal', 'creative'] as const).map((tId) => (
                    <button
                      key={tId}
                      onClick={() => setTemplate(tId)}
                      className={`px-3 py-1 rounded text-xs font-mono capitalize transition-all ${
                        selectedTemplate === tId
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tId}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#090b10] p-1 rounded-lg border border-[#21283b]">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Laptop className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1.5 rounded ${previewDevice === 'tablet' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>

                <Link
                  to={`/preview/${selectedTemplate}`}
                  target="_blank"
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#090b10] hover:bg-slate-800 border border-[#21283b] rounded-lg text-slate-200 text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Fullscreen</span>
                </Link>
              </div>
            </div>

            {/* Rendered Viewport Frame */}
            <div
              className={`w-full bg-[#080a0f] rounded-2xl overflow-hidden border border-[#21283b] shadow-2xl transition-all duration-300 ${
                previewDevice === 'desktop'
                  ? 'max-w-6xl'
                  : previewDevice === 'tablet'
                  ? 'max-w-2xl'
                  : 'max-w-sm'
              }`}
            >
              <div className="overflow-y-auto max-h-[80vh] no-scrollbar">
                <ActiveTemplateComponent data={currentData} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating AI Chat Box Trigger Pill */}
      {!isChatBoxOpen && (
        <button
          onClick={() => setIsChatBoxOpen(true)}
          className="fixed bottom-10 right-8 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-2xl shadow-cyan-500/40 transition-all hover:scale-105 select-none"
        >
          <Sparkles className="w-4 h-4 fill-slate-950 animate-spin-slow" />
          <span>DevForge AI Co-pilot</span>
        </button>
      )}

      {/* Bottom IDE Status Bar */}
      <IDEStatusBar />

      {/* Real-Time Collaboration Modal */}
      <CollabModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />

      {/* Peer Review Comments Drawer */}
      <CollabCommentsDrawer
        isOpen={isCommentsDrawerOpen}
        onClose={() => setIsCommentsDrawerOpen(false)}
      />

      {/* AI Chat Box Dock */}
      <AIChatBox
        isOpen={isChatBoxOpen}
        onClose={() => setIsChatBoxOpen(false)}
      />

      {/* System Data Hub / File Import & Save Modal */}
      <FileImportModal
        isOpen={isFileHubOpen}
        onClose={() => setIsFileHubOpen(false)}
      />

      {/* Project Modal */}
      <Modal
        isOpen={activeModal === 'project'}
        onClose={() => setActiveModal(null)}
        title={editingItem ? 'Edit Project' : 'New Project'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const stackArray = projectForm.tech_stack.split(',').map((s) => s.trim()).filter(Boolean)
            if (editingItem) {
              updateProject(editingItem.id, {
                title: projectForm.title,
                tagline: projectForm.tagline,
                description: projectForm.description,
                tech_stack: stackArray,
                github_url: projectForm.github_url,
                live_url: projectForm.live_url,
                is_featured: projectForm.is_featured,
              })
            } else {
              addProject({
                title: projectForm.title,
                tagline: projectForm.tagline,
                description: projectForm.description,
                tech_stack: stackArray,
                github_url: projectForm.github_url,
                live_url: projectForm.live_url,
                case_study_url: '',
                images: [],
                thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
                is_featured: projectForm.is_featured,
                display_order: projects.length,
              })
            }
            setActiveModal(null)
          }}
          className="space-y-4 text-xs font-sans"
        >
          <div>
            <label className="text-slate-300 font-mono block mb-1">Project Title</label>
            <input
              type="text"
              required
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-mono block mb-1">Tagline / Architecture Hook</label>
            <input
              type="text"
              required
              value={projectForm.tagline}
              onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
              className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-mono block mb-1">Engineering Problem & Outcome</label>
            <textarea
              rows={3}
              required
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div>
            <label className="text-slate-300 font-mono block mb-1">Tech Stack (comma-separated)</label>
            <input
              type="text"
              value={projectForm.tech_stack}
              onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value })}
              className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-mono block mb-1">GitHub URL</label>
              <input
                type="url"
                value={projectForm.github_url}
                onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="text-slate-300 font-mono block mb-1">Live Demo URL</label>
              <input
                type="url"
                value={projectForm.live_url}
                onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#21283b]">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
            >
              Save Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Hero Profile Edit Modal */}
      <Modal
        isOpen={activeModal === 'profile'}
        onClose={() => setActiveModal(null)}
        title="Edit Developer Profile"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            updateProfile({
              name: profileForm.name,
              tagline: profileForm.tagline,
              bio: profileForm.bio,
              accent_color: profileForm.accent_color,
              custom_domain: profileForm.custom_domain,
            })
            updateSocialLinks({
              github: profileForm.github,
              linkedin: profileForm.linkedin,
              twitter: profileForm.twitter,
              website: profileForm.website,
              email: profileForm.email,
            })
            setActiveModal(null)
          }}
          className="space-y-4 text-xs font-sans"
        >
          <div>
            <label className="text-slate-300 font-mono block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-mono block mb-1">Professional Tagline</label>
            <input
              type="text"
              required
              value={profileForm.tagline}
              onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
              className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-mono block mb-1">Bio</label>
            <textarea
              rows={3}
              required
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-mono block mb-1">Accent Hex Color</label>
              <input
                type="text"
                value={profileForm.accent_color}
                onChange={(e) => setProfileForm({ ...profileForm, accent_color: e.target.value })}
                className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-mono block mb-1">Custom Domain</label>
              <input
                type="text"
                value={profileForm.custom_domain}
                onChange={(e) => setProfileForm({ ...profileForm, custom_domain: e.target.value })}
                className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-mono block mb-1">GitHub URL</label>
              <input
                type="url"
                value={profileForm.github}
                onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="text-slate-300 font-mono block mb-1">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#21283b]">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl"
            >
              Save Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* Experience Modal */}
      <Modal
        isOpen={activeModal === 'experience'}
        onClose={() => setActiveModal(null)}
        title="Add Career Milestone"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addExperience({
              company: expForm.company,
              position: expForm.position,
              location: expForm.location,
              start_date: expForm.start_date || '2022-01-01',
              end_date: expForm.is_current ? null : expForm.end_date || '2024-01-01',
              is_current: expForm.is_current,
              description: expForm.description,
              logo_url: '',
              display_order: experience.length,
            })
            setActiveModal(null)
          }}
          className="space-y-4 text-xs font-sans"
        >
          <div>
            <label className="text-slate-300 font-mono block mb-1">Company / Team</label>
            <input
              type="text"
              required
              value={expForm.company}
              onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
              className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-mono block mb-1">Role Title</label>
            <input
              type="text"
              required
              value={expForm.position}
              onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
              className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-mono block mb-1">Key Technical Accomplishments</label>
            <textarea
              rows={3}
              required
              value={expForm.description}
              onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white font-sans"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#21283b]">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl"
            >
              Save Milestone
            </button>
          </div>
        </form>
      </Modal>

      {/* Skill Modal */}
      <Modal
        isOpen={activeModal === 'skill'}
        onClose={() => setActiveModal(null)}
        title="Add Technical Skill"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!skillForm.name.trim()) return
            addSkill({
              name: skillForm.name.trim(),
              category: skillForm.category,
              proficiency: skillForm.proficiency,
              display_order: skills.length,
            })
            setActiveModal(null)
          }}
          className="space-y-4 text-xs font-sans"
        >
          <div>
            <label className="text-slate-300 font-mono block mb-1">Skill / Technology Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Apache Kafka, Rust, eBPF"
              value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-mono block mb-1">Category</label>
            <select
              value={skillForm.category}
              onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as any })}
              className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-white font-mono"
            >
              <option value="languages">Languages</option>
              <option value="backend">Backend & Distributed</option>
              <option value="frontend">Frontend & UI</option>
              <option value="devops">DevOps & Cloud</option>
              <option value="tools">Tools & Architecture</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#21283b]">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
            >
              Add Skill
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
