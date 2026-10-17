# Estándar de diseño de las apps de Gonzalo Román

Marca v4 y estándar de interfaz v3 (15 oct 2026), con las decisiones de uso del 17 oct 2026. Base shadcn/ui con tokens propios y uso inspirado en Linear, adaptado a usuarios no técnicos. Si shadcn tiene el componente, úsalo. Si el kit lo tiene, usa el del kit. Ante la duda, quita.

## Uso
- Todo se hace con botones, menús y clics visibles. Nada depende del teclado, del clic derecho ni del hover.
- Ctrl/⌘ K (buscador) y otros atajos son un extra: siempre hay un botón visible que hace lo mismo.
- Lista por defecto, agrupada por estado, con círculo de estado y su palabra en cada fila y contador en cada grupo. Conmutador visible «Lista | Tablero».
- Al hacer clic en una fila se abre el panel de detalle a la derecha (hielo, sin borde). En móvil, a pantalla completa con «Volver».
- Cambio menor (estado, responsable, prioridad, etiqueta, fecha): selector visible, se aplica al instante y sale un toast con «Deshacer» (8 s). Si falla, se revierte y se avisa.
- Cambio importante (textos, altas, varios campos, dinero o terceros): formulario con «Guardar» y «Cancelar». Guardar desactivado sin cambios y «Guardando…» al enviar. Aviso «Tienes cambios sin guardar» al salir. Nunca autoguardado silencioso.
- Menú «…» siempre visible en filas, tarjetas y panel, con las mismas acciones que el menú contextual (salen de una única lista).
- Solo se confirma al borrar («Borrar tarea», «No se puede deshacer.»). Lo reversible se hace y ofrece Deshacer.
- Toasts solo para Deshacer y errores. La confirmación de guardado va en línea, junto al botón.
- Estados: cargando (skeleton estático pasados 200 ms), error con «Reintentar», vacío de primer uso con el dibujo de marca y botón, y vacío por filtro con «Borrar búsqueda». Sin pantallas de carga al cambiar de vista.
- Estado en la URL: vista, búsqueda y registro abierto.

## Color
- Solo tokens semánticos (bg-background, text-foreground, text-muted-foreground, bg-secondary, bg-muted, bg-sidebar, bg-primary, bg-accent, text-destructive, text-success, border-border, border-input). Nunca hex sueltos ni paleta de Tailwind.
- Superficies: barra lateral en cielo #DDEAF6 (bg-sidebar, activo en blanco); zona de trabajo en blanco #FFFFFF; panel de detalle, cabeceras de tabla, chips y skeletons en hielo #EEF4FA; menús, diálogos y popovers en blanco con borde de 1 px.
- Texto marino #0F2747; secundario pizarra #3D5470. Rojo #B42318, verde #2F6B3A.
- Tema por defecto ámbar: primary #D8961C (solo relleno, nunca texto), texto sobre primary #0F2747, accent (hover y selección) #F6E3BC, ring (foco y «texto ámbar») #8A5A0B. Temas oliva y petróleo con data-tema.
- primary solo en el botón principal (uno por vista), la barra de 2 px de la fila abierta y el cuadrado de marca.
- Contraste: texto de al menos 4,5:1 y bordes de control de al menos 3:1. Nunca gris sobre color.
- Solo tema claro. Sin sombras: la elevación la marca el borde.

## Tipografía
- Solo Lexend, autoalojada (public/fonts). Cifras en columna con tabular-nums, que usa Cifras GR.
- Escala: text-xs 12/16 (metadatos, IDs), text-sm 13/20 (base), text-base 15/22 (títulos de panel y diálogo), text-2xl 22/28 (título de página). En móvil, campos a 16 px.
- Pesos 400, 500 y 600; nunca 700. Interletrado 0 (título de página −0,01 em). Sin mayúsculas sostenidas ni cursivas.
- Cero sin barra. Comillas «», … de un carácter, espacio irrompible entre cifra y unidad.

## Espacio y forma
- Múltiplos de 4 px; página px-6. Escritorio: controles h-8, filas h-9, barra superior h-12. Móvil: áreas táctiles de al menos 44 px.
- Radios 2/4/6 px (rounded-sm, rounded-md, rounded-lg). Nunca rounded-xl o más. rounded-full solo en avatares y círculos de estado.
- Separa con espacio o con cambio de fondo: sin Separator, sin divide-y, sin líneas entre filas. Bordes de 1 px solo en controles, menús, diálogos, tarjetas del tablero y tablas de datos.

## Iconos y movimiento
- lucide-react de 16 px, solo funcionales (cerrar, buscar, más, chevron, menú «…», plegar). Excepción: círculos de estado y barras de prioridad.
- 0 ms en hover, selección y cambio de vista. Diálogos, popovers y menús: 150 ms de entrada y 120 ms de salida con cubic-bezier(0.23, 1, 0.32, 1), de opacity 0 y scale(0.95) a 1, desde el disparador. Sheet: translate en 200 ms. Nunca transition-all. Con prefers-reduced-motion, solo opacidad.

## Textos
- Español de España, de tú, seco y concreto. Botones con verbo + objeto («Guardar cambios», «Borrar tarea»). Sin exclamaciones ni emojis.
- Errores: qué ha pasado y qué hacer. Datos inventados marcados con «Datos de ejemplo».
- Avisos (Alert): fondo hielo (bg-muted), rounded-sm, sin barra lateral de color ni border-l. En un error, título e icono en text-destructive (B42318).
- Vocabulario: tarea (no «issue»), responsable (no «asignado»), ciclo (no «sprint»).

## Vetado (sin excepciones)
Degradados; sombras y resplandores; glassmorphism y backdrop-blur; emojis; iconos de adorno y «IA» con chispas; tarjetas para todo y rejillas de tarjetas; hero de plantilla; cifra gigante; icono en cuadrado de color; ceja en mayúsculas; numeración decorativa (solo en secuencias reales e IDs); «→» en botones; palabra en cursiva o en color; filetes decorativos y barras laterales de color (salvo la fila abierta); fondos de rejilla o textura; rebotes, latidos, zoom en hover; ilustraciones de relleno (solo el dibujo de marca en el vacío de primer uso); copy de marketing; modales innecesarios; toasts que no sean de Deshacer o de error; crema, serif y estilo periódico; modo oscuro; fuentes que no sean Lexend; centrar por defecto; más de un botón primario; píldoras saturadas; el carácter de punto medio (U+00B7) en cualquier texto.

## Comprobación
- bun run comprobar:estilo sin errores (hex, paleta, sombras, degradados, fuentes, punto medio y otros vetos).
- Playwright en verde (escritorio 1440×900 y móvil 390×844) y axe sin violaciones serias.
- Capturas del viewport a 390×844 y 1440×900 como artefacto de la CI, solo de apoyo. No hay visto bueno visual por PR: se aprueba si la CI y los tests pasan.

## Usar el router de la app con el aviso de salida
useAvisoSalida recibe un bloqueador { bloqueado, seguir, quedarse }.
- TanStack Router: const b = useBlocker({ shouldBlockFn: () => sucio, withResolver: true }) y luego { bloqueado: b.status === "blocked", seguir: b.proceed, quedarse: b.reset }.
- React Router: const b = useBlocker(sucio) y luego { bloqueado: b.state === "blocked", seguir: () => b.proceed?.(), quedarse: () => b.reset?.() }.
