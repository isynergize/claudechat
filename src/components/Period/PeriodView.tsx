import { useMemo } from 'react'
import { useSession, useSessionActions } from '../../context/SessionContext'
import { groupByPeriod, formatPeriodLabel } from '../../lib/periods'
import { mergeWordFrequencies } from '../../lib/wordFrequency'
import { WordCloudChart } from '../WordCloud/WordCloudChart'
import { TopicBadge } from '../Dashboard/TopicBadge'
import { CollapsibleCard } from '../UI/CollapsibleCard'
import type { TopicTag } from '../../types'

export function PeriodView() {
  const { state } = useSession()
  const { setPeriodReflection } = useSessionActions()

  const grouped = useMemo(
    () => groupByPeriod(state.chats, state.activePeriodMode),
    [state.chats, state.activePeriodMode]
  )

  const periodChats = useMemo(
    () => (state.selectedPeriod ? grouped[state.selectedPeriod] ?? [] : []),
    [grouped, state.selectedPeriod]
  )

  const mergedCloud = useMemo(
    () => mergeWordFrequencies(periodChats.map(c => c.computed.wordFrequencies)),
    [periodChats]
  )

  const topTerms = useMemo(() => {
    const termCount: Record<string, number> = {}
    for (const chat of periodChats) {
      for (const term of chat.computed.topTerms) {
        termCount[term] = (termCount[term] ?? 0) + 1
      }
    }
    return Object.entries(termCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([term]) => term)
  }, [periodChats])

  const topicCounts = useMemo(() => {
    const counts: Partial<Record<TopicTag, number>> = {}
    for (const chat of periodChats) {
      for (const topic of chat.computed.topics) {
        counts[topic] = (counts[topic] ?? 0) + 1
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) as [TopicTag, number][]
  }, [periodChats])

  if (!state.selectedPeriod) return null

  const label = formatPeriodLabel(state.selectedPeriod)
  const reflection = state.periodReflections[state.selectedPeriod]?.note ?? ''

  return (
    <div id="period-view" className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: 'var(--text-muted)' }}>Period</p>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{label}</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {periodChats.length} chat{periodChats.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <CollapsibleCard title="Period Word Cloud">
          <div className="p-4">
            <WordCloudChart words={mergedCloud} width={480} height={260} />
          </div>
        </CollapsibleCard>

        <div className="flex flex-col gap-4">
          <CollapsibleCard title="Top Themes">
            <div className="p-4 flex flex-col gap-3">
              {topicCounts.length > 0 ? (
                <>
                  {topicCounts.map(([topic, count]) => (
                    <div key={topic} className="flex items-center gap-3">
                      <TopicBadge topic={topic} small />
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'var(--bg-elevated)' }}>
                        <div className="h-full rounded-full"
                          style={{
                            width: `${Math.round((count / periodChats.length) * 100)}%`,
                            background: 'var(--accent)',
                          }} />
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{count}</span>
                    </div>
                  ))}
                  {topTerms.length > 0 && (
                    <p className="text-xs leading-relaxed pt-2" style={{ color: 'var(--text)', borderTop: '1px solid var(--border)' }}>
                      {topTerms.join(' · ')}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No topics detected.</p>
              )}
            </div>
          </CollapsibleCard>

          <CollapsibleCard title="Your Reflection">
            <div className="p-4">
              <textarea
                value={reflection}
                onChange={e => setPeriodReflection(state.selectedPeriod!, e.target.value)}
                placeholder={`What were you focused on in ${label}?`}
                rows={4}
                className="w-full rounded-lg px-3 py-2 text-sm resize-none outline-none"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              />
            </div>
          </CollapsibleCard>
        </div>
      </div>

      {periodChats.length > 0 && (
        <CollapsibleCard title="Chats in this Period" badge={String(periodChats.length)} defaultOpen={false}>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {periodChats.map(chat => (
              <div key={chat.uuid} className="px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-heading)' }}>
                    {chat.name || 'Untitled Chat'}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {chat.chat_messages.length} messages
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {chat.computed.topics.slice(0, 2).map(t => (
                    <TopicBadge key={t} topic={t} small />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleCard>
      )}
    </div>
  )
}
