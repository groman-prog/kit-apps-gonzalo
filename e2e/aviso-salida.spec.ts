import { expect, test, type Page } from "@playwright/test"
import { esperarLista } from "./ayuda"

async function abrirAjustes(page: Page, movil: boolean) {
  if (movil) await page.getByRole("button", { name: "Menú", exact: true }).click()
  await page.getByRole("button", { name: "Ajustes" }).click()
}

test("avisa al salir hacia Ajustes y al cerrar el panel", async ({ page }, info) => {
  const movil = info.project.name === "movil"
  if (movil) {
    await page.goto("/tareas/nueva")
    await page.getByRole("textbox", { name: "Título" }).fill("Cambio sin guardar")
    await abrirAjustes(page, true)
  } else {
    await page.goto("/tareas?tarea=T-1")
    await esperarLista(page)
    await page.getByRole("button", { name: "Editar" }).click()
    await page.getByRole("textbox", { name: "Título" }).fill("Cambio sin guardar")
    await abrirAjustes(page, false)
  }
  await expect(page.getByRole("heading", { name: "Tienes cambios sin guardar" })).toBeVisible()
  await page.getByRole("button", { name: "Seguir editando" }).click()
  await expect(page.getByRole("textbox", { name: "Título" })).toHaveValue("Cambio sin guardar")
  await abrirAjustes(page, movil)
  await page.getByRole("button", { name: "Descartar cambios" }).click()
  await expect(page.getByRole("heading", { name: "Ajustes" })).toBeVisible()
  await page.goto("/tareas?tarea=T-1")
  if (!movil) await esperarLista(page)
  await expect(page.getByRole("heading", { name: "Revisar el albarán del proveedor" })).toBeVisible()
  await expect(page.getByText("Cambio sin guardar")).toHaveCount(0)

  await page.getByRole("button", { name: "Editar" }).click()
  await page.getByRole("textbox", { name: "Título" }).fill("Cierre con cambios")
  const cerrar = movil ? "Volver" : "Cerrar"
  await page.getByRole("button", { name: cerrar, exact: true }).click()
  await expect(page.getByRole("heading", { name: "Tienes cambios sin guardar" })).toBeVisible()
  await page.getByRole("button", { name: "Seguir editando" }).click()
  await expect(page.getByRole("textbox", { name: "Título" })).toHaveValue("Cierre con cambios")
  await page.getByRole("button", { name: cerrar, exact: true }).click()
  await page.getByRole("button", { name: "Descartar cambios" }).click()
  await expect(page).not.toHaveURL(/tarea=/)
  await expect(page.getByText("Cierre con cambios")).toHaveCount(0)
  await expect(filaVisible(page)).toBeVisible()
})

function filaVisible(page: Page) {
  return page.getByText("Revisar el albarán del proveedor").first()
}

test("beforeunload con el formulario sucio", async ({ page }) => {
  await page.goto("/tareas/nueva")
  await page.getByRole("textbox", { name: "Título" }).fill("Cambio sin guardar")
  const dialogo = page.waitForEvent("dialog")
  await page.close({ runBeforeUnload: true })
  expect((await dialogo).type()).toBe("beforeunload")
})
