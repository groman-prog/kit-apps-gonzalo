import type { Estado, Prioridad, Responsable, Tarea } from "../../registry/kit/tipos"

const NBSP = "\u00A0"

export const RESPONSABLES: Responsable[] = [
  { id: "lf", nombre: "Lucía Ferrer", iniciales: "LF" },
  { id: "mv", nombre: "Marcos Vidal", iniciales: "MV" },
  { id: "ab", nombre: "Ana Beltrán", iniciales: "AB" },
  { id: "ph", nombre: "Pablo Herrera", iniciales: "PH" },
  { id: "er", nombre: "Elena Ruiz", iniciales: "ER" },
  { id: "js", nombre: "Javier Soto", iniciales: "JS" },
]

export const ETIQUETAS = ["Almacén", "Clientes", "Proveedores", "Turnos", "Calidad"]
export const FECHAS = [`21${NBSP}oct`, `24${NBSP}oct`, `28${NBSP}oct`, `4${NBSP}nov`, `15${NBSP}nov`]

const PRIORIDADES: Prioridad[] = ["ninguna", "baja", "media", "alta", "urgente"]
const IDS_RESPONSABLE = RESPONSABLES.map((persona) => persona.id)

const FILAS: [string, Estado, string][] = [
  ["T-1", "curso", "Revisar el albarán del proveedor"],
  ["T-2", "curso", "Cerrar la incidencia del muelle 2"],
  ["T-3", "curso", "Coordinar la visita de calidad"],
  ["T-4", "curso", "Comprobar el stock de seguridad"],
  ["T-5", "revision", "Validar el nuevo proveedor"],
  ["T-6", "revision", "Revisar el contrato de limpieza"],
  ["T-7", "revision", "Actualizar los precios de tarifa"],
  ["T-8", "porhacer", "Confirmar la entrega del jueves"],
  ["T-9", "porhacer", "Pedir presupuesto del embalaje"],
  ["T-10", "porhacer", "Preparar el inventario de octubre"],
  ["T-11", "porhacer", "Reservar el transporte de vuelta"],
  ["T-12", "porhacer", "Confirmar el turno del sábado"],
  ["T-13", "sinrevisar", "Anotar la merma de la semana"],
  ["T-14", "sinrevisar", "Reponer el material de oficina"],
  ["T-15", "sinrevisar", "Solicitar la llave del almacén"],
  ["T-16", "bloqueada", "Avisar del retraso al cliente"],
  ["T-17", "bloqueada", "Registrar la devolución del pedido"],
  ["T-18", "hecha", "Actualizar el horario de recogida"],
  ["T-19", "hecha", "Llamar al responsable de almacén"],
  ["T-20", "hecha", "Enviar el parte de incidencias"],
  ["T-21", "hecha", "Archivar los albaranes de septiembre"],
  ["T-22", "cancelada", "Comprobar las facturas pendientes"],
  ["T-23", "cancelada", "Preparar la reunión de operaciones"],
  ["T-24", "cancelada", "Cerrar el parte de avería"],
]

export function tareasIniciales(): Tarea[] {
  return FILAS.map(([id, estado, titulo], indice) => ({
    id,
    titulo,
    descripcion: `Seguimiento de operaciones para ${titulo.charAt(0).toLowerCase()}${titulo.slice(1)}.`,
    estado,
    prioridad: PRIORIDADES[indice % PRIORIDADES.length] ?? "ninguna",
    responsableId: IDS_RESPONSABLE[indice % IDS_RESPONSABLE.length] ?? "lf",
    etiqueta: ETIQUETAS[indice % ETIQUETAS.length] ?? "Almacén",
    fecha: FECHAS[indice % FECHAS.length] ?? FECHAS[0] ?? "",
    archivada: false,
    actividad: [{ hora: "09:00", texto: "Tarea creada" }],
  }))
}

export function horaAhora() {
  const ahora = new Date()
  const horas = String(ahora.getHours()).padStart(2, "0")
  const minutos = String(ahora.getMinutes()).padStart(2, "0")
  return `${horas}:${minutos}`
}
