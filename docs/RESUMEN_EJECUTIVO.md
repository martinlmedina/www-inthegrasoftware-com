# Resumen Ejecutivo — inthegrasoftware.com

**Fecha:** 5 de mayo de 2026
**Version:** Sitio en produccion — sprint SEO tecnico + performance optimization cerrados

---

## 1. Vision general

Sitio web corporativo de Inthegra Software, 100% estatico (sin backend), con **37 paginas en sitemap** (23 top-level + 13 articulos de blog + home). Construido sobre HTML/CSS/JS puro, sin frameworks. Navegacion y footer compartidos via `nav.js` y `footer.js`, sistema de diseno unificado via `common.css` y CSS custom properties.

**Stack:**
- HTML5 semantico con `<main>`, `<article>`, Open Graph, Twitter cards, JSON-LD enriquecido, hreflang stub
- CSS puro con custom properties (design tokens). `common.css` inline en `<head>` para eliminar roundtrip critico
- JavaScript vanilla (nav.js + footer.js como componentes compartidos, IIFE pattern)
- Apache + `.htaccess`: Brotli + Gzip, WebP auto-serve, cache 1 año immutable para estaticos, 0s para HTML
- 3rd-party scripts (GTM, Meta Pixel, Google Ads gtag) deferidos a primera interaccion del usuario via `load3rdParty()` pattern
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

### Soluciones (3 paginas)

| Pagina | Archivo | Que cubre |
|--------|---------|-----------|
| CRM Enterprise | solutions_crm.html | Sales CRM + Collections CRM integrado con ERP |
| AI Chatbot | solutions_ai_chatbot.html | Asistente conversacional con RAG sobre datos del cliente |
| Automatizacion & Orquestacion | solutions_automations.html | Workflows empresariales con n8n sobre OCI, integra ERP/CRM/WA + agentes IA |

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

### Blog (1 hub + 13 articulos)

| Articulo | Slug |
|----------|------|
| ¿Que es Oracle Analytics Cloud? | que-es-oracle-analytics-cloud |
| Desarrollo de soluciones de software a medida | desarrollo-de-soluciones-de-software-a-medida |
| Oracle Cloud Infrastructure: nube empresarial para sistemas criticos | oracle-cloud-infrastructure-sistemas-criticos |
| Modernizacion: como actualizar sistemas sin perder lo que ya funciona | modernizacion-como-actualizar-sistemas |
| Desarrollo a medida: cuando la tecnologia se adapta al negocio | desarrollo-a-medida-oracle-apex |
| Oracle Cloud Infrastructure (OCI): Que es y por que tu empresa la necesita | oracle-cloud-infrastructure-beneficios |
| Oracle Services: acompanamos la evolucion tecnologica de tu negocio | oracle-services-inthegra |
| Eficiencia e integracion para Obras Sociales con Health Suite | healthsuite-obrassociales-erp |
| Health Suite para Internacion Domiciliaria | healthsuite-internacion-domiciliaria-erp |
| Digitaliza tu gestion de medicina prepaga con Health Suite | healthsuite-medicina-prepaga-erp |
| Health Suite para medicina laboral | healthsuitemedicinalaboral |
| Health Suite: como Inthegra digitaliza la industria de la salud | erp-salud-beneficios-inthegra |
| Como un ERP transforma el retail | erp-retail-inthegra |

### Utilidad

| Archivo | Funcion |
|---------|---------|
| 404.html | Pagina de error custom (noindex), con meta description |
| sitemap.xml | 37 URLs, lastmod 2026-05-04 |
| robots.txt | Allow all, referencia a sitemap |
| llms.txt | Mapa del sitio para crawlers de IA |
| .htaccess | Apache config: Brotli, cache, WebP auto-serve, 24 redirects 301 (URL limpia → .html), 6 redirects legacy WP, 9 reglas 410 Gone |

---

## 3. SEO tecnico — Estado (cerrado el 2026-04-29)

