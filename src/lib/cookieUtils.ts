/**
 * Gerencia cookies de sessão do usuário
 */

const SESSION_COOKIE_NAME = 'chatbot_session_id'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 dias em segundos

/**
 * Salva o ID da sessão atual nos cookies do navegador
 * Nota: O client_id é gerenciado pelo backend via HTTP-only cookie
 */
export function saveSessionCookie(sessionId: string): void {
  const maxAge = COOKIE_MAX_AGE
  document.cookie = `${SESSION_COOKIE_NAME}=${sessionId}; max-age=${maxAge}; path=/; SameSite=Lax`
}

/**
 * Recupera o ID da sessão dos cookies do navegador
 */
export function getSessionCookie(): string | null {
  const cookies = document.cookie.split(';')

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === SESSION_COOKIE_NAME && value) {
      return decodeURIComponent(value)
    }
  }

  return null
}

/**
 * Remove o ID da sessão dos cookies
 */
export function clearSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE_NAME}=; max-age=0; path=/`
}

/**
 * Configuração padrão para requisições que precisam enviar cookies
 */
export const fetchOptions = {
  credentials: 'include' as const
}
