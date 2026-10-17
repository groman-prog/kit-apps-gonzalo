import { Cascaron } from "./cascaron"
import { Button } from "@/components/ui/button"
import { EstadoIcono } from "../../registry/kit/estado-icono"
import { ETIQUETA_ESTADO, NIVEL_PRIORIDAD, PRIORIDADES, ETIQUETA_PRIORIDAD } from "../../registry/kit/etiquetas"
import { ORDEN_LISTA } from "../../registry/kit/orden"
import { VacioDibujo } from "../../registry/kit/vacio-dibujo"
import { CargandoLista, ErrorCarga, VacioFiltro, VacioPrimerUso } from "../../registry/kit/estados-vista"
import { ConmutadorVista } from "../../registry/kit/conmutador-vista"
import { PrioridadBarras } from "../../registry/kit/marcas"
import { useState } from "react"
import type { Vista } from "../../registry/kit/conmutador-vista"

export function PaginaComponentes() {
  const [vista, setVista] = useState<Vista>("lista")
  return (
    <Cascaron migas={[{ etiqueta: "Componentes" }]}>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 p-4 pb-16">
          <h1 className="text-base font-semibold">Componentes</h1>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Estado</h2>
            <ul className="flex flex-col gap-2">
              {ORDEN_LISTA.map((estado) => (
                <li key={estado} className="flex items-center gap-2 text-sm">
                  <EstadoIcono estado={estado} label={ETIQUETA_ESTADO[estado]} />
                  <span>{ETIQUETA_ESTADO[estado]}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Prioridad</h2>
            <ul className="flex flex-col gap-2">
              {PRIORIDADES.map((prioridad) => (
                <li key={prioridad} className="flex items-center gap-2 text-sm">
                  <PrioridadBarras nivel={NIVEL_PRIORIDAD[prioridad]} />
                  <span>{ETIQUETA_PRIORIDAD[prioridad]}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Vista</h2>
            <ConmutadorVista valor={vista} onCambio={setVista} />
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Botones</h2>
            <div className="flex flex-wrap gap-2">
              <Button type="button">Primario</Button>
              <Button type="button" variant="secondary">
                Secundario
              </Button>
              <Button type="button" variant="outline">
                Contorno
              </Button>
              <Button type="button" variant="ghost">
                Fantasma
              </Button>
              <Button type="button" variant="destructive">
                Destructivo
              </Button>
            </div>
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Vacío de primer uso</h2>
            <VacioDibujo />
            <VacioPrimerUso onCrear={() => undefined} />
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Vacío por filtro</h2>
            <VacioFiltro onBorrar={() => undefined} />
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Error de carga</h2>
            <ErrorCarga onReintentar={() => undefined} />
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Cargando</h2>
            <CargandoLista />
          </section>
        </div>
      </div>
    </Cascaron>
  )
}
