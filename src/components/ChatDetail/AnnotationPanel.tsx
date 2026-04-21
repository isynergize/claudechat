import { useState, useCallback } from 'react'
import type { AnnotatedChat } from '../../types'
import { useSessionActions } from '../../context/SessionContext'
import { TopicBadge } from '../Dashboard/TopicBadge'

interface Props {
  chat: AnnotatedChat
}

export function AnnotationPanel({ chat }: Props) {
  const { addNote, addTag, removeTag } = useSessionActions()
  const [tagInput, setTagInput] = useState('')

  const handleTagKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
      if (tag && !chat.user.tags.includes(tag)) {
        addTag(chat.uuid, tag)
      }
      setTagInput('')
    }
  }, [tagInput, chat.uuid, chat.user.tags, addTag])

  return (
    <div className="rounded-xl p-4 flex flex-col gap-4"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: 'var(--text-muted)' }}>Computed Topics</p>
        <div className="flex flex-wrap gap-1.5">
          {chat.computed.topics.length > 0
            ? chat.computed.topics.map(t => <TopicBadge key={t} topic={t} small />)
            : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>None detected</span>
          }
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: 'var(--text-muted)' }}>Top Terms</p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
          {chat.computed.topTerms.slice(0, 12).join(' · ')}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: 'var(--text-muted)' }}>Your Note</p>
        <textarea
          value={chat.user.note}
          onChange={e => addNote(chat.uuid, e.target.value)}
          placeholder="Add a reflection or context for this chat..."
          rows={3}
          className="w-full rounded-lg px-3 py-2 text-sm resize-none outline-none transition-all"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: 'var(--text-muted)' }}>Your Tags</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {chat.user.tags.map(tag => (
            <span key={tag}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)' }}>
              #{tag}
              <button onClick={() => removeTag(chat.uuid, tag)}
                style={{ color: 'var(--text-muted)' }} className="hover:text-red-400">×</button>
            </span>
          ))}
        </div>
        <input
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Type a tag and press Enter..."
          className="w-full rounded-lg px-3 py-1.5 text-sm outline-none"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
      </div>
    </div>
  )
}
