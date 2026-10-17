import { spawn } from "node:child_process"
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

const raiz = process.cwd()

function ejecutar(comando: string, args: string[], cwd: string) {
  return new Promise<void>((resolver, rechazar) => {
    const hijo = spawn(comando, args, { cwd, stdio: "inherit" })
    hijo.on("error", rechazar)
    hijo.on("exit", (codigo) => {
      if (codigo === 0) resolver()
      else rechazar(new Error(`${comando} ${args.join(" ")} salió con ${codigo}`))
    })
  })
}

function localizar(texto: string, destino: string) {
  return texto.replaceAll(
    /groman-prog\/kit-apps-gonzalo\/([a-z0-9-]+)/g,
    (_coincidencia, nombre: string) => join(destino, "public/r", `${nombre}.json`),
  )
}

async function prepararRegistro(destino: string) {
  const origen = join(raiz, "public/r")
  const copia = join(destino, "public/r")
  await mkdir(copia, { recursive: true })
  for (const nombre of await readdir(origen)) {
    if (!nombre.endsWith(".json")) continue
    const texto = await readFile(join(origen, nombre), "utf8")
    await writeFile(join(copia, nombre), localizar(texto, destino))
  }
}

async function escribirProyecto(destino: string) {
  await writeFile(
    join(destino, "package.json"),
    JSON.stringify(
      {
        name: "kit-limpio",
        private: true,
        type: "module",
        scripts: { build: "vite build" },
        dependencies: { react: "^19.3.1", "react-dom": "^19.3.1" },
        devDependencies: {
          "@tailwindcss/vite": "^4.3.3",
          "@types/react": "^19.3.0",
          "@types/react-dom": "^19.3.0",
          "@vitejs/plugin-react": "^6.1.2",
          tailwindcss: "^4.3.3",
          typescript: "6.0.3",
          vite: "^8.3.4",
        },
      },
      null,
      2,
    ),
  )
  await writeFile(
    join(destino, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2023",
          lib: ["ES2023", "DOM"],
          module: "ESNext",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          strict: true,
          skipLibCheck: true,
          noEmit: true,
          ignoreDeprecations: "6.0",
          baseUrl: ".",
          paths: { "@/*": ["./src/*"] },
        },
        include: ["src"],
      },
      null,
      2,
    ),
  )
  await writeFile(
    join(destino, "vite.config.ts"),
    `import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import path from "node:path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(process.cwd(), "src") } },
})
`,
  )
  await writeFile(
    join(destino, "index.html"),
    `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Instalación en limpio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
  )
  await mkdir(join(destino, "src"), { recursive: true })
  await writeFile(join(destino, "src/index.css"), `@import "tailwindcss";\n`)
  await writeFile(
    join(destino, "src/main.tsx"),
    `import { createRoot } from "react-dom/client"
import "./index.css"

createRoot(document.getElementById("root")!).render(<p>Instalación en limpio</p>)
`,
  )
}

async function conectarKit(destino: string) {
  await writeFile(
    join(destino, "src/main.tsx"),
    `import { createRoot } from "react-dom/client"
import { ConmutadorVista } from "@/components/kit/conmutador-vista"
import { EstadoIcono } from "@/components/kit/estado-icono"
import { FormularioRegistro } from "@/components/kit/formulario-registro"
import { ListaAgrupada } from "@/components/kit/lista-agrupada"
import { MarcoApp } from "@/components/kit/marco-app"
import { PanelDetalle } from "@/components/kit/panel-detalle"
import { SelectorPropiedad } from "@/components/kit/selector-propiedad"
import { Tablero } from "@/components/kit/tablero"
import { VacioDibujo } from "@/components/kit/vacio-dibujo"
import "./index.css"

void [
  ConmutadorVista,
  EstadoIcono,
  FormularioRegistro,
  ListaAgrupada,
  MarcoApp,
  PanelDetalle,
  SelectorPropiedad,
  Tablero,
  VacioDibujo,
]

createRoot(document.getElementById("root")!).render(<p>Instalación en limpio</p>)
`,
  )
}

const destino = await mkdtemp(join(tmpdir(), "kit-limpio-"))
try {
  await escribirProyecto(destino)
  await ejecutar("bun", ["install"], destino)
  await ejecutar(
    "bunx",
    ["shadcn@latest", "init", "-t", "vite", "-b", "radix", "-p", "nova", "-y", "-f", "--no-monorepo"],
    destino,
  )
  await prepararRegistro(destino)
  await ejecutar("bunx", ["shadcn@latest", "add", "./public/r/kit-completo.json", "-y", "-o"], destino)
  await conectarKit(destino)
  await ejecutar("bun", ["run", "build"], destino)
  console.log("Instalación en limpio correcta.")
} finally {
  await rm(destino, { recursive: true, force: true })
}
