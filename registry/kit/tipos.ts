export type Estado =
  | "sinrevisar"
  | "porhacer"
  | "curso"
  | "revision"
  | "hecha"
  | "bloqueada"
  | "cancelada"

export type Prioridad = "ninguna" | "baja" | "media" | "alta" | "urgente"

export type Actividad = {
  hora: string
  texto: string
  desde?: Estado
  hasta?: Estado
}

export type Tarea = {
  id: string
  titulo: string
  descripcion: string
  estado: Estado
  prioridad: Prioridad
  responsableId: string
  etiqueta: string
  fecha: string
  archivada: boolean
  actividad: Actividad[]
}

export type Responsable = {
  id: string
  nombre: string
  iniciales: string
}

export type CampoSelector = "estado" | "prioridad" | "responsable" | "etiqueta" | "fecha"
