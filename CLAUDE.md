# CLAUDE.md — Sitio web Inthegra Software

Sitio estático corporativo para **Inthegra Software** (Córdoba, Argentina).
Repo: `https://github.com/martinlmedina/www-inthegrasoftware-com`
Producción: `https://www.inthegrasoftware.com`

---

## Stack y arquitectura

- **HTML/CSS/JS puro** — sin frameworks, sin bundler
- **Fuente:** Inter (Google Fonts, cargada async)
- **Compartidos:** `nav.js` (header) y `footer.js` (footer) como IIFE que inyectan HTML en `<header>` / `<footer>` al DOMContentLoaded
- **CSS compartido:** `common.css` — está **inlineado** en `<style data-inlined="common">` dentro del `<head>` de cada HTML (no se vincula como hoja externa)
- **Max-width:** 1240px en `.container`
- **Hosting:** Apache con `.htaccess` (Brotli, cache, WebP auto-serve)
- **Analytics:** GTM + Facebook Pixel + Google Ads — todos diferidos hasta primera interacción (patrón `load3rdParty()`)

### Convención de cabecera HTML

```html
<!-- 1. Google Fonts async -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" media="print" onload="this.media='all'">
<!-- 2. nav.js -->
<script src="/nav.js"></script>
<!-- 3. CSS inlineado -->
<style data-inlined="common">/* contenido de common.css */</style>
<!-- 4. Preload del logo -->
<link rel="preload" as="image" href="/logo-header.svg" fetchpriority="high">
<!-- 5. load3rdParty() IIFE (GTM, FB Pixel, Google Ads) -->
```

---

## Páginas existentes (~38 HTML)

| Archivo | Descripción |
|---|---|
| `index.html` | Home principal |
| `index_productos.html` | Hub de Productos |
| `index_services.html` | Hub de Servicios |
| `landing_healthcare.html` | Producto: HealthCare |
| `landing_credit_financial.html` | Producto: Credit & Financial |
| `landing_erp.html` | Producto: ERP para Retail & Servicios |
| `landing_modernizacion.html` | Servicio: Modernización |
| `landing_oci.html` | Servicio: Oracle Cloud Infrastructure |
| `landing_oac.html` | Servicio: Oracle Analytics Cloud |
| `landing_production_ai.html` | Servicio: Production AI |
| `landing_desarrollo_medida.html` | Servicio: Desarrollo a medida |
| `solutions_crm.html` | Solución: CRM |
| `solutions_ai_chatbot.html` | Solución: AI Chatbot |
| `success_stories.html` | Casos de éxito (todos en un solo archivo) |
| `blog.html` | Índice del blog |
| `blog/` | Posts individuales (HTML por post) |
| `team.html` | Equipo |
| `contacto.html` | Contacto |
| `privacidad.html`, `terminos.html` | Legales |
| `404.html` | Página de error |

---

## Colores de marca (oficiales)

| División | Hex | Uso |
|---|---|---|
| **Inthegra (empresa)** | `#ff7200` | Naranja — identidad corporativa |
| **Products** | `#179dca` | Cian — hub y navegación de productos |
| **Services** | `#F7B5CD` | Rosa claro — hub y navegación de servicios |
| **Solutions** | `#a603fc` | Violeta — hub y navegación de soluciones |

**Acentos por producto (solo en sus landings):**
- HealthCare → teal `#2dd4bf`
- Credit & Financial → azul `#6ea8ff` / `#84e1ff`
- ERP → naranja `#ff6b35` / `#ffb347`
- Modernización → azul `#5aa0ff` / violeta `#7c5cff`

---

## Sistema de diseño

- **Color de fondo base:** `--bg: #0F2043` (azul oscuro enterprise)
- **Animaciones:** clase `.fade-up` con `IntersectionObserver`
- **SVGs de fondo:** `Product.svg`, `Services.svg`, `Inthegra.svg`, `Solutions.svg` a opacidad 0.10–0.16
- **WhatsApp flotante:** `wa.me/5493517870115` (+54 351 787-0115)
- **Secciones:** siempre `position: relative; overflow: hidden` para contener los gráficos de fondo

---

## Performance (scores >90 mobile y desktop)

**Patrón `load3rdParty()`** — en el `<head>` de todas las páginas con tracking:

