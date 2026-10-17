import { expect, test } from "@playwright/test"
import { esperarLista, fila } from "./ayuda"

const TITULO = "Confirmar la entrega del jueves"

async function marcarHecha(page: import("@playwright/test").Page) {
  const tarea = fila(page, TITULO)
  await tarea.getByRole("button", { name: "Estado: Por hacer" }).click()
  await page.getByRole("option", { name: "Hecha", exact: true }).click()
  return tarea
}

test("cambia el estado y deshace", async ({ page }) => {
  await page.goto("/tareas")
  await esperarLista(page)
  await marcarHecha(page)
  await expect(page.getByRole("button", { name: /Por hacer\s+4/ })).toBeVisible()
  await expect(page.getByRole("button", { name: /Hecha\s+5/ })).toBeVisible()
  await expect(fila(page, TITULO)).toBeVisible()
  await expect(page.getByText("Estado cambiado a Hecha")).toBeVisible()
  await page.getByRole("button", { name: "Deshacer" }).click()
  await expect(page.getByRole("button", { name: /Por hacer\s+5/ })).toBeVisible()
  await expect(page.getByRole("button", { name: /Hecha\s+4/ })).toBeVisible()
  await expect(fila(page, TITULO).getByRole("button", { name: "Estado: Por hacer" })).toBeVisible()
})

test("revierte el cambio si el guardado falla", async ({ page }) => {
  await page.goto("/tareas?fallo=1")
  await esperarLista(page)
  await marcarHecha(page)
  await expect(page.getByText("No se ha podido guardar. Se ha deshecho el cambio.")).toBeVisible()
  await expect(page.getByRole("button", { name: /Por hacer\s+5/ })).toBeVisible()
  await expect(fila(page, TITULO).getByRole("button", { name: "Estado: Por hacer" })).toBeVisible()
})
