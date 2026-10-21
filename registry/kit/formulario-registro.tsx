import { useEffect, useId, useRef, useState } from "react"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AvisoCambiosSinGuardar } from "./aviso-cambios"

export type ValoresRegistro = { titulo: string; descripcion: string }

export function FormularioRegistro({
  inicial,
  embebido = false,
  onGuardar,
  onCancelar,
  onSucioChange,
}: {
  inicial: ValoresRegistro
  embebido?: boolean
  onGuardar: (valores: ValoresRegistro) => Promise<void>
  onCancelar: () => void
  onSucioChange?: (sucio: boolean) => void
}) {
  const [titulo, setTitulo] = useState(inicial.titulo)
  const [descripcion, setDescripcion] = useState(inicial.descripcion)
  const [error, setError] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [aviso, setAviso] = useState(false)
  const tituloRef = useRef<HTMLInputElement>(null)
  const base = useRef(inicial)
  const idTitulo = useId()
  const idDescripcion = useId()
  const idError = useId()
  const idAyudaTitulo = useId()
  const idAyudaDescripcion = useId()
  const sucio = titulo !== base.current.titulo || descripcion !== base.current.descripcion

  useEffect(() => {
    onSucioChange?.(sucio)
    return () => onSucioChange?.(false)
  }, [sucio, onSucioChange])

  useEffect(() => {
    if (!guardado) return
    const id = window.setTimeout(() => setGuardado(false), 3000)
    return () => window.clearTimeout(id)
  }, [guardado])

  async function enviar() {
    if (!titulo.trim()) {
      setError("Escribe un título.")
      tituloRef.current?.focus()
      return
    }
    setError("")
    setEnviando(true)
    setGuardado(false)
    try {
      const valores = { titulo: titulo.trim(), descripcion: descripcion.trim() }
      await onGuardar(valores)
      base.current = valores
      setTitulo(valores.titulo)
      setDescripcion(valores.descripcion)
      setGuardado(true)
    } catch {
      toast.error("No se ha podido guardar. Se ha deshecho el cambio.", { duration: 8000 })
    } finally {
      setEnviando(false)
    }
  }

  function cancelar() {
    if (sucio) {
      setAviso(true)
      return
    }
    onCancelar()
  }

  return (
    <form
      className={embebido ? "flex flex-col gap-8" : "mx-auto flex w-full max-w-2xl flex-col gap-8"}
      onSubmit={(evento) => {
        evento.preventDefault()
        void enviar()
      }}
    >
      <section className="flex flex-col gap-4">
        {embebido ? null : <h1 className="text-base font-semibold">Nueva tarea</h1>}
        <div className="flex flex-col gap-1">
          <Label htmlFor={idTitulo}>Título</Label>
          <Input
            ref={tituloRef}
            id={idTitulo}
            value={titulo}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${idAyudaTitulo} ${idError}` : idAyudaTitulo}
            onChange={(evento) => {
              setTitulo(evento.target.value)
              if (error) setError("")
            }}
          />
          <p id={idAyudaTitulo} className="text-xs text-muted-foreground">
            Una frase que identifique la tarea.
          </p>
          {error ? (
            <p id={idError} className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={idDescripcion}>Descripción</Label>
          <Textarea
            id={idDescripcion}
            value={descripcion}
            aria-describedby={idAyudaDescripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
          />
          <p id={idAyudaDescripcion} className="text-xs text-muted-foreground">
            Qué hay que hacer y cualquier detalle útil.
          </p>
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2 bg-secondary p-3 md:static md:justify-end md:bg-transparent md:p-0">
        <Button type="button" variant="secondary" className="h-11 flex-1 md:h-8 md:flex-none" onClick={cancelar}>
          Cancelar
        </Button>
        <Button type="submit" className="h-11 flex-1 md:h-8 md:flex-none" disabled={!sucio || enviando}>
          {enviando ? "Guardando…" : "Guardar"}
        </Button>
        {guardado ? (
          <span className="inline-flex items-center gap-1 text-sm text-status-done">
            <Check className="size-4" />
            Guardado
          </span>
        ) : null}
      </div>
      <AvisoCambiosSinGuardar
        abierto={aviso}
        onQuedarse={() => setAviso(false)}
        onSalir={() => {
          setAviso(false)
          onSucioChange?.(false)
          setTitulo(base.current.titulo)
          setDescripcion(base.current.descripcion)
          onCancelar()
        }}
      />
    </form>
  )
}
