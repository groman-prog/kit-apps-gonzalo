import { expect, test, type Page } from "@playwright/test"
import { esperarLista } from "./ayuda"

function seccionTareas(page: Page) {
  return page.getByRole("button", { name: /^Tareas\b/ })
}

test("oculta y recupera el menú", async ({ page }, info) => {
  await page.goto("/tareas")
  await esperarLista(page)
  if (info.project.name === "movil") {
    await page.getByRole("button", { name: "Menú", exact: true }).click()
    await expect(seccionTareas(page)).toBeVisible()
    await page.getByRole("button", { name: "Ocultar menú" }).click()
    await expect(seccionTareas(page)).toBeHidden()
    await page.reload()
    await esperarLista(page)
    await expect(seccionTareas(page)).toBeHidden()
    return
  }

  await expect(seccionTareas(page)).toBeInViewport()
  await page.getByRole("button", { name: "Ocultar menú" }).click()
  await expect(seccionTareas(page)).not.toBeInViewport()
  await page.getByRole("button", { name: "Mostrar menú" }).click()
  await expect(seccionTareas(page)).toBeInViewport()

  await page.getByRole("button", { name: "Ocultar menú" }).click()
  await expect(seccionTareas(page)).not.toBeInViewport()
  await page.reload()
  await esperarLista(page)
  await expect(seccionTareas(page)).not.toBeInViewport()

  await page.getByRole("button", { name: "Mostrar menú" }).click()
  await expect(seccionTareas(page)).toBeInViewport()
  await page.reload()
  await esperarLista(page)
  await expect(seccionTareas(page)).toBeInViewport()
})
