import {operations,redact,normalizeOperation,directoryAssignment} from './operations.mjs';
import {has,need,hydrate,getRoles,validateRole,grantable} from './access.mjs';
import {tracking,coordinates} from './tracking.mjs';
const enc = new TextEncoder();
const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const hex = b => [...new Uint8Array(b)].map(n=>n.toString(16).padStart(2,'0')).join('');
const unhex = s => Uint8Array.from(s.match(/.{2}/g)||[],x=>parseInt(x,16));
const digest = async s=>hex(await crypto.subtle.digest('SHA-256',enc.encode(s)));
async function hash(password,salt=hex(crypto.getRandomValues(new Uint8Array(16)))) { const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']); return `${salt}:${hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:unhex(salt),iterations:100000,hash:'SHA-256'},key,256))}`; }
async function verify(p,h){const a=await hash(p,h.split(':')[0]);let d=a.length^h.length;for(let i=0;i<h.length;i++)d|=h.charCodeAt(i)^(a.charCodeAt(i)||0);return d===0;}
function fail(message,status=400){throw Object.assign(new Error(message),{status});}
function text(v,max=500){return typeof v==='string'?v.trim().slice(0,max):'';}
function password(v){if(typeof v!=='string'||v.length<10||v.length>128)fail('Use a password between 10 and 128 characters.');return v;}
function email(v){const e=text(v,254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))fail('Enter a valid email address.');return e;}
const safeUser=u=>({id:u.id,name:u.name,email:u.email,role:u.role,roleId:u.roleId,permissions:u.permissions,owner:u.owner,status:u.status,profile:JSON.parse(u.profile||'{}')});
const canJob=(u,j)=>has(u,'jobs.view_all')||j.cleaner===u.id||j.supervisor===u.id;
const parse=r=>r?{...JSON.parse(r.data),id:r.id,version:r.version}:null;
const json=(data,status=200,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
async function audit(env,u,action,r=''){await env.DB.prepare('INSERT INTO audit VALUES(?,?,?,?,?)').bind(id(),u.id,action,r,now()).run();}
async function all(env,kind){return (await env.DB.prepare('SELECT * FROM records WHERE kind=? ORDER BY updated DESC').bind(kind).all()).results.map(parse);}
async function one(env,key,kind){return parse(await env.DB.prepare('SELECT * FROM records WHERE id=? AND kind=?').bind(key,kind).first());}
async function save(env,kind,data,key=null,version=0){const date=now();if(!key){key=id();await env.DB.prepare('INSERT INTO records VALUES(?,?,?,1,?,?)').bind(key,kind,JSON.stringify(data),date,date).run();}else{const r=await env.DB.prepare('UPDATE records SET data=?,version=version+1,updated=? WHERE id=? AND kind=? AND version=?').bind(JSON.stringify(data),date,key,kind,version).run();if(!r.meta.changes)fail('This record changed. Refresh and try again.',409);}return one(env,key,kind);}
async function sessionUser(req,env){const raw=req.headers.get('Cookie')?.match(/(?:^|;\s*)crm_session=([^;]+)/)?.[1];if(!raw)return null;return hydrate(env,await env.DB.prepare('SELECT users.* FROM sessions JOIN users ON users.id=sessions.user_id WHERE token=? AND expires>? AND status=\'Active\'').bind(await digest(raw),Date.now()).first());}
async function limitedBytes(req,max){if(Number(req.headers.get('Content-Length'))>max)fail('Request is too large.',413);const reader=req.body?.getReader();if(!reader)return new Uint8Array();const chunks=[];let total=0;while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>max){await reader.cancel();fail('Request is too large.',413);}chunks.push(value);}const bytes=new Uint8Array(total);let pos=0;for(const c of chunks){bytes.set(c,pos);pos+=c.length;}return bytes;}
async function body(req){const bytes=await limitedBytes(req,65536);try{return JSON.parse(new TextDecoder().decode(bytes));}catch{fail('Invalid request body.');}}
async function publicLimit(req,env){const key=await digest('public|'+(req.headers.get('CF-Connecting-IP')||'local'));const r=await env.DB.prepare('SELECT * FROM attempts WHERE id=?').bind(key).first();if(r?.expires>Date.now()&&r.count>=20)fail('Too many requests. Please try again later.',429);await env.DB.prepare('INSERT INTO attempts VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN expires<? THEN 1 ELSE count+1 END,expires=CASE WHEN expires<? THEN excluded.expires ELSE expires END').bind(key,Date.now()+900000,Date.now(),Date.now()).run();}
async function requireJob(env,u,key){const job=await one(env,key,'jobs');if(!job||!canJob(u,job))fail('Job not found or access denied.',404);return job;}
function cookie(req,value,max=604800){return `crm_session=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${max}${new URL(req.url).protocol==='https:'?'; Secure':''}`;}
export default {async fetch(req,env){
 const url=new URL(req.url),path=url.pathname.replace(/\/$/,''),method=req.method;
 const origin=req.headers.get('Origin');const local=['http://localhost:3002','http://127.0.0.1:3002'];
 const allowedOrigin=origin&&(origin===url.origin||origin===env.APP_ORIGIN||(url.hostname==='localhost'||url.hostname==='127.0.0.1')&&local.includes(origin));
 const cors=allowedOrigin?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Credentials':'true','Vary':'Origin'}:{};
 try{
  if(!path.startsWith('/api'))return env.ASSETS.fetch(req);
  if(method==='OPTIONS')return new Response(null,{headers:{...cors,'Access-Control-Allow-Headers':'Content-Type,X-CRM-Request','Access-Control-Allow-Methods':'GET,POST,PATCH,DELETE'}});
  if(method!=='GET'&&(!allowedOrigin||req.headers.get('X-CRM-Request')!=='1'))fail('Request origin rejected.',403);
  if(method==='POST'&&['/api/signup','/api/reset-request'].includes(path))await publicLimit(req,env);
  if(method==='POST'&&path==='/api/signup'){
   const b=await body(req),e=email(b.email),p=password(b.password),name=text(b.name,100);if(!name)fail('Name is required.');
   if(e===env.SUPERADMIN_EMAIL)fail('This account is reserved.');
   if(!await env.DB.prepare('SELECT id FROM users WHERE email=?').bind(e).first())await env.DB.prepare('INSERT INTO users(id,email,name,password,role,status,created) VALUES(?,?,?,?,?,?,?)').bind(id(),e,name,await hash(p),'Cleaner','Pending',now()).run();
   return json({message:'Your account request has been received. A manager must activate your account before you can sign in.'},200,cors);
  }
  if(method==='POST'&&path==='/api/login'){
   const b=await body(req),e=email(b.email),p=typeof b.password==='string'?b.password.slice(0,128):'',key=await digest(e+'|'+(req.headers.get('CF-Connecting-IP')||'local'));
   const attempt=await env.DB.prepare('SELECT * FROM attempts WHERE id=?').bind(key).first();if(attempt?.expires>Date.now()&&attempt.count>=5)fail('Too many attempts. Try again in 15 minutes.',429);
   await env.DB.prepare('INSERT INTO attempts VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN expires<? THEN 1 ELSE count+1 END,expires=CASE WHEN expires<? THEN excluded.expires ELSE expires END').bind(key,Date.now()+900000,Date.now(),Date.now()).run();
   let u=await env.DB.prepare('SELECT * FROM users WHERE email=?').bind(e).first();
   if(!u||!await verify(p,u.password))fail('Email or password is incorrect.',401);if(u.status!=='Active')fail('Your account is awaiting activation or has been suspended.',403);
   await env.DB.prepare('DELETE FROM attempts WHERE id=?').bind(key).run();const token=hex(crypto.getRandomValues(new Uint8Array(32)));
   await env.DB.prepare('INSERT INTO sessions VALUES(?,?,?)').bind(await digest(token),u.id,Date.now()+604800000).run();await audit(env,u,'Signed in');return json({user:safeUser(await hydrate(env,u))},200,{...cors,'Set-Cookie':cookie(req,token)});
  }
  if(path==='/api/reset-request'&&method==='POST'){await body(req);return json({message:'Please contact your CoreServe administrator for a one-time password reset link. Automated email delivery is not configured.'},200,cors);}
  if(path==='/api/reset'&&method==='POST'){const b=await body(req),r=await env.DB.prepare('SELECT * FROM reset_tokens WHERE token=? AND expires>?').bind(await digest(text(b.token,100)),Date.now()).first();if(!r)fail('Reset link has expired or is invalid.');await env.DB.batch([env.DB.prepare('UPDATE users SET password=? WHERE id=?').bind(await hash(password(b.password)),r.user_id),env.DB.prepare('DELETE FROM reset_tokens WHERE user_id=?').bind(r.user_id),env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(r.user_id),env.DB.prepare('UPDATE tracking_sessions SET stopped=? WHERE user_id=? AND stopped IS NULL').bind(now(),r.user_id)]);return json({message:'Password changed. Sign in with your new password.'},200,cors);}
  const u=await sessionUser(req,env);if(path==='/api/me'&&method==='GET')return json({user:u?safeUser(u):null},200,cors);if(!u)fail('Please sign in.',401);
  if(path==='/api/logout'&&method==='POST'){const raw=req.headers.get('Cookie')?.match(/crm_session=([^;]+)/)?.[1];await env.DB.batch([env.DB.prepare('DELETE FROM sessions WHERE token=?').bind(await digest(raw||'')),env.DB.prepare('UPDATE tracking_sessions SET stopped=? WHERE user_id=? AND stopped IS NULL').bind(now(),u.id)]);return json({ok:true},200,{...cors,'Set-Cookie':cookie(req,'',0)});}
  if(path==='/api/profile'&&method==='PATCH'){const b=await body(req),name=text(b.name,100);if(!name)fail('Name is required.');const profile=JSON.stringify({coverage:text(b.coverage,500),travel:text(b.travel,300),availability:text(b.availability,1000)});if(b.newPassword){if(!await verify(typeof b.currentPassword==='string'?b.currentPassword:'',u.password))fail('Current password is incorrect.');await env.DB.batch([env.DB.prepare('UPDATE users SET password=?,name=?,profile=? WHERE id=?').bind(await hash(password(b.newPassword)),name,profile,u.id),env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(u.id),env.DB.prepare('UPDATE tracking_sessions SET stopped=? WHERE user_id=? AND stopped IS NULL').bind(now(),u.id)]);await audit(env,u,'Changed password');return json({reauth:true},200,{...cors,'Set-Cookie':cookie(req,'',0)});}await env.DB.prepare('UPDATE users SET name=?,profile=? WHERE id=?').bind(name,profile,u.id).run();return json({user:safeUser({...u,name,profile})},200,cors);}
  if(path==='/api/state'&&method==='GET'){
   const jobs=has(u,'jobs.view')?(await all(env,'jobs')).filter(j=>canJob(u,j)).map(j=>redact(u,j,'jobs')):[];
   const ids=new Set(jobs.map(j=>j.id));
   const locationJobs=(await all(env,'jobs')).filter(j=>has(u,'locations.view_all')||j.cleaner===u.id||j.supervisor===u.id);
   const result={jobs,customers:has(u,'customers.view')?await all(env,'customers'):[],properties:has(u,'properties.view')?await all(env,'properties'):[],enquiries:has(u,'enquiries.view')?(await all(env,'enquiries')).map(r=>redact(u,r,'enquiries')):[],evidence:has(u,'evidence.view')?(await all(env,'evidence')).filter(e=>ids.has(e.jobId)):[],issues:(await all(env,'issues')).filter(e=>ids.has(e.jobId)),locations:has(u,'locations.view')?(await all(env,'locations')).filter(e=>locationJobs.some(j=>j.id===e.jobId)):[]};
   const rawUsers=(await env.DB.prepare('SELECT * FROM users').all()).results;
   const users=await Promise.all(rawUsers.map(async p=>safeUser(await hydrate(env,p))));
   result.team=has(u,'team.view')||has(u,'users.manage')||has(u,'jobs.assign')?users:users.filter(p=>p.id===u.id||jobs.some(j=>j.cleaner===p.id||j.supervisor===p.id)).map(p=>({id:p.id,name:p.name,role:p.role,roleId:p.roleId,status:p.status}));
   result.cleaners=has(u,'cleaners.view')?(await all(env,'cleaners')).map(r=>redact(u,r,'cleaners')):has(u,'jobs.assign')?(await all(env,'cleaners')).map(r=>({id:r.id,name:r.name,phone:r.phone,cleanerStatus:r.cleanerStatus})):[];
   result.agents=has(u,'agents.view')?await all(env,'agents'):[];
   for(const kind of ['services','propertyTypes','areas'])result[kind]=has(u,'catalog.view')||has(u,'jobs.create')||has(u,'jobs.edit')||has(u,'enquiries.view')?await all(env,kind):[];
   result.roles=has(u,'roles.manage')||has(u,'users.manage')?await getRoles(env):[];
   result.audit=(await env.DB.prepare('SELECT audit.*, users.name FROM audit JOIN users ON actor=users.id ORDER BY created DESC LIMIT 100').all()).results.filter(a=>has(u,'jobs.view_all')||a.actor===u.id||ids.has(a.record_id));
   return json(result,200,cors);
  }
  if(path==='/api/roles'&&method==='GET'){need(u,'roles.manage');return json({roles:await getRoles(env)},200,cors);}
  if(path.match(/^\/api\/roles(?:\/[^/]+)?$/)&&['POST','PATCH','DELETE'].includes(method)){
   need(u,'roles.manage');const key=path.split('/')[3],roles=await getRoles(env),role=roles.find(r=>r.id===key);
   if(key&&!role)fail('Role not found.',404);if(role)grantable(u,role);
   if(method==='DELETE'){
    if(!role)fail('Select a role.');
    if(['superadmin','cleaner'].includes(key))fail('This default role is needed for owner access or new signups. Edit its permissions instead.');
    if(await env.DB.prepare('SELECT id FROM users WHERE COALESCE(role_key,lower(role))=? LIMIT 1').bind(key).first())fail('Reassign users before deleting this role.',409);
    await env.DB.prepare('DELETE FROM roles WHERE id=?').bind(key).run();await audit(env,u,'Deleted role: '+role.name,key);return json({ok:true},200,cors);
   }
   const b=await body(req),data=validateRole(u,b);
   if(roles.some(r=>r.id!==key&&r.name.toLowerCase()===data.name.toLowerCase()))fail('A role with this name already exists.',409);
   if(key){
    const result=await env.DB.prepare('UPDATE roles SET name=?,permissions=?,version=version+1 WHERE id=? AND version=?').bind(data.name,JSON.stringify(data.permissions),key,Number(b.version)||0).run();
    if(!result.meta.changes)fail('This role changed. Refresh before saving.',409);
    await env.DB.batch([
     env.DB.prepare('DELETE FROM sessions WHERE user_id IN (SELECT id FROM users WHERE COALESCE(role_key,lower(role))=? AND email<>?)').bind(key,env.SUPERADMIN_EMAIL),
     env.DB.prepare('UPDATE tracking_sessions SET stopped=? WHERE user_id IN (SELECT id FROM users WHERE COALESCE(role_key,lower(role))=?) AND stopped IS NULL').bind(now(),key),
    ]);
   }else{const newRoleId=id();await env.DB.prepare('INSERT INTO roles(id,name,permissions) VALUES(?,?,?)').bind(newRoleId,data.name,JSON.stringify(data.permissions)).run();await audit(env,u,'Created role: '+data.name,newRoleId);return json({ok:true},201,cors);}
   await audit(env,u,'Updated role: '+data.name,key);return json({ok:true},key?200:201,cors);
  }
  if(path.startsWith('/api/users/')&&method==='PATCH'){
   need(u,'users.manage');const key=path.split('/')[3],b=await body(req),target=await env.DB.prepare('SELECT * FROM users WHERE id=?').bind(key).first();
   if(!target)fail('Account not found.',404);if(target.email===env.SUPERADMIN_EMAIL)fail('The owner account retains Superadmin access.');
   grantable(u,await hydrate(env,target));
   const role=(await getRoles(env)).find(r=>r.id===b.roleId||!b.roleId&&r.name===b.role);if(!role||!['Active','Pending','Suspended'].includes(b.status))fail('Invalid role or status.');grantable(u,role);
   await env.DB.batch([env.DB.prepare('UPDATE users SET role_key=?,status=? WHERE id=?').bind(role.id,b.status,key),env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(key),env.DB.prepare('UPDATE tracking_sessions SET stopped=? WHERE user_id=? AND stopped IS NULL').bind(now(),key)]);
   await audit(env,u,'Changed account access',key);return json({ok:true},200,cors);
  }
  const operationResult=await operations(req,env,u,{path,method,body,all,one,save,audit,json,cors,canJob});if(operationResult)return operationResult;
  const tracked=await tracking(req,env,u,{path,method,body,one,json,cors,audit});if(tracked)return tracked;
  if(path==='/api/reset-link'&&method==='POST'){
   need(u,'users.manage');const b=await body(req),target=await env.DB.prepare('SELECT * FROM users WHERE id=?').bind(text(b.userId)).first();if(!target)fail('Account not found.');if(target.email===env.SUPERADMIN_EMAIL&&!u.owner)fail('Only the owner may reset this account.',403);grantable(u,await hydrate(env,target));const token=hex(crypto.getRandomValues(new Uint8Array(32)));await env.DB.batch([env.DB.prepare('DELETE FROM reset_tokens WHERE user_id=?').bind(target.id),env.DB.prepare('INSERT INTO reset_tokens VALUES(?,?,?)').bind(await digest(token),target.id,Date.now()+1800000)]);await audit(env,u,'Issued password reset',target.id);return json({url:`${env.APP_ORIGIN}/forgot-password/?token=${token}`},200,cors);
  }
  if(path.startsWith('/api/media/')&&method==='GET'){need(u,'evidence.view');need(u,'jobs.view');const key=path.split('/')[3],e=await one(env,key,'evidence');if(!e)fail('Photo not found.',404);await requireJob(env,u,e.jobId);const file=await env.MEDIA.get(e.key);if(!file)fail('Photo not found.',404);return new Response(file.body,{headers:{...cors,'Content-Type':e.mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}
  if(path.startsWith('/api/jobs/')&&path.endsWith('/photos')&&method==='POST'){
   need(u,'evidence.upload');need(u,'evidence.view');need(u,'jobs.view');const job=await requireJob(env,u,path.split('/')[3]);if(job.status==='Completed')fail('Completed jobs are locked.');const payload=await limitedBytes(req,6*1024*1024);const form=await new Response(payload,{headers:{'Content-Type':req.headers.get('Content-Type')||''}}).formData(),file=form.get('file');if(!file||file.size>5*1024*1024)fail('Choose an image under 5 MB.');const bytes=new Uint8Array(await file.arrayBuffer());const mime=bytes[0]===255&&bytes[1]===216?'image/jpeg':bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71?'image/png':String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP'?'image/webp':null;if(!mime)fail('Only JPG, PNG and WebP images are supported.');if((await all(env,'evidence')).filter(e=>e.jobId===job.id).length>=30)fail('Maximum 30 photos per job.');const key=`jobs/${job.id}/${id()}`;await env.MEDIA.put(key,bytes,{httpMetadata:{contentType:mime}});const e=await save(env,'evidence',{jobId:job.id,key,name:text(file.name,150),mime,stage:['Before','After'].includes(form.get('stage'))?form.get('stage'):'After',created:now(),actor:u.id});await audit(env,u,'Uploaded job evidence',job.id);return json(e,201,cors);
  }
  const match=path.match(/^\/api\/records\/(jobs|customers|properties|enquiries|issues|locations)(?:\/([^/]+))?$/);
  if(match&&['POST','PATCH','DELETE'].includes(method)){
   const [,kind,key]=match;if(method==='POST'&&key||method!=='POST'&&!key)fail('Invalid record URL.');const b=method==='DELETE'?{}:await body(req),existing=key?await one(env,key,kind):null;if(key&&!existing)fail('Record not found.',404);
   let data;
   if(kind==='jobs'){
    need(u,'jobs.view');if(!key)need(u,'jobs.create');if(method==='DELETE'){need(u,'jobs.delete');if(!existing||!canJob(u,existing))fail('Access denied.',403);await env.DB.batch([env.DB.prepare('DELETE FROM records WHERE id=? AND kind=?').bind(key,kind),env.DB.prepare('UPDATE tracking_sessions SET stopped=? WHERE job_id=? AND stopped IS NULL').bind(now(),key)]);await audit(env,u,'Deleted jobs',key);return json({ok:true},200,cors);}if(existing&&!canJob(u,existing))fail('Access denied.',403);if(existing&&method!=='DELETE'&&!has(u,'jobs.edit')&&!has(u,'jobs.work')&&!has(u,'jobs.review')&&!has(u,'jobs.assign'))fail('Job update permission required.',403);
    const status=['Unassigned','Assigned','In progress','Awaiting review','Completed','Cancelled','Re-clean requested'].includes(b.status)?b.status:existing?.status||'Unassigned';
    if(!has(u,'jobs.edit')&&existing){const permitted=has(u,'jobs.work')?['In progress','Awaiting review',...(has(u,'jobs.review')?['Completed']:[])]:has(u,'jobs.review')?['Completed']:[];if(status!==existing.status&&!permitted.includes(status))fail('Status change not permitted.',403);if(['Completed','Cancelled'].includes(existing.status))fail('Completed or cancelled jobs are locked.');if(status==='Completed'&&existing.status!=='Awaiting review')fail('Only reviewed jobs can be completed.');}
    if(status==='Completed'&&(!existing||existing.status!=='Awaiting review'||!has(u,'jobs.review')))fail('A supervisor must review a submitted job before completion.',403);
    if(status==='Awaiting review'){if(!Array.isArray(b.checklist)||b.checklist.length!==6||!b.checklist.every(x=>x===true))fail('Complete all six checklist items.');if(!(await all(env,'evidence')).some(e=>e.jobId===key&&(!existing?.reviewCycleAt||e.created>=existing.reviewCycleAt)))fail('Upload job evidence before submitting.');}
    const assignment=await directoryAssignment(env,u,b,existing,one);if('cleaner' in b)b.cleaner=assignment.cleaner;
    const fields=['title','service','customer','address','postcode','date','time','end','rooms','notes','cleaner','supervisor'];data=existing?{...existing}:{};for(const field of fields)if(field in b){const permitted=['cleaner','supervisor'].includes(field)?has(u,'jobs.assign'):has(u,'jobs.edit')||!key&&has(u,'jobs.create');if(permitted)data[field]=text(b[field],field==='notes'?2000:300);else if(String(b[field]||'')!==String(existing?.[field]||''))fail('You cannot edit '+field+'.',403);}delete data.id;delete data.version;
    if(!text(data.title)||!text(data.address)||!/^\d{4}-\d{2}-\d{2}$/.test(data.date||''))fail('Job title, address and date are required.');
    for(const field of ['cleaner','supervisor'])if(data[field]){const target=await hydrate(env,await env.DB.prepare('SELECT * FROM users WHERE id=?').bind(data[field]).first());if(!target||target.status!=='Active'||!has(target,'jobs.view')||!has(target,field==='cleaner'?'jobs.work':'jobs.review'))fail('Select an active team member with the required work or review permission.');}
    data.status=status;data=normalizeOperation('jobs',b,data,u);data.cleanerProfileId=assignment.cleanerProfileId;
    data.status=status;if(status==='Completed'&&existing?.status!=='Completed')data.completionDate=now().slice(0,10);const list=Array.isArray(b.checklist)&&b.checklist.length===6?b.checklist.map(Boolean):data.checklist||Array(6).fill(false);if(existing&&JSON.stringify(list)!==JSON.stringify(existing.checklist)&&!has(u,'jobs.work'))fail('Checklist permission required.',403);data.checklist=list;if(status==='Re-clean requested'&&existing?.status!=='Re-clean requested'){data.checklist=Array(6).fill(false);data.reviewCycleAt=now();}if(status==='Cancelled')data.leadStatus='Lost';if(!data.cleaner&&!data.cleanerProfileId&&status==='Assigned')data.status='Unassigned';
   }else if(['issues','locations'].includes(kind)){
    if(method!=='POST')fail('These entries cannot be changed or deleted.',403);need(u,'jobs.view');need(u,kind==='locations'?'locations.track':'jobs.work');const job=await requireJob(env,u,text(b.jobId||existing?.jobId));if(kind==='locations'){if(![job.cleaner,job.supervisor].includes(u.id))fail('Check-ins are only available on your assigned jobs.',403);const c=coordinates(b);data={jobId:job.id,...c,actor:u.id,created:now(),action:b.action==='Check out'?'Check out':'Check in'};if(data.action==='Check out')await env.DB.prepare('UPDATE tracking_sessions SET stopped=? WHERE user_id=? AND job_id=? AND stopped IS NULL').bind(now(),u.id,job.id).run();}else{if(!text(b.title))fail('An issue title is required.');data={jobId:job.id,title:text(b.title),details:text(b.details,2000),actor:u.id,created:now()};}
   }else{
    need(u,kind+'.view');need(u,kind+'.'+(method==='POST'?'create':method==='DELETE'?'delete':'edit'));if(method!=='DELETE'&&!text(b.name))fail('Name is required.');data={name:text(b.name,200),details:text(b.details,2000),email:text(b.email,254),phone:text(b.phone,40),address:text(b.address),stage:['New enquiry','Quote sent','Follow-up','Booked'].includes(b.stage)?b.stage:'New enquiry'};
   }
   if(method==='DELETE'){await env.DB.prepare('DELETE FROM records WHERE id=? AND kind=?').bind(key,kind).run();if(kind==='jobs')await env.DB.prepare('UPDATE tracking_sessions SET stopped=? WHERE job_id=? AND stopped IS NULL').bind(now(),key).run();await audit(env,u,'Deleted '+kind,key);return json({ok:true},200,cors);}
   const record=await save(env,kind,data,key,b.version||0);if(kind==='jobs')await env.DB.prepare("UPDATE tracking_sessions SET stopped=? WHERE job_id=? AND stopped IS NULL AND (?<>'In progress' OR user_id NOT IN (?,?))").bind(now(),record.id,record.status,record.cleaner||'',record.supervisor||'').run();await audit(env,u,(key?'Updated ':'Created ')+kind,record.id);return json(redact(u,record,kind),key?200:201,cors);
  }
  fail('Endpoint not found.',404);
 }catch(e){if(!e.status)console.error('CRM request failed',e.message);return json({error:e.status?e.message:'The request could not be completed. Please try again.'},e.status||500,cors);}
},async scheduled(event,env,ctx){ctx.waitUntil(env.DB.batch([
 env.DB.prepare('DELETE FROM tracking_sessions WHERE updated<?').bind(new Date(Date.now()-30*86400000).toISOString()),
 env.DB.prepare('UPDATE tracking_sessions SET stopped=? WHERE stopped IS NULL AND started<?').bind(now(),new Date(Date.now()-8*3600000).toISOString()),
 env.DB.prepare('DELETE FROM sessions WHERE expires<?').bind(Date.now()),
 env.DB.prepare('DELETE FROM reset_tokens WHERE expires<?').bind(Date.now()),
 env.DB.prepare('DELETE FROM attempts WHERE expires<?').bind(Date.now()),
]));}};
