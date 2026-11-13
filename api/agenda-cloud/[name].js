// Server-only Supabase gateway. Preview access is protected by Vercel Authentication.
// Never expose AGENDA_CLAVE or permit arbitrary RPC names.
const SB='https://llugctysxrkqpydyhnvw.supabase.co';
const KEY='sb_publishable_RPo3-Vb7rZ9A7R1dXsH11Q_h5iKXT64';
const ALLOWED=new Set(['agenda_cargar','agenda_guardar_tareas','agenda_borrar_tareas','agenda_guardar_bandeja']);
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 if(!process.env.AGENDA_CLAVE)return res.status(503).json({error:'Cloud configuration unavailable'});
 const name=req.query?.name;
 if(!ALLOWED.has(name))return res.status(404).json({error:'Unknown operation'});
 try{
  const input=typeof req.body==='object'&&req.body!==null?req.body:{};
  const {p_clave,...args}=input;
  const upstream=await fetch(SB+'/rest/v1/rpc/'+name,{
   method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},
   body:JSON.stringify({...args,p_clave:process.env.AGENDA_CLAVE})
  });
  const body=await upstream.text();
  res.status(upstream.status).setHeader('Content-Type','application/json; charset=utf-8').send(body||'null');
 }catch(e){res.status(502).json({error:'Cloud service unavailable'})}
};