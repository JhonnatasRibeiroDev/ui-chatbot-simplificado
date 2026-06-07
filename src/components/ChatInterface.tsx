import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatHeader } from './ChatHeader'
import { ChatMessage, TypingIndicator, type Message } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ChatWelcome } from './ChatWelcome'
import { LoadingScreen } from './LoadingScreen'
import { createNewSession, fetchSessionHistory } from '@/api/Session'
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
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState(
    'Procurando sessão ativa...'
  )
  const [isTyping, setIsTyping] = useState(false)
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
          // Usar a sessão existente
          setSessionId(savedSessionId)
          const history = await fetchSessionHistory(savedSessionId)
          setMessages(history)
        } else {
          // Mudar mensagem para criação de nova sessão
          setLoadingMessage('Criando nova sessão...')

          // Criar uma nova sessão
          const newSessionId = await createNewSession()
          setSessionId(newSessionId)
          saveSessionCookie(newSessionId)
          // Carregar histórico da sessão (provavelmente vazio no início)
          const history = await fetchSessionHistory(newSessionId)
          setMessages(history)
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
      const newSessionId = await createNewSession()
      setSessionId(newSessionId)
      saveSessionCookie(newSessionId)
      setMessages([])
    } catch (error) {
      console.error('Erro ao criar nova conversa:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const hasMessages = messages.length > 0

  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />
  }

  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--background))]">
      <ChatHeader
        sessionId={sessionId}
        onNewConversation={handleNewConversation}
      />

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
  )
}
