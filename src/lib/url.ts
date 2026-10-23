// The site can be served from a sub-path (GitHub Pages: /SmartPARX) or the domain root.
// Every internal link goes through withBase() so both work from the same build config.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixes a root-relative path with the deploy base. External, hash and already-based URLs pass through. */
export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (base && (path === base || path.startsWith(`${base}/`) || path.startsWith(`${base}?`) || path.startsWith(`${base}#`))) return path;
  if (path === '/') return base || '/';
  return `${base}${path}`;
}

/** Removes the deploy base from a pathname, e.g. for active-nav matching. */
export function stripBase(pathname: string): string {
  if (base && pathname.startsWith(base)) return pathname.slice(base.length) || '/';
  return pathname;
}
