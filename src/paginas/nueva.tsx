import { useCallback, useRef, useState } from "react"
import { useBlocker, useNavigate } from "@tanstack/react-router"
import { Cascaron } from "./cascaron"
import { useAlmacen } from "@/datos/almacen"
import { guardarSimulado } from "@/datos/guardar"
import { AvisoCambiosSinGuardar } from "../../registry/kit/aviso-cambios"
import { FormularioRegistro } from "../../registry/kit/formulario-registro"
import { useAvisoSalida } from "../../registry/kit/use-aviso-salida"

export function PaginaNueva() {
  const navigate = useNavigate()
  const almacen = useAlmacen()
  const [sucio, setSucio] = useState(false)
  const sucioRef = useRef(false)
  const onSucio = useCallback((valor: boolean) => {
    sucioRef.current = valor
    setSucio(valor)
  }, [])
  const blocker = useBlocker({
    shouldBlockFn: () => sucioRef.current,
    withResolver: true,
    enableBeforeUnload: false,
  })
  useAvisoSalida({ sucio })

  return (
    <Cascaron migas={[{ etiqueta: "Nueva tarea" }]}>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-24 md:pb-6">
        <FormularioRegistro
          inicial={{ titulo: "", descripcion: "" }}
          onSucioChange={onSucio}
          onCancelar={() => navigate({ to: "/tareas", search: {} })}
          onGuardar={async (valores) => {
            await guardarSimulado()
            sucioRef.current = false
            const id = almacen.crear(valores)
            navigate({ to: "/tareas", search: { tarea: id } })
          }}
        />
      </div>
      <AvisoCambiosSinGuardar
        abierto={blocker.status === "blocked"}
        onQuedarse={() => {
          if (blocker.status === "blocked") blocker.reset()
        }}
        onSalir={() => {
          sucioRef.current = false
          if (blocker.status === "blocked") blocker.proceed()
        }}
      />
    </Cascaron>
  )
}
