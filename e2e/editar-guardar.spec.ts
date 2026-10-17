import { expect, test } from "@playwright/test"
import { esperarLista, fila } from "./ayuda"

test("guarda el título desde el panel", async ({ page }, info) => {
  const movil = info.project.name === "movil"
  await page.goto("/tareas?tarea=T-1")
  if (!movil) await esperarLista(page)
  await page.getByRole("button", { name: "Editar" }).click()
  const titulo = page.getByRole("textbox", { name: "Título" })
  await expect(page.getByRole("button", { name: "Guardar" })).toBeDisabled()
  await titulo.fill("Título revisado del albarán")
  await expect(page.getByRole("button", { name: "Guardar" })).toBeEnabled()
  await page.getByRole("button", { name: "Guardar" }).click()
  await expect(page.getByRole("button", { name: "Guardando…" })).toBeVisible()
  await expect(page.getByText("Guardado")).toBeVisible()
  await expect(titulo).toHaveValue("Título revisado del albarán")
  if (movil) await page.getByRole("button", { name: "Volver", exact: true }).click()
  await expect(fila(page, "Título revisado del albarán")).toBeVisible()
})

test("no guarda si no se pulsa Guardar", async ({ page }, info) => {
  const movil = info.project.name === "movil"
  await page.goto("/tareas?tarea=T-1")
  if (!movil) await esperarLista(page)
  await page.getByRole("button", { name: "Editar" }).click()
  await page.getByRole("textbox", { name: "Título" }).fill("No se guarda")
  page.once("dialog", (dialogo) => dialogo.accept())
  await page.reload()
  await expect(page.getByRole("heading", { name: "Revisar el albarán del proveedor" })).toBeVisible()
  await expect(page.getByText("No se guarda", { exact: true })).toHaveCount(0)
})

test("la tarea nueva exige un título", async ({ page }) => {
  await page.goto("/tareas/nueva")
  await page.getByRole("textbox", { name: "Descripción" }).fill("Una nota de prueba")
  await page.getByRole("button", { name: "Guardar" }).click()
  await expect(page.getByText("Escribe un título.")).toBeVisible()
  await expect(page.getByRole("textbox", { name: "Título" })).toBeFocused()
})