| Item | Estado | Cobertura |
|------|--------|-----------|
| Title tags | OK | 37/37 |
| Meta description | OK | 37/37 (incluye 404) |
| Canonical URLs | OK | Todas apuntan a `.html` directo (post-revert 4-mayo) |
| Open Graph (og:title, og:description, og:image, og:url) | OK | 37/37 (incluye legales) |
| Twitter Cards (summary_large_image) | OK | 37/37 |
| `<main>` semantico | OK | 37/37 |
| robots.txt | OK | Configurado |
| sitemap.xml | OK | 37 URLs, lastmod 2026-05-04 |
| llms.txt | OK | Mantenido |
| 404.html | OK | noindex + meta description |
| hreflang stub `es-AR` + `x-default` | OK | 37/37 (preparacion para futura i18n) |
| Breadcrumbs | OK | Corregidos en solutions_*.html (2 niveles) |
| **i18n real (en, pt-BR)** | PENDIENTE | Solo español. Ver §11 |

### JSON-LD enriquecido por tipo de pagina

| Tipo de pagina | Schema |
|----------------|--------|
| Home (index.html) | Organization |
| Hubs (index_productos.html, index_services.html) | CollectionPage + ItemList |
| Landings de productos | BreadcrumbList + SoftwareApplication |
| Landings de servicios | BreadcrumbList + Service |
| Soluciones | BreadcrumbList + SoftwareApplication |
| Casos de Exito | CollectionPage + ItemList |
| People & Culture | AboutPage |
| Contacto | ContactPage |
| Blog hub | Blog (con array de 13 BlogPosting) |
| Posts del blog | Article |
| Legales | WebPage |

### Decisiones conscientes de NO implementar

- **FAQPage schema** en solutions_ai_chatbot y landing_production_ai — auditoria del DOM mostro que NO hay secciones de FAQ reales (solo menciones aisladas en SVG decorativos). Agregar FAQPage sin Q&A visibles viola politica de Google y puede penalizar.
- **og:image dedicada por pagina** (1200×630) — se sigue con `logo-header.svg`. Refactor futuro si se quiere mejorar previews en redes.

---

## 4. Performance (cerrado el 2026-04-24, 3 rounds de optimizacion)

### Estado final PageSpeed

| Metrica | Mobile | Desktop |
|---|---|---|
| Performance score | >90 | >90 |
| LCP | 2.1s (desde 4.4s) | ~2s |
| TBT | <200ms | <300ms (desde 1,590ms) |
| CLS | 0.001 | 0 |

### Optimizaciones aplicadas

- **Brotli** activado (mas Gzip fallback) — compresion para HTML/CSS/JS/SVG/JSON/XML
- **Cache headers**: 1 año immutable para estaticos, 0s + must-revalidate para HTML
- **WebP auto-serve** via `mod_rewrite`: si el browser acepta `image/webp` y existe `foo.png.webp`, se sirve el webp
- **14 imagenes PNG/JPG → WebP** (Pillow, script `scripts/optimize_images.py`) — **3.6 MB ahorrados**
- **`<img>` con loading="lazy", decoding="async", width, height** en 88 imgs (script `scripts/add_img_attrs.py`)
- **common.css inline** en `<head>` (1.8 KiB gzipped) — elimina roundtrip critico que pesaba 3,225ms en mobile 4G (script `scripts/inline_common_css.py`)
- **3rd-party scripts deferidos a interaccion** (GTM, Meta Pixel, Google Ads gtag) — script `scripts/defer_3p_to_interaction.py`. Triggers: scroll, keydown, touchstart, pointerdown, click. Fallback timeout 30s
- **LCP logo preload** + `fetchpriority="high"` en el `<img>` real del header (en nav.js y placeholder estatico)
- **Google Fonts async** via `<link rel="preload" as="style" onload="this.rel='stylesheet'">`
- **Cleanup**: borrados PNG duplicados de SVGs (Inthegra, Product, Services, Solutions) y `BROCHURE CRM.pdf` (29 MB sin uso)

### Trade-offs aceptados

