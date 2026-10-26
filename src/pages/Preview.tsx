import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { templateComponents } from '../templates'
import type { PortfolioData, TemplateId } from '../types'
import { usePortfolioStore } from '../store/portfolioStore'
import { ArrowLeft, Layers, Laptop, ExternalLink } from 'lucide-react'

export default function PreviewPage() {
  const params = useParams<{ templateId?: string }>()
  const {
    profile,
    socialLinks,
    experience,
    projects,
    skills,
    education,
    selectedTemplate,
    setTemplate
  } = usePortfolioStore()

  const activeTemplateId: TemplateId =
    (params.templateId as TemplateId) ||
    (selectedTemplate as TemplateId) ||
    'professional'

  const TemplateComponent =
    templateComponents[activeTemplateId] || templateComponents.professional

  const previewData: PortfolioData = {
    profile: {
      ...profile!,
      template_id: activeTemplateId,
    },
    social_links: socialLinks,
    experience,
    projects,
    skills,
    education,
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Floating Top Navigation Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#121622]/90 backdrop-blur-md border border-[#21283b] px-4 py-2 rounded-full shadow-2xl">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Studio</span>
        </Link>

        <span className="w-px h-4 bg-[#21283b]" />

        {/* 4 Modes Switcher */}
        <div className="flex items-center gap-1">
          {(['professional', 'monolith', 'terminal', 'creative'] as const).map((t) => (
            <Link
              key={t}
              to={`/preview/${t}`}
              onClick={() => setTemplate(t)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono capitalize transition-all ${
                activeTemplateId === t
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      </div>

      {/* Rendered Mode Template */}
      <div className="min-h-screen overflow-x-hidden no-scrollbar">
        <TemplateComponent data={previewData} />
      </div>
    </div>
  )
}
