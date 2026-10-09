import { useState, useRef, useEffect } from 'react'
import {
  Bot,
  Loader2,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react'


import { useAppContext } from '../../context/useAppContext'

export default function SkillSetuAiAssistant() {
  const { currentEmployee } = useAppContext()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hello ${currentEmployee?.name || 'there'}! I am the SkillSetu AI Assistant. I can explain competency gaps, recommend demo learning paths, and describe evidence review. I cannot access your employee profile, and my answers are not official MoSPI advice.`,
      source: 'SkillSetu Assistant',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)
  const messageIdRef = useRef(0)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const suggestedQuestions = [
    'Why is verified competency needed for project matching?',
    'Where can I see my highest-priority skill gap?',
    'How do I submit proof for reviewer approval?',
  ]

  const handleSendMessage = async (textToSend, retryMessageId = null) => {
    const query = textToSend || input
    if (!query.trim() || loading) return

    const userMsg = {
      id: `u-${++messageIdRef.current}`,
      role: 'user',
      text: query,
    }

    setMessages((prev) => [
      ...prev.filter((message) => message.id !== retryMessageId),
      userMsg,
    ])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/assistant/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
        }),
      })

      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      const data = await res.json()

      const botMsg = {
        id: `a-${++messageIdRef.current}`,
        role: 'assistant',
        text: data.reply || 'I am ready to assist with your competency profile.',
        source: data.source === 'gemini-2.5-flash'
          ? 'Gemini 2.5 Flash'
          : data.source === 'built-in-fallback' || data.source === 'fallback-on-error'
            ? 'Built-in demo response'
            : 'SkillSetu Intelligence',
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => [
      ...prev,
      {
        id: `err-${++messageIdRef.current}`,
        role: 'assistant',
        text: 'I could not reach the assistant service. Check your connection and try again.',
        source: 'Connection error',
        retryText: query,
      },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: `Conversation reset. Ask about SkillSetu learning paths or evidence review, ${currentEmployee?.name}. I cannot access your employee profile.`,
        source: 'SkillSetu Assistant',
      },
    ])
  }

  return (
    <>
      {/* Floating launcher trigger button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-xl ring-2 ring-emerald-400/50 transition-all hover:bg-slate-800 hover:scale-105 cursor-pointer"
          aria-label="Open AI Competency Assistant"
        >
          <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-white">
            <Sparkles size={14} />
          </span>
          <span>Ask SkillSetu AI</span>
          <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-300">
            AI Assistant
          </span>
        </button>
      )}

      {/* Slide-over or docked chat drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[580px] w-96 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-emerald-500 text-white">
                <Bot size={16} />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-extrabold">SkillSetu AI Assistant</h4>
                  <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[8px] font-bold text-emerald-300">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Learning guidance · no profile access</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="rounded p-1 text-slate-400 hover:text-white"
                title="Reset conversation"
                disabled={loading}
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-white"
                aria-label="Close assistant"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white font-medium rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <span className="mt-1 px-1 text-[9px] font-semibold text-slate-400">
                  {m.source || (m.role === 'user' ? 'You' : 'Assistant')}
                </span>
                {m.retryText && (
                  <button
                    type="button"
                    onClick={() => handleSendMessage(m.retryText, m.id)}
                    disabled={loading}
                    className="mt-1 rounded px-1 text-[10px] font-bold text-emerald-700 underline underline-offset-2 disabled:opacity-50"
                  >
                    Retry
                  </button>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 rounded-xl bg-white p-3 text-xs text-slate-500 border border-slate-200 w-fit">
                <Loader2 size={13} className="animate-spin text-emerald-600" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="border-t border-slate-100 bg-white px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Suggested questions:
              </p>
              <div className="flex flex-col gap-1">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="truncate rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-left text-[11px] font-medium text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50 cursor-pointer"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              placeholder="Ask about competencies, gaps, or verification..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="grid size-8 place-items-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-40 cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
          <p className="bg-white px-3 pb-2 text-[9px] text-slate-400">
            Do not enter personal or sensitive information.
          </p>
        </div>
      )}
    </>
  )
}
