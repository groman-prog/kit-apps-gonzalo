import { expect, test } from "@playwright/test"
import { esperarLista, fila } from "./ayuda"

test("abre el panel, pasa a la siguiente y lo cierra", async ({ page }, info) => {
  await page.goto("/tareas")
  await esperarLista(page)
  await fila(page, "Revisar el albarán del proveedor").click()
  await expect(page.getByRole("heading", { name: "Revisar el albarán del proveedor" })).toBeVisible()
  await expect(page).toHaveURL(/tarea=T-1/)
  await page.getByRole("button", { name: "Siguiente" }).click()
  await expect(page.getByRole("heading", { name: "Cerrar la incidencia del muelle 2" })).toBeVisible()
  await expect(page).toHaveURL(/tarea=T-2/)
  const cerrar = info.project.name === "movil" ? "Volver" : "Cerrar"
  await page.getByRole("button", { name: cerrar, exact: true }).click()
  await expect(page).not.toHaveURL(/tarea=/)
  await expect(page.getByRole("heading", { name: "Cerrar la incidencia del muelle 2" })).toHaveCount(0)
})
