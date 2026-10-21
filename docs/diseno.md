# docs/diseno.md: estándar de interfaz comprobable

*Gonzalo Román, versión del 17/10/2026; paleta Carbón del 21/10/2026. Para customer-hub, landing-gonzalo-rom-n, carloscanal y los repos nuevos.*

**Cómo se usa.** Cada regla se contesta con sí o no leyendo el código. Cuando lleva un `rg`, el resultado correcto es **cero líneas**, salvo que diga «revisar» (cada línea se mira a mano) u otra cosa. No hay capturas ni visto bueno visual en cada PR: se aprueba si todo da «sí». Si una regla no aplica (la landing no tiene listas), se marca «no aplica» y se explica en una línea.

**Alcance de los comandos** (probados el 17/10 en customer-hub, landing-gonzalo-rom-n y carloscanal): se ejecutan en bash desde la raíz y miran `src/` (todo el CSS, por ejemplo `src/styles.css`) e `index.html` solo si existe. Nunca miran `docs/`, para no encontrar este archivo. Los marcados con `!**/components/ui/**` dejan fuera las primitivas de shadcn en espaciados y bordes; los vetos (sombras, radios, colores, movimiento) sí cuentan en `components/ui`. Los colores se definen como variables en el CSS principal; el hex literal solo se admite con valores de la paleta y donde no hay variables CSS (plantillas de email, página de error y `theme-color`).

**Excepciones aprobadas de escala.** customer-hub (web de seguimiento de clientes) usa 13/15/17/22 px. La landing usa la escala y la rejilla de su guía (`marca/landing/guia-lovi.md`), así que las casillas de escala, alturas y densidad no le aplican. En la landing, los principios **no llevan numeración visible** (decisión de Gonzalo): una `<ol>` sin números visibles (`list-none`) está bien.

Reglas firmes desde el 17/10: toasts solo para Deshacer y errores; 44 px táctiles en móvil y `h-8` en escritorio; «·» prohibido en todas partes; y la frontera entre cambio menor e importante del §2.6.

## 1. Tokens

**Color: paleta Carbón**

Desde el 21/10/2026 (decisión de Gonzalo), la paleta Carbón es el estándar para los repos nuevos y para la demo de Patatas Arrebola. customer-hub (Hub), carloscanal y la landing de gonzaloroman.com mantienen sus colores actuales hasta que Gonzalo decida otra cosa: en ellos, las casillas de color de esta guía y el veto de hex sueltos se comprueban contra los valores que ya define su CSS principal. Tipografía, escala, maquetación y UX no cambian.

- [ ] El CSS principal (`src/styles.css` o `src/styles/tokens.css`) define estas variables y valores exactos, sin `.dark`:

| Variable | Hex | Uso | Clase |
|---|---|---|---|
| `--background`, `--card`, `--popover` | FFFFFF | área de trabajo, diálogos, menús | `bg-background` |
| `--foreground` | 0F2747 marino | texto | `text-foreground` |
| `--secondary`, `--muted` | F1F2F4 gris claro | panel de detalle, avisos, cabecera de tabla, skeleton | `bg-muted` |
| `--muted-foreground` | 3D5470 pizarra | texto secundario | `text-muted-foreground` |
| `--sidebar`, `--sidebar-foreground` | 2B2F36 carbón, FFFFFF | solo barra lateral, texto blanco | `bg-sidebar` |
| `--sidebar-accent`, `--sidebar-accent-foreground` | 474E5A, FFFFFF | elemento activo de la barra lateral | `bg-sidebar-accent` |
| `--border` | D3D5DA | bordes necesarios | `border-border` |
| `--input` | 686C74 | borde de control | `border-input` |
| `--destructive` | B42318 | solo negativos, retrasos, errores y borrar | `text-destructive` |
| `--status` | 3A4250 | iconos de estado (trazo 1,75) | `text-status` |
| `--status-late` | 9A6410 | icono de estado con retraso | `text-status-late` |
| `--status-done` | 0F2747 | icono de hecho | `text-status-done` |
| `--tag-1`, `--tag-1-mid`, `--tag-1-soft`, `--tag-1-foreground` | E6AF92, ECC2AB, F1D3C2, texto 5E2610 | etiquetas tono 1 (terracota) | `bg-tag-1` |
| `--tag-2`, `--tag-2-mid`, `--tag-2-soft`, `--tag-2-foreground` | A4C0E6, BAD0EE, CEDDF2, texto 0E2F5A | etiquetas tono 2 (azul) | `bg-tag-2` |
| `--tag-neutral`, `--tag-neutral-foreground` | E4E6EA, texto 2B2F36 | etiqueta de envase o contenedor | `bg-tag-neutral` |
| `--primary`, `--primary-foreground`, `--accent`, `--ring` | tema Carbón | ver abajo | `bg-primary`, `bg-accent`, `ring-ring` |

