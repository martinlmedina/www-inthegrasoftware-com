# Resumen Ejecutivo — inthegrasoftware.com

**Fecha:** 21 de abril de 2026
**Version:** Sitio estatico HTML/CSS/JS — listo para go-live

---

## 1. Vision general

Sitio web corporativo de Inthegra Software, 100% estatico (sin backend), con **35 paginas de produccion** (incluye 12 articulos de blog). Construido sobre HTML/CSS/JS puro, sin frameworks. Navegacion y footer compartidos via `nav.js` y `footer.js`, sistema de diseno unificado via `common.css` y CSS custom properties.

**Stack:**
- HTML5 semantico con `<main>`, `<article>`, Open Graph, JSON-LD
- CSS puro con custom properties (design tokens)
- JavaScript vanilla (nav.js + footer.js como componentes compartidos, IIFE pattern)
- Google Tag Manager + GA4 + Google Ads conversion tracking
- Meta Pixel (Facebook) con evento `Lead` en submit del formulario
- Formulario de contacto conectado a Google Apps Script (Sheet + email)
- WhatsApp prefill por pagina via `<body data-wa-context="...">` leido por `footer.js`

---

## 2. Inventario de paginas

### Productos (3 landings + 1 hub)

| Pagina | Archivo | Que cubre |
|--------|---------|-----------|
| Hub de Productos | index_productos.html | Indice con los 3 productos |
| HealthCare | landing_healthcare.html | ERP para prepagas, obras sociales, clinicas, emergencias, medicina laboral, internacion domiciliaria. Clientes: SIPSSA, EMI, Alta Salud, Roster, INDOM, YIOS |
| Credit & Financial | landing_credit_financial.html | Plataforma de prestamos, tarjetas no bancarizadas, cobranzas. Clientes: Elebar, Sucredito, La Zonal, Grupo Dilfer, Noacard |
| ERP / Business Suite | landing_erp.html | ERP para retail minorista, mayorista y servicios. Hub del producto |

### Modulos ERP (4 landings, enlazados desde el mega-panel del nav)

| Pagina | Archivo | Que cubre |
|--------|---------|-----------|
| Supply Chain | landing_erp_supply_chain.html | Planificacion, compras y abastecimiento |
| Warehouse Management (WMS) | landing_erp_wms.html | Gestion de depositos y logistica |
| Ecommerce Platform | landing_erp_ecommerce.html | Tiendas online integradas al ERP (storefront + stock en vivo) |
| People Care (RRHH) | landing_erp_people_care.html | Liquidacion, legajos y desarrollo de talento |

### Servicios Oracle (5 landings + 1 hub)

| Pagina | Archivo | Que cubre |
|--------|---------|-----------|
| Hub de Servicios | index_services.html | Indice con los 5 servicios |
| Modernizacion | landing_modernizacion.html | Migracion Oracle Forms/Reports a APEX con IA |
| Oracle Cloud (OCI) | landing_oci.html | Migracion, arquitectura y operacion cloud Oracle |
| Desarrollo a Medida | landing_desarrollo_medida.html | Apps APEX, ORDS, PWA y APIs Oracle-native |
| Oracle Analytics | landing_oac.html | BI, dashboards ejecutivos, semantic models sobre OAC |
| Production AI | landing_production_ai.html | RAG, agentes, AI integrada a procesos enterprise |

### Soluciones (2 paginas)

| Pagina | Archivo | Que cubre |
|--------|---------|-----------|
| CRM Enterprise | solutions_crm.html | Sales CRM + Collections CRM integrado con ERP |
| AI Chatbot | solutions_ai_chatbot.html | Asistente conversacional con RAG sobre datos del cliente |

### Institucional (4 paginas)

| Pagina | Archivo | Que cubre |
|--------|---------|-----------|
| Home | index.html | Landing principal, propuesta de valor, CTA |
| Contacto | contacto.html | Formulario de contacto, WhatsApp, email |
| People & Culture | people_culture.html | Equipo, cultura, hiring |
| Casos de Exito | success_stories.html | JAVER, Valle Fertil SA, Federacion Peruana de Futbol, Sidecreer, INFA, MSPORT |

### Legales (2 paginas)

