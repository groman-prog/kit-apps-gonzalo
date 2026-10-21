# Alta de una app nueva (guía para Lovi)

Guía reutilizable para dar de alta cualquier app viva de Gonzalo: un repo nuevo de groman-prog que entra en todas las rutinas y recibe M1, M2 y M3. Plantillas listas para copiar en `/workspace/lovi/plantillas/alta-app/` (copia pública en `groman-prog/kit-apps-gonzalo`, carpeta `plantillas/alta-app/`).

Coste cero: nada de `send_message` de Lovable, ni ejecuciones de Claude o Cursor, ni `deploy_project`. Todo se hace con el clon local y `gh`.

## 0. ¿Es una app viva?

Criterio de «viva» (Gonzalo, 21 oct 2026, versión corregida): una app sale de las rutinas solo si en los últimos 15 días NADIE la ha usado (visitas en get_project_analytics de Lovable o inicios de sesión; sin contar las visitas de prueba de Lovi) Y Gonzalo no la ha tocado (sin cambios en GitHub ni en Lovable). Si cumple cualquiera de las dos, sigue viva. El paso diario lo comprueba; antes de sacar una app se avisa a Gonzalo en una línea. Una app nueva se da de alta y se le avisa en una línea. Nunca volver a dar de alta una app que Gonzalo sacó a mano.

Cómo comprobarlo:
- Cambios: `gh api repos/groman-prog/REPO/commits?since=$(date -d '15 days ago' -Iseconds) --jq length` (> 0 = viva) y ediciones en Lovable.
- Uso: visitas en `get_project_analytics` de Lovable (lectura, sin coste) o inicios de sesión; descarta las visitas de prueba de Lovi.
- Antes de nada, mira `/workspace/lovi/apps-vivas.md`: si la app está en «Sacadas por Gonzalo», NO la des de alta. Si está en «No son apps», tampoco.

## 1. Detectar apps nuevas (paso diario)

1. `gh repo list groman-prog --limit 100 --json name,pushedAt,isArchived` y compara con la tabla de `apps-vivas.md`, «Sacadas por Gonzalo» y «No son apps».
2. Haz lo mismo con los proyectos de Lovable (lista de proyectos, solo lectura). Un proyecto de Lovable sin GitHub se apunta con «(sin GitHub aún)»: entra en las rutinas que no necesitan repo y queda pendiente de conectar a GitHub para el resto de esta guía.
3. Cada repo que no esté en ninguna lista y cumpla el criterio del punto 0 es una app nueva: sigue los pasos 2 a 8.

## 2. Registrar la app

1. Añade una fila a la tabla de `/workspace/lovi/apps-vivas.md`: App | `groman-prog/REPO` | en uso / en construcción | agente de código (Claude Code si existe `.github/workflows/claude-code.yml`; Cursor si no) | notas (dominio, id de Lovable, datos sensibles).
2. Añade el repo a los disparadores de las rutinas de revisión de PR.
3. Avisa a Gonzalo en una línea: «He dado de alta NOMBRE (groman-prog/REPO) en las rutinas; si no es una app viva, dímelo y la saco».

## 3. Preparar el clon

```bash
cd /workspace/lovi && gh repo clone groman-prog/REPO   # o git -C REPO pull --ff-only si ya existe
cd REPO && git checkout -b lovi/alta-app
```
Mira: `package.json` (scripts `dev`, `test`, `lint`; si ya tiene `@playwright/test`), `bun.lock` o `package-lock.json`, `AGENTS.md`/`CLAUDE.md` (bloque `<!-- LOVABLE:BEGIN -->`…`<!-- LOVABLE:END -->`), `src/routes/` (pantallas), `supabase/`, `.github/workflows/`, `.env*`.

## 4. Guion de comprobación (M1)