- [ ] Tema único Carbón, igual en todas las apps: `--primary` D4901A, `--primary-foreground` 0F2747, `--accent` F4D58F (fila seleccionada y hover), `--ring` 8A5A0B (foco y barra de 2 px de la fila con foco). `--sidebar-ring` sigue a `--primary`. No hay `data-tema` ni temas por app.
- [ ] **Nada de verde** (regla de Gonzalo): ni token `success`, ni clases ni hex verdes, tampoco en «hecho» ni en avisos de «correcto»: `rg -niP "success|green|emerald|\blime\b|teal|#(2F6B3A|3F6B34|B8E4C6|CBEBD4|DCF2E3)\b" src $(test -f index.html && echo index.html) | rg -v "toast\.success"` (los `toast.success` ya los veta §2.2). Hecho va en marino (`text-status-done`).
- [ ] `bg-primary` aparece solo en el botón principal (uno por vista) y el cuadrado de marca. La barra de 2 px de la fila con foco va en `ring` (8A5A0B). `bg-accent` solo en hover y selección.
- [ ] `bg-sidebar` no se usa fuera de la barra lateral: `rg -n "bg-sidebar([^\w-]|$)" src -g "!**/components/ui/**"` (revisar: cada línea es la barra lateral o su `Sheet` en móvil)

**Fuentes**
- [ ] Lexend autoalojada (latina y latina extendida, con cualquier nombre de archivo) con `@font-face` y `font-display: swap`, y precarga si hay `index.html`.
- [ ] Cifras GR (`cifras-gr-400/500/600.woff2`) cargada como `--font-cifras` y aplicada por `.tabular-nums`.
- [ ] `--font-sans: "Lexend", Verdana, sans-serif`. Sin Google Fonts: `rg -n "fonts\.(googleapis|gstatic)\.com" src $(test -f index.html && echo index.html)`
- [ ] Pesos 400, 500 y 600; nunca 700 ni pesos arbitrarios como `font-[590]` (el rango `300 700` de `@font-face` vale): `rg -nP "font-(bold|extrabold|black)\b|font-\[\d|font-weight:\s*+(?!(400|500|600|normal|inherit)\b|var\(|\d00\s+\d00)|fontWeight:\s*+(?!['\"]?(400|500|600)\b)" src`
- [ ] Cero sin barra: `rg -n "slashed-zero|['\"]zero['\"]" src`

