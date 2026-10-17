## Interfaz: usa el kit
- Esta app usa el kit de Gonzalo Román: groman-prog/kit-apps-gonzalo (registry de shadcn).
- Antes de crear una lista, tablero, panel de detalle, selector, formulario, menú de acciones o estado vacío, instala el componente del kit: npx shadcn@latest add groman-prog/kit-apps-gonzalo/<item> (lista: npx shadcn@latest list groman-prog/kit-apps-gonzalo). No lo reimplementes.
- Cumple docs/diseno.md (se instala con el item reglas-agentes).
- Cambio menor: al instante con Deshacer. Cambio importante: botón Guardar y aviso de cambios sin guardar. Solo se confirma al borrar. Todo con controles visibles.
- Si el kit no tiene lo que necesitas, dilo en el PR en vez de inventar un patrón nuevo.
- No hay visto bueno visual por PR: el PR se aprueba si cumple docs/diseno.md (cada casilla en sí y los rg en cero) y la CI está en verde.