```js
(function() {
  var loaded = false;
  function load3rdParty() {
    if (loaded) return;
    loaded = true;
    // GTM, Facebook Pixel, Google Ads gtag aquí
  }
  ['scroll','keydown','touchstart','pointerdown','click'].forEach(function(e) {
    window.addEventListener(e, load3rdParty, {once: true, passive: true});
  });
  setTimeout(load3rdParty, 30000); // fallback 30s
})();
```

**Otros puntos clave:**
- `common.css` (1.8 KB) va **inlineado** — nunca como `<link rel="stylesheet">` externo
- Logo en `nav.js` tiene `fetchpriority="high"` (línea ~282)
- Logo en `footer.js` tiene `fetchpriority="high"` (línea ~162)
- Imágenes: `.webp` preferido, `loading="lazy"` y `decoding="async"` en todas excepto el logo
- `.htaccess` sirve WebP automáticamente si el browser lo acepta (`mod_rewrite`)

**Scripts reusables en `scripts/`:**
- `optimize_images.py` — PNG/JPG >50KB → WebP
- `add_img_attrs.py` — agrega `loading="lazy"`, `decoding="async"`, `width`/`height`
- `inline_common_css.py` — inlinea `common.css` en los `<head>`
- `defer_3p_to_interaction.py` — migra tracking a `load3rdParty()`
- `batch_head_perf.py` — migración masiva del `<head>`

---

## SEO (estado a 2026-05-05)

**Completado:**
- Canonical en todas las páginas (URLs limpias via `.htaccess`)
- Open Graph + Twitter cards
- JSON-LD: Organization (home), CollectionPage + ItemList (hubs), BlogPosting (13 posts), BreadcrumbList (landings), success cases, team, contacto
- hreflang stub `es-AR` + `x-default` en todas las páginas (listo para i18n futuro)
- `robots.txt`, `llms.txt`, `sitemap.xml`
- `404.html` con meta description

**Pendiente:**

1. **URLs limpias — prerequisito no activado aún:** Antes de activar los rewrites de `.htaccess`, convertir todas las rutas relativas a root-absolute en ~24 HTML:
   - `<script src="nav.js">` → `<script src="/nav.js">`
   - Todas las rutas de imágenes, CSS, etc. con prefijo `/`
   - Verificar con grep, luego activar los rewrites

2. **i18n (futuro):** Definir estrategia de URL (subdirectorios `/en/` vs subdominios), traducir páginas a EN y PT-BR, activar hreflang reales

3. **Mantenimiento del blog:** Tres opciones (ver sección Blog)

---

## Migración WordPress → nuevo sitio (GSC)

- **Sitio live desde:** ~2026-04-22. WordPress anterior desactivado.
- **Commit `dd40cdf`:** 24 redirects 301 (.html → URLs limpias) + 6 redirects legacy + 9 reglas 410 Gone (artefactos WP)
- **CRÍTICO — pendiente:** Subir `.htaccess` al hosting (el commit existe pero NO se ha desplegado). Hasta que se haga, Google sigue viendo 404s de URLs antiguas.
- **Revisión GSC recomendada:** ~2026-06-10 (6 semanas desde deploy)
- **Subdominio `productos.inthegrasoftware.com`:** genera 8 URLs duplicadas — evaluar redirect al dominio principal

---

## Casos de éxito — Playbook

Todos los casos viven en **un solo archivo:** `success_stories.html`. No hay páginas de detalle individuales.

**Patrón HTML exacto:**

