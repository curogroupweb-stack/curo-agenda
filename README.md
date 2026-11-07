# CURO Agenda

Agenda de tareas y producción de CURO Group: prioridades, calendario, tablero por etapas, bandeja de archivos y copias de seguridad (JSON y CSV). Los datos se guardan en el navegador.

Página estática (`index.html` + `logo.png`), publicada en Vercel.

## Avisos de vencimiento (📲 Avisos)

Cada mañana (07:00 UTC, 8:00 h en Madrid en invierno) Vercel ejecuta `/api/avisar`, que manda un aviso a la computadora y al celular con las tareas que vencen hoy y mañana, aunque la agenda esté cerrada.

- La agenda completa sigue guardada en el navegador. Solo se copia a Supabase («Curo group Plataforma») una versión liviana de las tareas abiertas con fecha (título, proyecto y fecha), desde el dispositivo marcado como principal.
- Tablas: `agenda_config`, `agenda_tareas_avisos`, `agenda_dispositivos` (sin acceso directo; solo por funciones que piden la clave).
- Variable de entorno necesaria en Vercel: `AGENDA_CLAVE` (la misma clave que se escribe al activar los avisos).
- Las claves de envío se crean solas la primera vez y se guardan en Supabase.
