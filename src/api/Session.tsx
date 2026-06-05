// Cria uma nova sessao de conversa e retorna um identificador unico.

// Metodo: POST
// Rota: /api/sessions
// Objetivo: criar uma sessao para iniciar uma conversa.
// Corpo da requisicao: nao possui.

import { Message } from '@/components/ChatMessage'

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

export async function createNewSession(): Promise<string> {
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
