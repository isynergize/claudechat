export interface Message {
  uuid: string
  sender: 'human' | 'assistant'
  text: string
  created_at: string
}

export interface Chat {
  uuid: string
  name: string
  created_at: string
  updated_at: string
  chat_messages: Message[]
}

export type TopicTag =
  | 'Work'
  | 'Learning'
  | 'Creative'
  | 'Technical'
  | 'Planning'
  | 'Personal'
  | 'Research'

export interface WordFrequency {
  text: string
  value: number
}

export interface ComputedAnnotation {
  topics: TopicTag[]
  topTerms: string[]
  wordFrequencies: WordFrequency[]
}

export interface UserAnnotation {
  note: string
  tags: string[]
}

export interface AnnotatedChat extends Chat {
  computed: ComputedAnnotation
  user: UserAnnotation
}

export interface PeriodReflection {
  note: string
}

export type PeriodKey = string // e.g. "2025-02", "2025-Q1", "2025"
export type PeriodMode = 'month' | 'quarter' | 'year'

export interface SessionState {
  chats: AnnotatedChat[]
  periodReflections: Record<PeriodKey, PeriodReflection>
  activePeriodMode: PeriodMode
  selectedPeriod: PeriodKey | null
  selectedChatId: string | null
  activeTopicFilter: TopicTag | null
  searchQuery: string
}

export type SessionAction =
  | { type: 'LOAD_CHATS'; payload: AnnotatedChat[] }
  | { type: 'ADD_NOTE'; chatId: string; note: string }
  | { type: 'ADD_TAG'; chatId: string; tag: string }
  | { type: 'REMOVE_TAG'; chatId: string; tag: string }
  | { type: 'SET_PERIOD_REFLECTION'; period: PeriodKey; note: string }
  | { type: 'SET_PERIOD_MODE'; mode: PeriodMode }
  | { type: 'SET_SELECTED_PERIOD'; period: PeriodKey | null }
  | { type: 'SET_SELECTED_CHAT'; chatId: string | null }
  | { type: 'SET_TOPIC_FILTER'; topic: TopicTag | null }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'CLEAR_SESSION' }
