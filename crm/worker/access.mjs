import {has,permissionKeys} from '../lib/permissions.mjs';
export {has};
export function deny(message='You do not have permission for this action.',status=403){throw Object.assign(new Error(message),{status});}
export function need(user,key){if(!has(user,key))deny();}
export async function hydrate(env,user){
 if(!user)return null;
 const role=await env.DB.prepare('SELECT * FROM roles WHERE id=?').bind(user.role_key||user.role.toLowerCase()).first();
 return {...user,role:role?.name||'Unassigned',roleId:role?.id||'',permissions:role?JSON.parse(role.permissions):[],owner:user.email===env.SUPERADMIN_EMAIL};
}
export async function getRoles(env){return (await env.DB.prepare('SELECT * FROM roles ORDER BY name').all()).results.map(r=>({...r,permissions:JSON.parse(r.permissions)}));}
export function validateRole(actor,b){
 const name=typeof b.name==='string'?b.name.trim():'';
 if(!name||name.length>60)deny('Role name must contain 1–60 characters.',400);
 if(!Array.isArray(b.permissions)||b.permissions.some(p=>!permissionKeys.includes(p)))deny('Choose valid permissions.',400);
 const permissions=[...new Set(b.permissions)];
 if(!actor.owner&&permissions.some(p=>!has(actor,p)))deny('You can only grant permissions you hold.');
 return {name,permissions};
}
export function grantable(actor,role){if(!actor.owner&&role.permissions.some(p=>!has(actor,p)))deny('You cannot manage a role with permissions beyond your own.');}
