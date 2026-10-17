import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { VacioDibujo } from "./vacio-dibujo"

export function CargandoLista() {
  return (
    <div aria-busy="true" className="flex flex-col gap-2 p-3">
      <p className="sr-only">Cargando la lista.</p>
      {Array.from({ length: 8 }, (_, indice) => (
        <div key={indice} className="h-11 rounded-md bg-muted" />
      ))}
    </div>
  )
}

export function ErrorCarga({ onReintentar }: { onReintentar: () => void }) {
  return (
    <div className="m-3 flex flex-col items-start gap-3 rounded-md bg-secondary p-6">
      <h2 className="text-base font-semibold text-destructive">No se ha podido cargar la lista.</h2>
      <p className="text-sm">Comprueba la conexión y vuelve a intentarlo.</p>
      <Button type="button" variant="outline" onClick={onReintentar}>
        Reintentar
      </Button>
    </div>
  )
}

export function VacioPrimerUso({ onCrear }: { onCrear: () => void }) {
  return (
    <Empty className="border-0">
      <EmptyHeader>
        <EmptyMedia>
          <VacioDibujo />
        </EmptyMedia>
        <EmptyTitle>Todavía no hay tareas.</EmptyTitle>
        <EmptyDescription>Crea la primera para empezar a organizar el trabajo.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button type="button" onClick={onCrear}>
          Nueva tarea
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export function VacioFiltro({ onBorrar }: { onBorrar: () => void }) {
  return (
    <Empty className="border-0">
      <EmptyHeader>
        <EmptyTitle>No hay tareas que coincidan con la búsqueda.</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Button type="button" variant="outline" onClick={onBorrar}>
          Borrar búsqueda
        </Button>
      </EmptyContent>
    </Empty>
  )
}
