'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {api, API_ORIGIN} from '../lib/api';
import {nav, checks} from '../lib/demo';
import {has, pagePermission} from '../lib/permissions.mjs';
import RoleAccess from './RoleAccess';
import LocationBoard from './LocationBoard';
import {useToast} from './Toaster';
import {useTracking} from './TrackingProvider';
import OperationsPage from './OperationsPage';
import OperationsDashboard from './OperationsDashboard';
import OperationsReports from './OperationsReports';
import AuthScreen from './AuthScreen';
import Pagination, {usePagination} from './Pagination';
import {Avatar, Badge, Empty, Field, Icon, PageHeading} from './ui';
import {JobBusinessFields, MoneyFields, readOperationForm} from './OperationFields';
import {finance, gbp} from '../lib/operations.mjs';

const empty = {jobs: [], team: [], customers: [], properties: [], enquiries: [], evidence: [], issues: [], locations: [], audit: [], roles: [], cleaners: [], agents: [], services: [], areas: [], propertyTypes: []};
const stages = ['Unassigned', 'Assigned', 'In progress', 'Awaiting review', 'Completed', 'Cancelled', 'Re-clean requested'];
const today = () => new Date().toLocaleDateString('en-CA', {timeZone: 'Europe/London'});
const navGroups = [
  ['Overview', ['dashboard']],
  ['Work', ['jobs', 'schedule', 'enquiries', 'evidence']],
  ['People', ['cleaners', 'team', 'locations']],
  ['Clients', ['customers', 'properties', 'agents']],
  ['Insights & admin', ['reports', 'catalog', 'access', 'settings']],
];
const authPages = ['login', 'signup', 'forgot-password', 'auth'];

/** Date helpers for the schedule week strip (dates are YYYY-MM-DD strings). */
const toDate = s => new Date(s + 'T12:00:00Z');
const toKey = d => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = toDate(s); d.setUTCDate(d.getUTCDate() + n); return toKey(d); };
const weekStart = s => addDays(s, -((toDate(s).getUTCDay() + 6) % 7));

function PagedGrid({items, render, label, className = 'card-grid', pageSize = 12, sizes = [12, 24, 48], resetKey = ''}) {
  const pager = usePagination(items, {pageSize, resetKey});
  return <>
    <div className={className}>{pager.items.map(render)}</div>
    <Pagination pager={pager} label={label} sizes={sizes} />
  </>;
}

function JobsTable({jobs, state, user, onOpen, onEdit, busy, resetKey = '', pageSize = 10}) {
  const pager = usePagination(jobs, {pageSize, resetKey});
  if (!jobs.length) return <Empty text="No jobs match this view." hint="Try another date, search or status." icon="BriefcaseBusiness" />;
  const assignee = j => state.cleaners.find(c => c.id === j.cleanerProfileId)?.name || state.team.find(t => t.id === j.cleaner)?.name;
  const canEdit = has(user, 'jobs.edit') || has(user, 'jobs.assign');
  return <>
    <div className="table-scroll">
      <table>
        <thead><tr><th scope="col">Job / property</th><th scope="col">Schedule</th><th scope="col">Assigned to</th><th scope="col">Status</th>{canEdit && <th scope="col"><span className="sr">Actions</span></th>}</tr></thead>
        <tbody>
          {pager.items.map(j => {
            const who = assignee(j);
            return <tr key={j.id}>
              <td><button className="text-link strong" onClick={() => onOpen(j)}>{j.title}</button><small>{[j.customer, j.address].filter(Boolean).join(' · ')}</small></td>
              <td>{j.date}<small>{j.time}–{j.end}</small></td>
              <td>{who ? <span className="person"><Avatar name={who} size="small" />{who}</span> : <span className="muted-text">Unassigned</span>}</td>
              <td><Badge>{j.status}</Badge></td>
              {canEdit && <td className="cell-action"><button disabled={busy} className="button secondary small" onClick={() => onEdit(j)}>Edit</button></td>}
            </tr>;
          })}
        </tbody>
      </table>
    </div>
    <Pagination pager={pager} label="jobs" />
  </>;
}

