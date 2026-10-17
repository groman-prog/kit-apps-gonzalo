import { createRootRoute, createRoute, createRouter, redirect, Outlet } from "@tanstack/react-router"
import { AlmacenProvider } from "@/datos/almacen"
import { leerBusqueda } from "@/app/busqueda"
import { PaginaTareas } from "@/paginas/tareas"
import { PaginaNueva } from "@/paginas/nueva"
import { PaginaAjustes } from "@/paginas/ajustes"
import { PaginaComponentes } from "@/paginas/componentes"

const raiz = createRootRoute({
  component: () => (
    <AlmacenProvider>
      <Outlet />
    </AlmacenProvider>
  ),
})

const indice = createRoute({
  getParentRoute: () => raiz,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/tareas" })
  },
})

const tareas = createRoute({
  getParentRoute: () => raiz,
  path: "/tareas",
  validateSearch: leerBusqueda,
  component: PaginaTareas,
})

const nueva = createRoute({
  getParentRoute: () => raiz,
  path: "/tareas/nueva",
  component: PaginaNueva,
})

const ajustes = createRoute({
  getParentRoute: () => raiz,
  path: "/ajustes",
  component: PaginaAjustes,
})

const componentes = createRoute({
  getParentRoute: () => raiz,
  path: "/componentes",
  component: PaginaComponentes,
})

export const router = createRouter({
  routeTree: raiz.addChildren([indice, tareas, nueva, ajustes, componentes]),
  defaultPreload: false,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
