#!/usr/bin/env python3
"""
Convert large PNG/JPG images to WebP variants for Apache auto-serving.

Original files are preserved. Apache (.htaccess) will serve foo.png.webp when
the browser accepts image/webp and the file exists.

Usage: python scripts/optimize_images.py [--min-bytes N] [--quality Q]
"""
import argparse
import pathlib
import sys

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent

TARGET_DIRS = [
    ROOT / 'img' / 'wp',
    ROOT / 'img_services',
    ROOT / 'blog' / 'img',
]

SUFFIXES = {'.png', '.jpg', '.jpeg'}


def convert(src: pathlib.Path, quality: int) -> tuple[bool, int, int]:
    """Convert `src` to `src.webp`. Returns (wrote_file, src_bytes, dst_bytes)."""
    dst = src.with_name(src.name + '.webp')
    src_bytes = src.stat().st_size

    if dst.exists():
        return False, src_bytes, dst.stat().st_size

    with Image.open(src) as img:
        if img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGBA')
        else:
            img = img.convert('RGB')
        img.save(dst, 'WEBP', quality=quality, method=6)

    dst_bytes = dst.stat().st_size
    # If WebP isn't smaller, drop it — keep only wins
    if dst_bytes >= src_bytes:
        dst.unlink()
        return False, src_bytes, dst_bytes

    return True, src_bytes, dst_bytes


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--min-bytes', type=int, default=50_000,
                        help='Only convert files larger than this (default 50KB)')
    parser.add_argument('--quality', type=int, default=82,
                        help='WebP quality 0-100 (default 82)')
    args = parser.parse_args()

    total_src = 0
    total_dst = 0
    converted = 0
    skipped = 0

    for base in TARGET_DIRS:
        if not base.exists():
            continue
        for path in sorted(base.rglob('*')):
            if path.suffix.lower() not in SUFFIXES:
                continue
            if path.stat().st_size < args.min_bytes:
                continue
            wrote, src_bytes, dst_bytes = convert(path, args.quality)
            rel = path.relative_to(ROOT).as_posix()
            if wrote:
                converted += 1
                savings = (1 - dst_bytes / src_bytes) * 100
                print(f'  [ok]   {rel}: {src_bytes:,} -> {dst_bytes:,} bytes ({savings:.0f}% smaller)')
                total_src += src_bytes
                total_dst += dst_bytes
            else:
                skipped += 1
                print(f'  [skip] {rel}: webp not smaller or already exists')

    if converted:
        print(f'\n{converted} converted, {skipped} skipped')
        total_savings = (1 - total_dst / total_src) * 100 if total_src else 0
        print(f'Total: {total_src:,} -> {total_dst:,} bytes ({total_savings:.0f}% smaller, {(total_src - total_dst) / 1024 / 1024:.1f} MB saved)')
    else:
        print('No files converted.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
