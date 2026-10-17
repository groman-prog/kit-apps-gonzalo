# Kit de apps de Gonzalo

Componentes de React, shadcn/ui y Tailwind 4 con el estándar visual de las apps de Gonzalo Román: Lexend autoalojada, temas ámbar, oliva y petróleo, y listas, tableros y paneles listos para una app de tareas.

## Probar la demo

```bash
bun install && bun run dev
```

La demo se abre en `http://127.0.0.1:5173` con 24 tareas de ejemplo. En Ajustes puedes cambiar el tema.

## Instalar desde GitHub

Con el proyecto ya iniciado con shadcn (`radix` y el preset `nova`):

```bash
npx shadcn@latest add groman-prog/kit-apps-gonzalo/lista-agrupada
```

Para fijar esta versión:

```bash
npx shadcn@latest add groman-prog/kit-apps-gonzalo/lista-agrupada#v0.1.1
```

El kit entero:

```bash
npx shadcn@latest add groman-prog/kit-apps-gonzalo/kit-completo#v0.1.1
```

Después importa `src/styles/tokens.css` y `src/styles/fuentes.css` en tu CSS principal.

## Fuentes

`shadcn build` lee los archivos como texto. Un `.woff2` se corrompe, así que el registry no los incluye. El item `fuentes` trae `scripts/generar-fuentes.py`. Ejecútalo en la raíz del proyecto para generar Lexend y Cifras GR en `public/fonts`.

## Comprobaciones

```bash
bun run lint
bun run comprobar:estilo
bun run typecheck
bun run test
bun run e2e
```
