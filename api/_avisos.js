// Funciones compartidas para enviar los avisos de CURO Agenda.
// Las claves de envío se crean solas la primera vez y quedan guardadas en Supabase.
const webpush = require('web-push');

const SUPABASE_URL = 'https://llugctysxrkqpydyhnvw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RPo3-Vb7rZ9A7R1dXsH11Q_h5iKXT64'; // clave pública

function clave() {
  if (!process.env.AGENDA_CLAVE) throw new Error('Falta AGENDA_CLAVE en Vercel');
  return process.env.AGENDA_CLAVE;
}

async function rpc(nombre, datos) {
  const r = await fetch(SUPABASE_URL + '/rest/v1/rpc/' + nombre, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(datos || {})
  });
  const texto = await r.text();
  if (!r.ok) throw new Error('Supabase ' + r.status + ': ' + texto.slice(0, 200));
  return texto ? JSON.parse(texto) : null;
}

// Trae tareas, dispositivos y claves de envío (las crea si todavía no existen).
async function preparar() {
  let datos = await rpc('agenda_para_avisar', { p_clave: clave() });
  if (!datos.vapid_privada) {
    const k = webpush.generateVAPIDKeys();
    await rpc('agenda_guardar_vapid', { p_clave: clave(), p_publica: k.publicKey, p_privada: k.privateKey });
    datos = await rpc('agenda_para_avisar', { p_clave: clave() });
  }
  webpush.setVapidDetails('mailto:curogroup.web@gmail.com', datos.vapid_publica, datos.vapid_privada);
  return datos;
}

// Envía el mismo aviso a todos los dispositivos; quita los que ya no existen.
async function enviarATodos(dispositivos, aviso) {
  let enviados = 0, quitados = 0, errores = 0;
  for (const sub of dispositivos || []) {
    try {
      await webpush.sendNotification(sub, JSON.stringify(aviso), { TTL: 60 * 60 * 20, urgency: 'high' });
      enviados++;
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) {
        try { await rpc('agenda_quitar_dispositivo', { p_clave: clave(), p_endpoint: sub.endpoint }); } catch (_) {}
        quitados++;
      } else { errores++; console.error('Aviso no enviado:', e.statusCode, e.body || e.message); }
    }
  }
  return { enviados, quitados, errores };
}

module.exports = { clave, rpc, preparar, enviarATodos };
