import { useRef } from "react"
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

export function AvisoCambiosSinGuardar({
  abierto,
  onQuedarse,
  onSalir,
}: {
  abierto: boolean
  onQuedarse: () => void
  onSalir: () => void
}) {
  const salir = useRef(false)
  return (
    <AlertDialog
      open={abierto}
      onOpenChange={(open) => {
        if (open) return
        if (salir.current) {
          salir.current = false
          return
        }
        onQuedarse()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tienes cambios sin guardar</AlertDialogTitle>
          <AlertDialogDescription>Si sales ahora, se perderán.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mx-0 mb-0 border-t-0 bg-transparent p-0">
          <AlertDialogAction
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              salir.current = true
              onSalir()
            }}
          >
            Descartar cambios
          </AlertDialogAction>
          <AlertDialogCancel variant="default" autoFocus onClick={onQuedarse}>
            Seguir editando
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
