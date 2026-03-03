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
    "futurepedia": "https://www.futurepedia.io/ai-tools/video-editing",
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
        "--max-pages",
        type=int,
        default=None,
        help="Max pagination pages (default: 2 video-enhancer, 8 video-editing, 10 video-generators, 4 text-to-video)",
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

    max_pages = args.max_pages
    if max_pages is None:
        if "design-generators" in url:
            max_pages = 14
        elif "image-generators" in url:
            max_pages = 11
        elif "image-editing" in url:
            max_pages = 10
        elif "video-editing" in url:
            max_pages = 8
        elif "video-generators" in url:
            max_pages = 10
        elif "3D-generator" in url or "3d-generator" in url:
            max_pages = 4
        elif "portrait-generators" in url or "avatar-generator" in url:
            max_pages = 3
        elif "logo-generator" in url:
            max_pages = 2
        elif "cartoon-generators" in url:
            max_pages = 1
        elif "writing-generators" in url:
            max_pages = 12
        elif "copywriting-assistant" in url:
            max_pages = 8
        elif "prompt-generators" in url or "paraphrasing" in url or "storyteller" in url:
            max_pages = 2
        elif "text-to-image" in url:
            max_pages = 3
        elif "text-to-video" in url:
            max_pages = 4
        elif "transcriber" in url:
            max_pages = 6
        elif "audio-editing" in url or "text-to-speech" in url or "music-generator" in url:
            max_pages = 4
        else:
            max_pages = 2

    config = ScraperConfig(
        use_playwright=args.playwright,
        save_raw=args.save_raw,
        raw_dir=args.output_dir / "raw",
        max_pages=max_pages,
    )

    scraper_class = SCRAPERS[args.site]
    scraper = scraper_class(config)

    args.output_dir.mkdir(parents=True, exist_ok=True)

    # Load existing aggregated output (append mode: never replace, only add new tools)
    json_path = args.output_dir / f"{args.site}_tools.json"
    existing_tools: list[dict] = []
    if json_path.exists():
        try:
            with open(json_path, encoding="utf-8") as f:
                existing_tools = json.load(f)
            logging.info("Loaded %d existing tools from %s", len(existing_tools), json_path)
        except (json.JSONDecodeError, OSError) as e:
            logging.warning("Could not load existing output: %s", e)

    seen = {(t["name"], t["main_category"]) for t in existing_tools}

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
        if existing_tools:
            logging.info("Keeping %d existing tools", len(existing_tools))
        return 0

    # Derive source name for "sourced" column
    source_site = tools[0].get("source_site", args.site) if tools else args.site
    sourced = source_site.split(".")[0] if "." in source_site else source_site  # "futurepedia.io" -> "futurepedia"

    # Transform new tools to output format and filter duplicates
    new_output_tools: list[dict] = []
    for t in tools:
        main_cat = t.get("main_category", "")
        if (t["name"], main_cat) in seen:
            continue
        seen.add((t["name"], main_cat))
        audio_main_cats = ("audio editing", "audio text to speech", "music generator", "transcriber")
        image_main_cats = ("design generators", "image generators", "image editing", "text to image")
        art_main_cats = ("cartoon generators", "portrait generators", "avatars generators", "logo generators", "3d generators")
        text_main_cats = ("prompt generators", "writing generators", "paraphrasing", "storyteller", "copywriting")
        if main_cat == "text to video":
            category = "video"
        elif main_cat in audio_main_cats:
            category = "audio"
        elif main_cat in image_main_cats:
            category = "image"
        elif main_cat in art_main_cats:
            category = "art"
        elif main_cat in text_main_cats:
            category = "text"
        else:
            category = main_cat.split()[0] if main_cat else ""
        new_output_tools.append({
            "name": t["name"],
            "description": t["description"],
            "url": t.get("url") or "",
            "category": category,
            "main_category": main_cat,
            "subcategories": t.get("category", []),
            "pricing": t.get("pricing", ""),
            "scraped_at": t.get("scraped_at", ""),
            "sourced": sourced,
        })

    # Merge existing + new, re-assign ids
    output_tools = existing_tools + new_output_tools
    audio_main_cats = ("audio editing", "audio text to speech", "music generator", "transcriber")
    image_main_cats = ("design generators", "image generators", "image editing", "text to image")
    art_main_cats = ("cartoon generators", "portrait generators", "avatars generators", "logo generators", "3d generators")
    text_main_cats = ("prompt generators", "writing generators", "paraphrasing", "storyteller", "copywriting")
    for i, t in enumerate(output_tools, start=1):
        t["id"] = i
        if t.get("main_category") == "text to video":
            t["category"] = "video"
        elif t.get("main_category") in audio_main_cats:
            t["category"] = "audio"
        elif t.get("main_category") in image_main_cats:
            t["category"] = "image"
        elif t.get("main_category") in art_main_cats:
            t["category"] = "art"
        elif t.get("main_category") in text_main_cats:
            t["category"] = "text"

    if new_output_tools:
        logging.info("Added %d new tools (total: %d)", len(new_output_tools), len(output_tools))

    # Write JSON
    json_path = args.output_dir / f"{args.site}_tools.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(output_tools, f, indent=2, ensure_ascii=False)
    logging.info("Wrote %d tools to %s", len(output_tools), json_path)

    # Write CSV
    csv_path = args.output_dir / f"{args.site}_tools.csv"
    fieldnames = ["id", "name", "description", "url", "category", "main_category", "subcategories", "pricing", "scraped_at", "sourced"]
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for t in output_tools:
            row = {**t, "subcategories": "|".join(t["subcategories"]) if t["subcategories"] else ""}
            writer.writerow(row)
    logging.info("Wrote CSV to %s", csv_path)

    if failed:
        logging.info("Skipped %d items due to errors", failed)

    return 0


if __name__ == "__main__":
    sys.exit(main())
