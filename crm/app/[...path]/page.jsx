import Workspace from '../../components/Workspace';
export const dynamicParams = false;
export function generateStaticParams() { return ['login','signup','forgot-password','auth/callback','dashboard','jobs','jobs/CS-1042','jobs/CS-1043','jobs/CS-1044','jobs/CS-1045',...Array.from({length:20},(_,i)=>`jobs/DEMO-${i+1}`),'schedule','team','customers','properties','enquiries','evidence','locations','reports','settings','access','notifications','tour'].map(p=>({path:p.split('/')})); }
export default function Page() { return <Workspace />; }
