'use client';
import {ToastProvider} from './Toaster';
import {TrackingProvider} from './TrackingProvider';
export default function Providers({children}){return <ToastProvider><TrackingProvider>{children}</TrackingProvider></ToastProvider>;}