| Pagina | Archivo | Que cubre |
|--------|---------|-----------|
| Politica de Privacidad | privacidad.html | Tratamiento de datos personales, GA4/Pixel/Apps Script como procesadores, Ley 25.326, derechos ARCO |
| Terminos y Condiciones | terminos.html | Uso del sitio, propiedad intelectual, enlaces de terceros, jurisdiccion Cordoba |

### Blog (1 hub + 12 articulos)

| Articulo | Fecha publicacion |
|----------|-------------------|
| Desarrollo de soluciones de software a medida | 2026-04-12 |
| Oracle Cloud Infrastructure: nube empresarial para sistemas criticos | 2026-03-18 |
| Modernizacion: como actualizar sistemas sin perder lo que ya funciona | 2026-03-04 |
| Desarrollo a medida: cuando la tecnologia se adapta al negocio | 2026-02-19 |
| Oracle Cloud Infrastructure (OCI): Que es y por que tu empresa la necesita | 2026-02-04 |
| Oracle Services: acompanamos la evolucion tecnologica de tu negocio | 2025-12-18 |
| Eficiencia e integracion para Obras Sociales con Health Suite | 2025-10-29 |
| Health Suite para Internacion Domiciliaria | 2025-10-22 |
| Digitaliza tu gestion de medicina prepaga con Health Suite | 2025-10-15 |
| Health Suite para medicina laboral | 2025-10-08 |
| Health Suite: como Inthegra digitaliza la industria de la salud | 2025-10-02 |
| Como un ERP transforma el retail | 2025-09-11 |

### Utilidad (3 archivos)

| Archivo | Funcion |
|---------|---------|
| 404.html | Pagina de error custom (noindex) |
| sitemap.xml | 35 URLs, actualizado 2026-04-21 (incluye 4 modulos ERP + 2 legales) |
| robots.txt | Allow all, referencia a sitemap |
| llms.txt | Mapa del sitio para crawlers de IA, actualizado 2026-04-21 |

---

## 3. SEO y metadatos — Estado actual

| Item | Estado | Cobertura |
|------|--------|-----------|
| Title tags | OK | 29/29 paginas |
| Meta description | OK | 29/29 paginas |
| Canonical URLs | OK | 29/29 paginas (URLs limpias con trailing slash) |
| Open Graph (og:title, og:description, og:image, og:url) | OK | 29/29 paginas |
| Twitter Cards | OK | 29/29 paginas |
| JSON-LD structured data | OK | Organization en home, BreadcrumbList en landings, Article en blog |
| Tag `<main>` | OK | 29/29 paginas |
| robots.txt | OK | Creado |
| sitemap.xml | OK | 29 URLs |
| llms.txt | OK | Creado |
| hreflang (i18n) | PENDIENTE | Solo español. Sin soporte multi-idioma aun |

---

## 4. Tracking y analytics

| Herramienta | ID / Detalle | Estado |
|-------------|-------------|--------|
| Google Tag Manager | GTM-TRT4B92N | Instalado en todas las paginas |
| Google Ads | AW-16670573573 | Conversion tracking activo |
| GA4 Events (via dataLayer) | `form_submit`, `whatsapp_click`, `cta_click` | Configurados en nav.js y contacto.html |
| Meta Pixel (Facebook) | 1226651955694155 | `PageView` en las 30 paginas + `Lead` en submit del form |

### Eventos custom disponibles en GTM

| Evento | Cuando se dispara | Variables |
|--------|-------------------|-----------|
| `form_submit` | Envio del formulario de contacto | form_name, form_interest, form_origin |
| `whatsapp_click` | Click en cualquier link de WhatsApp | link_url, page_location |
| `cta_click` | Click en cualquier CTA a contacto.html | link_url, link_text, page_location |
| `Lead` (Meta Pixel) | Envio exitoso del formulario de contacto | — (evento standard de Facebook) |

---

## 5. Sistema de diseno

### Paleta de colores (CSS custom properties)

| Variable | Valor | Uso |
|----------|-------|-----|
| `--bg` | #0F2043 | Fondo principal (azul oscuro enterprise) |
| `--bg-deep` | #08111f | Fondo profundo |
| `--bg-panel` | #0f1830 | Paneles |
| `--bg-card` | #121f3d | Cards |
| `--text` | #eef4ff | Texto principal |
| `--text-2` | #c0d4f0 | Texto secundario |
| `--muted` | #7d9ac4 | Texto terciario |
| `--brand` | #55a3ff | Azul marca principal |
| `--brand-2` | #7c5cff | Violeta secundario |
| `--green` | #35d39b | Acento verde |
| `--teal` | #2dd4bf | Acento teal (HealthCare) |
| `--gold` | #ffd166 | Acento dorado |
| `--ai` | #a78bfa | Acento AI (lavanda) |

