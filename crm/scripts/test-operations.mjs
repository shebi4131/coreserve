import assert from 'node:assert/strict';
import {createInterface} from 'node:readline';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {finance} from '../lib/operations.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),base='http://127.0.0.1:3003/api',stamp=Date.now(),admin={},restricted={},fixtures={records:[],users:[],roles:[]};
async function req(c,p,method='GET',body,expected=200){const r=await fetch(base+p,{method,headers:{Origin:'http://localhost:3002','X-CRM-Request':'1',...(c.cookie?{Cookie:c.cookie}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});if(r.headers.get('set-cookie'))c.cookie=r.headers.get('set-cookie').split(';')[0];const data=await r.json();assert.equal(r.status,expected,`${method} ${p}: ${JSON.stringify(data)}`);return data;}
const pass=s=>console.log('PASS '+s);
console.log('Enter local Superadmin password on stdin.');const rl=createInterface({input:process.stdin});
for await(const password of rl){rl.close();try{
 await req(admin,'/login','POST',{email:'info@coreservegroup.co.uk',password});const initial=await req(admin,'/state');
 for(const [kind,count] of [['cleaners',11],['agents',20],['services',23],['propertyTypes',8],['areas',6]])assert.equal(initial[kind].filter(r=>r.importSource?.spreadsheetId==='1KALsCLBYoR6rF330q92b0hDWeulgoAeP9On2WNCW1xI').length,count);
 assert(initial.cleaners.filter(c=>c.importSource).every(c=>!c.rtwDocsChecked));pass('All 68 imported source records present; declarations did not become document verification');
 async function create(kind,data){const r=await req(admin,'/records/'+kind,'POST',data,201);fixtures.records.push(r.id);return r;}
 let service=await create('services',{name:'QA service '+stamp,startingPricePence:11000,notes:'Fixture',active:true});
 const property=await create('propertyTypes',{name:'QA property '+stamp,active:true}),area=await create('areas',{name:'QA area '+stamp,postcodes:'PR',active:true});
 await req(admin,'/records/services','POST',{name:service.name},409);
 let cleaner=await create('cleaners',{name:'QA directory cleaner '+stamp,email:'qa-dir-'+stamp+'@example.test',phone:'00000000000',coverage:area.name,travel:'Public transport',availability:{Mon:['Morning'],Tue:['Afternoon']},visaStatus:'Student visa',rightToWork:'Yes',rtwDocsChecked:'',hourlyRatePence:1250,cleanerStatus:'Available'});
 assert.deepEqual(cleaner.availability.Mon,['Morning']);assert.deepEqual(cleaner.availability.Tue,['Afternoon']);assert.equal(cleaner.rtwDocsChecked,'');
 cleaner=await req(admin,'/records/cleaners/'+cleaner.id,'PATCH',{version:cleaner.version,name:cleaner.name,availability:{Mon:['Morning'],Tue:['Afternoon','Evening']}});pass('Cleaner CRUD preserves independent daily time slots and sensitive onboarding fields');
 const agent=await create('agents',{name:'QA agency '+stamp,area:area.name,phone:'00000000000',outreachStatus:'Contacted',contactedDate:'2026-11-26',followupDate:'2026-11-27',jobsReferred:0,notes:'Fixture only'});
 let lead=await create('enquiries',{name:'QA customer '+stamp,source:'Meta Instant Form',receivedAt:'2026-11-26',address:'Fictional QA property',postcode:'PR1',area:area.name,propertyType:property.name,service:service.name,preferredDate:'2026-11-27',preferredTime:'Afternoon',bedrooms:2,bathrooms:1,details:'QA fixture',quotePence:11000,cleanerPayPence:4500,materialsPence:1000,amountPaidPence:2000,paymentStatus:'Deposit Paid',leadStatus:'Quote Sent',followupDate:'2026-11-27',cleanerProfileId:cleaner.id});
 assert.equal(finance(lead).cost,5500);assert.equal(finance(lead).profit,5500);assert.equal(finance(lead).margin,50);assert.equal(finance(lead).balance,9000);pass('Quote, cost, profit, margin and balance calculate exactly in pence');
 await req(admin,'/records/services/'+service.id,'DELETE',null,409);
 service=await req(admin,'/records/services/'+service.id,'PATCH',{...service,name:service.name+' updated'});lead=(await req(admin,'/state')).enquiries.find(r=>r.id===lead.id);assert.equal(lead.service,service.name);
 await req(admin,'/records/areas/'+area.id,'DELETE',null,409);pass('Catalogue CRUD prevents deleting used entries and updates linked records on rename');
 await req(admin,'/enquiries/'+lead.id+'/book','POST',{version:lead.version-1,date:'2026-11-27',cleaner:'directory:'+cleaner.id},409);
 let job=await req(admin,'/enquiries/'+lead.id+'/book','POST',{version:lead.version,date:'2026-11-27',time:'13:00',end:'15:00',cleaner:'directory:'+cleaner.id});
 assert.equal(job.id,lead.id);assert.equal(job.status,'Assigned');assert.equal(job.cleanerProfileId,cleaner.id);assert.equal(job.cleaner,'');assert.equal(job.quotePence,11000);
 const state=await req(admin,'/state');assert(!state.enquiries.some(e=>e.id===job.id));assert.equal(state.jobs.filter(j=>j.id===job.id).length,1);assert(!state.team.some(u=>u.email===cleaner.email));pass('Booking transfers one enquiry into one scheduled job, keeps its quote and assigns a directory profile without creating an account');
 await req(admin,'/enquiries/'+lead.id+'/book','POST',{version:lead.version,date:'2026-11-27'},404);
 await req(admin,'/records/cleaners/'+cleaner.id,'DELETE',null,409);
 job=await req(admin,'/operations/jobs/'+job.id,'PATCH',{version:job.version,amountPaidPence:11000,paymentStatus:'Paid',photosSent:'Yes',summarySent:'Yes',reviewRequested:'Yes',rating:5,invoice:'QA-INV',internalNotes:'Private QA note'});assert.equal(finance(job).balance,0);
 await req(admin,'/operations/jobs/'+job.id,'PATCH',{version:job.version,quotePence:12.3},400);
 await req(admin,'/records/enquiries','POST',{name:'Invalid QA date',preferredDate:'2026-02-31'},400);pass('Payment, delivery and review tracking work; invalid money and dates are rejected');
 const roleName='QA operations viewer '+stamp;await req(admin,'/roles','POST',{name:roleName,permissions:['dashboard.view','jobs.view','jobs.work','jobs.view_all','cleaners.view','enquiries.view','catalog.view','agents.view']},201);const role=(await req(admin,'/roles')).roles.find(r=>r.name===roleName);fixtures.roles.push(role.id);
 const email='qa-ops-'+stamp+'@example.test',pw='Fixture-only!9038';await req(admin,'/signup','POST',{name:'QA viewer',email,password:pw});const account=(await req(admin,'/state')).team.find(u=>u.email===email);fixtures.users.push(account.id);await req(admin,'/users/'+account.id,'PATCH',{roleId:role.id,status:'Active'});await req(restricted,'/login','POST',{email,password:pw});
 const scoped=await req(restricted,'/state'),profile=scoped.cleaners.find(c=>c.id===cleaner.id),work=scoped.jobs.find(j=>j.id===job.id);for(const k of ['visaStatus','address','rightToWork','rtwDocsChecked','hourlyRatePence'])assert(!(k in profile));for(const k of ['quotePence','cleanerPayPence','amountPaidPence','paymentStatus','invoice'])assert(!(k in work));
 await req(restricted,'/records/cleaners/'+cleaner.id,'PATCH',{version:cleaner.version,name:'Forbidden'},403);
 await req(restricted,'/records/services','POST',{name:'Forbidden'},403);
 await req(restricted,'/operations/jobs/'+job.id,'PATCH',{version:job.version,amountPaidPence:0},403);
 await req(restricted,'/records/jobs/'+job.id,'PATCH',{version:job.version,quotePence:1},403);
 pass('Directory-only access hides onboarding and pay; finance and catalogue write permissions are enforced on the API');
 job=await req(admin,'/records/jobs/'+job.id,'PATCH',{version:job.version,status:'Cancelled'});assert.equal(job.status,'Cancelled');assert.equal(job.bookingStatus,'Cancelled');
 job=await req(admin,'/records/jobs/'+job.id,'PATCH',{version:job.version,status:'Re-clean requested'});assert.equal(job.bookingStatus,'Re-clean Requested');assert(job.checklist.every(v=>v===false));assert(job.reviewCycleAt);
 await req(admin,'/records/jobs/'+job.id,'PATCH',{version:job.version,status:'Awaiting review',checklist:Array(6).fill(true)},400);pass('Cancellation and re-clean states stay in sync; re-clean cycles reset work checks and require evidence');
 console.log('All operations checks passed.');
 }finally{const ids=arr=>arr.filter(x=>/^[a-f0-9-]{36}$/.test(x)).map(x=>`'${x}'`).join(',')||"''";const sql=`DELETE FROM tracking_sessions WHERE job_id IN (${ids(fixtures.records)});DELETE FROM records WHERE id IN (${ids(fixtures.records)});DELETE FROM sessions WHERE user_id IN (${ids(fixtures.users)});DELETE FROM reset_tokens WHERE user_id IN (${ids(fixtures.users)});DELETE FROM audit WHERE actor IN (${ids(fixtures.users)}) OR record_id IN (${ids([...fixtures.records,...fixtures.users,...fixtures.roles])});DELETE FROM users WHERE id IN (${ids(fixtures.users)});DELETE FROM roles WHERE id IN (${ids(fixtures.roles)});`;const result=spawnSync(process.execPath,[path.join(root,'../node_modules/wrangler/bin/wrangler.js'),'d1','execute','coreserve-crm','--local','--command',sql],{cwd:root,stdio:'pipe'});if(result.status)console.error('Local fixture cleanup failed.');}break;}
