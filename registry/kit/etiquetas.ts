import type { Estado, Prioridad } from "./tipos"

export const ETIQUETA_ESTADO: Record<Estado, string> = {
  sinrevisar: "Sin revisar",
  porhacer: "Por hacer",
  curso: "En curso",
  revision: "En revisión",
  hecha: "Hecha",
  bloqueada: "Bloqueada",
  cancelada: "Cancelada",
}

export const ETIQUETA_PRIORIDAD: Record<Prioridad, string> = {
  ninguna: "Ninguna",
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  urgente: "Urgente",
}

export const NIVEL_PRIORIDAD: Record<Prioridad, number> = {
  ninguna: 0,
  baja: 1,
  media: 2,
  alta: 3,
  urgente: 4,
}

export const PRIORIDADES: Prioridad[] = ["ninguna", "baja", "media", "alta", "urgente"]
