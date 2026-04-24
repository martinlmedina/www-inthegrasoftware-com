#!/usr/bin/env python3
"""
Defer GTM + Facebook Pixel from window.load to first user interaction.

Round 1 moved them to window.load, cutting initial TBT. PageSpeed now flags
222 KiB of unused JS from these libraries (Lighthouse CPU-profiles them
regardless of when they run — if they run inside the observed window, they
count). Firing them on first interaction (scroll / keydown / mousemove /
touchstart / pointerdown / visibilitychange) keeps them fully out of the
LCP+TBT measurement window for users who bounce, and still triggers for
real users as soon as they engage.

10s setTimeout fallback ensures tracking fires for background tabs that
never get focus, so we don't zero out pageview data.

Idempotent: skips files that already contain the fired-guard marker.
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

OLD = """  <!-- Deferred third-party tags: GTM + Facebook Pixel load after window.onload -->
  <script>
  window.addEventListener('load', function() {
    // Google Tag Manager
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TRT4B92N');
    // Facebook Pixel
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1226651955694155');
    fbq('track', 'PageView');
  });
  </script>"""

NEW = """  <!-- Deferred third-party tags: GTM + Facebook Pixel load on first user interaction (or 10s fallback) -->
  <script>
  (function() {
    var fired = false;
    function load3rdParty() {
      if (fired) return;
      fired = true;
      // Google Tag Manager
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TRT4B92N');
      // Facebook Pixel
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1226651955694155');
      fbq('track', 'PageView');
    }
    var evts = ['scroll','keydown','mousemove','touchstart','pointerdown','visibilitychange'];
    evts.forEach(function(e) { window.addEventListener(e, load3rdParty, {once:true, passive:true}); });
    setTimeout(load3rdParty, 10000);
  })();
  </script>"""

MARKER = 'function load3rdParty()'


def main() -> int:
    excluded = ('mock_', 'mock-', 'mockup-', 'home_oldversion', 'view-source_', 'people-culture_new_')
    files = [f for f in ROOT.glob('*.html') if not f.name.startswith(excluded)]
    files += list((ROOT / 'blog').glob('*.html'))

    modified = skipped = notfound = 0
    for f in sorted(files):
        text = f.read_text(encoding='utf-8')
        if MARKER in text:
            skipped += 1
            continue
        if OLD not in text:
            notfound += 1
            continue
        f.write_text(text.replace(OLD, NEW), encoding='utf-8')
        modified += 1
        print(f'  {f.relative_to(ROOT).as_posix()}')

    print(f'\n{modified} modified, {skipped} already migrated, {notfound} no GTM block')
    return 0


if __name__ == '__main__':
    sys.exit(main())
