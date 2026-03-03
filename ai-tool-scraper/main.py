#!/usr/bin/env python3
"""CLI entry point for the AI tool directory scraper."""

import argparse
import csv
import json
import logging
import sys
from pathlib import Path

from scrapers.base import ScraperConfig
from scrapers.futurepedia import FuturepediaScraper

SCRAPERS = {
    "futurepedia": FuturepediaScraper,
}

DEFAULT_OUTPUT = Path("output")
DEFAULT_URLS = {
    "futurepedia": "https://www.futurepedia.io/ai-tools/video-enhancer",
}


def setup_logging(verbose: bool) -> None:
    """Configure logging level."""
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Scrape AI tool listings from directory websites."
    )
    parser.add_argument(
        "site",
        choices=list(SCRAPERS.keys()),
        help="Target site to scrape",
    )
    parser.add_argument(
        "-u",
        "--url",
        default=None,
        help="Start URL (default: site-specific)",
    )
    parser.add_argument(
        "-o",
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Output directory (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--playwright",
        action="store_true",
        help="Use Playwright for JS-heavy sites (default: httpx)",
    )
    parser.add_argument(
        "--save-raw",
        action="store_true",
        help="Save raw HTML snapshots",
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Verbose logging",
    )
    args = parser.parse_args()

    setup_logging(args.verbose)

    url = args.url or DEFAULT_URLS.get(args.site)
    if not url:
        logging.error("No URL specified and no default for %s", args.site)
        return 1

    config = ScraperConfig(
        use_playwright=args.playwright,
        save_raw=args.save_raw,
        raw_dir=args.output_dir / "raw",
    )

    scraper_class = SCRAPERS[args.site]
    scraper = scraper_class(config)

    args.output_dir.mkdir(parents=True, exist_ok=True)
    tools: list[dict] = []
    failed = 0

    for tool in scraper.scrape(url):
        try:
            d = tool.model_dump(mode="json")
            tools.append(d)
        except Exception as e:
            logging.warning("Skipped tool %s: %s", getattr(tool, "name", "?"), e)
            failed += 1

    if not tools:
        logging.warning("No tools scraped")
        return 0

    # Write JSON
    json_path = args.output_dir / f"{args.site}_tools.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(tools, f, indent=2, ensure_ascii=False)
    logging.info("Wrote %d tools to %s", len(tools), json_path)

    # Write CSV
    csv_path = args.output_dir / f"{args.site}_tools.csv"
    if tools:
        fieldnames = list(tools[0].keys())
        with open(csv_path, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for t in tools:
                row = {}
                for k, v in t.items():
                    if isinstance(v, list):
                        row[k] = "|".join(str(x) for x in v)
                    elif v is None:
                        row[k] = ""
                    else:
                        row[k] = v
                writer.writerow(row)
        logging.info("Wrote CSV to %s", csv_path)

    if failed:
        logging.info("Skipped %d items due to errors", failed)

    return 0


if __name__ == "__main__":
    sys.exit(main())
