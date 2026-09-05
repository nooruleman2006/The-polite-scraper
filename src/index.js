import fs from "fs";
import { discoverCatalogue } from "./discover.js";
import { extractBook } from "./extract.js";
import { BookSchema, normalizeRecord } from "./schema.js";

async function main() {
  const { pageUrls, bookUrls } = await discoverCatalogue(3);
  console.log(`catalogue_pages=${pageUrls.length}, unique_urls=${bookUrls.length}`);

  const seenUrls = new Set();
  const validRecords = [];
  const errorRecords = [];

  for (const bookUrl of bookUrls) {
    if (seenUrls.has(bookUrl)) continue;
    seenUrls.add(bookUrl);

    const raw = await extractBook(bookUrl, pageUrls[0]);

    if (raw.error) {
      errorRecords.push({ product_url: raw.product_url, reason: raw.error });
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
    }
  }

  fs.mkdirSync("output", { recursive: true });
  fs.writeFileSync("output/books.json", JSON.stringify(validRecords, null, 2));
  fs.writeFileSync("output/errors.json", JSON.stringify(errorRecords, null, 2));

  console.log(`valid_records=${validRecords.length}`);
  console.log(`error_records=${errorRecords.length}`);
}

main();
