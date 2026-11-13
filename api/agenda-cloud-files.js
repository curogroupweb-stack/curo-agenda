const SB='https://llugctysxrkqpydyhnvw.supabase.co';
const KEY='sb_publishable_RPo3-Vb7rZ9A7R1dXsH11Q_h5iKXT64';
const ALLOWED=new Set(['subir','ver','borrar']);
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 if(!process.env.AGENDA_CLAVE)return res.status(503).json({error:'Cloud configuration unavailable'});
 const input=req.body&&typeof req.body==='object'?req.body:{};
 const {clave,accion,...extra}=input;
 if(!ALLOWED.has(accion))return res.status(400).json({error:'Invalid action'});
 try{
  const upstream=await fetch(SB+'/functions/v1/agenda-archivos',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({...extra,accion,clave:process.env.AGENDA_CLAVE})});
  const result=await upstream.text();
  res.status(upstream.status).setHeader('Content-Type','application/json; charset=utf-8').send(result||'{}');
 }catch(e){res.status(502).json({error:'Cloud service unavailable'})}
};