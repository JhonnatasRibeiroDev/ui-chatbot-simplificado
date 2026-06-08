import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatHeader } from './ChatHeader'
import { Sidebar } from './Sidebar'
import { ChatMessage, TypingIndicator, type Message } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ChatWelcome } from './ChatWelcome'
import { LoadingScreen } from './LoadingScreen'
import {
  createNewSession,
  fetchSessionHistory,
  fetchAllSessions,
  type SessionResponse,
  type SessionData
} from '@/api/Session'
import { sendChatMessage } from '@/api/SendChat'
import {
  getSessionCookie,
  saveSessionCookie,
  clearSessionCookie
} from '@/lib/cookieUtils'

function generateMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string>('')
  const [clientId, setClientId] = useState<string>('')
  const [allSessions, setAllSessions] = useState<SessionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState(
    'Procurando sessão ativa...'
  )
  const [isTyping, setIsTyping] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Criar nova sessão ao montar o componente ou recuperar do cookie
  useEffect(() => {
    const initializeSession = async () => {
      setIsLoading(true)
      setLoadingMessage('Procurando sessão ativa...')

      try {
        // Verificar se existe uma sessão no cookie
        const savedSessionId = getSessionCookie()

        if (savedSessionId) {
          const history = await fetchSessionHistory(savedSessionId)

          if (history === null) {
            // Sessão do cookie não existe mais no servidor — criar nova
            setLoadingMessage('Criando nova sessão...')
            clearSessionCookie()
            const response: SessionResponse = await createNewSession()
            setSessionId(response.session_id)
            setClientId(response.client_id)
            saveSessionCookie(response.session_id)
            setMessages([])
          } else {
            setSessionId(savedSessionId)
            setMessages(history)
          }

          const sessions = await fetchAllSessions()
          setAllSessions(sessions)
        } else {
          // Mudar mensagem para criação de nova sessão
          setLoadingMessage('Criando nova sessão...')

          // Criar uma nova sessão
          const response: SessionResponse = await createNewSession()
          setSessionId(response.session_id)
          setClientId(response.client_id)
          saveSessionCookie(response.session_id)
          // O backend irá gravar o cookie client_id automaticamente
          // Carregar histórico da sessão (provavelmente vazio no início)
          const history = await fetchSessionHistory(response.session_id)
          setMessages(history ?? [])
          // Carregar todas as sessões do cliente
          const sessions = await fetchAllSessions()
          setAllSessions(sessions)
        }
      } catch (error) {
        console.error('Erro ao inicializar sessão:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeSession()
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!sessionId || isTyping) return

      const userMessage: Message = {
        id: generateMessageId(),
        content,
        role: 'user',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, userMessage])
      setIsTyping(true)

      try {
        const response = await sendChatMessage(sessionId, content)

        const botMessage: Message = {
          id: generateMessageId(),
          content: response,
          role: 'assistant',
          timestamp: new Date()
        }

        setMessages(prev => [...prev, botMessage])
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        const errorMessage: Message = {
          id: generateMessageId(),
          content:
            'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
          role: 'assistant',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
      }
    },
    [sessionId, isTyping]
  )

  const handleNewConversation = useCallback(async () => {
    setIsLoading(true)
    setLoadingMessage('Criando nova sessão...')

    try {
      // Criar nova sessão - o backend usa o cookie client_id para associar ao cliente
      const response: SessionResponse = await createNewSession()
      setSessionId(response.session_id)
      setClientId(response.client_id)
      saveSessionCookie(response.session_id)
      setMessages([])
      // Atualizar lista de sessões
      const sessions = await fetchAllSessions()
      setAllSessions(sessions)
    } catch (error) {
      console.error('Erro ao criar nova conversa:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSelectSession = useCallback(async (selectedSessionId: string) => {
    setIsLoading(true)
    setLoadingMessage('Carregando conversa...')

    try {
      setSessionId(selectedSessionId)
      saveSessionCookie(selectedSessionId)
      const history = await fetchSessionHistory(selectedSessionId)
      setMessages(history ?? [])
    } catch (error) {
      console.error('Erro ao selecionar sessão:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const hasMessages = messages.length > 0

  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />
  }

  return (
    <div className="flex h-screen bg-[hsl(var(--background))]">
      {/* Sidebar */}
      <Sidebar
        sessions={allSessions}
        currentSessionId={sessionId}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onNewConversation={handleNewConversation}
        onSelectSession={handleSelectSession}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatHeader sessionId={sessionId} />

        <main className="flex-1 overflow-hidden flex flex-col">
          {hasMessages ? (
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map(message => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>
          ) : (
            <ChatWelcome onSelectSuggestion={handleSendMessage} />
          )}
        </main>

        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isTyping || isLoading}
        />
      </div>
    </div>
  )
}
