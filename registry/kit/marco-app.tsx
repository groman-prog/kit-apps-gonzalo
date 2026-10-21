import { useState } from "react"
import type { ReactNode } from "react"
import { PanelLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { teclaMod } from "./atajos"
import { useAnchoMaximo } from "./use-medio"

export type SeccionNav = {
  etiqueta: string
  href: string
  activa: boolean
  contador?: number
}

function leerMenu() {
  try {
    return localStorage.getItem("kit-menu-abierto") !== "0"
  } catch {
    return true
  }
}

function guardarMenu(abierto: boolean) {
  try {
    localStorage.setItem("kit-menu-abierto", abierto ? "1" : "0")
  } catch {
    /* sin almacenamiento */
  }
}

function BotonesMenu() {
  const { open, setOpen, setOpenMobile } = useSidebar()
  return (
    <>
      <Button type="button" variant="ghost" className="h-11 shrink-0 md:hidden" onClick={() => setOpenMobile(true)}>
        Menú
      </Button>
      {open ? null : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden size-8 md:inline-flex"
              aria-label="Mostrar menú"
              onClick={() => setOpen(true)}
            >
              <PanelLeft />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mostrar menú</TooltipContent>
        </Tooltip>
      )}
    </>
  )
}

function BotonSeccion({
  etiqueta,
  activa,
  contador,
  onClick,
}: {
  etiqueta: string
  activa: boolean
  contador?: number
  onClick: () => void
}) {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuButton
      isActive={activa}
      className="h-11 px-0 md:h-8"
      onClick={() => {
        setOpenMobile(false)
        onClick()
      }}
    >
      <span className="flex-1 truncate text-left">{etiqueta}</span>
      {contador !== undefined ? <span className="tabular-nums">{contador}</span> : null}
    </SidebarMenuButton>
  )
}

function BotonOcultar() {
  const { setOpen, setOpenMobile } = useSidebar()
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-11 w-full justify-start rounded-md px-0 md:h-8"
      onClick={() => {
        if (window.innerWidth < 768) setOpenMobile(false)
        else setOpen(false)
      }}
    >
      Ocultar menú
    </Button>
  )
}

export function MarcoApp({
  nombre,
  usuario,
  secciones,
  ajustes,
  migas,
  primaria,
  onIr,
  onBuscar,
  children,
}: {
  nombre: string
  usuario: string
  secciones: SeccionNav[]
  ajustes: SeccionNav
  migas: { etiqueta: string }[]
  primaria?: { etiqueta: string; onClick: () => void }
  onIr: (href: string) => void
  onBuscar: () => void
  children: ReactNode
}) {
  const [abierto, setAbierto] = useState(leerMenu)
  const movil = useAnchoMaximo(767)
  const mod = teclaMod()
  return (
    <TooltipProvider>
      <SidebarProvider
        open={abierto}
        onOpenChange={(valor) => {
          setAbierto(valor)
          guardarMenu(valor)
        }}
        className="h-svh max-w-full overflow-hidden"
      >
        <Sidebar collapsible="offcanvas">
          <SidebarHeader className="px-3">
            <div className="flex items-center gap-2 py-1">
              <span aria-hidden className="size-3 shrink-0 rounded-sm bg-primary" />
              <span className="truncate text-sm font-semibold">{nombre}</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3">
            <nav aria-label="Secciones">
              <SidebarMenu>
                {secciones.map((seccion) => (
                  <SidebarMenuItem key={seccion.href}>
                    <BotonSeccion
                      etiqueta={seccion.etiqueta}
                      activa={seccion.activa}
                      contador={seccion.contador}
                      onClick={() => onIr(seccion.href)}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </nav>
          </SidebarContent>
          <SidebarFooter className="px-3">
            <BotonOcultar />
            <SidebarMenu>
              <SidebarMenuItem>
                <BotonSeccion
                  etiqueta={ajustes.etiqueta}
                  activa={ajustes.activa}
                  onClick={() => onIr(ajustes.href)}
                />
              </SidebarMenuItem>
            </SidebarMenu>
            <p className="text-sm text-sidebar-foreground">{usuario}</p>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="min-h-0 min-w-0 overflow-hidden">
          <header className="flex h-12 shrink-0 items-center gap-2 px-2">
            <BotonesMenu />
            <Breadcrumb className="min-w-0 flex-1">
              <BreadcrumbList className="flex-nowrap">
                {migas.flatMap((miga, indice) => {
                  const item = (
                    <BreadcrumbItem key={`${miga.etiqueta}-${indice}`} className="min-w-0">
                      <BreadcrumbPage className="truncate">{miga.etiqueta}</BreadcrumbPage>
                    </BreadcrumbItem>
                  )
                  return indice === 0
                    ? [item]
                    : [<BreadcrumbSeparator key={`sep-${indice}`} />, item]
                })}
              </BreadcrumbList>
            </Breadcrumb>
            <Button
              type="button"
              variant="outline"
              className="size-11 shrink-0 px-0 md:h-8 md:w-auto md:px-2.5"
              aria-label={movil ? "Buscar" : undefined}
              onClick={onBuscar}
            >
              <Search />
              <span className="hidden md:inline">Buscar…</span>
              <kbd className="hidden rounded-sm border border-border px-1 text-xs md:inline">
                {mod} K
              </kbd>
            </Button>
            {primaria ? (
              <Button type="button" className="h-11 shrink-0 md:h-8" onClick={primaria.onClick}>
                {primaria.etiqueta}
              </Button>
            ) : null}
          </header>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
        </SidebarInset>
        <Toaster position={movil ? "bottom-center" : "bottom-right"} duration={8000} />
      </SidebarProvider>
    </TooltipProvider>
  )
}
