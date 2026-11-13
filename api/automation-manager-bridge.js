// Called by a scheduler at Saturday 10:00 Europe/Madrid.
// This endpoint only sends a preparation request; it never publishes content.
module.exports = async (req, res) => {
  const expected = process.env.CRON_SECRET;
  if (!expected || req.headers.authorization !== 'Bearer ' + expected) {
    return res.status(401).json({ok:false,error:'No autorizado'});
  }
  const target = process.env.CURO_AUTOMATION_MANAGER_BRIDGE_URL;
  const secret = process.env.CURO_AGENDA_BRIDGE_SECRET;
  if (!target || !secret) return res.status(503).json({ok:false,error:'Conexión sin configurar'});
  const now = new Date();
  const madrid = new Intl.DateTimeFormat('en-GB', {timeZone:'Europe/Madrid',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);
  const part = t => madrid.find(x=>x.type===t)?.value;
  if (part('weekday') !== 'Sat' || part('hour') !== '10') return res.status(200).json({ok:true,skipped:true,reason:'Fuera de horario de Madrid'});
  const day = new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
  const scheduledFor = day + 'T10:00:00';
  const response = await fetch(target, {method:'POST',headers:{'content-type':'application/json','x-curo-agenda-secret':secret},body:JSON.stringify({automationId:'3',event:'prepare',scheduledFor})});
  const result = await response.json().catch(()=>({}));
  return res.status(response.ok?200:502).json({ok:response.ok,manager:result});
};
