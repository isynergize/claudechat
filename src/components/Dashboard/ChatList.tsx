import { useMemo } from 'react'
import { useSession } from '../../context/SessionContext'
import { groupByPeriod } from '../../lib/periods'
import { ChatCard } from './ChatCard'
import type { AnnotatedChat } from '../../types'

export function ChatList() {
  const { state } = useSession()

  const filteredChats = useMemo(() => {
    let chats: AnnotatedChat[] = state.chats

    if (state.selectedPeriod) {
      const grouped = groupByPeriod(chats, state.activePeriodMode)
      chats = grouped[state.selectedPeriod] ?? []
    }

    if (state.activeTopicFilter) {
      chats = chats.filter(c => c.computed.topics.includes(state.activeTopicFilter!))
    }

    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase()
      chats = chats.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.user.note.toLowerCase().includes(q) ||
        c.user.tags.some(t => t.toLowerCase().includes(q)) ||
        c.computed.topTerms.some(t => t.toLowerCase().includes(q))
      )
    }

    return chats.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }, [state.chats, state.selectedPeriod, state.activePeriodMode, state.activeTopicFilter, state.searchQuery])

  if (filteredChats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center"
        style={{ color: 'var(--text-muted)' }}>
        No chats match the current filters.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto">
      {filteredChats.map(chat => (
        <ChatCard key={chat.uuid} chat={chat} selected={state.selectedChatId === chat.uuid} />
      ))}
    </div>
  )
}
