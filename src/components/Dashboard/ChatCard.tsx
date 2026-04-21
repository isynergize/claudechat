import type { AnnotatedChat } from '../../types'
import { TopicBadge } from './TopicBadge'
import { useSessionActions } from '../../context/SessionContext'

interface Props {
  chat: AnnotatedChat
  selected: boolean
}

export function ChatCard({ chat, selected }: Props) {
  const { setSelectedChat } = useSessionActions()
  const preview = chat.chat_messages.find(m => m.sender === 'human')?.text ?? ''
  const date = new Date(chat.created_at).toLocaleDateString('default', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
  const hasNote = chat.user.note.trim().length > 0
  const hasUserTags = chat.user.tags.length > 0

  return (
    <div
      onClick={() => setSelectedChat(chat.uuid)}
      className="rounded-xl p-4 cursor-pointer transition-all duration-150"
      style={{
        background: selected ? 'var(--accent-light)' : 'var(--bg-card)',
        border: `1px solid ${selected ? 'var(--accent-border)' : 'var(--border)'}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2"
          style={{ color: 'var(--text-heading)' }}>
          {chat.name || 'Untitled Chat'}
        </h3>
        <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>{date}</span>
      </div>

      <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>
        {preview.slice(0, 120)}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        {chat.computed.topics.map(t => (
          <TopicBadge key={t} topic={t} small />
        ))}
        {hasUserTags && chat.user.tags.map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontSize: 11 }}>
            #{tag}
          </span>
        ))}
        {hasNote && (
          <span className="ml-auto text-xs" style={{ color: 'var(--accent)' }} title="Has note">
            ✎
          </span>
        )}
      </div>

      <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        {chat.chat_messages.length} messages
      </div>
    </div>
  )
}
