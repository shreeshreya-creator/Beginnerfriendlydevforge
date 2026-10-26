import React, { useState } from 'react'
import {
  Users,
  Sparkles,
  GitBranch,
  Eye,
  Download,
  Share2,
  Check,
  ChevronDown,
  Circle,
  Wifi,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  MessageSquare,
  HardDrive,
  Bot
} from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'

interface CollabHeaderProps {
  onOpenInvite: () => void
  onOpenComments: () => void
  onOpenChat: () => void
  onOpenFileHub: () => void
  onExportZip: () => void
  isExporting?: boolean
}

export const CollabHeader: React.FC<CollabHeaderProps> = ({
  onOpenInvite,
  onOpenComments,
  onOpenChat,
  onOpenFileHub,
  onExportZip,
  isExporting = false,
}) => {
  const {
    collaborators,
    comments,
    activeStudioTab,
    setActiveStudioTab,
    profile,
    selectedTemplate,
    collabRoomId,
  } = usePortfolioStore()

  const [copiedLink, setCopiedLink] = useState(false)
  const unresolvedComments = comments.filter((c) => !c.resolved).length

  const handleCopyShare = () => {
    const url = `${window.location.origin}/dashboard?room=${collabRoomId}`
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  return (
    <header className="sticky top-0 z-40 bg-[#0c0e14]/95 backdrop-blur-md border-b border-[#21283b] px-4 py-2.5 flex items-center justify-between text-xs select-none">
      {/* Left: Branding, Repo Breadcrumb & Active Mode */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pr-3 border-r border-[#21283b]">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-mono font-black text-white text-sm shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            /D
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-white">
              <span>DEVFORGE</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-normal">
                STUDIO
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <span>mode:</span>
              <span className="text-cyan-300 font-bold uppercase">{selectedTemplate}</span>
            </div>
          </div>
        </div>

        {/* Git Branch & Sync */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#141824] border border-[#21283b] text-slate-300 font-mono">
          <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-200 font-medium">main</span>
          <span className="text-emerald-400 text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            synced
          </span>
        </div>
      </div>

      {/* Center: Studio Navigation Tabs */}
      <div className="flex items-center gap-1 bg-[#121622] p-1 rounded-lg border border-[#21283b]">
        <button
          onClick={() => setActiveStudioTab('builder')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            activeStudioTab === 'builder'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Builder</span>
        </button>

        <button
          onClick={() => setActiveStudioTab('ide')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            activeStudioTab === 'ide'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Split Code IDE</span>
        </button>

        <button
          onClick={() => setActiveStudioTab('ai')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            activeStudioTab === 'ai'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">AI Config</span>
        </button>

        <button
          onClick={() => setActiveStudioTab('collab')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            activeStudioTab === 'collab'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Peer Review</span>
          {unresolvedComments > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
              {unresolvedComments}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveStudioTab('preview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            activeStudioTab === 'preview'
              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Preview</span>
        </button>
      </div>

      {/* Right: AI Chat Button, Data Hub & Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Open AI Chat Box Button */}
        <button
          onClick={onOpenChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-300 font-bold transition-all shadow-sm"
          title="Open DevForge AI Chat Box"
        >
          <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden md:inline font-mono">AI Chat Box</span>
        </button>

        {/* Data & File Import Hub Button */}
        <button
          onClick={onOpenFileHub}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1a2133] border border-[#21283b] text-slate-300 hover:text-white transition-all font-mono"
          title="Import files or save system data"
        >
          <HardDrive className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline text-[11px]">Data Hub</span>
        </button>

        {/* Real-Time Collaborators Avatar Stack */}
        <div
          onClick={onOpenInvite}
          className="hidden lg:flex items-center gap-1.5 bg-[#141824] hover:bg-[#1a2133] border border-[#21283b] hover:border-cyan-500/40 px-2 py-1 rounded-full cursor-pointer transition-all shadow-sm"
          title="Manage real-time collaborators"
        >
          <div className="flex -space-x-1.5 overflow-hidden py-0.5">
            {collaborators.map((c) => (
              <img
                key={c.id}
                src={c.avatar}
                alt={c.name}
                className="w-4 h-4 rounded-full ring-1 ring-[#0c0e14] object-cover bg-slate-800"
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-emerald-400">
            {collaborators.length} Live
          </span>
        </div>

        {/* Export ZIP */}
        <button
          onClick={onExportZip}
          disabled={isExporting}
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 text-[11px] uppercase tracking-wider"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isExporting ? 'Packaging...' : 'Export'}</span>
        </button>
      </div>
    </header>
  )
}
