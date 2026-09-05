import { discoverCatalogue } from "./discover.js";

async function main() {
  const { pageUrls, bookUrls } = await discoverCatalogue(3);

  console.log(`catalogue_pages=${pageUrls.length}`);
  console.log(`discovered=${bookUrls.length}`);
  console.log(`unique_urls=${new Set(bookUrls).size}`);
}

main();
