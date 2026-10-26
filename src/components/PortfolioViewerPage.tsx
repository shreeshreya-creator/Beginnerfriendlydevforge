import React, { useState } from 'react'
import {
  ArrowLeft,
  Download,
  Edit3,
  Sparkles,
  Share2,
  Check,
  Copy,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Mail,
  MapPin,
  Moon,
  Sun,
  Flame,
  Waves,
  Award,
  CheckCircle2,
  AlertCircle,
  FileCode,
  HardDrive
} from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { SaveFilesModal } from './SaveFilesModal'
import type { ModeId } from '@/types'

export const PortfolioViewerPage: React.FC = () => {
  const {
    profile,
    socialLinks,
    skills,
    projects,
    experience,
    activeMode,
    setActiveMode,
    setCurrentStep,
    getPortfolioScore,
  } = usePortfolioStore()

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [aiTipExpanded, setAiTipExpanded] = useState(false)

  const scoreInfo = getPortfolioScore()

  const copyEmailToClipboard = () => {
    if (socialLinks?.email) {
      navigator.clipboard.writeText(socialLinks.email)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    }
  }

  // Visual Theme Configuration for the 4 Modes
  const themeStyles: Record<
    ModeId,
    {
      pageBg: string
      cardBg: string
      cardBorder: string
      textPrimary: string
      textSecondary: string
      accentText: string
      accentBg: string
      accentBorder: string
      badgeBg: string
      buttonPrimary: string
      headerBorder: string
    }
  > = {
    dark: {
      pageBg: 'bg-[#0b0f19]',
      cardBg: 'bg-[#131a2a]',
      cardBorder: 'border-slate-800',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-400',
      accentText: 'text-cyan-400',
      accentBg: 'bg-cyan-500/15',
      accentBorder: 'border-cyan-500/30',
      badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      buttonPrimary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white',
      headerBorder: 'border-slate-800',
    },
    light: {
      pageBg: 'bg-slate-50',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200 shadow-sm',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      accentText: 'text-blue-600',
      accentBg: 'bg-blue-50',
      accentBorder: 'border-blue-200',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20',
      headerBorder: 'border-slate-200',
    },
    sun: {
      pageBg: 'bg-[#17120e]',
      cardBg: 'bg-[#231a14]',
      cardBorder: 'border-[#452b14]',
      textPrimary: 'text-[#fef3c7]',
      textSecondary: 'text-amber-200/70',
      accentText: 'text-amber-400',
      accentBg: 'bg-amber-500/15',
      accentBorder: 'border-amber-500/30',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      buttonPrimary: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold',
      headerBorder: 'border-[#382310]',
    },
    'c-mode': {
      pageBg: 'bg-[#041525]',
      cardBg: 'bg-[#0a223d]',
      cardBorder: 'border-[#113a63]',
      textPrimary: 'text-[#e0f2fe]',
      textSecondary: 'text-cyan-200/70',
      accentText: 'text-cyan-400',
      accentBg: 'bg-cyan-500/15',
      accentBorder: 'border-cyan-500/30',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      buttonPrimary: 'bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-bold',
      headerBorder: 'border-[#113a63]',
    },
  }

  const currentTheme = themeStyles[activeMode] || themeStyles.dark

  return (
    <div className={`min-h-screen ${currentTheme.pageBg} transition-colors duration-200 flex flex-col justify-between`}>
      {/* Top Floating Control Bar */}
      <header className="sticky top-0 z-30 bg-[#0d121f]/95 border-b border-slate-800 backdrop-blur-md text-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentStep('details')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Edit Details</span>
            </button>

            {/* Quick 4-Mode Switcher */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700/80">
              <button
                onClick={() => setActiveMode('dark')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeMode === 'dark' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>

              <button
                onClick={() => setActiveMode('light')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeMode === 'light' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>

              <button
                onClick={() => setActiveMode('sun')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeMode === 'sun' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Sun</span>
              </button>

              <button
                onClick={() => setActiveMode('c-mode')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeMode === 'c-mode' ? 'bg-cyan-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>C Mode</span>
              </button>
            </div>
          </div>

          {/* Right Action: Save to Files Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Save to Files</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Portfolio Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* ======================================================== */}
        {/* PORTFOLIO ANALYZER BANNER (Score Percentage & Review) */}
        {/* ======================================================== */}
        <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl text-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg">
                {scoreInfo.score}%
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white">Portfolio Readiness Score</h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {scoreInfo.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated analysis based on recruiter benchmarks and profile completeness
                </p>
              </div>
            </div>

            <button
              onClick={() => setAiTipExpanded(!aiTipExpanded)}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiTipExpanded ? 'Hide Suggestions' : 'View Improvement Tips'}</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${scoreInfo.score}%` }}
            />
          </div>

          {/* Checklist Badges */}
          <div className="flex flex-wrap gap-2 mt-4 text-xs">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${scoreInfo.breakdown.hasName ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
              <Check className="w-3 h-3" /> Name & Title
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${scoreInfo.breakdown.hasBio ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
              <Check className="w-3 h-3" /> Bio Summary
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${scoreInfo.breakdown.hasSkills ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
              <Check className="w-3 h-3" /> Skills ({skills.length})
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${scoreInfo.breakdown.hasProjects ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
              <Check className="w-3 h-3" /> Projects ({projects.length})
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${scoreInfo.breakdown.hasEmail ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
              <Check className="w-3 h-3" /> Contact Email
            </span>
          </div>

          {/* Expanded AI Tips */}
          {aiTipExpanded && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 animate-in fade-in">
              <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Tips to reach 100% Score:</span>
              </div>
              {scoreInfo.tips.length === 0 ? (
                <p className="text-emerald-400">Congratulations! Your portfolio meets all top-tier completeness criteria!</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  {scoreInfo.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* RENDERED USER PORTFOLIO IN CHOSEN THEME MODE */}
        {/* ======================================================== */}
        <div className={`p-8 sm:p-12 rounded-3xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} shadow-2xl transition-all`}>
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center pb-10 border-b border-inherit">
            {profile?.profile_photo && (
              <img
                src={profile.profile_photo}
                alt={profile?.name || 'Developer'}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-cyan-400 shadow-xl mb-5"
              />
            )}

            <h1 className={`text-3xl sm:text-5xl font-black tracking-tight mb-2 ${currentTheme.textPrimary}`}>
              {profile?.name || 'Your Full Name'}
            </h1>

            <div className={`text-lg sm:text-xl font-bold mb-4 ${currentTheme.accentText}`}>
              {profile?.tagline || 'Software Developer'}
            </div>

            <p className={`max-w-2xl text-sm sm:text-base mb-6 leading-relaxed ${currentTheme.textSecondary}`}>
              {profile?.bio || 'Welcome to my portfolio! I build modern, resilient, and responsive web applications.'}
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {experience[0]?.location && (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${currentTheme.badgeBg} border`}>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{experience[0].location}</span>
                </span>
              )}
              {socialLinks?.email && (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${currentTheme.badgeBg} border`}>
                  <Mail className="w-3.5 h-3.5" />
                  <span>{socialLinks.email}</span>
                </span>
              )}
            </div>

            {/* Actions: Email + Socials */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {socialLinks?.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 ${currentTheme.buttonPrimary}`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Me</span>
                </a>
              )}

              {socialLinks?.email && (
                <button
                  type="button"
                  onClick={copyEmailToClipboard}
                  className={`px-3.5 py-2.5 rounded-xl border border-inherit text-xs font-semibold hover:border-cyan-400 transition-colors flex items-center gap-1.5 ${currentTheme.textPrimary}`}
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                </button>
              )}

              {socialLinks?.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border border-inherit hover:border-cyan-400 transition-colors ${currentTheme.textPrimary}`}
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}

              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border border-inherit hover:border-cyan-400 transition-colors ${currentTheme.textPrimary}`}
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}

              {socialLinks?.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border border-inherit hover:border-cyan-400 transition-colors ${currentTheme.textPrimary}`}
                  title="Personal Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Section: Skills & Technologies */}
          <div className="py-10 border-b border-inherit">
            <h2 className={`text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 ${currentTheme.textPrimary}`}>
              <span>⚡ Skills & Expertise</span>
            </h2>

            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${currentTheme.badgeBg}`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* Section: Featured Projects */}
          <div className="py-10 border-b border-inherit">
            <h2 className={`text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 ${currentTheme.textPrimary}`}>
              <span>💼 Featured Projects</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`rounded-2xl border border-inherit p-6 flex flex-col justify-between hover:border-cyan-400 transition-all ${
                    activeMode === 'light' ? 'bg-slate-50' : 'bg-black/20'
                  }`}
                >
                  <div>
                    {proj.thumbnail && (
                      <img
                        src={proj.thumbnail}
                        alt={proj.title}
                        className="w-full h-40 object-cover rounded-xl mb-4"
                      />
                    )}
                    <h3 className={`font-bold text-lg mb-1 ${currentTheme.textPrimary}`}>{proj.title}</h3>
                    <div className={`text-xs font-semibold mb-2.5 ${currentTheme.accentText}`}>
                      {proj.tagline}
                    </div>
                    <p className={`text-xs leading-relaxed mb-4 ${currentTheme.textSecondary}`}>
                      {proj.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech stack tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(proj.tech_stack || []).map((tech, idx) => (
                        <span
                          key={idx}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-mono ${currentTheme.badgeBg} border`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-3 pt-2">
                      {proj.live_url && (
                        <a
                          href={proj.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 text-xs font-bold ${currentTheme.accentText} hover:underline`}
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {proj.github_url && (
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${currentTheme.textSecondary} hover:underline`}
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code Repository</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Experience & Background */}
          {experience && experience.length > 0 && (
            <div className="pt-10">
              <h2 className={`text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 ${currentTheme.textPrimary}`}>
                <span>📜 Experience & Background</span>
              </h2>

              <div className="space-y-4">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className={`p-5 rounded-2xl border border-inherit ${
                      activeMode === 'light' ? 'bg-slate-50' : 'bg-black/20'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <h4 className={`font-bold text-base ${currentTheme.textPrimary}`}>{exp.position}</h4>
                      <span className={`text-xs font-semibold ${currentTheme.accentText}`}>{exp.company}</span>
                    </div>
                    {exp.location && (
                      <div className={`text-xs mb-2 ${currentTheme.textSecondary}`}>{exp.location}</div>
                    )}
                    <p className={`text-xs leading-relaxed ${currentTheme.textSecondary}`}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Footer */}
          <div className="mt-12 pt-6 border-t border-inherit text-center text-xs opacity-75">
            <p>Designed with DevForge • Portfolio Mode: <strong>{activeMode.toUpperCase()}</strong></p>
          </div>
        </div>

        {/* Floating Save to Files Banner at Bottom */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-xl">
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Ready to save this portfolio for your personal use?</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Download the standalone HTML file or save it directly to your computer folder.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setCurrentStep('details')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Edit Details
            </button>

            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Save to Files</span>
            </button>
          </div>
        </div>
      </main>

      {/* Save Files Modal Component */}
      <SaveFilesModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} />

      {/* Page Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-400 bg-[#0d121f]">
        <p>DevForge • The Beginner-Friendly Portfolio Builder • Step 3 of 3</p>
      </footer>
    </div>
  )
}
