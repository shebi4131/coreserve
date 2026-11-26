import {has,need,deny} from './access.mjs';
export function coordinates(b){
 const {lat,lng,accuracy}=b;
 if(typeof lat!=='number'||!Number.isFinite(lat)||lat < -90||lat > 90||typeof lng!=='number'||!Number.isFinite(lng)||lng < -180||lng > 180||typeof accuracy!=='number'||!Number.isFinite(accuracy)||accuracy<0||accuracy>100000)deny('Invalid device location.',400);
 const timestamp=Date.parse(b.captured);
 if(!Number.isFinite(timestamp)||Math.abs(Date.now()-timestamp)>120000)deny('Location is stale. Request a fresh position.',400);
 return {lat,lng,accuracy,captured:new Date(timestamp).toISOString()};
}
export async function tracking(req,env,u,{path,method,body,one,json,cors,audit}){
 if(!path.startsWith('/api/tracking'))return null;
 const now=()=>new Date().toISOString();
 if(path==='/api/tracking'&&method==='GET'){
  const rows=(await env.DB.prepare('SELECT t.*,users.name FROM tracking_sessions t JOIN users ON users.id=t.user_id WHERE t.started>? ORDER BY t.updated DESC LIMIT 300').bind(new Date(Date.now()-86400000).toISOString()).all()).results;
  const accessible=[];
  for(const row of rows){
   if(row.user_id===u.id){accessible.push(row);continue;}
   if(!has(u,'locations.view'))continue;
   const job=await one(env,row.job_id,'jobs');
   if(job&&(has(u,'locations.view_all')||job.cleaner===u.id||job.supervisor===u.id))accessible.push(row);
  }
  return json({sessions:accessible,serverTime:now()},200,cors);
 }
 const b=await body(req);
 if(path==='/api/tracking/start'&&method==='POST'){
  need(u,'locations.track');need(u,'jobs.view');
  const job=await one(env,b.jobId,'jobs');
  if(!job||![job.cleaner,job.supervisor].includes(u.id))deny('Location sharing is only available on your assigned jobs.');
  if(job.status!=='In progress')deny('Start the job before sharing your location.',400);
  const c=coordinates(b),date=now(),key=crypto.randomUUID();
  await env.DB.batch([
   env.DB.prepare('UPDATE tracking_sessions SET stopped=? WHERE user_id=? AND stopped IS NULL').bind(date,u.id),
   env.DB.prepare('INSERT INTO tracking_sessions(id,user_id,job_id,started,updated,lat,lng,accuracy,captured) VALUES(?,?,?,?,?,?,?,?,?)').bind(key,u.id,job.id,date,date,c.lat,c.lng,c.accuracy,c.captured),
   env.DB.prepare('DELETE FROM tracking_sessions WHERE updated<?').bind(new Date(Date.now()-30*86400000).toISOString()),
  ]);
  await audit(env,u,'Started location sharing',job.id);
  return json({sessionId:key,jobId:job.id,started:date},201,cors);
 }
 if(path==='/api/tracking/ping'&&method==='POST'){
  need(u,'locations.track');need(u,'jobs.view');
  const session=await env.DB.prepare('SELECT * FROM tracking_sessions WHERE id=? AND user_id=? AND stopped IS NULL').bind(String(b.sessionId||''),u.id).first();
  if(!session)deny('Location sharing has ended. Start it again to continue.',409);
  const job=await one(env,session.job_id,'jobs');
  if(!job||![job.cleaner,job.supervisor].includes(u.id)||job.status!=='In progress'||Date.now()-Date.parse(session.started)>8*3600000){await env.DB.prepare('UPDATE tracking_sessions SET stopped=? WHERE id=?').bind(now(),session.id).run();deny('Sharing ended because the job or assignment changed.',409);}
  const c=coordinates(b);
  if(Date.parse(c.captured)<Date.parse(session.captured))deny('An older position was ignored.',409);
  await env.DB.prepare('UPDATE tracking_sessions SET updated=?,lat=?,lng=?,accuracy=?,captured=? WHERE id=? AND stopped IS NULL').bind(now(),c.lat,c.lng,c.accuracy,c.captured,session.id).run();
  return json({ok:true},200,cors);
 }
 if(path==='/api/tracking/stop'&&method==='POST'){
  await env.DB.prepare('UPDATE tracking_sessions SET stopped=? WHERE id=? AND user_id=? AND stopped IS NULL').bind(now(),String(b.sessionId||''),u.id).run();
  await audit(env,u,'Stopped location sharing');return json({ok:true},200,cors);
 }
 deny('Tracking endpoint not found.',404);
}
