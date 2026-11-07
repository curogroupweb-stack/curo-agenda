// Devuelve la clave pública para que el navegador pueda anotarse a los avisos.
const { preparar } = require('./_avisos');

module.exports = async (req, res) => {
  try {
    const datos = await preparar();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true, clave: datos.vapid_publica });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'No se pudo preparar los avisos' });
  }
};
