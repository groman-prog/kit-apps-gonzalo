import { expect, test } from "@playwright/test"
import { esperarLista, fila } from "./ayuda"

const COLUMNAS: [string, string][] = [
  ["Sin revisar", "3"],
  ["Por hacer", "5"],
  ["En curso", "4"],
  ["En revisión", "3"],
  ["Hecha", "4"],
  ["Bloqueada", "2"],
  ["Cancelada", "3"],
]

test("cambia a tablero, mueve una tarjeta y vuelve a la lista", async ({ page }) => {
  await page.goto("/tareas")
  await esperarLista(page)
  await page.getByRole("radio", { name: "Tablero", exact: true }).click()
  await expect(page).toHaveURL(/vista=tablero/)
  for (const [nombre, cuenta] of COLUMNAS) {
    const columna = page.getByRole("region", { name: nombre, exact: true })
    await expect(columna).toBeVisible()
    await expect(columna.getByRole("heading", { name: new RegExp(`${nombre}\\s+${cuenta}`) })).toBeVisible()
  }
  await page.reload()
  await expect(page).toHaveURL(/vista=tablero/)
  await expect(page.getByRole("region", { name: "Por hacer" })).toBeVisible()

  const titulo = "Confirmar la entrega del jueves"
  const tarjeta = fila(page, titulo)
  await tarjeta.getByRole("button", { name: "Estado: Por hacer" }).click()
  await page.getByRole("option", { name: "En curso", exact: true }).click()
  await expect(page.getByRole("region", { name: "En curso" }).getByText(titulo)).toBeVisible()
  await expect(page.getByRole("region", { name: "Por hacer" }).getByText(titulo)).toHaveCount(0)
  await expect(page.getByRole("heading", { name: /Por hacer\s+4/ })).toBeVisible()
  await expect(page.getByRole("heading", { name: /En curso\s+5/ })).toBeVisible()

  await page.getByRole("radio", { name: "Lista", exact: true }).click()
  await expect(page).not.toHaveURL(/vista=/)
  await expect(page.getByRole("button", { name: /Por hacer\s+4/ })).toBeVisible()
  await expect(fila(page, titulo)).toBeVisible()
})
