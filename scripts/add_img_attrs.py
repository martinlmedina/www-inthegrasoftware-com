#!/usr/bin/env python3
"""
Add perf attributes (loading=lazy, decoding=async, width, height) to <img> tags
in HTML files that don't already have them.

Rules:
  - Skip images already tagged with loading/decoding/width/height (idempotent)
  - Skip images with class 'bg-graphic' (they're hidden on mobile, and adding
    loading=lazy could cause layout weirdness with absolute positioning)
  - Skip images with fetchpriority=high (hero/LCP — keep as eager)
  - Compute width/height from the actual file on disk when resolvable
  - Add loading=lazy and decoding=async unconditionally if missing

Usage: python scripts/add_img_attrs.py [--dry-run]
"""
import argparse
import pathlib
import re
import sys

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent

IMG_RE = re.compile(r'<img\b([^>]*?)/?>', re.DOTALL)
HEADER_RE = re.compile(r'<header[^>]*>.*?</header>', re.DOTALL)
ATTR_RE = re.compile(r'(\w[\w-]*)\s*=\s*"([^"]*)"')
ATTR_RE_SQ = re.compile(r"(\w[\w-]*)\s*=\s*'([^']*)'")

# Cache resolved dimensions per absolute image path
DIM_CACHE: dict[pathlib.Path, tuple[int, int] | None] = {}


def parse_attrs(fragment: str) -> dict[str, str]:
    attrs: dict[str, str] = {}
    for m in ATTR_RE.finditer(fragment):
        attrs[m.group(1).lower()] = m.group(2)
    for m in ATTR_RE_SQ.finditer(fragment):
        attrs.setdefault(m.group(1).lower(), m.group(2))
    # boolean attrs (e.g. "defer") — detect standalone words
    remaining = ATTR_RE.sub('', ATTR_RE_SQ.sub('', fragment))
    for token in remaining.split():
        t = token.strip('/').lower()
        if t and '=' not in t:
            attrs[t] = ''
    return attrs


def resolve_image(html_path: pathlib.Path, src: str) -> pathlib.Path | None:
    if src.startswith(('http://', 'https://', '//', 'data:')):
        return None
    src = src.split('?', 1)[0].split('#', 1)[0]
    base = html_path.parent
    candidate = (base / src).resolve()
    if candidate.exists() and candidate.is_file():
        return candidate
    # Try relative to root
    candidate = (ROOT / src.lstrip('/')).resolve()
    if candidate.exists() and candidate.is_file():
        return candidate
    return None


def get_dims(path: pathlib.Path) -> tuple[int, int] | None:
    if path in DIM_CACHE:
        return DIM_CACHE[path]
    try:
        with Image.open(path) as img:
            dims = (img.width, img.height)
    except Exception:
        dims = None
    DIM_CACHE[path] = dims
    return dims


def process_img(match: re.Match, html_path: pathlib.Path) -> str:
    inner = match.group(1)
    full = match.group(0)
    attrs = parse_attrs(inner)

    # Skip bg-graphic decoratives
    if 'bg-graphic' in attrs.get('class', ''):
        return full
    # Skip LCP-flagged images
    if 'fetchpriority' in attrs and attrs['fetchpriority'].lower() == 'high':
        return full
    # Skip data-uri / inline SVG
    src = attrs.get('src', '')
    if not src or src.startswith('data:'):
        return full
    # Skip tracking pixels and hidden decorative images
    if attrs.get('width') == '1' or attrs.get('height') == '1':
        return full
    if 'display:none' in attrs.get('style', '').replace(' ', ''):
        return full

    additions: list[str] = []

    if 'loading' not in attrs:
        additions.append('loading="lazy"')
    if 'decoding' not in attrs:
        additions.append('decoding="async"')

    if 'width' not in attrs or 'height' not in attrs:
        resolved = resolve_image(html_path, src)
        if resolved:
            dims = get_dims(resolved)
            if dims:
                w, h = dims
                if 'width' not in attrs:
                    additions.append(f'width="{w}"')
                if 'height' not in attrs:
                    additions.append(f'height="{h}"')

    if not additions:
        return full

    # Insert additions right after the tag name, preserving original inner spacing
    inner_stripped = inner.rstrip()
    trailing_slash = full.endswith('/>')
    new_inner = inner_stripped.rstrip('/') + ' ' + ' '.join(additions)
    new_tag = f'<img{new_inner}' + (' />' if trailing_slash else '>')
    return new_tag


def process_file(path: pathlib.Path, dry_run: bool) -> int:
    text = path.read_text(encoding='utf-8')
    updates = 0

    # Collect <img> spans inside <header>...</header> so we skip them —
    # nav.js replaces the <header> entirely on load, so lazy-loading the
    # placeholder logo is semantically wrong (and triggers a useless fetch
    # if the browser paints before nav.js runs).
    skip_spans = []
    for hm in HEADER_RE.finditer(text):
        for im in IMG_RE.finditer(hm.group(0)):
            skip_spans.append((hm.start() + im.start(), hm.start() + im.end()))

    def replace(m: re.Match) -> str:
        nonlocal updates
        for start, end in skip_spans:
            if m.start() == start and m.end() == end:
                return m.group(0)
        new = process_img(m, path)
        if new != m.group(0):
            updates += 1
        return new

    new_text = IMG_RE.sub(replace, text)

    if updates and not dry_run:
        path.write_text(new_text, encoding='utf-8')
    return updates


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()

    # Exclude mockups and drafts (blocked by .htaccess in prod anyway)
    excluded_prefixes = ('mock_', 'mock-', 'mockup-', 'home_oldversion', 'view-source_', 'people-culture_new_')
    files = [f for f in ROOT.glob('*.html') if not f.name.startswith(excluded_prefixes)]
    files += list((ROOT / 'blog').glob('*.html'))
    total_updates = 0
    for f in sorted(files):
        n = process_file(f, args.dry_run)
        if n:
            rel = f.relative_to(ROOT).as_posix()
            print(f'  {rel}: {n} <img> updated')
            total_updates += n
    print(f'\n{total_updates} <img> tag(s) updated {"(dry-run)" if args.dry_run else ""}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
