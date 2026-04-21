import { useState, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { parseChats } from '../../lib/parser'
import { useSessionActions } from '../../context/SessionContext'
import { ThemeSwitcher } from '../UI/ThemeSwitcher'

export function UploadZone() {
  const [dragging, setDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { loadChats } = useSessionActions()

  const processFile = useCallback((file: File) => {
    if (!file.name.endsWith('.json')) {
      setErrors(['Please upload a .json file.'])
      return
    }
    setLoading(true)
    setErrors([])
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // Strip BOM if present (common in Windows-exported files)
        const text = (e.target?.result as string).replace(/^\uFEFF/, '').trim()
        const raw = JSON.parse(text)
        const { chats, errors: parseErrors } = parseChats(raw)
        if (chats.length === 0) {
          setErrors(['No valid chats found. ' + parseErrors.join(' ')])
        } else {
          if (parseErrors.length) setErrors(parseErrors)
          loadChats(chats)
        }
      } catch (err) {
        setErrors([`Could not parse JSON: ${err instanceof Error ? err.message : String(err)}`])
      } finally {
        setLoading(false)
      }
    }
    reader.readAsText(file)
  }, [loadChats])

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative"
      style={{ background: 'var(--bg)' }}>
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-heading)' }}>
          Claude Chat Analyzer
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-lg">
          Upload your Claude export to explore your thinking over time.
        </p>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="w-full max-w-lg rounded-2xl border-2 border-dashed transition-all duration-200 p-16 flex flex-col items-center gap-5 cursor-pointer"
        style={{
          borderColor: dragging ? 'var(--accent)' : 'var(--border)',
          background: dragging ? 'var(--accent-light)' : 'var(--bg-card)',
        }}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          ↑
        </div>

        <div className="text-center">
          <p className="font-semibold text-lg mb-1" style={{ color: 'var(--text-heading)' }}>
            {loading ? 'Processing...' : 'Drop your JSON file here'}
          </p>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">
            or click to browse — Claude export format (.json)
          </p>
        </div>

        <input
          id="file-input"
          type="file"
          accept=".json"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {errors.length > 0 && (
        <div className="mt-6 w-full max-w-lg rounded-xl p-4"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          {errors.map((e, i) => (
            <p key={i} className="text-sm" style={{ color: '#f87171' }}>{e}</p>
          ))}
        </div>
      )}

      <p className="mt-8 text-xs" style={{ color: 'var(--text-muted)' }}>
        All processing happens in your browser. Nothing is uploaded anywhere.
      </p>
    </div>
  )
}
