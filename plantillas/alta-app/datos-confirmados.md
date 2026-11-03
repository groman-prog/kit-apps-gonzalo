<!-- Plantilla: copiar a docs/datos-confirmados.md de la app nueva y sustituir los «TODO». Quita el apartado de sesión o de base de datos si la app no los tiene. Estas líneas comunes ya están confirmadas (no hace falta repetir las tres comprobaciones). -->

# Datos confirmados

Aquí guardamos los agentes de código (Claude Code, Codex, Cursor) y Lovi lo que ya sabemos seguro de este repo: el comando de pruebas que funciona, los pasos previos y las rarezas del entorno. Así nadie lo vuelve a descubrir en cada tarea.

## Cómo se usa

1. **Al empezar** una tarea, léelo entero.
2. **Al acabar**, actualízalo en la misma PR: apunta lo nuevo que hayas comprobado y tacha lo que ya no se cumpla.
3. **Regla de las tres veces:** solo se apunta algo cuando se ha comprobado tres veces, en tres tareas o ejecuciones distintas. Una vez o dos no es un dato confirmado: ponlo en «Lo que me costó:» de tu PR y espera a repetirlo.
4. **Cada línea lleva fecha** (día, mes y año de la última vez que se comprobó) y, si hace falta, cómo se comprobó. Si algo deja de cumplirse, no lo borres: táchalo con `~~…~~` y la fecha en que dejó de ser cierto.
5. Solo hechos comprobados y breves. Nada de opiniones, decisiones (esas van en `docs/decisiones.md`) ni secretos, claves o contraseñas.
6. Una línea por dato, en español de España. Si el archivo pasa de unas 60 líneas, resume antes de añadir.

Las líneas de los apartados de abajo vienen ya confirmadas de `AGENTS.md` y del repaso de «Lo que me costó» de Lovi (2 nov 2026); no hay que repetir las tres comprobaciones para ellas.

## Pruebas y pasos previos

- TODO (comando de pruebas, build y guion `comprobar` de la app; pasos previos; con fecha)

## Entorno y rarezas comunes

- `rg` puede no estar instalado en el entorno de Claude Code: usa `git grep -n` o `grep -rn`. Un test o un guion que busque texto no puede depender de `rg`. (2 nov 2026, repaso de Lovi)
- El primer arranque del servidor de desarrollo o de pruebas puede tardar más de 2 minutos: espera hasta 4 o reintenta una vez. (2 nov 2026, repaso de Lovi)
- Si la página hace scroll dentro de un contenedor, la captura de página completa sale cortada: usa un viewport alto o captura el contenedor. (2 nov 2026, repaso de Lovi)
- El entorno del agente no tiene cuenta de prueba (`COMPROBAR_EMAIL` y `COMPROBAR_PASSWORD`): las pantallas con sesión quedan sin ver y Lovi las prueba en la revisión. (26 oct 2026, repaso de Lovi)
- Si no puedes ejecutar `tsc` aparte, no insistas: dilo en «## Prueba» y Lovi lo pasa en la revisión. (26 oct 2026, repaso de Lovi)
- La app es TanStack Start: no hay `index.html`; el `<head>` (título, metas e iconos) está en `src/routes/__root.tsx`. (26 oct 2026, repaso de Lovi)
- (Solo con base de datos) Antes de escribir, lee en `supabase/migrations/` las políticas y los disparadores de la tabla: un `update` o un `delete` sin política que lo permita no da error, cambia cero filas. (26 oct 2026, repaso de Lovi)
- (Solo con base de datos) `src/integrations/supabase/types.ts` lo genera Lovable: no lo edites; tipa la consulta a mano y dilo en la PR. (26 oct 2026, repaso de Lovi)

## Rarezas de esta app

- TODO (o quitar el apartado)
