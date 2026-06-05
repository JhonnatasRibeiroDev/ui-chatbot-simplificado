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
