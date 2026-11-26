'use client';
import {useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

/**
 * Client-side pagination state for any list.
 * `resetKey` should change whenever the list's filters/search change, so the
 * user is returned to page 1 instead of landing on an empty page.
 */
export function usePagination(items, {pageSize: initialSize = 10, resetKey = ''} = {}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialSize);
  const [lastKey, setLastKey] = useState(resetKey);
  if (lastKey !== resetKey) {
    // Adjusting state while rendering is the React-recommended way to reset on prop change.
    setLastKey(resetKey);
    setPage(1);
  }
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * pageSize;
  return {
    page: current,
    pageSize,
    pageCount,
    total,
    items: items.slice(start, start + pageSize),
    setPage,
    setPageSize: size => { setPageSize(size); setPage(1); },
  };
}

function pageList(page, count) {
  if (count <= 7) return Array.from({length: count}, (_, i) => i + 1);
  const pages = new Set([1, count, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach(p => pages.add(p));
  if (page >= count - 2) [count - 1, count - 2, count - 3].forEach(p => pages.add(p));
  const sorted = [...pages].filter(p => p >= 1 && p <= count).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i && p - sorted[i - 1] > 1 ? ['gap-' + p, p] : [p]));
}

/**
 * The one pagination control used by every list and table in the workspace.
 * Pass the object returned by usePagination as `pager`.
 */
export default function Pagination({pager, label = 'records', sizes = [10, 25, 50]}) {
  const {page, pageCount, total, pageSize, setPage, setPageSize} = pager;
  if (!total) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const options = [...new Set([...sizes, pageSize])].sort((a, b) => a - b);
  return (
    <nav className="pagination" aria-label={`Pages of ${label}`}>
      <p className="pagination-summary" aria-live="polite">
        Showing <strong>{from}–{to}</strong> of <strong>{total}</strong> {label}
      </p>
      <div className="pagination-controls">
        {total > options[0] && (
          <label className="pagination-size">
            <span>Rows</span>
            <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} aria-label={`${label} per page`}>
              {options.map(size => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
        )}
        {pageCount > 1 && (
          <div className="pagination-pages">
            <button type="button" className="page-step" onClick={() => setPage(page - 1)} disabled={page === 1} aria-label="Previous page">
              <ChevronLeft size={17} />
            </button>
            {pageList(page, pageCount).map(p => typeof p === 'string'
              ? <span key={p} className="page-gap" aria-hidden="true">…</span>
              : <button type="button" key={p} className={p === page ? 'page-number current' : 'page-number'} aria-current={p === page ? 'page' : undefined} aria-label={`Page ${p}`} onClick={() => setPage(p)}>{p}</button>)}
            <button type="button" className="page-step" onClick={() => setPage(page + 1)} disabled={page === pageCount} aria-label="Next page">
              <ChevronRight size={17} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
