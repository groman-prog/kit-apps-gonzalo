import { useState } from "react"
import { Cascaron } from "./cascaron"
import { Label } from "@/components/ui/label"

type Tema = "ambar" | "oliva" | "petroleo"

function temaActual(): Tema {
  const valor = document.documentElement.getAttribute("data-tema")
  return valor === "oliva" || valor === "petroleo" ? valor : "ambar"
}

export function PaginaAjustes() {
  const [tema, setTema] = useState<Tema>(temaActual)
  return (
    <Cascaron migas={[{ etiqueta: "Ajustes" }]}>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-base font-semibold">Ajustes</h1>
        <div className="flex max-w-sm flex-col gap-1">
          <Label htmlFor="tema">Tema</Label>
          <select
            id="tema"
            value={tema}
            className="h-11 rounded-md border border-input bg-background px-2 md:h-8"
            onChange={(evento) => {
              const siguiente = evento.target.value as Tema
              setTema(siguiente)
              if (siguiente === "ambar") document.documentElement.removeAttribute("data-tema")
              else document.documentElement.setAttribute("data-tema", siguiente)
              localStorage.setItem("kit-tema", siguiente)
            }}
          >
            <option value="ambar">Ámbar</option>
            <option value="oliva">Oliva</option>
            <option value="petroleo">Petróleo</option>
          </select>
          <p className="text-xs text-muted-foreground">El tema ámbar es el de esta aplicación.</p>
        </div>
      </div>
    </Cascaron>
  )
}
