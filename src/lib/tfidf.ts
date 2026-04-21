import { STOPWORDS } from './stopwords'
import type { AnnotatedChat } from '../types'

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w))
}

function termFrequency(tokens: string[]): Record<string, number> {
  const tf: Record<string, number> = {}
  for (const t of tokens) tf[t] = (tf[t] ?? 0) + 1
  const max = Math.max(...Object.values(tf), 1)
  for (const t in tf) tf[t] = tf[t] / max
  return tf
}

export function computeTFIDF(chats: AnnotatedChat[]): Record<string, string[]> {
  const chatTokens = chats.map(c => {
    const humanText = c.chat_messages
      .filter(m => m.sender === 'human')
      .map(m => m.text)
      .join(' ')
    return tokenize(humanText)
  })

  const docCount = chats.length
  const dfMap: Record<string, number> = {}
  for (const tokens of chatTokens) {
    const seen = new Set(tokens)
    for (const t of seen) dfMap[t] = (dfMap[t] ?? 0) + 1
  }

  const result: Record<string, string[]> = {}

  chats.forEach((chat, i) => {
    const tf = termFrequency(chatTokens[i])
    const scores: Record<string, number> = {}
    for (const term in tf) {
      const idf = Math.log((docCount + 1) / ((dfMap[term] ?? 0) + 1)) + 1
      scores[term] = tf[term] * idf
    }
    result[chat.uuid] = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([term]) => term)
  })

  return result
}
