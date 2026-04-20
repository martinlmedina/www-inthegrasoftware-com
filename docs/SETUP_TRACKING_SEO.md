# Setup de Tracking y SEO — Pre y Post Go-Live

Guía técnica para conectar el sitio a las herramientas de analytics, advertising y search una vez que esté online.

## Contexto

El código del sitio ya está instrumentado: GTM cargado, Meta Pixel activo y el formulario push-eando eventos al `dataLayer`. Este doc cubre los 3 pasos operativos que quedan pendientes y se ejecutan en consolas externas (ningún cambio de código).

### IDs del proyecto

| Recurso | ID |
|---------|------|
| Google Tag Manager | `GTM-TRT4B92N` |
| Google Ads | `AW-16670573573` |
| Meta Pixel | `1226651955694155` |
| GA4 Measurement ID | Pendiente de confirmar / crear property |

### Eventos que el sitio ya emite

| Evento | Origen | Variables |
|---|---|---|
| `form_submit` | `contacto.html` — submit exitoso del formulario | `form_name`, `form_interest`, `form_origin` |
| `whatsapp_click` | `nav.js` + `contacto.html` — click en links `wa.me` | `link_url`, `page_location` |
| `cta_click` | `nav.js` — click en CTA "Hablar con un experto" | `link_url`, `link_text`, `page_location` |
| `Lead` (Meta Pixel) | `contacto.html` — `fbq('track', 'Lead')` post-submit | — (standard event de Facebook) |

---

## 1. GTM Triggers + GA4 Goals

**Qué es.** GTM está instalado en las 30 páginas y el código emite eventos custom al `dataLayer`, pero GTM no hace nada con ellos hasta que se configuren **triggers** (reglas de activación) y **tags** (acciones a ejecutar) en la consola web. Este paso conecta los eventos del sitio con GA4 y con Google Ads como conversiones.

**Pre-requisito.** Una property de GA4 con su Measurement ID (`G-XXXXXXXX`). Si no existe, crearla en `analytics.google.com` antes de empezar.

### Pasos

1. **Login a GTM** → `tagmanager.google.com` → container `GTM-TRT4B92N` → workspace.

2. **Crear variable de configuración GA4** (si no existe):
   - Variables → New → tipo **Google Analytics: GA4 Configuration**
   - Measurement ID: `G-XXXXXXXX`
   - Nombre: `GA4 - Inthegra`

3. **Crear 3 triggers custom** (uno por evento):
   - Triggers → New → tipo **Custom Event**
   - Event name (exact match): `form_submit`, `whatsapp_click`, `cta_click`

4. **Crear variables de dataLayer** para pasar los parámetros a GA4:
   - Variables → New → tipo **Data Layer Variable**
   - Crear: `form_interest`, `form_origin`, `link_url`, `link_text`, `page_location`

5. **Crear 3 tags GA4 Event** (una por trigger):
   - Tags → New → tipo **Google Analytics: GA4 Event**
   - Config tag: `GA4 - Inthegra`
   - Event name (nombres GA4 estándar donde aplique):
     - `form_submit` → **`generate_lead`** (standard GA4, se auto-marca como conversión)
     - `whatsapp_click` → `whatsapp_click` (custom)
     - `cta_click` → `cta_click` (custom)
   - Event Parameters → mapear las variables del dataLayer creadas en el paso 4
   - Trigger → el custom event correspondiente

6. **Preview mode** → botón "Preview" → abrir el sitio → disparar cada evento manualmente (enviar form, click WhatsApp, click CTA) → verificar en el debugger de GTM que los tags fire correctamente.

7. **Submit + Publish** → descripción de versión clara, p.ej.: *"Activación triggers form_submit/whatsapp/cta → GA4"*.

8. **Configuración en GA4** (`analytics.google.com`):
   - Admin → Events → marcar `generate_lead` y `whatsapp_click` como **conversiones** (toggle)
   - Admin → Product Links → **Google Ads Links** → asociar la cuenta `AW-16670573573` (así Google Ads recibe conversiones automáticamente y se pueden importar a campañas)

**Esfuerzo:** ~2 h · **Owner:** Marketing con apoyo IT

---

## 2. Meta Events Manager

**Qué es.** Meta Events Manager (`business.facebook.com/events_manager`) es la consola del Pixel. Una vez el sitio esté online hay que verificar que los eventos llegan en tiempo real, verificar el dominio, y crear audiencias para campañas de Meta Ads.

**Pre-requisito.** Cuenta de Meta Business Manager con el Pixel `1226651955694155` creado (se asume existente, ya que el ID está en uso).

### Pasos

1. **Verificar eventos en tiempo real:**
   - Events Manager → Data Sources → Pixel `1226651955694155` → **Test Events**
   - Pegar URL del sitio (staging o producción)
   - Navegar entre páginas → debe aparecer `PageView`
   - Enviar un formulario de prueba → debe aparecer `Lead`
   - Si no aparece: revisar con **Meta Pixel Helper** (extensión Chrome) si hay errores de dominio o bloqueos

