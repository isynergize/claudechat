import type { Chat, AnnotatedChat, Message } from '../types'
import { computeWordFrequencies } from './wordFrequency'
import { classifyTopics } from './taxonomy'

interface RawContent {
  type: string
  text?: string
}

function extractText(m: Record<string, unknown>): string {
  // Prefer top-level text, fall back to joining content[].text blocks
  if (typeof m.text === 'string' && m.text.trim()) return m.text
  if (Array.isArray(m.content)) {
    return (m.content as RawContent[])
      .filter(c => c.type === 'text' && typeof c.text === 'string')
      .map(c => c.text!)
      .join('\n')
      .trim()
  }
  return ''
}

function isValidMessage(m: unknown): m is Message {
  if (typeof m !== 'object' || m === null) return false
  const msg = m as Record<string, unknown>
  return (
    typeof msg.uuid === 'string' &&
    (msg.sender === 'human' || msg.sender === 'assistant') &&
    typeof msg.created_at === 'string' &&
    extractText(msg).length > 0
  )
}

function isValidChat(c: unknown): c is Chat {
  return (
    typeof c === 'object' && c !== null &&
    typeof (c as Chat).uuid === 'string' &&
    typeof (c as Chat).name === 'string' &&
    typeof (c as Chat).created_at === 'string' &&
    Array.isArray((c as Chat).chat_messages)
  )
}

export function parseChats(raw: unknown): { chats: AnnotatedChat[]; errors: string[] } {
  const errors: string[] = []

  if (!Array.isArray(raw)) {
    return { chats: [], errors: ['JSON must be an array of chat objects.'] }
  }

  const chats: AnnotatedChat[] = []

  for (let i = 0; i < raw.length; i++) {
    const item = raw[i]
    if (!isValidChat(item)) {
      errors.push(`Item at index ${i} is missing required fields (uuid, name, created_at, chat_messages).`)
      continue
    }

    const validMessages = item.chat_messages
      .map((m: Record<string, unknown>) => ({ ...m, text: extractText(m) }))
      .filter((m, j) => {
        if (!isValidMessage(m)) {
          errors.push(`Chat "${item.name}": message at index ${j} is invalid, skipped.`)
          return false
        }
        return true
      })

    const wordFrequencies = computeWordFrequencies(validMessages)
    const topTerms = wordFrequencies.slice(0, 20).map(w => w.text)
    const topics = classifyTopics(topTerms)

    chats.push({
      ...item,
      chat_messages: validMessages,
      computed: { topics, topTerms, wordFrequencies },
      user: { note: '', tags: [] },
    })
  }

  return { chats, errors }
}
