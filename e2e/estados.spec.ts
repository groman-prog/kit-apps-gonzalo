import { expect, test } from "@playwright/test"
import { esperarLista } from "./ayuda"

test("mantiene el skeleton con aria-busy", async ({ page }) => {
  await page.goto("/tareas?demo=cargando")
  const ocupado = page.locator("[aria-busy='true']")
  await expect(ocupado).toBeVisible()
  await page.waitForTimeout(800)
  await expect(ocupado).toBeVisible()
  await expect(page.getByRole("button", { name: /Por hacer/ })).toHaveCount(0)
})

test("reintenta después del error y carga la lista", async ({ page }) => {
  await page.goto("/tareas?demo=error")
  await expect(page.getByRole("heading", { name: "No se ha podido cargar la lista." })).toBeVisible()
  await page.getByRole("button", { name: "Reintentar" }).click()
  await esperarLista(page)
})

test("el primer uso muestra el dibujo y una sola acción principal", async ({ page }) => {
  await page.goto("/tareas?demo=vacio")
  await expect(page.getByText("Todavía no hay tareas.")).toBeVisible()
  await expect(page.locator("svg[aria-hidden='true']").first()).toBeVisible()
  await expect(page.getByRole("button", { name: "Nueva tarea" })).toHaveCount(1)
})

test("una búsqueda sin resultados se puede borrar", async ({ page }) => {
  await page.goto("/tareas")
  await esperarLista(page)
  const buscar = page.getByRole("textbox", { name: "Buscar en la lista" })
  await buscar.fill("no-existe-xyz")
  await expect(page.getByText("No hay tareas que coincidan con la búsqueda.")).toBeVisible()
  await page.getByRole("button", { name: "Borrar búsqueda" }).click()
  await esperarLista(page)
  await expect(buscar).toHaveValue("")
})
