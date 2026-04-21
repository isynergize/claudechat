import { SessionProvider, useSession } from './context/SessionContext'
import { ThemeProvider } from './context/ThemeContext'
import { UploadZone } from './components/Upload/UploadZone'
import { DashboardShell } from './components/Dashboard/DashboardShell'

function AppContent() {
  const { state } = useSession()
  return state.chats.length > 0 ? <DashboardShell /> : <UploadZone />
}

export default function App() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </ThemeProvider>
  )
}
