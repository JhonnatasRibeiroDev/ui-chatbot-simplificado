# Feature: Envio de Mensagens (Camada de API)

## O que é

Função responsável por enviar a mensagem do usuário ao backend e retornar a resposta do assistente. É a ponte entre o componente `ChatInterface` e o endpoint de chat da API.

---

## Arquivo

`src/api/SendChat.tsx`

---

## Função

### `sendChatMessage(sessionId, message): Promise<string>`

Envia uma mensagem para a sessão ativa e retorna o texto da resposta do assistente.

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|---|---|---|
| `sessionId` | `string` | UUID da sessão ativa |
| `message` | `string` | Texto digitado pelo usuário |

**Retorno:** `string` — resposta gerada pelo LLM.

**Lança erro** se a requisição falhar (HTTP não-2xx), repassado para o `ChatInterface` tratar.

---

## Contrato com a API

**Rota:** `POST /api/sessions/{sessionId}/messages`

**Body:**
```json
{ "message": "sua mensagem aqui" }
```

**Resposta esperada (`200`):**
```json
{
  "session_id": "abc...",
  "response": "resposta do assistente"
}
```

A função extrai apenas o campo `response` e o retorna como string.

---

## Exemplo de uso

```ts
import { sendChatMessage } from '@/api/SendChat'

const reply = await sendChatMessage(sessionId, "Qual a capital do Brasil?")
// reply === "A capital do Brasil é Brasília."
```

---

## Configuração

- Usa `credentials: "include"` (via `fetchOptions`) para enviar o cookie `client_id` automaticamente.
- URL base lida de `VITE_API_URL` (variável de ambiente do Vite).
