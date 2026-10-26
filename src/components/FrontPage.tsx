import React from 'react'
import { Sparkles, ArrowRight, Palette, UserCheck, Download, CheckCircle2, ShieldCheck, Sun, Moon, Waves, Flame } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { ModeId } from '@/types'

export const FrontPage: React.FC = () => {
  const { setCurrentStep, setActiveMode, activeMode, profile } = usePortfolioStore()

  const handleStart = (selectedMode?: ModeId) => {
    if (selectedMode) {
      setActiveMode(selectedMode)
    }
    setCurrentStep('modes')
  }

  const modesList = [
    {
      id: 'dark' as ModeId,
      name: 'Dark Mode',
      subtitle: 'Midnight Noir',
      icon: Moon,
      colors: 'from-slate-900 to-cyan-950 border-cyan-500/40 text-cyan-300',
      description: 'Sleek, high-contrast obsidian dark palette. Modern, focused, and easy on the eyes.',
    },
    {
      id: 'light' as ModeId,
      name: 'Light Mode',
      subtitle: 'Clean Minimalist',
      icon: Sun,
      colors: 'from-slate-100 to-blue-50 border-blue-400 text-blue-600',
      description: 'Crisp paper white with deep typography and clean executive blue accents.',
    },
    {
      id: 'sun' as ModeId,
      name: 'Sun Mode',
      subtitle: 'Sunset Solar Amber',
      icon: Flame,
      colors: 'from-amber-950 to-orange-950 border-amber-500/40 text-amber-400',
      description: 'Warm golden solar glow with radiant terracotta gradients and creative energy.',
    },
    {
      id: 'c-mode' as ModeId,
      name: 'C Mode',
      subtitle: 'Ocean Cyan Wave',
      icon: Waves,
      colors: 'from-cyan-950 to-blue-950 border-cyan-400/40 text-cyan-400',
      description: 'Deep oceanic navy with vivid neon turquoise waves and cyber aesthetics.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#0d121f]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 font-black text-white text-base">
              DF
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                DevForge
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                Beginner Friendly
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleStart()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Build Your Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 sm:py-20 flex flex-col items-center text-center">
        {/* Friendly Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium mb-6">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>No Coding Required • 100% Beginner Friendly</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl leading-[1.15] mb-6">
          Build Your Professional{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Portfolio
          </span>{' '}
          in Minutes
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Create, customize, and download your personal developer portfolio without writing any code. Choose from 4 beautiful theme modes, enter your basic details with AI helpers, and save your portfolio file directly to your system.
        </p>

        {/* Big Prominent Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button
            onClick={() => handleStart()}
            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-cyan-500/30 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Start Your Portfolio</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setCurrentStep('details')}
            className="px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white font-semibold text-sm transition-colors"
          >
            Or Jump Straight to Enter Details
          </button>
        </div>

        {/* 3 Easy Steps Process Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-16">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
              <Palette className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Step 1</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">Choose Your Mode</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Pick from 4 distinctive visual themes: Dark Mode, Light Mode, Sun Mode, or Ocean C-Mode. Switch themes anytime with a single click.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-blue-400 uppercase font-semibold">Step 2</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">Enter Your Details</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Guided, friendly inputs for your bio, skills, and projects. Stuck? Our built-in AI assistant will polish your bio and suggest project ideas in 1 click!
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
              <Download className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">Step 3</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-2">Analyze & Save to Files</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Check your automated Portfolio Readiness Percentage score, then hit "Save to Files" to download a standalone HTML file ready for offline use or hosting.
            </p>
          </div>
        </div>

        {/* 4 Modes Interactive Teaser */}
        <div className="w-full pt-8 border-t border-slate-800/80">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">4 Modes Ready for You</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Click any mode below to start with that theme immediately
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {modesList.map((m) => {
              const Icon = m.icon
              const isSelected = activeMode === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => handleStart(m.id)}
                  className={`p-5 rounded-2xl text-left transition-all border group bg-gradient-to-b ${m.colors} ${
                    isSelected ? 'ring-2 ring-cyan-400 scale-[1.02]' : 'hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/30 border border-white/10 text-white/80">
                      Select Mode
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-white">{m.name}</h4>
                  <div className="text-xs opacity-80 mb-2 font-medium">{m.subtitle}</div>
                  <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-400">
        <p>DevForge • The Beginner-Friendly Portfolio Builder • Save your portfolio directly to your files</p>
      </footer>
    </div>
  )
}
