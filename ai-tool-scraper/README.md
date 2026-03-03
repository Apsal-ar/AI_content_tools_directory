# AI Tool Directory Scraper

Scrapes AI tool listings from directory websites and outputs structured JSON and CSV data.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

For Playwright (optional, for JS-heavy sites):

```bash
playwright install chromium
```

## Usage

```bash
# Scrape Futurepedia video-enhancer tools (default)
python main.py futurepedia

# Custom URL
python main.py futurepedia -u "https://www.futurepedia.io/ai-tools/video-generators"

# Use Playwright for JS-heavy sites
python main.py futurepedia --playwright

# Save raw HTML snapshots
python main.py futurepedia --save-raw

# Custom output directory
python main.py futurepedia -o ./results

# Verbose logging
python main.py futurepedia -v
```

## Output

- `output/futurepedia_tools.json` — JSON array of tool listings
- `output/futurepedia_tools.csv` — CSV export
- `output/raw/` — Raw HTML snapshots (when using `--save-raw`)

## Adding New Sites

1. Create `scrapers/your_site.py`
2. Subclass `BaseScraper`, implement `get_listing_urls()` and `parse_listing_page()`
3. Register in `main.py` under `SCRAPERS` and `DEFAULT_URLS`

## Technical Details

- **Static sites**: Uses `httpx` + `BeautifulSoup` (default)
- **JS-heavy sites**: Use `--playwright`
- **Robots.txt**: Checked before scraping; crawls only if allowed
- **Rate limiting**: 1–3 second random delays between requests
- **Errors**: Logged and skipped; scraper continues
