import assert from 'node:assert/strict';
import {createInterface} from 'node:readline';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),base='http://127.0.0.1:3003/api',origin='http://localhost:3002';
const fixtures={users:[],records:[],roles:[]},admin={},worker={},observer={},delegate={};
async function req(c,p,method='GET',body,expected=200){const r=await fetch(base+p,{method,headers:{Origin:origin,'X-CRM-Request':'1',...(c.cookie?{Cookie:c.cookie}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});if(r.headers.get('set-cookie'))c.cookie=r.headers.get('set-cookie').split(';')[0];const data=await r.json();assert.equal(r.status,expected,`${method} ${p}: ${JSON.stringify(data)}`);return data;}
const pass=s=>console.log('PASS '+s),stamp=Date.now(),pw='Local-fixture!2938';
console.log('Enter local Superadmin password on stdin.');const rl=createInterface({input:process.stdin});
for await(const password of rl){rl.close();try{
 await req(admin,'/login','POST',{email:'info@coreservegroup.co.uk',password});
 const owner=(await req(admin,'/me')).user;
 async function createRole(name,permissions){await req(admin,'/roles','POST',{name:`QA ${stamp} ${name}`,permissions},201);const role=(await req(admin,'/roles')).roles.find(r=>r.name===`QA ${stamp} ${name}`);fixtures.roles.push(role.id);return role;}
 const operative=await createRole('operative',['dashboard.view','jobs.view','jobs.work','locations.track']);
 const viewer=await createRole('observer',['dashboard.view','jobs.view','locations.view']);
 const delegated=await createRole('delegate',['dashboard.view','roles.manage','users.manage','team.view','jobs.view']);
 pass('Create custom roles with independent permission sets');
 for(const [client,label,role] of [[worker,'worker',operative],[observer,'observer',viewer],[delegate,'delegate',delegated]]){
  const email=`qa-access-${label}-${stamp}@example.test`;client.email=email;
  await req(admin,'/signup','POST',{name:'QA '+label,email,password:pw});const account=(await req(admin,'/state')).team.find(u=>u.email===email);fixtures.users.push(account.id);client.id=account.id;
  await req(admin,'/users/'+account.id,'PATCH',{roleId:role.id,status:'Active'});await req(client,'/login','POST',{email,password:pw});assert.equal((await req(client,'/me')).user.roleId,role.id);
 }
 pass('Assign any custom role to a user');
 await req(worker,'/roles','POST',{name:'Escalation',permissions:['roles.manage']},403);
 await req(delegate,'/roles','POST',{name:'Escalation',permissions:['jobs.view_all']},403);
 await req(delegate,'/users/'+worker.id,'PATCH',{roleId:'superadmin',status:'Active'},403);
 await req(delegate,'/reset-link','POST',{userId:owner.id},403);
 await req(admin,'/users/'+owner.id,'PATCH',{roleId:operative.id,status:'Suspended'},400);
 pass('Delegated administration cannot escalate permissions or take over the owner');
 await req(admin,'/roles/'+operative.id,'DELETE',null,409);
 await req(admin,'/roles/'+operative.id,'PATCH',{...operative,version:999},409);
 pass('Assigned roles cannot be deleted; role edits protect against concurrent writes');
 let job=await req(admin,'/records/jobs','POST',{title:'QA location job',address:'Fictional assigned property',date:'2026-11-26',cleaner:worker.id,status:'Assigned',checklist:Array(6).fill(false)},201);fixtures.records.push(job.id);
 const coords=()=>({lat:53.7632,lng:-2.7031,accuracy:12,captured:new Date().toISOString()});
 await req(worker,'/tracking/start','POST',{jobId:job.id,...coords()},400);
 job=await req(worker,'/records/jobs/'+job.id,'PATCH',{version:job.version,status:'In progress'});
 await req(observer,'/tracking/start','POST',{jobId:job.id,...coords()},403);
 await req(worker,'/tracking/start','POST',{jobId:job.id,...coords(),lat:null},400);
 const session=await req(worker,'/tracking/start','POST',{jobId:job.id,...coords()},201);
 assert((await req(admin,'/tracking')).sessions.some(s=>s.id===session.sessionId));
 assert(!(await req(observer,'/tracking')).sessions.some(s=>s.id===session.sessionId));
 await req(observer,'/tracking/ping','POST',{sessionId:session.sessionId,...coords()},403);
 await req(worker,'/tracking/ping','POST',{sessionId:session.sessionId,...coords(),captured:'2000-01-01T00:00:00Z'},400);
 await req(worker,'/tracking/ping','POST',{sessionId:session.sessionId,...coords()});
 await req(observer,'/tracking/stop','POST',{sessionId:session.sessionId});assert(!(await req(admin,'/tracking')).sessions.find(s=>s.id===session.sessionId).stopped);
 pass('Location sharing requires permission, active assignment, fresh coordinates and session ownership');
 await req(admin,'/roles/'+viewer.id,'PATCH',{...viewer,permissions:[...viewer.permissions,'locations.view_all']});await req(observer,'/login','POST',{email:observer.email,password:pw});assert((await req(observer,'/tracking')).sessions.some(s=>s.id===session.sessionId));
 pass('Location visibility follows role permissions');
 await req(admin,'/roles/'+operative.id,'PATCH',{...operative,permissions:['dashboard.view','jobs.view']});
 await req(worker,'/tracking/ping','POST',{sessionId:session.sessionId,...coords()},401);
 await req(worker,'/login','POST',{email:worker.email,password:pw});
 await req(worker,'/tracking/start','POST',{jobId:job.id,...coords()},403);
 assert((await req(admin,'/tracking')).sessions.find(s=>s.id===session.sessionId).stopped);
 await req(worker,'/records/jobs/'+job.id,'PATCH',{version:job.version,status:'Awaiting review'},403);
 pass('Revoking a role permission ends sessions and sharing, and blocks future writes');
 let fresh=(await req(admin,'/roles')).roles.find(r=>r.id===operative.id);await req(admin,'/roles/'+operative.id,'PATCH',{...fresh,permissions:operative.permissions});await req(worker,'/login','POST',{email:worker.email,password:pw});
 const session2=await req(worker,'/tracking/start','POST',{jobId:job.id,...coords()},201);await req(worker,'/tracking/stop','POST',{sessionId:session2.sessionId});await req(worker,'/tracking/ping','POST',{sessionId:session2.sessionId,...coords()},409);
 const session3=await req(worker,'/tracking/start','POST',{jobId:job.id,...coords()},201);
 const checkOut=await req(worker,'/records/locations','POST',{jobId:job.id,action:'Check out',...coords()},201);fixtures.records.push(checkOut.id);assert((await req(admin,'/tracking')).sessions.find(s=>s.id===session3.sessionId).stopped);
 const session4=await req(worker,'/tracking/start','POST',{jobId:job.id,...coords()},201);await req(worker,'/logout','POST',{});assert((await req(admin,'/tracking')).sessions.find(s=>s.id===session4.sessionId).stopped);
 pass('Stop sharing and logout end the server tracking session');
 await req(admin,'/records/jobs/'+job.id,'DELETE');
 assert(!(await req(admin,'/state')).jobs.some(j=>j.id===job.id));pass('Job deletion is available to authorised roles');
 console.log('All role and tracking integration checks passed.');
 }finally{
  const list=xs=>xs.filter(x=>/^[a-f0-9-]{36}$/.test(x)).map(x=>`'${x}'`).join(',')||"''";
  const sql=`DELETE FROM tracking_sessions WHERE user_id IN (${list(fixtures.users)});DELETE FROM records WHERE id IN (${list(fixtures.records)});DELETE FROM sessions WHERE user_id IN (${list(fixtures.users)});DELETE FROM reset_tokens WHERE user_id IN (${list(fixtures.users)});DELETE FROM audit WHERE actor IN (${list(fixtures.users)}) OR record_id IN (${list([...fixtures.users,...fixtures.roles,...fixtures.records])});DELETE FROM users WHERE id IN (${list(fixtures.users)});DELETE FROM roles WHERE id IN (${list(fixtures.roles)});`;
  const result=spawnSync(process.execPath,[path.join(root,'../node_modules/wrangler/bin/wrangler.js'),'d1','execute','coreserve-crm','--local','--command',sql],{cwd:root,stdio:'pipe'});if(result.status)console.error('Fixture cleanup failed:',result.stderr.toString());
 }break;}
