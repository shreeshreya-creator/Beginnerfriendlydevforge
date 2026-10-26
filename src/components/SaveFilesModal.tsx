import React, { useState } from 'react'
import { Download, FileCode, FileJson, HardDrive, Printer, Check, X, Sparkles } from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { ModeId } from '@/types'

interface SaveFilesModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SaveFilesModal: React.FC<SaveFilesModalProps> = ({ isOpen, onClose }) => {
  const { profile, socialLinks, experience, projects, skills, education, activeMode } = usePortfolioStore()
  const [saveToast, setSaveToast] = useState<string | null>(null)

  if (!isOpen) return null

  const showToast = (msg: string) => {
    setSaveToast(msg)
    setTimeout(() => setSaveToast(null), 3500)
  }

  // 1. Download Standalone Single-File HTML
  const downloadStandaloneHTML = () => {
    const modeThemes: Record<ModeId, { bg: string; cardBg: string; text: string; textMuted: string; border: string; accent: string; accentHover: string; badgeBg: string }> = {
      dark: {
        bg: '#0b0f19',
        cardBg: '#131a2a',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        border: '#1e293b',
        accent: '#38bdf8',
        accentHover: '#0ea5e9',
        badgeBg: 'rgba(56, 189, 248, 0.12)',
      },
      light: {
        bg: '#f8fafc',
        cardBg: '#ffffff',
        text: '#0f172a',
        textMuted: '#64748b',
        border: '#e2e8f0',
        accent: '#2563eb',
        accentHover: '#1d4ed8',
        badgeBg: 'rgba(37, 99, 235, 0.08)',
      },
      sun: {
        bg: '#17120e',
        cardBg: '#231a14',
        text: '#fef3c7',
        textMuted: '#d97706',
        border: '#452b14',
        accent: '#f59e0b',
        accentHover: '#d97706',
        badgeBg: 'rgba(245, 158, 11, 0.15)',
      },
      'c-mode': {
        bg: '#041525',
        cardBg: '#0a223d',
        text: '#e0f2fe',
        textMuted: '#38bdf8',
        border: '#113a63',
        accent: '#06b6d4',
        accentHover: '#0891b2',
        badgeBg: 'rgba(6, 182, 212, 0.15)',
      },
    }

    const theme = modeThemes[activeMode] || modeThemes.dark

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile?.name || 'Developer'} - Portfolio</title>
  <meta name="description" content="${profile?.bio || profile?.tagline || 'Professional Portfolio built with DevForge'}">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: ${theme.bg};
      color: ${theme.text};
      line-height: 1.6;
      padding: 0;
      margin: 0;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px 80px 20px;
    }
    header {
      text-align: center;
      padding: 60px 20px 40px 20px;
    }
    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid ${theme.accent};
      margin-bottom: 20px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    .tagline {
      font-size: 1.25rem;
      color: ${theme.accent};
      font-weight: 500;
      margin-bottom: 16px;
    }
    .bio {
      max-width: 640px;
      margin: 0 auto 24px auto;
      color: ${theme.textMuted};
      font-size: 1.05rem;
    }
    .contact-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      margin-bottom: 40px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background-color: ${theme.accent};
      color: #ffffff;
    }
    .btn-primary:hover {
      background-color: ${theme.accentHover};
      transform: translateY(-2px);
    }
    .btn-secondary {
      background-color: ${theme.cardBg};
      color: ${theme.text};
      border: 1px solid ${theme.border};
    }
    .btn-secondary:hover {
      border-color: ${theme.accent};
      transform: translateY(-2px);
    }
    .section-title {
      font-size: 1.6rem;
      font-weight: 700;
      margin: 50px 0 20px 0;
      border-bottom: 2px solid ${theme.border};
      padding-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .skill-chip {
      background-color: ${theme.badgeBg};
      color: ${theme.accent};
      border: 1px solid ${theme.border};
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .project-card {
      background-color: ${theme.cardBg};
      border: 1px solid ${theme.border};
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, border-color 0.2s;
    }
    .project-card:hover {
      transform: translateY(-4px);
      border-color: ${theme.accent};
    }
    .project-card img {
      width: 100%;
      height: 160px;
      object-fit: cover;
    }
    .project-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .project-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .project-desc {
      color: ${theme.textMuted};
      font-size: 0.95rem;
      margin-bottom: 16px;
      flex: 1;
    }
    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;
    }
    .project-tag {
      font-size: 0.75rem;
      background: ${theme.badgeBg};
      color: ${theme.accent};
      padding: 3px 8px;
      border-radius: 4px;
    }
    .experience-item {
      background-color: ${theme.cardBg};
      border: 1px solid ${theme.border};
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 15px;
    }
    .experience-header {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 6px;
    }
    .experience-role {
      font-weight: 700;
      font-size: 1.1rem;
    }
    .experience-company {
      color: ${theme.accent};
    }
    footer {
      text-align: center;
      margin-top: 60px;
      padding-top: 30px;
      border-top: 1px solid ${theme.border};
      color: ${theme.textMuted};
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      ${profile?.profile_photo ? `<img class="avatar" src="${profile.profile_photo}" alt="${profile?.name || 'Developer'}">` : ''}
      <h1>${profile?.name || 'Developer Portfolio'}</h1>
      <div class="tagline">${profile?.tagline || 'Building Great Software'}</div>
      <p class="bio">${profile?.bio || 'Welcome to my portfolio! Here you will find some of my recent projects, skills, and background.'}</p>
      
      <div class="contact-links">
        ${socialLinks?.email ? `<a class="btn btn-primary" href="mailto:${socialLinks.email}">✉ Email Me</a>` : ''}
        ${socialLinks?.github ? `<a class="btn btn-secondary" href="${socialLinks.github}" target="_blank" rel="noopener">GitHub</a>` : ''}
        ${socialLinks?.linkedin ? `<a class="btn btn-secondary" href="${socialLinks.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
        ${socialLinks?.website ? `<a class="btn btn-secondary" href="${socialLinks.website}" target="_blank" rel="noopener">Website</a>` : ''}
      </div>
    </header>

    <section>
      <h2 class="section-title">⚡ Skills & Technologies</h2>
      <div class="skills-grid">
        ${skills.map((s) => `<span class="skill-chip">${s.name}</span>`).join('\n        ')}
      </div>
    </section>

    <section>
      <h2 class="section-title">💼 Featured Projects</h2>
      <div class="projects-grid">
        ${projects.map((p) => `
          <div class="project-card">
            ${p.thumbnail ? `<img src="${p.thumbnail}" alt="${p.title}" />` : ''}
            <div class="project-body">
              <h3 class="project-title">${p.title}</h3>
              <p class="project-desc">${p.description || p.tagline}</p>
              <div class="project-tags">
                ${(p.tech_stack || []).map((t) => `<span class="project-tag">${t}</span>`).join('')}
              </div>
              <div style="margin-top: auto; display: flex; gap: 10px;">
                ${p.live_url ? `<a class="btn btn-primary" style="padding: 6px 12px; font-size: 0.85rem;" href="${p.live_url}" target="_blank">Live Demo</a>` : ''}
                ${p.github_url ? `<a class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85rem;" href="${p.github_url}" target="_blank">Code</a>` : ''}
              </div>
            </div>
          </div>
        `).join('\n')}
      </div>
    </section>

    ${experience && experience.length > 0 ? `
    <section>
      <h2 class="section-title">📜 Experience & Background</h2>
      <div>
        ${experience.map((e) => `
          <div class="experience-item">
            <div class="experience-header">
              <span class="experience-role">${e.position}</span>
              <span class="experience-company">${e.company}</span>
            </div>
            <p style="color: ${theme.textMuted}; font-size: 0.95rem;">${e.description}</p>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <footer>
      <p>Built with ❤️ using <strong>DevForge</strong> • Mode: ${activeMode.toUpperCase()}</p>
    </footer>
  </div>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const fileName = `${(profile?.name || 'my').toLowerCase().replace(/\s+/g, '-')}-portfolio.html`
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showToast(`Downloaded "${fileName}"! You can open it in any browser offline.`)
  }

  // 2. Download JSON Data File
  const downloadJSONData = () => {
    const portfolioData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      activeMode,
      profile,
      socialLinks,
      skills,
      projects,
      experience,
      education,
    }

    const blob = new Blob([JSON.stringify(portfolioData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const fileName = `devforge-portfolio-${Date.now()}.json`
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showToast(`Downloaded "${fileName}" backup file!`)
  }

  // 3. Save to System Storage (LocalStorage)
  const saveToSystemStorage = () => {
    try {
      const payload = {
        profile,
        socialLinks,
        experience,
        projects,
        skills,
        education,
        activeMode,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem('devforge_portfolio_v2', JSON.stringify(payload))
      showToast('Successfully saved to your local browser system storage!')
    } catch {
      showToast('Could not save to system storage.')
    }
  }

  // 4. Print / PDF Export
  const printOrPDF = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#111622] border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Save Your Portfolio Files</h2>
            <p className="text-xs text-slate-400">Save to your computer folder for personal use or hosting</p>
          </div>
        </div>

        {saveToast && (
          <div className="my-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>{saveToast}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 my-5">
          {/* Option 1: Standalone HTML File */}
          <button
            onClick={downloadStandaloneHTML}
            className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/60 transition-all text-left"
          >
            <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 group-hover:scale-110 transition-transform">
              <FileCode className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Download HTML File</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Recommended</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                A single standalone <code className="text-cyan-300">.html</code> file with your chosen theme. Double-click to open in any browser offline or host anywhere!
              </p>
            </div>
          </button>

          {/* Option 2: JSON Backup */}
          <button
            onClick={downloadJSONData}
            className="group flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-slate-500 hover:bg-slate-800/60 transition-all text-left"
          >
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 group-hover:scale-110 transition-transform">
              <FileJson className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-white text-sm">Download Portfolio JSON</span>
              <p className="text-xs text-slate-400 mt-1">
                Raw data file containing all your information, skills, and projects for backup.
              </p>
            </div>
          </button>

          {/* Option 3: System Storage Save */}
          <button
            onClick={saveToSystemStorage}
            className="group flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all text-left"
          >
            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 group-hover:scale-110 transition-transform">
              <HardDrive className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-white text-sm">Save in System Storage</span>
              <p className="text-xs text-slate-400 mt-1">
                Saves your progress to this browser so you can return anytime without losing data.
              </p>
            </div>
          </button>

          {/* Option 4: Full DevForge Project Source Code (ZIP) */}
          <a
            href="/devforge-source-code.zip"
            download="devforge-source-code.zip"
            onClick={() => showToast('Downloading complete DevForge source code ZIP package...')}
            className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/30 hover:border-blue-400 hover:bg-blue-950/60 transition-all text-left"
          >
            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Download Full Project Code (ZIP)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Complete App</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Full React + TypeScript + Express + Tailwind source code ZIP with setup instructions to run locally.
              </p>
            </div>
          </a>

          {/* Option 5: Print / PDF */}
          <button
            onClick={printOrPDF}
            className="group flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-purple-500/50 hover:bg-slate-800/60 transition-all text-left"
          >
            <div className="p-2.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 group-hover:scale-110 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-white text-sm">Print or Save as PDF</span>
              <p className="text-xs text-slate-400 mt-1">
                Opens your browser print dialog to print or save as a PDF document.
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
