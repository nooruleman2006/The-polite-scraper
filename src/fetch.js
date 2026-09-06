import fs from "fs";
import path from "path";

const USER_AGENT = "FlyRankInternshipA9/1.0 (+https://github.com/nooruleman2006/The-polite-scraper)";
const TIMEOUT_MS = 8000;
const DELAY_MS = 600;

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptFetch(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return { status: response.status, response };
  } catch (err) {
    clearTimeout(timeout);
    return { status: 0, error: err.message };
  }
}

/**
 * Fetch a URL politely, caching the result to disk.
 * Retries once on timeout (status 0) or 5xx. Never retries 404 or 403.
 * Returns { html, status, fromCache, error }.
 */
export async function politeFetch(url, cachePath) {
  if (fs.existsSync(cachePath)) {
    const html = fs.readFileSync(cachePath, "utf-8");
    return { html, status: 200, fromCache: true };
  }

  let result = await attemptFetch(url);

  const shouldRetry = result.status === 0 || (result.status >= 500 && result.status < 600);
  if (shouldRetry) {
    await sleep(DELAY_MS);
    result = await attemptFetch(url);
  }

  if (result.status !== 200) {
    return { html: null, status: result.status, fromCache: false, error: result.error };
  }

  const html = await result.response.text();
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, html, "utf-8");

  await sleep(DELAY_MS);

  return { html, status: 200, fromCache: false };
}
