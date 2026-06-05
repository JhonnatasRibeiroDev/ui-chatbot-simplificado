import { Plus } from 'lucide-react'
import { NexusLogo } from './NexusLogo'
import { ThemeToggle } from './ThemeToggle'
import { useCallback, useState } from 'react'
import { HistoryModal } from './HistoryModal'

interface ChatHeaderProps {
  sessionId: string
  onNewConversation: () => void
}

export function ChatHeader({ sessionId, onNewConversation }: ChatHeaderProps) {
  const API_URL = import.meta.env.VITE_API_URL

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const handleOpenHistory = useCallback(() => {
    setIsHistoryOpen(true)
  }, [])

  const handleCloseHistory = useCallback(() => {
    setIsHistoryOpen(false)
  }, [])

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="flex items-center gap-3">
        <NexusLogo size="sm" />
        <div>
          <h1 className="font-semibold text-[hsl(var(--foreground))]">
            NexusAI
          </h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              Online
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            Sessao
          </span>
          <p className="text-xs font-mono text-[hsl(var(--primary))]">
            {sessionId}
          </p>
        </div>

        <ThemeToggle />

        <button
          onClick={onNewConversation}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">
            Nova Conversa
          </span>
        </button>

        <button
          onClick={handleOpenHistory}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <span className="text-sm font-medium hidden sm:inline">
            Historico
          </span>
        </button>
        
        <HistoryModal
          isOpen={isHistoryOpen}
          onClose={handleCloseHistory}
          sessionId={sessionId}
          apiBaseUrl={API_URL}
        />
      </div>
    </header>
  )
}