export default function LiveWorkspace() {
  const pathname = usePathname(), router = useRouter();
  const segments = pathname.split('/').filter(Boolean), page = segments[0] || 'dashboard';
  const [user, setUser] = useState(null), [state, setState] = useState(empty), [ready, setReady] = useState(false), [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(''), [error, setError] = useState(''), [drawer, setDrawer] = useState(null);
  const [query, setQuery] = useState(''), [filter, setFilter] = useState('All jobs'), [menu, setMenu] = useState(false), [collapsed, setCollapsed] = useState(false);
  const [jobId, setJobId] = useState(''), [date, setDate] = useState(today()), [resetToken, setResetToken] = useState('');
  const notify = useToast(), tracking = useTracking();
  const canReview = has(user, 'jobs.review');
  const allowed = nav.filter(([key]) => key === 'settings' || (key === 'access' && (has(user, 'roles.manage') || has(user, 'users.manage'))) || has(user, pagePermission[key])).map(([key]) => key);
  const auth = authPages.includes(page);
  const job = state.jobs.find(j => j.id === jobId);

  async function refresh() { const me = await api('/me'); setUser(me.user); if (me.user) setState(await api('/state')); else setState(empty); }
  useEffect(() => { refresh().catch(e => setError(e.message)).finally(() => setReady(true)); }, []);
  useEffect(() => { try { setCollapsed(localStorage.getItem('crm.sidebar') === 'collapsed'); } catch {} }, []);
  function toggleCollapsed() { const next = !collapsed; setCollapsed(next); try { localStorage.setItem('crm.sidebar', next ? 'collapsed' : 'expanded'); } catch {} }
  useEffect(() => { if (message) { notify(message); setMessage(''); } }, [message, notify]);
  useEffect(() => { if (error) notify(error, 'error'); }, [error, notify]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setJobId(params.get('id') || ''); setResetToken(params.get('token') || '');
    setQuery(''); setFilter('All jobs'); setMenu(false);
  }, [pathname]);
  useEffect(() => {
    if (!menu) return;
    const close = e => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [menu]);
  useEffect(() => {
    if (!drawer) return;
    const previous = document.activeElement;
    const close = e => {
      if (e.key === 'Escape') setDrawer(null);
      if (e.key === 'Tab') {
        const nodes = document.querySelectorAll('.drawer button,.drawer input,.drawer textarea,.drawer select');
        if (!nodes.length) return;
        if (e.shiftKey && document.activeElement === nodes[0]) { e.preventDefault(); nodes[nodes.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === nodes[nodes.length - 1]) { e.preventDefault(); nodes[0].focus(); }
      }
    };
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('keydown', close); previous?.focus(); };
  }, [drawer]);

  async function run(action, success) {
    if (busy) return;
    setBusy(true); setError(''); setMessage('');
    try { await action(); await refresh(); if (success) setMessage(success); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  async function logout() { await tracking.stop(true); await run(() => api('/logout', {method: 'POST'})); router.push('/login'); }
  function formData(e) { e.preventDefault(); return Object.fromEntries(new FormData(e.currentTarget)); }
  const openJob = j => { setJobId(j.id); router.push(`/jobs/detail/?id=${encodeURIComponent(j.id)}`); };
  const button = (text, fn, secondary = false, icon) => <button disabled={busy} className={`button ${secondary ? 'secondary' : ''}`} onClick={fn}>{icon && <Icon name={icon} size={17} />}{text}</button>;
  function showRecord(kind, record = null) { setError(''); setDrawer({kind, record}); }
  async function patchJob(changes) { await run(() => api(`/records/jobs/${job.id}`, {method: 'PATCH', body: {...job, ...changes}}), 'Job updated.'); }
  const assigneeName = j => state.cleaners.find(c => c.id === j.cleanerProfileId)?.name || state.team.find(t => t.id === j.cleaner)?.name || 'Unassigned';
  const jobsTable = (jobs, props = {}) => <JobsTable jobs={jobs} state={state} user={user} busy={busy} onOpen={openJob} onEdit={j => showRecord('jobs', j)} {...props} />;

  if (!ready) return <div className="loading" role="status"><Icon name="LoaderCircle" size={22} /><span>Opening CoreServe Workspace…</span></div>;

  if (auth || !user) {
    const submit = async e => {
      const values = formData(e);
      await run(async () => {
        if (page === 'signup') { const r = await api('/signup', {method: 'POST', body: values}); setMessage(r.message); }
        else if (page === 'forgot-password') { const r = await api(resetToken ? '/reset' : '/reset-request', {method: 'POST', body: resetToken ? {token: resetToken, password: values.password} : values}); setMessage(r.message); }
        else { await api('/login', {method: 'POST', body: values}); router.push('/dashboard'); }
      });
    };
    return <AuthScreen page={page} busy={busy} error={error} resetToken={resetToken} onSubmit={submit} />;
  }

  const navItem = key => nav.find(n => n[0] === key);
  const pageLabel = page === 'jobs' && segments.length > 1 ? 'Job detail' : page === 'notifications' ? 'Activity' : page === 'tour' ? 'Workspace guide' : navItem(page)?.[1] || page;
  const jobsList = state.jobs.filter(j => (filter === 'All jobs' || j.status === filter) && `${j.title} ${j.address} ${j.customer}`.toLowerCase().includes(query.toLowerCase()));
  const week = Array.from({length: 7}, (_, i) => addDays(weekStart(date), i));

  return <div className={`workspace${collapsed ? ' collapsed' : ''}`}>
    <a className="skip" href="#main-content">Skip to content</a>
    <aside className={`sidebar ${menu ? 'mobile-open' : ''}`} aria-label="Workspace navigation">
      <div className="sidebar-top">
        <Link href="/dashboard" className="sidebar-brand" aria-label="CoreServe Workspace overview">
          <img className="brand-full" src="/brand/coreserve-logo-light.png" alt="" />
          <img className="brand-mark" src="/brand/coreserve-mark-light.png" alt="" />
        </Link>
        <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setMenu(false)}><Icon name="X" /></button>
      </div>
      <div className="workspace-name">
        <span className="org-icon" aria-hidden="true">C</span>
        <div><strong>CoreServe Operations</strong><small>{user.role} access</small></div>
      </div>
      <nav>
        {navGroups.map(([group, keys]) => {
          const items = keys.filter(k => allowed.includes(k)).map(navItem).filter(Boolean);
          if (!items.length) return null;
          return <div className="nav-group" key={group}>
            <span className="nav-label">{group}</span>
            {items.map(([href, label, icon]) => {
              const text = user.role === 'Cleaner' && href === 'jobs' ? 'My jobs' : label;
              return <Link key={href} href={`/${href}`} className={page === href ? 'active' : ''} aria-current={page === href ? 'page' : undefined} title={collapsed ? text : undefined} onClick={() => setMenu(false)}>
                <Icon name={icon} size={18} /><span className="nav-text">{text}</span>
              </Link>;
            })}
          </div>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <Link href="/tour" className={page === 'tour' ? 'active' : ''} title={collapsed ? 'Workspace guide' : undefined}><Icon name="CircleHelp" size={18} /><span className="nav-text">Workspace guide</span></Link>
        <button className="signout" onClick={logout} title={collapsed ? 'Sign out' : undefined}><Icon name="LogOut" size={18} /><span className="nav-text">Sign out</span></button>
        <button className="collapse-toggle" onClick={toggleCollapsed} aria-pressed={collapsed} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}><Icon name={collapsed ? 'PanelLeftOpen' : 'PanelLeftClose'} size={18} /><span className="nav-text">Collapse sidebar</span></button>
      </div>
    </aside>
    {menu && <div className="sidebar-backdrop" onClick={() => setMenu(false)} aria-hidden="true" />}

    <div className="workspace-main">
      <header className="topbar">
        <button className="icon-button mobile-toggle" aria-label="Open navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}><Icon name="Menu" /></button>
        <div className="breadcrumb"><span>Workspace</span><Icon name="ChevronRight" size={14} /><strong>{pageLabel}</strong></div>
        <div className="top-actions">
          <Link href="/notifications" className={`icon-button bell ${page === 'notifications' ? 'active' : ''}`} aria-label="Activity and notifications"><Icon name="Bell" /></Link>
          <Link href="/settings" className="user-chip" aria-label={`My profile: ${user.name}`}>
            <Avatar name={user.name} />
            <span><strong>{user.name}</strong><small>{user.role}</small></span>
          </Link>
        </div>
      </header>

      <main className="content" id="main-content" tabIndex={-1}>
        {!allowed.includes(page) && !['tour', 'notifications'].includes(page)
          ? <Empty text="Your role does not have access to this area." hint="Ask an administrator if you need access." icon="Lock" />
          : <>
            {page === 'dashboard' && <OperationsDashboard state={state} user={user} createJob={() => showRecord('jobs')} jobsTable={jobsTable} />}
            {['cleaners', 'agents', 'catalog', 'enquiries'].includes(page) && <OperationsPage page={page} state={state} user={user} refresh={refresh} />}

            {page === 'jobs' && segments.length === 1 && <>
              <PageHeading eyebrow="Job management" title={user.role === 'Cleaner' ? 'My jobs' : 'Jobs'} copy="Assignments and progress, with one clear next step.">
                {has(user, 'jobs.create') && button('Create a job', () => showRecord('jobs'), false, 'Plus')}
              </PageHeading>
              <div className="status-chips" role="group" aria-label="Filter jobs by status">
                {['All jobs', ...stages].map(s => {
                  const count = s === 'All jobs' ? state.jobs.length : state.jobs.filter(j => j.status === s).length;
                  return <button key={s} className={filter === s ? 'selected' : ''} aria-pressed={filter === s} onClick={() => setFilter(s)}>{s}<span>{count}</span></button>;
                })}
              </div>
              <section className="panel">
                <div className="panel-toolbar">
                  <label className="search"><Icon name="Search" size={17} /><input type="search" aria-label="Search jobs" placeholder="Search jobs, customers or addresses" value={query} onChange={e => setQuery(e.target.value)} /></label>
                </div>
                {jobsTable(jobsList, {resetKey: filter + '|' + query})}
              </section>
            </>}

            {page === 'jobs' && segments.length > 1 && (job ? <>
              <Link className="back-link" href="/jobs"><Icon name="ArrowLeft" size={16} />All jobs</Link>
              <PageHeading eyebrow={job.service} title={job.title} copy={[job.customer, job.address].filter(Boolean).join(' · ')}><Badge>{job.status}</Badge></PageHeading>
              <div className="detail-grid">
                <div className="detail-col">
                  <section className="panel padded">
                    <h2>Property & assignment</h2>
                    <div className="job-facts">
                      <p><span><Icon name="MapPin" size={17} /></span><span><small>Address</small>{job.address}{job.postcode ? ' · ' + job.postcode : ''}</span></p>
                      <p><span><Icon name="Clock3" size={17} /></span><span><small>Schedule</small>{job.date} · {job.time}–{job.end}</span></p>
                      <p><span><Icon name="UserRound" size={17} /></span><span><small>Assigned to</small>{assigneeName(job)}</span></p>
                    </div>
                    <div className="job-notes"><small>Instructions</small><p>{job.notes || 'No additional instructions.'}</p></div>
                    {(has(user, 'jobs.edit') || has(user, 'jobs.assign')) && button('Edit job & assignment', () => showRecord('jobs', job), true, 'PencilLine')}
                  </section>
                  <section className="panel padded">
                    <div className="section-title"><h2>Job checklist</h2><span>{(job.checklist || []).filter(Boolean).length} of {checks.length} done</span></div>
                    <div className="progress-track" role="progressbar" aria-label="Checklist progress" aria-valuemin={0} aria-valuemax={checks.length} aria-valuenow={(job.checklist || []).filter(Boolean).length}><span style={{width: `${(job.checklist || []).filter(Boolean).length / checks.length * 100}%`}} /></div>
                    <div className="checklist">
                      {checks.map((c, i) => <label key={c}><input type="checkbox" disabled={busy || job.status === 'Completed' || !has(user, 'jobs.work')} checked={!!job.checklist?.[i]} onChange={() => { const list = [...(job.checklist || Array(6).fill(false))]; list[i] = !list[i]; patchJob({checklist: list}); }} />{c}</label>)}
                    </div>
                  </section>
                  <section className="panel padded">
                    <h2>Photo evidence</h2>
                    <form className="upload-form" onSubmit={async e => { e.preventDefault(); const form = new FormData(e.currentTarget); const element = e.currentTarget; await run(async () => { await api(`/jobs/${job.id}/photos`, {method: 'POST', body: form}); element.reset(); }, 'Photo uploaded privately.'); }}>
                      <Field name="stage" label="Evidence stage" options={['Before', 'After']} />
                      <label className="field"><span>Photograph</span><input type="file" name="file" accept="image/jpeg,image/png,image/webp" required /><small>JPG, PNG or WebP, up to 5 MB.</small></label>
                      <button className="button" disabled={busy || job.status === 'Completed' || !has(user, 'evidence.upload')}><Icon name="Upload" size={17} />Upload evidence</button>
                    </form>
                    <div className="photo-grid">{state.evidence.filter(e => e.jobId === job.id).map(e => <figure key={e.id}><img src={`${API_ORIGIN}/api/media/${e.id}`} alt={`${e.stage}: ${e.name}`} /><figcaption>{e.stage} · {e.name}</figcaption></figure>)}</div>
                  </section>
                </div>
                <div className="detail-col">
                  {has(user, 'finance.view') && <section className="panel padded">
                    <h2>Quote & payment</h2>
                    <div className="mini-figures"><div><small>Quoted</small><strong>{gbp(finance(job).quote)}</strong></div><div><small>Balance</small><strong>{gbp(finance(job).balance)}</strong></div></div>
                    <form onSubmit={e => { e.preventDefault(); let data; try { data = readOperationForm(e.currentTarget, 'jobs'); } catch (err) { setError(err.message); return; } run(() => api('/operations/jobs/' + job.id, {method: 'PATCH', body: {...data, version: job.version}}), 'Financial details saved.'); }}>
                      <MoneyFields record={job} user={user} />
                      {has(user, 'finance.edit') && <button className="button secondary" disabled={busy}>Save financial details</button>}
                    </form>
                  </section>}
                  <section className="panel padded">
                    <h2>Job actions</h2>
                    <div className="action-grid">
                      {has(user, 'jobs.work') && button('Start job', () => patchJob({status: 'In progress'}), false, 'Play')}
                      {has(user, 'jobs.work') && button('Submit for review', () => patchJob({status: 'Awaiting review'}), true, 'Send')}
                      {canReview && button('Approve completion', () => patchJob({status: 'Completed'}), true, 'BadgeCheck')}
                      {has(user, 'jobs.work') && button('Report an issue', () => setDrawer({kind: 'issues', jobId: job.id}), true, 'TriangleAlert')}
                      {has(user, 'locations.track') && ['Check in', 'Check out'].map(action => button(action, () => {
                        if (!navigator.geolocation) { setError('This device does not support location capture.'); return; }
                        navigator.geolocation.getCurrentPosition(position => run(() => api('/records/locations', {method: 'POST', body: {jobId: job.id, action, lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy, captured: new Date(position.timestamp).toISOString()}}), `${action} location recorded.`).then(() => { if (action === 'Check out') tracking.stop(true); }), () => setError('Location permission was denied or location is unavailable.'), {enableHighAccuracy: true, timeout: 15000});
                      }, true, action === 'Check in' ? 'LogIn' : 'LogOut'))}
                      {has(user, 'jobs.delete') && <button disabled={busy} className="button danger-outline" onClick={() => setDrawer({kind: 'delete', record: job, collection: 'jobs'})}><Icon name="Trash2" size={17} />Delete job</button>}
                    </div>
                    {has(user, 'locations.track') && [job.cleaner, job.supervisor].includes(user.id) && <div className="sharing-controls">
                      <h3>Share my location</h3>
                      <p>Share your device position while working on this job. Start the job first. Keep this workspace open; stop sharing whenever you choose.</p>
                      {tracking.sharing?.jobId === job.id
                        ? <button className="button secondary" onClick={() => tracking.stop()}>Stop sharing</button>
                        : <button className="button secondary" disabled={tracking.busy || job.status !== 'In progress'} onClick={() => tracking.start(job)}>{tracking.busy ? 'Finding your location…' : 'Start sharing location'}</button>}
                    </div>}
                  </section>
                  <section className="panel padded">
                    <h2>Issues</h2>
                    {state.issues.filter(i => i.jobId === job.id).map(i => <div className="notice warning" key={i.id}><strong>{i.title}</strong><p>{i.details}</p></div>)}
                    {!state.issues.some(i => i.jobId === job.id) && <p className="muted-text">No issues reported for this job.</p>}
                  </section>
                </div>
              </div>
            </> : <Empty text="Job not found or access denied." hint="Return to the job list and choose another job." icon="SearchX" />)}

            {page === 'schedule' && <>
              <PageHeading eyebrow="Team calendar" title="Schedule" copy="Choose a day to see the work planned for it.">
                {has(user, 'jobs.create') && button('Schedule a job', () => showRecord('jobs'), false, 'Plus')}
              </PageHeading>
              <section className="panel schedule-bar">
                <div className="schedule-nav">
                  <button className="icon-button bordered" aria-label="Previous week" onClick={() => setDate(addDays(date, -7))}><Icon name="ChevronLeft" /></button>
                  <strong>{new Intl.DateTimeFormat('en-GB', {month: 'long', year: 'numeric', timeZone: 'UTC'}).format(toDate(date))}</strong>
                  <button className="icon-button bordered" aria-label="Next week" onClick={() => setDate(addDays(date, 7))}><Icon name="ChevronRight" /></button>
                  <button className="button secondary small" onClick={() => setDate(today())}>Today</button>
                  <label className="schedule-date"><span className="sr">Selected date</span><input type="date" value={date} onChange={e => e.target.value && setDate(e.target.value)} /></label>
                </div>
                <div className="day-tabs" role="group" aria-label="Days of the week">
                  {week.map(d => {
                    const count = state.jobs.filter(j => j.date === d).length, day = toDate(d);
                    return <button key={d} className={`${d === date ? 'selected' : ''} ${d === today() ? 'is-today' : ''}`} aria-pressed={d === date} onClick={() => setDate(d)}>
                      <small>{new Intl.DateTimeFormat('en-GB', {weekday: 'short', timeZone: 'UTC'}).format(day)}</small>
                      <strong>{day.getUTCDate()}</strong>
                      <span>{count ? `${count} job${count > 1 ? 's' : ''}` : 'Free'}</span>
                    </button>;
                  })}
                </div>
              </section>
              <section className="panel">
                <div className="panel-head"><h2>{new Intl.DateTimeFormat('en-GB', {dateStyle: 'full', timeZone: 'UTC'}).format(toDate(date))}</h2></div>
                {jobsTable(state.jobs.filter(j => j.date === date), {resetKey: date})}
              </section>
            </>}

            {['customers', 'properties'].includes(page) && <>
              <PageHeading eyebrow={page === 'customers' ? 'Relationships' : 'Property records'} title={page === 'customers' ? 'Customers' : 'Properties'} copy={page === 'customers' ? 'Good relationships start here.' : 'Every property. Every detail.'}>
                {has(user, page + '.create') && button('Add ' + (page === 'customers' ? 'customer' : 'property'), () => showRecord(page), false, 'Plus')}
              </PageHeading>
              {state[page].length
                ? <PagedGrid items={state[page]} label={page} render={r => <article className="panel padded record-card" key={r.id}>
                    <div className="record-top"><span className="record-icon"><Icon name={page === 'properties' ? 'Building2' : 'ContactRound'} /></span>{page === 'enquiries' && <Badge>{r.stage}</Badge>}</div>
                    <h2>{r.name}</h2>
                    <p>{r.address || r.email || 'No address recorded'}</p>
                    <div className="record-detail">
                      {r.phone && <span><Icon name="Phone" size={15} />{r.phone}</span>}
                      {r.details && <span><Icon name="StickyNote" size={15} />{r.details}</span>}
                    </div>
                    <div className="card-actions">
                      {has(user, page + '.edit') && button('Edit', () => showRecord(page, r), true, 'PencilLine')}
                      {has(user, page + '.delete') && <button disabled={busy} className="button ghost-danger" onClick={() => setDrawer({kind: 'delete', record: r, collection: page})}><Icon name="Trash2" size={16} />Delete</button>}
                    </div>
                  </article>} />
                : <Empty icon={page === 'properties' ? 'Building2' : 'ContactRound'} />}
            </>}

            {page === 'team' && <>
              <PageHeading eyebrow="People & availability" title="Workspace accounts" copy="Activate new accounts and manage team access.">
                {has(user, 'users.manage') && button('Add team account', () => showRecord('team'), false, 'UserPlus')}
              </PageHeading>
              <PagedGrid items={state.team} label="accounts" render={t => <article className="panel padded person-card" key={t.id}>
                <div className="person-top"><Avatar name={t.name} size="large" /><div><h2>{t.name}</h2><p>{t.email}</p></div></div>
                <div className="badge-row"><Badge>{t.role}</Badge><Badge>{t.status || 'Active'}</Badge></div>
                <dl className="record-detail">
                  <div><dt>Coverage</dt><dd>{t.profile?.coverage || 'Not set'}</dd></div>
                  <div><dt>Travel</dt><dd>{t.profile?.travel || 'Not set'}</dd></div>
                  <div><dt>Availability</dt><dd>{t.profile?.availability || 'Not set'}</dd></div>
                </dl>
                {has(user, 'users.manage') && <Link className="button secondary" href="/access/?tab=users">Manage access</Link>}
              </article>} />
            </>}

            {page === 'evidence' && <>
              <PageHeading eyebrow="Quality & evidence" title="Photo evidence" copy="Private photo evidence attached to authorised jobs." />
              {state.evidence.length
                ? <PagedGrid items={state.evidence} label="photos" render={e => {
                    const j = state.jobs.find(x => x.id === e.jobId);
                    return <article className="panel evidence-card" key={e.id}>
                      <img src={`${API_ORIGIN}/api/media/${e.id}`} alt={`${e.stage}: ${e.name}`} />
                      <div className="padded"><Badge>{e.stage}</Badge><h3>{j?.title || 'Job unavailable'}</h3>{j && button('Open job', () => openJob(j), true)}</div>
                    </article>;
                  }} />
                : <Empty text="No photos uploaded yet." hint="Upload before and after photos from a job's detail page." icon="Images" />}
            </>}

            {page === 'locations' && <LocationBoard jobs={state.jobs} team={state.team} locations={state.locations} />}
            {page === 'reports' && <OperationsReports state={state} user={user} />}
            {page === 'access' && <RoleAccess user={user} roles={state.roles} team={state.team} refresh={refresh} />}

            {page === 'settings' && (() => {
              const mine = state.jobs.filter(j => j.cleaner === user.id || j.supervisor === user.id);
              const myActivity = state.audit.filter(a => a.actor === user.id).slice(0, 5);
              return <>
                <section className="profile-hero">
                  <div className="profile-cover" aria-hidden="true" />
                  <div className="profile-identity">
                    <Avatar name={user.name} size="xl" />
                    <div className="profile-name">
                      <span className="eyebrow">My profile</span>
                      <h1>{user.name}</h1>
                      <p><Icon name="Mail" size={15} />{user.email}</p>
                    </div>
                    <div className="profile-badges"><Badge>{user.role}</Badge><Badge>{user.status || 'Active'}</Badge>{user.owner && <Badge>Owner</Badge>}</div>
                  </div>
                  <dl className="profile-stats">
                    <div><dt>Assigned jobs</dt><dd>{mine.length}</dd></div>
                    <div><dt>In progress</dt><dd>{mine.filter(j => j.status === 'In progress').length}</dd></div>
                    <div><dt>Completed</dt><dd>{mine.filter(j => j.status === 'Completed').length}</dd></div>
                    <div><dt>Permissions</dt><dd>{(user.permissions || []).length}</dd></div>
                  </dl>
                </section>
                <form className="settings-grid" onSubmit={e => { const values = formData(e); run(async () => { const r = await api('/profile', {method: 'PATCH', body: values}); if (r.reauth) { router.push('/login'); setMessage('Password changed. Please sign in again.'); } }, 'Profile saved.'); }}>
                  <section className="panel padded">
                    <div className="section-title"><span className="section-icon"><Icon name="UserRound" size={18} /></span><div><h2>Personal details</h2><p>How you appear to the rest of the team.</p></div></div>
                    <Field name="name" label="Full name" value={user.name} required autoComplete="name" />
                    <div className="form-row">
                      <label className="field"><span>Email</span><input value={user.email} readOnly /></label>
                      <label className="field"><span>Role</span><input value={user.role} readOnly /></label>
                    </div>
                    <div className="form-row">
                      <Field name="coverage" label="Areas / postcodes I cover" value={user.profile?.coverage} />
                      <Field name="travel" label="Means of travel" value={user.profile?.travel} />
                    </div>
                    <Field name="availability" label="Weekly availability (days and times)" type="textarea" value={user.profile?.availability} />
                  </section>
                  <section className="panel padded">
                    <div className="section-title"><span className="section-icon"><Icon name="ShieldCheck" size={18} /></span><div><h2>Security</h2><p>Leave blank to keep your current password. Changing it signs you out everywhere.</p></div></div>
                    <Field name="currentPassword" label="Current password" type="password" autoComplete="current-password" />
                    <Field name="newPassword" label="New password (10+ characters)" type="password" autoComplete="new-password" />
                    <h3 className="spaced">Your recent activity</h3>
                    {myActivity.length
                      ? <ul className="mini-timeline">{myActivity.map(a => <li key={a.id}><strong>{a.action}</strong><small>{new Date(a.created).toLocaleString('en-GB')}</small></li>)}</ul>
                      : <p className="muted-text">Your recent actions will appear here.</p>}
                  </section>
                  <div className="settings-actions"><button disabled={busy} className="button"><Icon name="Save" size={17} />{busy ? 'Saving…' : 'Save profile'}</button></div>
                </form>
              </>;
            })()}

            {page === 'notifications' && <>
              <PageHeading eyebrow="Activity" title="You’re in the loop." copy="Recent workspace changes." />
              <section className="panel padded">
                {state.audit.length
                  ? <PagedGrid items={state.audit} label="events" className="activity-list" pageSize={15} sizes={[15, 30, 60]} render={a => <div className="notification-row" key={a.id}>
                      <Avatar name={a.name} size="small" />
                      <div><strong>{a.action}</strong><span>{a.name}</span></div>
                      <small>{new Date(a.created).toLocaleString('en-GB')}</small>
                    </div>} />
                  : <Empty text="No activity yet." hint="Changes you're allowed to see will appear here." icon="Bell" />}
              </section>
            </>}

            {page === 'tour' && <>
              <PageHeading eyebrow="Workspace guide" title="From first hello to job complete." copy="A practical guide to your connected pilot." />
              <div className="card-grid guide-grid">
                {[['team', 'UserRoundCog', 'Approve your team', 'Review pending signups and assign the correct role.'], ['customers', 'ContactRound', 'Add your customers', 'Create customer and property records.'], ['jobs', 'BriefcaseBusiness', 'Plan the work', 'Create jobs, select the cleaner and supervisor, and set the date.'], ['evidence', 'Images', 'Document the finish', 'Complete checklists, upload before/after photographs and submit for review.'], ['locations', 'MapPin', 'Share during the job', 'Start an assigned job, then choose Start sharing location. Stop whenever you choose.'], ['settings', 'Settings', 'Keep your account secure', 'Change your temporary password from My Profile.']].filter(([p]) => allowed.includes(p)).map(([p, icon, title, copy], i) =>
                  <article className="panel padded guide-card" key={p}><span className="guide-step">{i + 1}</span><span className="record-icon"><Icon name={icon} /></span><h2>{title}</h2><p>{copy}</p><Link className="text-link" href={`/${p}`}>Open {navItem(p)?.[1] || p} <Icon name="ArrowRight" size={15} /></Link></article>)}
              </div>
            </>}
          </>}
      </main>
      <footer className="workspace-footer"><span>CoreServe Workspace</span><span>Thoughtfully organised. Carefully delivered.</span></footer>
    </div>

    {drawer && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget && !busy) setDrawer(null); }}>
      <section className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header className="drawer-head">
          <div><span className="eyebrow">CoreServe operations</span><h2 id="drawer-title">{drawer.kind === 'delete' ? 'Delete record' : drawer.kind === 'team' ? 'Request a team account' : drawer.kind === 'issues' ? 'Report an issue' : `${drawer.record ? 'Edit' : 'Create'} ${drawer.kind === 'jobs' ? 'job' : drawer.kind === 'properties' ? 'property' : drawer.kind.replace(/s$/, '')}`}</h2></div>
          <button className="icon-button" aria-label="Close dialog" autoFocus onClick={() => setDrawer(null)}><Icon name="X" /></button>
        </header>
        <div className="drawer-body">
          {error && <div className="notice error" role="alert">{error}</div>}
          {drawer.kind === 'delete'
            ? <div className="confirm-delete">
                <span className="confirm-icon"><Icon name="Trash2" size={22} /></span>
                <p>Delete “{drawer.record.name || drawer.record.title}”? This removes it from the CRM and cannot be undone.</p>
                <div className="drawer-actions">
                  <button disabled={busy} className="button danger" onClick={() => run(async () => { await api(`/records/${drawer.collection}/${drawer.record.id}`, {method: 'DELETE'}); setDrawer(null); if (drawer.collection === 'jobs') router.push('/jobs'); }, 'Record deleted.')}>Delete record</button>
                  <button className="button secondary" onClick={() => setDrawer(null)}>Cancel</button>
                </div>
              </div>
            : <form onSubmit={e => {
                let values;
                try { values = readOperationForm(e.currentTarget, drawer.kind); e.preventDefault(); } catch (err) { e.preventDefault(); setError(err.message); return; }
                run(async () => {
                  if (drawer.kind === 'team') await api('/signup', {method: 'POST', body: values});
                  else {
                    const record = drawer.record;
                    await api(`/records/${drawer.kind}${record ? '/' + record.id : ''}`, {method: record ? 'PATCH' : 'POST', body: {...values, ...(record ? {version: record.version} : {}), ...(drawer.jobId ? {jobId: drawer.jobId} : {}), ...(drawer.kind === 'jobs' && !record ? {checklist: Array(6).fill(false)} : {})}});
                  }
                  setDrawer(null);
                }, drawer.kind === 'team' ? 'Account created as Pending. Activate it in Team.' : 'Record saved.');
              }}>
                {drawer.kind === 'jobs' ? <>
                  <Field disabled={!!drawer.record && !has(user, 'jobs.edit')} name="title" label="Job title" value={drawer.record?.title} required />
                  <Field disabled={!!drawer.record && !has(user, 'jobs.edit')} name="service" label="Service" value={drawer.record?.service} options={[...(state.services.length ? state.services.filter(s => s.active !== false).map(s => s.name) : ['Domestic cleaning', 'Airbnb & Housekeeping', 'Deep cleaning', 'End-of-tenancy', 'Office cleaning', 'After-builders']), ...(drawer.record?.service && !state.services.some(s => s.name === drawer.record.service) ? [drawer.record.service] : [])]} />
                  <Field disabled={!!drawer.record && !has(user, 'jobs.edit')} name="customer" label="Customer" value={drawer.record?.customer} />
                  <Field disabled={!!drawer.record && !has(user, 'jobs.edit')} name="address" label="Property address" value={drawer.record?.address} required />
                  <div className="form-row">
                    <Field disabled={!!drawer.record && !has(user, 'jobs.edit')} name="postcode" label="Postcode" value={drawer.record?.postcode} />
                    <Field disabled={!!drawer.record && !has(user, 'jobs.edit')} name="date" label="Date" type="date" value={drawer.record?.date || today()} required />
                  </div>
                  <div className="form-row">
                    <Field disabled={!!drawer.record && !has(user, 'jobs.edit')} name="time" label="Start" type="time" value={drawer.record?.time || '09:00'} required />
                    <Field disabled={!!drawer.record && !has(user, 'jobs.edit')} name="end" label="Finish" type="time" value={drawer.record?.end || '11:00'} required />
                  </div>
                  <div className="form-row">
                    <Field disabled={!has(user, 'jobs.assign')} name="cleaner" label="Cleaner" value={drawer.record?.cleanerProfileId ? 'directory:' + drawer.record.cleanerProfileId : drawer.record?.cleaner} options={[{value: '', label: 'Assign later'}, ...state.cleaners.filter(c => !['Paused', 'Left'].includes(c.cleanerStatus)).map(c => ({value: 'directory:' + c.id, label: c.name + ' · directory'})), ...state.team.filter(t => has(t, 'jobs.work') && has(t, 'jobs.view') && t.status === 'Active').map(t => ({value: t.id, label: t.name}))]} />
                    <Field disabled={!has(user, 'jobs.assign')} name="supervisor" label="Supervisor" value={drawer.record?.supervisor} options={[{value: '', label: 'Assign later'}, ...state.team.filter(t => has(t, 'jobs.review') && has(t, 'jobs.view') && t.status === 'Active').map(t => ({value: t.id, label: t.name}))]} />
                  </div>
                  <Field disabled={!!drawer.record && !has(user, 'jobs.edit')} name="status" label="Status" value={drawer.record?.status} options={stages} />
                  <Field disabled={!!drawer.record && !has(user, 'jobs.edit')} name="notes" label="Instructions" type="textarea" value={drawer.record?.notes} />
                  {(!drawer.record || has(user, 'jobs.edit')) && <JobBusinessFields record={drawer.record || {}} state={state} user={user} />}
                </> : drawer.kind === 'team' ? <>
                  <Field name="name" label="Full name" required />
                  <Field name="email" label="Email" type="email" required />
                  <Field name="password" label="Temporary password (10+ characters)" type="password" required autoComplete="new-password" />
                </> : drawer.kind === 'issues' ? <>
                  <Field name="title" label="Issue title" required />
                  <Field name="details" label="Describe the issue" type="textarea" required />
                </> : <>
                  <Field name="name" label="Name / subject" value={drawer.record?.name} required />
                  <div className="form-row">
                    <Field name="email" label="Email" type="email" value={drawer.record?.email} />
                    <Field name="phone" label="Phone" value={drawer.record?.phone} />
                  </div>
                  <Field name="address" label="Address / postcode" value={drawer.record?.address} />
                  {drawer.kind === 'enquiries' && <Field name="stage" label="Pipeline stage" value={drawer.record?.stage} options={['New enquiry', 'Quote sent', 'Follow-up', 'Booked']} />}
                  <Field name="details" label="Notes / instructions" type="textarea" value={drawer.record?.details} />
                </>}
                <div className="drawer-actions sticky">
                  <button className="button" disabled={busy}><Icon name="Check" size={17} />{busy ? 'Saving…' : 'Save'}</button>
                  <button type="button" className="button secondary" onClick={() => setDrawer(null)} disabled={busy}>Cancel</button>
                </div>
              </form>}
        </div>
      </section>
    </div>}
  </div>;
}
