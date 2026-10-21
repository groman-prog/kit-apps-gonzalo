// Plantilla: e2e/comprobar.config.ts
// Configuración del guion de comprobación (`npm run comprobar`): arranca el servidor de desarrollo
// y recorre e2e/comprobar.spec.ts. Solo lectura: no publica ni escribe datos.
// Ajusta PUERTO y el comando si la app no usa `bun run dev` en el 8080 (mira vite.config.ts o la salida de `bun run dev`).
import { defineConfig, devices } from "@playwright/test";

const PUERTO = 8080;

export default defineConfig({
  testDir: ".",
  testMatch: "comprobar.spec.ts",
  retries: 0,
  reporter: "list",
  use: { baseURL: `http://127.0.0.1:${PUERTO}` },
  webServer: {
    command: "bun run dev",
    url: `http://127.0.0.1:${PUERTO}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    // Si la app se usa en móvil, añade: { name: "movil", use: { ...devices["Pixel 7"] } },
  ],
});
