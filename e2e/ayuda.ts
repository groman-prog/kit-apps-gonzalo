import { expect, type Page } from "@playwright/test"

export async function esperarLista(page: Page) {
  await expect(page.getByRole("button", { name: /Por hacer\s+5/ })).toBeVisible()
}

export function fila(page: Page, titulo: string) {
  return page.getByRole("listitem").filter({ hasText: titulo })
}
