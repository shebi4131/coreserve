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
const safeUser=u=>({id:u.id,name:u.name,email:u.email,role:u.role,status:u.status,profile:JSON.parse(u.profile||'{}')});
const managers=['Superadmin','Manager'];
const isManager=u=>managers.includes(u.role);
const canJob=(u,j)=>isManager(u)||j.cleaner===u.id||u.role==='Supervisor'&&j.supervisor===u.id;
const parse=r=>r?{...JSON.parse(r.data),id:r.id,version:r.version}:null;
const json=(data,status=200,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
async function audit(env,u,action,r=''){await env.DB.prepare('INSERT INTO audit VALUES(?,?,?,?,?)').bind(id(),u.id,action,r,now()).run();}
async function all(env,kind){return (await env.DB.prepare('SELECT * FROM records WHERE kind=? ORDER BY updated DESC').bind(kind).all()).results.map(parse);}
async function one(env,key,kind){return parse(await env.DB.prepare('SELECT * FROM records WHERE id=? AND kind=?').bind(key,kind).first());}
async function save(env,kind,data,key=null,version=0){const date=now();if(!key){key=id();await env.DB.prepare('INSERT INTO records VALUES(?,?,?,1,?,?)').bind(key,kind,JSON.stringify(data),date,date).run();}else{const r=await env.DB.prepare('UPDATE records SET data=?,version=version+1,updated=? WHERE id=? AND kind=? AND version=?').bind(JSON.stringify(data),date,key,kind,version).run();if(!r.meta.changes)fail('This record changed. Refresh and try again.',409);}return one(env,key,kind);}
async function sessionUser(req,env){const raw=req.headers.get('Cookie')?.match(/(?:^|;\s*)crm_session=([^;]+)/)?.[1];if(!raw)return null;return env.DB.prepare('SELECT users.* FROM sessions JOIN users ON users.id=sessions.user_id WHERE token=? AND expires>? AND status=\'Active\'').bind(await digest(raw),Date.now()).first();}
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
   await env.DB.prepare('INSERT INTO sessions VALUES(?,?,?)').bind(await digest(token),u.id,Date.now()+604800000).run();await audit(env,u,'Signed in');return json({user:safeUser(u)},200,{...cors,'Set-Cookie':cookie(req,token)});
  }
  if(path==='/api/reset-request'&&method==='POST'){await body(req);return json({message:'Please contact your CoreServe administrator for a one-time password reset link. Automated email delivery is not configured.'},200,cors);}
  if(path==='/api/reset'&&method==='POST'){const b=await body(req),r=await env.DB.prepare('SELECT * FROM reset_tokens WHERE token=? AND expires>?').bind(await digest(text(b.token,100)),Date.now()).first();if(!r)fail('Reset link has expired or is invalid.');await env.DB.batch([env.DB.prepare('UPDATE users SET password=? WHERE id=?').bind(await hash(password(b.password)),r.user_id),env.DB.prepare('DELETE FROM reset_tokens WHERE user_id=?').bind(r.user_id),env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(r.user_id)]);return json({message:'Password changed. Sign in with your new password.'},200,cors);}
  const u=await sessionUser(req,env);if(path==='/api/me'&&method==='GET')return json({user:u?safeUser(u):null},200,cors);if(!u)fail('Please sign in.',401);
  if(path==='/api/logout'&&method==='POST'){const raw=req.headers.get('Cookie')?.match(/crm_session=([^;]+)/)?.[1];await env.DB.prepare('DELETE FROM sessions WHERE token=?').bind(await digest(raw||'')).run();return json({ok:true},200,{...cors,'Set-Cookie':cookie(req,'',0)});}
  if(path==='/api/profile'&&method==='PATCH'){const b=await body(req),name=text(b.name,100);if(!name)fail('Name is required.');const profile=JSON.stringify({coverage:text(b.coverage,500),travel:text(b.travel,300),availability:text(b.availability,1000)});if(b.newPassword){if(!await verify(typeof b.currentPassword==='string'?b.currentPassword:'',u.password))fail('Current password is incorrect.');await env.DB.batch([env.DB.prepare('UPDATE users SET password=?,name=?,profile=? WHERE id=?').bind(await hash(password(b.newPassword)),name,profile,u.id),env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(u.id)]);await audit(env,u,'Changed password');return json({reauth:true},200,{...cors,'Set-Cookie':cookie(req,'',0)});}await env.DB.prepare('UPDATE users SET name=?,profile=? WHERE id=?').bind(name,profile,u.id).run();return json({user:safeUser({...u,name,profile})},200,cors);}
  if(path==='/api/state'&&method==='GET'){
   const jobs=(await all(env,'jobs')).filter(j=>canJob(u,j));const ids=new Set(jobs.map(j=>j.id));
   const result={jobs,customers:isManager(u)?await all(env,'customers'):[],properties:isManager(u)?await all(env,'properties'):[],enquiries:isManager(u)?await all(env,'enquiries'):[],evidence:(await all(env,'evidence')).filter(e=>ids.has(e.jobId)),issues:(await all(env,'issues')).filter(e=>ids.has(e.jobId)),locations:(await all(env,'locations')).filter(e=>ids.has(e.jobId))};
   const users=(await env.DB.prepare('SELECT id,email,name,role,status,created,profile FROM users').all()).results.map(p=>({...p,profile:JSON.parse(p.profile||'{}')}));
   result.team=isManager(u)?users:users.filter(p=>p.id===u.id||jobs.some(j=>j.cleaner===p.id||j.supervisor===p.id)).map(p=>({id:p.id,name:p.name,role:p.role,status:p.status,profile:p.profile}));
   result.audit=(await env.DB.prepare('SELECT audit.*, users.name FROM audit JOIN users ON actor=users.id ORDER BY created DESC LIMIT 100').all()).results.filter(a=>isManager(u)||a.actor===u.id||ids.has(a.record_id));
   return json(result,200,cors);
  }
  if(path.startsWith('/api/users/')&&method==='PATCH'){
   if(u.role!=='Superadmin')fail('Superadmin access required.',403);const key=path.split('/')[3],b=await body(req),target=await env.DB.prepare('SELECT * FROM users WHERE id=?').bind(key).first();if(!target||target.role==='Superadmin')fail('The Superadmin account cannot be changed here.');
   if(!['Manager','Supervisor','Cleaner'].includes(b.role)||!['Active','Pending','Suspended'].includes(b.status))fail('Invalid role or status.');await env.DB.batch([env.DB.prepare('UPDATE users SET role=?,status=? WHERE id=?').bind(b.role,b.status,key),env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(key)]);await audit(env,u,'Changed account access',key);return json({ok:true},200,cors);
  }
  if(path==='/api/reset-link'&&method==='POST'){
   if(u.role!=='Superadmin')fail('Superadmin access required.',403);const b=await body(req),target=await env.DB.prepare('SELECT id FROM users WHERE id=?').bind(text(b.userId)).first();if(!target)fail('Account not found.');const token=hex(crypto.getRandomValues(new Uint8Array(32)));await env.DB.batch([env.DB.prepare('DELETE FROM reset_tokens WHERE user_id=?').bind(target.id),env.DB.prepare('INSERT INTO reset_tokens VALUES(?,?,?)').bind(await digest(token),target.id,Date.now()+1800000)]);await audit(env,u,'Issued password reset',target.id);return json({url:`${env.APP_ORIGIN}/forgot-password/?token=${token}`},200,cors);
  }
  if(path.startsWith('/api/media/')&&method==='GET'){const key=path.split('/')[3],e=await one(env,key,'evidence');if(!e)fail('Photo not found.',404);await requireJob(env,u,e.jobId);const file=await env.MEDIA.get(e.key);if(!file)fail('Photo not found.',404);return new Response(file.body,{headers:{...cors,'Content-Type':e.mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}
  if(path.startsWith('/api/jobs/')&&path.endsWith('/photos')&&method==='POST'){
   const job=await requireJob(env,u,path.split('/')[3]);if(job.status==='Completed')fail('Completed jobs are locked.');const payload=await limitedBytes(req,6*1024*1024);const form=await new Response(payload,{headers:{'Content-Type':req.headers.get('Content-Type')||''}}).formData(),file=form.get('file');if(!file||file.size>5*1024*1024)fail('Choose an image under 5 MB.');const bytes=new Uint8Array(await file.arrayBuffer());const mime=bytes[0]===255&&bytes[1]===216?'image/jpeg':bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71?'image/png':String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP'?'image/webp':null;if(!mime)fail('Only JPG, PNG and WebP images are supported.');if((await all(env,'evidence')).filter(e=>e.jobId===job.id).length>=30)fail('Maximum 30 photos per job.');const key=`jobs/${job.id}/${id()}`;await env.MEDIA.put(key,bytes,{httpMetadata:{contentType:mime}});const e=await save(env,'evidence',{jobId:job.id,key,name:text(file.name,150),mime,stage:['Before','After'].includes(form.get('stage'))?form.get('stage'):'After',created:now(),actor:u.id});await audit(env,u,'Uploaded job evidence',job.id);return json(e,201,cors);
  }
  const match=path.match(/^\/api\/records\/(jobs|customers|properties|enquiries|issues|locations)(?:\/([^/]+))?$/);
  if(match&&['POST','PATCH','DELETE'].includes(method)){
   const [,kind,key]=match,b=method==='DELETE'?{}:await body(req),existing=key?await one(env,key,kind):null;if(key&&!existing)fail('Record not found.',404);
   let data;
   if(kind==='jobs'){
    if(!key&&!isManager(u)||method==='DELETE'&&!isManager(u))fail('Manager access required.',403);if(existing&&!canJob(u,existing))fail('Access denied.',403);
    const status=['Unassigned','Assigned','In progress','Awaiting review','Completed'].includes(b.status)?b.status:existing?.status||'Unassigned';
    if(!isManager(u)&&existing){const permitted=u.role==='Cleaner'?['In progress','Awaiting review']:['In progress','Awaiting review','Completed'];if(status!==existing.status&&!permitted.includes(status))fail('Status change not permitted.',403);if(existing.status==='Completed')fail('Completed jobs are locked.');if(status==='Completed'&&existing.status!=='Awaiting review')fail('Only reviewed jobs can be completed.');}
    if(status==='Completed'&&(!existing||existing.status!=='Awaiting review'||u.role==='Cleaner'))fail('A supervisor must review a submitted job before completion.',403);
    if(status==='Awaiting review'){if(!Array.isArray(b.checklist)||b.checklist.length!==6||!b.checklist.every(x=>x===true))fail('Complete all six checklist items.');if(!(await all(env,'evidence')).some(e=>e.jobId===key))fail('Upload job evidence before submitting.');}
    const fields=['title','service','customer','address','postcode','date','time','end','rooms','notes','cleaner','supervisor'];data=existing?{...existing}:{};for(const field of fields)if(isManager(u)&&field in b)data[field]=text(b[field],field==='notes'?2000:300);delete data.id;delete data.version;
    if(!text(data.title)||!text(data.address)||!/^\d{4}-\d{2}-\d{2}$/.test(data.date||''))fail('Job title, address and date are required.');
    for(const field of ['cleaner','supervisor'])if(data[field]){const target=await env.DB.prepare('SELECT role,status FROM users WHERE id=?').bind(data[field]).first();if(!target||target.status!=='Active'||field==='cleaner'&&target.role!=='Cleaner'||field==='supervisor'&&!['Supervisor','Manager','Superadmin'].includes(target.role))fail('Select an active team member with the correct role.');}
    data.status=status;data.checklist=Array.isArray(b.checklist)&&b.checklist.length===6?b.checklist.map(Boolean):data.checklist||Array(6).fill(false);if(isManager(u)&&!data.cleaner&&status==='Assigned')data.status='Unassigned';
   }else if(['issues','locations'].includes(kind)){
    if(method==='DELETE')fail('Deletion is not supported here.',403);const job=await requireJob(env,u,text(b.jobId||existing?.jobId));if(kind==='locations'){const lat=Number(b.lat),lng=Number(b.lng),accuracy=Number(b.accuracy);if(!Number.isFinite(lat)||lat<-90||lat>90||!Number.isFinite(lng)||lng<-180||lng>180||!Number.isFinite(accuracy)||accuracy<0)fail('Invalid location.');data={jobId:job.id,lat,lng,accuracy,actor:u.id,created:now(),action:b.action==='Check out'?'Check out':'Check in'};}else{if(!text(b.title))fail('An issue title is required.');data={jobId:job.id,title:text(b.title),details:text(b.details,2000),actor:u.id,created:now()};}
   }else{
    if(!isManager(u))fail('Manager access required.',403);if(!text(b.name))fail('Name is required.');data={name:text(b.name,200),details:text(b.details,2000),email:text(b.email,254),phone:text(b.phone,40),address:text(b.address),stage:['New enquiry','Quote sent','Follow-up','Booked'].includes(b.stage)?b.stage:'New enquiry'};
   }
   if(method==='DELETE'){await env.DB.prepare('DELETE FROM records WHERE id=? AND kind=?').bind(key,kind).run();await audit(env,u,'Deleted '+kind,key);return json({ok:true},200,cors);}
   const record=await save(env,kind,data,key,b.version||0);await audit(env,u,(key?'Updated ':'Created ')+kind,record.id);return json(record,key?200:201,cors);
  }
  fail('Endpoint not found.',404);
 }catch(e){if(!e.status)console.error('CRM request failed',e.message);return json({error:e.status?e.message:'The request could not be completed. Please try again.'},e.status||500,cors);}
}};
