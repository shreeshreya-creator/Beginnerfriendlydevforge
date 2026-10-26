import React from 'react'
import {
  Palette,
  Sliders,
  Type,
  Layout,
  Check,
  Sparkles,
  Shield,
  Layers,
  Terminal,
  Brush
} from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { TemplateId } from '@/types'

const presetColors = [
  { name: 'Cyan', hex: '#00d2ff' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Monochrome', hex: '#ffffff' },
]

export const ModeCustomizer: React.FC = () => {
  const {
    profile,
    selectedTemplate,
    setTemplate,
    updateProfile
  } = usePortfolioStore()

  const modes: { id: TemplateId; name: string; tag: string; icon: React.ElementType; desc: string }[] = [
    {
      id: 'professional',
      name: 'Professional / Enterprise',
      tag: 'Executive',
      icon: Shield,
      desc: 'High-signal technical architecture with quantifiable metrics & leadership milestones',
    },
    {
      id: 'monolith',
      name: 'Minimalist Monolith',
      tag: 'Swiss Editorial',
      icon: Layers,
      desc: 'Clean typography, distraction-free reading, and elegant whitespace discipline',
    },
    {
      id: 'terminal',
      name: 'Terminal / Hacker',
      tag: 'CLI & Systems',
      icon: Terminal,
      desc: 'Authentic developer command-line interface with interactive bash commands',
    },
    {
      id: 'creative',
      name: 'Creative Studio',
      tag: 'Agency / Visual',
      icon: Brush,
      desc: 'Vibrant modern aesthetic with bento box galleries and rich media spotlights',
    },
  ]

  const currentAccent = profile?.accent_color || '#00d2ff'

  return (
    <div className="p-5 rounded-2xl bg-[#141824] border border-[#21283b] space-y-6 shadow-xl font-sans text-slate-200">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-tight font-mono">
            Mode Configuration & Style Engine
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Switch between 4 professional portfolio modes and modify their parameters in real-time.
        </p>
      </div>

      {/* 4 Modes Grid */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-medium text-slate-300 block">
          Select Active Portfolio Mode:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {modes.map((mode) => {
            const Icon = mode.icon
            const isSelected = selectedTemplate === mode.id
            return (
              <div
                key={mode.id}
                onClick={() => setTemplate(mode.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#182033] to-[#121622] border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-[#090b10] border-[#21283b] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {mode.tag}
                    </span>
                  </div>
                  <h3 className={`text-xs font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {mode.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {mode.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#21283b] flex items-center justify-between text-[10px] font-mono">
                  <span className={isSelected ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                    {isSelected ? '● Active Mode' : 'Click to activate'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Accent Color Customizer */}
      <div className="space-y-3 pt-3 border-t border-[#21283b]">
        <label className="text-xs font-mono font-medium text-slate-300 block">
          Accent Tone Palette:
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {presetColors.map((color) => (
            <button
              key={color.hex}
              onClick={() => updateProfile({ accent_color: color.hex })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                currentAccent === color.hex
                  ? 'bg-white/10 border-white text-white font-bold'
                  : 'bg-[#090b10] border-[#21283b] text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.hex }} />
              <span>{color.name}</span>
              {currentAccent === color.hex && <Check className="w-3 h-3 text-cyan-400" />}
            </button>
          ))}

          {/* Custom Hex input */}
          <div className="flex items-center gap-1 bg-[#090b10] border border-[#21283b] px-2 py-1 rounded-xl">
            <span className="text-[11px] font-mono text-slate-500">Hex:</span>
            <input
              type="text"
              value={currentAccent}
              onChange={(e) => updateProfile({ accent_color: e.target.value })}
              className="w-20 bg-transparent text-xs font-mono text-white focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
