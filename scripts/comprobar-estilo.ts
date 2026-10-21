import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, extname } from "node:path"

const EXTENSIONES = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".svg"])
const PALETA =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white"
const PROPIEDADES = "bg|text|border|ring|fill|stroke|from|to|via|outline|decoration"
const RE_PALETA = new RegExp(
  `(?:^|[\\s"'\\\`])(?:[A-Za-z0-9_-]+:)*(?:${PROPIEDADES})-(?:${PALETA})(?:-\\d+)?\\b`,
)
const RE_HEX = /#[0-9a-fA-F]{3,8}\b/g
const RE_FUNCION_COLOR = /(?:rgb|rgba|hsl|oklch)\(/g
const RE_VERDE =
  /success|green|emerald|\blime\b|teal|#(?:2F6B3A|3F6B34|B8E4C6|CBEBD4|DCF2E3)\b/i
const RE_ARBITRARIO = /\[(?:#|rgb|oklch)/
const NOMBRES_FUENTE =
  /\b(?:Inter|Geist|Roboto|Arial|Helvetica|system-ui|Newsreader|Instrument Sans)\b/
const FUENTES_CLASE = /(?:^|[\s"'`])(?:[A-Za-z0-9_-]+:)*font-(?:serif|mono)\b/
const PERMITIDAS = new Set([
  "lexend",
  "cifras gr",
  "verdana",
  "sans-serif",
  // El anexo A se copia tal cual y declara estas variables con Lexend y Cifras GR.
  "var(--font-sans)",
  "var(--font-cifras)",
])

export type Hallazgo = { archivo: string; linea: number; motivo: string }

function esTokens(archivo: string) {
  return archivo.replaceAll("\\", "/").endsWith("src/styles/tokens.css")
}

function clasesDe(linea: string) {
  const trozos: string[] = []
  const re = /[A-Za-z0-9_[\]()%:/.,!-]+/g
  let m: RegExpExecArray | null
  while ((m = re.exec(linea))) trozos.push(m[0])
  return trozos
}

function utilidad(clase: string) {
  let profundidad = 0
  let ultimo = 0
  for (let i = 0; i < clase.length; i++) {
    const c = clase[i]
    if (c === "[") profundidad++
    else if (c === "]") profundidad = Math.max(0, profundidad - 1)
    else if (c === ":" && profundidad === 0) ultimo = i + 1
  }
  return clase.slice(ultimo)
}

function fuentesDeclaradas(linea: string): string | null {
  const re = /(?:font-family|--font-[A-Za-z0-9-]+)\s*:\s*([^;}{]+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(linea))) {
    const trozos = m[1].split(",")
    for (const trozo of trozos) {
      const normal = trozo.trim().replace(/^['"]|['"]$/g, "").trim().toLowerCase()
      if (!normal || PERMITIDAS.has(normal)) continue
      return `fuente no permitida: ${trozo.trim()}`
    }
  }
  return null
}

function peso(linea: string, enFontFace: boolean): string | null {
  const m = /font-weight\s*:\s*([^;}{]+)/.exec(linea)
  if (!m) return null
  const valor = m[1].trim()
  if (enFontFace && /^\d+\s+\d+$/.test(valor)) return null
  if (valor === "400" || valor === "500" || valor === "600") return null
  return `peso de fuente no permitido: ${valor}`
}

export function comprobarTexto(archivo: string, texto: string): Hallazgo[] {
  const tokens = esTokens(archivo)
  const hallazgos: Hallazgo[] = []
  const lineas = texto.split(/\r?\n/)
  let enFontFace = false
  let profundidad = 0
  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i] ?? ""
    const numero = i + 1
    if (/@font-face\b/.test(linea)) enFontFace = true
    const motivos: string[] = []

    if (!tokens) {
      if (RE_HEX.test(linea)) motivos.push("hex suelto")
      RE_HEX.lastIndex = 0
      if (RE_FUNCION_COLOR.test(linea)) motivos.push("color literal")
      RE_FUNCION_COLOR.lastIndex = 0
    }
    if (RE_PALETA.test(linea) || RE_ARBITRARIO.test(linea)) motivos.push("paleta de Tailwind")
    const sinSombraNinguna = linea.replace(/shadow-none!?/g, "")
    if (/\bshadow\b/.test(sinSombraNinguna) || /shadow-/.test(sinSombraNinguna) || /drop-shadow/.test(sinSombraNinguna)) {
      motivos.push("sombra")
    }
    if (/box-shadow\s*:/.test(linea) && !/box-shadow\s*:\s*none\b/.test(linea)) motivos.push("sombra")
    if (/text-shadow\s*:/.test(linea) && !/text-shadow\s*:\s*none\b/.test(linea)) motivos.push("sombra")
    if (/gradient|bg-linear-|bg-radial-|bg-conic-/.test(linea)) motivos.push("degradado")
    for (const clase of clasesDe(linea)) {
      const base = utilidad(clase)
      if ((base.startsWith("from-") || base.startsWith("via-")) && !clase.includes("slide-in-from") && !clase.includes("slide-out-to")) {
        motivos.push("degradado")
        break
      }
    }
    const fuente = fuentesDeclaradas(linea)
    if (fuente) motivos.push(fuente)
    if (FUENTES_CLASE.test(linea) || /fonts\.googleapis|fonts\.gstatic/.test(linea)) motivos.push("fuente no permitida")
    if (NOMBRES_FUENTE.test(linea)) motivos.push("fuente no permitida")
    const pesoMal = peso(linea, enFontFace)
    if (pesoMal) motivos.push(pesoMal)
    if (linea.includes("\u00B7")) motivos.push("punto medio")
    if (tokens && RE_VERDE.test(linea)) motivos.push("verde en el tema por defecto")
    if (/backdrop-blur/.test(linea)) motivos.push("desenfoque de fondo")
    if (/rounded-(?:xl|2xl|3xl)\b/.test(linea)) motivos.push("radio excesivo")
    if (/font-(?:bold|extrabold|black)\b/.test(linea)) motivos.push("peso de fuente no permitido")
    if (/font-\[[0-9]+\]/.test(linea)) motivos.push("peso de fuente no permitido")
    if (/transition-all/.test(linea)) motivos.push("transición global")
    if (/divide-y/.test(linea)) motivos.push("línea entre elementos")
    if (/animate-(?:bounce|pulse|ping)\b/.test(linea)) motivos.push("animación vetada")
    if (/hover:scale/.test(linea)) motivos.push("escala en hover")
    if (/tracking-(?:wide|wider|widest)\b/.test(linea)) motivos.push("interletrado")
    if (/\buppercase\b/.test(linea)) motivos.push("mayúsculas sostenidas")
    if (/\bitalic\b/.test(linea)) motivos.push("cursiva")
    if (/slashed-zero/.test(linea)) motivos.push("cero con barra")
    if (/import\s[^;]*\bSeparator\b/.test(linea) || /from\s+["'][^"']*\/separator["']/.test(linea)) {
      motivos.push("importación de Separator")
    }

    for (const motivo of [...new Set(motivos)]) {
      hallazgos.push({ archivo, linea: numero, motivo })
    }
    profundidad += (linea.match(/\{/g) ?? []).length - (linea.match(/\}/g) ?? []).length
    if (enFontFace && profundidad <= 0) enFontFace = false
  }
  return hallazgos
}

function caminar(directorio: string, salida: string[], htmlSolo: boolean) {
  for (const entrada of readdirSync(directorio, { withFileTypes: true })) {
    if (entrada.name === "node_modules" || entrada.name === "dist") continue
    const ruta = join(directorio, entrada.name)
    if (entrada.isDirectory()) caminar(ruta, salida, htmlSolo)
    else if (htmlSolo ? entrada.name.endsWith(".html") : EXTENSIONES.has(extname(entrada.name))) {
      salida.push(ruta)
    }
  }
}

export function archivosPorDefecto(raiz = process.cwd()) {
  const archivos: string[] = []
  for (const dir of ["registry", "src"]) {
    const ruta = join(raiz, dir)
    try {
      if (statSync(ruta).isDirectory()) caminar(ruta, archivos, false)
    } catch {
      /* el directorio puede no existir en un fixture */
    }
  }
  const indice = join(raiz, "index.html")
  try {
    if (statSync(indice).isFile()) archivos.push(indice)
  } catch {
    /* sin index */
  }
  const publico = join(raiz, "public")
  try {
    if (statSync(publico).isDirectory()) caminar(publico, archivos, true)
  } catch {
    /* sin public */
  }
  return archivos
}

export function comprobarArchivos(rutas: string[]) {
  const hallazgos: Hallazgo[] = []
  for (const ruta of rutas) {
    let texto: string
    try {
      texto = readFileSync(ruta, "utf8")
    } catch {
      continue
    }
    const relativo = relative(process.cwd(), ruta) || ruta
    hallazgos.push(...comprobarTexto(relativo, texto))
  }
  return hallazgos
}

function expandir(rutas: string[]) {
  const salida: string[] = []
  for (const ruta of rutas) {
    const info = statSync(ruta)
    if (info.isDirectory()) caminar(ruta, salida, false)
    else salida.push(ruta)
  }
  return salida
}

const esCli = Boolean((import.meta as ImportMeta & { main?: boolean }).main)
if (esCli) {
  const args = process.argv.slice(2)
  const rutas = args.length > 0 ? expandir(args) : archivosPorDefecto()
  const hallazgos = comprobarArchivos(rutas)
  for (const h of hallazgos) console.log(`${h.archivo}:${h.linea}: ${h.motivo}`)
  process.exit(hallazgos.length > 0 ? 1 : 0)
}
