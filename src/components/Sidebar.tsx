import { Plus, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NexusLogo } from './NexusLogo'
import type { SessionData } from '@/api/Session'

interface SidebarProps {
  sessions: SessionData[]
  currentSessionId: string
  isCollapsed: boolean
  onToggleCollapse: () => void
  onNewConversation: () => void
  onSelectSession: (sessionId: string) => void
}

export function Sidebar({
  sessions,
  currentSessionId,
  isCollapsed,
  onToggleCollapse,
  onNewConversation,
  onSelectSession
}: SidebarProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recentemente'
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return 'Hoje'
      if (diffDays === 1) return 'Ontem'
      if (diffDays < 7) return `${diffDays}d`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}s`
      return date.toLocaleDateString('pt-BR', {
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Recentemente'
    }
  }

  return (
    <aside
      className={cn(
        'h-screen bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] flex flex-col transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[hsl(var(--border))]">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <NexusLogo size="sm" />
            <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
              NexusAI
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
          title={isCollapsed ? 'Expandir' : 'Recolher'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* New Conversation Button */}
      <div className="px-3 py-3">
        <button
          onClick={onNewConversation}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted))] transition-colors',
            isCollapsed && 'justify-center'
          )}
          title="Nova conversa"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Nova conversa</span>
          )}
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-2">
        {sessions && sessions.length > 0 ? (
          <div className="space-y-1">
            {sessions.map(session => (
              <button
                key={session.session_id}
                onClick={() => onSelectSession(session.session_id)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg transition-colors group flex items-center gap-2',
                  currentSessionId === session.session_id
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
                )}
                title={`Conversa de ${formatDate(session.updated_at)}`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate font-medium">
                      Conversa #{session.session_id.substring(0, 5)}
                    </p>
                    <p className="text-xs opacity-70 truncate">
                      {formatDate(session.updated_at)}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="w-8 h-8 text-[hsl(var(--muted-foreground))] mb-2 opacity-50" />
            {!isCollapsed && (
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Nenhuma conversa
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
