import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatHeader } from './ChatHeader'
import { ChatMessage, TypingIndicator, type Message } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ChatWelcome } from './ChatWelcome'

// Definição do tipo para as variáveis de ambiente
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

const API_URL = import.meta.env.VITE_API_URL
console.log('API_URL:', API_URL)

async function createNewSession(): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Falha ao criar sessão')
    }

    const data = await response.json()
    return data.session_id
  } catch (error) {
    console.error('Erro ao criar sessão:', error)
    throw error
  }
}

async function fetchSessionHistory(sessionId: string): Promise<Message[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/sessions/${sessionId}/history`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Falha ao carregar histórico')
    }

    const data = await response.json()
    return data.history.map(
      (msg: { role: string; content: string }, index: number) => ({
        id: `msg_${index}_${Date.now()}`,
        content: msg.content,
        role: msg.role,
        timestamp: new Date()
      })
    )
  } catch (error) {
    console.error('Erro ao carregar histórico:', error)
    return []
  }
}

async function sendChatMessage(
  sessionId: string,
  message: string
): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message
      })
    })

    if (!response.ok) {
      throw new Error('Falha ao enviar mensagem')
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    throw error
  }
}

function generateMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Criar nova sessão ao montar o componente
  useEffect(() => {
    const initializeSession = async () => {
      setIsLoading(true)
      try {
        const newSessionId = await createNewSession()
        setSessionId(newSessionId)
        // Carregar histórico da sessão (provavelmente vazio no início)
        const history = await fetchSessionHistory(newSessionId)
        setMessages(history)
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
    try {
      const newSessionId = await createNewSession()
      setSessionId(newSessionId)
      setMessages([])
    } catch (error) {
      console.error('Erro ao criar nova conversa:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const hasMessages = messages.length > 0

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-[hsl(var(--background))] items-center justify-center">
        <TypingIndicator />
        <p className="text-muted-foreground mt-4">Carregando sessão...</p>
      </div>
    )
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
