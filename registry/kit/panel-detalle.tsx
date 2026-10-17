import type { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { EstadoIcono } from "./estado-icono"
import { ETIQUETA_ESTADO } from "./etiquetas"
import type { Tarea } from "./tipos"
import { MenuAcciones } from "./acciones"
import type { Accion } from "./acciones"
import { useAnchoMaximo } from "./use-medio"

export function PanelDetalle({
  tarea,
  acciones,
  editando,
  onCerrar,
  onAnterior,
  onSiguiente,
  propiedades,
  formulario,
  onEditar,
}: {
  tarea: Tarea
  acciones: Accion[]
  editando: boolean
  onCerrar: () => void
  onAnterior?: () => void
  onSiguiente?: () => void
  propiedades: ReactNode
  formulario: ReactNode
  onEditar: () => void
}) {
  const movil = useAnchoMaximo(767)
  const estrecho = useAnchoMaximo(1023)
  const cuerpo = (
    <div className="flex h-full min-h-0 flex-col bg-secondary">
      <div className="flex h-12 shrink-0 items-center gap-1 px-2">
        {movil ? (
          <Button type="button" variant="ghost" className="h-11" onClick={onCerrar}>
            Volver
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Cerrar" onClick={onCerrar}>
            <X />
          </Button>
        )}
        <Button type="button" variant="ghost" className="h-11 md:h-8" disabled={!onAnterior} onClick={onAnterior}>
          Anterior
        </Button>
        <Button type="button" variant="ghost" className="h-11 md:h-8" disabled={!onSiguiente} onClick={onSiguiente}>
          Siguiente
        </Button>
        <span className="ml-auto">
          <MenuAcciones acciones={acciones} />
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-24 md:pb-6">
        <p className="text-xs text-muted-foreground">{tarea.id}</p>
        {editando ? (
          <div className="mt-3">{formulario}</div>
        ) : estrecho ? (
          <SheetTitle className="mt-1 text-base font-semibold">{tarea.titulo}</SheetTitle>
        ) : (
          <h2 className="mt-1 text-base font-semibold">{tarea.titulo}</h2>
        )}
        {editando && estrecho ? <SheetTitle className="sr-only">{tarea.titulo}</SheetTitle> : null}
        {editando ? null : <p className="mt-4 text-sm">{tarea.descripcion}</p>}
        {editando ? null : (
          <Button type="button" variant="secondary" className="mt-4 h-11 md:h-8" onClick={onEditar}>
            Editar
          </Button>
        )}
        <section className="mt-6">
          <h3 className="text-sm font-semibold">Propiedades</h3>
          <div className="mt-2 flex flex-col gap-2">{propiedades}</div>
        </section>
        <h3 className="mt-8 text-sm font-semibold">Actividad</h3>
        <ul className="mt-2 flex flex-col gap-2">
          {tarea.actividad.map((entrada, indice) => (
            <li key={`${entrada.hora}-${indice}`} className="flex items-center gap-2 text-sm">
              <span className="tabular-nums text-muted-foreground">{entrada.hora}</span>
              {entrada.desde && entrada.hasta ? (
                <>
                  <EstadoIcono estado={entrada.desde} label={ETIQUETA_ESTADO[entrada.desde]} />
                  <span>a</span>
                  <EstadoIcono estado={entrada.hasta} label={ETIQUETA_ESTADO[entrada.hasta]} />
                  <span>{ETIQUETA_ESTADO[entrada.hasta]}</span>
                </>
              ) : (
                <span>{entrada.texto}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
  if (estrecho) {
    return (
      <Sheet open onOpenChange={(open) => { if (!open) onCerrar() }}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className={
            movil
              ? "w-screen! max-w-none! gap-0 border-0 bg-secondary p-0 sm:max-w-none!"
              : "w-[432px]! max-w-none! gap-0 border-0 bg-secondary p-0 sm:max-w-none!"
          }
        >
          <SheetHeader className="sr-only">
            <SheetDescription>Detalle de la tarea {tarea.id}.</SheetDescription>
          </SheetHeader>
          {cuerpo}
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <aside aria-label="Detalle de la tarea" className="flex h-full w-[432px] shrink-0 flex-col">
      {cuerpo}
    </aside>
  )
}
