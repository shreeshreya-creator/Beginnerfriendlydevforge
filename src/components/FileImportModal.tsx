import React, { useState } from 'react'
import {
  Upload,
  Download,
  FileJson,
  FileText,
  X,
  Check,
  Save,
  RefreshCw,
  HardDrive,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import JSZip from 'jszip'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { PortfolioData } from '@/types'

interface FileImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export const FileImportModal: React.FC<FileImportModalProps> = ({ isOpen, onClose }) => {
  const {
    profile,
    socialLinks,
    experience,
    projects,
    skills,
    education,
    updateProfile,
    broadcastState,
    resetToDefaults
  } = usePortfolioStore()

  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'presets'>('import')
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)

  if (!isOpen) return null

  const currentData: PortfolioData = {
    profile: profile!,
    social_links: socialLinks,
    experience,
    projects,
    skills,
    education,
  }

  // Handle File Upload (JSON or Markdown)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content)
          if (parsed.profile) {
            localStorage.setItem('devforge_portfolio_v2', JSON.stringify(parsed))
            window.location.reload()
            return
          }
        } else {
          // Parse Markdown / Text
          const lines = content.split('\n')
          const titleLine = lines.find((l) => l.startsWith('# '))?.replace('# ', '').trim()
          if (titleLine) {
            updateProfile({ name: titleLine })
          }
          setImportStatus('Successfully extracted metadata from text file!')
          setTimeout(() => setImportStatus(null), 3000)
        }
      } catch (err: any) {
        setImportStatus('Failed to parse file: ' + err.message)
      }
    }
    reader.readAsText(file)
  }

  // Handle Manual Save to System
  const handleSaveToSystem = () => {
    try {
      localStorage.setItem('devforge_portfolio_v2', JSON.stringify(currentData))
      broadcastState()
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      setLastSavedTime(timeStr)
      setImportStatus(`All portfolio data successfully saved to system storage at ${timeStr}!`)
      setTimeout(() => setImportStatus(null), 3500)
    } catch (err: any) {
      setImportStatus('Error saving: ' + err.message)
    }
  }

  // Download JSON
  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(currentData, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile?.username || 'developer'}-devforge-data.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Download Markdown Resume
  const handleDownloadMarkdown = () => {
    let md = `# ${profile?.name}\n`
    md += `**${profile?.tagline}**\n\n`
    md += `${profile?.bio}\n\n`
    md += `## Projects\n`
    projects.forEach((p) => {
      md += `### ${p.title}\n${p.tagline}\n${p.description}\n*Tech Stack*: ${p.tech_stack.join(', ')}\n\n`
    })
    md += `## Experience\n`
    experience.forEach((e) => {
      md += `### ${e.position} - ${e.company}\n${e.start_date} - ${e.is_current ? 'Present' : e.end_date}\n${e.description}\n\n`
    })
    md += `## Skills\n`
    md += skills.map((s) => s.name).join(', ') + '\n'

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile?.username || 'developer'}-resume.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Download Full ZIP
  const handleDownloadZip = async () => {
    setIsExporting(true)
    try {
      const zip = new JSZip()
      zip.file('portfolio-data.json', JSON.stringify(currentData, null, 2))
      zip.file('package.json', JSON.stringify({
        name: `${profile?.username || 'portfolio'}-site`,
        version: '1.0.0',
        dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0', 'framer-motion': '^12.0.0' }
      }, null, 2))
      zip.file('README.md', `# ${profile?.name} Portfolio\nExported from DevForge Studio.`)

      const content = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `${profile?.username || 'devforge'}-source.zip`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#141824] border border-[#21283b] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#21283b] flex items-center justify-between bg-[#0e111a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                System Data & File Hub
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Import, save, and export your portfolio assets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="px-6 py-2 border-b border-[#21283b] bg-[#0c0e14] flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded-lg font-mono transition-colors ${
              activeTab === 'import' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Import File
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 rounded-lg font-mono transition-colors ${
              activeTab === 'export' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Save & Export
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg font-mono transition-colors ${
              activeTab === 'presets' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Role Presets
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {importStatus && (
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800 text-xs text-cyan-300 font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#21283b] hover:border-cyan-500/50 rounded-2xl p-8 text-center space-y-3 transition-colors bg-[#090b10]">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Import JSON or Resume File</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload an exported <code className="text-cyan-400 font-mono">portfolio.json</code>, resume markdown, or text file.
                  </p>
                </div>
                <label className="inline-block px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-all">
                  Browse File
                  <input
                    type="file"
                    accept=".json,.md,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-[11px] text-slate-400 font-mono bg-[#090b10] p-3 rounded-xl border border-[#21283b] space-y-1">
                <span className="text-white font-bold block">Supported formats:</span>
                <p>• DevForge JSON export (.json) — Replaces entire state instantly</p>
                <p>• Plain text or Markdown resume (.md, .txt) — Extracts headlines</p>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              {/* Quick Save to Local System Button */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-800/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Save className="w-3.5 h-3.5 text-cyan-400" />
                    Save Changes to System Storage
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Persists all active edits into browser storage and broadcasts to open tabs.
                  </p>
                  {lastSavedTime && (
                    <span className="text-[10px] font-mono text-emerald-400 block mt-1">
                      Last saved: {lastSavedTime}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSaveToSystem}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20"
                >
                  Save Now
                </button>
              </div>

              {/* Download actions */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono font-medium text-slate-300 block">Export Options</span>

                <div
                  onClick={handleDownloadJSON}
                  className="p-3.5 rounded-xl bg-[#090b10] border border-[#21283b] hover:border-cyan-500/40 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileJson className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Full JSON State (portfolio.json)</div>
                      <div className="text-[10px] text-slate-400 font-mono">Complete structured database snapshot</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </div>

                <div
                  onClick={handleDownloadMarkdown}
                  className="p-3.5 rounded-xl bg-[#090b10] border border-[#21283b] hover:border-purple-500/40 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Markdown Resume (resume.md)</div>
                      <div className="text-[10px] text-slate-400 font-mono">Formatted for GitHub profiles or PDF printing</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </div>

                <div
                  onClick={handleDownloadZip}
                  className="p-3.5 rounded-xl bg-[#090b10] border border-[#21283b] hover:border-emerald-500/40 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-emerald-400 rotate-180" />
                    <div>
                      <div className="text-xs font-bold text-white">Ready-to-Deploy React Code (.zip)</div>
                      <div className="text-[10px] text-slate-400 font-mono">Stand-alone Vite package for Vercel or GitHub Pages</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-3">
              <span className="text-xs font-mono font-medium text-slate-300 block">
                Load Professional Persona Template
              </span>

              <div
                onClick={() => {
                  updateProfile({
                    name: 'Alex Rivera',
                    tagline: 'Senior Distributed Systems Architect | Sub-Millisecond Cloud Platforms',
                    bio: 'Specializing in resilient cloud architectures, real-time developer tooling, and distributed consensus. 7+ years engineering mission-critical platforms handling millions of operations per second.',
                    accent_color: '#00d2ff',
                    template_id: 'professional',
                  })
                  setImportStatus('Loaded Senior Systems Architect persona!')
                  setTimeout(() => setImportStatus(null), 2500)
                }}
                className="p-3.5 rounded-xl bg-[#090b10] border border-[#21283b] hover:border-cyan-500/40 cursor-pointer transition-colors"
              >
                <div className="text-xs font-bold text-white">Distributed Systems Architect</div>
                <div className="text-[11px] text-slate-400">Go, Raft, Kubernetes, sub-millisecond p99 latency focus</div>
              </div>

              <div
                onClick={() => {
                  updateProfile({
                    name: 'Jordan Lee',
                    tagline: 'Principal Frontend Engineer & Design Systems Architect',
                    bio: 'Architecting world-class design systems, accessible UI platforms, and real-time collaborative workspaces using React 19, TypeScript, and WebGL.',
                    accent_color: '#a855f7',
                    template_id: 'creative',
                  })
                  setImportStatus('Loaded Frontend Architect persona!')
                  setTimeout(() => setImportStatus(null), 2500)
                }}
                className="p-3.5 rounded-xl bg-[#090b10] border border-[#21283b] hover:border-purple-500/40 cursor-pointer transition-colors"
              >
                <div className="text-xs font-bold text-white">Design Systems & Frontend Architect</div>
                <div className="text-[11px] text-slate-400">React 19, WebGL, Design Tokens, Micro-frontends focus</div>
              </div>

              <div className="pt-2">
                <button
                  onClick={resetToDefaults}
                  className="text-xs text-rose-400 hover:text-rose-300 font-mono transition-colors"
                >
                  Reset all data to default state
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#21283b] bg-[#0e111a] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
