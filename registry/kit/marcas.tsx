import { cn } from "@/lib/utils"

export function Iniciales({ iniciales, className }: { iniciales: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-foreground",
        className,
      )}
    >
      {iniciales}
    </span>
  )
}

const ALTURAS = ["h-1", "h-1.5", "h-2", "h-3"] as const

export function PrioridadBarras({ nivel }: { nivel: number }) {
  return (
    <span aria-hidden className="inline-flex h-4 w-3 shrink-0 items-end gap-0.5">
      {ALTURAS.map((altura, indice) => (
        <span
          key={altura}
          className={cn("w-0.5", altura, indice < nivel ? "bg-foreground" : "bg-border")}
        />
      ))}
    </span>
  )
}
