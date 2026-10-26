import React, { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  User,
  Mail,
  MapPin,
  Phone,
  Briefcase,
  Code,
  FolderGit2,
  GraduationCap,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Globe,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Layers
} from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'

export const EnterDetailsPage: React.FC = () => {
  const {
    profile,
    updateProfile,
    socialLinks,
    updateSocialLinks,
    skills,
    addSkill,
    deleteSkill,
    projects,
    addProject,
    updateProject,
    deleteProject,
    experience,
    addExperience,
    deleteExperience,
    setCurrentStep,
    activeMode
  } = usePortfolioStore()

  const [customSkillName, setCustomSkillName] = useState('')
  const [customSkillCategory, setCustomSkillCategory] = useState<'frontend' | 'backend' | 'devops' | 'tools' | 'languages' | 'other'>('frontend')
  const [isGeneratingBio, setIsGeneratingBio] = useState(false)
  const [isGeneratingProject, setIsGeneratingProject] = useState(false)
  const [saveNotice, setSaveNotice] = useState(false)

  // Popular quick-add skill presets for beginners
  const popularSkillPresets = [
    { name: 'JavaScript', category: 'frontend' as const },
    { name: 'React', category: 'frontend' as const },
    { name: 'TypeScript', category: 'frontend' as const },
    { name: 'HTML & CSS', category: 'frontend' as const },
    { name: 'Tailwind CSS', category: 'frontend' as const },
    { name: 'Node.js', category: 'backend' as const },
    { name: 'Python', category: 'backend' as const },
    { name: 'SQL', category: 'backend' as const },
    { name: 'Git & GitHub', category: 'devops' as const },
    { name: 'Docker', category: 'devops' as const },
    { name: 'Figma', category: 'tools' as const },
    { name: 'Problem Solving', category: 'other' as const },
    { name: 'Team Collaboration', category: 'other' as const },
  ]

  // Avatar presets
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  ]

  // 1-Click AI Bio Polish/Generation
  const handleAIBio = async () => {
    setIsGeneratingBio(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Write a compelling 2-3 sentence developer bio for ${profile?.name || 'a software developer'} with title "${profile?.tagline || 'Software Engineer'}". Keep it clear, professional, and friendly for a beginner portfolio.`,
          portfolioContext: {
            name: profile?.name,
            tagline: profile?.tagline,
            currentMode: activeMode,
          },
        }),
      })
      const data = await res.json()
      const bioMatch = data.reply?.match(/\[ACTION:UPDATE_BIO\]\s*([\s\S]+?)\s*\[\/ACTION\]/i)
      const cleanBio = bioMatch ? bioMatch[1].trim() : data.reply?.replace(/\[ACTION:.*?\]/g, '').trim()

      if (cleanBio) {
        updateProfile({ bio: cleanBio })
      }
    } catch {
      updateProfile({
        bio: `Passionate ${profile?.tagline || 'Software Developer'} dedicated to crafting responsive, user-friendly applications with modern web technologies. Focused on writing clean code, solving real-world problems, and constantly learning new tools.`,
      })
    } finally {
      setIsGeneratingBio(false)
    }
  }

  // 1-Click AI Suggest a Project
  const handleAISuggestProject = async () => {
    setIsGeneratingProject(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Suggest a beginner-to-intermediate web development project with realistic tech stack and impact.`,
          portfolioContext: {
            name: profile?.name,
            tagline: profile?.tagline,
          },
        }),
      })
      const data = await res.json()
      const projMatch = data.reply?.match(/\[ACTION:ADD_PROJECT\]\s*([\s\S]+?)\s*\[\/ACTION\]/i)

      if (projMatch) {
        const parsed = JSON.parse(projMatch[1].trim())
        addProject({
          title: parsed.title || 'Interactive Dashboard',
          tagline: parsed.tagline || 'Full-stack web application with responsive UI',
          description: parsed.description || 'Built an interactive dashboard featuring data visualization, search filters, and dark mode support.',
          tech_stack: parsed.tech_stack || ['React', 'TypeScript', 'Tailwind CSS'],
          github_url: 'https://github.com',
          live_url: 'https://example.com',
          case_study_url: '',
          images: [],
          thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
          is_featured: true,
          display_order: projects.length,
        })
      } else {
        // Fallback project
        addProject({
          title: 'CloudFlow - Task & Analytics Hub',
          tagline: 'Modern productivity web application',
          description: 'Designed a productivity application that streamlines team workflows, tracks project velocity, and generates weekly visual progress reports.',
          tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
          github_url: 'https://github.com',
          live_url: 'https://example.com',
          case_study_url: '',
          images: [],
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
          is_featured: true,
          display_order: projects.length,
        })
      }
    } catch {
      addProject({
        title: 'DevTracker - Developer Portfolio Suite',
        tagline: 'Modern web application built with React',
        description: 'An interactive portfolio application featuring real-time theme customization, responsive layouts, and clean UI components.',
        tech_stack: ['React', 'JavaScript', 'CSS', 'HTML5'],
        github_url: 'https://github.com',
        live_url: 'https://example.com',
        case_study_url: '',
        images: [],
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        is_featured: true,
        display_order: projects.length,
      })
    } finally {
      setIsGeneratingProject(false)
    }
  }

  // Add custom skill
  const handleAddCustomSkill = () => {
    if (!customSkillName.trim()) return
    addSkill({
      name: customSkillName.trim(),
      category: customSkillCategory,
      proficiency: 'advanced',
      display_order: skills.length,
    })
    setCustomSkillName('')
  }

  // Quick add preset skill
  const handleAddPresetSkill = (preset: { name: string; category: any }) => {
    const exists = skills.some((s) => s.name.toLowerCase() === preset.name.toLowerCase())
    if (!exists) {
      addSkill({
        name: preset.name,
        category: preset.category,
        proficiency: 'advanced',
        display_order: skills.length,
      })
    }
  }

  const triggerSaveNotification = () => {
    setSaveNotice(true)
    setTimeout(() => setSaveNotice(false), 2500)
  }

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#0d121f]/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentStep('modes')}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Change Mode ({activeMode.toUpperCase()})</span>
            </button>
            <div className="h-4 w-px bg-slate-700" />
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              Step 2 of 3: Enter Details
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerSaveNotification}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              {saveNotice ? '✓ Saved!' : 'Save Draft'}
            </button>

            <button
              onClick={() => setCurrentStep('portfolio')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Generate My Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* Intro Banner */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Enter Your Portfolio Details</h1>
          <p className="text-sm text-slate-400">
            Fill in your basic information below. All fields are beginner-friendly and come pre-filled with examples. You can edit anything or use our AI buttons to generate content!
          </p>
        </div>

        <div className="space-y-8">
          {/* Card 1: Basic Profile Info */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">1. Basic Information</h3>
                <p className="text-xs text-slate-400">Your name, title, and location</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={profile?.name || ''}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Professional Title / Role <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={profile?.tagline || ''}
                  onChange={(e) => updateProfile({ tagline: e.target.value })}
                  placeholder="e.g. Junior Web Developer, Full Stack Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={socialLinks?.email || ''}
                  onChange={(e) => updateSocialLinks({ email: e.target.value })}
                  placeholder="alex.rivera@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Location / City</span>
                </label>
                <input
                  type="text"
                  value={experience[0]?.location || 'San Francisco, CA / Remote'}
                  onChange={(e) => {
                    if (experience.length > 0) {
                      const updated = [...experience]
                      updated[0].location = e.target.value
                      usePortfolioStore.setState({ experience: updated })
                    }
                  }}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Profile Avatar Picker */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <h3 className="font-bold text-lg text-white mb-1">2. Profile Photo / Avatar</h3>
            <p className="text-xs text-slate-400 mb-4">Click any preset avatar below or paste an image link</p>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              {avatarPresets.map((avatarUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateProfile({ profile_photo: avatarUrl })}
                  className={`relative rounded-full p-0.5 border-2 transition-all hover:scale-105 ${
                    profile?.profile_photo === avatarUrl ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105' : 'border-slate-700'
                  }`}
                >
                  <img src={avatarUrl} alt="Avatar" className="w-14 h-14 rounded-full object-cover" />
                  {profile?.profile_photo === avatarUrl && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Or paste custom image URL:</label>
              <input
                type="text"
                value={profile?.profile_photo || ''}
                onChange={(e) => updateProfile({ profile_photo: e.target.value })}
                placeholder="https://example.com/my-photo.jpg"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Card 3: About You (Bio) with 1-Click AI Polish */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-lg text-white">3. About You (Bio)</h3>
                <p className="text-xs text-slate-400">A short 2-3 sentence introduction</p>
              </div>

              <button
                type="button"
                onClick={handleAIBio}
                disabled={isGeneratingBio}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:text-white hover:bg-cyan-500/30 text-xs font-semibold transition-all disabled:opacity-50"
              >
                {isGeneratingBio ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span>{isGeneratingBio ? 'Generating...' : '✨ AI Polish / Write Bio'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={profile?.bio || ''}
              onChange={(e) => updateProfile({ bio: e.target.value })}
              placeholder="Tell visitors about yourself, your technical interests, and what you love building..."
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 leading-relaxed"
            />
          </div>

          {/* Card 4: Skills Section */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">4. Your Skills</h3>
                <p className="text-xs text-slate-400">Click presets below or type your own skills</p>
              </div>
            </div>

            {/* Quick 1-click popular presets */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Click to add popular skills:
              </label>
              <div className="flex flex-wrap gap-2">
                {popularSkillPresets.map((preset, idx) => {
                  const alreadyAdded = skills.some((s) => s.name.toLowerCase() === preset.name.toLowerCase())
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPresetSkill(preset)}
                      disabled={alreadyAdded}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                        alreadyAdded
                          ? 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-default'
                          : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-cyan-300 active:scale-95'
                      }`}
                    >
                      <span>{alreadyAdded ? '✓' : '+'}</span>
                      <span>{preset.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={customSkillName}
                onChange={(e) => setCustomSkillName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                placeholder="Type custom skill (e.g. Next.js, GraphQL, Flutter)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Active Skills List */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Added Skills ({skills.length}):
              </label>
              <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 min-h-[48px]">
                {skills.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No skills added yet. Click presets above to add some!</span>
                ) : (
                  skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium"
                    >
                      <span>{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => deleteSkill(skill.id)}
                        className="hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Card 5: Projects */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">5. Featured Projects ({projects.length})</h3>
                  <p className="text-xs text-slate-400">Showcase things you've built or worked on</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAISuggestProject}
                  disabled={isGeneratingProject}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:text-white hover:bg-emerald-500/30 text-xs font-semibold transition-all disabled:opacity-50"
                >
                  {isGeneratingProject ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{isGeneratingProject ? 'Drafting...' : '✨ AI Suggest Project'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    addProject({
                      title: 'New Project',
                      tagline: 'Short description of project',
                      description: 'Describe what problem this project solves and the tools you used.',
                      tech_stack: ['HTML', 'CSS', 'JavaScript'],
                      github_url: 'https://github.com',
                      live_url: '',
                      case_study_url: '',
                      images: [],
                      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
                      is_featured: true,
                      display_order: projects.length,
                    })
                  }
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>

            {/* Project List Editor */}
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      Project #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteProject(proj.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                        placeholder="e.g. Weather Forecast App"
                        className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">One-Line Summary</label>
                      <input
                        type="text"
                        value={proj.tagline}
                        onChange={(e) => updateProject(proj.id, { tagline: e.target.value })}
                        placeholder="e.g. Real-time meteorological forecast with radar maps"
                        className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                      placeholder="Explain what the project does and key features..."
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Tech Stack (comma separated)</label>
                      <input
                        type="text"
                        value={(proj.tech_stack || []).join(', ')}
                        onChange={(e) =>
                          updateProject(proj.id, {
                            tech_stack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="React, CSS, API"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">GitHub Link</label>
                      <input
                        type="text"
                        value={proj.github_url || ''}
                        onChange={(e) => updateProject(proj.id, { github_url: e.target.value })}
                        placeholder="https://github.com/username/project"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Live Demo Link</label>
                      <input
                        type="text"
                        value={proj.live_url || ''}
                        onChange={(e) => updateProject(proj.id, { live_url: e.target.value })}
                        placeholder="https://myproject.com"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 6: Social Links */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <h3 className="font-bold text-lg text-white mb-1">6. Social & Web Profiles</h3>
            <p className="text-xs text-slate-400 mb-5">Connect your online profiles</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  <span>GitHub</span>
                </label>
                <input
                  type="text"
                  value={socialLinks?.github || ''}
                  onChange={(e) => updateSocialLinks({ github: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                  <span>LinkedIn</span>
                </label>
                <input
                  type="text"
                  value={socialLinks?.linkedin || ''}
                  onChange={(e) => updateSocialLinks({ linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Personal Website / Blog</span>
                </label>
                <input
                  type="text"
                  value={socialLinks?.website || ''}
                  onChange={(e) => updateSocialLinks({ website: e.target.value })}
                  placeholder="https://mywebsite.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-2xl">
          <div>
            <h4 className="font-bold text-white text-base">Finished Entering Your Details?</h4>
            <p className="text-xs text-slate-400">
              Click below to generate your live portfolio in <strong>{activeMode.toUpperCase()}</strong> mode!
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setCurrentStep('modes')}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
            >
              ← Back to Modes
            </button>

            <button
              onClick={() => setCurrentStep('portfolio')}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Generate My Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-400">
        <p>DevForge • Beginner Details Form • Step 2 of 3</p>
      </footer>
    </div>
  )
}
