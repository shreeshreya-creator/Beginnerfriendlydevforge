import React, { useState, useEffect } from 'react'
import {
  Code,
  Laptop,
  Smartphone,
  Tablet,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Users,
  FileCode,
  FileJson,
  Layers,
  Sparkles
} from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { MonolithTemplate } from '@/templates/monolith/MonolithTemplate'
import { TerminalTemplate } from '@/templates/terminal/TerminalTemplate'
import { LightModernTemplate } from '@/templates/light-modern/LightModernTemplate'
import type { PortfolioData, TemplateId } from '@/types'

export const CollabSplitCodeView: React.FC = () => {
  const {
    profile,
    socialLinks,
    experience,
    projects,
    skills,
    education,
    selectedTemplate,
    collaborators,
    previewDevice,
    setPreviewDevice
  } = usePortfolioStore()

  const [activeFile, setActiveFile] = useState<'template' | 'json' | 'theme'>('template')
  const [copiedCode, setCopiedCode] = useState(false)
  const [liveEditLine, setLiveEditLine] = useState(42)

  // Construct current full portfolio data
  const currentPortfolioData: PortfolioData = {
    profile: profile!,
    social_links: socialLinks,
    experience,
    projects,
    skills,
    education,
  }

  // Simulated peer cursor animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveEditLine((prev) => (prev > 60 ? 25 : prev + 3))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Generated code string
  const templateCodeString = `// @license DevForge Studio v2.4 (Real-Time Collab Mode)
// Synchronized with branch main / ${profile?.username || 'alexrivera'}
import React from 'react'
import { motion } from 'framer-motion'
import type { PortfolioData } from '@/types'

export function ${selectedTemplate === 'monolith' ? 'MonolithTemplate' : selectedTemplate === 'terminal' ? 'TerminalTemplate' : 'LightModernTemplate'}({ data }: { data: PortfolioData }) {
  const { profile, experience, projects, skills, social_links } = data
  const accentColor = profile.accent_color || '#00d2ff'

  return (
    <div className="min-h-screen bg-[#080a0f] text-white font-sans antialiased">
      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-6xl font-black tracking-tight uppercase">
          {profile.name}
        </h1>
        <p className="text-xl text-cyan-400 font-mono mt-3">
          {profile.tagline}
        </p>
        <p className="text-slate-400 mt-4 max-w-2xl leading-relaxed">
          {profile.bio}
        </p>
      </header>

      {/* Featured Engineering Projects (${projects.length} loaded) */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold tracking-tight mb-8">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <article key={project.id} className="p-6 rounded-2xl bg-[#121622] border border-[#21283b]">
              <h3 className="text-lg font-bold">{project.title}</h3>
              <p className="text-xs text-slate-400 mt-2">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {project.tech_stack.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 text-[10px] font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}`

  const jsonCodeString = JSON.stringify(currentPortfolioData, null, 2)

  const activeCode = activeFile === 'template' ? templateCodeString : jsonCodeString

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col font-sans select-none overflow-hidden bg-[#090b10]">
      {/* Split Control Header */}
      <div className="px-4 py-2 border-b border-[#21283b] bg-[#0c0e14] flex items-center justify-between text-xs">
        {/* File tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveFile('template')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-mono text-[11px] transition-all border-b-2 ${
              activeFile === 'template'
                ? 'bg-[#141824] text-cyan-400 border-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}Template.tsx</span>
          </button>

          <button
            onClick={() => setActiveFile('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-mono text-[11px] transition-all border-b-2 ${
              activeFile === 'json'
                ? 'bg-[#141824] text-purple-400 border-purple-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>portfolio_data.json</span>
          </button>
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#141824] p-1 rounded-lg border border-[#21283b]">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
              title="Desktop viewport"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`p-1.5 rounded ${previewDevice === 'tablet' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
              title="Tablet viewport"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
              title="Mobile viewport"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#141824] hover:bg-[#1c2233] border border-[#21283b] rounded-md text-slate-300 text-[11px] font-mono transition-colors"
          >
            {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Split Panes */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Pane: Collaborative Code Editor */}
        <div className="h-full flex flex-col bg-[#0b0d13] border-r border-[#21283b] overflow-hidden">
          {/* Editor Sub-Header with multiplayer cursor tag */}
          <div className="px-4 py-1.5 bg-[#0e111a] border-b border-[#21283b] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              TypeScript React JSX • 2 space indent • UTF-8
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Marcus Chen editing Ln {liveEditLine}
              </span>
            </div>
          </div>

          {/* Code Text with Line Numbers & Cursor Simulation */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed relative">
            <div className="relative">
              {/* Simulated active collaborator cursor badge */}
              <div
                className="absolute left-48 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500 text-white text-[9px] font-bold shadow-md transition-all duration-700 pointer-events-none"
                style={{ top: `${liveEditLine * 1.5}rem` }}
              >
                <span>Elena Vance</span>
              </div>

              <pre className="whitespace-pre overflow-x-auto text-[12px] font-mono">
                {activeCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Pane: Live Rendered Portfolio Preview */}
        <div className="h-full flex flex-col bg-[#06080d] overflow-hidden items-center justify-center p-2 sm:p-4">
          <div
            className={`h-full bg-black rounded-2xl overflow-hidden border border-[#21283b] shadow-2xl transition-all duration-300 flex flex-col ${
              previewDevice === 'desktop'
                ? 'w-full'
                : previewDevice === 'tablet'
                ? 'w-[768px] max-w-full'
                : 'w-[375px] max-w-full'
            }`}
          >
            {/* Mock Browser Frame */}
            <div className="px-3 py-2 bg-[#121622] border-b border-[#21283b] flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-3 py-0.5 bg-[#090b10] rounded text-[10px] text-slate-400 border border-[#21283b] max-w-xs truncate">
                https://{profile?.custom_domain || `${profile?.username || 'alex'}.devforge.studio`}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-cyan-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Live Sync
              </div>
            </div>

            {/* Rendered Template */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
              {selectedTemplate === 'monolith' ? (
                <MonolithTemplate data={currentPortfolioData} />
              ) : selectedTemplate === 'terminal' ? (
                <TerminalTemplate data={currentPortfolioData} />
              ) : (
                <LightModernTemplate data={currentPortfolioData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