### Acentos por producto

| Producto | Color acento |
|----------|-------------|
| HealthCare | Teal #2dd4bf |
| Credit & Financial | Azul #6ea8ff / #84e1ff |
| ERP / Business Suite | Naranja #ff6b35 / #ffb347 |
| Modernizacion | Azul #5aa0ff / Violeta #7c5cff |

### Tipografia

- **Fuente:** Inter (Google Fonts), pesos 400-900
- **Container:** max-width 1260px

### Componentes compartidos

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| Navegacion | nav.js | IIFE que inyecta header sticky con dropdowns, mega-panel ERP de 2 columnas, mobile accordion, GA4 events |
| Footer + WhatsApp | footer.js | IIFE que inyecta footer unificado (5 columnas) y boton flotante de WhatsApp. Lee `data-wa-context` del `<body>` para personalizar el prefill por pagina |
| Design tokens | common.css | Variables CSS, reset, tipografia, componentes base |
| Background SVGs | Product.svg, Services.svg, Solutions.svg, Inthegra.svg | Graficos decorativos por seccion, opacity 0.10-0.16 |

---

## 6. Navegacion (menu)

```
Productos
  ├── HealthCare
  ├── Credit & Financial
  └── ERP para Retail & Servicios
       └── [mega-panel 2 columnas]
            ├── Supply Chain
            ├── Warehouse Management (WMS)
            ├── Ecommerce Platform
            └── People Care (RRHH)

Servicios Oracle
  ├── Modernizacion Forms
  ├── Oracle Cloud (OCI)
  ├── Desarrollo a Medida
  ├── ──────────────
  ├── Oracle Analytics
  └── Production AI

Soluciones
  ├── CRM Enterprise
  └── AI Chatbot

People & Culture
Casos de Exito
Blog

[CTA] Hablar con un experto → contacto.html
```

---

## 7. Infraestructura y deploy

Documento tecnico completo en: **`docs/DEPLOY_INFRAESTRUCTURA.md`**

Resumen:
- Servidor web: Nginx recomendado (config incluida con 17 reglas de URL rewrite)
- VM minima: 1 vCPU, 1 GB RAM, 10 GB SSD
- SSL: Let's Encrypt (gratis, auto-renovacion)
- Alternativa: OCI Free Tier (gratis, Oracle Partner)

---

## 8. Issues bloqueantes para produccion

**Ninguno.** El formulario de contacto ya apunta al Apps Script desplegado (commit `1c56e17`, 2026-04-20) y se validó el flujo end-to-end (submission → Google Sheet → email de notificacion). El footer fue unificado en `footer.js` (commit `8caedf5`, 2026-04-21) y las paginas legales (privacidad, terminos) fueron publicadas (commit `0688489`, 2026-04-21), cerrando los links rotos del footer.

**Documentacion de referencia:**
- Backend del formulario: `docs/SETUP_CONTACTO_BACKEND.md`
- Deploy de infraestructura: `docs/DEPLOY_INFRAESTRUCTURA.md`
- Setup de tracking y SEO post-deploy: `docs/SETUP_TRACKING_SEO.md`

---

## 9. Roadmap — Pendientes a futuro

### Prioridad Alta (antes o poco despues del go-live)

