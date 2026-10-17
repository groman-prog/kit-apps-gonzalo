import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"
import { esperarLista } from "./ayuda"

async function sinGraves(page: Page) {
  const resultado = await new AxeBuilder({ page }).analyze()
  const graves = resultado.violations.filter(
    (violacion) => violacion.impact === "serious" || violacion.impact === "critical",
  )
  expect(
    graves,
    graves.map((violacion) => `${violacion.id}: ${violacion.help}\n${violacion.nodes.map((n) => n.target).join(", ")}`).join("\n"),
  ).toEqual([])
}

test("la demo no pide fuentes de Google", async ({ page }) => {
  const peticiones: string[] = []
  page.on("request", (peticion) => peticiones.push(peticion.url()))
  await page.goto("/tareas")
  await esperarLista(page)
  const externas = peticiones.filter(
    (url) => url.includes("fonts.googleapis") || url.includes("fonts.gstatic"),
  )
  expect(externas).toEqual([])
})

test("la lista, el tablero, el panel, el alta y el vacío pasan axe", async ({ page }) => {
  await page.goto("/tareas")
  await esperarLista(page)
  await sinGraves(page)

  await page.getByRole("radio", { name: "Tablero", exact: true }).click()
  await expect(page.getByRole("region", { name: "Por hacer" })).toBeVisible()
  await sinGraves(page)

  await page.goto("/tareas?tarea=T-1")
  await expect(page.getByRole("heading", { name: "Revisar el albarán del proveedor" })).toBeVisible()
  await sinGraves(page)

  await page.goto("/tareas/nueva")
  await expect(page.getByRole("heading", { name: "Nueva tarea" })).toBeVisible()
  await sinGraves(page)

  await page.goto("/tareas?demo=vacio")
  await expect(page.getByText("Todavía no hay tareas.")).toBeVisible()
  await sinGraves(page)
})
