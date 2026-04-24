#!/usr/bin/env python3
"""
Inline common.css into each HTML's <head>, eliminating it from the critical
request chain. PageSpeed flagged that the 2-step chain HTML -> common.css
added 3.2s of LCP latency on mobile 4G, even though common.css is only
1.8 KiB gzipped — the roundtrip dominates.

Replaces:
  <link rel="stylesheet" href="common.css" />       (top-level pages)
  <link rel="stylesheet" href="../common.css" />    (blog/*.html)
  <link rel="preload" as="style" href="common.css"> (added in Round 1, now redundant)

With:
  <style data-inlined="common">...contents of common.css...</style>

Idempotent: skips files that already contain the data-inlined="common" marker.
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS_PATH = ROOT / 'common.css'

MARKER = 'data-inlined="common"'


def main() -> int:
    if not CSS_PATH.exists():
        print(f'ERROR: {CSS_PATH} not found', file=sys.stderr)
        return 1

    css = CSS_PATH.read_text(encoding='utf-8')
    inline_block = f'<style {MARKER}>\n{css}\n  </style>'

    excluded = ('mock_', 'mock-', 'mockup-', 'home_oldversion', 'view-source_', 'people-culture_new_')
    files = [f for f in ROOT.glob('*.html') if not f.name.startswith(excluded)]
    files += list((ROOT / 'blog').glob('*.html'))

    replacements = [
        ('  <link rel="stylesheet" href="common.css" />\n', f'  {inline_block}\n'),
        ('  <link rel="stylesheet" href="../common.css" />\n', f'  {inline_block}\n'),
        # Round 1 added this preload — now redundant since CSS is inline
        ('  <link rel="preload" as="style" href="common.css">\n', ''),
        ('  <link rel="preload" as="style" href="../common.css">\n', ''),
    ]

    modified = skipped = 0
    for f in sorted(files):
        text = f.read_text(encoding='utf-8')
        if MARKER in text:
            skipped += 1
            continue
        orig = text
        for old, new in replacements:
            text = text.replace(old, new)
        if text != orig:
            f.write_text(text, encoding='utf-8')
            modified += 1
            print(f'  {f.relative_to(ROOT).as_posix()}')
        else:
            print(f'  [no anchor] {f.relative_to(ROOT).as_posix()}')

    print(f'\n{modified} file(s) inlined common.css, {skipped} already had marker')
    return 0


if __name__ == '__main__':
    sys.exit(main())
