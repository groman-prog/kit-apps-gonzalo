import type { Estado } from "./tipos"

export const ORDEN_LISTA: Estado[] = [
  "curso",
  "revision",
  "porhacer",
  "sinrevisar",
  "bloqueada",
  "hecha",
  "cancelada",
]

export const ORDEN_TABLERO: Estado[] = [
  "sinrevisar",
  "porhacer",
  "curso",
  "revision",
  "hecha",
  "bloqueada",
  "cancelada",
]

export const PLEGADOS_AL_INICIO = new Set<Estado>(["hecha", "cancelada"])
