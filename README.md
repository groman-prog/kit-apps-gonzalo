# Kit de apps de Gonzalo

Componentes de React, shadcn/ui y Tailwind 4 con el estándar visual de las apps de Gonzalo Román: Lexend autoalojada, paleta Carbón y listas, tableros y paneles listos para una app de tareas.

## Tema

Carbón es el tema por defecto desde el 21 oct 2026. Los temas oliva y petróleo ya no existen.

Hub (customer-hub) y Casa (carloscanal) no se migran: siguen con el cielo y el ámbar que ya tienen. Si una de esas apps copia el `tokens.css` nuevo y quiere seguir igual:

1. Copia `plantillas/tema-anterior.css` a `src/styles/tema-anterior.css`, o instala el item `tema-anterior`.
2. Impórtalo en el CSS principal, justo después de `tokens.css`.
3. En el `<html>`, añade `data-tema="anterior"`.

Sin ese atributo, la app usa Carbón. Las apps nuevas no lo ponen.

## Probar la demo

```bash
bun install && bun run dev
```

La demo se abre en `http://127.0.0.1:5173` con 24 tareas de ejemplo. Usa Carbón.

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
