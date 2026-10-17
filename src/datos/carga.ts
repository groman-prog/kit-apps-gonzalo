import { useEffect, useState } from "react"

export type FaseCarga = "inicial" | "skeleton" | "listo" | "error"
export type Demo = "cargando" | "error" | "vacio"

export function useCarga(demo: Demo | undefined, reintento: number): FaseCarga {
  const [fase, setFase] = useState<FaseCarga>("inicial")
  useEffect(() => {
    let vivo = true
    const temporizadores: number[] = []
    setFase("inicial")
    const limpiar = () => {
      vivo = false
      for (const id of temporizadores) window.clearTimeout(id)
    }
    if (demo === "cargando") {
      temporizadores.push(
        window.setTimeout(() => {
          if (vivo) setFase("skeleton")
        }, 200),
      )
      return limpiar
    }
    let skeletonEn = 0
    temporizadores.push(
      window.setTimeout(() => {
        skeletonEn = performance.now()
        if (vivo) setFase("skeleton")
      }, 200),
    )
    temporizadores.push(
      window.setTimeout(() => {
        const terminar = () => {
          if (!vivo) return
          setFase(demo === "error" && reintento === 0 ? "error" : "listo")
        }
        if (skeletonEn === 0) {
          terminar()
          return
        }
        const falta = 400 - (performance.now() - skeletonEn)
        temporizadores.push(window.setTimeout(terminar, Math.max(0, falta)))
      }, 300),
    )
    return limpiar
  }, [demo, reintento])
  return fase
}
