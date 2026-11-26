import {has,need,deny,hydrate} from './access.mjs';
import {days,slots,financialFields,sensitiveCleanerFields,leadSources,leadStatuses,bookingStatuses,paymentStatuses,cleanerStatuses,outreachStatuses} from '../lib/operations.mjs';
const t=(value,max=1000)=>typeof value==='string'?value.trim().slice(0,max):'';
function date(v){const value=t(v,10),stamp=Date.parse(value+'T12:00:00Z');if(value&&(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(stamp)||new Date(stamp).toISOString().slice(0,10)!==value))deny('Enter a valid date.',400);return value;}
function choice(v,options,fallback){const value=t(v);if(!value)return fallback;if(!options.includes(value))deny('Choose a valid option: '+value,400);return value;}
function amount(v){if(v===''||v===null||v===undefined)return null;if(typeof v!=='number'||!Number.isSafeInteger(v)||v<0||v>1000000000)deny('Enter a non-negative amount with no more than two decimal places.',400);return v;}
function number(v,max=10000){if(v===''||v===null||v===undefined)return null;const n=Number(v);if(!Number.isFinite(n)||n<0||n>max)deny('Enter a valid non-negative number.',400);return n;}
function financeFields(u,b,existing,data,keys=financialFields){for(const key of keys){if(!(key in b))continue;if(!has(u,'finance.view'))need(u,'finance.edit');const value=amount(b[key]);if(value!==(existing?.[key]??null))need(u,'finance.edit');data[key]=value;}}
export function redact(u,record,kind){const result={...record};if(!has(u,'finance.view'))for(const field of [...financialFields,'hourlyRatePence','paymentStatus','invoice'])delete result[field];if(kind==='cleaners'&&!has(u,'cleaners.sensitive'))for(const field of sensitiveCleanerFields)delete result[field];if(!has(u,'jobs.view_all')&&!has(u,'enquiries.view'))delete result.internalNotes;return result;}
export function normalizeOperation(kind,b,existing={},u={owner:true}){
 const data={...existing};delete data.id;delete data.version;
 const set=(keys,max=1000)=>{for(const key of keys)if(key in b)data[key]=t(b[key],max);};
 if(['services','propertyTypes','areas'].includes(kind)){
  set(['name','notes','website','postcodes']);if(!data.name)deny('Name is required.',400);data.active=b.active===undefined?data.active!==false:b.active===true;
  if(kind==='services'&&'startingPricePence' in b)data.startingPricePence=amount(b.startingPricePence);
  if(data.website&&!/^https:\/\//.test(data.website))deny('Use a full HTTPS website address.',400);
 }else if(kind==='agents'){
  set(['name','area','phone','email','contactPerson','notes']);if(!data.name)deny('Agency / branch name is required.',400);
  data.outreachStatus=choice(b.outreachStatus??data.outreachStatus,outreachStatuses,'Pending');for(const key of ['contactedDate','followupDate'])if(key in b)data[key]=date(b[key]);if('jobsReferred' in b)data.jobsReferred=number(b.jobsReferred);
 }else if(kind==='cleaners'){
  set(['name','phone','email','coverage','travel','skills']);if(!data.name)deny('Cleaner name is required.',400);
  for(const key of sensitiveCleanerFields)if(key in b){need(u,'cleaners.sensitive');data[key]=t(b[key],2000);}
  if('availability' in b){data.availability={};for(const day of days){const values=b.availability?.[day]||[];if(!Array.isArray(values)||values.some(s=>!slots.includes(s)))deny('Choose valid availability slots.',400);data.availability[day]=[...new Set(values)];}}
  if('appliedDate' in b)data.appliedDate=date(b.appliedDate);data.cleanerStatus=choice(b.cleanerStatus??data.cleanerStatus,cleanerStatuses,'Available');if('jobsCompleted' in b)data.jobsCompleted=number(b.jobsCompleted);financeFields(u,b,existing,data,['hourlyRatePence']);
 }else if(kind==='enquiries'||kind==='jobs'){
  const fields=['name','phone','email','postcode','area','address','service','propertyType','details','preferredTime','photosSent','summarySent','reviewRequested','internalNotes'];
  if(kind==='jobs'&&!has(u,'jobs.edit')){for(const key of [...fields,'receivedAt','source','leadStatus','bookingStatus','bedrooms','bathrooms','preferredDate','completionDate','followupDate','rating'])if(key in b&&String(b[key]??'')!==String(existing[key]??''))deny('Job editing permission is required.');}else{
   set(fields,4000);if(!data.name)data.name=data.customer||(kind==='jobs'?data.title:'')||'';if(!data.name)deny('Customer name is required.',400);
   if('source' in b)data.source=choice(b.source,leadSources,'Other');data.source=data.source||'Other';
   data.leadStatus=choice(b.leadStatus??data.leadStatus,leadStatuses,kind==='jobs'?'Booked':'New');data.bookingStatus=choice(b.bookingStatus??data.bookingStatus,bookingStatuses,kind==='jobs'?'Booked':'Not booked');
   if(kind==='enquiries'&&'cleanerProfileId' in b){if(t(b.cleanerProfileId)!==t(existing.cleanerProfileId))need(u,'jobs.assign');data.cleanerProfileId=t(b.cleanerProfileId,200);}
   for(const key of ['receivedAt','preferredDate','completionDate','followupDate'])if(key in b)data[key]=date(b[key]);
   for(const key of ['bedrooms','bathrooms','rating'])if(key in b)data[key]=number(b[key],key==='rating'?5:100);
  }
  for(const key of ['paymentStatus','invoice'])if(key in b){if(!has(u,'finance.view'))need(u,'finance.edit');const value=key==='paymentStatus'?choice(b[key],paymentStatuses,'Unpaid'):t(b[key]);if(value!==(existing[key]|| (key==='paymentStatus'?'Unpaid':'')))need(u,'finance.edit');data[key]=value;}
  financeFields(u,b,existing,data);
  data.ref=data.ref||'CS-'+crypto.randomUUID().slice(0,8).toUpperCase();data.receivedAt=data.receivedAt||new Date().toISOString().slice(0,10);if(kind==='enquiries')data.stage=data.leadStatus;
  if(kind==='jobs')data.bookingStatus=({'In progress':'In Progress','Awaiting review':'In Progress',Completed:'Completed',Cancelled:'Cancelled','Re-clean requested':'Re-clean Requested',Assigned:'Cleaner Assigned',Unassigned:'Booked'})[data.status]||'Booked';
 }
 for(const key of ['email'])if(data[key]&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[key]))deny('Enter a valid email address.',400);
 return data;
}
export async function directoryAssignment(env,u,b,existing,one){
 let cleaner=b.cleaner===undefined?existing?.cleaner||'':t(b.cleaner,200),profileId=existing?.cleanerProfileId||'';
 if(b.cleaner===undefined)return {cleaner,cleanerProfileId:profileId};
 if(cleaner.startsWith('directory:')){
  profileId=cleaner.slice(10);const profile=await one(env,profileId,'cleaners');if(!profile||['Paused','Left'].includes(profile.cleanerStatus))deny('Choose an available cleaner profile.',400);
  need(u,'jobs.assign');const account=profile.email?await hydrate(env,await env.DB.prepare("SELECT * FROM users WHERE lower(email)=? AND status='Active'").bind(profile.email.toLowerCase()).first()):null;cleaner=account&&has(account,'jobs.view')&&has(account,'jobs.work')?account.id:'';
 }else{if(cleaner!==existing?.cleaner)profileId='';if(cleaner){const target=await hydrate(env,await env.DB.prepare('SELECT * FROM users WHERE id=?').bind(cleaner).first());if(!target||target.status!=='Active'||!has(target,'jobs.view')||!has(target,'jobs.work'))deny('Choose an active account with job work permission.',400);}}
 return {cleaner,cleanerProfileId:profileId};
}
export async function operations(req,env,u,context){
 const {path,method,body,all,one,save,audit,json,cors,canJob}=context;
 const book=path.match(/^\/api\/enquiries\/([^/]+)\/book$/);
 if(book&&method==='POST'){
  need(u,'enquiries.view');need(u,'enquiries.edit');need(u,'jobs.view');need(u,'jobs.create');const b=await body(req),record=await one(env,book[1],'enquiries');if(!record)deny('Lead not found.',404);
  const jobDate=date(b.date||record.preferredDate);if(!jobDate||!record.address)deny('Set a property address and job date before booking.',400);
  const assignment=await directoryAssignment(env,u,b,record,one);if(b.cleaner&& !has(u,'jobs.assign'))deny();
  const data={...record,...assignment,title:t(b.title)||record.service+' · '+record.name,customer:record.name,notes:record.details||'',date:jobDate,time:t(b.time,5)||'09:00',end:t(b.end,5)||'11:00',status:assignment.cleaner||assignment.cleanerProfileId?'Assigned':'Unassigned',leadStatus:'Booked',bookingStatus:'Booked',checklist:Array(6).fill(false)};delete data.id;delete data.version;
  const result=await env.DB.prepare("UPDATE records SET kind='jobs',data=?,version=version+1,updated=? WHERE id=? AND kind='enquiries' AND version=?").bind(JSON.stringify(data),new Date().toISOString(),record.id,Number(b.version)||0).run();if(!result.meta.changes)deny('This lead changed. Refresh before booking.',409);
  await audit(env,u,'Booked lead into a job',record.id);return json(redact(u,await one(env,record.id,'jobs'),'jobs'),200,cors);
 }
 const jobOps=path.match(/^\/api\/operations\/jobs\/([^/]+)$/);
 if(jobOps&&method==='PATCH'){
  need(u,'jobs.view');if(!has(u,'jobs.edit')&&!has(u,'finance.edit'))deny();const existing=await one(env,jobOps[1],'jobs');if(!existing||!canJob(u,existing))deny('Job not found.',404);const b=await body(req),data=normalizeOperation('jobs',b,existing,u);if(has(u,'jobs.edit')){data.customer=data.name;data.notes=data.details||data.notes;}
  const record=await save(env,'jobs',data,existing.id,Number(b.version)||0);await audit(env,u,'Updated job commercial details',record.id);return json(redact(u,record,'jobs'),200,cors);
 }
 const match=path.match(/^\/api\/records\/(cleaners|agents|services|propertyTypes|areas|enquiries)(?:\/([^/]+))?$/);
 if(!match||!['POST','PATCH','DELETE'].includes(method))return null;
 const [,kind,key]=match,group=['services','propertyTypes','areas'].includes(kind)?'catalog':kind;
 need(u,group+'.view');need(u,kind==='enquiries'?'enquiries.'+(method==='POST'?'create':method==='DELETE'?'delete':'edit'):group+'.manage');
 if(method==='POST'&&key||method!=='POST'&&!key)deny('Invalid record URL.',400);
 const existing=key?await one(env,key,kind):null;if(key&&!existing)deny('Record not found.',404);
 if(method==='DELETE'){
  const jobs=await all(env,'jobs');if(kind==='cleaners'&&jobs.some(j=>j.cleanerProfileId===key))deny('This cleaner has linked jobs. Set their status to Paused or Left instead.',409);
  if(['services','propertyTypes','areas'].includes(kind)){const field={services:'service',propertyTypes:'propertyType',areas:'area'}[kind];if([...jobs,...await all(env,'enquiries'),...(kind==='areas'?await all(env,'agents'):[])].some(j=>j[field]===existing.name))deny('This entry is used by existing records. Deactivate it instead.',409);}
  await env.DB.prepare('DELETE FROM records WHERE id=? AND kind=?').bind(key,kind).run();await audit(env,u,'Deleted '+kind,key);return json({ok:true},200,cors);
 }
 const b=await body(req),data=normalizeOperation(kind,b,existing||{},u);
 if(['services','propertyTypes','areas'].includes(kind)&&(await all(env,kind)).some(r=>r.id!==key&&r.name.toLowerCase()===data.name.toLowerCase()))deny('This name already exists.',409);
 const record=await save(env,kind,data,key,Number(b.version)||0);await audit(env,u,(key?'Updated ':'Created ')+kind,record.id);return json(redact(u,record,kind),key?200:201,cors);
}
