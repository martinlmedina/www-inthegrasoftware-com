# Checklist — Agregar / modificar una unidad de negocio

Cada vez que se publica una nueva landing de producto, servicio o solución — o se renombra una existente — hay que actualizar **7 lugares** para mantener el sitio consistente. Este checklist evita que el nav, footer y formulario de contacto queden desalineados (problema histórico: CTAs con `?interes=X` apuntando a options inexistentes en el dropdown → lead llega sin categoría).

## Los 7 pasos

| # | Archivo | Qué hacer |
|---|---------|-----------|
| 1 | `landing_<nombre>.html` o `solutions_<nombre>.html` | Crear la página. Incluir `<body data-wa-context="...">` para el prefill de WhatsApp. CTAs internos apuntan a `contacto.html?interes=<key>&origen=<slug>`. |
| 2 | `nav.js` — panel desktop | Agregar `<a class="sn-panel-item">` dentro del `sn-panel` de la categoría (Productos / Servicios / Soluciones). |
| 3 | `nav.js` — accordion mobile | Agregar `<a>` con `<span class="sn-m-icon">` + `<span class="sn-m-label">` dentro del `sn-m-sub` correspondiente. |
| 4 | `footer.js` | Agregar `<a>` dentro de la `sf-col` correspondiente. |
| 5 | `contacto.html` | Agregar `<option value="<key>">` dentro del `<optgroup>` correspondiente. **El `value` debe coincidir exactamente con el `?interes=<key>` de los CTAs de la landing.** |
| 6 | `sitemap.xml` | Agregar `<url>` con canónico `/<path>/`, `lastmod` de hoy, `priority` 0.7–0.8. |
| 7 | `llms.txt` | Agregar bullet en la sección correspondiente (Products / Oracle Services / Solutions). |

## Plus (no bloqueante, pero sí antes de mergear)

- Actualizar el inventario en `docs/RESUMEN_EJECUTIVO.md` (tabla de la sección correspondiente + conteo total de páginas).
- Si la página va a ser destino de un CTA prefill que aún no existe, agregar también al `CONTEXTS` dict de `add_wa_context.py` si la convención de WA lo requiere.

## Convención de `value` / `key`

- Un **solo** identificador por unidad de negocio, reusado en: `?interes=<key>`, el `value` del `<option>`, y (si aplica) la clave en analytics.
- Estilo kebab-case en minúscula, sin tildes. Ejemplos actuales: `healthcare`, `credit`, `erp`, `supply`, `wms`, `ecommerce`, `people-care`, `modernizacion`, `oci`, `desarrollo`, `analytics`, `ai`, `crm`, `chatbot`, `automations`.
- **Nunca renombrar** un `value` existente: rompe prefills históricos y la categorización de leads en el Sheet. Solo agregar nuevos.

## Ejemplo real — "Automatización & Orquestación" (2026-04-21)

1. `solutions_automations.html` creada con `data-wa-context="Automatización y Orquestación de Procesos"` y CTAs `?interes=automations&origen=solutions_automations`.
2. `nav.js:383` — entrada desktop con icono ⚡ en panel Soluciones.
3. `nav.js:500` — entrada mobile en accordion Soluciones.
4. `footer.js:195` — link en columna Soluciones.
5. `contacto.html` — `<option value="automations">Automatización &amp; Orquestación</option>` dentro del `<optgroup label="Soluciones">`.
6. `sitemap.xml` — `/soluciones/automations/` priority 0.8.
7. `llms.txt` — bullet "Process Automation & Orchestration" bajo Solutions.
8. (Plus) `RESUMEN_EJECUTIVO.md` — Soluciones pasó de 2 a 3 páginas; total 35 → 36.

## Verificación rápida

Antes de mergear a master:

1. `grep "?interes=<key>"` en todas las landings → confirmar que el `<key>` existe como `<option value="<key>">` en `contacto.html`.
2. Abrir `contacto.html?interes=<key>` en el browser → el dropdown debe pre-seleccionar el option correcto.
3. Abrir el nav desktop + mobile + footer → la nueva entrada aparece en las 3 superficies.
4. Enviar el formulario → verificar en el Sheet de Apps Script que `interest` llega con el `value` esperado.
