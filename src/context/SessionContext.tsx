import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { SessionState, SessionAction, PeriodMode, TopicTag } from '../types'

const initialState: SessionState = {
  chats: [],
  periodReflections: {},
  activePeriodMode: 'month',
  selectedPeriod: null,
  selectedChatId: null,
  activeTopicFilter: null,
  searchQuery: '',
}

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'LOAD_CHATS':
      return { ...initialState, chats: action.payload }

    case 'ADD_NOTE':
      return {
        ...state,
        chats: state.chats.map(c =>
          c.uuid === action.chatId
            ? { ...c, user: { ...c.user, note: action.note } }
            : c
        ),
      }

    case 'ADD_TAG':
      return {
        ...state,
        chats: state.chats.map(c =>
          c.uuid === action.chatId && !c.user.tags.includes(action.tag)
            ? { ...c, user: { ...c.user, tags: [...c.user.tags, action.tag] } }
            : c
        ),
      }

    case 'REMOVE_TAG':
      return {
        ...state,
        chats: state.chats.map(c =>
          c.uuid === action.chatId
            ? { ...c, user: { ...c.user, tags: c.user.tags.filter(t => t !== action.tag) } }
            : c
        ),
      }

    case 'SET_PERIOD_REFLECTION':
      return {
        ...state,
        periodReflections: { ...state.periodReflections, [action.period]: { note: action.note } },
      }

    case 'SET_PERIOD_MODE':
      return { ...state, activePeriodMode: action.mode, selectedPeriod: null }

    case 'SET_SELECTED_PERIOD':
      return { ...state, selectedPeriod: action.period, selectedChatId: null }

    case 'SET_SELECTED_CHAT':
      return { ...state, selectedChatId: action.chatId }

    case 'SET_TOPIC_FILTER':
      return { ...state, activeTopicFilter: action.topic }

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.query }

    case 'CLEAR_SESSION':
      return initialState

    default:
      return state
  }
}

interface SessionContextValue {
  state: SessionState
  dispatch: React.Dispatch<SessionAction>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState)
  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside SessionProvider')
  return ctx
}

// Convenience typed dispatch helpers
export function useSessionActions() {
  const { dispatch } = useSession()
  return {
    loadChats: (payload: SessionState['chats']) =>
      dispatch({ type: 'LOAD_CHATS', payload }),
    addNote: (chatId: string, note: string) =>
      dispatch({ type: 'ADD_NOTE', chatId, note }),
    addTag: (chatId: string, tag: string) =>
      dispatch({ type: 'ADD_TAG', chatId, tag }),
    removeTag: (chatId: string, tag: string) =>
      dispatch({ type: 'REMOVE_TAG', chatId, tag }),
    setPeriodReflection: (period: string, note: string) =>
      dispatch({ type: 'SET_PERIOD_REFLECTION', period, note }),
    setPeriodMode: (mode: PeriodMode) =>
      dispatch({ type: 'SET_PERIOD_MODE', mode }),
    setSelectedPeriod: (period: string | null) =>
      dispatch({ type: 'SET_SELECTED_PERIOD', period }),
    setSelectedChat: (chatId: string | null) =>
      dispatch({ type: 'SET_SELECTED_CHAT', chatId }),
    setTopicFilter: (topic: TopicTag | null) =>
      dispatch({ type: 'SET_TOPIC_FILTER', topic }),
    setSearchQuery: (query: string) =>
      dispatch({ type: 'SET_SEARCH_QUERY', query }),
    clearSession: () =>
      dispatch({ type: 'CLEAR_SESSION' }),
  }
}