1. **Tracking post-interaccion**: usuarios que bouncen en <30s sin scrollear/tocar no se trackean. Aceptable para B2B enterprise donde la intent viene de CTAs.
2. **CSS comun inlineado**: ~1.4 KB extra por HTML × 37 = ~52 KB en deploy. Con Brotli activo es negligible.

### Scripts reusables en `scripts/`

| Script | Funcion |
|--------|---------|
| `optimize_images.py` | PNG/JPG >50KB → WebP |
| `add_img_attrs.py` | loading="lazy", decoding="async", width/height en `<img>` |
| `inline_common_css.py` | Inlinea common.css en `<head>` |
| `inline_logo_svg.py` | Inlinea SVG del logo |
| `defer_3p_to_interaction.py` | Patron defer 3rd-party a primera interaccion |
| `batch_head_perf.py` | Migracion inicial de head (Round 1) |

---

## 5. Tracking y analytics

| Herramienta | ID / Detalle | Estado |
|-------------|-------------|--------|
| Google Tag Manager | GTM-TRT4B92N | Instalado en todas las paginas (deferido a interaccion) |
| Google Ads | AW-16670573573 | Conversion tracking activo (tambien deferido) |
| GA4 Events (via dataLayer) | `form_submit`, `whatsapp_click`, `cta_click` | Configurados en nav.js y contacto.html |
| Meta Pixel (Facebook) | 1226651955694155 | `PageView` en todas las paginas + `Lead` en submit del form |

### Eventos custom disponibles en GTM

| Evento | Cuando se dispara | Variables |
|--------|-------------------|-----------|
| `form_submit` | Envio del formulario de contacto | form_name, form_interest, form_origin |
| `whatsapp_click` | Click en cualquier link de WhatsApp | link_url, page_location |
| `cta_click` | Click en cualquier CTA a contacto.html | link_url, link_text, page_location |
| `Lead` (Meta Pixel) | Envio exitoso del formulario de contacto | — (evento standard de Facebook) |

---

## 6. Sistema de diseno

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

### Acentos por producto (marca)

| Producto | Color acento (sitio) | Color marca oficial |
|----------|---------------------|---------------------|
| HealthCare | Teal #2dd4bf | — |
| Credit & Financial | Azul #6ea8ff / #84e1ff | — |
| ERP / Business Suite | Naranja #ff6b35 / #ffb347 | — |
| Modernizacion | Azul #5aa0ff / Violeta #7c5cff | — |
| Inthegra (corporate) | — | #ff7200 |
| Products division | — | #179dca |
| Services division | — | #F7B5CD |
| Solutions division | — | #a603fc |

### Tipografia

- **Fuente:** Inter (Google Fonts), pesos 400-900, cargada async
- **Container:** max-width 1240px-1260px

### Componentes compartidos

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| Navegacion | nav.js | IIFE que inyecta header sticky con dropdowns, mega-panel ERP de 2 columnas, mobile accordion, GA4 events. fetchpriority="high" + rebase para subpath |
| Footer + WhatsApp | footer.js | IIFE que inyecta footer unificado (5 columnas) y boton flotante de WhatsApp. Lee `data-wa-context` del `<body>` para personalizar el prefill por pagina |
| Design tokens | common.css | Variables CSS, reset, tipografia, componentes base. Inlineado en `<head>` |
| Background SVGs | Product.svg, Services.svg, Solutions.svg, Inthegra.svg | Graficos decorativos por seccion, opacity 0.10-0.16 |

---

## 7. Navegacion (menu)

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
  ├── AI Chatbot
  └── Automatizacion & Orquestacion (n8n + OCI)

People & Culture
Casos de Exito
Blog

