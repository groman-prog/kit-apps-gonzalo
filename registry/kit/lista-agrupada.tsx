import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EstadoIcono } from "./estado-icono"
import { ETIQUETA_ESTADO } from "./etiquetas"
import { ORDEN_LISTA, PLEGADOS_AL_INICIO } from "./orden"
import type { Estado, Tarea } from "./tipos"
import { MenuAcciones, MenuContextual, aperturaPermitida } from "./acciones"
import type { Accion } from "./acciones"
import { VacioFiltro } from "./estados-vista"

export function ListaAgrupada({
  tareas,
  consulta,
  onConsulta,
  abiertaId,
  onAbrir,
  grupoForzado,
  renderFila,
}: {
  tareas: Tarea[]
  consulta: string
  onConsulta: (valor: string) => void
  abiertaId?: string
  onAbrir: (id: string) => void
  grupoForzado?: { estado: Estado; n: number } | null
  renderFila: (tarea: Tarea) => { acciones: Accion[]; izquierda: ReactNode; derecha: ReactNode }
}) {
  const [cerrados, setCerrados] = useState<Set<Estado>>(() => new Set(PLEGADOS_AL_INICIO))
  useEffect(() => {
    if (!grupoForzado) return
    setCerrados((prev) => {
      if (!prev.has(grupoForzado.estado)) return prev
      const siguiente = new Set(prev)
      siguiente.delete(grupoForzado.estado)
      return siguiente
    })
  }, [grupoForzado])

  const filtro = consulta.trim().toLowerCase()
  const visibles = tareas.filter(
    (tarea) => !tarea.archivada && (filtro === "" || tarea.titulo.toLowerCase().includes(filtro)),
  )
  const grupos = ORDEN_LISTA.map((estado) => ({
    estado,
    tareas: visibles.filter((tarea) => tarea.estado === estado),
  })).filter((grupo) => grupo.tareas.length > 0)

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="px-3 pb-2">
        <Label htmlFor="buscar-lista" className="sr-only">
          Buscar en la lista
        </Label>
        <Input
          id="buscar-lista"
          value={consulta}
          placeholder="Buscar en la lista"
          onChange={(evento) => onConsulta(evento.target.value)}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto" tabIndex={0} aria-label="Lista de tareas">
        {grupos.length === 0 && filtro ? (
          <VacioFiltro onBorrar={() => onConsulta("")} />
        ) : null}
        <div className="flex flex-col">
          {grupos.map((grupo, indice) => {
            const abierto = !cerrados.has(grupo.estado)
            return (
              <section key={grupo.estado} className={cn(indice > 0 && "mt-6")}>
                <button
                  type="button"
                  className="sticky top-0 z-10 flex h-11 w-full scroll-mt-12 items-center gap-2 bg-background px-3 text-left md:h-8"
                  aria-expanded={abierto}
                  onClick={() =>
                    setCerrados((prev) => {
                      const siguiente = new Set(prev)
                      if (siguiente.has(grupo.estado)) siguiente.delete(grupo.estado)
                      else siguiente.add(grupo.estado)
                      return siguiente
                    })
                  }
                >
                  <EstadoIcono estado={grupo.estado} />
                  <span className="text-sm font-medium">{ETIQUETA_ESTADO[grupo.estado]}</span>
                  <span className="text-sm tabular-nums text-muted-foreground">{grupo.tareas.length}</span>
                  <ChevronRight className={cn("ml-auto size-4 text-muted-foreground", abierto && "rotate-90")} />
                </button>
                {abierto ? (
                  <ul>
                    {grupo.tareas.map((tarea) => {
                      const fila = renderFila(tarea)
                      const seleccionada = tarea.id === abiertaId
                      return (
                        <MenuContextual key={tarea.id} acciones={fila.acciones}>
                          <li
                            className={cn(
                              "relative flex min-h-11 cursor-default items-center gap-2 px-3 hover:bg-accent md:min-h-9",
                              seleccionada && "bg-accent",
                            )}
                            onClick={() => {
                              if (aperturaPermitida()) onAbrir(tarea.id)
                            }}
                          >
                            {seleccionada ? (
                              <span className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                            ) : null}
                            {fila.izquierda}
                            <span className="min-w-0 flex-1 truncate text-sm font-medium">{tarea.titulo}</span>
                            {fila.derecha}
                            <MenuAcciones acciones={fila.acciones} />
                          </li>
                        </MenuContextual>
                      )
                    })}
                  </ul>
                ) : null}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
