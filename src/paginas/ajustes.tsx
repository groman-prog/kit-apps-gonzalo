import { Cascaron } from "./cascaron"

export function PaginaAjustes() {
  return (
    <Cascaron migas={[{ etiqueta: "Ajustes" }]}>
      <div className="flex flex-col gap-4 p-6">
        <h1 className="text-base font-semibold">Ajustes</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Esta aplicación usa la paleta Carbón.</p>
      </div>
    </Cascaron>
  )
}
