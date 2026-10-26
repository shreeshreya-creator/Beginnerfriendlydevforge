import React from 'react'
import { Check, ArrowRight, ArrowLeft, Sun, Moon, Flame, Waves, Sparkles, Monitor, Smartphone } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { ModeId } from '@/types'

export const ModeSelectorPage: React.FC = () => {
  const { activeMode, setActiveMode, setCurrentStep, profile, projects, skills } = usePortfolioStore()

  const modes: {
    id: ModeId
    name: string
    subtitle: string
    icon: React.ComponentType<{ className?: string }>
    themeColor: string
    cardBorder: string
    cardBg: string
    description: string
    paletteSample: string[]
  }[] = [
    {
      id: 'dark',
      name: 'Dark Mode',
      subtitle: 'Midnight Noir',
      icon: Moon,
      themeColor: 'text-cyan-400',
      cardBorder: 'border-cyan-500/50',
      cardBg: 'from-slate-950 via-slate-900 to-cyan-950/40',
      description: 'Sleek obsidian black with cool cyan and indigo accents. High-tech, focused, and optimal for screen viewing.',
      paletteSample: ['#0b0f19', '#131a2a', '#38bdf8', '#6366f1'],
    },
    {
      id: 'light',
      name: 'Light Mode',
      subtitle: 'Clean Minimalist',
      icon: Sun,
      themeColor: 'text-blue-500',
      cardBorder: 'border-blue-400',
      cardBg: 'from-white via-slate-50 to-blue-50/50',
      description: 'Crisp paper white with deep slate typography and classic corporate blue accents. Clean, clear, and professional.',
      paletteSample: ['#ffffff', '#f1f5f9', '#2563eb', '#0f172a'],
    },
    {
      id: 'sun',
      name: 'Sun Mode',
      subtitle: 'Sunset Solar Amber',
      icon: Flame,
      themeColor: 'text-amber-400',
      cardBorder: 'border-amber-500/60',
      cardBg: 'from-amber-950 via-stone-900 to-orange-950/40',
      description: 'Warm golden solar glow with radiant amber gradients and creative energy. Vibrant and welcoming.',
      paletteSample: ['#17120e', '#231a14', '#f59e0b', '#f97316'],
    },
    {
      id: 'c-mode',
      name: 'C Mode',
      subtitle: 'Ocean Cyan Wave',
      icon: Waves,
      themeColor: 'text-cyan-400',
      cardBorder: 'border-cyan-400/60',
      cardBg: 'from-blue-950 via-cyan-950 to-slate-950',
      description: 'Deep oceanic navy with electric cyan waves and turquoise cyber glow. Modern, bold, and energetic.',
      paletteSample: ['#041525', '#0a223d', '#06b6d4', '#14b8a6'],
    },
  ]

  const currentTheme = modes.find((m) => m.id === activeMode) || modes[0]

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0d121f]/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentStep('front')}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </button>
            <div className="h-4 w-px bg-slate-700" />
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              Step 1 of 3: Choose Mode
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentStep('details')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Enter Your Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Click any card below to switch modes immediately</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Choose Your Portfolio Theme Mode
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Select one of the 4 modes below. The theme changes instantly. After selecting, click <strong>"Enter Your Details"</strong> to customize your information!
          </p>
        </div>

        {/* 4 Mode Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {modes.map((mode) => {
            const Icon = mode.icon
            const isSelected = activeMode === mode.id

            return (
              <div
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`relative p-5 rounded-2xl cursor-pointer transition-all border-2 flex flex-col justify-between ${
                  isSelected
                    ? `${mode.cardBorder} bg-gradient-to-b ${mode.cardBg} shadow-xl shadow-cyan-500/10 scale-[1.03]`
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>ACTIVE</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-black/40 border border-white/10 ${mode.themeColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {/* Palette sample preview dots */}
                    <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/30 border border-white/10">
                      {mode.paletteSample.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-0.5">{mode.name}</h3>
                  <div className={`text-xs font-medium mb-3 ${mode.themeColor}`}>{mode.subtitle}</div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {mode.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <button
                    type="button"
                    className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? 'Mode Selected' : 'Choose This Mode'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Live Interactive Preview Box of Selected Theme */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-lg font-bold text-white">
                  Live Preview in <span className="text-cyan-400">{currentTheme.name}</span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                This is a live snapshot of how your portfolio will look in {currentTheme.name}.
              </p>
            </div>

            <button
              onClick={() => setCurrentStep('details')}
              className="self-start sm:self-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Next: Enter Your Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Mockup Frame */}
          <div
            className={`rounded-2xl p-6 sm:p-8 border transition-all ${
              activeMode === 'dark'
                ? 'bg-[#0b0f19] text-slate-100 border-slate-800'
                : activeMode === 'light'
                ? 'bg-white text-slate-900 border-slate-200'
                : activeMode === 'sun'
                ? 'bg-[#17120e] text-[#fef3c7] border-[#452b14]'
                : 'bg-[#041525] text-[#e0f2fe] border-[#113a63]'
            }`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8 text-center md:text-left">
              <img
                src={profile?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={profile?.name || 'Developer'}
                className={`w-24 h-24 rounded-full object-cover border-4 shadow-lg ${
                  activeMode === 'dark'
                    ? 'border-cyan-400'
                    : activeMode === 'light'
                    ? 'border-blue-600'
                    : activeMode === 'sun'
                    ? 'border-amber-400'
                    : 'border-cyan-400'
                }`}
              />
              <div className="flex-1">
                <h4 className="text-2xl font-black">{profile?.name || 'Your Full Name'}</h4>
                <div
                  className={`text-sm font-semibold mb-2 ${
                    activeMode === 'dark'
                      ? 'text-cyan-400'
                      : activeMode === 'light'
                      ? 'text-blue-600'
                      : activeMode === 'sun'
                      ? 'text-amber-400'
                      : 'text-cyan-300'
                  }`}
                >
                  {profile?.tagline || 'Software Developer & Creator'}
                </div>
                <p
                  className={`text-xs max-w-xl ${
                    activeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {profile?.bio || 'Building modern responsive web applications, robust backends, and elegant interfaces.'}
                </p>
              </div>
            </div>

            {/* Mock Projects & Skills Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.slice(0, 3).map((proj, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    activeMode === 'dark'
                      ? 'bg-[#131a2a] border-slate-800'
                      : activeMode === 'light'
                      ? 'bg-slate-50 border-slate-200'
                      : activeMode === 'sun'
                      ? 'bg-[#231a14] border-[#452b14]'
                      : 'bg-[#0a223d] border-[#113a63]'
                  }`}
                >
                  <h5 className="font-bold text-sm mb-1">{proj.title}</h5>
                  <p
                    className={`text-xs line-clamp-2 mb-3 ${
                      activeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    {proj.description || proj.tagline}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(proj.tech_stack || ['React', 'TypeScript']).slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          activeMode === 'dark'
                            ? 'bg-cyan-500/15 text-cyan-300'
                            : activeMode === 'light'
                            ? 'bg-blue-100 text-blue-700'
                            : activeMode === 'sun'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation Step Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-xs">
              ✓
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Mode Selected: {currentTheme.name}</div>
              <div className="text-[11px] text-slate-400">Ready to personalize your portfolio information?</div>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep('details')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>Next: Enter Your Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-400">
        <p>DevForge • Mode Selector • Step 1 of 3</p>
      </footer>
    </div>
  )
}
