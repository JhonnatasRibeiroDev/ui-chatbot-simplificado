import { cn } from "@/lib/utils"

interface NexusLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function NexusLogo({ className, size = "md" }: NexusLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(174,72%,45%)] to-[hsl(174,72%,35%)]",
        sizeClasses[size],
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-2/3 h-2/3"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="M5.6 5.6l2.85 2.85" />
        <path d="M15.55 15.55l2.85 2.85" />
        <path d="M5.6 18.4l2.85-2.85" />
        <path d="M15.55 8.45l2.85-2.85" />
        <circle cx="12" cy="12" r="3" fill="white" stroke="none" />
      </svg>
    </div>
  )
}
