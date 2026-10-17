import { useCallback, useRef, useState } from "react"
import type { ReactNode } from "react"
import { useBlocker, useNavigate, useSearch } from "@tanstack/react-router"
import { Cascaron } from "./cascaron"
import { useAlmacen } from "@/datos/almacen"
import { useCarga } from "@/datos/carga"
import { ETIQUETAS, FECHAS, RESPONSABLES } from "@/datos/ejemplo"
import { guardarSimulado } from "@/datos/guardar"
import { tareaDe } from "@/app/busqueda"
import type { BusquedaTareas } from "@/app/busqueda"
import { accionesTarea, ConfirmarBorrado } from "../../registry/kit/acciones"
import type { Accion, ManejadoresTarea } from "../../registry/kit/acciones"
import { AvisoCambiosSinGuardar } from "../../registry/kit/aviso-cambios"
import { ConmutadorVista } from "../../registry/kit/conmutador-vista"
import type { Vista } from "../../registry/kit/conmutador-vista"
import { ETIQUETA_ESTADO, ETIQUETA_PRIORIDAD, NIVEL_PRIORIDAD, PRIORIDADES } from "../../registry/kit/etiquetas"
import { EstadoIcono } from "../../registry/kit/estado-icono"
import { CargandoLista, ErrorCarga, VacioPrimerUso } from "../../registry/kit/estados-vista"
import { FormularioRegistro } from "../../registry/kit/formulario-registro"
import { ListaAgrupada } from "../../registry/kit/lista-agrupada"
import { Iniciales, PrioridadBarras } from "../../registry/kit/marcas"
import { ORDEN_LISTA } from "../../registry/kit/orden"
import { PanelDetalle } from "../../registry/kit/panel-detalle"
import { SelectorPropiedad } from "../../registry/kit/selector-propiedad"
import { Tablero } from "../../registry/kit/tablero"
import type { CampoSelector, Estado, Prioridad, Tarea } from "../../registry/kit/tipos"
import { useAvisoSalida } from "../../registry/kit/use-aviso-salida"
import { useCambioMenor } from "../../registry/kit/use-cambio-menor"

function parche(campo: CampoSelector, valor: string): Partial<Tarea> {
  if (campo === "estado") return { estado: valor as Estado }
  if (campo === "prioridad") return { prioridad: valor as Prioridad }
  if (campo === "responsable") return { responsableId: valor }
  if (campo === "etiqueta") return { etiqueta: valor }
  return { fecha: valor }
}

function mensajeDe(campo: CampoSelector, valor: string) {
  if (campo === "estado") return `Estado cambiado a ${ETIQUETA_ESTADO[valor as Estado]}`
  if (campo === "prioridad") return `Prioridad cambiada a ${ETIQUETA_PRIORIDAD[valor as Prioridad]}`
  if (campo === "responsable") {
    return `Responsable cambiado a ${RESPONSABLES.find((persona) => persona.id === valor)?.nombre ?? valor}`
  }
  if (campo === "etiqueta") return `Etiqueta cambiada a ${valor}`
  return `Fecha cambiada a ${valor}`
}

