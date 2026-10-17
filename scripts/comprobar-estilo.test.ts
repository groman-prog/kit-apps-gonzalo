import { readdirSync } from "node:fs"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import { describe, expect, it } from "vitest"

const directorio = join(process.cwd(), "scripts/__fixtures__")

describe("comprobar estilo", () => {
  const archivos = readdirSync(directorio).filter((nombre) => nombre.endsWith(".tsx"))

  for (const nombre of archivos) {
    it(nombre, () => {
      const resultado = spawnSync(
        "bun",
        ["scripts/comprobar-estilo.ts", join(directorio, nombre)],
        { encoding: "utf8" },
      )
      if (nombre === "limpio.tsx") {
        expect(resultado.status, resultado.stdout + resultado.stderr).toBe(0)
        expect(resultado.stdout).toBe("")
      } else {
        expect(resultado.status, resultado.stdout + resultado.stderr).toBe(1)
        expect(resultado.stdout).toContain(nombre)
      }
    })
  }
})
