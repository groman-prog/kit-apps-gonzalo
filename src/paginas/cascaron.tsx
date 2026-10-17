import { useState } from "react"
import type { ReactNode } from "react"
import { useNavigate, useRouterState } from "@tanstack/react-router"
import { MarcoApp } from "../../registry/kit/marco-app"
import { Buscador } from "../../registry/kit/buscador"
import type { Accion } from "../../registry/kit/acciones"
import { useAlmacen } from "@/datos/almacen"

export function Cascaron({
  migas,
  primaria,
  acciones = [],
  children,
}: {
  migas: { etiqueta: string }[]
  primaria?: { etiqueta: string; onClick: () => void }
  acciones?: Accion[]
  children: ReactNode
}) {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (estado) => estado.location.pathname })
  const { tareas } = useAlmacen()
  const [buscar, setBuscar] = useState(false)
  const cuenta = tareas.filter((tarea) => !tarea.archivada).length
  return (
    <MarcoApp
      nombre="Tareas de operaciones"
      usuario="Gonzalo Román"
      secciones={[
        {
          etiqueta: "Tareas",
          href: "/tareas",
          contador: cuenta,
          activa: pathname.startsWith("/tareas"),
        },
        { etiqueta: "Componentes", href: "/componentes", activa: pathname === "/componentes" },
      ]}
      ajustes={{ etiqueta: "Ajustes", href: "/ajustes", activa: pathname === "/ajustes" }}
      migas={migas}
      primaria={primaria}
      onIr={(href) => {
        if (href === "/tareas") navigate({ to: "/tareas", search: {} })
        else if (href === "/tareas/nueva") navigate({ to: "/tareas/nueva" })
        else if (href === "/ajustes") navigate({ to: "/ajustes" })
        else if (href === "/componentes") navigate({ to: "/componentes" })
      }}
      onBuscar={() => setBuscar(true)}
    >
      {children}
      <Buscador
        abierto={buscar}
        onAbiertoChange={setBuscar}
        tareas={tareas.filter((tarea) => !tarea.archivada)}
        acciones={acciones}
        onElegirTarea={(id) => navigate({ to: "/tareas", search: { tarea: id } })}
      />
    </MarcoApp>
  )
}
