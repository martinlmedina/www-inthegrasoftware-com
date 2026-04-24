#!/usr/bin/env python3
"""
Batch-apply performance fixes to all HTML pages:
  1. Defer the GTM + Facebook Pixel block (wrap in window.addEventListener('load'))
  2. Add defer to <script src="nav.js"></script> (both top-level and blog/../nav.js)

Idempotent: re-running it on an already-migrated file is a no-op.
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

OLD_TAGS = """  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-TRT4B92N');</script>
  <!-- End Google Tag Manager -->
  <!-- Facebook Pixel Code -->
  <script>
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1226651955694155');
  fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1226651955694155&ev=PageView&noscript=1"/></noscript>
  <!-- End Facebook Pixel Code -->"""

NEW_TAGS = """  <!-- Deferred third-party tags: GTM + Facebook Pixel load after window.onload -->
  <script>
  window.addEventListener('load', function() {
    // Google Tag Manager
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TRT4B92N');
    // Facebook Pixel
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1226651955694155');
    fbq('track', 'PageView');
  });
  </script>
  <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1226651955694155&ev=PageView&noscript=1" alt=""/></noscript>"""

NAV_REPLACEMENTS = [
    ('<script src="nav.js"></script>',      '<script src="nav.js" defer></script>'),
    ('<script src="../nav.js"></script>',   '<script src="../nav.js" defer></script>'),
]


def process(path: pathlib.Path) -> tuple[bool, list[str]]:
    content = path.read_text(encoding='utf-8')
    original = content
    changes = []

    if OLD_TAGS in content:
        content = content.replace(OLD_TAGS, NEW_TAGS)
        changes.append('gtm+fbpixel deferred')

    for old, new in NAV_REPLACEMENTS:
        if old in content:
            content = content.replace(old, new)
            changes.append('nav.js deferred')
            break

    if content != original:
        path.write_text(content, encoding='utf-8')
        return True, changes
    return False, []


def main():
    files = list(ROOT.glob('*.html')) + list((ROOT / 'blog').glob('*.html'))
    modified_count = 0
    for f in sorted(files):
        changed, changes = process(f)
        if changed:
            modified_count += 1
            rel = f.relative_to(ROOT)
            print(f'  {rel}: {", ".join(changes)}')
    print(f'\n{modified_count} file(s) modified')


if __name__ == '__main__':
    main()