[CTA] Hablar con un experto → contacto.html
```

---

## 8. Infraestructura y deploy

Documento tecnico completo en: **`docs/DEPLOY_INFRAESTRUCTURA.md`**

**Estado actual: en produccion** sobre **Apache** (no Nginx). El `.htaccess` activo en raiz tiene:

| Bloque | Que hace |
|--------|----------|
| `RewriteEngine On` + WebP auto-serve | Sirve `.webp` cuando el browser lo acepta y el archivo existe |
| 6 redirects 301 legacy Inthegra | `/erp-creditos/` → `/landing_credit_financial.html`, `/salud-erp/` → `/landing_healthcare.html`, `/nosotros/` → `/people_culture.html`, `/people-culture/` → idem, `/crm/` → `/solutions_crm.html`, `/casos-de-valor/*` → `/success_stories.html` |
| 9 reglas 410 Gone | Limpieza WordPress legacy: `/category/*`, `/tag/*`, `/author/*`, `/feed/*`, `/wp-*`, `/xmlrpc.php`, `?p=N`, `?page_id=N`, `/en/` (root) |
| 24 redirects 301 URL limpia → .html | Compatibilidad backwards: `/productos/healthcare/` → `/landing_healthcare.html`, etc. El **canonico es el .html** |
| Bloqueo `^docs/` y `^(mock_\|mockup-\|home_oldversion\|view-source_)` | Protege internos y drafts del acceso web |
| Brotli + Gzip | Compresion para HTML/CSS/JS/SVG/JSON/XML |
| Expiraciones + Cache-Control | 1 año immutable para estaticos, 0s + must-revalidate para HTML |

---

## 9. Post-mortem: incidente URLs limpias (4-mayo-2026)

**Que se intento**: el 29-abril el sprint SEO incluyo activar URLs limpias internas (`/productos/healthcare/` servido directamente como contenido, no redirigido). El 4-mayo se detecto que rompio el sitio en produccion.

**Por que fallo**: todos los paths en los HTML son **relativos** (`<script src="nav.js">`, `<link href="favicon-32.png">`, `<img src="img/...">`). El browser resuelve relativos contra la URL **visible**, no contra la ubicacion real del archivo. Con clean URLs activas la URL visible era `/productos/healthcare/`, asi que `nav.js` se buscaba en `/productos/healthcare/nav.js` (404). Resultado: navegacion rota, CTAs caidos, imagenes ausentes.

**Que se hizo**: commits `230ce68` + `6ca70b1` revirtieron canonicals a `.html` directo, sitemap a `.html`, y desactivaron los rewrites internos de URL limpia (manteniendo solo los 301 hacia atras como compatibilidad).

**Que hay que hacer antes de reintentar URLs limpias** (ver §11):
1. Convertir todos los paths relativos a **root-absolute** en los ~24 HTML principales (`src="nav.js"` → `src="/nav.js"`, `href="img/..."` → `href="/img/..."`, etc.)
2. Verificar con `grep -r 'src="[a-z]' *.html` que no queden relativos
3. Reactivar rewrites internos en `.htaccess` y volver a alinear canonicals + sitemap

---

## 10. GSC migration cleanup — en seguimiento

**Snapshot 2026-04-29** (post-deploy del nuevo sitio + sitemap subido a Google Search Console):

| Motivo | URLs | Estado |
|---|---:|---|
| Indexadas | 105 | (sitio real tiene 37 — el resto es ruido legacy WP) |
| Rastreada: actualmente sin indexar | 245 | Esperar (autoridad/tiempo, no es tecnico) |
| Pagina alternativa con canonica adecuada | 62 | Normal — Google entendio duplicados |
| Excluida por "noindex" | 31 | wp-admin del WP viejo, ignorar |
| No encontrada (404) | 30 | Atacado con 301/410 (commit `dd40cdf`) |
| Pagina con redireccion | 27 | Normal — Google sigue 301s |
| Error de redireccion | 9 | APEX, ignorar |
| Duplicada — Google eligio otra canonica | 5 | Subdominio `productos.*` |
| Duplicada sin canonica | 3 | Subdominio `productos.*` |
| Bloqueada por 4xx | 1 | Bajo impacto |
| Error 5xx | 1 | Anomalo, transitorio |

**Acciones tomadas**: commit `dd40cdf` agrego 24 redirects 301 + 6 legacy + 9 reglas 410 + 1 query string al `.htaccess`.

**Pendientes operativos**:
- Verificar que `.htaccess` con los redirects este efectivamente desplegado en el hosting (usar `curl -I` para validar).
- Subdominio `productos.inthegrasoftware.com`: si responde, agregar `RewriteCond` para 301 al dominio principal.
- Indexacion manual de 5-10 URLs prioritarias en GSC (Inspeccion de URL → "Solicitar indexacion").

**Proxima revision sugerida: ~10-junio-2026** (6 semanas post-snapshot). Esperado: "No encontrada (404)" → ~0; "Indexadas" debe estabilizar entre 30-37.

---

## 11. Roadmap

### Hecho (referencia historica)

| Item | Cierre |
|------|--------|
| Deploy del Apps Script (backend del formulario) | 2026-04-20 |
| Integracion Meta Pixel + evento Lead | 2026-04-20 |
| Footer unificado en `footer.js` | 2026-04-21 |
| Publicar paginas legales (privacidad, terminos) | 2026-04-21 |
| Sitemap.xml + llms.txt (regen con todas las paginas) | 2026-04-21 |
| Performance optimization (3 rounds) → PageSpeed >90 mobile + desktop | 2026-04-24 |
| Optimizar imagenes (14 PNG/JPG → WebP, 3.6 MB ahorrados) | 2026-04-24 |
| Extraer CSS comun (inline `common.css` en head) | 2026-04-24 |
| Sprint SEO tecnico (JSON-LD enriquecido, hreflang stub, OG/Twitter en todas, breadcrumbs corregidos) | 2026-04-29 |
| `.htaccess` con 24 redirects 301 + 9 reglas 410 (cleanup post-migracion WP) | 2026-04-29 |
| Google Search Console (verificacion + sitemap + snapshot inicial) | 2026-04-29 |
| Revert URLs limpias (paths relativos rompian nav/CTAs) | 2026-05-04 |
| Cleanup mockups/drafts en raiz (12 archivos) | 2026-05-05 |

### Prioridad Alta (proximas 2-4 semanas)

| Item | Detalle | Esfuerzo |
|------|---------|----------|
| Configurar GTM triggers + GA4 goals | Crear triggers en GTM para `form_submit`, `whatsapp_click`, `cta_click` y conectar con goals/conversions de GA4. [Guia](SETUP_TRACKING_SEO.md#1-gtm-triggers--ga4-goals) | Marketing — 2 horas |
| Verificar Meta Events Manager | Confirmar llegada de `PageView` y `Lead`, crear audiencias de remarketing. [Guia](SETUP_TRACKING_SEO.md#2-meta-events-manager) | Marketing — 1 hora |
| Validar deploy de `.htaccess` en hosting | `curl -I` sobre URLs legacy para confirmar 301/410 (ej. `/erp-creditos/`, `/category/oracle/`, `/wp-admin/`) | IT — 30 min |
| Revision GSC ~10-junio | Comparar contra snapshot 2026-04-29. Esperado: 404s → 0, indexadas estables 30-37 | Marketing — 1 hora |
| Subdominio `productos.inthegrasoftware.com` | Verificar si sigue activo. Si responde, redireccionar al dominio principal con 301 | IT — 30 min |

### Prioridad Media (1-2 meses)

| Item | Detalle | Esfuerzo |
|------|---------|----------|
| **Convertir paths a root-absolute** (prerequisito URLs limpias) | Cambiar `src="nav.js"` → `src="/nav.js"` (y todos los relativos) en los ~24 HTML principales. Habilita reactivar URLs limpias sin romper el sitio | Dev — 1 dia |
| Modelo de mantenimiento del blog | Decidir entre: (A) JSON+JS render dinamico, (B) HTML por post via Claude Code, (C) hibrido (estado actual). Documentar el flujo | Dev — medio dia |
| Cadencia editorial del blog | 2-4 articulos/mes para SEO. Definir calendario | Marketing — ongoing |
| CRM integration | Conectar formulario de contacto con Kommo u otro CRM para nurturing automatico | Dev/IT — 2-3 dias |
| Analytics dashboard | Configurar reportes en GA4: top pages, conversion rate, sources, bounce rate | Marketing — 1 dia |

### Prioridad Baja (trimestre 2+)

| Item | Detalle | Esfuerzo |
|------|---------|----------|
| Internacionalizacion (i18n) | Definir estrategia URLs (`/en/`, `/pt/`), traducir paginas, activar hreflang real (los stubs ya estan listos) | Dev — 2-3 semanas |
| Live chat / Chatbot widget | Integrar chat en tiempo real (o el propio AI Chatbot de Inthegra) | Dev — 1 semana |
| A/B testing | Variantes de CTAs, hero copy, formulario | Marketing — ongoing |
| Blog search | Buscador del blog cuando supere 20+ articulos | Dev — 1 dia |
| Service Worker / PWA | Offline support, carga instantanea para visitantes recurrentes | Dev — 2-3 dias |
| FAQPage schema | Solo si se agregan secciones FAQ reales (Q&A visibles) en landings — agregar schema sin contenido viola politica de Google | Dev — 1 dia |
| og:image dedicada (1200×630) por pagina | Mejor preview en redes sociales | Dev — medio dia |
| Self-host de Inter woff2 | Proxima palanca de perf si el score cae | Dev — medio dia |
| Automatizacion CI/CD | GitHub Actions para deploy automatico en push a master | Dev/IT — medio dia |
| CDN | Cloudflare/CloudFront si el trafico lo justifica | IT — medio dia |
| Accesibilidad WCAG 2.1 | Audit completo, focus states, ARIA labels, contraste | Dev — 1 semana |

### Ideas a evaluar

- Testimonios en video embebidos en `success_stories.html`
- Calculadora de ROI interactiva
- Newsletter signup en el blog
- Webinars / Eventos
- Documentacion publica (Knowledge Base) para clientes

---

## 12. Metricas de salud

| Metrica | Valor |
|---------|-------|
| Total paginas en sitemap | 37 (1 home + 22 top-level + 13 blog + 1 hub blog) |
| Paginas con SEO completo | 37/37 (100%) |
| Paginas con GTM | 100% |
| Paginas con Meta Pixel | 100% |
| Footer unificado via `footer.js` | 100% |
| Mockups/drafts en raiz | 0 (cleaneado 2026-05-05, antes habia 12) |
| Formulario de contacto | Activo (Apps Script → Google Sheet + email) |
| Links rotos en navegacion | 0 |
| Archivos JS en produccion | 2 (nav.js, footer.js — limpios, sin console.log) |
| Issues bloqueantes | 0 |
| **PageSpeed mobile** | **>90** (LCP 2.1s, TBT <200ms, CLS 0.001) |
| **PageSpeed desktop** | **>90** (LCP ~2s, TBT <300ms, CLS 0) |
| Compresion | Brotli + Gzip activos |
| Cache | 1 año immutable para estaticos, 0s para HTML |
| WebP auto-serve | Activo via mod_rewrite |
| SSL | Activo en produccion |
| GSC indexadas | 105 (snapshot 2026-04-29) — proxima revision ~10-junio |

---

**Documentacion de referencia:**
- `docs/CHECKLIST_PRODUCTO.md` — checklist para agregar/modificar una unidad de negocio
- `docs/DEPLOY_INFRAESTRUCTURA.md` — deploy de infraestructura
- `docs/SETUP_CONTACTO_BACKEND.md` — backend del formulario (Apps Script)
- `docs/SETUP_TRACKING_SEO.md` — setup de tracking y SEO post-deploy

*Documento actualizado el 5 de mayo de 2026. Basado en auditoria del repositorio sobre branch `claude/admiring-grothendieck-883f63`, sincronizada con master en commit `6ca70b1`. Revision previa: 21-abril-2026.*
