# CURO Agenda

Agenda de tareas y producción de CURO Group: prioridades, calendario, tablero por etapas, bandeja de archivos y copias de seguridad (JSON y CSV). Los datos se guardan en Supabase («Curo group Plataforma») y se ven igual desde cualquier dispositivo.

Página estática (`index.html` + `logo.png`), publicada en Vercel.

## Avisos de vencimiento (📲 Avisos)

Cada mañana (07:00 UTC, 8:00 h en Madrid en invierno) Vercel ejecuta `/api/avisar`, que manda un aviso a la computadora y al celular con las tareas que vencen hoy y mañana, aunque la agenda esté cerrada.

- Los avisos leen las tareas directamente de `agenda_tareas`.
- Tablas: `agenda_config`, `agenda_tareas_avisos`, `agenda_dispositivos` (sin acceso directo; solo por funciones que piden la clave).
- Variable de entorno necesaria en Vercel: `AGENDA_CLAVE` (la misma clave que se escribe al activar los avisos).
- Las claves de envío se crean solas la primera vez y se guardan en Supabase.

_Avisos activos desde la versión MVP 0.5 (noviembre 2026)._

## Datos en la nube (desde noviembre 2026)

- Al abrir la agenda se pide la clave (la misma de los avisos) una sola vez por dispositivo.
- Tablas: `agenda_tareas` (una fila por tarea) y `agenda_bandeja`. Sin acceso directo; solo por las funciones `agenda_cargar`, `agenda_guardar_tareas`, `agenda_borrar_tareas` y `agenda_guardar_bandeja`, que piden la clave.
- Archivos adjuntos: carpeta privada `agenda-archivos` del almacenamiento de Supabase (máx. 5 MB por archivo). La función `agenda-archivos` (Edge Function) da enlaces temporales para subir, abrir y borrar.
- El navegador guarda solo una copia para abrir rápido (`curoAgendaCacheV4`). La primera vez que se entra desde un navegador que tenía tareas guardadas solo ahí, se suben solas a la nube. La copia vieja (`curoAgendaTasksV3`) no se borra, por seguridad.