**Escala, espacio, forma**
- [ ] Solo cuatro tamaños: `text-xs` 12/16, `text-sm` 13/20 (base), `text-base` 15/22, `text-2xl` 22/28. `rg -n "text-(lg|xl|[3-9]xl)([^\w-]|$)|text-\[[0-9.]+(px|rem|em)\]" src` y en CSS `rg -nP "font-size:\s*+(?!var\(--text-|inherit)|--text-(lg|xl|[3-9]xl)\s*:" src -g "*.css"`
- [ ] Espaciados múltiplos de 4 px y página `px-6`. `rg -nP "(^|[\s\x22\x27\x60:])-?(p[trblxyse]?|m[trblxyse]?|gap(-[xy])?|space-[xy])-(0\.5|1\.5|2\.5|3\.5|\[)" src -g "!**/components/ui/**"`
- [ ] Radios 2, 4 y 6 px: `rounded-sm` (casillas, etiquetas, avisos), `rounded-md` (botones, inputs), `rounded-lg` (diálogos, menús). `rounded-full` solo en avatares, fotos y círculos de estado. `rg -nP "rounded(-[trblse]{1,2})?-(xl|2xl|3xl|\[(?!inherit|[0-6]px\]))" src`
- [ ] Alturas: controles `h-8` en escritorio, filas de lista `h-9`, filas de tabla `h-10`, barra superior `h-12`.

## 2. Componentes obligatorios

**2.1 Botones**
- [ ] Primario: `Button` por defecto (`bg-primary`), uno por vista, con verbo y objeto («Crear cliente»).
- [ ] Secundario: `variant="outline"` (borde `input`) o `ghost`. Peligro: `variant="destructive"` (B42318), solo para borrar.
- [ ] En carga mantiene su texto, añade el indicador y solo se deshabilita mientras envía.
- [ ] Sin «→» ni iconos decorativos: `rg -n "→" src $(test -f index.html && echo index.html) | rg -v "^[^:]+:[0-9]+:\s*(//|/\*|\*|\{/\*)"`

**2.2 Avisos**
- [ ] `Alert` en `bg-muted` (gris claro F1F2F4) con `rounded-sm`, título corto y una frase que dice qué hacer.
- [ ] Error: texto e icono en `text-destructive` (B42318). Sin barra lateral de color: `rg -nP "(^|[\s\x22\x27\x60:])border-l(-[\w\[\]#./-]+)?(?=[\s\x22\x27\x60]|$)" src -g "!**/components/ui/**" | rg -v "border-l-transparent"` (revisar: solo se admite la barra de 2 px de la fila con foco).
- [ ] Toasts (`sonner`) solo para «Deshacer» y para errores; nunca para confirmar algo que ya se ve: `rg -nP "toast(\.(success|info|message|warning|loading|promise))?\(" src` (revisar; `toast.error` vale).

**2.3 Estados**
- [ ] Todo estado se muestra con `EstadoIcono` (círculo) **y** su palabra visible o `aria-label`. Sin revisar, Por hacer, En curso, En revisión, Hecha, Bloqueada, Cancelada.
- [ ] Sin píldoras de color saturado para los estados.

**2.4 Tablas con precios**
- [ ] Cada importe va en su propia columna, alineada a la derecha (`text-right`), con `tabular-nums`. La cabecera de esa columna también va a la derecha.
- [ ] Formato `es-ES` con espacio irrompible antes de la unidad: «1.250,00 €».
- [ ] Cabecera de tabla en `bg-muted`. Sin líneas entre filas ni `divide-y`.

**2.5 Cabecera y menús**
- [ ] Barra superior `h-12`: migas, «Buscar…» como botón visible y el botón primario.
- [ ] Menú de usuario (avatar) abajo en la barra lateral, o arriba a la derecha si no hay barra lateral, con «Ajustes» y «Cerrar sesión».
- [ ] A 390 px nada salta de línea en la cabecera ni en los menús: textos con `truncate` o `whitespace-nowrap`; lo que sobra va al menú «…».

**2.6 Formularios**
- [ ] Una columna (`max-w-2xl`), etiqueta encima del campo (`<Label htmlFor>`), ayuda debajo y error junto al campo en `text-destructive`.
- [ ] **Cambio importante** (textos, altas, varios campos a la vez, o lo que afecte a dinero o a terceros): botón «Guardar» explícito, desactivado hasta que haya cambios, que muestra «Guardando…» y luego «Guardado» en línea. Sin autoguardado: `rg -n -i "autosave|debounce.*(save|guardar|mutate)" src`
- [ ] Al salir con cambios sin guardar aparece «Tienes cambios sin guardar» (bloqueo del router y `beforeunload`): `rg -n "beforeunload" src` debe dar al menos una línea.
- [ ] **Cambio menor** (propiedad de lista cerrada: estado, responsable, prioridad, etiqueta, fecha): se aplica al elegir, sin «Guardar». Se muestra un toast de 8 s con «Deshacer», y si falla se deshace con «No se ha podido guardar. Se ha deshecho el cambio.»

