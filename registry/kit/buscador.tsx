import { useEffect } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { conMod } from "./atajos"
import type { Accion } from "./acciones"

export function Buscador({
  abierto,
  onAbiertoChange,
  tareas,
  acciones,
  onElegirTarea,
}: {
  abierto: boolean
  onAbiertoChange: (abierto: boolean) => void
  tareas: { id: string; titulo: string }[]
  acciones: Accion[]
  onElegirTarea: (id: string) => void
}) {
  useEffect(() => {
    const alTecla = (evento: KeyboardEvent) => {
      if (!conMod(evento) || evento.key.toLowerCase() !== "k") return
      evento.preventDefault()
      onAbiertoChange(!abierto)
    }
    window.addEventListener("keydown", alTecla)
    return () => window.removeEventListener("keydown", alTecla)
  }, [abierto, onAbiertoChange])

  return (
    <CommandDialog
      open={abierto}
      onOpenChange={onAbiertoChange}
      title="Buscar"
      description="Busca una tarea por título o identificador."
    >
      <CommandInput placeholder="Buscar…" />
      <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>
        <CommandGroup heading="Tareas">
          {tareas.map((tarea) => (
            <CommandItem
              key={tarea.id}
              value={`${tarea.id} ${tarea.titulo}`}
              onSelect={() => {
                onElegirTarea(tarea.id)
                onAbiertoChange(false)
              }}
            >
              <span className="text-muted-foreground">{tarea.id}</span>
              <span className="truncate">{tarea.titulo}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        {acciones.length > 0 ? (
          <CommandGroup heading="Acciones">
            {acciones.map((accion) => (
              <CommandItem
                key={accion.id}
                value={accion.etiqueta}
                onSelect={() => {
                  accion.ejecutar()
                  onAbiertoChange(false)
                }}
              >
                {accion.etiqueta}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  )
}
