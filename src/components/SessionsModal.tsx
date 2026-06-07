import { useState, useEffect } from 'react'
import { X, Loader2, MessageSquare, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionData } from '@/api/Session'

interface SessionsModalProps {
  isOpen: boolean
  onClose: () => void
  sessions: SessionData[]
  currentSessionId: string
  onSelectSession: (sessionId: string) => void
}

export function SessionsModal({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession
}: SessionsModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectSession = (sessionId: string) => {
    if (sessionId !== currentSessionId) {
      setIsLoading(true)
      onSelectSession(sessionId)
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  if (!isOpen) return null

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recentemente'
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return 'Hoje'
      if (diffDays === 1) return 'Ontem'
      if (diffDays < 7) return `${diffDays} dias atrás`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`
      return date.toLocaleDateString('pt-BR')
    } catch {
      return 'Recentemente'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-[hsl(var(--card))] rounded-2xl shadow-xl border border-[hsl(var(--border))] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-[hsl(var(--primary))]" />
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
              Minhas Conversas
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <X className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[hsl(var(--primary))] animate-spin mb-3" />
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Carregando conversa...
              </p>
            </div>
          ) : sessions && sessions.length > 0 ? (
            <div className="space-y-2">
              {sessions.map(session => (
                <button
                  key={session.session_id}
                  onClick={() => handleSelectSession(session.session_id)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-lg transition-colors',
                    currentSessionId === session.session_id
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                      : 'bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:opacity-90'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        Conversa #{session.session_id.substring(0, 8)}
                      </p>
                      <p className="text-xs opacity-70 truncate">
                        {session.message_count || 0} mensagens •{' '}
                        {formatDate(session.updated_at)}
                      </p>
                    </div>
                    {currentSessionId === session.session_id && (
                      <div className="shrink-0 w-2 h-2 rounded-full bg-current mt-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-[hsl(var(--muted-foreground))] mb-3" />
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Nenhuma conversa encontrada
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
