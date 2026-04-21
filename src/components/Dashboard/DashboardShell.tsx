import { useSession } from '../../context/SessionContext'
import { Sidebar } from './Sidebar'
import { ChatList } from './ChatList'
import { ChatDetail } from '../ChatDetail/ChatDetail'
import { PeriodView } from '../Period/PeriodView'
import { OverviewPanel } from '../Overview/OverviewPanel'
import { SearchBar } from './SearchBar'
import { ExportMenu } from '../Export/ExportMenu'
import { ThemeSwitcher } from '../UI/ThemeSwitcher'

export function DashboardShell() {
  const { state } = useSession()

  const mainPanel = state.selectedChatId
    ? <ChatDetail />
    : state.selectedPeriod
    ? <PeriodView />
    : <OverviewPanel />

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center gap-4 px-6 py-3 shrink-0"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="shrink-0">
            <p className="text-sm font-bold" style={{ color: 'var(--text-heading)' }}>
              Claude Chat Analyzer
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {state.chats.length} chats loaded
            </p>
          </div>
          <div className="flex-1">
            <SearchBar />
          </div>
          <ThemeSwitcher />
          <ExportMenu />
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 shrink-0 overflow-y-auto"
            style={{ borderRight: '1px solid var(--border)' }}>
            <ChatList />
          </div>

          <div className="flex flex-1 overflow-hidden">
            {mainPanel}
          </div>
        </div>
      </div>
    </div>
  )
}
