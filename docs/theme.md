# Feature: Tema Claro / Escuro

## O que é

Sistema de troca de tema (light/dark) global, persistido no `localStorage` do navegador. Detecta automaticamente a preferência do sistema operacional na primeira visita.

---

## Arquivos envolvidos

| Arquivo | Responsabilidade |
|---|---|
| `src/contexts/ThemeContext.tsx` | Context + Provider + hook `useTheme` |
| `src/components/ThemeToggle.tsx` | Botão visual de alternância |
| `src/App.tsx` | Envolve a aplicação com `ThemeProvider` |

---

## Como funciona

### Inicialização

Ao montar o `ThemeProvider`, o tema inicial é determinado nesta ordem de prioridade:

1. Valor salvo no `localStorage` (chave `"theme"`)
2. Preferência do sistema operacional (`prefers-color-scheme: dark`)
3. Fallback: `"dark"`

### Aplicação do tema

O tema é aplicado adicionando/removendo as classes `"light"` e `"dark"` no elemento `<html>` (`document.documentElement`). O CSS usa variáveis HSL condicionadas à classe presente no `<html>` para definir todas as cores da interface.

```ts
useEffect(() => {
  const root = window.document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
  localStorage.setItem("theme", theme)
}, [theme])
```

### Persistência

O tema escolhido é salvo em `localStorage` a cada alteração. Na próxima abertura do app, o `ThemeProvider` lê esse valor antes de renderizar.

---

## API do Context

```ts
interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: () => void
}
```

### `useTheme()`

Hook que retorna `{ theme, toggleTheme }`. Deve ser usado dentro de um componente envolvido por `ThemeProvider`, caso contrário lança um erro.

---

## ThemeToggle

Botão que exibe um ícone de `Moon` (para ativar o modo escuro, quando o tema atual é `light`) ou `Sun` (para ativar o modo claro, quando o tema atual é `dark`). Chama `toggleTheme()` ao ser clicado.

O botão fica no `ChatHeader`, no canto superior direito da interface.

---

## Adicionar suporte ao tema em um novo componente

Use as variáveis CSS HSL já definidas em `src/index.css` em vez de cores hardcoded:

```tsx
// Correto — responde ao tema automaticamente
className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"

// Incorreto — ignora o tema
className="bg-white text-black"
```
