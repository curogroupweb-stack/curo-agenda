// Agenda CURO -> Automation Manager. Invoked by Vercel cron.
// Accepts only a scheduled Saturday at 10:00 Europe/Madrid.
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ok:false});
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.authorization !== 'Bearer ' + cronSecret) return res.status(401).json({ok:false});
  const target = process.env.CURO_AUTOMATION_MANAGER_BRIDGE_URL;
  const secret = process.env.CURO_BRIDGE_SECRET;
  if (!target || !secret) return res.status(503).json({ok:false,error:'Conexión sin configurar'});
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',weekday:'short',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(now);
  const p = key => parts.find(x=>x.type===key)?.value;
  const test = req.query && req.query.test === '1';
  if (!test && (p('weekday')!=='Sat' || p('hour')!=='10')) return res.status(200).json({ok:true,skipped:true});
  const day = p('year')+'-'+p('month')+'-'+p('day');
  try {
    const response = await fetch(target,{method:'POST',headers:{'content-type':'application/json','x-curo-agenda-secret':secret},body:JSON.stringify({automationId:'3',event:'prepare',scheduledFor:day+'T10:00:00',scheduleDate:day})});
    const result = await response.json().catch(()=>({}));
    return res.status(response.ok?200:502).json({ok:response.ok,test,manager:result});
  } catch { return res.status(502).json({ok:false,error:'No se pudo contactar Automation Manager'}); }
};
