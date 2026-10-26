import React, { useState, useRef, useEffect } from 'react'
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Check,
  Zap,
  ArrowRight,
  Bot,
  User,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { AIChatMessage } from '@/types'

interface AIChatBoxProps {
  isOpen: boolean
  onClose: () => void
}

export const AIChatBox: React.FC<AIChatBoxProps> = ({ isOpen, onClose }) => {
  const {
    profile,
    projects,
    skills,
    experience,
    selectedTemplate,
    updateProfile,
    addProject,
    addSkill
  } = usePortfolioStore()

  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${profile?.name || 'there'}! I'm your DevForge AI Portfolio Co-pilot. I can rewrite your bio, generate case studies, add skills, or audit your portfolio in **${selectedTemplate.toUpperCase()}** mode.\n\nHow can I help elevate your portfolio today?`,
      timestamp: 'Just now',
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({})

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  if (!isOpen) return null

  // Parse Action Blocks in AI responses
  const parseActionBlock = (text: string) => {
    const actionTagline = text.match(/\[ACTION:UPDATE_TAGLINE\]\s*([\s\S]+?)\s*\[\/ACTION\]/i)
    if (actionTagline) {
      return {
        type: 'UPDATE_TAGLINE' as const,
        data: actionTagline[1].trim(),
        label: 'Apply Tagline to Portfolio',
      }
    }

    const actionBio = text.match(/\[ACTION:UPDATE_BIO\]\s*([\s\S]+?)\s*\[\/ACTION\]/i)
    if (actionBio) {
      return {
        type: 'UPDATE_BIO' as const,
        data: actionBio[1].trim(),
        label: 'Apply Bio to Portfolio',
      }
    }

    const actionProj = text.match(/\[ACTION:ADD_PROJECT\]\s*([\s\S]+?)\s*\[\/ACTION\]/i)
    if (actionProj) {
      try {
        const parsed = JSON.parse(actionProj[1].trim())
        return {
          type: 'ADD_PROJECT' as const,
          data: parsed,
          label: `Add Project "${parsed.title}"`,
        }
      } catch {
        // ignore parse error
      }
    }

    const actionSkill = text.match(/\[ACTION:ADD_SKILL\]\s*([\s\S]+?)\s*\[\/ACTION\]/i)
    if (actionSkill) {
      try {
        const parsed = JSON.parse(actionSkill[1].trim())
        return {
          type: 'ADD_SKILL' as const,
          data: parsed,
          label: `Add Skill "${parsed.name}"`,
        }
      } catch {
        // ignore parse error
      }
    }

    return undefined
  }

  const cleanDisplayText = (text: string) => {
    return text.replace(/\[ACTION:[A-Z_]+\][\s\S]+?\[\/ACTION\]/gi, '').trim()
  }

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || inputMessage).trim()
    if (!text || isTyping) return

    const userMsg: AIChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: 'Just now',
    }

    setMessages((prev) => [...prev, userMsg])
    setInputMessage('')
    setIsTyping(true)

    try {
      const portfolioContext = {
        name: profile?.name,
        tagline: profile?.tagline,
        bio: profile?.bio,
        projects: projects.map((p) => ({ title: p.title, tagline: p.tagline })),
        skills: skills.map((s) => ({ name: s.name, category: s.category })),
      }

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          })),
          portfolioContext,
          currentMode: selectedTemplate,
        }),
      })

      const data = await res.json()
      const replyRaw = data.reply || "I've reviewed your request and updated the context."
      const action = parseActionBlock(replyRaw)

      const aiMsg: AIChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: cleanDisplayText(replyRaw),
        timestamp: 'Just now',
        action,
      }

      setMessages((prev) => [...prev, aiMsg])
    } catch (err: any) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'ai',
          text: "I couldn't reach the server. Let me know what you'd like to adjust on your portfolio!",
          timestamp: 'Just now',
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleApplyAction = (msgId: string, action: NonNullable<AIChatMessage['action']>) => {
    if (action.type === 'UPDATE_TAGLINE') {
      updateProfile({ tagline: action.data })
    } else if (action.type === 'UPDATE_BIO') {
      updateProfile({ bio: action.data })
    } else if (action.type === 'ADD_PROJECT') {
      addProject({
        title: action.data.title || 'New Systems Project',
        tagline: action.data.tagline || 'Engineered with DevForge AI',
        description: action.data.description || 'High-performance production implementation.',
        tech_stack: action.data.tech_stack || ['TypeScript', 'Go', 'Docker'],
        github_url: 'https://github.com',
        live_url: '',
        case_study_url: '',
        images: [],
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        is_featured: true,
        display_order: projects.length,
      })
    } else if (action.type === 'ADD_SKILL') {
      addSkill({
        name: action.data.name || 'Cloud Architecture',
        category: action.data.category || 'backend',
        proficiency: action.data.proficiency || 'expert',
        display_order: skills.length,
      })
    }

    setAppliedActions((prev) => ({ ...prev, [msgId]: true }))
  }

  const promptSuggestions = [
    'Rewrite my bio for a Senior Lead role',
    'Generate a distributed systems project',
    'Review my current portfolio and give feedback',
    'Suggest high-demand skills to add',
  ]

  return (
    <div
      className={`fixed z-50 transition-all duration-300 flex flex-col font-sans shadow-2xl overflow-hidden border border-[#21283b] bg-[#0c0e14] ${
        isExpanded
          ? 'bottom-4 right-4 w-[92vw] sm:w-[600px] h-[85vh] rounded-3xl'
          : 'bottom-8 right-8 w-[92vw] sm:w-[420px] h-[580px] rounded-2xl'
      }`}
    >
      {/* Chat Header */}
      <div className="px-4 py-3 bg-[#141824] border-b border-[#21283b] flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-sm">
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              DevForge AI Co-pilot
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Gemini 3.8
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">Mode: {selectedTemplate}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-white rounded"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-1 text-slate-400 hover:text-white rounded"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'bg-[#141824] border border-[#21283b] text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-xs">{msg.text}</div>

              {/* Interactive Apply Action Button */}
              {msg.action && (
                <div className="pt-2 border-t border-[#21283b] mt-2">
                  <button
                    onClick={() => handleApplyAction(msg.id, msg.action!)}
                    disabled={appliedActions[msg.id]}
                    className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl font-bold text-xs transition-all ${
                      appliedActions[msg.id]
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                    }`}
                  >
                    {appliedActions[msg.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied to Portfolio!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>{msg.action.label}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>DevForge AI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-3 py-2 bg-[#090b10] border-t border-[#21283b] overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
        {promptSuggestions.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSend(sug)}
            className="px-2.5 py-1 rounded-full bg-[#141824] hover:bg-[#1c2233] border border-[#21283b] text-slate-300 text-[10px] whitespace-nowrap transition-colors"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="p-3 bg-[#141824] border-t border-[#21283b] flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask AI to write a bio, project, or review..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isTyping}
          className="p-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  )
}
