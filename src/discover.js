import * as cheerio from "cheerio";
import { politeFetch } from "./fetch.js";

const BASE_URL = "https://books.toscrape.com/";
const CACHE_DIR = "cache";

/**
 * Crawl catalogue pages starting at BASE_URL, following "next" links,
 * up to a max of maxPages. Returns { pageUrls, bookUrls }.
 */
export async function discoverCatalogue(maxPages = 3) {
  const pageUrls = [];
  const bookUrlSet = new Set();

  let currentUrl = BASE_URL;
  let pageNum = 1;

  while (currentUrl && pageNum <= maxPages) {
    const cachePath = `${CACHE_DIR}/catalogue-page-${pageNum}.html`;
    const result = await politeFetch(currentUrl, cachePath);

    if (result.status !== 200) {
      console.log(`Failed to fetch catalogue page ${pageNum}: status ${result.status}`);
      break;
    }

    pageUrls.push(currentUrl);
    const $ = cheerio.load(result.html);

    $("article.product_pod h3 a").each((_, el) => {
      const href = $(el).attr("href");
      const absoluteUrl = new URL(href, currentUrl).toString();
      bookUrlSet.add(absoluteUrl);
    });

    const nextHref = $("li.next a").attr("href");
    if (nextHref) {
      currentUrl = new URL(nextHref, currentUrl).toString();
      pageNum++;
    } else {
      currentUrl = null;
    }
  }

  return { pageUrls, bookUrls: Array.from(bookUrlSet) };
}
