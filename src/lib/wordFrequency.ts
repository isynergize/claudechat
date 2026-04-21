import { STOPWORDS } from './stopwords'
import type { Message, WordFrequency } from '../types'

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    // Strip contractions entirely before splitting (you're → you, it's → it)
    .replace(/'\w+/g, '')
    // Strip possessives (claude's → claude)
    .replace(/\w+'\s/g, ' ')
    // Remove all non-alpha characters
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOPWORDS.has(w))
}

export function computeWordFrequencies(messages: Message[]): WordFrequency[] {
  const counts: Record<string, number> = {}

  for (const msg of messages) {
    const tokens = tokenize(msg.text)
    for (const token of tokens) {
      counts[token] = (counts[token] ?? 0) + 1
    }
  }

  return Object.entries(counts)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 100)
}

export function mergeWordFrequencies(allFreqs: WordFrequency[][]): WordFrequency[] {
  const merged: Record<string, number> = {}
  for (const freqs of allFreqs) {
    for (const { text, value } of freqs) {
      merged[text] = (merged[text] ?? 0) + value
    }
  }
  return Object.entries(merged)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 150)
}
