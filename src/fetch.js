import fs from "fs";
import path from "path";

const USER_AGENT = "FlyRankInternshipA9/1.0 (+https://github.com/nooruleman2006/The-polite-scraper)";
const TIMEOUT_MS = 8000;
const DELAY_MS = 600;

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch a URL politely, caching the result to disk.
 * Returns { html, status, fromCache }.
 */
export async function politeFetch(url, cachePath) {
  if (fs.existsSync(cachePath)) {
    const html = fs.readFileSync(cachePath, "utf-8");
    return { html, status: 200, fromCache: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    return { html: null, status: 0, fromCache: false, error: err.message };
  }
  clearTimeout(timeout);

  if (response.status !== 200) {
    return { html: null, status: response.status, fromCache: false };
  }

  const html = await response.text();
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, html, "utf-8");

  await sleep(DELAY_MS);

  return { html, status: 200, fromCache: false };
}
