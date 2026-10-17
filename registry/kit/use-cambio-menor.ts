import { toast } from "sonner"

const ERROR = "No se ha podido guardar. Se ha deshecho el cambio."

export type CambioMenor = {
  aplicar: () => void
  revertir: () => void
  mensaje: string
  guardar: () => Promise<void>
}

export function useCambioMenor() {
  return async function ejecutar({ aplicar, revertir, mensaje, guardar }: CambioMenor) {
    aplicar()
    try {
      await guardar()
      toast(mensaje, {
        duration: 8000,
        action: {
          label: "Deshacer",
          onClick: () => {
            void (async () => {
              revertir()
              try {
                await guardar()
              } catch {
                aplicar()
                toast.error(ERROR, { duration: 8000 })
              }
            })()
          },
        },
      })
    } catch {
      revertir()
      toast.error(ERROR, { duration: 8000 })
    }
  }
}
