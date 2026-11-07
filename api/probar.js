// Botón "Probar aviso": manda un aviso de prueba a todos tus dispositivos.
const { clave, preparar, enviarATodos } = require('./_avisos');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Usá POST' });
  try {
    if (((req.body && req.body.clave) || '') !== clave()) return res.status(401).json({ ok: false, error: 'Clave incorrecta' });
    const datos = await preparar();
    const resultado = await enviarATodos(datos.dispositivos, {
      titulo: '✅ ¡Los avisos de CURO Agenda funcionan!',
      cuerpo: 'Cada mañana te aviso qué tareas vencen hoy y mañana.',
      etiqueta: 'curo-prueba'
    });
    return res.status(200).json({ ok: true, dispositivos: (datos.dispositivos || []).length, ...resultado });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'No se pudo enviar la prueba' });
  }
};
