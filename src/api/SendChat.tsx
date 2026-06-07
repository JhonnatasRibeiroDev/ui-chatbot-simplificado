// Enviar mensagem ao chat
// Envia uma mensagem para uma sessão existente. O backend salva a mensagem do usuário,
// envia a mensagem e o histórico da sessão ao LLM configurado e salva a resposta do assistente.

// Metodo: POST
// Rota: /api/sessions/{session_id}/messages
// Objetivo: enviar uma mensagem do usuário e receber a resposta do chatbot.
// Corpo da requisição: JSON com message.
// Resposta: JSON com response (mensagem do assistente)

import { fetchOptions } from '@/lib/cookieUtils'

// Definição do tipo para as variáveis de ambiente
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

const API_URL = import.meta.env.VITE_API_URL

export async function sendChatMessage(
  sessionId: string,
  message: string
): Promise<string> {
  try {
    const response = await fetch(
      `${API_URL}/api/sessions/${sessionId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message
        }),
        ...fetchOptions
      }
    )

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
