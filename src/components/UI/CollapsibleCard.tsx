import { useState, type ReactNode } from 'react'

interface Props {
  title: string
  defaultOpen?: boolean
  children: ReactNode
  badge?: string
}

export function CollapsibleCard({ title, defaultOpen = true, children, badge }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors"
        style={{ background: 'var(--bg-elevated)' }}
      >
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}>{title}</p>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
              {badge}
            </span>
          )}
        </div>
        <span
          className="text-xs transition-transform duration-200"
          style={{
            color: 'var(--text-muted)',
            display: 'inline-block',
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
          }}
        >
          ▾
        </span>
      </button>

      <div style={{
        display: open ? 'block' : 'none',
        background: 'var(--bg-card)',
      }}>
        {children}
      </div>
    </div>
  )
}
