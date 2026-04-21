import { useMemo } from 'react'
import { useSession, useSessionActions } from '../../context/SessionContext'
import { WordCloudChart } from '../WordCloud/WordCloudChart'
import { AnnotationPanel } from './AnnotationPanel'
import { CollapsibleCard } from '../UI/CollapsibleCard'

export function ChatDetail() {
  const { state } = useSession()
  const { setSelectedChat } = useSessionActions()

  const chat = useMemo(
    () => state.chats.find(c => c.uuid === state.selectedChatId) ?? null,
    [state.chats, state.selectedChatId]
  )

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center"
        style={{ color: 'var(--text-muted)' }}>
        Select a chat to view details.
      </div>
    )
  }

  const date = new Date(chat.created_at).toLocaleDateString('default', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div id="chat-detail" className="flex-1 flex flex-col h-full overflow-hidden">

      {/* Fixed top — header + collapsible cards */}
      <div className="shrink-0 p-6 flex flex-col gap-4 overflow-y-auto"
        style={{ maxHeight: '55%', borderBottom: '1px solid var(--border)' }}>

        <div className="flex items-start justify-between gap-4">
          <div>
            <button onClick={() => setSelectedChat(null)}
              className="text-xs mb-2 flex items-center gap-1"
              style={{ color: 'var(--text-muted)' }}>
              ← Back
            </button>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
              {chat.name || 'Untitled Chat'}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{date}</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
            {chat.chat_messages.length} messages
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <CollapsibleCard title="Word Cloud">
            <div className="p-4">
              <WordCloudChart words={chat.computed.wordFrequencies} width={480} height={240} />
            </div>
          </CollapsibleCard>

          <CollapsibleCard title="Annotations">
            <div className="p-4">
              <AnnotationPanel chat={chat} />
            </div>
          </CollapsibleCard>
        </div>
      </div>

      {/* Independently scrollable conversation */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="px-6 py-3 shrink-0 flex items-center justify-between"
          style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}>Conversation</p>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {chat.chat_messages.length} messages
          </span>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col divide-y"
          style={{ borderColor: 'var(--border)' }}>
          {chat.chat_messages.map(msg => (
            <div key={msg.uuid} className="px-6 py-4"
              style={{ background: msg.sender === 'human' ? 'var(--bg-card)' : 'var(--bg)' }}>
              <p className="text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color: msg.sender === 'human' ? 'var(--accent)' : 'var(--text-muted)' }}>
                {msg.sender === 'human' ? 'You' : 'Claude'}
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: 'var(--text)', lineHeight: '1.7' }}>
                {msg.text}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
