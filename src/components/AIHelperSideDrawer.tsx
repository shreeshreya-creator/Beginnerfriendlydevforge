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
  Bot,
  User,
  Trash2,
  RefreshCw,
  ArrowRight
} from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'

interface AIChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: string
  action?: {
    type: 'UPDATE_TAGLINE' | 'UPDATE_BIO' | 'ADD_PROJECT' | 'ADD_SKILL'
    data: any
    label: string
  }
}

export const AIHelperSideDrawer: React.FC = () => {
  const {
    profile,
    updateProfile,
    projects,
    addProject,
    skills,
    addSkill,
    activeMode,
    getPortfolioScore,
    setCurrentStep
  } = usePortfolioStore()

  const [isOpen, setIsOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({})

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hi ${profile?.name || 'there'}! 👋 I'm your DevForge AI Helper. I'm here to help you write a great bio, brainstorm project ideas, pick top skills, and boost your portfolio score. No coding needed!\n\nWhat would you like assistance with?`,
      timestamp: 'Just now',
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  // Parse Action Blocks in AI responses
  const parseActionBlock = (text: string) => {
    const actionTagline = text.match(/\[ACTION:UPDATE_TAGLINE\]\s*([\s\S]+?)\s*\[\/ACTION\]/i)
    if (actionTagline) {
      return {
        type: 'UPDATE_TAGLINE' as const,
        data: actionTagline[1].trim(),
        label: 'Apply Title to Portfolio',
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
        // ignore
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
        // ignore
      }
    }

    return undefined
  }

  const cleanDisplayText = (text: string) => {
    return text.replace(/\[ACTION:[A-Z_]+\][\s\S]+?\[\/ACTION\]/gi, '').trim()
  }

  const handleSend = async (msgToSend?: string) => {
    const text = (msgToSend || inputMessage).trim()
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
      const portfolioScore = getPortfolioScore()
      const portfolioContext = {
        name: profile?.name,
        tagline: profile?.tagline,
        bio: profile?.bio,
        score: portfolioScore.score,
        currentMode: activeMode,
      }

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          portfolioContext,
          currentMode: activeMode,
        }),
      })

      const data = await res.json()
      const replyRaw = data.reply || "I've analyzed your details. Let me know what you'd like to improve!"
      const action = parseActionBlock(replyRaw)

      const aiMsg: AIChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: cleanDisplayText(replyRaw),
        timestamp: 'Just now',
        action,
      }

      setMessages((prev) => [...prev, aiMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'ai',
          text: `Here is a helpful tip for your ${activeMode.toUpperCase()} portfolio: highlight your strongest 2 projects and keep your bio centered on the problems you enjoy solving!`,
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
        title: action.data.title || 'New Project',
        tagline: action.data.tagline || 'Modern web application',
        description: action.data.description || 'Built with React and modern web tools.',
        tech_stack: action.data.tech_stack || ['React', 'JavaScript', 'Tailwind CSS'],
        github_url: 'https://github.com',
        live_url: '',
        case_study_url: '',
        images: [],
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        is_featured: true,
        display_order: projects.length,
      })
    } else if (action.type === 'ADD_SKILL') {
      addSkill({
        name: action.data.name || 'New Skill',
        category: action.data.category || 'frontend',
        proficiency: 'advanced',
        display_order: skills.length,
      })
    }

    setAppliedActions((prev) => ({ ...prev, [msgId]: true }))
  }

  const starterChips = [
    { label: '✨ Write my bio', prompt: 'Write an attractive bio for me as a web developer.' },
    { label: '💡 Project ideas', prompt: 'Give me 2 impressive project ideas for a beginner portfolio.' },
    { label: '🎯 Top skills to add', prompt: 'Which essential skills should I add to my portfolio?' },
    { label: '📊 How to get 100% score?', prompt: 'What can I do to achieve a 100% portfolio score?' },
  ]

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all border border-cyan-400/40"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-cyan-200" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span>AI Helper</span>
        </button>
      )}

      {/* Side Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col rounded-2xl bg-[#0f1422] border border-cyan-500/30 shadow-2xl shadow-cyan-950/80 overflow-hidden text-slate-100 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-cyan-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>DevForge AI Helper</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </h3>
                <p className="text-[11px] text-slate-400">Beginner Portfolio Co-pilot</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.prompt)}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 hover:border-cyan-400 hover:text-cyan-300 text-slate-300 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai'
              const isApplied = appliedActions[msg.id]

              return (
                <div key={msg.id} className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      isAi ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {isAi ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`max-w-[85%] rounded-2xl p-3 ${
                    isAi
                      ? 'bg-slate-900 border border-slate-800 text-slate-200'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                  }`}>
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                    {/* Action Block if suggested by AI */}
                    {msg.action && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                        <button
                          onClick={() => handleApplyAction(msg.id, msg.action!)}
                          disabled={isApplied}
                          className={`w-full py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all text-xs ${
                            isApplied
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                          }`}
                        >
                          {isApplied ? (
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
                </div>
              )
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>AI Helper is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything (e.g. Write a bio for me)..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputMessage.trim() || isTyping}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
