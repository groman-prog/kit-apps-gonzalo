import { expect, test } from "@playwright/test"
import { esperarLista } from "./ayuda"

async function bordes(page: import("@playwright/test").Page, selector: string, lado: "x" | "right") {
  const cajas = await page.locator(selector).evaluateAll((nodos) =>
    nodos
      .filter((nodo) => nodo instanceof HTMLElement && nodo.getClientRects().length > 0)
      .map((nodo) => {
        const caja = nodo.getBoundingClientRect()
        return { x: caja.x, right: caja.right }
      }),
  )
  expect(cajas.length).toBeGreaterThan(1)
  return cajas.map((caja) => (lado === "x" ? caja.x : caja.right))
}

function mismaPosicion(valores: number[]) {
  const base = valores[0] ?? 0
  for (const valor of valores) expect(Math.abs(valor - base)).toBeLessThanOrEqual(1)
}

test("el título y el estado de cada fila empiezan en la misma x", async ({ page }, info) => {
  await page.goto("/tareas")
  await esperarLista(page)
  mismaPosicion(await bordes(page, "[data-titulo]", "x"))
  mismaPosicion(await bordes(page, "[data-icono-estado]", "x"))
  if (info.project.name === "movil") return
  mismaPosicion(await bordes(page, "[data-fecha]", "right"))
})

test("en cada columna del tablero el título de las tarjetas empieza en la misma x", async ({ page }) => {
  await page.goto("/tareas?vista=tablero")
  await expect(page.getByRole("region", { name: "Por hacer", exact: true })).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  const columnas = ["Sin revisar", "Por hacer", "En curso", "En revisión", "Hecha", "Bloqueada", "Cancelada"]
  let comprobadas = 0
  for (const nombre of columnas) {
    const titulos = page.getByRole("region", { name: nombre, exact: true }).locator("[data-titulo]")
    const total = await titulos.count()
    if (total < 2) continue
    mismaPosicion(await bordes(page, `[aria-label="${nombre}"] [data-titulo]`, "x"))
    comprobadas += 1
  }
  expect(comprobadas).toBeGreaterThan(0)
})
