import Workspace from '../../components/LiveWorkspace';
export const dynamicParams = false;
export function generateStaticParams() { return ['login','signup','forgot-password','auth/callback','dashboard','jobs','jobs/detail','schedule','team','cleaners','agents','catalog','customers','properties','enquiries','evidence','locations','reports','settings','access','notifications','tour'].map(p=>({path:p.split('/')})); }
export default function Page() { return <Workspace />; }
