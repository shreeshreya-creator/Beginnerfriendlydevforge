import React, { useState } from 'react'
import {
  Users,
  X,
  Copy,
  Check,
  Shield,
  UserPlus,
  Trash2,
  Radio,
  Sparkles,
  Link as LinkIcon,
  Crown
} from 'lucide-react'
import { usePortfolioStore } from '@/store/portfolioStore'
import type { CollabRole } from '@/types'

interface CollabModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CollabModal: React.FC<CollabModalProps> = ({ isOpen, onClose }) => {
  const {
    collaborators,
    addCollaborator,
    removeCollaborator,
    collabRoomId,
    isSimulatedPeerActive,
    toggleSimulatedPeers,
    isCollabLive
  } = usePortfolioStore()

  const [copied, setCopied] = useState(false)
  const [newCollabName, setNewCollabName] = useState('')
  const [newCollabRole, setNewCollabRole] = useState<CollabRole>('editor')

  if (!isOpen) return null

  const shareableUrl = `${window.location.origin}/dashboard?room=${collabRoomId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCollabName.trim()) return
    addCollaborator(newCollabName.trim(), newCollabRole)
    setNewCollabName('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f121a] border border-[#21283b] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#21283b] flex items-center justify-between bg-[#141824]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Real-Time Collaboration
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Room Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Invite team members or mentors to build, review, and refine together
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

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Shareable Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
              Direct Multiplayer Invite Link
            </label>
            <div className="flex items-center gap-2 bg-[#090b10] border border-[#21283b] p-2 rounded-xl">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="bg-transparent text-xs font-mono text-cyan-300 flex-1 outline-none select-all px-2"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Anyone with this link can view real-time changes and submit review suggestions.
            </p>
          </div>

          {/* Active Collaborators List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-300">
                Connected Collaborators ({collaborators.length})
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                BroadcastChannel Sync Online
              </span>
            </div>

            <div className="space-y-2">
              {collaborators.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#141824] border border-[#21283b] hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-9 h-9 rounded-full object-cover ring-2"
                        style={{ borderColor: c.color }}
                      />
                      <span
                        className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#141824]"
                        style={{ backgroundColor: c.color }}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        {c.name}
                        {c.role === 'host' && (
                          <Crown className="w-3 h-3 text-amber-400 inline" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                        <span className="capitalize text-slate-300">{c.role}</span>
                        <span>•</span>
                        <span className="text-emerald-400">{c.status}</span>
                        {c.activeSection && (
                          <>
                            <span>•</span>
                            <span className="text-cyan-400/80">in #{c.activeSection}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border"
                      style={{
                        backgroundColor: `${c.color}15`,
                        borderColor: `${c.color}40`,
                        color: c.color,
                      }}
                    >
                      {c.role}
                    </span>
                    {c.role !== 'host' && (
                      <button
                        onClick={() => removeCollaborator(c.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAdd} className="space-y-3 pt-2 border-t border-[#21283b]">
            <span className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-purple-400" />
              Add Team Member or Reviewer
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Name or Github Handle (e.g. Sarah Connor)"
                value={newCollabName}
                onChange={(e) => setNewCollabName(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <select
                value={newCollabRole}
                onChange={(e) => setNewCollabRole(e.target.value as CollabRole)}
                className="px-3 py-2 bg-[#090b10] border border-[#21283b] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="editor">Editor</option>
                <option value="reviewer">Reviewer</option>
                <option value="viewer">Viewer</option>
              </select>
              <button
                type="submit"
                disabled={!newCollabName.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all"
              >
                Add
              </button>
            </div>
          </form>

          {/* Simulated Peer Toggle */}
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-cyan-200">Simulate Live Peer Reviewers</p>
                <p className="text-[11px] text-cyan-300/70">
                  Generates realistic team presence, active cursor tags, and review feedback.
                </p>
              </div>
            </div>
            <button
              onClick={toggleSimulatedPeers}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                isSimulatedPeerActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isSimulatedPeerActive ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#21283b] bg-[#141824]/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
