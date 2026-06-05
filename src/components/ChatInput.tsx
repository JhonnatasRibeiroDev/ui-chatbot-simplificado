import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [message])

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="px-4 py-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              disabled={disabled}
              rows={1}
              className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent resize-none text-sm"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            className="shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--primary))] hover:bg-[hsl(174,72%,35%)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] text-center mt-2">
          Pressione Enter para enviar, Shift + Enter para nova linha
        </p>
      </div>
    </div>
  )
}