2. **Domain Verification:**
   - Settings → Domain Verification → agregar `inthegrasoftware.com`
   - Método: DNS TXT record (recomendado) o meta tag en el `<head>` del home
   - Este paso habilita campañas de conversión y AEM para usuarios iOS 14+

3. **Custom Audiences (remarketing):**
   - Audiences → Create → **Custom Audience → Website**
   - Audiencias sugeridas:
     - *"Visitantes — últimos 30 días"* — Any website visitor, last 30 days
     - *"Visitantes HealthCare"* — URL contains `landing_healthcare`, last 60 days
     - *"Visitantes Credit & Financial"* — URL contains `landing_credit_financial`, last 60 days
     - *"Leads convertidos"* — Event = `Lead`, last 180 days → usar como **exclusión** en campañas de adquisición

4. **Lookalike Audiences** (una vez "Leads" tenga 100+ usuarios):
   - Audiences → Create → Lookalike → source: "Leads convertidos"
   - Location: Argentina (+ Latam si aplica), size: 1%
   - Uso: audiencia de alta calidad para prospecting

5. **Aggregated Event Measurement** (solo si se va a anunciar a usuarios iOS 14+):
   - Events Manager → Aggregated Event Measurement → priorizar `Lead` como evento #1 (máximo 8 eventos por dominio)

6. **Conversions API — CAPI** *(opcional, prioridad media, post-launch)*:
   - Envío server-side de eventos para compensar bloqueos de ad-blockers y limitaciones de Safari/iOS
   - Requiere un endpoint server que reenvíe eventos desde el Apps Script o una función Cloud
   - Mejor atacarlo cuando haya volumen real de tráfico que justifique la mejora

**Esfuerzo:** ~1 h para pasos 1-5 · **Owner:** Marketing

---

## 3. Google Search Console

**Qué es.** Search Console (`search.google.com/search-console`) es la herramienta de Google para reclamar ownership del dominio y monitorear SEO. Sin esto, Google tarda más en indexar y no hay visibilidad de queries, CTR, posición promedio ni errores de crawl.

### Pasos

1. **Agregar propiedad** → "Add property":
   - **Domain property** (recomendado): `inthegrasoftware.com` — cubre http, https, www y subdominios. Requiere verificación por DNS TXT.
   - **URL prefix property**: `https://inthegrasoftware.com/` — verificación alternativa vía meta tag, HTML file o Google Analytics.

2. **Verificar ownership** — opción más simple con GTM ya instalado:
   - Método **"Google Tag Manager"** o **"Google Analytics"** → GSC autodetecta el código de tracking y verifica sin tocar el sitio
   - Fallback: agregar `<meta name="google-site-verification" content="...">` en el `<head>` de `index.html` (alcanza con una sola página)

3. **Enviar sitemap:**
   - Sitemaps → URL: `https://inthegrasoftware.com/sitemap.xml` → Submit
   - Verificar 1–2 días después que el estado sea "Success" con las 29 URLs detectadas

4. **Configurar dominio preferido** (si se usa www y non-www):
   - Decidir canónico (`inthegrasoftware.com` vs `www.inthegrasoftware.com`)
   - Setear redirección 301 en Nginx (ver `docs/DEPLOY_INFRAESTRUCTURA.md`) para que ambas resuelvan al canónico

5. **Solicitar indexación manual** (acelera el primer crawl):
   - URL Inspection → pegar `https://inthegrasoftware.com/` → Request indexing
   - Repetir con las 5–10 páginas más importantes: home, `index_productos`, `index_services`, los 3 landings de producto, `contacto`

6. **Linkear GSC con GA4:**
   - Admin (en GA4) → Product Links → **Search Console Links** → asociar la propiedad
   - Beneficio: las queries y CTR de GSC aparecen en los reportes de GA4

7. **Alertas por email:**
   - Settings → Users and permissions → confirmar que llegan notificaciones a `martin.medina@inthegrasoftware.com` para errores de coverage, manual actions y Core Web Vitals

### Métricas a monitorear — semana 1 post-launch

- **Coverage** — páginas indexadas vs. excluidas (deberían ser 29 indexables)
- **Performance** — impressions, CTR, posición promedio por query
- **Core Web Vitals** — LCP, CLS, INP (requiere volumen de tráfico para reportar)

**Esfuerzo:** ~30 min setup + monitoreo semanal · **Owner:** Marketing/IT compartido

---

## Orden recomendado de ejecución

1. **Pre-go-live** — crear property de GA4, configurar triggers y tags en GTM, testear en preview, publicar container. Así las conversiones se miden desde el día 0 de tráfico.
2. **Día del go-live** — verificar Pixel en Meta Events Manager → Test Events con el dominio real y confirmar que `PageView` y `Lead` llegan.
3. **Día +1** — agregar propiedad en Search Console, verificar, enviar sitemap, linkear con GA4.
4. **Semana 1** — crear audiencias de remarketing en Meta (necesitan tráfico real para poblarse).
