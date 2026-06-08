# Feature: Sidebar — Navegação de Conversas

## O que é

A sidebar exibe a lista de conversas anteriores do cliente e permite criar uma nova conversa ou retomar uma existente. Pode ser recolhida para liberar espaço na tela.

---

## Arquivo

`src/components/Sidebar.tsx`

---

## Props

| Prop | Tipo | Descrição |
|---|---|---|
| `sessions` | `SessionData[]` | Lista de sessões do cliente |
| `currentSessionId` | `string` | ID da sessão atualmente ativa (usada para destacar o item) |
| `isCollapsed` | `boolean` | Se a sidebar está recolhida (`w-16`) ou expandida (`w-64`) |
| `onToggleCollapse` | `() => void` | Chamado ao clicar no botão de recolher/expandir |
| `onNewConversation` | `() => void` | Chamado ao clicar em "Nova conversa" |
| `onSelectSession` | `(sessionId: string) => void` | Chamado ao clicar em uma sessão da lista |

---

## Comportamento

### Colapso / Expansão

A sidebar alterna entre `w-64` (expandida) e `w-16` (recolhida) com transição CSS de `300ms`. No modo recolhido:
- O nome "NexusAI" e a logo são ocultados
- O botão "Nova conversa" mostra apenas o ícone `+`
- Cada sessão mostra apenas o ícone `MessageSquare`

### Lista de sessões

Cada sessão é exibida como botão clicável. A sessão ativa é destacada com a cor primária (`hsl(--primary)`). Sessões inativas usam hover com `hsl(--muted)`.

### Formatação de datas

A função `formatDate` converte a data de criação/atualização da sessão para exibição relativa:

| Condição | Exibe |
|---|---|
| Mesmo dia | `Hoje` |
| Dia anterior | `Ontem` |
| Até 6 dias | `Nd` (ex: `3d`) |
| Até 29 dias | `Ns` (ex: `2s`) |
| Mais de 30 dias | Data no formato `dia mês` |
| Data inválida ou ausente | `Recentemente` |

### Estado vazio

Se não houver sessões, exibe um ícone de mensagem e o texto "Nenhuma conversa" (apenas quando expandida).

---

## Layout

```
aside (h-screen, flex-col)
├─ Header
│    ├─ Logo + "NexusAI" (ocultos se collapsed)
│    └─ Botão toggle (ChevronLeft / ChevronRight)
├─ Botão "Nova conversa" (Plus icon)
└─ Lista de sessões (flex-1, overflow-y-auto)
     └─ button × N (uma por sessão)
          ├─ MessageSquare icon
          └─ Nome "Conversa #XXXXX" + data (ocultos se collapsed)
```
