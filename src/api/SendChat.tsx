// Enviar mensagem ao chat
// Envia uma mensagem para uma sessao existente. O backend salva a mensagem do usuario, envia a mensagem e o historico da sessao ao LLM configurado e salva a resposta do assistente.

// Metodo: POST
// Rota: /api/chat
// Objetivo: enviar uma mensagem do usuario e receber a resposta do chatbot.
// Corpo da requisicao: JSON com session_id e message.

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
