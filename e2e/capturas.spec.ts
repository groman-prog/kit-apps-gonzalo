import { mkdir } from "node:fs/promises"
import { expect, test, type Page, type TestInfo } from "@playwright/test"
import { esperarLista, fila } from "./ayuda"

async function captura(page: Page, info: TestInfo, nombre: string) {
  await page.evaluate(() => document.fonts.ready)
  const ancho = info.project.name === "movil" ? 390 : 1440
  await page.screenshot({
    path: `capturas/${nombre}-${ancho}.png`,
    animations: "disabled",
    fullPage: false,
  })
}

test.describe("capturas de la demo", () => {
  test.beforeAll(async () => {
    await mkdir("capturas", { recursive: true })
  })

  test("lista", async ({ page }, info) => {
    await page.goto("/tareas")
    await esperarLista(page)
    await captura(page, info, "lista")
  })

  test("lista-panel", async ({ page }, info) => {
    await page.goto("/tareas?tarea=T-1")
    if (info.project.name !== "movil") await esperarLista(page)
    await expect(page.getByRole("heading", { name: "Revisar el albarán del proveedor" })).toBeVisible()
    await captura(page, info, "lista-panel")
  })

  test("tablero", async ({ page }, info) => {
    await page.goto("/tareas?vista=tablero")
    await expect(page.getByRole("region", { name: "Por hacer" })).toBeVisible()
    await captura(page, info, "tablero")
  })

  test("panel-editando", async ({ page }, info) => {
    await page.goto("/tareas?tarea=T-1")
    if (info.project.name !== "movil") await esperarLista(page)
    await page.getByRole("button", { name: "Editar" }).click()
    await expect(page.getByRole("textbox", { name: "Título" })).toBeVisible()
    await captura(page, info, "panel-editando")
  })

  test("aviso-sin-guardar", async ({ page }, info) => {
    await page.goto("/tareas?tarea=T-1")
    if (info.project.name !== "movil") await esperarLista(page)
    await page.getByRole("button", { name: "Editar" }).click()
    await page.getByRole("textbox", { name: "Título" }).fill("Cambio sin guardar")
    const cerrar = info.project.name === "movil" ? "Volver" : "Cerrar"
    await page.getByRole("button", { name: cerrar, exact: true }).click()
    await expect(page.getByRole("heading", { name: "Tienes cambios sin guardar" })).toBeVisible()
    await captura(page, info, "aviso-sin-guardar")
  })

  test("menu-acciones", async ({ page }, info) => {
    await page.goto("/tareas")
    await esperarLista(page)
    await fila(page, "Revisar el albarán del proveedor").getByRole("button", { name: "…" }).click()
    await expect(page.getByRole("menuitem", { name: "Duplicar" })).toBeVisible()
    await captura(page, info, "menu-acciones")
  })

  test("confirmar-borrar", async ({ page }, info) => {
    await page.goto("/tareas")
    await esperarLista(page)
    await fila(page, "Revisar el albarán del proveedor").getByRole("button", { name: "…" }).click()
    await page.getByRole("menuitem", { name: "Borrar…" }).click()
    await expect(page.getByRole("heading", { name: "Borrar tarea" })).toBeVisible()
    await captura(page, info, "confirmar-borrar")
  })

  test("toast-deshacer", async ({ page }, info) => {
    await page.goto("/tareas")
    await esperarLista(page)
    const tarea = fila(page, "Confirmar la entrega del jueves")
    await tarea.getByRole("button", { name: "Estado: Por hacer" }).click()
    await page.getByRole("option", { name: "Hecha", exact: true }).click()
    await expect(page.getByText("Estado cambiado a Hecha")).toBeVisible()
    await captura(page, info, "toast-deshacer")
  })

  test("nueva-tarea-errores", async ({ page }, info) => {
    await page.goto("/tareas/nueva")
    await page.getByRole("textbox", { name: "Descripción" }).fill("Una nota de prueba")
    await page.getByRole("button", { name: "Guardar" }).click()
    await expect(page.getByText("Escribe un título.")).toBeVisible()
    await captura(page, info, "nueva-tarea-errores")
  })

  test("vacio", async ({ page }, info) => {
    await page.goto("/tareas?demo=vacio")
    await expect(page.getByText("Todavía no hay tareas.")).toBeVisible()
    await captura(page, info, "vacio")
  })

  test("error", async ({ page }, info) => {
    await page.goto("/tareas?demo=error")
    await expect(page.getByRole("heading", { name: "No se ha podido cargar la lista." })).toBeVisible()
    await captura(page, info, "error")
  })

  test("cargando", async ({ page }, info) => {
    await page.goto("/tareas?demo=cargando")
    await expect(page.locator("[aria-busy='true']")).toBeVisible()
    await captura(page, info, "cargando")
  })

  test("componentes", async ({ page }, info) => {
    await page.goto("/componentes")
    await expect(page.getByRole("heading", { name: "Componentes" })).toBeVisible()
    await captura(page, info, "componentes")
  })
})
