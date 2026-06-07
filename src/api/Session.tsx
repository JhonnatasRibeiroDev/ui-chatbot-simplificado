// Cria uma nova sessão de conversa e retorna identificadores únicos.
// Metodo: POST
// Rota: /api/sessions
// Objetivo: criar uma sessão para iniciar uma conversa.
// Corpo da requisição: não possui.
// Resposta: { client_id, session_id }

import { Message } from '@/components/ChatMessage'
import { fetchOptions } from '@/lib/cookieUtils'

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

// Tipos para as respostas do backend
export interface SessionResponse {
  client_id: string
  session_id: string
}

export interface SessionData {
  session_id: string
  created_at?: string
  updated_at?: string
  message_count?: number
}

export interface ChatHistory {
  messages: Message[]
}

export async function createNewSession(): Promise<SessionResponse> {
  try {
    const response = await fetch(`${API_URL}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      ...fetchOptions
    })

    if (!response.ok) {
      throw new Error('Falha ao criar sessão')
    }

    const data: SessionResponse = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao criar sessão:', error)
    throw error
  }
}

export async function fetchSessionHistory(
  sessionId: string
): Promise<Message[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/sessions/${sessionId}/history`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        ...fetchOptions
      }
    )

    if (!response.ok) {
      throw new Error('Falha ao carregar histórico')
    }

    const data = await response.json()
    const messages = data.history || data.messages || []
    return messages.map(
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

/**
 * Busca todas as sessões do cliente autenticado
 * Usa o cookie client_id do navegador para identificar o cliente
 */
export async function fetchAllSessions(): Promise<SessionData[]> {
  try {
    const response = await fetch(`${API_URL}/api/sessions/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      ...fetchOptions
    })

    if (!response.ok) {
      throw new Error('Falha ao carregar sessões')
    }

    const data = await response.json()
    return data.sessions || []
  } catch (error) {
    console.error('Erro ao carregar sessões:', error)
    return []
  }
}
