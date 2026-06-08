# Feature: Componentes Visuais

## Visão geral

Componentes de UI reutilizáveis que compõem a interface do chatbot. Todos usam variáveis CSS HSL para suportar os temas claro e escuro automaticamente.

---

## `ChatMessage` e `TypingIndicator`

**Arquivo:** `src/components/ChatMessage.tsx`

### `ChatMessage`

Renderiza uma única mensagem da conversa. A aparência varia conforme o `role`:

| `role` | Alinhamento | Cor de fundo | Avatar |
|---|---|---|---|
| `user` | Direita (`flex-row-reverse`) | `hsl(--primary)` | Ícone `User` (Lucide) |
| `assistant` | Esquerda | `hsl(--card)` com borda | Logo `NexusLogo` |

**Interface `Message` (exportada):**
```ts
interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}
```

### `TypingIndicator`

Exibido enquanto o assistente está "digitando" (aguardando resposta da API). Mostra três pontos animados com a classe `typing-dot`.

---

## `ChatInput`

**Arquivo:** `src/components/ChatInput.tsx`

Campo de texto para o usuário digitar mensagens.

**Props:**
| Prop | Tipo | Descrição |
|---|---|---|
| `onSendMessage` | `(message: string) => void` | Chamado ao enviar |
| `disabled` | `boolean?` | Desabilita o campo durante loading/typing |

**Comportamento:**
- `textarea` com altura automática (cresce com o conteúdo, máximo 150px)
- **Enter** envia a mensagem; **Shift+Enter** insere nova linha
- Botão de envio desabilitado se a mensagem estiver vazia ou o campo desabilitado
- Após envio, o campo é limpo automaticamente

---

## `ChatWelcome`

**Arquivo:** `src/components/ChatWelcome.tsx`

Tela exibida quando a sessão não tem nenhuma mensagem ainda. Apresenta sugestões de perguntas que o usuário pode clicar para iniciar a conversa diretamente.

**Props:**
| Prop | Tipo | Descrição |
|---|---|---|
| `onSelectSuggestion` | `(message: string) => void` | Chamado ao clicar em uma sugestão |

---

## `ChatHeader`

**Arquivo:** `src/components/ChatHeader.tsx`

Cabeçalho superior da área de chat. Exibe o título da aplicação e o botão de troca de tema (`ThemeToggle`). Pode também exibir o `sessionId` atual para referência.

**Props:**
| Prop | Tipo | Descrição |
|---|---|---|
| `sessionId` | `string` | ID da sessão ativa (exibido no header) |

---

## `LoadingScreen`

**Arquivo:** `src/components/LoadingScreen.tsx`

Tela de carregamento exibida durante operações assíncronas (inicialização de sessão, troca de sessão, criação de nova conversa). A mensagem exibida muda dinamicamente conforme a etapa:

- `"Procurando sessão ativa..."` — ao inicializar
- `"Criando nova sessão..."` — ao criar sessão
- `"Carregando conversa..."` — ao trocar de sessão

**Props:**
| Prop | Tipo | Descrição |
|---|---|---|
| `message` | `string` | Texto exibido abaixo do indicador de loading |

---

## `NexusLogo`

**Arquivo:** `src/components/NexusLogo.tsx`

Componente SVG do logo da aplicação (NexusAI). Usado como avatar do assistente em mensagens e na sidebar.

**Props:**
| Prop | Tipo | Descrição |
|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | Tamanho do logo |
| `className` | `string?` | Classes Tailwind extras |
