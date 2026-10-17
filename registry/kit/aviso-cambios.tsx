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
        <AlertDialogFooter>
          <AlertDialogCancel autoFocus onClick={onQuedarse}>
            Seguir editando
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              salir.current = true
              onSalir()
            }}
          >
            Descartar cambios
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
