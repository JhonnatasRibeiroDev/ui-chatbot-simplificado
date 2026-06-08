# Feature: Gerenciamento de Sessões (Camada de API)

## O que é

Conjunto de funções que fazem a ponte entre o frontend e os endpoints de sessão da API. Inclui também a gestão do cookie `chatbot_session_id`, que persiste a sessão ativa entre recarregamentos da página.

---

## Arquivos envolvidos

| Arquivo | Responsabilidade |
|---|---|
| `src/api/Session.tsx` | Funções de comunicação com a API de sessões |
| `src/lib/cookieUtils.ts` | Leitura, escrita e remoção do cookie de sessão |

---

## Funções da API (`Session.tsx`)

### `createNewSession(): Promise<SessionResponse>`

Cria uma nova sessão no backend.

- **Rota:** `POST /api/sessions`
- **Credenciais:** enviadas com `credentials: "include"` para que o backend leia/grave o cookie `client_id`
- **Retorno:** `{ client_id: string, session_id: string }`

---

### `fetchSessionHistory(sessionId): Promise<Message[] | null>`

Busca o histórico de mensagens de uma sessão.

- **Rota:** `GET /api/sessions/{sessionId}/history`
- **Retorna `null`** se o servidor responder 404 (sessão não existe mais)
- **Retorna `[]`** se a sessão existe mas não tem mensagens
- Mapeia as mensagens do formato da API (`{ role, content }`) para o formato interno do frontend (`Message`)

---

### `fetchAllSessions(): Promise<SessionData[]>`

Busca todas as sessões do cliente autenticado.

- **Rota:** `GET /api/sessions/me`
- Usa o cookie `client_id` (httponly, gerenciado pelo backend) para identificar o cliente
- Retorna lista de `{ session_id, created_at }` para popular a sidebar

---

## Cookie de sessão (`cookieUtils.ts`)

O frontend mantém apenas o `session_id` ativo em um cookie próprio. O `client_id` (que identifica o cliente permanentemente) é gerenciado pelo backend como cookie httponly.

| Função | Descrição |
|---|---|
| `saveSessionCookie(sessionId)` | Salva o `session_id` no cookie `chatbot_session_id` |
| `getSessionCookie()` | Lê e retorna o `session_id` do cookie, ou `null` se ausente |
| `clearSessionCookie()` | Remove o cookie (usado quando a sessão expirou no servidor) |

**Configuração do cookie:**
- Nome: `chatbot_session_id`
- Validade: 7 dias
- `SameSite=Lax`
- **Não** é httponly — o frontend precisa ler/escrever diretamente

---

## Configuração de credenciais

Todas as requisições usam `credentials: "include"` (via `fetchOptions` de `cookieUtils.ts`), necessário para que o navegador envie automaticamente o cookie `client_id` gerenciado pelo backend.

```ts
export const fetchOptions = {
  credentials: 'include' as const
}
```

---

## Tipos exportados

| Tipo | Descrição |
|---|---|
| `SessionResponse` | Resposta do `createNewSession`: `{ client_id, session_id }` |
| `SessionData` | Item da lista de sessões: `{ session_id, created_at?, updated_at?, message_count? }` |

---

## URL base da API

Lida da variável de ambiente `VITE_API_URL` (definida em `.env` ou no build). Deve apontar para a URL do backend, ex: `http://localhost:8000`.
