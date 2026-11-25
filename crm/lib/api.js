export const API_ORIGIN='';
export async function api(path,{method='GET',body}={}){
 const form=typeof FormData!=='undefined'&&body instanceof FormData;
 const response=await fetch(`${API_ORIGIN}/api${path}`,{method,credentials:'include',headers:{'X-CRM-Request':'1',...(!form&&body?{'Content-Type':'application/json'}:{})},body:body?(form?body:JSON.stringify(body)):undefined});
 const data=await response.json();if(!response.ok)throw new Error(data.error||'Request failed.');return data;
}
