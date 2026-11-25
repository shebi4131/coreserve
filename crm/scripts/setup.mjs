import {readFile,mkdir,writeFile,unlink} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {randomBytes,pbkdf2Sync,randomUUID} from 'node:crypto';
import {createInterface} from 'node:readline';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
process.stdout.write('Enter initial Superadmin password on stdin (minimum 10 characters).\n');
const rl=createInterface({input:process.stdin});
for await(const line of rl){
 if(line.length<10||line.length>128)throw new Error('Password must be 10–128 characters.');
 const salt=randomBytes(16).toString('hex'),hash=`${salt}:${pbkdf2Sync(line,Buffer.from(salt,'hex'),100000,32,'sha256').toString('hex')}`;
 await mkdir(path.join(root,'.local'),{recursive:true});const file=path.join(root,'.local/bootstrap.sql');
 const sql=await readFile(path.join(root,'migrations/0001_initial.sql'),'utf8');
 await writeFile(file,sql+`\nINSERT OR IGNORE INTO users(id,email,name,password,role,status,created) VALUES('${randomUUID()}','info@coreservegroup.co.uk','CoreServe Administrator','${hash}','Superadmin','Active','${new Date().toISOString()}');`);
 const command=path.join(root,'../node_modules/wrangler/bin/wrangler.js');
 const r=spawnSync(process.execPath,[command,'d1','execute','coreserve-crm','--local','--file',file],{cwd:root,stdio:'inherit'});
 await unlink(file);if(r.status)process.exit(r.status);console.log('Local database initialised. Existing accounts and passwords were preserved.');rl.close();break;
}
