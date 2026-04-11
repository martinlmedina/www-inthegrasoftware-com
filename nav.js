/**
 * Inthegra Software — Shared Navigation Component
 * Replaces the <header> element on every page with the canonical nav.
 * Include via: <script src="nav.js"></script> in <head>
 */
(function () {
  'use strict';

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

    /* Responsive */
    '@media(max-width:1100px){#site-nav .sn-inner{padding:0 24px;gap:16px;}}',
    '@media(max-width:768px){#site-nav nav{display:none;}}',
  ].join('');

  /* ──────────────────────────────────────────────────────
     HTML — canonical navigation markup
  ────────────────────────────────────────────────────── */
  var NAV_HTML = [
    '<div class="sn-inner">',

      /* Logo */
      '<div class="sn-logo">',
        '<a href="home.html">',
          '<img src="https://inthegrasoftware.com/wp-content/uploads/2026/02/Logo_oracle_header.svg" alt="Inthegra Software" />',
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
    var navBase = '';
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var s = scripts[i].src || '';
      if (s.match(/\/nav\.js(\?|$)/)) {
        navBase = s.replace(/\/nav\.js.*$/, '/');
        break;
      }
    }
    if (navBase) {
      header.querySelectorAll('a[href]').forEach(function(a) {
        var href = a.getAttribute('href');
        if (href && !href.match(/^(https?:|#|\/)/)) {
          a.setAttribute('href', navBase + href);
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
  }

  /* Run as soon as DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNav);
  } else {
    injectNav();
  }

})();