export function PaginaTareas() {
  const search = useSearch({ from: "/tareas" })
  const navigate = useNavigate()
  const almacen = useAlmacen()
  const ejecutar = useCambioMenor()
  const [reintento, setReintento] = useState(0)
  const faseReal = useCarga(search.demo, reintento)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [selector, setSelector] = useState<{ id: string; campo: CampoSelector } | null>(null)
  const [borrarId, setBorrarId] = useState<string | null>(null)
  const [enlace, setEnlace] = useState("")
  const [forzar, setForzar] = useState<{ estado: Estado; n: number } | null>(null)
  const [sucio, setSucio] = useState(false)
  const sucioRef = useRef(false)
  const onSucio = useCallback((valor: boolean) => {
    sucioRef.current = valor
    setSucio(valor)
  }, [])
  const blocker = useBlocker({
    shouldBlockFn: ({ current, next }) => {
      if (!sucioRef.current) return false
      if (current.pathname !== next.pathname) return true
      return tareaDe(current.search) !== tareaDe(next.search)
    },
    withResolver: true,
    enableBeforeUnload: false,
  })
  useAvisoSalida({ sucio })

  const vista: Vista = search.vista ?? "lista"
  const consulta = search.q ?? ""
  const ir = (parcial: Partial<BusquedaTareas>, replace = false) => {
    navigate({ to: "/tareas", replace, search: (prev) => ({ ...prev, ...parcial }) })
  }
  const visibles = almacen.tareas.filter((tarea) => !tarea.archivada)
  const sinTareas = search.demo === "vacio" || (faseReal === "listo" && visibles.length === 0 && !consulta)
  const abierta = visibles.find((tarea) => tarea.id === search.tarea)
  const orden = ORDEN_LISTA.flatMap((estado) =>
    visibles.filter((tarea) => {
      const coincide = consulta === "" || tarea.titulo.toLowerCase().includes(consulta.toLowerCase())
      return coincide && tarea.estado === estado
    }),
  )
  const indice = abierta ? orden.findIndex((tarea) => tarea.id === abierta.id) : -1

  async function cambiar(tarea: Tarea, campo: CampoSelector, valor: string) {
    const anterior = { ...tarea, actividad: [...tarea.actividad] }
    await ejecutar({
      mensaje: mensajeDe(campo, valor),
      aplicar: () => {
        almacen.aplicar(tarea.id, parche(campo, valor))
        if (campo === "estado") setForzar({ estado: valor as Estado, n: Date.now() })
      },
      revertir: () => almacen.reemplazar(tarea.id, anterior),
      guardar: guardarSimulado,
    })
  }

  function manejadores(tarea: Tarea): ManejadoresTarea {
    return {
      cambiarEstado: () => setSelector({ id: tarea.id, campo: "estado" }),
      cambiarResponsable: () => setSelector({ id: tarea.id, campo: "responsable" }),
      cambiarPrioridad: () => setSelector({ id: tarea.id, campo: "prioridad" }),
      editar: () => {
        setEditandoId(tarea.id)
        ir({ tarea: tarea.id })
      },
      duplicar: () => {
        let deshacer = () => {}
        void ejecutar({
          mensaje: "Tarea duplicada",
          aplicar: () => {
            deshacer = almacen.duplicar(tarea.id)
          },
          revertir: () => deshacer(),
          guardar: guardarSimulado,
        })
      },
      archivar: () => {
        let deshacer = () => {}
        void ejecutar({
          mensaje: "Tarea archivada",
          aplicar: () => {
            deshacer = almacen.archivar(tarea.id)
          },
          revertir: () => deshacer(),
          guardar: guardarSimulado,
        })
      },
      copiarEnlace: () => {
        const url = `${window.location.origin}/tareas?tarea=${tarea.id}`
        void navigator.clipboard?.writeText(url).catch(() => undefined)
        setEnlace("Enlace copiado")
        window.setTimeout(() => setEnlace(""), 3000)
      },
      borrar: () => setBorrarId(tarea.id),
    }
  }

  function accionesDe(tarea: Tarea): Accion[] {
    return accionesTarea(tarea, manejadores(tarea))
  }

  function selectorDe(tarea: Tarea, campo: CampoSelector) {
    const persona = RESPONSABLES.find((item) => item.id === tarea.responsableId)
    const mapa = {
      estado: {
        etiqueta: "Estado",
        texto: ETIQUETA_ESTADO[tarea.estado],
        valorId: tarea.estado,
        placeholder: "Cambiar estado…",
        icono: <EstadoIcono estado={tarea.estado} />,
        opciones: ORDEN_LISTA.map((estado) => ({
          id: estado,
          etiqueta: ETIQUETA_ESTADO[estado],
          icono: <EstadoIcono estado={estado} />,
        })),
      },
      prioridad: {
        etiqueta: "Prioridad",
        texto: ETIQUETA_PRIORIDAD[tarea.prioridad],
        valorId: tarea.prioridad,
        placeholder: "Cambiar prioridad…",
        icono: <PrioridadBarras nivel={NIVEL_PRIORIDAD[tarea.prioridad]} />,
        opciones: PRIORIDADES.map((prioridad) => ({
          id: prioridad,
          etiqueta: ETIQUETA_PRIORIDAD[prioridad],
          icono: <PrioridadBarras nivel={NIVEL_PRIORIDAD[prioridad]} />,
        })),
      },
      responsable: {
        etiqueta: "Responsable",
        texto: persona?.nombre ?? "Sin responsable",
        valorId: tarea.responsableId,
        placeholder: "Cambiar responsable…",
        icono: <Iniciales iniciales={persona?.iniciales ?? "?"} />,
        complemento: persona?.iniciales,
        opciones: RESPONSABLES.map((item) => ({
          id: item.id,
          etiqueta: item.nombre,
          icono: <Iniciales iniciales={item.iniciales} />,
        })),
      },
      etiqueta: {
        etiqueta: "Etiqueta",
        texto: tarea.etiqueta,
        valorId: tarea.etiqueta,
        placeholder: "Cambiar etiqueta…",
        icono: undefined,
        opciones: ETIQUETAS.map((item) => ({ id: item, etiqueta: item })),
      },
      fecha: {
        etiqueta: "Fecha",
        texto: tarea.fecha,
        valorId: tarea.fecha,
        placeholder: "Cambiar fecha…",
        icono: undefined,
        opciones: FECHAS.map((item) => ({ id: item, etiqueta: item })),
      },
    } as const
    const actual = mapa[campo]
    return (
      <SelectorPropiedad
        key={`${tarea.id}-${campo}`}
        etiqueta={actual.etiqueta}
        texto={actual.texto}
        icono={actual.icono}
        valorId={actual.valorId}
        placeholder={actual.placeholder}
        complemento={"complemento" in actual ? actual.complemento : undefined}
        opciones={actual.opciones}
        abierto={selector?.id === tarea.id && selector.campo === campo}
        onAbiertoChange={(abierto) => setSelector(abierto ? { id: tarea.id, campo } : null)}
        onElegir={(valor) => void cambiar(tarea, campo, valor)}
      />
    )
  }

  function fila(tarea: Tarea) {
    return {
      acciones: accionesDe(tarea),
      izquierda: (
        <>
          {selectorDe(tarea, "prioridad")}
          <span className="shrink-0 text-xs text-muted-foreground">{tarea.id}</span>
          {selectorDe(tarea, "estado")}
        </>
      ),
      derecha: (
        <>
          <span className="hidden text-xs text-muted-foreground md:inline">{tarea.etiqueta}</span>
          {selectorDe(tarea, "responsable")}
          <span className="hidden text-xs tabular-nums text-muted-foreground md:inline">{tarea.fecha}</span>
        </>
      ),
    }
  }

  let cuerpo: ReactNode = null
  if (faseReal === "inicial" || faseReal === "skeleton") {
    cuerpo = faseReal === "skeleton" ? <CargandoLista /> : <div className="min-h-0 flex-1" />
  } else if (faseReal === "error") {
    cuerpo = <ErrorCarga onReintentar={() => setReintento((valor) => valor + 1)} />
  } else if (faseReal === "listo" && (search.demo === "vacio" || visibles.length === 0)) {
    cuerpo = <VacioPrimerUso onCrear={() => navigate({ to: "/tareas/nueva" })} />
  } else if (faseReal === "listo") {
    cuerpo = (
      <div className="flex min-h-0 min-w-0 flex-1">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex h-12 shrink-0 items-center justify-between gap-2 px-3">
            <ConmutadorVista
              valor={vista}
              onCambio={(siguiente) => ir({ vista: siguiente === "tablero" ? "tablero" : undefined }, true)}
            />
            <p className="text-xs text-muted-foreground">Datos de ejemplo</p>
          </div>
          {enlace ? (
            <p role="status" className="px-3 text-xs text-muted-foreground">
              {enlace}
            </p>
          ) : null}
          {vista === "tablero" ? (
            <Tablero
              tareas={search.demo === "vacio" ? [] : almacen.tareas}
              consulta={consulta}
              abiertaId={abierta?.id}
              onAbrir={(id) => ir({ tarea: id })}
              renderTarjeta={(tarea) => ({
                acciones: accionesDe(tarea),
                controles: (
                  <>
                    {selectorDe(tarea, "estado")}
                    {selectorDe(tarea, "responsable")}
                  </>
                ),
              })}
            />
          ) : (
            <ListaAgrupada
              tareas={search.demo === "vacio" ? [] : almacen.tareas}
              consulta={consulta}
              onConsulta={(valor) => ir({ q: valor || undefined }, true)}
              abiertaId={abierta?.id}
              onAbrir={(id) => ir({ tarea: id })}
              grupoForzado={forzar}
              renderFila={fila}
            />
          )}
        </div>
        {abierta && search.demo !== "vacio" ? (
          <PanelDetalle
            tarea={abierta}
            acciones={accionesDe(abierta)}
            editando={editandoId === abierta.id}
            onCerrar={() => ir({ tarea: undefined })}
            onAnterior={indice > 0 ? () => ir({ tarea: orden[indice - 1]?.id }) : undefined}
            onSiguiente={indice >= 0 && indice < orden.length - 1 ? () => ir({ tarea: orden[indice + 1]?.id }) : undefined}
            onEditar={() => setEditandoId(abierta.id)}
            propiedades={
              <>
                {selectorDe(abierta, "estado")}
                {selectorDe(abierta, "prioridad")}
                {selectorDe(abierta, "responsable")}
                {selectorDe(abierta, "etiqueta")}
                {selectorDe(abierta, "fecha")}
              </>
            }
            formulario={
              <FormularioRegistro
                embebido
                inicial={{ titulo: abierta.titulo, descripcion: abierta.descripcion }}
                onSucioChange={onSucio}
                onCancelar={() => setEditandoId(null)}
                onGuardar={async (valores) => {
                  await guardarSimulado()
                  almacen.guardarTexto(abierta.id, valores)
                }}
              />
            }
          />
        ) : null}
      </div>
    )
  }

  const primaria =
    faseReal === "listo" && sinTareas
      ? undefined
      : { etiqueta: "Nueva tarea", onClick: () => navigate({ to: "/tareas/nueva" }) }

  return (
    <Cascaron migas={[{ etiqueta: "Tareas" }]} primaria={primaria} acciones={abierta ? accionesDe(abierta) : []}>
      {cuerpo}
      <ConfirmarBorrado
        abierto={borrarId !== null}
        onCancelar={() => setBorrarId(null)}
        onConfirmar={() => {
          if (borrarId) almacen.borrar(borrarId)
          if (borrarId === search.tarea) ir({ tarea: undefined })
          setBorrarId(null)
        }}
      />
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