| Item | Detalle | Esfuerzo |
|------|---------|----------|
| ~~Deployar Apps Script~~ | ~~Configurar backend del formulario de contacto~~ | ✅ Hecho 2026-04-20 |
| ~~Integrar Meta Pixel~~ | ~~Instalar pixel de Facebook + evento Lead en formulario~~ | ✅ Hecho 2026-04-20 |
| ~~Unificar footer~~ | ~~Reemplazar footers hardcoded por `footer.js` compartido~~ | ✅ Hecho 2026-04-21 |
| ~~Publicar paginas legales~~ | ~~Crear privacidad.html y terminos.html (links del footer)~~ | ✅ Hecho 2026-04-21 |
| ~~Regenerar sitemap.xml y llms.txt~~ | ~~Agregar las 6 paginas nuevas (4 modulos ERP + 2 legales)~~ | ✅ Hecho 2026-04-21 |
| Configurar GTM triggers | Crear triggers para form_submit, whatsapp_click en GTM y conectar con GA4 goals. [Guía](SETUP_TRACKING_SEO.md#1-gtm-triggers--ga4-goals) | Marketing — 2 horas |
| Configurar Meta Events Manager | Verificar llegada de `PageView` y `Lead`, crear audiencias de remarketing. [Guía](SETUP_TRACKING_SEO.md#2-meta-events-manager) | Marketing — 1 hora |
| Google Search Console | Verificar propiedad via GTM, enviar sitemap. [Guía](SETUP_TRACKING_SEO.md#3-google-search-console) | Marketing/IT — 30 min |
| Optimizar imagenes | Convertir PNGs a WebP, agregar srcset/sizes para responsive images | Dev — medio dia |
| Extraer CSS comun | Mover CSS inline repetido (~20-37 KB por pagina) a common.css | Dev — 1 dia |

### Prioridad Media (primer mes post-launch)

| Item | Detalle | Esfuerzo |
|------|---------|----------|
| Internacionalizacion (i18n) | Definir estrategia de URLs (/en/, /pt/), traducir paginas a ingles y portugues, agregar hreflang tags | Dev — 2-3 semanas |
| CRM integration | Conectar formulario de contacto con Kommo u otro CRM para seguimiento automatico de leads | Dev/IT — 2-3 dias |
| Blog — cadencia de publicacion | Definir calendario editorial, idealmente 2-4 articulos/mes para SEO | Marketing — ongoing |
| Performance audit | Lighthouse full, Core Web Vitals, lazy loading de imagenes below-fold | Dev — 1 dia |
| Analytics dashboard | Configurar reportes en GA4: top pages, conversion rate, sources, bounce rate | Marketing — 1 dia |

### Prioridad Baja (trimestre 2+)

| Item | Detalle | Esfuerzo |
|------|---------|----------|
| Live chat / Chatbot widget | Integrar chat en tiempo real (Intercom, Drift, o el propio AI Chatbot de Inthegra) | Dev — 1 semana |
| A/B testing | Testear variantes de CTAs, hero copy, y formulario de contacto | Marketing — ongoing |
| Blog search | Agregar buscador al blog cuando supere 20+ articulos | Dev — 1 dia |
| Service Worker / PWA | Offline support y carga instantanea para visitantes recurrentes | Dev — 2-3 dias |
| Schema.org ampliado | Agregar FAQPage schema a landings, Review schema a casos de exito | Dev — 1 dia |
| Automatizacion CI/CD | GitHub Actions para deploy automatico en push a master | Dev/IT — medio dia |
| CDN | Configurar Cloudflare o CloudFront si el trafico lo justifica | IT — medio dia |
| Accesibilidad WCAG 2.1 | Audit completo, focus states, ARIA labels, contraste | Dev — 1 semana |

### Ideas a evaluar

| Item | Notas |
|------|-------|
| Testimonios en video | Embeber videos cortos de clientes en success_stories.html |
| Calculadora de ROI | Herramienta interactiva para que prospects estimen retorno de inversion |
| Newsletter signup | Captura de emails en blog para nurturing |
| Webinars / Eventos | Seccion de eventos proximos y grabaciones de webinars pasados |
| Documentacion publica | Portal de docs para clientes actuales (Knowledge Base) |

---

## 10. Metricas de salud del sitio

| Metrica | Valor |
|---------|-------|
| Total paginas produccion | 23 top-level + 12 blog = 35 |
| Peso total del sitio | ~4.5 MB (sin PDF brochure de 28 MB) |
| Paginas con SEO completo | 35/35 (100%) |
| Paginas con GTM | 36/36 (100%, incluye 404) |
| Paginas con Meta Pixel | 36/36 (100%, incluye 404) |
| Footer unificado | 33/33 paginas via `footer.js` |
| Formulario de contacto | Activo (Apps Script → Google Sheet + email) |
| Links rotos en navegacion | 0/22 |
| Archivos JS en produccion | 2 (nav.js, footer.js — limpios, sin console.log) |
| Issues bloqueantes | 0 |
| SSL | Pendiente (Let's Encrypt al deployar) |

---

*Documento actualizado el 21 de abril de 2026. Basado en auditoria del repositorio martinlmedina/www-inthegrasoftware-com, branch master, commit `6e3f8da`.*