**2.7 Confirmaciones**
- [ ] `AlertDialog` solo para borrar; su título coincide con el botón («Borrar tarea»). `rg -n -A1 "<AlertDialogTitle" src -g "!**/components/ui/**"` (revisar: todos los títulos empiezan por «Borrar»).
- [ ] Nada de «¿Seguro?» para acciones reversibles: se hacen y se ofrece Deshacer.

**2.8 Vacío, carga y error**
- [ ] Orden de render: cargando, error, vacío, contenido.
- [ ] Carga: skeleton estático en `bg-muted`, sin brillo ni `animate-pulse`: `rg -n "animate-(pulse|bounce|ping)" src`
- [ ] Error: qué pasó y qué hacer, con «Reintentar».
- [ ] Vacío de primer uso con dibujo de marca, título y botón; vacío por filtro sin dibujo y con «Borrar filtros».

## 3. Textos

- [ ] Ni un «·» en todo el repo, tampoco en comentarios ni metadatos: `rg -n "·" -g "!docs/**" .` (todo el repo salvo `docs/`).
- [ ] La raya «—» no se usa como separador ni en títulos («PALABRA — frase»): `rg -n "—" src $(test -f index.html && echo index.html) -g "!*.md" | rg -v "^[^:]+:[0-9]+:\s*(//|/\*|\*|\{/\*)"`. Tampoco como valor vacío de un desplegable: se escribe la palabra («Sin asignar»).
- [ ] Sin numeración decorativa («01», «Paso 1» como adorno): `rg -nP ">\s*0[1-9]\.?\s*<|['\"]0[1-9]\.?['\"]|list-decimal|list-style(-type)?:\s*decimal|counter\(" src`
- [ ] Titulares sin preguntas: `rg -n "<(h[1-6]|[A-Za-z]*Title)[^>]*>[^<]*¿" src`
- [ ] Español de España, tono seco y concreto, botones con verbo y objeto, sin exclamaciones ni emojis: `rg -nP "¡|\p{L}!\s*[\x22\x27<\x60]" src` (revisar). Nada de «potencia», «revoluciona» ni «sin esfuerzo».
- [ ] Fechas en día/mes con artículo: «el 14/10», «hasta el 3/11»; el año solo si no es el actual. Nunca «Oct 14», «14 Oct» ni ISO en pantalla.
- [ ] «Comillas latinas», «…» de un carácter: `rg -n "\p{L}\.\.\." src -g "*.tsx" -g "*.ts" | rg -v "^[^:]+:[0-9]+:\s*(//|/\*|\*|\{/\*)"` (solo tres puntos pegados a una palabra; el *spread* `...props` no salta)
- [ ] Sin mayúsculas decorativas: `rg -n "uppercase" src`
- [ ] Datos inventados marcados «Datos de ejemplo».

## 4. UX al estilo de Linear, para usuarios no técnicos

