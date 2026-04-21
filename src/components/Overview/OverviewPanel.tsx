import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from 'recharts'
import { useSession } from '../../context/SessionContext'
import { groupByPeriod, sortedPeriodKeys, formatPeriodLabel } from '../../lib/periods'
import { mergeWordFrequencies } from '../../lib/wordFrequency'
import { WordCloudChart } from '../WordCloud/WordCloudChart'
import { CollapsibleCard } from '../UI/CollapsibleCard'
import type { TopicTag } from '../../types'

const ALL_TOPICS: TopicTag[] = ['Work','Learning','Creative','Technical','Planning','Personal','Research']

const TOPIC_COLORS: Record<TopicTag, string> = {
  Work:      '#fbbf24',
  Learning:  '#34d399',
  Creative:  '#e879f9',
  Technical: '#38bdf8',
  Planning:  '#7c6af7',
  Personal:  '#fb7185',
  Research:  '#fb923c',
}

export function OverviewPanel() {
  const { state } = useSession()

  const grouped = useMemo(
    () => groupByPeriod(state.chats, 'month'),
    [state.chats]
  )
  const periods = useMemo(() => sortedPeriodKeys(Object.keys(grouped)), [grouped])

  const trendData = useMemo(() =>
    periods.map(period => {
      const chatsInPeriod = grouped[period] ?? []
      const row: Record<string, number | string> = { period: formatPeriodLabel(period) }
      for (const topic of ALL_TOPICS) {
        row[topic] = chatsInPeriod.filter(c => c.computed.topics.includes(topic)).length
      }
      return row
    }),
    [periods, grouped]
  )

  const topicPieData = useMemo(() => {
    return ALL_TOPICS.map(topic => ({
      name: topic,
      value: state.chats.filter(c => c.computed.topics.includes(topic)).length,
    })).filter(d => d.value > 0)
  }, [state.chats])

  const globalCloud = useMemo(
    () => mergeWordFrequencies(state.chats.map(c => c.computed.wordFrequencies)),
    [state.chats]
  )

  const mostActivePeriod = useMemo(() => {
    if (!periods.length) return null
    const peak = periods.reduce((a, b) =>
      (grouped[a]?.length ?? 0) >= (grouped[b]?.length ?? 0) ? a : b
    )
    return { label: formatPeriodLabel(peak), count: grouped[peak]?.length ?? 0 }
  }, [periods, grouped])

  const totalMessages = useMemo(
    () => state.chats.reduce((sum, c) => sum + c.chat_messages.length, 0),
    [state.chats]
  )

  const avgMessages = state.chats.length
    ? Math.round(totalMessages / state.chats.length)
    : 0

  return (
    <div id="overview-panel" className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Overview</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          All-time summary of your Claude conversations.
        </p>
      </div>

      {/* Stat cards — always visible, no collapse needed */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Total Chats', value: state.chats.length },
          { label: 'Total Messages', value: totalMessages },
          { label: 'Avg Messages / Chat', value: avgMessages },
          { label: 'Most Active', value: mostActivePeriod ? `${mostActivePeriod.label} (${mostActivePeriod.count})` : '—' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            <p className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <CollapsibleCard title="Topic Trends Over Time">
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                  tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                  tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderRadius: 8, fontSize: 12, color: 'var(--text)',
                }} />
                {ALL_TOPICS.map(topic => (
                  <Area key={topic} type="monotone" dataKey={topic} stackId="1"
                    stroke={TOPIC_COLORS[topic]} fill={TOPIC_COLORS[topic]}
                    fillOpacity={0.6} strokeWidth={1.5} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="Topic Distribution">
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={topicPieData} cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {topicPieData.map(entry => (
                    <Cell key={entry.name} fill={TOPIC_COLORS[entry.name as TopicTag]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: 'var(--text)', fontSize: 12 }}>{value}</span>
                  )} />
                <Tooltip contentStyle={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderRadius: 8, fontSize: 12, color: 'var(--text)',
                }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CollapsibleCard>
      </div>

      <CollapsibleCard title="All-Time Word Cloud">
        <div className="p-4">
          <WordCloudChart words={globalCloud} width={900} height={300} />
        </div>
      </CollapsibleCard>
    </div>
  )
}
