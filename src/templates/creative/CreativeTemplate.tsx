import React from 'react'
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Compass,
  Palette,
  Eye,
  Star
} from 'lucide-react'
import type { PortfolioData } from '@/types'

interface CreativeTemplateProps {
  data: PortfolioData
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  const { profile, experience, projects, skills, social_links } = data
  const accentColor = profile?.accent_color || '#ec4899'

  return (
    <div
      className="min-h-screen bg-[#07070a] text-white font-sans selection:bg-pink-500/30 selection:text-pink-200"
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      {/* Top Floating Glass Nav */}
      <div className="fixed top-6 inset-x-0 z-40 flex justify-center px-4">
        <nav className="bg-[#121218]/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <span className="font-black text-sm tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            {profile?.name}
          </span>
          <div className="hidden sm:flex items-center gap-5 text-xs font-mono text-slate-400">
            <a href="#work" className="hover:text-white transition-colors">Work</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#skills" className="hover:text-white transition-colors">Stack</a>
          </div>
          {social_links?.email && (
            <a
              href={`mailto:${social_links.email}`}
              className="px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs rounded-full transition-all shadow-lg shadow-pink-500/25"
            >
              Get in Touch
            </a>
          )}
        </nav>
      </div>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-6 pt-36 pb-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-950/40 border border-pink-800/40 text-pink-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Creative Technologist & Interface Architect</span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 max-w-4xl mx-auto leading-none">
          {profile?.name}
        </h1>

        <p className="text-lg sm:text-2xl font-mono text-pink-400 max-w-2xl mx-auto font-medium">
          {profile?.tagline}
        </p>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          {profile?.bio}
        </p>
      </header>

      {/* Bento Grid Projects Showcase */}
      <section id="work" className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Featured Creations & Experiments
          </h2>
          <span className="text-xs font-mono text-slate-400">{projects.length} Works</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <div
              key={proj.id}
              className={`p-6 rounded-3xl bg-[#101017] border border-white/10 hover:border-pink-500/50 transition-all flex flex-col justify-between group shadow-xl ${
                idx === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-pink-400 font-bold uppercase tracking-wider">
                    0{idx + 1}
                  </span>
                  {proj.github_stars > 0 && (
                    <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {proj.github_stars}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-pink-300 transition-colors mb-2">
                  {proj.title}
                </h3>

                <p className="text-xs font-mono text-purple-300 mb-3">{proj.tagline}</p>

                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                  {proj.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono text-slate-400">
                  {proj.github_url && (
                    <a href={proj.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                  {proj.live_url && (
                    <a href={proj.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-pink-400">
                      <span>Launch Project</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Matrix */}
      <section id="skills" className="max-w-6xl mx-auto px-6 py-12 border-t border-white/10">
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">Technical Artistry</h2>
        <div className="flex flex-wrap gap-2.5">
          {skills.map((s) => (
            <span
              key={s.id}
              className="px-4 py-2 rounded-2xl bg-[#111118] border border-white/10 text-xs font-mono text-slate-200 hover:border-pink-500/40 transition-colors"
            >
              <strong className="text-pink-400 font-bold">{s.name}</strong> • <span className="text-[10px] text-slate-400 uppercase">{s.proficiency}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-xs font-mono text-slate-500">
        <p>© {new Date().getFullYear()} {profile?.name}. Crafted in DevForge Creative Studio.</p>
      </footer>
    </div>
  )
}
