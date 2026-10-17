import { expect, test } from "@playwright/test"
import { esperarLista, fila } from "./ayuda"

test("la lista cabe en la pantalla y se abre con el dedo", async ({ page }, info) => {
  test.skip(info.project.name !== "movil", "solo en el proyecto móvil")
  await page.goto("/tareas")
  await esperarLista(page)

  await page.getByRole("button", { name: "Menú", exact: true }).click()
  await expect(page.getByRole("button", { name: "Ocultar menú" })).toBeVisible()
  await page.getByRole("button", { name: "Ocultar menú" }).click()

  const tarea = fila(page, "Revisar el albarán del proveedor")
  const cajaFila = await tarea.boundingBox()
  expect(cajaFila?.height ?? 0).toBeGreaterThanOrEqual(44)
  const menu = tarea.getByRole("button", { name: "…" })
  await expect(menu).toBeVisible()
  const cajaMenu = await menu.boundingBox()
  expect(cajaMenu?.height ?? 0).toBeGreaterThanOrEqual(44)

  const ancho = await page.evaluate(() => document.documentElement.scrollWidth)
  expect(ancho).toBeLessThanOrEqual(390)

  await tarea.getByRole("button", { name: "Estado: En curso" }).click()
  await expect(page.locator("[data-vaul-drawer-direction='bottom']")).toBeVisible()
  await expect(page.getByRole("option", { name: "Hecha", exact: true })).toBeVisible()
  await page.keyboard.press("Escape")

  await tarea.click()
  await expect(page.getByRole("button", { name: "Volver", exact: true })).toBeVisible()
  const hoja = await page.locator("[data-slot='sheet-content']").boundingBox()
  expect(Math.round(hoja?.width ?? 0)).toBeGreaterThanOrEqual(390)
  await page.getByRole("button", { name: "Volver", exact: true }).click()
  await expect(page).not.toHaveURL(/tarea=/)
})
