'use client';
import {useState} from 'react';
import Link from 'next/link';
import {CalendarCheck, Camera, Eye, EyeOff, LoaderCircle, Lock, Mail, ShieldCheck, UserRound} from 'lucide-react';

const copy = {
  login: {title: 'Welcome back', text: 'Sign in to your CoreServe workspace.', submit: 'Sign in'},
  signup: {title: 'Request an account', text: 'Join the team. An administrator will review and activate your account.', submit: 'Request account'},
  'forgot-password': {title: 'Reset your password', text: 'Ask your administrator for a one-time reset link, or set a new password from the link you were given.', submit: 'Request reset instructions'},
};

function AuthField({icon: Icon, label, name, type = 'text', autoComplete, required = true, hint, action}) {
  const [visible, setVisible] = useState(false);
  const password = type === 'password';
  return (
    <div className="auth-field">
      <div className="auth-label">
        <label htmlFor={`auth-${name}`}>{label}</label>
        {action}
      </div>
      <div className="auth-input">
        <Icon size={18} aria-hidden="true" />
        <input
          id={`auth-${name}`}
          name={name}
          type={password && visible ? 'text' : type}
          autoComplete={autoComplete}
          required={required}
          minLength={password ? 10 : undefined}
          maxLength={password ? 128 : undefined}
          aria-describedby={hint ? `auth-${name}-hint` : undefined}
        />
        {password && (
          <button type="button" className="auth-reveal" onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible}>
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {hint && <small id={`auth-${name}-hint`}>{hint}</small>}
    </div>
  );
}

export default function AuthScreen({page, busy, error, resetToken, onSubmit}) {
  const mode = copy[page] ? page : 'login';
  const {title, text, submit} = copy[mode];
  const signup = mode === 'signup';
  const forgot = mode === 'forgot-password';
  return (
    <div className="auth-page">
      <aside className="auth-story">
        <img src="/brand/coreserve-logo-light.png" alt="CoreServe Facilities Group" className="auth-logo" />
        <div className="auth-story-body">
          <span className="eyebrow light">The space behind great service</span>
          <h1>Good people.<br />Great work.<br /><em>All together.</em></h1>
          <p>One workspace for your team, your properties and every detail in between.</p>
          <ul className="auth-points">
            <li><span><CalendarCheck size={18} /></span><div><strong>Organise the work</strong><small>Jobs, schedules and follow-ups in one place.</small></div></li>
            <li><span><ShieldCheck size={18} /></span><div><strong>Keep the right access</strong><small>Role-based permissions for every person.</small></div></li>
            <li><span><Camera size={18} /></span><div><strong>Document every finish</strong><small>Checklists and private photo evidence.</small></div></li>
          </ul>
        </div>
        <small className="auth-foot">CoreServe Facilities Group · Operations workspace</small>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <Link href="/login" className="auth-brand" aria-label="CoreServe Workspace sign in">
            <img src="/brand/coreserve-mark.png" alt="" />
            <span>Workspace</span>
          </Link>

          {!forgot && (
            <div className="auth-tabs" role="tablist" aria-label="Account">
              <Link href="/login" role="tab" aria-selected={!signup} className={!signup ? 'selected' : ''}>Sign in</Link>
              <Link href="/signup" role="tab" aria-selected={signup} className={signup ? 'selected' : ''}>Request account</Link>
            </div>
          )}

          <h2>{forgot && resetToken ? 'Choose a new password' : title}</h2>
          <p className="auth-intro">{forgot && resetToken ? 'Enter a new password of at least 10 characters.' : text}</p>

          {error && <div className="notice error" role="alert">{error}</div>}

          <form onSubmit={onSubmit}>
            {signup && <AuthField icon={UserRound} name="name" label="Full name" autoComplete="name" />}
            {!resetToken && <AuthField icon={Mail} name="email" label="Email address" type="email" autoComplete="email" />}
            {(!forgot || resetToken) && (
              <AuthField
                icon={Lock}
                name="password"
                type="password"
                label={resetToken ? 'New password' : 'Password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                hint={mode === 'login' ? undefined : 'At least 10 characters.'}
                action={mode === 'login' ? <Link href="/forgot-password" className="text-link small">Forgot password?</Link> : null}
              />
            )}
            <button disabled={busy} className="button full large">
              {busy ? <><LoaderCircle size={18} className="spin" />Please wait…</> : forgot && resetToken ? 'Change password' : submit}
            </button>
          </form>

          {!forgot && (
            <>
              <div className="auth-divider"><span>or</span></div>
              <button className="button secondary full large" disabled type="button">
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>
                Google sign-in <span className="soon">Coming soon</span>
              </button>
            </>
          )}

          <p className="auth-switch">
            {forgot
              ? <>Remembered it? <Link href="/login">Back to sign in</Link></>
              : signup
                ? <>Already have an account? <Link href="/login">Sign in</Link></>
                : <>New to the team? <Link href="/signup">Request an account</Link></>}
          </p>
        </div>
        <p className="auth-legal">Private workspace for CoreServe staff. Access is logged.</p>
      </main>
    </div>
  );
}
