import { useMemo } from 'react'
import { useSession, useSessionActions } from '../../context/SessionContext'
import { groupByPeriod, sortedPeriodKeys, formatPeriodLabel } from '../../lib/periods'
import { TopicBadge } from './TopicBadge'
import type { TopicTag, PeriodMode } from '../../types'

const ALL_TOPICS: TopicTag[] = ['Work','Learning','Creative','Technical','Planning','Personal','Research']
const PERIOD_MODES: PeriodMode[] = ['month','quarter','year']

export function Sidebar() {
  const { state } = useSession()
  const { setPeriodMode, setSelectedPeriod, setTopicFilter, clearSession } = useSessionActions()

  const grouped = useMemo(
    () => groupByPeriod(state.chats, state.activePeriodMode),
    [state.chats, state.activePeriodMode]
  )
  const periods = useMemo(() => sortedPeriodKeys(Object.keys(grouped)), [grouped])

  return (
    <aside className="flex flex-col h-full overflow-hidden"
      style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)', width: 240, minWidth: 240 }}>

      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--text-muted)' }}>View by</p>
        <div className="flex gap-1">
          {PERIOD_MODES.map(m => (
            <button key={m} onClick={() => setPeriodMode(m)}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
              style={{
                background: state.activePeriodMode === m ? 'var(--accent)' : 'var(--bg-elevated)',
                color: state.activePeriodMode === m ? '#fff' : 'var(--text-muted)',
              }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <p className="px-4 py-2 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}>Periods</p>
        {periods.map(p => (
          <button key={p} onClick={() => setSelectedPeriod(p)}
            className="w-full text-left px-4 py-2 text-sm transition-all"
            style={{
              background: state.selectedPeriod === p ? 'var(--accent-light)' : 'transparent',
              color: state.selectedPeriod === p ? 'var(--accent)' : 'var(--text)',
              borderLeft: state.selectedPeriod === p ? '2px solid var(--accent)' : '2px solid transparent',
            }}>
            <span className="font-medium">{formatPeriodLabel(p)}</span>
            <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              {grouped[p]?.length ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'var(--text-muted)' }}>Filter by Topic</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TOPICS.map(t => (
            <TopicBadge
              key={t} topic={t} small
              active={state.activeTopicFilter === t}
              onClick={() => setTopicFilter(state.activeTopicFilter === t ? null : t)}
            />
          ))}
        </div>
      </div>

      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <button onClick={clearSession}
          className="w-full py-2 rounded-lg text-xs font-semibold transition-all"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
          Upload New File
        </button>
      </div>
    </aside>
  )
}
