"""Abstract base scraper class with shared logic."""

import logging
import random
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator
from urllib.parse import urljoin, urlparse

import httpx
from bs4 import BeautifulSoup

from models.tool import ToolListing

logger = logging.getLogger(__name__)


@dataclass
class ScraperConfig:
    """Configuration for scraper behavior."""

    use_playwright: bool = False
    min_delay: float = 1.0
    max_delay: float = 3.0
    save_raw: bool = False
    raw_dir: Path = Path("output/raw")


class BaseScraper(ABC):
    """Abstract base for directory scrapers."""

    def __init__(self, config: ScraperConfig | None = None):
        self.config = config or ScraperConfig()
        self.base_url: str = ""
        self.source_site: str = ""

    def _delay(self) -> None:
        """Apply random rate-limiting delay."""
        delay = random.uniform(self.config.min_delay, self.config.max_delay)
        logger.debug("Rate limit delay: %.2fs", delay)
        time.sleep(delay)

    def _fetch_html_static(self, url: str) -> str | None:
        """Fetch page HTML via httpx (for static sites)."""
        try:
            with httpx.Client(timeout=30.0, follow_redirects=True) as client:
                resp = client.get(url)
                resp.raise_for_status()
                return resp.text
        except Exception as e:
            logger.error("Failed to fetch %s: %s", url, e)
            return None

    def _fetch_html_playwright(self, url: str) -> str | None:
        """Fetch page HTML via Playwright (for JS-heavy sites)."""
        try:
            from playwright.sync_api import sync_playwright

            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                page.goto(url, wait_until="networkidle", timeout=30000)
                html = page.content()
                browser.close()
                return html
        except Exception as e:
            logger.error("Playwright fetch failed for %s: %s", url, e)
            return None

    def fetch_html(self, url: str) -> str | None:
        """Fetch HTML using configured method (static or Playwright)."""
        self._delay()
        if self.config.use_playwright:
            return self._fetch_html_playwright(url)
        return self._fetch_html_static(url)

    def _check_robots_txt(self, url: str) -> bool:
        """Check if the URL is allowed by robots.txt."""
        parsed = urlparse(url)
        base = f"{parsed.scheme}://{parsed.netloc}"
        robots_url = f"{base}/robots.txt"
        try:
            with httpx.Client(timeout=10.0) as client:
                resp = client.get(robots_url)
                if resp.status_code != 200:
                    logger.warning("robots.txt not found or error at %s", robots_url)
                    return True  # Proceed if we can't fetch robots
                content = resp.text
        except Exception as e:
            logger.warning("Could not fetch robots.txt: %s", e)
            return True

        # Simple check: look for "Disallow: /" which blocks everything
        if "Disallow: /\n" in content or "Disallow: / " in content:
            logger.warning("robots.txt disallows all crawling")
            return False
        # For path-specific disallows, we'd need a proper robots parser
        return True

    def _save_raw_html(self, url: str, html: str, suffix: str = "") -> None:
        """Save raw HTML snapshot if --save-raw is set."""
        if not self.config.save_raw:
            return
        self.config.raw_dir.mkdir(parents=True, exist_ok=True)
        parsed = urlparse(url)
        path = parsed.path.strip("/").replace("/", "_") or "index"
        safe = "".join(c if c.isalnum() or c in "-_" else "_" for c in path)
        fname = f"{safe}{suffix}.html"
        path = self.config.raw_dir / fname
        path.write_text(html, encoding="utf-8")
        logger.info("Saved raw HTML to %s", path)

    @abstractmethod
    def get_listing_urls(self, start_url: str) -> Iterator[str]:
        """Yield all listing page URLs (handles pagination)."""

    @abstractmethod
    def parse_listing_page(self, html: str, page_url: str) -> list[ToolListing]:
        """Parse a listing page and return tool listings."""

    def scrape(self, start_url: str) -> Iterator[ToolListing]:
        """Scrape all tools from a directory, yielding ToolListing objects."""
        if not self._check_robots_txt(start_url):
            logger.error("Scraping blocked by robots.txt")
            return
        for page_url in self.get_listing_urls(start_url):
            html = self.fetch_html(page_url)
            if not html:
                logger.warning("Skipping page (no HTML): %s", page_url)
                continue
            self._save_raw_html(page_url, html)
            try:
                tools = self.parse_listing_page(html, page_url)
                for t in tools:
                    yield t
            except Exception as e:
                logger.exception("Failed to parse page %s: %s", page_url, e)
