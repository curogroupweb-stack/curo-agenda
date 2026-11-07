// Se ejecuta solo, todos los días a la mañana (ver vercel.json).
// Avisa de las tareas que vencen hoy y mañana. Envía como máximo una vez por día.
const { clave, rpc, preparar, enviarATodos } = require('./_avisos');

module.exports = async (req, res) => {
  try {
    const datos = await preparar();
    const tareas = datos.tareas || [];
    if (!tareas.length) return res.status(200).json({ ok: true, tareas: 0, mensaje: 'Nada vence hoy ni mañana' });
    if (!(await rpc('agenda_marcar_envio', { p_clave: clave() }))) {
      return res.status(200).json({ ok: true, mensaje: 'El aviso de hoy ya se envió' });
    }
    const hoy = tareas.filter(t => t.vence === datos.hoy);
    const manana = tareas.filter(t => t.vence !== datos.hoy);
    let titulo, cuerpo;
    if (tareas.length === 1) {
      titulo = (hoy.length ? '⏰ Vence HOY: ' : '🔔 Mañana vence: ') + tareas[0].titulo;
      cuerpo = (tareas[0].proyecto ? tareas[0].proyecto + ' · ' : '') + 'Tocá para abrir CURO Agenda.';
    } else {
      titulo = '🔔 CURO Agenda: ' + tareas.length + ' tareas por vencer';
      const partes = [];
      if (hoy.length) partes.push('HOY: ' + hoy.map(t => t.titulo).join(', '));
      if (manana.length) partes.push('Mañana: ' + manana.map(t => t.titulo).join(', '));
      cuerpo = partes.join(' · ');
    }
    if (cuerpo.length > 230) cuerpo = cuerpo.slice(0, 227) + '…';
    const resultado = await enviarATodos(datos.dispositivos, { titulo, cuerpo, etiqueta: 'curo-vencimientos-' + datos.hoy });
    return res.status(200).json({ ok: true, tareas: tareas.length, ...resultado });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'No se pudieron enviar los avisos' });
  }
};
