import React from 'react'
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Server,
  FileText,
  Quote
} from 'lucide-react'
import type { PortfolioData } from '@/types'

interface ProfessionalTemplateProps {
  data: PortfolioData
}

export function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
  const { profile, experience, projects, skills, social_links, testimonials } = data
  const accentColor = profile?.accent_color || '#00d2ff'

  return (
    <div
      className="min-h-screen bg-[#090b10] text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200"
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      {/* Top Professional Navigation */}
      <nav className="sticky top-0 z-40 bg-[#090b10]/90 backdrop-blur-md border-b border-[#1b2233] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              {profile?.name?.charAt(0) || 'D'}
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm block">
                {profile?.name || 'Alex Rivera'}
              </span>
              <span className="text-[11px] font-mono text-cyan-400 block -mt-0.5">
                {profile?.tagline?.split('|')[0] || 'Technical Architect'}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#metrics" className="hover:text-white transition-colors">Metrics</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            {testimonials && testimonials.length > 0 && (
              <a href="#endorsements" className="hover:text-white transition-colors">Endorsements</a>
            )}
          </div>

          <div className="flex items-center gap-3">
            {social_links?.email && (
              <a
                href={`mailto:${social_links.email}`}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20"
              >
                Contact
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="about" className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Principal Architect Portfolio</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {profile?.name}
            </h1>

            <p className="text-lg sm:text-xl font-mono text-cyan-400 font-medium">
              {profile?.tagline}
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans pt-1">
              {profile?.bio}
            </p>

            {/* Social & Contact links */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {social_links?.github && (
                <a
                  href={social_links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1a2133] border border-[#21283b] text-slate-200 text-xs font-mono transition-colors"
                >
                  <Github className="w-4 h-4 text-slate-400" />
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              )}
              {social_links?.linkedin && (
                <a
                  href={social_links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1a2133] border border-[#21283b] text-slate-200 text-xs font-mono transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              )}
              {social_links?.email && (
                <a
                  href={`mailto:${social_links.email}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1a2133] border border-[#21283b] text-slate-200 text-xs font-mono transition-colors"
                >
                  <Mail className="w-4 h-4 text-rose-400" />
                  <span>{social_links.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Profile Photo / Avatar card */}
          {profile?.profile_photo && (
            <div className="relative shrink-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl p-1 bg-[#141824]">
                <img
                  src={profile.profile_photo}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for Q1
              </div>
            </div>
          )}
        </div>

        {/* Quantifiable Benchmarks & Metrics Row */}
        <div id="metrics" className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[#1b2233]">
          <div className="p-4 rounded-xl bg-[#141824]/60 border border-[#21283b]">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Throughput</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">450k req/s</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Peak cluster ingestion velocity</p>
          </div>

          <div className="p-4 rounded-xl bg-[#141824]/60 border border-[#21283b]">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>p99 Latency</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">&lt;6ms</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Reduced from 42ms baseline</p>
          </div>

          <div className="p-4 rounded-xl bg-[#141824]/60 border border-[#21283b]">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-mono mb-1">
              <Server className="w-3.5 h-3.5" />
              <span>Infrastructure</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">8 Regions</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Multi-cloud active-active nodes</p>
          </div>

          <div className="p-4 rounded-xl bg-[#141824]/60 border border-[#21283b]">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Reliability SLA</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">99.99%</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Automated raft failover</p>
          </div>
        </div>
      </header>

      {/* Featured Projects Section */}
      <section id="projects" className="max-w-6xl mx-auto px-6 py-12 border-t border-[#1b2233]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
              Architectural Case Studies
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
              Production Systems & Projects
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <article
              key={project.id}
              className="p-6 rounded-2xl bg-[#141824] border border-[#21283b] hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  {project.github_stars > 0 && (
                    <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                      ★ {project.github_stars}
                    </span>
                  )}
                </div>

                <p className="text-xs font-mono text-cyan-400/90 mb-3">{project.tagline}</p>

                <p className="text-xs text-slate-300 leading-relaxed font-sans mb-6">
                  {project.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-[#090b10] border border-[#21283b] text-[10px] font-mono text-cyan-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#21283b] text-xs font-mono text-slate-400">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source</span>
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                    >
                      <span>Live System</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Experience & Skills Section */}
      <section id="experience" className="max-w-6xl mx-auto px-6 py-12 border-t border-[#1b2233]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Experience */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                Career History
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
                Leadership & Engineering Roles
              </h2>
            </div>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="p-5 rounded-2xl bg-[#141824] border border-[#21283b] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{exp.position}</h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      {exp.start_date.slice(0, 7)} — {exp.is_current ? 'Present' : exp.end_date?.slice(0, 7)}
                    </span>
                  </div>
                  <div className="text-xs text-cyan-400 font-mono">
                    {exp.company} • {exp.location}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Taxonomy */}
          <div id="skills" className="space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                Core Competencies
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
                Technical Stack & Domains
              </h2>
            </div>

            <div className="p-6 rounded-2xl bg-[#141824] border border-[#21283b] space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 rounded-xl bg-[#090b10] border border-[#21283b] space-y-1"
                  >
                    <span className="text-xs font-mono font-bold text-slate-100 block truncate">
                      {skill.name}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase block">
                      {skill.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Client Endorsements */}
      {testimonials && testimonials.length > 0 && (
        <section id="endorsements" className="max-w-6xl mx-auto px-6 py-12 border-t border-[#1b2233]">
          <div className="mb-8">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest block">
              Peer Recommendations
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
              Client & Engineering Leadership Testimonials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="p-6 rounded-2xl bg-[#141824] border border-[#21283b] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <Quote className="w-6 h-6 text-cyan-400/60" />
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{test.content}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[#21283b]">
                  <img src={test.avatar} alt={test.author} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-bold text-white">{test.author}</div>
                    <div className="text-[11px] font-mono text-slate-400">{test.role} • {test.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[#1b2233] py-12 px-6 bg-[#06080d] text-center text-xs font-mono text-slate-500">
        <p>© {new Date().getFullYear()} {profile?.name}. Engineered with DevForge Studio.</p>
      </footer>
    </div>
  )
}
