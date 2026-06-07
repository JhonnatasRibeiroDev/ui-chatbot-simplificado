import { NexusLogo } from './NexusLogo'
import { Loader2, User, Zap, Sparkles } from 'lucide-react'

const features = [
  { icon: User, label: 'Sessao Individual' },
  { icon: Zap, label: 'Respostas em Tempo Real' },
  { icon: Sparkles, label: 'IA Avancada' }
]

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({
  message = 'Carregando...'
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[hsl(var(--background))]">
      <div className="flex flex-col items-center">
        <NexusLogo size="lg" className="mb-6" />

        <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-1">
          NexusAI
        </h1>

        <p className="text-[hsl(var(--muted-foreground))] mb-6">
          Chatbot Inteligente Multiusuario
        </p>

        <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] mb-8">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">{message}</span>
        </div>

        <div className="flex gap-3">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]"
            >
              <Icon className="w-5 h-5 text-[hsl(var(--primary))]" />
              <span className="text-xs text-[hsl(var(--foreground))] whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