```html
<!-- ════ N. CLIENTE ════ -->
<article class="case-showcase fade-up" data-tags="TAG1 TAG2">
  <div class="showcase-grid">
    <!-- PANEL VISUAL (izquierda) -->
    <div class="showcase-visual" style="background-image: url('img/wp/AÑO/MES/image.webp');">
      <div>
        <div class="brand-mark">
          <span class="brand-mark-ic">XX</span>  <!-- 2 letras ÚNICAS en el archivo -->
          <span class="brand-mark-text">
            <strong>CLIENTE</strong>
            <span>Industria · País</span>
          </span>
        </div>
        <span class="country-chip">Ciudad, País</span>
      </div>
      <div class="showcase-headline">
        <h4>Título corto del impacto principal.</h4>
        <p>Descripción breve del alcance del proyecto.</p>
      </div>
      <div class="visual-stats">
        <div><strong>STAT1</strong><span>etiqueta 1</span></div>
        <div><strong>STAT2</strong><span>etiqueta 2</span></div>
        <div><strong>STAT3</strong><span>etiqueta 3</span></div>
      </div>
    </div>

    <!-- PANEL BODY (derecha) -->
    <div class="showcase-body">
      <div class="showcase-topline">
        <span class="showcase-tag">País</span>
        <span class="showcase-tag">Industria</span>
        <span class="showcase-tag">Tecnología</span>
        <span class="showcase-tag">Tipo</span>
        <!-- MÁX 4 tags. NUNCA "Oracle Partner" -->
      </div>
      <h3>Nombre del Cliente</h3>
      <p class="showcase-kicker">Resumen del valor en una línea.</p>
      <p class="showcase-lead">Párrafo de 3-4 líneas con <strong>cifras clave</strong> en negrita.</p>
      <div class="showcase-tech">
        <strong>Tech Stack</strong>
        Tecnología A · Tecnología B · Tecnología C
      </div>
      <div class="showcase-results">
        <!-- Siempre 4 items, grilla 2x2 -->
        <div><strong>Resultado 1</strong><span>Descripción.</span></div>
        <div><strong>Resultado 2</strong><span>Descripción.</span></div>
        <div><strong>Resultado 3</strong><span>Descripción.</span></div>
        <div><strong>Resultado 4</strong><span>Descripción.</span></div>
      </div>
      <div class="showcase-actions">
        <a href="https://wa.me/5493517393307?text=Hola%2C%20me%20interesa%20una%20solución%20similar%20a%20CLIENTE" class="btn-primary" target="_blank" rel="noopener">Hablar sobre este caso →</a>
        <a href="contacto.html?origen=success_stories&caso=slug_cliente" class="btn-ghost">Agendar demo</a>
      </div>
    </div>
  </div>
</article>
```

**Errores comunes a evitar:**
1. Iniciales `brand-mark-ic` duplicadas — verificar contra casos existentes antes de asignar
2. No agregar tag "Oracle Partner" — es info de Inthegra, no del cliente
3. No tocar `background-size`/`background-position` — ya están en CSS, solo setear `background-image`
4. Actualizar el contador "N casos" en el hero (~línea 739)
5. Renumerar posiciones en JSON-LD ItemList
6. Actualizar las 3 meta descriptions idénticas (`name`, `og:description`, `twitter:description`) con `replace_all`
7. `data-tags` solo con valores existentes: `financial`, `operations`, `onboarding`, `supply`, `apex`

**Filtros por caso:**
- `financial`: Valle Fertil, Sidecreer, SuCrédito
- `operations`: JAVER, FPF, INFA, MSPORT, Sánchez Antoniolli
- `onboarding`: Valle Fertil, Sidecreer
- `supply`: Sánchez Antoniolli
- `apex`: todos excepto los no-APEX

**Imágenes:** formato `.webp`, path `img/wp/AÑO/MES/nombre-descriptivo.webp`

---

## Blog

**Estado actual (Opción C — híbrida):** `blog.html` lee `blog-posts.json` como índice. Cada post es un HTML individual en `blog/`. Al agregar un post se debe actualizar:
1. `blog-posts.json`
2. JSON-LD `Blog.blogPost` en `blog.html`
3. `sitemap.xml`

**Si se replantea el modelo:**
- **Opción A:** JSON + JS puro — editar solo `blog-posts.json`, el HTML se renderiza automáticamente
- **Opción B:** Claude Code genera cada post como HTML individual

**TTS (leer en voz alta):** La Web Speech API fue descartada por sonar robótica. Si se retoma, usar MP3 pre-generados con ElevenLabs / OpenAI TTS. ~13 posts × USD 0.30–3/post es un costo de una sola vez. Servir como `<audio>` estático.

---

## Tareas pendientes (priorizadas)

1. **🔴 Subir `.htaccess` al hosting** — El archivo está en `master` pero no está desplegado. Bloquea la limpieza de GSC.
2. **🟡 Activar URLs limpias** — Convertir ~24 HTML de rutas relativas a root-absolute (`/nav.js`, `/img/...`) antes de encender los rewrites.
3. **🟡 Verificar subdominio `productos.inthegrasoftware.com`** — Si está activo, redirigir al dominio principal para eliminar duplicados en GSC.
4. **🟢 Revisar GSC ~2026-06-10** — Verificar que las 404s bajaron a ~0 y que los indexados se estabilizaron en 30–37 URLs.
5. **🟢 Estrategia i18n** — Decidir subdirectorios vs subdominios, traducir, activar hreflang.
6. **🟢 Mantenimiento del blog** — Elegir modelo definitivo (A, B o C).

---

## Permisos Claude Code

`WebSearch` habilitado en `.claude/settings.json`.
