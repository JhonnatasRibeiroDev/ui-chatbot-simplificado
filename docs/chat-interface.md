# Feature: ChatInterface — Orquestrador Principal

## O que é

`ChatInterface` é o componente central da aplicação. Ele gerencia todo o estado da conversa: sessão ativa, lista de mensagens, navegação entre sessões anteriores e envio de novas mensagens. Todos os outros componentes visuais são orquestrados por ele.

---

## Arquivo

`src/components/ChatInterface.tsx`

---

## Estado gerenciado

| Estado | Tipo | Descrição |
|---|---|---|
| `messages` | `Message[]` | Mensagens da sessão atual |
| `sessionId` | `string` | UUID da sessão ativa |
| `clientId` | `string` | UUID do cliente (recebido do backend) |
| `allSessions` | `SessionData[]` | Todas as sessões do cliente (exibidas na sidebar) |
| `isLoading` | `boolean` | Controla exibição do `LoadingScreen` |
| `loadingMessage` | `string` | Mensagem dinâmica exibida no loading |
| `isTyping` | `boolean` | Controla exibição do `TypingIndicator` |
| `isSidebarCollapsed` | `boolean` | Estado de colapso da sidebar |

---

## Inicialização de sessão

Ao montar o componente, o hook `useEffect` executa `initializeSession()`:

```
1. Busca cookie "chatbot_session_id" no navegador
   ├─ Cookie encontrado:
   │    ├─ Tenta buscar histórico da sessão no servidor
   │    │    ├─ Servidor retorna 404 → sessão expirou
   │    │    │    └─ Limpa o cookie e cria nova sessão
   │    │    └─ Servidor retorna mensagens → restaura o histórico
   │    └─ Carrega lista de todas as sessões do cliente
   └─ Cookie não encontrado:
        ├─ Cria nova sessão no servidor
        ├─ Salva o session_id no cookie
        └─ Carrega lista de sessões
```

---

## Envio de mensagem (`handleSendMessage`)

```
1. Bloqueia envio enquanto isTyping = true
2. Adiciona mensagem do usuário na lista de mensagens (otimisticamente)
3. Seta isTyping = true (exibe TypingIndicator)
4. Chama sendChatMessage(sessionId, content)
5. Adiciona resposta do assistente na lista
6. Em caso de erro: adiciona mensagem de erro amigável
7. Seta isTyping = false
```

---

## Nova conversa (`handleNewConversation`)

Chama `createNewSession()`, atualiza `sessionId`, limpa `messages` e recarrega `allSessions`. O backend associa a nova sessão ao mesmo `client_id` (via cookie httponly).

---

## Troca de sessão (`handleSelectSession`)

Salva o novo `session_id` no cookie, busca o histórico no servidor e atualiza `messages`.

---

## Estrutura de renderização

```
ChatInterface
├─ LoadingScreen (se isLoading = true)
└─ Layout principal
     ├─ Sidebar (lista de sessões, botão nova conversa)
     └─ Coluna principal
          ├─ ChatHeader (sessionId, ThemeToggle)
          ├─ Área de mensagens
          │    ├─ ChatWelcome (se messages.length === 0)
          │    └─ ChatMessage[] + TypingIndicator (se hasMessages)
          └─ ChatInput
```

---

## Geração de IDs de mensagem

```ts
function generateMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
```

IDs são gerados localmente no frontend, apenas para uso como `key` no React. Não são persistidos no banco.
