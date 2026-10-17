# kit-apps-gonzalo: instrucciones para agentes

Kit de componentes React + shadcn/ui + Tailwind 4 con el estándar visual y de uso de Gonzalo Román. Se distribuye como registry de shadcn en GitHub.

## Reglas
- Cumple docs/diseno.md. Ante la duda, quita.
- Los componentes viven en registry/kit/. La demo (src/) solo los usa: no reimplementes en la demo lo que es del kit.
- Solo tokens semánticos de src/styles/tokens.css. Nada de hex, paleta de Tailwind, sombras, degradados, otras fuentes ni el carácter de punto medio.
- Todo se puede hacer con controles visibles. Los atajos son un extra y no se testean como criterio.
- Cambio menor (propiedad con lista cerrada): al instante, con toast de Deshacer. Cambio importante (textos, altas, varios campos): botón Guardar y aviso de cambios sin guardar. Solo se confirma al borrar.
- Textos en español de España, verbo + objeto, sin exclamaciones ni emojis. «Tarea», «responsable».

## Antes de abrir o actualizar un PR
bun run lint && bun run comprobar:estilo && bun run typecheck && bun run test && bun run build && bun run registry:build && bun run e2e && bun run capturas

## Flujo
- Rama propia y PR contra main. Nunca push a main ni --force. No fusiones tú.
- Un PR se aprueba cuando la CI y los tests están en verde y cumple docs/diseno.md. No hay revisión visual por PR (la de Monipenny fue única, en el primer PR).
- PR corto: qué cambia y criterios cumplidos.
