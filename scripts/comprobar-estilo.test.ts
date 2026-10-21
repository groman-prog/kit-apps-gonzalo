import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import { describe, expect, it } from "vitest"
import { comprobarTexto } from "./comprobar-estilo"

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

describe("tema por defecto sin verde", () => {
  const tokens = readFileSync(join(process.cwd(), "src/styles/tokens.css"), "utf8")
  const anterior = readFileSync(join(process.cwd(), "plantillas/tema-anterior.css"), "utf8")

  it("Carbón no contiene verde, oliva ni petróleo", () => {
    const hallazgos = comprobarTexto("src/styles/tokens.css", tokens)
    expect(hallazgos.filter((h) => h.motivo === "verde en el tema por defecto")).toEqual([])
    expect(tokens).toContain("oklch(0.704 0.143 73.9)")
    expect(tokens).toContain("oklch(0.304 0.014 261.7)")
    expect(tokens).not.toContain('data-tema="oliva"')
    expect(tokens).not.toContain('data-tema="petroleo"')
    expect(tokens).not.toMatch(/success|green|emerald|\blime\b|teal|#(?:2F6B3A|3F6B34|B8E4C6|CBEBD4|DCF2E3)\b/i)
  })

  it("detecta verde dentro de :root", () => {
    const hallazgos = comprobarTexto(
      "src/styles/tokens.css",
      `:root {\n  --success: oklch(0.475 0.100 147.7); /* #2F6B3A */\n}\n`,
    )
    expect(hallazgos.some((h) => h.motivo === "verde en el tema por defecto")).toBe(true)
  })

  it("el tema anterior conserva cielo y ámbar", () => {
    expect(anterior).toContain('[data-tema="anterior"]')
    expect(anterior).toContain("oklch(0.931 0.021 245.9)")
    expect(anterior).toContain("oklch(0.720 0.145 75.8)")
    expect(anterior).toContain("oklch(0.964 0.010 247.9)")
    expect(anterior).not.toContain('data-tema="oliva"')
    expect(anterior).not.toContain('data-tema="petroleo"')
  })
})