- [ ] Toda acción se puede hacer con botones y menús visibles. Ctrl K y los atajos son un extra opcional, nunca el único camino: cada `useAtajo` o `onKeyDown` tiene su equivalente en un botón o menú.
- [ ] Listas agrupadas por estado por defecto: cabecera con círculo, nombre, contador y botón para plegar.
- [ ] Filas alineadas: en cada fila de lista el orden es fijo. Hueco de prioridad (16 px, solo icono, nunca texto; «Ninguna» lleva un icono suave que ocupa su hueco; el nombre va en el tooltip y en el `aria-label`), código (ancho mínimo fijo para el código más largo, `tabular-nums`, alineado a la izquierda), icono de estado (16 px, solo icono dentro de la fila; el nombre en el tooltip y en el `aria-label`) y título (`truncate`). A la derecha, etiqueta, persona y fecha en columnas de ancho fijo, con la fecha alineada a la derecha (`text-right`); si falta un dato, se guarda igual su hueco. El texto de la prioridad y del estado solo aparece en el panel de detalle, junto a su etiqueta. Se comprueba con un test de Playwright: la fila lleva `data-fila` y sus partes `data-estado`, `data-titulo` y `data-fecha`; en todas las filas, a 1440 y a 390, el icono de estado y el título empiezan en la misma x (tolerancia de 1 px), y a 1440 la fecha acaba en la misma x:

  ```ts
  for (const ancho of [1440, 390]) {
    test(`filas alineadas a ${ancho} px`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: 900 });
      await page.goto("/");
      const filas = await page.locator("[data-fila]").all();
      const cajas = (sel: string) =>
        Promise.all(filas.map(async (fila) => (await fila.locator(sel).boundingBox())!));
      const igual = (xs: number[]) => expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(1);
      igual((await cajas("[data-estado]")).map((c) => c.x));
      igual((await cajas("[data-titulo]")).map((c) => c.x));
      if (ancho === 1440) igual((await cajas("[data-fecha]")).map((c) => c.x + c.width));
    });
  }
  ```

  Texto de prioridad dentro de las filas: `rg -nP "ETIQUETA_PRIORIDAD|(?<![=\w])\{[\w.?]+\.prioridad\}|>\s*(Urgente|Alta|Media|Baja|Ninguna|Sin prioridad)\s*<" src -g "**/*{lista,fila}*"` (solo mira los archivos con «lista» o «fila» en el nombre; el `aria-label` y `prioridad={...}` no saltan).
- [ ] Panel de detalle a la derecha (≈ 432 px, `bg-muted`, sin `border-l`), con botón «Cerrar» visible. En móvil es pantalla completa con «Volver».
- [ ] Conmutador «Lista | Tablero» visible en la barra de la vista (`ToggleGroup`), que guarda la elección en la URL.
- [ ] Una sola lista de acciones por objeto alimenta el menú «…» de la fila y el clic derecho (`ContextMenu`). Si se usa la paleta Ctrl K, sale de la misma lista. No hay acciones solo en el clic derecho.
- [ ] Sin pantallas de carga entre vistas: datos en caché o skeleton dentro de la vista, nunca spinner a página completa.
- [ ] Foco visible con `focus-visible:ring-ring` en todo lo interactivo: `rg -n "outline-none|outline:\s*none" src` (revisar: cada caso tiene su `focus-visible:ring`).
- [ ] Densidad: filas `h-9`, texto base 13 px y sin tarjetas para cada elemento.
- [ ] En móvil, las pestañas se desplazan en horizontal (`overflow-x-auto`, `whitespace-nowrap`) y no quedan tapadas por cabeceras fijas: si hay `sticky` o `fixed`, el contenido tiene su `top-*` o `scroll-mt-*` correspondiente.

## 5. Accesibilidad

