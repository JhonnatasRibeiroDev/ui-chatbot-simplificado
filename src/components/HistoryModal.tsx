import { useState, useEffect } from 'react'
import { X, Loader2, History, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NexusLogo } from './NexusLogo'
import { User } from 'lucide-react'
import { fetchOptions } from '@/lib/cookieUtils'

interface HistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

interface HistoryResponse {
  history: HistoryMessage[]
}

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  apiBaseUrl: string | undefined
}

export function HistoryModal({
  isOpen,
  onClose,
  sessionId,
  apiBaseUrl
}: HistoryModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [historyData, setHistoryData] = useState<HistoryResponse | null>(null)

  const fetchHistory = async () => {
    if (!sessionId) {
      setError('ID de sessão inválido')
      return
    }

    setIsLoading(true)
    setError(null)
    setHistoryData(null)

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/sessions/${sessionId}/history`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          ...fetchOptions
        }
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Sessão não encontrada ou sem histórico')
        }
        throw new Error('Erro ao buscar histórico')
      }

      const data: HistoryResponse = await response.json()
      setHistoryData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchHistory()
    }
  }, [isOpen, sessionId])

  const handleClose = () => {
    setError(null)
    setHistoryData(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-[hsl(var(--card))] rounded-2xl shadow-xl border border-[hsl(var(--border))] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-[hsl(var(--primary))]" />
            <div>
              <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                Histórico da Sessão
              </h2>
              <p className="text-xs font-mono text-[hsl(var(--primary))]">
                {sessionId.substring(0, 12)}...
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchHistory}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors disabled:opacity-50"
              title="Atualizar"
            >
              <RefreshCw
                className={cn(
                  'w-4 h-4 text-[hsl(var(--muted-foreground))]',
                  isLoading && 'animate-spin'
                )}
              />
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <X className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[hsl(var(--primary))] animate-spin mb-3" />
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Buscando histórico...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchHistory}
                className="px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity text-sm font-medium"
              >
                Tentar novamente
              </button>
            </div>
          ) : historyData &&
            historyData.history &&
            historyData.history.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                  {historyData.history.length} mensagem(ns)
                </span>
              </div>

              <div className="space-y-3">
                {historyData.history.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex gap-2',
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    {msg.role === 'user' ? (
                      <div className="shrink-0 w-7 h-7 rounded-md bg-[hsl(var(--muted))] flex items-center justify-center">
                        <User className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                      </div>
                    ) : (
                      <NexusLogo size="sm" className="shrink-0 w-7 h-7" />
                    )}
                    <div
                      className={cn(
                        'max-w-[85%] px-3 py-2 rounded-xl text-sm',
                        msg.role === 'user'
                          ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                          : 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                      )}
                    >
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="w-12 h-12 text-[hsl(var(--muted-foreground))] mb-3" />
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Nenhuma mensagem nesta sessão ainda
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
