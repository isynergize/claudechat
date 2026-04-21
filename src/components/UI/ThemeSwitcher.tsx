import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { THEMES } from '../../lib/themes'

const ACCENT_SWATCHES: Record<string, string> = {
  benedict: '#7c6af7',
  phoebe:   '#c8853a',
  adriana:  '#e8175d',
  jj:       '#111111',
}

export function ThemeSwitcher() {
  const { themeId, setThemeId } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = THEMES.find(t => t.id === themeId)!

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
      >
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ background: ACCENT_SWATCHES[themeId] }}
        />
        {current.name}
        <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>▾</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden z-50"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => { setThemeId(theme.id); setOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
              style={{
                background: themeId === theme.id ? 'var(--accent-light)' : 'transparent',
                color: themeId === theme.id ? 'var(--accent)' : 'var(--text)',
              }}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: ACCENT_SWATCHES[theme.id] }}
              />
              <span className="text-sm font-semibold">{theme.name}</span>
              {themeId === theme.id && (
                <span className="ml-auto text-xs" style={{ color: 'var(--accent)' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
