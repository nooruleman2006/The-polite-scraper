# The Polite Scraper

A small, polite scraping pipeline for the first 3 catalogue pages of Books to Scrape (books.toscrape.com), a public sandbox built for practicing scraping. It fetches all ~60 book pages, extracts and normalizes their data, validates every record against a schema, survives broken pages without crashing, and ends every run with an honest report.

## Target classification

- Site: https://books.toscrape.com
- Why this site: the site's own homepage displays the warning: "This is a demo website for web scraping purposes. Prices and ratings here were randomly assigned and have no real meaning." Its page title also identifies it as "Books to Scrape - Sandbox."
- Scope: only the first 3 catalogue pages, plus the ~60 book detail pages linked from them.
- Data collected: book title, product URL, price, availability, rating, and description - all publicly displayed text, no login or paywall involved.
- robots.txt result: requested once at https://books.toscrape.com/robots.txt - returned HTTP 404 (no robots file found). A missing file is not permission, it is just a missing file.
- I will not reuse this code on another site without checking its rules and terms first.

## Lane and install

JavaScript / Node.js lane, using Cheerio for HTML parsing and Zod for schema validation.

Clone the repo, then run:
    npm install
    npm start

Requires Node.js 20+. No database, paid proxy, or credit card needed.

## Record schema

Each validated record in output/books.json has these fields:

- title (string) - book title
- product_url (string, URL) - canonical identity of the record
- price_text (string) - raw price as shown on the page, e.g. "£51.77"
- price_gbp (number) - normalized numeric price, e.g. 51.77
- availability_text (string) - raw stock text
- rating_text (string) - star rating as text, e.g. "Three"
- description (string or null) - null when the book has no description
- source_page (string, URL) - which catalogue page linked to this book
- fetched_at (string, ISO datetime) - when this record was fetched

## Politeness rules

- Every real request sends an identifying user-agent: FlyRankInternshipA9/1.0 (+https://github.com/nooruleman2006/The-polite-scraper)
- Every request has an 8-second timeout - it never hangs forever
- At least 600ms delay between real requests to the site; cached pages need no delay
- Status codes are checked before any parsing happens
- Failed requests (timeout or 5xx) are retried once; 404s and 403s are never retried
- All downloaded HTML is cached to disk, so re-running during development never re-hits the site

## Run command

    npm start

This runs the full pipeline: discover, fetch, extract, normalize, validate, store, report.

## Sample run report

    {
      "start_time": "2026-09-06T07:50:06.437Z",
      "duration_ms": 1324,
      "catalogue_pages_fetched": 3,
      "detail_pages_attempted": 61,
      "cache_hits": 60,
      "valid_records": 60,
      "invalid_records": 1,
      "failed_pages": 1
    }

The pipeline deliberately includes one made-up book URL alongside the 60 real ones, to prove that a single broken page (invalid_records: 1, failed_pages: 1) does not take down the run - the other 60 valid records are still written to output/books.json.

## Why no browser was needed

The book data (title, price, rating, description) is present directly in the server-rendered HTML of each page - there is no JavaScript-rendered content to wait for, so a headless browser like Playwright would only add cost (startup time, memory) with no benefit here.

## Honest limitation

This scraper assumes the site's HTML structure (class names like .product_main .price_color) stays stable. If Books to Scrape changes its markup, the selectors would need to be updated - there's no automatic detection of a broken selector beyond a record failing schema validation.

## Ethics note

This project only scrapes a public sandbox explicitly built for scraping practice, with no login, paywall, or access restriction. In general: use an official API when one exists, never bypass logins, paywalls, or blocks, and collect only the data actually needed.
