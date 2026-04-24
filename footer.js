/**
 * Inthegra Software — Shared Footer Component
 * Replaces the <footer> element on every page with the canonical footer.
 * Also injects the WhatsApp floating button.
 * Include via: <script src="footer.js" defer></script> in <head>
 * For subdirectories (e.g. /blog/posts): <script src="../footer.js" defer></script>
 */
(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────
     BASE URL — captured at script parse time so footer
     links resolve correctly from any subdirectory.
  ────────────────────────────────────────────────────── */
  var FOOTER_BASE = (function () {
    var cs = document.currentScript;
    if (cs && cs.src) return cs.src.replace(/\/footer\.js.*$/i, '/');
    var ss = document.getElementsByTagName('script');
    for (var i = 0; i < ss.length; i++) {
      if ((ss[i].src || '').match(/\/footer\.js(\?|$)/i)) {
        return ss[i].src.replace(/\/footer\.js.*$/i, '/');
      }
    }
    return '';
  }());

  /* ──────────────────────────────────────────────────────
     CSS — scoped to #site-footer with sf- prefix
  ────────────────────────────────────────────────────── */
  var FOOTER_CSS = [
    /* Base footer element */
    '#site-footer{',
      'background:rgba(8,17,31,.85);',
      'border-top:1px solid rgba(36,58,97,.7);',
      'padding:56px 0 32px;',
      'font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
      'color:#c0d4f0;',
    '}',

    /* Inner container */
    '#site-footer .sf-inner{',
      'max-width:1260px;margin:0 auto;padding:0 40px;',
    '}',

    /* Main grid: 5 columns */
    '#site-footer .sf-grid{',
      'display:grid;',
      'grid-template-columns:2fr 1.4fr 1.2fr 1fr 1fr;',
      'gap:40px;',
      'margin-bottom:40px;',
    '}',

    /* Brand column */
    '#site-footer .sf-brand img{',
      'height:34px;width:auto;display:block;margin-bottom:16px;',
    '}',
    '#site-footer .sf-brand p{',
      'font-size:13px;line-height:1.65;color:#95acc8;max-width:32ch;margin:0;',
    '}',

    /* Column heading */
    '#site-footer .sf-col h4{',
      'font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;',
      'color:#95acc8;margin:0 0 16px;',
    '}',

    /* Subgroup heading inside a column */
    '#site-footer .sf-subhead{',
      'font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;',
      'color:#95acc8;margin:14px 0 8px;',
    '}',
    '#site-footer .sf-subhead:first-child{margin-top:0;}',

    /* Links */
    '#site-footer .sf-col a{',
      'display:block;font-size:13px;color:#c0d4f0;text-decoration:none;',
      'margin-bottom:8px;line-height:1.5;',
      'transition:color .18s;',
    '}',
    '#site-footer .sf-col a:hover{color:#2dd4bf;}',
    '#site-footer .sf-col a.sf-active{color:#2dd4bf;font-weight:600;}',

    /* Footer bottom row */
    '#site-footer .sf-bottom{',
      'border-top:1px solid rgba(36,58,97,.5);',
      'padding-top:24px;',
      'display:flex;align-items:center;justify-content:space-between;',
      'flex-wrap:wrap;gap:16px;',
    '}',
    '#site-footer .sf-copy{',
      'font-size:12px;color:#95acc8;margin:0;',
    '}',
    '#site-footer .sf-strip{',
      'font-size:12px;color:#95acc8;margin:0;',
    '}',
    '#site-footer .sf-legal{',
      'display:flex;gap:16px;',
    '}',
    '#site-footer .sf-legal a{',
      'font-size:12px;color:#95acc8;text-decoration:none;transition:color .18s;',
    '}',
    '#site-footer .sf-legal a:hover{color:#2dd4bf;}',

    /* Social icons */
    '#site-footer .sf-social{',
      'display:flex;gap:12px;align-items:center;',
    '}',
    '#site-footer .sf-social a{',
      'display:flex;align-items:center;justify-content:center;',
      'width:32px;height:32px;border-radius:50%;',
      'background:rgba(36,58,97,.35);',
      'transition:background .2s,transform .2s;',
    '}',
    '#site-footer .sf-social a:hover{',
      'background:rgba(53,211,155,.2);transform:translateY(-2px);',
    '}',
    '#site-footer .sf-social svg{',
      'width:16px;height:16px;fill:rgba(114,148,187,.75);transition:fill .2s;',
    '}',
    '#site-footer .sf-social a:hover svg{fill:#35d39b;}',

    /* WhatsApp float (inside footer so it shares lifecycle) */
    '#site-footer .sf-wa{',
      'position:fixed;bottom:28px;right:28px;z-index:999;',
      'width:56px;height:56px;border-radius:50%;background:#25d366;',
      'display:flex;align-items:center;justify-content:center;',
      'box-shadow:0 6px 24px rgba(37,211,102,.5);',
      'transition:transform .25s;',
    '}',
    '#site-footer .sf-wa:hover{transform:scale(1.08);}',
    '#site-footer .sf-wa svg{width:28px;height:28px;fill:#fff;}',

    /* Responsive */
    '@media (max-width:1080px){',
      '#site-footer .sf-inner{padding:0 24px;}',
      '#site-footer .sf-grid{grid-template-columns:repeat(3,1fr);gap:32px;}',
      '#site-footer .sf-brand{grid-column:1/-1;}',
      '#site-footer .sf-brand p{max-width:48ch;}',
    '}',
    '@media (max-width:720px){',
      '#site-footer{padding:48px 0 28px;}',
      '#site-footer .sf-grid{grid-template-columns:repeat(2,1fr);gap:28px;}',
      '#site-footer .sf-bottom{flex-direction:column;align-items:flex-start;gap:14px;}',
    '}',
    '@media (max-width:480px){',
      '#site-footer .sf-grid{grid-template-columns:1fr;gap:24px;}',
      '#site-footer .sf-wa{bottom:20px;right:20px;width:52px;height:52px;}',
      '#site-footer .sf-wa svg{width:26px;height:26px;}',
    '}',
  ].join('');

  /* ──────────────────────────────────────────────────────
     HTML — canonical footer structure
  ────────────────────────────────────────────────────── */
  var FOOTER_HTML = [
    '<div class="sf-inner">',

      '<div class="sf-grid">',

        /* Column 1: Brand */
        '<div class="sf-brand">',
          '<img src="/logo-header.svg" alt="Inthegra Software" fetchpriority="high">',
          '<p>Oracle-native enterprise software y AI para escalar con control en Argentina y Latam.</p>',
        '</div>',

        /* Column 2: Productos (subgroups) */
        '<div class="sf-col">',
          '<h4>Productos</h4>',
          '<div class="sf-subhead">Plataformas</div>',
          '<a href="/landing_healthcare.html">HealthCare</a>',
          '<a href="/landing_credit_financial.html">Credit &amp; Financial</a>',
          '<a href="/landing_erp.html">ERP Retail &amp; Servicios</a>',
          '<div class="sf-subhead">M\u00F3dulos ERP</div>',
          '<a href="/landing_erp_supply_chain.html">Supply Chain</a>',
          '<a href="/landing_erp_wms.html">Warehouse (WMS)</a>',
          '<a href="/landing_erp_ecommerce.html">Ecommerce</a>',
          '<a href="/landing_erp_people_care.html">People Care</a>',
        '</div>',

        /* Column 3: Servicios Oracle */
        '<div class="sf-col">',
          '<h4>Servicios Oracle</h4>',
          '<a href="/landing_modernizacion.html">Modernizaci\u00F3n Forms</a>',
          '<a href="/landing_oci.html">Oracle Cloud (OCI)</a>',
          '<a href="/landing_desarrollo_medida.html">Desarrollo a Medida</a>',
          '<a href="/landing_oac.html">Oracle Analytics</a>',
          '<a href="/landing_production_ai.html">Production AI</a>',
        '</div>',

        /* Column 4: Soluciones */
        '<div class="sf-col">',
          '<h4>Soluciones</h4>',
          '<a href="/solutions_crm.html">CRM Enterprise</a>',
          '<a href="/solutions_ai_chatbot.html">AI Chatbot</a>',
          '<a href="/solutions_automations.html">Automatización &amp; Orquestación</a>',
        '</div>',

        /* Column 5: Empresa */
        '<div class="sf-col">',
          '<h4>Empresa</h4>',
          '<a href="/people_culture.html">People &amp; Culture</a>',
          '<a href="/success_stories.html">Casos de \u00C9xito</a>',
          '<a href="/blog.html">Blog</a>',
          '<a href="/contacto.html">Contacto</a>',
        '</div>',

      '</div>', /* /sf-grid */

      /* Footer bottom row */
      '<div class="sf-bottom">',
        '<p class="sf-copy">\u00A9 2026 Inthegra Software. Argentina &amp; Latam.</p>',

        '<div class="sf-social">',
          '<a href="https://ar.linkedin.com/company/inthegra" target="_blank" rel="noopener" aria-label="LinkedIn">',
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
          '</a>',
          '<a href="https://www.instagram.com/inthegra_software/" target="_blank" rel="noopener" aria-label="Instagram">',
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z"/></svg>',
          '</a>',
          '<a href="https://www.facebook.com/inthegra.software" target="_blank" rel="noopener" aria-label="Facebook">',
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
          '</a>',
        '</div>',

        '<p class="sf-strip">Oracle Partner \u00B7 Enterprise Software</p>',

        '<div class="sf-legal">',
          '<a href="/privacidad.html">Privacidad</a>',
          '<a href="/terminos.html">T\u00E9rminos</a>',
        '</div>',

      '</div>', /* /sf-bottom */

    '</div>', /* /sf-inner */

    /* WhatsApp floating button */
    '<a class="sf-wa" href="https://wa.me/5493517393307?text=Hola,%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Inthegra%20Software" target="_blank" rel="noopener" aria-label="WhatsApp">',
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.570-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    '</a>',
  ].join('');

  /* ──────────────────────────────────────────────────────
     INIT — inject CSS + replace footer content
  ────────────────────────────────────────────────────── */
  function injectFooter() {
    /* 1. CSS */
    if (!document.getElementById('site-footer-css')) {
      var style = document.createElement('style');
      style.id = 'site-footer-css';
      style.textContent = FOOTER_CSS;
      document.head.appendChild(style);
    }

    /* 2. Find or create the footer element */
    var footer = document.querySelector('footer');
    if (!footer) {
      footer = document.createElement('footer');
      document.body.appendChild(footer);
    }
    footer.id = 'site-footer';
    footer.innerHTML = FOOTER_HTML;

    /* 3. Rewrite hrefs/srcs so links work from any deploy base path
          (prod root AND subpath deploys like GitHub Pages). */
    if (FOOTER_BASE) {
      var basePath = '/';
      try { basePath = new URL(FOOTER_BASE).pathname; } catch (e) {}
      var rebase = function (v) {
        if (!v) return v;
        if (/^(https?:|mailto:|tel:|#|\/\/|data:)/.test(v)) return v;
        if (v.charAt(0) === '/') {
          return basePath === '/' ? v : basePath + v.substring(1);
        }
        return basePath + v;
      };
      footer.querySelectorAll('a[href]').forEach(function (a) {
        a.setAttribute('href', rebase(a.getAttribute('href')));
      });
      footer.querySelectorAll('img[src]').forEach(function (img) {
        img.setAttribute('src', rebase(img.getAttribute('src')));
      });
    }

    /* 4. Mark active link based on current filename */
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    footer.querySelectorAll('.sf-col a').forEach(function (link) {
      var href = (link.getAttribute('href') || '').toLowerCase();
      var hrefFile = href.split('/').pop();
      if (hrefFile && hrefFile === page) {
        link.classList.add('sf-active');
      }
    });

    /* 5. WhatsApp prefill: if the page sets <body data-wa-context="...">,
          rebuild the WA href with that context so each landing carries its own
          conversation-starter. Otherwise the generic default stays. */
    var waCtx = (document.body.dataset.waContext || '').trim();
    if (waCtx) {
      var wa = footer.querySelector('.sf-wa');
      if (wa) {
        var msg = 'Hola, quiero m\u00E1s informaci\u00F3n sobre ' + waCtx;
        wa.setAttribute('href', 'https://wa.me/5493517393307?text=' + encodeURIComponent(msg));
      }
    }

    /* 6. GA4 click tracking (local — nav.js's trackClicks ran before footer existed) */
    footer.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
      link.addEventListener('click', function () {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'whatsapp_click',
          link_url: link.href,
          page_location: window.location.pathname
        });
      });
    });
    footer.querySelectorAll('a[href*="contacto.html"]').forEach(function (link) {
      link.addEventListener('click', function () {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'cta_click',
          link_url: link.href,
          link_text: link.textContent.trim(),
          page_location: window.location.pathname
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
}());
