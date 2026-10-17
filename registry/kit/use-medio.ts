import { useEffect, useState } from "react"

export function useAnchoMaximo(px: number) {
  const [coincide, setCoincide] = useState(false)
  useEffect(() => {
    const consulta = window.matchMedia(`(max-width: ${px}px)`)
    const aplicar = () => setCoincide(consulta.matches)
    aplicar()
    consulta.addEventListener("change", aplicar)
    return () => consulta.removeEventListener("change", aplicar)
  }, [px])
  return coincide
}
