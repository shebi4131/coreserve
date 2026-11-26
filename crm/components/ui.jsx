'use client';
import * as Icons from 'lucide-react';

/** Shared presentational building blocks used across workspace pages. */
export function Icon({name, size = 19}) {
  const C = Icons[name] || Icons.Circle;
  return <C size={size} strokeWidth={1.8} aria-hidden="true" />;
}

export const slug = value => String(value ?? '').toLowerCase().replaceAll(' ', '-');

export function Badge({children}) {
  return <span className={`badge ${slug(children)}`}>{children}</span>;
}

export function initials(name = '') {
  return name.split(' ').filter(Boolean).map(s => s[0]).slice(0, 2).join('').toUpperCase() || '?';
}

export function Avatar({name, size}) {
  return <span className={`avatar${size ? ' ' + size : ''}`} aria-hidden="true">{initials(name)}</span>;
}

export function Field({name, label, type = 'text', value, required = false, options, disabled = false, readOnly = false, autoComplete}) {
  return (
    <label className="field">
      <span>{label}{required ? <i aria-hidden="true"> *</i> : null}</span>
      {options
        ? <select name={name} disabled={disabled} required={required} defaultValue={value || ''}>
            {options.map(o => {
              const v = typeof o === 'string' ? o : o.value;
              return <option key={v} value={v}>{typeof o === 'string' ? o : o.label}</option>;
            })}
          </select>
        : type === 'textarea'
          ? <textarea name={name} disabled={disabled} defaultValue={value || ''} required={required} />
          : <input name={name} type={type} disabled={disabled} readOnly={readOnly} defaultValue={value || ''} required={required} autoComplete={autoComplete}
              minLength={type === 'password' ? 10 : undefined} maxLength={type === 'password' ? 128 : undefined} />}
    </label>
  );
}

export function Empty({text = 'Nothing here yet.', hint = 'Create your first record to get started.', icon = 'Inbox'}) {
  return (
    <div className="empty">
      <span className="empty-icon"><Icon name={icon} size={26} /></span>
      <h3>{text}</h3>
      {hint && <p>{hint}</p>}
    </div>
  );
}

export function PageHeading({eyebrow, title, copy, children}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {copy && <p>{copy}</p>}
      </div>
      {children && <div className="page-actions">{children}</div>}
    </div>
  );
}
