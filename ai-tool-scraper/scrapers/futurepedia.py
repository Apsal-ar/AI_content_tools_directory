"""Scraper for Futurepedia.io AI tool directory."""

import logging
import re
from datetime import datetime
from typing import Iterator
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup

from models.tool import ToolListing
from scrapers.base import BaseScraper, ScraperConfig

logger = logging.getLogger(__name__)


class FuturepediaScraper(BaseScraper):
    """Scraper for Futurepedia.io."""

    BASE_URL = "https://www.futurepedia.io"
    SOURCE_SITE = "futurepedia.io"

    def __init__(self, config: ScraperConfig | None = None):
        super().__init__(config)
        self.base_url = self.BASE_URL
        self.source_site = self.SOURCE_SITE

    def get_listing_urls(self, start_url: str) -> Iterator[str]:
        """Yield listing page URLs (base page + paginated pages)."""
        yield start_url
        max_pages = getattr(self.config, "max_pages", None)
        if max_pages is not None and max_pages <= 1:
            return
        html = self.fetch_html(start_url)
        if not html:
            return
        soup = BeautifulSoup(html, "html.parser")
        parsed = urlparse(start_url)
        base_path = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        page = 2
        while True:
            if max_pages is not None and page > max_pages:
                break
            next_url = f"{base_path}?page={page}"
            next_html = self.fetch_html(next_url)
            if not next_html:
                break
            next_soup = BeautifulSoup(next_html, "html.parser")
            cards = next_soup.select("div.bg-card.rounded-xl")
            if not cards:
                break
            yield next_url
            page += 1

    def _normalize_pricing(self, raw: str) -> str:
        """Map raw pricing text to standard values."""
        raw_lower = raw.lower().strip()
        if "free" in raw_lower and "freemium" not in raw_lower:
            return "free"
        if "freemium" in raw_lower:
            return "freemium"
        if "paid" in raw_lower:
            return "paid"
        if "subscription" in raw_lower:
            return "subscription"
        if "contact" in raw_lower or "pricing" in raw_lower:
            return "contact"
        return "unknown"

    def _parse_rating(self, text: str) -> tuple[float | None, int | None]:
        """Parse 'Rated X out of 5(Y)' -> (rating, review_count)."""
        m = re.search(r"Rated\s+([\d.]+)\s+out\s+of\s+5\s*\((\d+)\)", text, re.I)
        if m:
            return float(m.group(1)), int(m.group(2))
        return None, None

    MAIN_CATEGORY_OVERRIDES = {
        "text to speech": "audio text to speech",
        "avatar generator": "avatars generators",
        "logo generator": "logo generators",
        "3D generator": "3d generators",
        "copywriting assistant": "copywriting",
    }

    def _main_category_from_url(self, page_url: str) -> str:
        """Extract main category from page URL path (e.g. /ai-tools/video-enhancer -> 'video enhancer')."""
        parsed = urlparse(page_url)
        parts = parsed.path.strip("/").split("/")
        if len(parts) >= 2:
            raw = parts[-1].replace("-", " ")
            return self.MAIN_CATEGORY_OVERRIDES.get(raw, raw)
        return ""

    def _clean_url(self, url: str | None) -> str:
        """Remove UTM and affiliate params from URL (everything from ?utm_source=...)."""
        if not url:
            return ""
        if "utm_source" in url:
            url = url.split("?")[0]  # Drop entire query string when UTM present
        return url

    def parse_listing_page(self, html: str, page_url: str) -> list[ToolListing]:
        """Parse a Futurepedia listing page into ToolListing objects."""
        soup = BeautifulSoup(html, "html.parser")
        cards = soup.select("div.bg-card.rounded-xl")
        main_category = self._main_category_from_url(page_url)
        tools: list[ToolListing] = []
        for card in cards:
            try:
                tool = self._parse_card(card, main_category=main_category)
                if tool:
                    tools.append(tool)
            except Exception as e:
                # Log and skip, don't crash
                name_guess = "unknown"
                link = card.select_one('a[href*="/tool/"]')
                if link:
                    name_guess = link.get_text(strip=True)[:30] or link.get("href", "")
                logger.warning("Skipped tool %s: %s", name_guess, e)
        return tools

    def _parse_card(self, card, main_category: str = "") -> ToolListing | None:
        """Parse a single tool card."""
        # Name: from tool link with non-trivial text
        name = ""
        tool_page_url = None
        for a in card.find_all("a", href=lambda h: h and "/tool/" in h):
            t = a.get_text(strip=True)
            if t and not t.startswith("Rated") and len(t) > 1:
                name = t
                tool_page_url = urljoin(self.BASE_URL, a.get("href", ""))
                break
        if not name:
            return None

        # Logo
        img = card.select_one('img[alt*="logo"]')
        logo_url = img.get("src") if img else None

        # Visit URL (external) - stored raw; will be cleaned in output
        visit_link = card.find("a", href=lambda h: h and "utm_source=futurepedia" in (h or ""))
        raw_url = visit_link.get("href") if visit_link else tool_page_url
        url = self._clean_url(raw_url) if raw_url else tool_page_url

        # Subcategories (tags from page; main_category comes from page URL)
        tag_links = card.select('a[href*="/ai-tools/"]')
        subcategories = [a.get_text(strip=True).lstrip("#") for a in tag_links if a.get_text(strip=True)]

        # Pricing
        raw_text = card.get_text()
        pricing = "unknown"
        for p in ("Contact for Pricing", "Freemium", "Paid", "Free", "Subscription"):
            if p in raw_text:
                pricing = self._normalize_pricing(p)
                break

        # Rating / review count (from full card text)
        rating, review_count = self._parse_rating(raw_text)

        # Description: first block of 30–200 chars that looks like a description
        description = ""
        for el in card.find_all(["p", "span", "div"]):
            text = el.get_text(strip=True)
            if 30 <= len(text) <= 200 and not text.startswith("#") and "Rated" not in text:
                if "Add bookmark" not in text and "Editor's Pick" not in text:
                    description = text
                    break

        return ToolListing(
            name=name,
            description=description,
            url=url,
            category=subcategories,
            main_category=main_category,
            pricing=pricing,
            features=[],
            logo_url=logo_url,
            rating=rating,
            review_count=review_count,
            source_site=self.source_site,
            scraped_at=datetime.utcnow(),
        )
