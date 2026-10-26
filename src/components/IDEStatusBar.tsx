import React from 'react'
import {
  GitBranch,
  Wifi,
  Sparkles,
  Users,
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'

export const IDEStatusBar: React.FC = () => {
  const {
    collaborators,
    activeSection,
    activeStudioTab,
    selectedTemplate,
    isCollabLive
  } = usePortfolioStore()

  return (
    <footer className="h-6 bg-[#090b10] border-t border-[#21283b] px-3 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none shrink-0 z-30">
      {/* Left items */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-cyan-400 font-medium">
          <GitBranch className="w-3 h-3" />
          <span>main*</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
          <Users className="w-3 h-3 text-emerald-400" />
          <span>{collaborators.length} Peers Active</span>
        </div>

        <div className="hidden md:flex items-center gap-1 text-slate-400">
          <span>section:</span>
          <span className="text-cyan-300 font-semibold">#{activeSection}</span>
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span className="hidden sm:inline text-cyan-200">Gemini 3.8 Flash</span>
        </div>

        <div className="flex items-center gap-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden md:inline">Synced (0ms)</span>
        </div>

        <div className="hidden lg:flex items-center gap-1 text-slate-500">
          <span>UTF-8</span>
          <span>•</span>
          <span>React 19 / Vite</span>
        </div>
      </div>
    </footer>
  )
}
