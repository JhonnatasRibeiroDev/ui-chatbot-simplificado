import { NexusLogo } from './NexusLogo'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {isUser ? (
        <div className="shrink-0 w-8 h-8 rounded-lg bg-[hsl(var(--muted))] flex items-center justify-center">
          <User className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        </div>
      ) : (
        <NexusLogo size="sm" className="shrink-0 w-8 h-8" />
      )}

      <div
        className={cn(
          'max-w-[80%] px-4 py-3 rounded-2xl',
          isUser
            ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
            : 'bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))]'
        )}
      >
        <div className="text-sm leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => <p className="m-0" {...props} />, 
              code: ({ inline, className, children, ...props }) =>
                inline ? (
                  <code
                    className={cn(
                      'rounded bg-[hsl(var(--muted))] px-1 py-[0.15rem] text-[0.93em]',
                      className
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <pre className="overflow-x-auto rounded-lg bg-[hsl(var(--muted))] p-3 text-xs">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ),
              a: ({ node, ...props }) => (
                <a className="text-[hsl(var(--primary))] underline" {...props} />
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <NexusLogo size="sm" className="shrink-0 w-8 h-8" />
      <div className="px-4 py-3 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-[hsl(var(--muted-foreground))] typing-dot" />
          <span className="w-2 h-2 rounded-full bg-[hsl(var(--muted-foreground))] typing-dot" />
          <span className="w-2 h-2 rounded-full bg-[hsl(var(--muted-foreground))] typing-dot" />
        </div>
      </div>
    </div>
  )
}
