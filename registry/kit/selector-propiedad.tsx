import { useId, useState } from "react"
import type { ReactNode } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { silenciarApertura } from "./acciones"
import { useAnchoMaximo } from "./use-medio"

export type OpcionSelector = {
  id: string
  etiqueta: string
  icono?: ReactNode
}

export function SelectorPropiedad({
  etiqueta,
  texto,
  icono,
  opciones,
  valorId,
  placeholder,
  complemento,
  abierto,
  onAbiertoChange,
  onElegir,
}: {
  etiqueta: string
  texto: string
  icono?: ReactNode
  opciones: OpcionSelector[]
  valorId: string
  placeholder: string
  complemento?: string
  abierto?: boolean
  onAbiertoChange?: (abierto: boolean) => void
  onElegir: (id: string) => void
}) {
  const movil = useAnchoMaximo(767)
  const idFiltro = useId()
  const [interno, setInterno] = useState(false)
  const [filtro, setFiltro] = useState("")
  const estaAbierto = abierto ?? interno
  const cambiar = (siguiente: boolean) => {
    if (!siguiente) setFiltro("")
    onAbiertoChange?.(siguiente)
    if (abierto === undefined) setInterno(siguiente)
  }
  const elegir = (id: string) => {
    silenciarApertura()
    cambiar(false)
    if (id !== valorId) onElegir(id)
  }
  const nombre = complemento ? `${etiqueta}: ${complemento} ${texto}` : `${etiqueta}: ${texto}`
  const boton = (
    <Button
      type="button"
      variant="ghost"
      className="h-11 max-w-full justify-start gap-1 px-1 md:h-8"
      aria-label={nombre}
      onClick={(evento) => evento.stopPropagation()}
    >
      {icono}
      {complemento ? " " : null}
      <span className="truncate hidden md:inline">{texto}</span>
    </Button>
  )
  if (movil) {
    const visibles = opciones.filter((opcion) =>
      opcion.etiqueta.toLowerCase().includes(filtro.trim().toLowerCase()),
    )
    return (
      <Drawer open={estaAbierto} onOpenChange={cambiar}>
        <DrawerTrigger asChild>{boton}</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="px-4 pt-2 text-left">{placeholder}</DrawerTitle>
          <DrawerDescription className="sr-only">Elige una opción de la lista.</DrawerDescription>
          <label className="sr-only" htmlFor={idFiltro}>
            {placeholder}
          </label>
          <input
            id={idFiltro}
            value={filtro}
            onChange={(evento) => setFiltro(evento.target.value)}
            placeholder={placeholder}
            className="mx-4 mt-2 h-11 rounded-md border border-input bg-background px-3"
          />
          <ul role="listbox" aria-label={placeholder} className="max-h-80 overflow-y-auto p-2">
            {visibles.map((opcion) => (
              <li key={opcion.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opcion.id === valorId}
                  className="flex min-h-11 w-full items-center gap-2 rounded-md px-2 text-left hover:bg-muted"
                  onPointerDown={(evento) => evento.stopPropagation()}
                  onClick={() => elegir(opcion.id)}
                >
                  {opcion.icono}
                  <span className="flex-1 truncate">{opcion.etiqueta}</span>
                  {opcion.id === valorId ? <Check className="size-4" /> : null}
                </button>
              </li>
            ))}
          </ul>
        </DrawerContent>
      </Drawer>
    )
  }
  return (
    <Popover open={estaAbierto} onOpenChange={cambiar}>
      <PopoverTrigger asChild>{boton}</PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup>
              {opciones.map((opcion) => (
                <CommandItem
                  key={opcion.id}
                  value={opcion.etiqueta}
                  data-checked={opcion.id === valorId}
                  onSelect={() => elegir(opcion.id)}
                >
                  {opcion.icono}
                  <span className={cn(opcion.id === valorId && "font-medium")}>{opcion.etiqueta}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
