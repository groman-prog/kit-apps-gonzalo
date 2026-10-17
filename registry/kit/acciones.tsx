import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useRef } from "react"
import type { ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type GrupoAccion = "cambiar" | "editar" | "gestionar" | "enlace" | "peligro"

export type Accion = {
  id: string
  etiqueta: string
  grupo: GrupoAccion
  peligrosa?: boolean
  ejecutar: () => void
}

export type ManejadoresTarea = {
  cambiarEstado: () => void
  cambiarResponsable: () => void
  cambiarPrioridad: () => void
  editar: () => void
  duplicar: () => void
  archivar: () => void
  copiarEnlace: () => void
  borrar: () => void
}

export function accionesTarea(tarea: { id: string }, manejadores: ManejadoresTarea): Accion[] {
  return [
    {
      id: `estado-${tarea.id}`,
      etiqueta: "Cambiar estado…",
      grupo: "cambiar",
      ejecutar: manejadores.cambiarEstado,
    },
    {
      id: `responsable-${tarea.id}`,
      etiqueta: "Cambiar responsable…",
      grupo: "cambiar",
      ejecutar: manejadores.cambiarResponsable,
    },
    {
      id: `prioridad-${tarea.id}`,
      etiqueta: "Cambiar prioridad…",
      grupo: "cambiar",
      ejecutar: manejadores.cambiarPrioridad,
    },
    {
      id: `editar-${tarea.id}`,
      etiqueta: "Editar…",
      grupo: "editar",
      ejecutar: manejadores.editar,
    },
    {
      id: `duplicar-${tarea.id}`,
      etiqueta: "Duplicar",
      grupo: "gestionar",
      ejecutar: manejadores.duplicar,
    },
    {
      id: `archivar-${tarea.id}`,
      etiqueta: "Archivar",
      grupo: "gestionar",
      ejecutar: manejadores.archivar,
    },
    {
      id: `enlace-${tarea.id}`,
      etiqueta: "Copiar enlace",
      grupo: "enlace",
      ejecutar: manejadores.copiarEnlace,
    },
    {
      id: `borrar-${tarea.id}`,
      etiqueta: "Borrar…",
      grupo: "peligro",
      peligrosa: true,
      ejecutar: manejadores.borrar,
    },
  ]
}

function clases(accion: Accion, anterior: Accion | undefined) {
  return cn(anterior && anterior.grupo !== accion.grupo && "mt-1", accion.peligrosa && "text-destructive")
}

// En táctil, al cerrarse el menú el navegador suelta un clic sobre lo que queda debajo.
let silencioHasta = 0

export function silenciarApertura() {
  silencioHasta = performance.now() + 700
}

export function aperturaPermitida() {
  return performance.now() >= silencioHasta
}

function lanzar(accion: Accion) {
  silenciarApertura()
  accion.ejecutar()
}

export function MenuAcciones({ acciones }: { acciones: Accion[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 shrink-0 text-muted-foreground md:size-8"
          aria-label="…"
          onClick={(evento) => evento.stopPropagation()}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {acciones.map((accion, indice) => (
          <DropdownMenuItem
            key={accion.id}
            className={clases(accion, acciones[indice - 1])}
            onSelect={() => lanzar(accion)}
          >
            {accion.etiqueta}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function MenuContextual({ acciones, children }: { acciones: Accion[]; children: ReactNode }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {acciones.map((accion, indice) => (
          <ContextMenuItem
            key={accion.id}
            className={clases(accion, acciones[indice - 1])}
            onSelect={() => lanzar(accion)}
          >
            {accion.etiqueta}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}

export function ConfirmarBorrado({
  abierto,
  onCancelar,
  onConfirmar,
}: {
  abierto: boolean
  onCancelar: () => void
  onConfirmar: () => void
}) {
  const confirmar = useRef(false)
  return (
    <AlertDialog
      open={abierto}
      onOpenChange={(open) => {
        if (open) return
        if (confirmar.current) {
          confirmar.current = false
          return
        }
        onCancelar()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Borrar tarea</AlertDialogTitle>
          <AlertDialogDescription>No se puede deshacer.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancelar}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              confirmar.current = true
              onConfirmar()
            }}
          >
            Borrar tarea
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
