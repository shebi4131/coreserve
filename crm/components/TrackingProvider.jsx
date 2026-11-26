'use client';
import {createContext,useContext,useEffect,useRef,useState} from 'react';
import {MapPin,Square} from 'lucide-react';
import {api} from '../lib/api';
import {useToast} from './Toaster';
const TrackingContext=createContext(null);
const options={enableHighAccuracy:true,timeout:20000,maximumAge:0};
const payload=p=>({lat:p.coords.latitude,lng:p.coords.longitude,accuracy:p.coords.accuracy,captured:new Date(p.timestamp).toISOString()});
const geoError=e=>e.code===1?'Location permission is blocked. Allow it in browser settings to share your position.':e.code===3?'Your device took too long to find a location. Try again near a window.':'Device location is unavailable. Check location services and try again.';
export function TrackingProvider({children}){
 const notify=useToast(),active=useRef(null),watch=useRef(null),pending=useRef(false),mounted=useRef(true),generation=useRef(0),lastSent=useRef(0),[sharing,setSharing]=useState(null),[busy,setBusy]=useState(false);
 function clearWatch(){if(watch.current!==null){navigator.geolocation?.clearWatch(watch.current);watch.current=null;}}
 async function stop(silent=false){generation.current++;clearWatch();const previous=active.current;active.current=null;setSharing(null);if(previous){try{await api('/tracking/stop',{method:'POST',body:{sessionId:previous.sessionId}});if(!silent)notify('Location sharing stopped.');}catch(e){notify(e.message,'error');}}}
 async function send(position,force=false){
  if(!active.current||pending.current||!force&&Date.now()-lastSent.current<30000)return;
  const current=active.current;pending.current=true;
  try{await api('/tracking/ping',{method:'POST',body:{sessionId:current.sessionId,...payload(position)}});lastSent.current=Date.now();if(active.current===current)setSharing({...current,updated:new Date().toISOString(),error:''});}
  catch(e){if([401,403,409].includes(e.status)){clearWatch();active.current=null;setSharing(null);notify(e.message,'error');}else{setSharing(previous=>previous?{...previous,error:'Update not delivered. Retrying while this page is open.'}:null);}}
  finally{pending.current=false;}
 }
 async function start(job){
  if(busy)return;if(!navigator.geolocation){notify('Location sharing is not supported by this browser.','error');return;}
  setBusy(true);const attempt=++generation.current;
  try{
   const position=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,options));
   if(!mounted.current||attempt!==generation.current)return;
   const result=await api('/tracking/start',{method:'POST',body:{jobId:job.id,...payload(position)}});
   if(!mounted.current||attempt!==generation.current){await api('/tracking/stop',{method:'POST',body:{sessionId:result.sessionId}});return;}
   clearWatch();const session={...result,title:job.title,updated:new Date().toISOString(),error:''};active.current=session;setSharing(session);lastSent.current=Date.now();
   watch.current=navigator.geolocation.watchPosition(p=>send(p),e=>{setSharing(previous=>previous?{...previous,error:geoError(e)}:null);notify(geoError(e),'error');if(e.code===1)stop(true);},options);
   notify('Location sharing is on. Keep the workspace open; stop at any time.');
  }catch(e){notify(e.code?geoError(e):e.message,'error');}finally{setBusy(false);}
 }
 useEffect(()=>{
  mounted.current=true;
  const update=()=>{if(active.current)navigator.geolocation.getCurrentPosition(p=>send(p,true),e=>setSharing(previous=>previous?{...previous,error:geoError(e)}:null),options);};
  const interval=setInterval(update,60000);const visible=()=>{if(document.visibilityState==='visible')update();};document.addEventListener('visibilitychange',visible);
  const leave=()=>{if(active.current)fetch('/api/tracking/stop',{method:'POST',credentials:'include',keepalive:true,headers:{'Content-Type':'application/json','X-CRM-Request':'1'},body:JSON.stringify({sessionId:active.current.sessionId})}).catch(()=>{});};window.addEventListener('pagehide',leave);
  return()=>{mounted.current=false;generation.current++;clearInterval(interval);clearWatch();document.removeEventListener('visibilitychange',visible);window.removeEventListener('pagehide',leave);leave();};
 },[]);
 return <TrackingContext.Provider value={{sharing,busy,start,stop}}>{children}{sharing&&<div className="tracking-banner" role="status"><MapPin size={20}/><div><strong>{sharing.error?'Location updates paused':'You are sharing your location'}</strong><small>{sharing.error||sharing.title+' · Keep this workspace open'}</small></div><button className="button secondary" onClick={()=>stop()}><Square size={14}/>Stop sharing</button></div>}</TrackingContext.Provider>;
}
export const useTracking=()=>useContext(TrackingContext);
