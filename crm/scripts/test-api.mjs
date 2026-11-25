import assert from 'node:assert/strict';
import {createInterface} from 'node:readline';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const base='http://127.0.0.1:3003/api',origin='http://localhost:3002';
const users=[],records=[];let photoKey='';
const client=()=>({cookie:''});const admin=client(),cleaner=client(),other=client();
async function req(c,p,method='GET',body,expected=200){const form=body instanceof FormData;const r=await fetch(base+p,{method,headers:{Origin:origin,'X-CRM-Request':'1',...(c.cookie?{Cookie:c.cookie}:{}),...(!form&&body?{'Content-Type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined});const sc=r.headers.get('set-cookie');if(sc)c.cookie=sc.split(';')[0];const data=await r.json();assert.equal(r.status,expected,`${method} ${p}: ${JSON.stringify(data)}`);return data;}
function pass(s){console.log('PASS '+s);}
console.log('Enter the local Superadmin password on stdin.');
const rl=createInterface({input:process.stdin});
for await(const password of rl){rl.close();try{
 await req(client(),'/state','GET',null,401);pass('Unauthenticated requests rejected');
 await req(admin,'/login','POST',{email:'info@coreservegroup.co.uk',password});pass('Superadmin sign-in');
 const initial=await req(admin,'/state');assert(initial.team.some(u=>u.email==='info@coreservegroup.co.uk'&&u.role==='Superadmin'));
 const suffix=Date.now();const pw='Test-only!7wL39';
 for(const [name,email] of [['QA Cleaner',`qa-${suffix}@example.test`],['QA Other',`qa-other-${suffix}@example.test`]]){
  await req(admin,'/signup','POST',{name,email,password:pw,role:'Superadmin'});const state=await req(admin,'/state');const u=state.team.find(u=>u.email===email);assert.equal(u.role,'Cleaner');assert.equal(u.status,'Pending');users.push(u.id);
  await req(client(),'/login','POST',{email,password:pw},403);
  await req(admin,`/users/${u.id}`,'PATCH',{role:'Cleaner',status:'Active'});
 }
 pass('Signup cannot escalate roles; accounts require approval');
 await req(cleaner,'/login','POST',{email:`qa-${suffix}@example.test`,password:pw});await req(other,'/login','POST',{email:`qa-other-${suffix}@example.test`,password:pw});
 await req(cleaner,'/users/'+users[1],'PATCH',{role:'Manager',status:'Active'},403);pass('Cleaner cannot change roles');
 const customer=await req(admin,'/records/customers','POST',{name:'QA test customer'},201);records.push(customer.id);
 await req(cleaner,'/records/customers','POST',{name:'Forbidden'},403);assert.equal((await req(cleaner,'/state')).customers.length,0);pass('Customer data and writes restricted');
 let job=await req(admin,'/records/jobs','POST',{title:'QA test job',date:'2026-11-26',address:'Fictional test property',cleaner:users[0],status:'Assigned',checklist:Array(6).fill(false)},201);records.push(job.id);
 assert((await req(cleaner,'/state')).jobs.some(j=>j.id===job.id));assert(!(await req(other,'/state')).jobs.some(j=>j.id===job.id));
 await req(other,`/records/jobs/${job.id}`,'PATCH',{version:job.version,status:'In progress'},403);pass('Assignment-level access enforced');
 await req(cleaner,`/records/jobs/${job.id}`,'PATCH',{version:job.version,status:'Awaiting review',checklist:Array(6).fill(true)},400);pass('Completion requires photo evidence');
 const form=new FormData();form.set('stage','After');form.set('file',new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aS2sAAAAASUVORK5CYII=','base64')],{type:'image/png'}),'qa.png');
 const photo=await req(cleaner,`/jobs/${job.id}/photos`,'POST',form,201);records.push(photo.id);photoKey=photo.key;
 const privatePhoto=await fetch(base+'/media/'+photo.id,{headers:{Cookie:other.cookie}});assert.equal(privatePhoto.status,404);const ownerPhoto=await fetch(base+'/media/'+photo.id,{headers:{Cookie:cleaner.cookie}});assert.equal(ownerPhoto.status,200);pass('Private photo upload and read authorisation');
 job=await req(cleaner,`/records/jobs/${job.id}`,'PATCH',{version:job.version,status:'Awaiting review',checklist:Array(6).fill(true)});
 await req(cleaner,`/records/jobs/${job.id}`,'PATCH',{version:job.version,status:'Completed'},403);
 job=await req(admin,`/records/jobs/${job.id}`,'PATCH',{...job,status:'Completed'});assert.equal(job.status,'Completed');pass('Supervisor review boundary enforced');
 await req(admin,`/records/jobs/${job.id}`,'PATCH',{...job,version:1,status:'In progress'},409);pass('Concurrent edit protection');
 const missingCsrf=await fetch(base+'/profile',{method:'PATCH',headers:{'Content-Type':'application/json',Cookie:admin.cookie},body:JSON.stringify({name:'Invalid'})});assert.equal(missingCsrf.status,403);pass('Cross-site write protection');
 await req(cleaner,'/profile','PATCH',{name:'QA Cleaner',coverage:'PR',travel:'Public transport',availability:'Monday 09:00–13:00',currentPassword:pw,newPassword:'Changed-test!8wL39'});
 await req(cleaner,'/state','GET',null,401);
 await req(cleaner,'/login','POST',{email:`qa-${suffix}@example.test`,password:'Changed-test!8wL39'});const me=await req(cleaner,'/me');assert.equal(me.user.profile.coverage,'PR');pass('Password changes revoke sessions; profile persists');
 const link=await req(admin,'/reset-link','POST',{userId:users[0]});const token=new URL(link.url).searchParams.get('token');await req(client(),'/reset','POST',{token,password:'Reset-test!8wL39'});await req(client(),'/reset','POST',{token,password:'Reset-test!8wL39'},400);pass('Password reset tokens are one-use');
 await req(cleaner,'/login','POST',{email:`qa-${suffix}@example.test`,password:'Reset-test!8wL39'});await req(cleaner,'/logout','POST',{});assert.equal((await req(cleaner,'/me')).user,null);pass('Logout clears authentication');
 console.log('All API integration checks passed.');
 }finally{
  // Only remove the fixtures created by this test run, from the local database.
  const cli=path.join(root,'../node_modules/wrangler/bin/wrangler.js');
  const literals=xs=>xs.filter(s=>/^[a-f0-9-]{36}$/.test(s)).map(s=>`'${s}'`).join(',')||"''";
  const sql=`DELETE FROM records WHERE id IN (${literals(records)});DELETE FROM reset_tokens WHERE user_id IN (${literals(users)});DELETE FROM sessions WHERE user_id IN (${literals(users)});DELETE FROM audit WHERE actor IN (${literals(users)}) OR record_id IN (${literals([...records,...users])});DELETE FROM users WHERE id IN (${literals(users)});`;
  const cleanup=spawnSync(process.execPath,[cli,'d1','execute','coreserve-crm','--local','--command',sql],{cwd:root,stdio:'pipe'});if(cleanup.status)console.error('Local test fixture cleanup failed.');
  if(photoKey)spawnSync(process.execPath,[cli,'r2','object','delete',`coreserve-crm-private/${photoKey}`,'--local'],{cwd:root,stdio:'pipe'});
 }break;}
