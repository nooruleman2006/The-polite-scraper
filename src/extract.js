import * as cheerio from "cheerio";
import { politeFetch } from "./fetch.js";

const CACHE_DIR = "cache/books";

function slugFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 2] || parts[parts.length - 1];
}

export async function extractBook(bookUrl, sourcePage) {
  const cachePath = `${CACHE_DIR}/${slugFromUrl(bookUrl)}.html`;
  const result = await politeFetch(bookUrl, cachePath);

  if (result.status !== 200) {
    return { error: `status ${result.status}`, product_url: bookUrl, fromCache: false };
  }

  const $ = cheerio.load(result.html);

  const title = $(".product_main h1").text().trim();
  const price_text = $(".product_main .price_color").first().text().trim();
  const availability_text = $(".product_main .availability").text().trim();

  const ratingClass = $(".product_main .star-rating").attr("class") || "";
  const rating_text = ratingClass.replace("star-rating", "").trim();

  const descEl = $("#product_description").next("p");
  const description = descEl.length ? descEl.text().trim() : null;

  return {
    title,
    product_url: bookUrl,
    price_text,
    availability_text,
    rating_text,
    description,
    source_page: sourcePage,
    fetched_at: new Date().toISOString(),
    fromCache: result.fromCache,
  };
}
