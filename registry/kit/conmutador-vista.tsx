import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type Vista = "lista" | "tablero"

export function ConmutadorVista({
  valor,
  onCambio,
}: {
  valor: Vista
  onCambio: (vista: Vista) => void
}) {
  return (
    <ToggleGroup
      type="single"
      value={valor}
      spacing={0}
      variant="outline"
      aria-label="Vista"
      onValueChange={(siguiente) => {
        if (siguiente === "lista" || siguiente === "tablero") onCambio(siguiente)
      }}
    >
      <ToggleGroupItem value="lista" className="h-11 px-3 md:h-8">
        Lista
      </ToggleGroupItem>
      <ToggleGroupItem value="tablero" className="h-11 px-3 md:h-8">
        Tablero
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
