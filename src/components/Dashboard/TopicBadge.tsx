import type { TopicTag } from '../../types'

const TOPIC_COLORS: Record<TopicTag, { bg: string; text: string }> = {
  Work:     { bg: 'rgba(251,191,36,0.15)',  text: '#fbbf24' },
  Learning: { bg: 'rgba(52,211,153,0.15)',  text: '#34d399' },
  Creative: { bg: 'rgba(232,121,249,0.15)', text: '#e879f9' },
  Technical:{ bg: 'rgba(56,189,248,0.15)',  text: '#38bdf8' },
  Planning: { bg: 'rgba(124,106,247,0.15)', text: '#7c6af7' },
  Personal: { bg: 'rgba(251,113,133,0.15)', text: '#fb7185' },
  Research: { bg: 'rgba(251,146,60,0.15)',  text: '#fb923c' },
}

interface Props {
  topic: TopicTag
  small?: boolean
  onClick?: () => void
  active?: boolean
}

export function TopicBadge({ topic, small, onClick, active }: Props) {
  const colors = TOPIC_COLORS[topic]
  return (
    <span
      onClick={onClick}
      style={{
        background: active ? colors.text : colors.bg,
        color: active ? '#0f0f13' : colors.text,
        fontSize: small ? 11 : 12,
        padding: small ? '2px 7px' : '3px 10px',
        borderRadius: 999,
        fontWeight: 600,
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-block',
        userSelect: 'none',
      }}
    >
      {topic}
    </span>
  )
}
