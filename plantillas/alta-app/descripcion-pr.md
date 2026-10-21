<!-- Plantilla de descripción de la PR de alta (rama lovi/alta-app). Si toca una zona delicada,
     la PRIMERA línea debe ser «Toca zona delicada: …». -->
Solo guion de pruebas y documentación para agentes: no cambia el comportamiento de la app ni publica nada.

## Cambios
- `npm run comprobar`: guion corto con Playwright que arranca la app en local y recorre las pantallas clave (TODO: lista), comprobando que cada una carga su título y que no hay errores en la consola.
- `@playwright/test` como dependencia de desarrollo (si no estaba).
- En `TODO AGENTS.md/CLAUDE.md`: regla para ejecutar el guion antes de cada PR y mantenerlo al día (M1), línea «Lo que me costó:» al cerrar cada tarea (M2) y sección «Zonas delicadas» (M3).

## Prueba
- `npm run comprobar` ejecutado en local: TODO (N pasan, N saltadas, tiempo).
- `bun run test` / `bun run lint` sobre los archivos nuevos: TODO.

## Revisión automática
- Diff completo contra `main` y el archivo de instrucciones: solo toca pruebas, documentación y devDependencies; no toca el bloque LOVABLE ni `src/routeTree.gen.ts`. TODO: hallazgos o «sin hallazgos».

Lo que me costó: nada
