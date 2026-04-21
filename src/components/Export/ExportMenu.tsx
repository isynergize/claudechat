import { useState, useRef, useEffect } from 'react'
import { useSession } from '../../context/SessionContext'
import { exportJSON, exportCSV, exportElementAsPng, exportElementAsPdf } from '../../lib/export'

export function ExportMenu() {
  const { state } = useSession()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const activeElementId = state.selectedChatId
    ? 'chat-detail'
    : state.selectedPeriod
    ? 'period-view'
    : 'overview-panel'

  async function handle(action: string) {
    setLoading(action)
    setOpen(false)
    try {
      if (action === 'json') {
        exportJSON(state.chats, state.periodReflections)
      } else if (action === 'csv') {
        exportCSV(state.chats)
      } else if (action === 'png') {
        await exportElementAsPng(activeElementId, `claude-chats-${Date.now()}.png`)
      } else if (action === 'pdf') {
        await exportElementAsPdf(activeElementId, `claude-chats-${Date.now()}.pdf`)
      }
    } finally {
      setLoading(null)
    }
  }

  const options = [
    { key: 'json', label: 'Export JSON', desc: 'Full data + annotations' },
    { key: 'csv',  label: 'Export CSV',  desc: 'Metadata table' },
    { key: 'png',  label: 'Export PNG',  desc: 'Current view as image' },
    { key: 'pdf',  label: 'Export PDF',  desc: 'Current view as PDF' },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={!!loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        style={{
          background: 'var(--accent-light)',
          color: 'var(--accent)',
          border: '1px solid var(--accent-border)',
        }}
      >
        {loading ? 'Exporting...' : 'Export'}
        <span style={{ fontSize: 10 }}>▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden z-50"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          {options.map(opt => (
            <button
              key={opt.key}
              onClick={() => handle(opt.key)}
              className="w-full text-left px-4 py-3 transition-all hover:bg-white/5 flex flex-col gap-0.5"
            >
              <span className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>
                {opt.label}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{opt.desc}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
