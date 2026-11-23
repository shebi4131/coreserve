/**
 * Password gate for /admin (Cloudflare Pages Function).
 *
 * Runs only for /admin and /admin/* — every other page is still served as a plain static file,
 * so this does not use the free Functions quota for normal visitors.
 *
 * Set two encrypted variables in Cloudflare Pages > Settings > Variables and Secrets
 * (for both Production and Preview):
 *   ADMIN_USERNAME
 *   ADMIN_PASSWORD   (long and random)
 *
 * If either is missing the gate stays closed (503) rather than exposing the admin.
 * Local `npm run dev` does not run Pages Functions, so local editing is unaffected.
 */

type Env = { ADMIN_USERNAME?: string; ADMIN_PASSWORD?: string };
type PagesContext = { request: Request; env: Env; next: () => Promise<Response> };

const REALM = "Coreserve admin";

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

// Constant-time comparison of fixed-length hashes, so response timing does not leak the secret.
async function safeEqual(a: string, b: string) {
  const [x, y] = await Promise.all([digest(a), digest(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

function parseBasicAuth(header: string | null) {
  if (!header?.startsWith("Basic ")) return null;
  try {
    const decoded = atob(header.slice(6).trim());
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    return { username: decoded.slice(0, separator), password: decoded.slice(separator + 1) };
  } catch {
    return null;
  }
}

const privateHeaders = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

export async function onRequest({ request, env, next }: PagesContext) {
  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD) {
    return new Response("Admin access is not configured.", { status: 503, headers: privateHeaders });
  }

  const credentials = parseBasicAuth(request.headers.get("Authorization"));
  if (credentials) {
    const [userOk, passOk] = await Promise.all([
      safeEqual(credentials.username, env.ADMIN_USERNAME),
      safeEqual(credentials.password, env.ADMIN_PASSWORD),
    ]);
    if (userOk && passOk) {
      const response = await next();
      const secured = new Response(response.body, response);
      Object.entries(privateHeaders).forEach(([key, value]) => secured.headers.set(key, value));
      return secured;
    }
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: { ...privateHeaders, "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"` },
  });
}
