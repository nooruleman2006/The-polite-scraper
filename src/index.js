import { politeFetch } from "./fetch.js";

const BASE_URL = "https://books.toscrape.com/";
const CACHE_DIR = "cache";

async function main() {
  const url = BASE_URL;
  const cachePath = `${CACHE_DIR}/catalogue-page-1.html`;

  const result = await politeFetch(url, cachePath);

  if (result.fromCache) {
    console.log(`CACHE HIT — ${result.html.length} bytes`);
  } else if (result.status === 200) {
    console.log(`FETCH — ${result.html.length} bytes`);
  } else {
    console.log(`FAILED — status ${result.status} ${result.error ?? ""}`);
  }
}

main();
