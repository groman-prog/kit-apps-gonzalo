// Plantilla: e2e/comprobar.spec.ts
// Guion de comprobación: recorre las pantallas clave. Se ejecuta con `npm run comprobar`.
// Pantallas con sesión: solo si hay COMPROBAR_EMAIL y COMPROBAR_PASSWORD en el entorno; si no, se saltan.
// Solo navega y lee: nunca escribe datos. Nunca pongas claves en el repo. Mantenlo corto: solo pantallas clave.
// Sustituye cada «TODO» por las rutas, títulos y etiquetas reales de la app (léelos del código: src/routes/).
import { expect, test, type Page } from "@playwright/test";

const correo = process.env.COMPROBAR_EMAIL;
const clave = process.env.COMPROBAR_PASSWORD;

function vigilarConsola(page: Page) {
  const errores: string[] = [];
  page.on("console", (m) => m.type() === "error" && errores.push(m.text()));
  page.on("pageerror", (e) => errores.push(e.message));
  return errores;
}

// 1) Pantallas públicas (sin sesión). titulo: texto o RegExp del h1; null = basta con que haya un h1.
const publicas: { ruta: string; titulo: string | RegExp | null }[] = [
  { ruta: "/", titulo: null }, // TODO: portada o pantalla de acceso
  // { ruta: "/acceso", titulo: "TODO" },
];

test.describe("pantallas públicas", () => {
  for (const { ruta, titulo } of publicas) {
    test(`carga ${ruta}`, async ({ page }) => {
      const errores = vigilarConsola(page);
      await page.goto(ruta);
      const h1 = titulo
        ? page.getByRole("heading", { level: 1, name: titulo })
        : page.getByRole("heading", { level: 1 });
      await expect(h1.first()).toBeVisible();
      expect(errores, "errores en consola").toEqual([]);
    });
  }
});

// 2) Pantallas con sesión (solo lectura). Borra este bloque si la app no tiene login.
const privadas: { ruta: string; titulo: string | RegExp }[] = [
  // { ruta: "/inicio", titulo: "TODO" },
];

test.describe("pantallas con sesión (solo lectura)", () => {
  test.skip(!correo || !clave || privadas.length === 0, "Faltan COMPROBAR_EMAIL y COMPROBAR_PASSWORD");
  for (const { ruta, titulo } of privadas) {
    test(`carga ${ruta}`, async ({ page }) => {
      const errores = vigilarConsola(page);
      await page.goto("/acceso"); // TODO: ruta de login real
      await page.getByLabel("TODO etiqueta del correo").fill(correo ?? "");
      await page.getByLabel("TODO etiqueta de la contraseña").fill(clave ?? "");
      await page.getByRole("button", { name: "TODO Entrar", exact: true }).click();
      await expect(page.getByRole("navigation").first()).toBeVisible(); // TODO: algo que solo se ve con sesión
      await page.goto(ruta);
      await expect(page.getByRole("heading", { level: 1, name: titulo }).first()).toBeVisible();
      expect(errores, "errores en consola").toEqual([]);
    });
  }
});

// 3) Página de error: toda app de Lovable con TanStack tiene una.
test("ruta inexistente muestra «Página no encontrada»", async ({ page }) => {
  await page.goto("/ruta-que-no-existe");
  await expect(page.getByRole("heading", { name: /no encontrada|404/i }).first()).toBeVisible(); // TODO: texto real
});
