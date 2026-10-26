import React, { useState } from 'react'
import {
  Sparkles,
  Sliders,
  Check,
  Send,
  Zap,
  Target,
  FileCode,
  Award,
  BookOpen,
  RefreshCw,
  Copy,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { AITone } from '@/types'

export const AIStudioPanel: React.FC = () => {
  const {
    aiConfig,
    setAIConfig,
    generateWithAI,
    isAIGenerating,
    profile,
    projects,
    skills,
    experience,
    applyAISuggestion
  } = usePortfolioStore()

  const [activeSubTab, setActiveSubTab] = useState<'generators' | 'config' | 'audit'>('generators')
  const [customPrompt, setCustomPrompt] = useState('')
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null)
  const [auditResult, setAuditResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [appliedField, setAppliedField] = useState<string | null>(null)

  // Tone presets
  const tones: { id: AITone; label: string; desc: string; icon: string }[] = [
    { id: 'silicon_valley', label: 'Silicon Valley Lead', desc: 'Impact metrics, scalability, business outcomes', icon: '🚀' },
    { id: 'swiss_minimal', label: 'Swiss Minimalist', desc: 'Understated elegance, zero buzzwords, high signal', icon: '🏛️' },
    { id: 'systems_architect', label: 'Systems Architect', desc: 'Distributed consensus, p99 latency, fault tolerance', icon: '⚡' },
    { id: 'cyberpunk', label: 'Cyberpunk / Hacker', desc: 'Low-level protocols, terminal aesthetics, kernel depth', icon: '👾' },
    { id: 'indie_hacker', label: 'Indie Product Builder', desc: 'High ship velocity, user acquisition, full-stack reach', icon: '🛠️' },
  ]

  const handleCopy = () => {
    if (!generatedOutput) return
    navigator.clipboard.writeText(generatedOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerateBio = async () => {
    try {
      const res = await generateWithAI('generate_bio', customPrompt || undefined)
      setGeneratedOutput(res)
    } catch (e) {
      console.error(e)
    }
  }

  const handleGenerateProject = async () => {
    try {
      const res = await generateWithAI('generate_project', customPrompt || 'Distributed event stream processor')
      setGeneratedOutput(res)
    } catch (e) {
      console.error(e)
    }
  }

  const handleAudit = async () => {
    try {
      const res = await generateWithAI('audit_portfolio')
      setAuditResult(res)
    } catch (e) {
      console.error(e)
    }
  }

  const extractParsedFields = (text: string) => {
    const taglineMatch = text.match(/TAGLINE:\s*(.+)/i)
    const bioMatch = text.match(/BIO:\s*([\s\S]+)/i)
    return {
      tagline: taglineMatch ? taglineMatch[1].trim() : null,
      bio: bioMatch ? bioMatch[1].trim() : null,
    }
  }

  const parsed = generatedOutput ? extractParsedFields(generatedOutput) : { tagline: null, bio: null }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 font-sans text-slate-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#141824] via-[#191f30] to-[#121622] border border-[#21283b] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              AI Configuration & Engineering Copilot
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Gemini 3.8 Flash
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Developer Persona & Prompt Synthesis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Fine-tune how AI articulates your engineering achievements, optimizes project case studies, and conducts recruiter peer audits.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1.5 bg-[#090b10] p-1.5 rounded-xl border border-[#21283b] self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('generators')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeSubTab === 'generators'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Generators
          </button>
          <button
            onClick={() => setActiveSubTab('config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeSubTab === 'config'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Model Config
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeSubTab === 'audit'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Portfolio Audit
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'config' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tone Selector */}
          <div className="md:col-span-2 space-y-4 bg-[#141824] border border-[#21283b] p-6 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Engineering Persona & Writing Tone
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select the voice that aligns with your engineering identity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {tones.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setAIConfig({ tone: t.id })}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    aiConfig.tone === t.id
                      ? 'bg-cyan-950/30 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-[#0f121a] border-[#21283b] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{t.icon} <span className="font-bold ml-1">{t.label}</span></span>
                    {aiConfig.tone === t.id && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{t.desc}</p>
                </div>
              ))}
            </div>

            {/* Target Role & Custom Guidelines */}
            <div className="space-y-3 pt-3 border-t border-[#21283b]">
              <div>
                <label className="text-xs font-mono font-medium text-slate-300 block mb-1">
                  Target Engineering Role / Level
                </label>
                <input
                  type="text"
                  value={aiConfig.targetRole}
                  onChange={(e) => setAIConfig({ targetRole: e.target.value })}
                  placeholder="e.g. Staff Distributed Systems Engineer, Senior Full-Stack Architect"
                  className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-slate-300 block mb-1">
                  Custom Generation Directives
                </label>
                <textarea
                  rows={3}
                  value={aiConfig.customInstructions}
                  onChange={(e) => setAIConfig({ customInstructions: e.target.value })}
                  placeholder="e.g. Always emphasize latency benchmarks, microservice decomposition, and high-concurrency Rust/Go implementations."
                  className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Model Controls */}
          <div className="space-y-4 bg-[#141824] border border-[#21283b] p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  Inference Parameters
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Adjust Gemini 3.8 Flash behavior</p>
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Creativity (Temp):</span>
                  <span className="text-cyan-400">{aiConfig.temperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={aiConfig.temperature}
                  onChange={(e) => setAIConfig({ temperature: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Rigid / Factual</span>
                  <span>Creative</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-3 border-t border-[#21283b]">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-300">Include Metric Benchmarks</span>
                  <input
                    type="checkbox"
                    checked={aiConfig.includeMetrics}
                    onChange={(e) => setAIConfig({ includeMetrics: e.target.checked })}
                    className="w-4 h-4 rounded accent-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-300">Concise / High Density</span>
                  <input
                    type="checkbox"
                    checked={aiConfig.conciseMode}
                    onChange={(e) => setAIConfig({ conciseMode: e.target.checked })}
                    className="w-4 h-4 rounded accent-cyan-500"
                  />
                </label>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 text-[11px] text-purple-300 flex items-start gap-2">
              <Zap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                Parameters are automatically persisted and broadcast across all connected collaborative sessions.
              </span>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'generators' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generator Action Cards */}
          <div className="space-y-4">
            {/* Bio & Tagline */}
            <div className="p-5 rounded-2xl bg-[#141824] border border-[#21283b] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Synthesize Bio & Tagline</h3>
                    <p className="text-[11px] text-slate-400">Generates punchy elevator pitch & headline</p>
                  </div>
                </div>
                <button
                  onClick={handleGenerateBio}
                  disabled={isAIGenerating}
                  className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 disabled:opacity-40 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAIGenerating ? 'animate-spin' : ''}`} />
                  <span>Generate</span>
                </button>
              </div>

              <input
                type="text"
                placeholder="Optional focal points (e.g. Distributed DBs, Raft, 10M qps)"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Project Case Study */}
            <div className="p-5 rounded-2xl bg-[#141824] border border-[#21283b] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Generate Project Architecture</h3>
                    <p className="text-[11px] text-slate-400">Deep-dive Problem, Architecture & Impact</p>
                  </div>
                </div>
                <button
                  onClick={handleGenerateProject}
                  disabled={isAIGenerating}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-600/20 disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Transforms raw notes into a crisp engineering case study with architecture tags and metrics.
              </p>
            </div>

            {/* Quick Skills Optimizer */}
            <div className="p-5 rounded-2xl bg-[#141824] border border-[#21283b] space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Active Tech Stack Profile</h3>
                  <p className="text-[11px] text-slate-400">
                    {skills.length} skills classified across Languages, Backend, and DevOps
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.slice(0, 8).map((s) => (
                  <span key={s.id} className="px-2 py-0.5 rounded bg-[#090b10] border border-[#21283b] text-[10px] font-mono text-cyan-300">
                    {s.name}
                  </span>
                ))}
                {skills.length > 8 && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
                    +{skills.length - 8} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Generated Output Preview Box */}
          <div className="bg-[#141824] border border-[#21283b] p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#21283b] mb-4">
                <span className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  Copilot Synthesis Output
                </span>
                {generatedOutput && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                )}
              </div>

              {isAIGenerating ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                  <p className="text-xs font-mono text-cyan-300">
                    Synthesizing with Gemini 3.8 Flash ({aiConfig.tone})...
                  </p>
                </div>
              ) : generatedOutput ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#090b10] border border-[#21283b] font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                    {generatedOutput}
                  </div>

                  {/* One-Click Apply Controls */}
                  {parsed.tagline && (
                    <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-cyan-400 font-bold block">Apply Tagline</span>
                        <span className="text-slate-300 text-[11px] line-clamp-1">{parsed.tagline}</span>
                      </div>
                      <button
                        onClick={() => {
                          applyAISuggestion('tagline', parsed.tagline)
                          setAppliedField('tagline')
                          setTimeout(() => setAppliedField(null), 2000)
                        }}
                        className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
                      >
                        {appliedField === 'tagline' ? 'Applied!' : 'Apply'}
                      </button>
                    </div>
                  )}

                  {parsed.bio && (
                    <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-purple-400 font-bold block">Apply Bio</span>
                        <span className="text-slate-300 text-[11px] line-clamp-1">{parsed.bio}</span>
                      </div>
                      <button
                        onClick={() => {
                          applyAISuggestion('bio', parsed.bio)
                          setAppliedField('bio')
                          setTimeout(() => setAppliedField(null), 2000)
                        }}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-all"
                      >
                        {appliedField === 'bio' ? 'Applied!' : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center space-y-2 text-slate-500">
                  <Sparkles className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs font-medium">Click any generator to synthesize recommendations</p>
                  <p className="text-[11px]">Responses will appear here with one-click portfolio application</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'audit' && (
        <div className="bg-[#141824] border border-[#21283b] p-6 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Portfolio Readiness & Recruiter Conversion Audit
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluates clarity, metric density, project architecture, and aesthetic resonance.
              </p>
            </div>
            <button
              onClick={handleAudit}
              disabled={isAIGenerating}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 disabled:opacity-40 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAIGenerating ? 'animate-spin' : ''}`} />
              <span>Run Comprehensive Audit</span>
            </button>
          </div>

          {auditResult ? (
            <div className="p-5 rounded-xl bg-[#090b10] border border-[#21283b] font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {auditResult}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-[#090b10] rounded-xl border border-dashed border-[#21283b]">
              <Award className="w-10 h-10 text-emerald-400/50 mx-auto" />
              <p className="text-xs font-medium text-slate-300">
                Click "Run Comprehensive Audit" to analyze your developer portfolio
              </p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Gemini will score your technical depth, verify high-demand skills, and suggest targeted tweaks for maximum interview yield.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
