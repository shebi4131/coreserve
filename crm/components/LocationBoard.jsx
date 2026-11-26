'use client';
import {useEffect,useRef,useState} from 'react';
import {MapPin,RefreshCw,LocateFixed} from 'lucide-react';
import {api} from '../lib/api';
import {useToast} from './Toaster';
import Pagination,{usePagination} from './Pagination';
export default function LocationBoard({jobs,team,locations}){
 const notify=useToast(),lastError=useRef('');
 const [sessions,setSessions]=useState([]),[selected,setSelected]=useState(''),[error,setError]=useState(''),[updated,setUpdated]=useState(''),[tick,setTick]=useState(Date.now());
 async function load(manual=false){try{const result=await api('/tracking');setSessions(result.sessions);setUpdated(result.serverTime);setTick(Date.parse(result.serverTime));setError('');lastError.current='';if(manual)notify('Location view updated.');}catch(e){setError(e.message);if(manual||lastError.current!==e.message)notify(e.message,'error');lastError.current=e.message;}}
 useEffect(()=>{load();const interval=setInterval(()=>{setTick(Date.now());if(document.visibilityState==='visible')load();},30000);return()=>clearInterval(interval);},[]);
 const history=usePagination(locations,{pageSize:10});
 const status=s=>s.stopped?'Stopped':tick-Date.parse(s.captured)>120000?'Stale':'Sharing';
 const session=sessions.find(s=>s.id===selected)||sessions[0];
 const point=session?{...session,lat:session.lat,lng:session.lng}:null;
 const bbox=point?[point.lng-.012,point.lat-.008,point.lng+.012,point.lat+.008].join(','):'';
 return <>
  <div className="page-heading"><div><span className="eyebrow">TEAM VISIBILITY</span><h1>Where the work is happening.</h1><p>Device updates from team members who choose to share during a job.</p></div><button className="button secondary" onClick={()=>load(true)}><RefreshCw size={17}/>Refresh</button></div>
  <div className="location-summary"><span><i className="live-dot"/>{sessions.filter(s=>status(s)==='Sharing').length} sharing now</span><span>{sessions.filter(s=>status(s)==='Stale').length} stale</span><small>{updated?'Updated '+new Date(updated).toLocaleTimeString('en-GB'):'Loading locations…'} · Refreshes every 30 seconds</small></div>
  {error&&<p className="notice error" role="alert">{error}</p>}
  <div className="location-layout"><section className="panel padded location-people"><h2>Recent sharing</h2>{sessions.length?sessions.map(s=><button className={`location-person ${session?.id===s.id?'selected':''}`} key={s.id} onClick={()=>setSelected(s.id)}><span className="avatar"><MapPin size={19}/></span><span><strong>{s.name}</strong><small>{jobs.find(j=>j.id===s.job_id)?.title||'Assigned job'}</small><small>{new Date(s.captured).toLocaleString('en-GB')} · ±{Math.round(s.accuracy)} m</small></span><span className={'location-status '+status(s).toLowerCase()}>{status(s)}</span></button>):<div className="access-intro"><LocateFixed size={34}/><p>No location sharing in the past 24 hours. Start an assigned job, then choose Share my location.</p></div>}</section><section className="panel location-map">{point?<><iframe title={'Last reported position of '+session.name} loading="lazy" referrerPolicy="no-referrer" src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${point.lat}%2C${point.lng}`}/><div className="padded"><strong>{session.name} · {status(session)}</strong><p>Last device position: {point.lat.toFixed(5)}, {point.lng.toFixed(5)} · Accuracy ±{Math.round(point.accuracy)} m</p><small>Map data © OpenStreetMap contributors. {status(session)!=='Sharing'?'This is a previous position, not a current live location.':'Device positions are approximate.'}</small></div></>:<div className="map-placeholder"><MapPin size={42}/><h2>Your team, in context.</h2><p>A map appears when a team member shares their position.</p></div>}</section></div>
  <p className="notice">Sharing requires device permission and an open workspace. A locked phone, lost connection or closed browser can pause updates. “Stale” means the last device position is over two minutes old. Only the most recent position per sharing session is kept; sessions are retained for up to 30 days and this view shows the last 24 hours.</p>
  <section className="panel"><div className="panel-head"><h2>Check-in & check-out history</h2></div><div className="table-scroll"><table><thead><tr><th>Team member</th><th>Job</th><th>Action</th><th>Coordinates</th><th>Recorded</th></tr></thead><tbody>{history.items.map(l=><tr key={l.id}><td>{team.find(t=>t.id===l.actor)?.name||'Team member'}</td><td>{jobs.find(j=>j.id===l.jobId)?.title||'Assigned job'}</td><td>{l.action}</td><td>{l.lat.toFixed(5)}, {l.lng.toFixed(5)}<small>±{Math.round(l.accuracy)} m</small></td><td>{new Date(l.created).toLocaleString('en-GB')}</td></tr>)}</tbody></table></div><Pagination pager={history} label="check-ins"/>{!locations.length&&<p className="padded muted-text">No check-ins recorded yet.</p>}</section>
 </>;
}
