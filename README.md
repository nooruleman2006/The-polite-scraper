# FlyRank A9 — The Polite Scraper

## Target classification

- **Site:** https://books.toscrape.com
- **Why this site:** The site's own homepage displays the warning "This is a demo website for web scraping purposes. Prices and ratings here were randomly assigned and have no real meaning." Its page title also identifies it as "Books to Scrape - Sandbox." It is a public sandbox built for practicing scraping.
- **Scope:** Only the first 3 catalogue pages (and the ~60 book detail pages linked from them) are fetched.
- **Data collected:** Book title, product URL, price, availability, rating, and description — all publicly displayed text, no login or paywall involved.
- **robots.txt result:** Requested once at https://books.toscrape.com/robots.txt — returned HTTP 404 (no robots file found). A missing file is not permission, it is just a missing file.
- I will not reuse this code on another site without checking its rules and terms first.
