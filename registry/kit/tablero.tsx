import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { EstadoIcono } from "./estado-icono"
import { ETIQUETA_ESTADO } from "./etiquetas"
import { ORDEN_TABLERO } from "./orden"
import type { Tarea } from "./tipos"
import { MenuAcciones, MenuContextual, aperturaPermitida } from "./acciones"
import type { Accion } from "./acciones"

export function Tablero({
  tareas,
  consulta,
  abiertaId,
  onAbrir,
  renderTarjeta,
}: {
  tareas: Tarea[]
  consulta: string
  abiertaId?: string
  onAbrir: (id: string) => void
  renderTarjeta: (tarea: Tarea) => { acciones: Accion[]; controles: ReactNode }
}) {
  const filtro = consulta.trim().toLowerCase()
  const visibles = tareas.filter(
    (tarea) => !tarea.archivada && (filtro === "" || tarea.titulo.toLowerCase().includes(filtro)),
  )
  return (
    <div
      className="flex min-h-0 min-w-0 flex-1 snap-x snap-mandatory scroll-pl-3 gap-3 overflow-x-auto px-3 pb-3 md:snap-none"
      tabIndex={0}
      aria-label="Tablero de tareas"
    >
      {ORDEN_TABLERO.map((estado) => {
        const columna = visibles.filter((tarea) => tarea.estado === estado)
        return (
          <section
            key={estado}
            aria-label={ETIQUETA_ESTADO[estado]}
            className="flex w-[85%] shrink-0 snap-start flex-col md:w-[calc((100%-2.25rem)/4)]"
          >
            <h2 className="flex h-11 items-center gap-2 md:h-8">
              <EstadoIcono estado={estado} />
              <span className="text-sm font-medium">{ETIQUETA_ESTADO[estado]}</span>
              <span className="text-sm tabular-nums text-muted-foreground">{columna.length}</span>
            </h2>
            <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
              {columna.map((tarea) => {
                const tarjeta = renderTarjeta(tarea)
                const seleccionada = tarea.id === abiertaId
                return (
                  <MenuContextual key={tarea.id} acciones={tarjeta.acciones}>
                    <li
                      className={cn(
                        "relative rounded-md border border-border bg-background p-2",
                        seleccionada && "bg-accent",
                      )}
                      onClick={() => {
                        if (aperturaPermitida()) onAbrir(tarea.id)
                      }}
                    >
                      {seleccionada ? <span className="absolute inset-y-0 left-0 w-0.5 bg-primary" /> : null}
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground">{tarea.id}</span>
                        <span className="min-w-0 flex-1 text-sm font-medium">{tarea.titulo}</span>
                        <MenuAcciones acciones={tarjeta.acciones} />
                      </div>
                      <div className="mt-2 flex items-center gap-2" onClick={(evento) => evento.stopPropagation()}>
                        {tarjeta.controles}
                      </div>
                    </li>
                  </MenuContextual>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
