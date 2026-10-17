import { useEffect } from "react"

export type Bloqueador = {
  bloqueado: boolean
  seguir: () => void
  quedarse: () => void
}

export function useAvisoSalida({ sucio }: { sucio: boolean; bloqueador?: Bloqueador }) {
  useEffect(() => {
    if (!sucio) return
    const avisar = (evento: BeforeUnloadEvent) => {
      evento.preventDefault()
      evento.returnValue = ""
    }
    window.addEventListener("beforeunload", avisar)
    return () => window.removeEventListener("beforeunload", avisar)
  }, [sucio])
}
