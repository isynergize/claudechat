import { useSession, useSessionActions } from '../../context/SessionContext'

export function SearchBar() {
  const { state } = useSession()
  const { setSearchQuery } = useSessionActions()

  return (
    <input
      type="text"
      value={state.searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      placeholder="Search chats, notes, tags, terms..."
      className="w-full max-w-md px-4 py-2 rounded-lg text-sm outline-none transition-all"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
      }}
    />
  )
}
