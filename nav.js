/**
 * Inthegra Software — Shared Navigation Component
 * Replaces the <header> element on every page with the canonical nav.
 * Include via: <script src="nav.js"></script> in <head>
 */
(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────
     BASE URL — captured synchronously at script parse time
     so nav links resolve correctly from any subdirectory
     or GitHub Pages deploy path (e.g. /www-inthegrasoftware-com/).
     document.currentScript is only reliable during sync execution,
     so we grab it here at IIFE top level before any callbacks.
  ────────────────────────────────────────────────────── */
  var NAV_BASE = (function () {
    var cs = document.currentScript;
    if (cs && cs.src) return cs.src.replace(/\/nav\.js.*$/i, '/');
    /* Fallback for older browsers: scan script tags */
    var ss = document.getElementsByTagName('script');
    for (var i = 0; i < ss.length; i++) {
      if ((ss[i].src || '').match(/\/nav\.js(\?|$)/i)) {
        return ss[i].src.replace(/\/nav\.js.*$/i, '/');
      }
    }
    return '';
  }());

  /* ──────────────────────────────────────────────────────
     CSS — all scoped to #site-nav to avoid page conflicts
  ────────────────────────────────────────────────────── */
  var NAV_CSS = [
    /* Base header element */
    '#site-nav{',
      'position:sticky;top:0;z-index:500;',
      'background:rgba(8,17,31,.92);',
      'backdrop-filter:blur(24px) saturate(1.8);',
      '-webkit-backdrop-filter:blur(24px) saturate(1.8);',
      'border-bottom:1px solid rgba(30,50,87,.8);',
      'font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
    '}',

    /* Inner flex row */
    '#site-nav .sn-inner{',
      'display:flex;align-items:center;justify-content:space-between;',
      'max-width:1280px;margin:0 auto;padding:0 40px;',
      'height:64px;gap:24px;',
    '}',

    /* Logo */
    '#site-nav .sn-logo a{display:block;line-height:0;text-decoration:none;}',
    '#site-nav .sn-logo img{height:32px;width:auto;display:block;}',

    /* Nav container */
    '#site-nav nav{display:flex;align-items:center;gap:0;}',

    /* Regular + dropdown trigger links */
    '#site-nav .sn-link{',
      'color:#7294bb;text-decoration:none;font-size:13.5px;font-weight:500;',
      'padding:8px 13px;border-radius:8px;',
      'transition:color .18s,background .18s;',
      'white-space:nowrap;display:flex;align-items:center;gap:4px;',
    '}',
    '#site-nav .sn-link:hover{color:#eef4ff;background:rgba(255,255,255,.05);}',
    '#site-nav .sn-link.sn-active{color:#eef4ff;}',

    /* Chevron SVG on dropdown triggers */
    '#site-nav .sn-item > .sn-link::after{',
      'content:"";flex-shrink:0;',
      'width:14px;height:14px;',
      'background:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%237294bb\' stroke-width=\'2.5\' stroke-linecap=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E") center/contain no-repeat;',
      'transition:transform .2s;',
    '}',
    '#site-nav .sn-item:hover > .sn-link::after{transform:rotate(180deg);}',

    /* ── DROPDOWN HOVER FIX ──────────────────────────
       Problem: gap between trigger link and panel
       causes hover to drop before reaching the menu.
       Solution A: invisible bridge pseudo-element covers gap.
       Solution B: visibility+opacity with 100ms close-delay.
    ────────────────────────────────────────────────── */

    /* Dropdown item wrapper */
    '#site-nav .sn-item{position:relative;}',

    /* Bridge: invisible zone below the link that keeps hover alive
       while the cursor travels down to the panel */
    '#site-nav .sn-item::before{',
      'content:"";',
      'position:absolute;',
      'height:16px;',     /* must be >= top offset of .sn-panel */
      'width:140%;',
      'bottom:-16px;',
      'left:-20%;',
      'pointer-events:auto;',
      'z-index:1;',
    '}',

    /* Panel: hidden via visibility/opacity so transition-delay works */
    '#site-nav .sn-panel{',
      'visibility:hidden;opacity:0;pointer-events:none;',
      'position:absolute;top:calc(100% + 8px);left:0;',
      'background:rgba(8,17,31,.98);',
      'border:1px solid rgba(30,50,87,.9);',
      'border-radius:16px;padding:10px;min-width:260px;',
      'box-shadow:0 24px 64px rgba(0,0,0,.6);',
      /* Delay only on the closing transition (not opening) */
      'transition:opacity .18s ease,visibility .18s ease;',
      'transition-delay:100ms;',
      'z-index:400;',
    '}',

    /* Hover: show immediately, no delay */
    '#site-nav .sn-item:hover .sn-panel{',
      'visibility:visible;opacity:1;pointer-events:all;',
      'transition-delay:0ms;',
      'animation:snFadeDown .16s ease;',
    '}',

    '@keyframes snFadeDown{',
      'from{opacity:0;transform:translateY(-6px);}',
      'to{opacity:1;transform:translateY(0);}',
    '}',

    /* Panel items */
    '#site-nav .sn-panel-item{',
      'display:flex;align-items:center;gap:12px;',
      'padding:10px 12px;border-radius:10px;',
      'text-decoration:none;color:inherit;',
      'transition:background .16s;',
    '}',
    '#site-nav .sn-panel-item:hover{background:rgba(85,163,255,.08);}',

    '#site-nav .sn-pi-icon{',
      'width:34px;height:34px;border-radius:9px;',
      'display:flex;align-items:center;justify-content:center;',
      'font-size:16px;flex-shrink:0;',
    '}',
    '#site-nav .sn-pi-text strong{',
      'display:block;font-size:13px;color:#eef4ff;font-weight:600;margin-bottom:2px;',
    '}',
    '#site-nav .sn-pi-text span{font-size:11.5px;color:#7294bb;line-height:1.3;}',
    '#site-nav .sn-panel-sep{height:1px;background:rgba(30,50,87,.7);margin:6px 0;}',

    /* CTA button */
    '#site-nav .sn-cta{',
      'flex-shrink:0;padding:9px 22px;border-radius:10px;',
      'background:linear-gradient(135deg,#55a3ff,#7c5cff);',
      'color:#fff;font-size:13.5px;font-weight:700;text-decoration:none;',
      'box-shadow:0 4px 20px rgba(85,163,255,.28);',
      'transition:box-shadow .25s,transform .2s;',
      'white-space:nowrap;',
    '}',
    '#site-nav .sn-cta:hover{box-shadow:0 6px 30px rgba(85,163,255,.48);transform:translateY(-1px);}',

    /* Hamburger button (hidden on desktop) */
    '#site-nav .sn-burger{',
      'display:none;flex-shrink:0;background:none;border:none;cursor:pointer;',
      'width:40px;height:40px;padding:8px;border-radius:8px;',
      'transition:background .18s;',
    '}',
    '#site-nav .sn-burger:hover{background:rgba(255,255,255,.06);}',
    '#site-nav .sn-burger svg{display:block;width:24px;height:24px;}',

    /* Mobile overlay panel */
    '#site-nav .sn-mobile{',
      'display:none;position:fixed;top:64px;left:0;width:100%;',
      'height:calc(100vh - 64px);height:calc(100dvh - 64px);',
      'background:#08111f;',
      'overflow-y:auto;padding:16px 24px 32px;',
      'box-sizing:border-box;',
      'z-index:499;',
      'animation:snSlideDown .22s ease;',
    '}',
    '#site-nav .sn-mobile.sn-open{display:block;}',

    '@keyframes snSlideDown{from{opacity:0;transform:translateY(-12px);}to{opacity:1;transform:translateY(0);}}',

    /* Mobile nav links */
    '#site-nav .sn-mobile .sn-m-link{',
      'display:flex;align-items:center;justify-content:space-between;',
      'padding:14px 12px;border-radius:10px;',
      'color:#bdd2ef;text-decoration:none;font-size:15px;font-weight:500;',
      'border-bottom:1px solid rgba(30,50,87,.5);',
      'transition:background .16s,color .16s;',
    '}',
    '#site-nav .sn-mobile .sn-m-link:hover{background:rgba(255,255,255,.04);color:#eef4ff;}',
    '#site-nav .sn-mobile .sn-m-link.sn-active{color:#eef4ff;}',

    /* Mobile chevron for expandable sections */
    '#site-nav .sn-m-link .sn-m-chev{',
      'width:18px;height:18px;flex-shrink:0;',
      'transition:transform .2s;',
    '}',
    '#site-nav .sn-m-link.sn-m-expanded .sn-m-chev{transform:rotate(180deg);}',

    /* Mobile sub-panel */
    '#site-nav .sn-m-sub{',
      'display:none;padding:4px 0 8px 16px;',
    '}',
    '#site-nav .sn-m-sub.sn-open{display:block;}',

    '#site-nav .sn-m-sub a{',
      'display:flex;align-items:center;gap:10px;',
      'padding:10px 12px;border-radius:8px;',
      'text-decoration:none;color:#7294bb;font-size:13.5px;',
      'transition:background .16s,color .16s;',
    '}',
    '#site-nav .sn-m-sub a:hover{background:rgba(85,163,255,.06);color:#eef4ff;}',
    '#site-nav .sn-m-sub .sn-m-icon{',
      'width:30px;height:30px;border-radius:8px;',
      'display:flex;align-items:center;justify-content:center;',
      'font-size:14px;flex-shrink:0;',
    '}',
    '#site-nav .sn-m-sub .sn-m-label{font-weight:500;color:#eef4ff;font-size:13px;}',

    /* Mobile CTA */
    '#site-nav .sn-m-cta{',
      'display:block;text-align:center;margin-top:20px;padding:14px 24px;border-radius:12px;',
      'background:linear-gradient(135deg,#55a3ff,#7c5cff);',
      'color:#fff;font-size:15px;font-weight:700;text-decoration:none;',
      'box-shadow:0 4px 20px rgba(85,163,255,.28);',
    '}',

    /* Responsive */
    '@media(max-width:1100px){#site-nav .sn-inner{padding:0 24px;gap:16px;}}',
    '@media(max-width:768px){',
      '#site-nav nav{display:none;}',
      '#site-nav .sn-cta{display:none;}',
      '#site-nav .sn-burger{display:flex;align-items:center;justify-content:center;}',
    '}',
  ].join('');

  /* ──────────────────────────────────────────────────────
     HTML — canonical navigation markup
  ────────────────────────────────────────────────────── */
  var NAV_HTML = [
    '<div class="sn-inner">',

      /* Logo */
      '<div class="sn-logo">',
        '<a href="home.html">',
          '<img src="logo-header.svg" alt="Inthegra Software" />',
        '</a>',
      '</div>',

      /* Nav links */
      '<nav>',

        /* Productos */
        '<div class="sn-item">',
          '<a href="index_productos.html" class="sn-link">Productos</a>',
          '<div class="sn-panel">',
            '<a href="landing_healthcare.html" class="sn-panel-item">',
              '<span class="sn-pi-icon" style="background:rgba(45,212,191,.1);border:1px solid rgba(45,212,191,.2)">🏥</span>',
              '<div class="sn-pi-text"><strong>HealthCare</strong><span>Gestión integral para prepagas, clínicas y prestadores</span></div>',
            '</a>',
            '<a href="landing_credit_financial.html" class="sn-panel-item">',
              '<span class="sn-pi-icon" style="background:rgba(255,209,102,.1);border:1px solid rgba(255,209,102,.2)">💳</span>',
              '<div class="sn-pi-text"><strong>Credit &amp; Financial</strong><span>Crédito, cobranzas y gestión de carteras</span></div>',
            '</a>',
            '<a href="landing_erp.html" class="sn-panel-item">',
              '<span class="sn-pi-icon" style="background:rgba(255,107,53,.1);border:1px solid rgba(255,107,53,.2)">🏪</span>',
              '<div class="sn-pi-text"><strong>ERP para Retail &amp; Servicios</strong><span>Plataforma modular para retail, mayoristas y servicios</span></div>',
            '</a>',
          '</div>',
        '</div>',

        /* Servicios Oracle */
        '<div class="sn-item">',
          '<a href="index_services.html" class="sn-link">Servicios Oracle</a>',
          '<div class="sn-panel">',
            '<a href="landing_modernizacion.html" class="sn-panel-item">',
              '<span class="sn-pi-icon" style="background:rgba(85,163,255,.1);border:1px solid rgba(85,163,255,.2)">⚡</span>',
              '<div class="sn-pi-text"><strong>Modernización Forms</strong><span>Oracle Forms &amp; Reports modernizados con IA</span></div>',
            '</a>',
            '<a href="landing_oci.html" class="sn-panel-item">',
              '<span class="sn-pi-icon" style="background:rgba(53,211,155,.1);border:1px solid rgba(53,211,155,.2)">☁️</span>',
              '<div class="sn-pi-text"><strong>Oracle Cloud (OCI)</strong><span>Migración, arquitectura y operación cloud</span></div>',
            '</a>',
            '<a href="landing_desarrollo_medida.html" class="sn-panel-item">',
              '<span class="sn-pi-icon" style="background:rgba(124,92,255,.1);border:1px solid rgba(124,92,255,.2)">🛠️</span>',
              '<div class="sn-pi-text"><strong>Desarrollo a Medida</strong><span>APEX, ORDS, PWA y APIs Oracle-native</span></div>',
            '</a>',
            '<div class="sn-panel-sep"></div>',
            '<a href="landing_oac.html" class="sn-panel-item">',
              '<span class="sn-pi-icon" style="background:rgba(85,163,255,.1);border:1px solid rgba(85,163,255,.2)">📊</span>',
              '<div class="sn-pi-text"><strong>Oracle Analytics</strong><span>Semantic model, BI y dashboards enterprise</span></div>',
            '</a>',
            '<a href="landing_production_ai.html" class="sn-panel-item">',
              '<span class="sn-pi-icon" style="background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.2)">🤖</span>',
              '<div class="sn-pi-text"><strong>Production AI</strong><span>RAG, agentes y AI integrada a procesos reales</span></div>',
            '</a>',
          '</div>',
        '</div>',

        /* Soluciones */
        '<div class="sn-item">',
          '<a href="#" class="sn-link">Soluciones</a>',
          '<div class="sn-panel">',
            '<a href="solutions_crm.html" class="sn-panel-item">',
              '<span class="sn-pi-icon" style="background:rgba(124,92,255,.1);border:1px solid rgba(124,92,255,.2)">🤝</span>',
              '<div class="sn-pi-text"><strong>CRM Enterprise</strong><span>Pipeline de ventas y gestión de clientes</span></div>',
            '</a>',
            '<a href="solutions_ai_chatbot.html" class="sn-panel-item">',
              '<span class="sn-pi-icon" style="background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.2)">💬</span>',
              '<div class="sn-pi-text"><strong>AI Chatbot</strong><span>Asistente con RAG sobre los datos de tu empresa</span></div>',
            '</a>',
          '</div>',
        '</div>',

        /* Direct links */
        '<a href="people_culture.html" class="sn-link">People &amp; Culture</a>',
        '<a href="success_stories.html" class="sn-link">Casos de Éxito</a>',
        '<a href="blog.html" class="sn-link">Blog</a>',

      '</nav>',

      /* CTA */
      '<a href="#contacto" class="sn-cta">Hablar con un experto</a>',

      /* Hamburger button (mobile only) */
      '<button class="sn-burger" aria-label="Menú" aria-expanded="false">',
        '<svg viewBox="0 0 24 24" fill="none" stroke="#bdd2ef" stroke-width="2" stroke-linecap="round">',
          '<line class="sn-b1" x1="3" y1="6" x2="21" y2="6"/>',
          '<line class="sn-b2" x1="3" y1="12" x2="21" y2="12"/>',
          '<line class="sn-b3" x1="3" y1="18" x2="21" y2="18"/>',
        '</svg>',
      '</button>',

    '</div>',

    /* Mobile menu overlay */
    '<div class="sn-mobile">',

      /* Productos */
      '<a href="#" class="sn-m-link" data-toggle="m-productos">Productos',
        '<svg class="sn-m-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
      '</a>',
      '<div class="sn-m-sub" id="m-productos">',
        '<a href="landing_healthcare.html">',
          '<span class="sn-m-icon" style="background:rgba(45,212,191,.1);border:1px solid rgba(45,212,191,.2)">🏥</span>',
          '<span class="sn-m-label">HealthCare</span>',
        '</a>',
        '<a href="landing_credit_financial.html">',
          '<span class="sn-m-icon" style="background:rgba(255,209,102,.1);border:1px solid rgba(255,209,102,.2)">💳</span>',
          '<span class="sn-m-label">Credit & Financial</span>',
        '</a>',
        '<a href="landing_erp.html">',
          '<span class="sn-m-icon" style="background:rgba(255,107,53,.1);border:1px solid rgba(255,107,53,.2)">🏪</span>',
          '<span class="sn-m-label">ERP para Retail</span>',
        '</a>',
      '</div>',

      /* Servicios Oracle */
      '<a href="#" class="sn-m-link" data-toggle="m-servicios">Servicios Oracle',
        '<svg class="sn-m-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
      '</a>',
      '<div class="sn-m-sub" id="m-servicios">',
        '<a href="landing_modernizacion.html">',
          '<span class="sn-m-icon" style="background:rgba(85,163,255,.1);border:1px solid rgba(85,163,255,.2)">⚡</span>',
          '<span class="sn-m-label">Modernización Forms</span>',
        '</a>',
        '<a href="landing_oci.html">',
          '<span class="sn-m-icon" style="background:rgba(53,211,155,.1);border:1px solid rgba(53,211,155,.2)">☁️</span>',
          '<span class="sn-m-label">Oracle Cloud (OCI)</span>',
        '</a>',
        '<a href="landing_desarrollo_medida.html">',
          '<span class="sn-m-icon" style="background:rgba(124,92,255,.1);border:1px solid rgba(124,92,255,.2)">🛠️</span>',
          '<span class="sn-m-label">Desarrollo a Medida</span>',
        '</a>',
        '<a href="landing_oac.html">',
          '<span class="sn-m-icon" style="background:rgba(85,163,255,.1);border:1px solid rgba(85,163,255,.2)">📊</span>',
          '<span class="sn-m-label">Oracle Analytics</span>',
        '</a>',
        '<a href="landing_production_ai.html">',
          '<span class="sn-m-icon" style="background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.2)">🤖</span>',
          '<span class="sn-m-label">Production AI</span>',
        '</a>',
      '</div>',

      /* Soluciones */
      '<a href="#" class="sn-m-link" data-toggle="m-soluciones">Soluciones',
        '<svg class="sn-m-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
      '</a>',
      '<div class="sn-m-sub" id="m-soluciones">',
        '<a href="solutions_crm.html">',
          '<span class="sn-m-icon" style="background:rgba(124,92,255,.1);border:1px solid rgba(124,92,255,.2)">🤝</span>',
          '<span class="sn-m-label">CRM Enterprise</span>',
        '</a>',
        '<a href="solutions_ai_chatbot.html">',
          '<span class="sn-m-icon" style="background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.2)">💬</span>',
          '<span class="sn-m-label">AI Chatbot</span>',
        '</a>',
      '</div>',

      /* Direct links */
      '<a href="people_culture.html" class="sn-m-link">People & Culture</a>',
      '<a href="success_stories.html" class="sn-m-link">Casos de Éxito</a>',
      '<a href="blog.html" class="sn-m-link">Blog</a>',

      /* Mobile CTA */
      '<a href="#contacto" class="sn-m-cta">Hablar con un experto</a>',

    '</div>',
  ].join('');

  /* ──────────────────────────────────────────────────────
     INIT — inject CSS + replace header content
  ────────────────────────────────────────────────────── */
  function injectNav() {
    /* 1. CSS */
    if (!document.getElementById('site-nav-css')) {
      var style = document.createElement('style');
      style.id = 'site-nav-css';
      style.textContent = NAV_CSS;
      document.head.appendChild(style);
    }

    /* 2. Find or create the header element */
    var header = document.querySelector('header');
    if (!header) {
      header = document.createElement('header');
      if (document.body.firstChild) {
        document.body.insertBefore(header, document.body.firstChild);
      } else {
        document.body.appendChild(header);
      }
    }
    header.id = 'site-nav';
    header.innerHTML = NAV_HTML;

    /* 3. Fix relative hrefs: resolve against nav.js location so links work
          from any subdirectory and any deploy base path (e.g. GitHub Pages) */
    if (NAV_BASE) {
      header.querySelectorAll('a[href]').forEach(function(a) {
        var href = a.getAttribute('href');
        if (href && !href.match(/^(https?:|#|\/)/)) {
          a.setAttribute('href', NAV_BASE + href);
        }
      });
    }

    /* 4. Mark active link based on current filename */
    var page = (location.pathname.split('/').pop() || 'home.html').toLowerCase();
    var links = header.querySelectorAll('.sn-link, .sn-panel-item');
    links.forEach(function (link) {
      var href = (link.getAttribute('href') || '').toLowerCase();
      var hrefFile = href.split('/').pop();
      if (hrefFile && hrefFile === page) {
        link.classList.add('sn-active');
        /* Also highlight the parent trigger if inside a panel */
        var parentItem = link.closest('.sn-item');
        if (parentItem) {
          var trigger = parentItem.querySelector('.sn-link');
          if (trigger) trigger.classList.add('sn-active');
        }
      }
    });

    /* Special case: home — logo only, nothing to highlight */

    /* 5. Mobile menu: hamburger toggle + dropdown accordions */
    var burger = header.querySelector('.sn-burger');
    var mobilePanel = header.querySelector('.sn-mobile');
    if (burger && mobilePanel) {
      burger.addEventListener('click', function () {
        var isOpen = mobilePanel.classList.toggle('sn-open');
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        /* Prevent body scroll when menu is open */
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      /* Accordion toggles for expandable sections */
      var toggleLinks = mobilePanel.querySelectorAll('[data-toggle]');
      toggleLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          var targetId = link.getAttribute('data-toggle');
          var sub = document.getElementById(targetId);
          if (sub) {
            var wasOpen = sub.classList.contains('sn-open');
            sub.classList.toggle('sn-open');
            link.classList.toggle('sn-m-expanded');
            /* Close other open sections */
            if (!wasOpen) {
              toggleLinks.forEach(function (otherLink) {
                if (otherLink !== link) {
                  var otherId = otherLink.getAttribute('data-toggle');
                  var otherSub = document.getElementById(otherId);
                  if (otherSub) otherSub.classList.remove('sn-open');
                  otherLink.classList.remove('sn-m-expanded');
                }
              });
            }
          }
        });
      });

      /* Close mobile menu when a real link is clicked */
      mobilePanel.querySelectorAll('a:not([data-toggle])').forEach(function (a) {
        a.addEventListener('click', function () {
          mobilePanel.classList.remove('sn-open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* Run as soon as DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNav);
  } else {
    injectNav();
  }

})();
