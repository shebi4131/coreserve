'use client';
import Link from 'next/link';
import {ArrowRight, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, HandCoins, Inbox, Plus, TrendingUp, Users} from 'lucide-react';
import {has} from '../lib/permissions.mjs';
import {finance, gbp, isDue, rowsForOperations, ukToday} from '../lib/operations.mjs';

// Fixed categorical order, validated for colour-vision deficiency (see dataviz validator run).
// Unassigned uses a neutral grey because it is "no state yet", not a category.
const statusGroups = [
  ['Unassigned', ['Unassigned'], 'var(--chart-neutral)'],
  ['Assigned', ['Assigned'], 'var(--chart-1)'],
  ['In progress', ['In progress'], 'var(--chart-2)'],
  ['Awaiting review', ['Awaiting review'], 'var(--chart-3)'],
  ['Completed', ['Completed'], 'var(--chart-4)'],
  ['Cancelled / re-clean', ['Cancelled', 'Re-clean requested'], 'var(--chart-5)'],
];

const addDays = (s, n) => { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const weekday = s => new Intl.DateTimeFormat('en-GB', {weekday: 'short', timeZone: 'UTC'}).format(new Date(s + 'T12:00:00Z'));

function Panel({eyebrow, title, action, children, className = ''}) {
  return (
    <section className={`panel dash-panel ${className}`}>
      <div className="panel-head">
        <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>
        {action}
      </div>
      <div className="dash-body">{children}</div>
    </section>
  );
}

export default function OperationsDashboard({state, user, createJob, jobsTable}) {
  const today = ukToday(), rows = rowsForOperations(state);
  const booked = state.jobs.filter(j => j.status !== 'Cancelled' && j.bookingStatus !== 'Cancelled');
  const closed = state.jobs.filter(j => j.status === 'Completed');
  const newLeads = state.enquiries.filter(r => !r.leadStatus || r.leadStatus === 'New');
  const quoteSent = state.enquiries.filter(r => r.leadStatus === 'Quote Sent');
  const leadDue = rows.filter(r => isDue(r.followupDate) && !['Lost', 'Not Interested'].includes(r.leadStatus));
  const agentDue = (state.agents || []).filter(a => isDue(a.followupDate) && a.outreachStatus !== 'Not interested');
  const pendingAgents = (state.agents || []).filter(a => a.outreachStatus === 'Pending');
  const cleaners = state.cleaners || [];
  const financial = has(user, 'finance.view');
  const totals = rows.reduce((a, r) => { const f = finance(r); for (const k of ['quote', 'paid', 'balance']) a[k] += f[k]; return a; }, {quote: 0, paid: 0, balance: 0});
  const profit = booked.reduce((sum, j) => sum + finance(j).profit, 0);
  const jobsToday = state.jobs.filter(j => j.date === today);
  const conversion = rows.length ? Math.round(booked.length / rows.length * 100) : 0;
  const collected = totals.quote ? Math.min(100, Math.round(totals.paid / totals.quote * 100)) : 0;
  const firstName = user.name.split(' ')[0];
  const hour = Number(new Intl.DateTimeFormat('en-GB', {hour: 'numeric', hour12: false, timeZone: 'Europe/London'}).format(new Date()));
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const kpis = [
    {label: 'Open pipeline', value: rows.length, note: `${newLeads.length} new enquiries`, icon: Inbox, href: '/enquiries', tone: 'blue', visible: has(user, 'enquiries.view')},
    {label: 'Jobs today', value: jobsToday.length, note: `${state.jobs.filter(j => j.status === 'In progress').length} in progress now`, icon: CalendarDays, href: '/schedule', tone: 'teal', visible: has(user, 'jobs.view')},
    {label: 'Cleaners on board', value: cleaners.length, note: `${cleaners.filter(c => ['Available', 'Active'].includes(c.cleanerStatus)).length} available or active`, icon: Users, href: '/cleaners', tone: 'navy', visible: has(user, 'cleaners.view')},
    {label: 'Follow-ups due', value: leadDue.length + agentDue.length, note: `${leadDue.length} enquiries · ${agentDue.length} agencies`, icon: Clock3, href: leadDue.length ? '/enquiries' : '/agents', tone: leadDue.length + agentDue.length ? 'amber' : 'green', visible: has(user, 'enquiries.view') || has(user, 'agents.view')},
  ].filter(k => k.visible);

  const attention = [
    [has(user, 'enquiries.view'), newLeads.length, 'New enquiries to contact', 'Keep the first response moving.', '/enquiries'],
    [has(user, 'enquiries.view'), leadDue.length, 'Enquiry follow-ups due', 'Customers waiting to hear from you.', '/enquiries'],
    [has(user, 'agents.view'), pendingAgents.length, 'Agencies awaiting contact', 'Build relationships with local property teams.', '/agents'],
    [has(user, 'agents.view'), agentDue.length, 'Agency follow-ups due', 'Pick up your next conversation.', '/agents'],
    [has(user, 'cleaners.sensitive'), cleaners.filter(c => c.rtwDocsChecked !== 'Yes').length, 'Cleaner document checks', 'Self-reported right to work is separate from a completed check.', '/cleaners'],
    [has(user, 'jobs.review'), state.jobs.filter(j => j.status === 'Awaiting review').length, 'Jobs awaiting review', 'Approve completed work and evidence.', '/jobs'],
  ].filter(([visible]) => visible);

  const funnel = [['Enquiries', rows.length], ['New', newLeads.length], ['Quote sent', quoteSent.length], ['Booked', booked.length], ['Completed', closed.length]];
  const funnelMax = Math.max(1, ...funnel.map(([, n]) => n));

  const week = Array.from({length: 7}, (_, i) => addDays(today, i)).map(d => ({date: d, count: state.jobs.filter(j => j.date === d && j.status !== 'Cancelled').length}));
  const weekMax = Math.max(1, ...week.map(d => d.count));
  const weekTotal = week.reduce((s, d) => s + d.count, 0);

  const status = statusGroups.map(([label, keys, color]) => ({label, color, count: state.jobs.filter(j => keys.includes(j.status)).length}));
  const statusTotal = status.reduce((s, x) => s + x.count, 0);

  const sources = [...new Set(rows.map(r => r.source || 'Other'))].map(name => ({name, count: rows.filter(r => (r.source || 'Other') === name).length})).sort((a, b) => b.count - a.count).slice(0, 6);
  const sourceMax = Math.max(1, ...sources.map(s => s.count));

  return (
    <div className="operations-dashboard">
      <header className="dashboard-welcome">
        <div>
          <span className="eyebrow">{new Intl.DateTimeFormat('en-GB', {dateStyle: 'full', timeZone: 'Europe/London'}).format(new Date())}</span>
          <h1>{greeting}, {firstName}.</h1>
          <p>Here’s what’s happening across CoreServe today.</p>
        </div>
        <div className="page-actions">
          {has(user, 'enquiries.create') && <Link className="button secondary" href="/enquiries"><Plus size={17} />Add enquiry</Link>}
          {has(user, 'jobs.create') && <button className="button" onClick={createJob}><Plus size={17} />Create job</button>}
        </div>
      </header>

      {!!kpis.length && <div className="dashboard-kpis" style={{'--cols': kpis.length}}>
        {kpis.map(({label, value, note, icon: Icon, href, tone}) => (
          <Link className={`dashboard-kpi tone-${tone}`} href={href} key={label}>
            <div className="kpi-top"><span>{label}</span><i><Icon size={19} /></i></div>
            <strong>{value}</strong>
            <small>{note}<ArrowRight size={15} /></small>
          </Link>
        ))}
      </div>}

      {financial && <section className="dashboard-money" aria-label="Money at a glance">
        <div className="money-heading">
          <span><HandCoins size={22} /></span>
          <div><h2>Money at a glance</h2><p>From the records you can access</p></div>
        </div>
        <div className="money-grid">
          {[['Quoted', gbp(totals.quote)], ['Received', gbp(totals.paid)], ['Outstanding', gbp(totals.balance)], ['Gross profit · booked', gbp(profit)]].map(([label, value]) => <article key={label}><small>{label}</small><strong>{value}</strong></article>)}
        </div>
        <div className="money-progress">
          <div><span>Collected against quotes</span><strong>{collected}%</strong></div>
          <div className="meter" role="meter" aria-label="Share of quoted value received" aria-valuemin={0} aria-valuemax={100} aria-valuenow={collected}><i style={{width: collected + '%'}} /></div>
        </div>
      </section>}

      <div className="dashboard-row">
        {has(user, 'enquiries.view') && <Panel eyebrow="The bigger picture" title="From enquiry to great work" action={<span className="pill"><TrendingUp size={15} />{conversion}% converted</span>}>
          <div className="funnel">
            {funnel.map(([label, count]) => (
              <div className="funnel-row" key={label} title={`${label}: ${count}`}>
                <span>{label}</span>
                <div className="bar-track"><i style={{width: count / funnelMax * 100 + '%'}} /></div>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
          <p className="field-hint">{rows.length ? `${booked.length} booked · ${closed.length} completed. Reflects current CRM records.` : 'Your pipeline grows when you add enquiries and book work.'}</p>
        </Panel>}

        {has(user, 'jobs.view') && <Panel eyebrow="Next 7 days" title="The week ahead" action={<Link className="text-link" href="/schedule">Schedule <ArrowRight size={15} /></Link>}>
          <div className="week-chart" role="img" aria-label={`Jobs scheduled over the next seven days: ${week.map(d => `${weekday(d.date)} ${d.count}`).join(', ')}`}>
            {week.map((d, i) => (
              <div className={`week-col${i === 0 ? ' today' : ''}`} key={d.date} title={`${weekday(d.date)} ${d.date}: ${d.count} job${d.count === 1 ? '' : 's'}`}>
                <div className="week-bar"><i style={{height: d.count ? Math.max(6, d.count / weekMax * 100) + '%' : '0'}} /></div>
                <strong>{d.count}</strong>
                <span>{i === 0 ? 'Today' : weekday(d.date)}</span>
              </div>
            ))}
          </div>
          <p className="field-hint">{weekTotal ? `${weekTotal} job${weekTotal === 1 ? '' : 's'} scheduled this week.` : 'Nothing scheduled yet this week.'}</p>
        </Panel>}
      </div>

      <div className="dashboard-row">
        <Panel eyebrow="What needs attention" title="Your next steps">
          <div className="focus-list">
            {attention.map(([, count, label, copy, href]) => (
              <Link className="focus-row" href={href} key={label}>
                <span className={count ? 'focus-count' : 'focus-count clear'}>{count || <CheckCircle2 size={17} aria-label="All clear" />}</span>
                <div><strong>{label}</strong><small>{copy}</small></div>
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </Panel>

        {has(user, 'jobs.view') && <Panel eyebrow="Delivery" title="Jobs by status" action={<span className="pill"><BriefcaseBusiness size={15} />{statusTotal} total</span>}>
          {statusTotal
            ? <>
                <div className="stacked-bar" role="img" aria-label={status.map(s => `${s.label} ${s.count}`).join(', ')}>
                  {status.filter(s => s.count).map(s => <i key={s.label} style={{flexGrow: s.count, background: s.color}} title={`${s.label}: ${s.count}`} />)}
                </div>
                <ul className="status-legend">
                  {status.map(s => <li key={s.label}><span className="swatch" style={{background: s.color}} /><span>{s.label}</span><strong>{s.count}</strong><small>{Math.round(s.count / statusTotal * 100)}%</small></li>)}
                </ul>
              </>
            : <div className="dashboard-quiet"><BriefcaseBusiness size={26} /><div><h3>No jobs yet.</h3><p>Status totals appear once work is booked.</p></div></div>}
        </Panel>}
      </div>

      {has(user, 'jobs.view') && <section className="panel dashboard-jobs">
        <div className="panel-head">
          <div><span className="eyebrow">On the calendar</span><h2>Today’s work</h2></div>
          <Link className="text-link" href="/jobs">All jobs <ArrowRight size={15} /></Link>
        </div>
        {jobsToday.length
          ? jobsTable(jobsToday, {pageSize: 5})
          : <div className="dashboard-quiet"><CalendarDays size={26} /><div><h3>A little room in the diary.</h3><p>No jobs are scheduled for today. Plan the next booking when you’re ready.</p></div></div>}
      </section>}

      <div className="dashboard-row">
        <Panel eyebrow="Marketing" title="Where enquiries come from">
          {sources.length
            ? <div className="funnel">{sources.map(s => <div className="funnel-row" key={s.name} title={`${s.name}: ${s.count}`}><span>{s.name}</span><div className="bar-track"><i style={{width: s.count / sourceMax * 100 + '%'}} /></div><strong>{s.count}</strong></div>)}</div>
            : <div className="dashboard-quiet"><Inbox size={26} /><div><h3>No enquiries yet.</h3><p>Lead sources appear after your first enquiry.</p></div></div>}
        </Panel>
        <Panel eyebrow="Latest" title="Recent activity" action={<Link className="text-link" href="/notifications">View all <ArrowRight size={15} /></Link>}>
          {state.audit.length
            ? <ul className="mini-timeline">{state.audit.slice(0, 5).map(a => <li key={a.id}><strong>{a.action}</strong><small>{a.name} · {new Date(a.created).toLocaleString('en-GB')}</small></li>)}</ul>
            : <p className="muted-text">Your updates will appear here.</p>}
        </Panel>
      </div>
    </div>
  );
}
