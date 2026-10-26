import React, { useState } from 'react'
import {
  MessageSquare,
  X,
  CheckCircle2,
  Circle,
  Sparkles,
  Send,
  Trash2,
  Check,
  ArrowRight,
  Filter
} from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'

interface CollabCommentsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const CollabCommentsDrawer: React.FC<CollabCommentsDrawerProps> = ({ isOpen, onClose }) => {
  const {
    comments,
    addComment,
    resolveComment,
    applyCommentSuggestion,
    deleteComment,
    generateWithAI,
    isAIGenerating,
    profile,
    projects
  } = usePortfolioStore()

  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'resolved'>('all')
  const [newCommentText, setNewCommentText] = useState('')
  const [selectedSection, setSelectedSection] = useState<'hero' | 'projects' | 'skills' | 'experience'>('hero')
  const [aiGeneratingSection, setAiGeneratingSection] = useState<string | null>(null)

  if (!isOpen) return null

  const filteredComments = comments.filter((c) => {
    if (activeFilter === 'open') return !c.resolved
    if (activeFilter === 'resolved') return c.resolved
    return true
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText.trim()) return
    addComment(selectedSection, newCommentText.trim())
    setNewCommentText('')
  }

  const handleRequestAIReview = async (section: 'hero' | 'projects' | 'skills' | 'experience') => {
    setAiGeneratingSection(section)
    try {
      let contextContent = {}
      if (section === 'hero') {
        contextContent = { tagline: profile?.tagline, bio: profile?.bio }
      } else if (section === 'projects') {
        contextContent = { projects: projects.map((p) => ({ title: p.title, tagline: p.tagline, tech: p.tech_stack })) }
      }

      const reviewText = await generateWithAI(
        'peer_review_feedback',
        `Review the ${section} section. Provide 1 high-impact suggestion to improve recruiter conversions.`,
        { sectionId: section, content: contextContent }
      )

      addComment(section, reviewText, section === 'hero' ? {
        field: 'tagline',
        value: profile?.tagline ? `${profile.tagline} | Distributed Systems Architect` : 'Senior Systems Architect',
        description: 'Auto-improved tagline with high-density architectural keywords',
      } : undefined)
    } catch (e) {
      console.error(e)
    } finally {
      setAiGeneratingSection(null)
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0f121a] border-l border-[#21283b] shadow-2xl flex flex-col font-sans text-slate-200 animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#21283b] bg-[#141824]/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Peer Review Threads
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Live
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Inline comments & suggestions from your team
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs & AI Review Trigger */}
      <div className="px-4 py-2.5 border-b border-[#21283b] bg-[#0c0e14] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          {(['all', 'open', 'resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-2.5 py-1 rounded-md capitalize font-mono text-[11px] transition-colors ${
                activeFilter === tab
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleRequestAIReview(selectedSection)}
          disabled={isAIGenerating}
          className="flex items-center gap-1 px-2.5 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 rounded-md font-mono text-[10px] transition-all disabled:opacity-50"
          title="Prompt Gemini AI to inspect this section and leave review notes"
        >
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>{aiGeneratingSection ? 'Reviewing...' : 'AI Review Note'}</span>
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#141824] border border-[#21283b] mx-auto flex items-center justify-center text-slate-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium text-slate-400">No review comments yet</p>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Leave a note below or click "AI Review Note" to generate automated feedback.
            </p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3.5 rounded-xl border transition-all ${
                comment.resolved
                  ? 'bg-[#121622]/50 border-slate-800/80 opacity-70'
                  : 'bg-[#141824] border-[#21283b] hover:border-slate-700 shadow-sm'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: comment.authorColor }}
                  />
                  <span className="text-xs font-semibold text-white">
                    {comment.authorName}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">
                    #{comment.sectionId}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {comment.createdAt}
                  </span>
                  <button
                    onClick={() => resolveComment(comment.id)}
                    className={`p-1 rounded transition-colors ${
                      comment.resolved
                        ? 'text-emerald-400 hover:text-emerald-300'
                        : 'text-slate-500 hover:text-emerald-400'
                    }`}
                    title={comment.resolved ? 'Mark as Unresolved' : 'Resolve Comment'}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Text */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-2.5">
                {comment.text}
              </p>

              {/* Suggested Change Card */}
              {comment.suggestedChange && (
                <div className="mt-2.5 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-emerald-400 font-medium">
                      💡 Suggested {comment.suggestedChange.field}:
                    </span>
                    <button
                      onClick={() => applyCommentSuggestion(comment.id)}
                      className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-[10px] transition-all"
                    >
                      <Check className="w-3 h-3" />
                      Apply Change
                    </button>
                  </div>
                  <div className="text-xs text-slate-200 font-mono bg-[#090b10] p-2 rounded border border-emerald-900/40">
                    "{comment.suggestedChange.value}"
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Comment Input Box */}
      <form onSubmit={handleAdd} className="p-4 border-t border-[#21283b] bg-[#141824]/60 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-mono font-medium">Comment target:</span>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value as any)}
            className="bg-[#090b10] border border-[#21283b] rounded-md px-2 py-0.5 text-[11px] text-cyan-300 font-mono outline-none"
          >
            <option value="hero">#hero</option>
            <option value="projects">#projects</option>
            <option value="skills">#skills</option>
            <option value="experience">#experience</option>
          </select>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Suggest a code/portfolio improvement..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  )
}
