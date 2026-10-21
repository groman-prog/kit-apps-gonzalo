<!-- Plantilla: pegar al FINAL de AGENTS.md (o CLAUDE.md si es el archivo de instrucciones del agente),
     SIEMPRE fuera del bloque <!-- LOVABLE:BEGIN --> … <!-- LOVABLE:END -->. Sustituye los «TODO». -->

## Guion de comprobación (M1, 21 oct 2026)

- Antes de abrir cada PR, ejecuta `npm run comprobar`. Si añades, quitas o renombras una pantalla clave, actualiza el guion en la misma PR. Mantenlo corto: solo pantallas clave.
- El guion está en `e2e/comprobar.spec.ts` (configuración en `e2e/comprobar.config.ts`). Las pantallas con sesión solo se recorren si hay `COMPROBAR_EMAIL` y `COMPROBAR_PASSWORD` en el entorno; nunca escribas claves en el repo. Si no puedes ejecutarlo (por ejemplo, porque tu entorno no lo permite o no tiene navegador), dilo en la sección «## Prueba» de la PR.

## «Lo que me costó» (M2, 21 oct 2026)

- Al terminar cada tarea, añade al final de la descripción de la PR (y como comentario en la tarea de Linear si tienes acceso) una línea que empiece por «Lo que me costó:» con lo que te dificultó el trabajo (instrucciones confusas, datos que faltaban, contexto que no encontraste). Si no hubo nada, escribe «Lo que me costó: nada».

## Zonas delicadas

- Acceso e identidad: TODO (rutas de login, crear cuenta, restablecer contraseña, invitaciones, `src/integrations/supabase/`, `src/integrations/lovable/`). Si la app no tiene login: «esta app no tiene login; si una tarea lo pide, para y pregunta en la PR».
- Roles y permisos: TODO (quién puede hacer qué: funciones tipo `es_admin`, pantallas de personas o invitados).
- Políticas de acceso a la base de datos: TODO (`supabase/migrations/` con RLS, políticas, `GRANT`/`REVOKE`, funciones `SECURITY DEFINER`; `supabase/tests/`; `supabase/config.toml`).
- Datos personales o de clientes: TODO (archivos que leen, guardan o generan esos datos).
- Secretos y claves, y entradas públicas desde fuera: `.env`, TODO (archivos `*.server.ts` con claves, webhooks en `src/routes/api/`, conectores MCP) y `.github/workflows/`.
- Correos o mensajes que reciben otras personas: TODO (plantillas de correo, textos de Telegram o WhatsApp).
- Configuración de Lovable: `vite.config.ts`, `src/router.tsx`, `src/start.ts`, `src/server.ts`, `.lovable/`.
- Si tu PR toca alguna zona delicada, dilo en la primera línea de la descripción de la PR: «Toca zona delicada: …».
