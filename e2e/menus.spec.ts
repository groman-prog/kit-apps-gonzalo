import { expect, test, type Page } from "@playwright/test"
import { esperarLista, fila } from "./ayuda"

const TITULO = "Confirmar la entrega del jueves"
const ORDEN = [
  "Cambiar estado…",
  "Cambiar responsable…",
  "Cambiar prioridad…",
  "Editar…",
  "Duplicar",
  "Archivar",
  "Copiar enlace",
  "Borrar…",
]

async function textosMenu(page: Page) {
  const items = page.getByRole("menuitem")
  await expect(items).toHaveCount(ORDEN.length)
  return items.allTextContents()
}

test("el menú … y el contextual ofrecen las mismas acciones", async ({ page }, info) => {
  await page.goto("/tareas")
  await esperarLista(page)
  const tarea = fila(page, TITULO)
  await tarea.getByRole("button", { name: "…" }).click()
  const delBoton = (await textosMenu(page)).map((texto) => texto.trim())
  expect(delBoton).toEqual(ORDEN)
  await page.keyboard.press("Escape")
  if (info.project.name === "movil") return
  await tarea.click({ button: "right" })
  const delContextual = (await textosMenu(page)).map((texto) => texto.trim())
  expect(delContextual).toEqual(delBoton)
})

test("duplicar añade la copia y deshacer la quita", async ({ page }) => {
  await page.goto("/tareas")
  await esperarLista(page)
  const tarea = fila(page, TITULO)
  await tarea.getByRole("button", { name: "…" }).click()
  await page.getByRole("menuitem", { name: "Duplicar" }).click()
  const copia = `${TITULO} (copia)`
  await expect(fila(page, copia)).toBeVisible()
  await expect(page.getByText("Tarea duplicada")).toBeVisible()
  await page.getByRole("button", { name: "Deshacer" }).click()
  await expect(fila(page, copia)).toHaveCount(0)
  await expect(fila(page, TITULO)).toBeVisible()
})

test("borrar pide confirmación y no ofrece deshacer", async ({ page }) => {
  await page.goto("/tareas")
  await esperarLista(page)
  const tarea = fila(page, TITULO)
  await tarea.getByRole("button", { name: "…" }).click()
  await page.getByRole("menuitem", { name: "Borrar…" }).click()
  await expect(page.getByRole("heading", { name: "Borrar tarea" })).toBeVisible()
  await page.getByRole("button", { name: "Cancelar" }).click()
  await expect(tarea).toBeVisible()
  await tarea.getByRole("button", { name: "…" }).click()
  await page.getByRole("menuitem", { name: "Borrar…" }).click()
  await page.getByRole("button", { name: "Borrar tarea" }).click()
  await expect(fila(page, TITULO)).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Deshacer" })).toHaveCount(0)
})
