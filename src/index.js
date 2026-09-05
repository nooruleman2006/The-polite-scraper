import { discoverCatalogue } from "./discover.js";
import { extractBook } from "./extract.js";

async function main() {
  const { pageUrls, bookUrls } = await discoverCatalogue(3);
  console.log(`catalogue_pages=${pageUrls.length}, unique_urls=${bookUrls.length}`);

  const records = [];
  for (const bookUrl of bookUrls) {
    const record = await extractBook(bookUrl, pageUrls[0]);
    records.push(record);
  }

  console.log("Sample record:");
  console.log(JSON.stringify(records[0], null, 2));
  console.log(`detail_pages=${records.length}`);
}

main();