1. Si falta Playwright: `bun add -d @playwright/test@^1.64.1` (misma versión que las otras apps; el navegador ya está en `~/.cache/ms-playwright`). Si no hay navegador: `bunx playwright install chromium`.
2. Copia `plantillas/alta-app/comprobar.config.ts` a `e2e/comprobar.config.ts` y ajusta puerto y comando de arranque.
3. Copia `plantillas/alta-app/comprobar.spec.ts` a `e2e/comprobar.spec.ts` y rellena los «TODO» con 3–6 pantallas clave leídas de `src/routes/` (públicas; con sesión solo si hay login, detrás de `COMPROBAR_EMAIL`/`COMPROBAR_PASSWORD`; página 404). Solo lectura: nunca escribe datos.
4. En `package.json`, dentro de `scripts`: `"comprobar": "playwright test -c e2e/comprobar.config.ts"`.
5. Si ya existe `playwright.config.ts` con `npm run e2e`, añade `testIgnore: ["comprobar.spec.ts"]` en sus proyectos para que el guion no corra dos veces (como customer-hub #26).
6. Añade `test-results/` y `playwright-report/` a `.gitignore` si no están.
7. Ejecuta `npm run comprobar` hasta que salga en verde. Pasa también `bun run test` y `npx eslint e2e` / `npx prettier --write e2e` si el repo los usa.

## 5. Reglas M1, M2 y M3 en el archivo de instrucciones

1. Archivo: el que lee el agente de código. Si `CLAUDE.md` solo contiene `@AGENTS.md`, usa `AGENTS.md` (apps de Cursor) o `CLAUDE.md` debajo del import (apps de Claude Code, como customer-hub #25). Siempre fuera del bloque LOVABLE, al final del archivo.
2. Pega `plantillas/alta-app/reglas-agentes.md` y rellena «## Zonas delicadas» inspeccionando el repo:
   - `rg -n "supabase.auth|signIn|signUp|resetPassword" src` → acceso e identidad.
   - `rg -n "es_admin|has_role|rol|role" src supabase` → roles y permisos.
   - `ls supabase/migrations supabase/tests` y `rg -ln "POLICY|SECURITY DEFINER|GRANT|REVOKE" supabase` → políticas de la base de datos.
   - `rg -ln "email|correo|telegram|whatsapp|mailto" src` → correos y mensajes que reciben otras personas, y contacto.
   - `ls src/routes/api* .github/workflows .env* 2>/dev/null` y `rg -ln "process.env|import.meta.env|\.server\.ts" src` → secretos y entradas públicas.
   - `public/robots.txt`, metas `title`/`description`/`og:*`/`robots` en `src/routes/__root.tsx` → dominio, SEO y visibilidad.
   - Siempre: configuración de Lovable (`vite.config.ts`, `src/router.tsx`, `src/start.ts`, `src/server.ts`, `.lovable/`).
   Quita las categorías que no aplican o di explícitamente «esta app no tiene X; si una tarea lo pide, para y pregunta». Cita rutas reales, no inventadas.
3. Copia la sección «## Zonas delicadas» final en `/workspace/lovi/zonas-delicadas.md` con un encabezado `## REPO (Nombre)`.
4. Copia `plantillas/alta-app/diseno.md` a `docs/diseno.md` de la app. Es el estándar Carbón del 21 oct 2026. Hub (customer-hub) y Casa (carloscanal) no cambian de paleta: conservan el tema `anterior` (ver el README del kit).

## 6. Workflow de Claude Code (solo si existe `.github/workflows/claude-code.yml`)

Aplica `plantillas/alta-app/claude-code-pasos.yml`: caché + instalación de Chromium tras `bun install` y `Bash(npm run comprobar),Bash(bun run comprobar),Bash(npx playwright *),Bash(bunx playwright *)` al final de `--allowedTools`. Nada más (ni secretos, ni permisos, ni disparadores). Valida con `actionlint -shellcheck= .github/workflows/claude-code.yml` (binario en `/tmp/actionlint` o descárgalo de rhysd/actionlint). Va en la misma PR de alta; cuenta como aprobado por la regla general de Gonzalo del 21 oct 2026, y la descripción debe empezar por «Toca zona delicada: workflow (aprobado por Gonzalo el 21 oct 2026)».

## 7. PR de alta

1. `git add -A && git commit -m "Guion de comprobación (npm run comprobar), «Lo que me costó» y zonas delicadas"` y `git push -u origin lovi/alta-app`.
2. `gh pr create -R groman-prog/REPO --base main --head lovi/alta-app --title "…" --body-file descripcion.md` (lista, no borrador). Cuerpo desde `plantillas/alta-app/descripcion-pr.md` con «## Cambios», «## Prueba», «## Revisión automática» y «Lo que me costó: …».
3. Comprueba el diff: `gh pr diff N -R groman-prog/REPO --name-only`. Fusiona (`gh pr merge N --squash --delete-branch`) SOLO si toca únicamente guiones, pruebas, documentación, `.gitignore`, devDependencies (`package.json` + lockfile) o el workflow aprobado del paso 6. Si toca código de la app, el bloque LOVABLE o `src/routeTree.gen.ts`, no fusiones: deja la PR para revisión y avisa.
4. Recuerda: lo que llega a `main` se sincroniza con Lovable. No hace falta publicar (`deploy_project`).

## 8. Cerrar

- En `apps-vivas.md`, en Notas: «M1–M3 de alta (PR #N, 21 oct 2026)» o la fecha real.
- Informe para Gonzalo en una línea y en español de España: app, PR y si el guion salió en verde.

## Para sacar una app

Solo si en 15 días nadie la usó Y Gonzalo no la tocó (punto 0). Avisa antes en una línea; si Gonzalo la saca a mano, muévela a «Sacadas por Gonzalo» y quita sus disparadores. No borres nada de su repo.
