import { NexusLogo } from "./NexusLogo"

const suggestions = [
  "O que e inteligencia artificial?",
  "Me ajude a escrever um e-mail",
  "Quais sao as tendencias de tecnologia?",
  "O que voce pode fazer?",
]

interface ChatWelcomeProps {
  onSelectSuggestion: (suggestion: string) => void
}

export function ChatWelcome({ onSelectSuggestion }: ChatWelcomeProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <NexusLogo size="lg" className="mb-6" />

      <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-2 text-center text-balance">
        {"Ola! Sou o NexusAI"}
      </h2>

      <p className="text-[hsl(var(--muted-foreground))] text-center max-w-md mb-8 text-pretty">
        Seu assistente de inteligencia artificial. Faca qualquer pergunta e eu farei o meu melhor para ajudar.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSelectSuggestion(suggestion)}
            className="px-4 py-3 text-left text-sm rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted))] hover:border-[hsl(var(--primary))] transition-colors text-[hsl(var(--foreground))]"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
