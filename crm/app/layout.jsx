import './crm.css';
import Providers from '../components/Providers';
export const metadata = { title: 'CoreServe Workspace', description: 'Private CoreServe operations workspace', robots: { index: false, follow: false } };
export const viewport = { themeColor: '#062c50' };
export default function Layout({ children }) { return <html lang="en-GB"><body><Providers>{children}</Providers></body></html>; }
