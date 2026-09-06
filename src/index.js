import fs from "fs";
import { discoverCatalogue } from "./discover.js";
import { extractBook } from "./extract.js";
import { BookSchema, normalizeRecord } from "./schema.js";

const FAKE_URL = "https://books.toscrape.com/catalogue/this-book-does-not-exist_9999/index.html";

async function main() {
  const startTime = Date.now();

  const { pageUrls, bookUrls: discoveredUrls } = await discoverCatalogue(3);
  const bookUrls = [...discoveredUrls, FAKE_URL]; // deliberately broken URL for Stage 5 test

  console.log(`catalogue_pages=${pageUrls.length}, unique_urls=${discoveredUrls.length}`);

  const seenUrls = new Set();
  const validRecords = [];
  const errorRecords = [];
  let cacheHits = 0;
  let failedPages = 0;

  for (const bookUrl of bookUrls) {
    if (seenUrls.has(bookUrl)) continue;
    seenUrls.add(bookUrl);

    const raw = await extractBook(bookUrl, pageUrls[0]);

    if (raw.fromCache) cacheHits++;

    if (raw.error) {
      errorRecords.push({ product_url: raw.product_url, reason: raw.error });
      failedPages++;
      continue;
    }

    const normalized = normalizeRecord(raw);
    const parsed = BookSchema.safeParse(normalized);

    if (parsed.success) {
      validRecords.push(parsed.data);
    } else {
      errorRecords.push({
        product_url: normalized.product_url,
        reason: parsed.error.issues.map((i) => i.message).join("; "),
      });
      failedPages++;
    }
  }

  fs.mkdirSync("output", { recursive: true });
  fs.writeFileSync("output/books.json", JSON.stringify(validRecords, null, 2));
  fs.writeFileSync("output/errors.json", JSON.stringify(errorRecords, null, 2));

  const durationMs = Date.now() - startTime;
  const runReport = {
    start_time: new Date(startTime).toISOString(),
    duration_ms: durationMs,
    catalogue_pages_fetched: pageUrls.length,
    detail_pages_attempted: bookUrls.length,
    cache_hits: cacheHits,
    valid_records: validRecords.length,
    invalid_records: errorRecords.length,
    failed_pages: failedPages,
  };
  fs.writeFileSync("output/run-report.json", JSON.stringify(runReport, null, 2));

  console.log(JSON.stringify(runReport, null, 2));
}

main();
