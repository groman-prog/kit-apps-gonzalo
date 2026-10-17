import { createContext, useContext, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import type { Estado, Tarea } from "../../registry/kit/tipos"
import { horaAhora, tareasIniciales } from "./ejemplo"

type Almacen = {
  tareas: Tarea[]
  aplicar: (id: string, parcial: Partial<Tarea>) => void
  reemplazar: (id: string, tarea: Tarea) => void
  duplicar: (id: string) => () => void
  archivar: (id: string) => () => void
  borrar: (id: string) => void
  crear: (valores: { titulo: string; descripcion: string }) => string
  guardarTexto: (id: string, valores: { titulo: string; descripcion: string }) => void
}

const Contexto = createContext<Almacen | null>(null)

function siguienteId(tareas: Tarea[]) {
  const maximo = tareas.reduce((mayor, tarea) => {
    const numero = Number(tarea.id.replace("T-", ""))
    return Number.isNaN(numero) ? mayor : Math.max(mayor, numero)
  }, 0)
  return `T-${maximo + 1}`
}

export function AlmacenProvider({ children }: { children: ReactNode }) {
  const [tareas, setTareas] = useState<Tarea[]>(() => tareasIniciales())
  const ref = useRef(tareas)
  ref.current = tareas

  const valor = useMemo<Almacen>(() => {
    return {
      tareas,
      aplicar: (id, parcial) => {
        setTareas((prev) =>
          prev.map((tarea) => {
            if (tarea.id !== id) return tarea
            const siguiente: Tarea = { ...tarea, ...parcial }
            if (parcial.estado && parcial.estado !== tarea.estado) {
              siguiente.actividad = [
                ...tarea.actividad,
                {
                  hora: horaAhora(),
                  texto: "Estado",
                  desde: tarea.estado,
                  hasta: parcial.estado as Estado,
                },
              ]
            }
            return siguiente
          }),
        )
      },
      reemplazar: (id, tarea) => {
        setTareas((prev) => prev.map((actual) => (actual.id === id ? tarea : actual)))
      },
      duplicar: (id) => {
        const origen = ref.current.find((tarea) => tarea.id === id)
        if (!origen) return () => {}
        const copia: Tarea = {
          ...origen,
          id: siguienteId(ref.current),
          titulo: `${origen.titulo} (copia)`,
          actividad: [{ hora: horaAhora(), texto: "Tarea duplicada" }],
        }
        setTareas((prev) => [copia, ...prev])
        return () => setTareas((prev) => prev.filter((tarea) => tarea.id !== copia.id))
      },
      archivar: (id) => {
        setTareas((prev) => prev.map((tarea) => (tarea.id === id ? { ...tarea, archivada: true } : tarea)))
        return () =>
          setTareas((prev) => prev.map((tarea) => (tarea.id === id ? { ...tarea, archivada: false } : tarea)))
      },
      borrar: (id) => setTareas((prev) => prev.filter((tarea) => tarea.id !== id)),
      crear: (valores) => {
        const id = siguienteId(ref.current)
        const tarea: Tarea = {
          id,
          titulo: valores.titulo,
          descripcion: valores.descripcion,
          estado: "sinrevisar",
          prioridad: "ninguna",
          responsableId: "lf",
          etiqueta: "Almacén",
          fecha: "21\u00A0oct",
          archivada: false,
          actividad: [{ hora: horaAhora(), texto: "Tarea creada" }],
        }
        setTareas((prev) => [tarea, ...prev])
        return id
      },
      guardarTexto: (id, valores) => {
        setTareas((prev) =>
          prev.map((tarea) =>
            tarea.id === id ? { ...tarea, titulo: valores.titulo, descripcion: valores.descripcion } : tarea,
          ),
        )
      },
    }
  }, [tareas])

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useAlmacen() {
  const valor = useContext(Contexto)
  if (!valor) throw new Error("Falta el almacén de tareas.")
  return valor
}
