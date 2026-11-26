'use client';
import {createContext,useCallback,useContext,useEffect,useState} from 'react';
import {CheckCircle2,AlertCircle,Info,X} from 'lucide-react';
const ToastContext=createContext(null);
function Toast({item,dismiss}){
 const [paused,setPaused]=useState(false);
 useEffect(()=>{if(paused)return;const timer=setTimeout(()=>dismiss(item.id),item.type==='error'?12000:6500);return()=>clearTimeout(timer);},[paused,item,dismiss]);
 const Icon=item.type==='success'?CheckCircle2:item.type==='error'?AlertCircle:Info;
 return <div className={`crm-toast ${item.type}`} role={item.type==='error'?'alert':'status'} onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocus={()=>setPaused(true)} onBlur={()=>setPaused(false)}><Icon size={22}/><p>{item.message}</p><button type="button" onClick={()=>dismiss(item.id)} aria-label="Dismiss notification"><X size={17}/></button></div>;
}
export function ToastProvider({children}){
 const [items,setItems]=useState([]);
 const dismiss=useCallback(id=>setItems(list=>list.filter(item=>item.id!==id)),[]);
 const notify=useCallback((message,type='success')=>{if(message)setItems(list=>[...list.slice(-3),{id:crypto.randomUUID(),message,type}]);},[]);
 return <ToastContext.Provider value={notify}>{children}<div className="crm-toaster" aria-label="Workspace notifications">{items.map(item=><Toast key={item.id} item={item} dismiss={dismiss}/>)}</div></ToastContext.Provider>;
}
export const useToast=()=>useContext(ToastContext);
