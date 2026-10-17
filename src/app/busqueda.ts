export type BusquedaTareas = {
  vista?: "tablero"
  tarea?: string
  q?: string
  demo?: "cargando" | "error" | "vacio"
  fallo?: 1
}

export function leerBusqueda(search: Record<string, unknown>): BusquedaTareas {
  return {
    vista: search.vista === "tablero" ? "tablero" : undefined,
    tarea: typeof search.tarea === "string" && search.tarea ? search.tarea : undefined,
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    demo:
      search.demo === "cargando" || search.demo === "error" || search.demo === "vacio"
        ? search.demo
        : undefined,
    // Un número se queda como ?fallo=1. Una cadena la reescribe el router como fallo="1" y el guardado no la ve.
    fallo: search.fallo === 1 || search.fallo === "1" || search.fallo === '"1"' ? 1 : undefined,
  }
}

export function tareaDe(search: unknown) {
  if (search && typeof search === "object" && "tarea" in search) {
    const valor = (search as { tarea?: unknown }).tarea
    return typeof valor === "string" ? valor : ""
  }
  return ""
}