- [ ] Táctil: en móvil todo lo pulsable mide al menos 44 px (`h-11` o `min-h-11`, o `size-11` en iconos). En escritorio, `h-8` (`md:h-8`).
- [ ] Contraste AA. Pares válidos: marino sobre blanco (14,98), gris claro F1F2F4 (13,38) y accent F4D58F (10,53); pizarra sobre blanco (7,78), gris claro (6,94) y accent (5,47); blanco sobre carbón 2B2F36 (13,44) y sobre 474E5A (8,38); B42318 sobre blanco (6,57), gris claro (5,87) y accent (4,62); blanco sobre B42318 (6,57); marino sobre D4901A (5,57); texto de etiqueta 5E2610 sobre E6AF92, ECC2AB y F1D3C2 (≥ 6,20) y 0E2F5A sobre A4C0E6, BAD0EE y CEDDF2 (≥ 7,16); 2B2F36 sobre E4E6EA (10,75). No textuales (≥ 3): 8A5A0B sobre blanco (5,92) y sobre accent (4,16); iconos 3A4250 (≥ 7,11) y 9A6410 (≥ 3,51) sobre blanco, gris claro y accent; foco D4901A sobre la barra carbón (4,99); borde 686C74 sobre blanco y gris claro (≥ 4,70).
- [ ] El ámbar D4901A nunca es texto ni icono (2,7:1): `rg -n "text-(primary|warning)([^\w-]|$)" src` (cero; `text-primary-foreground` no salta). Texto o icono «ámbar»: `text-ring` (8A5A0B).
- [ ] Nada de gris sobre color ni texto con opacidad: `rg -nP "text-(?!(xs|sm|base|lg|xl|\dxl)/)[a-z-]+/\d+" src`
- [ ] Cada campo tiene `<Label htmlFor>` o `aria-label`; cada botón de solo icono, `aria-label`.
- [ ] `select` nativo con `bg-background text-foreground` explícitos.

## 6. Vetos

Cada `rg` debe dar cero líneas.

- [ ] Sombras: `rg -nP "shadow-(?!none)|(^|[\s\x22\x27\x60:])shadow(?=[\s\x22\x27\x60]|$)|drop-shadow|(box|text)-shadow:\s*+(?!none)" src`
- [ ] Degradados: `rg -nP "gradient|bg-(linear|radial|conic)-|(^|[\s\x22\x27\x60:])(from|via)-[a-z]" src` (`slide-in-from-*` no salta)
- [ ] Desenfoque y cristal: `rg -nP "backdrop-blur|(^|[\s\x22\x27\x60:])blur(-|(?=[\s\x22\x27\x60]|$))|blur\(" src`
- [ ] Filetes decorativos y separadores: `rg -n "<Separator|divide-[xy]|<hr" src`; `border-l-*` solo en la fila con foco
- [ ] Hex y colores sueltos: `rg -noP "#[0-9a-fA-F]{3,8}\b" src $(test -f index.html && echo index.html) | rg -viP "#(FFFFFF|FFF|0F2747|3D5470|F1F2F4|2B2F36|474E5A|D3D5DA|686C74|B42318|D4901A|F4D58F|8A5A0B|3A4250|9A6410|E6AF92|ECC2AB|F1D3C2|5E2610|A4C0E6|BAD0EE|CEDDF2|0E2F5A|E4E6EA)$"`; literales `rg -nP "(rgba?|hsla?|oklch)\((?!var\()" src $(test -f index.html && echo index.html) | rg -vP "^[^:]+\.css:\d+:.*--[\w-]+\s*:"`; hex de la paleta en código, revisar: `rg -nP "#[0-9a-fA-F]{6}\b" src -g "!*.css" | rg -v -i "theme-color|email"`
- [ ] Paleta de Tailwind: `rg -n "\b(bg|text|border|ring|fill|stroke|outline|decoration)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)\b" src`
- [ ] Otras fuentes: `rg -n "font-(serif|mono)\b|\b(Inter|Geist|Roboto|Arial|Helvetica|Newsreader|Instrument Sans)\b|system-ui" src $(test -f index.html && echo index.html)`
- [ ] Emojis: `rg -n "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" src` («✕» y «✓» también: se usan iconos de lucide)
- [ ] Movimiento: `rg -n "transition-all|transition:\s*all|hover:scale" src`

También vetados (lectura): tarjetas para todo, cifra gigante, icono en cuadrado de color, centrar por defecto, más de un botón primario por vista, tema oscuro y modales innecesarios.

**Antes de pedir revisión:** todas las casillas en «sí», los `rg` en cero y los tests del repo pasan. El repo del kit (`groman-prog/kit-apps-gonzalo`) automatiza los vetos del §6 con `bun run comprobar`.
