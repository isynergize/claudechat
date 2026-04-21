import type { AnnotatedChat, PeriodKey, PeriodMode } from '../types'

export function getPeriodKey(dateStr: string, mode: PeriodMode): PeriodKey {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = d.getMonth() + 1

  if (mode === 'year') return `${year}`
  if (mode === 'quarter') return `${year}-Q${Math.ceil(month / 3)}`
  return `${year}-${String(month).padStart(2, '0')}`
}

export function groupByPeriod(
  chats: AnnotatedChat[],
  mode: PeriodMode
): Record<PeriodKey, AnnotatedChat[]> {
  const groups: Record<PeriodKey, AnnotatedChat[]> = {}
  for (const chat of chats) {
    const key = getPeriodKey(chat.created_at, mode)
    if (!groups[key]) groups[key] = []
    groups[key].push(chat)
  }
  return groups
}

export function sortedPeriodKeys(keys: PeriodKey[]): PeriodKey[] {
  return [...keys].sort((a, b) => a.localeCompare(b))
}

export function formatPeriodLabel(key: PeriodKey): string {
  if (/^\d{4}$/.test(key)) return key
  if (/^\d{4}-Q\d$/.test(key)) {
    const [year, q] = key.split('-')
    return `${q} ${year}`
  }
  const [year, month] = key.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleString('default', { month: 'long', year: 'numeric' })
}
