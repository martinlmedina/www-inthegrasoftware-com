# Setup: Backend del formulario de contacto

## Arquitectura

```
contacto.html  ──fetch POST──>  Google Apps Script  ──>  Google Sheet (log)
                                       │
                                       └──>  Email (notificaciones)
```

## Paso 1: Crear el Google Sheet

1. Ir a [sheets.google.com](https://sheets.google.com) con la cuenta GSuite de Inthegra
2. Crear un nuevo spreadsheet: **"Inthegra Web — Contactos"**
3. Renombrar la primera pestaña a: **Config**
4. En la pestaña Config, agregar:
   - Celda A1: `Email` (header)
   - Celda A2: primer email destinatario (ej: `martin@inthegrasoftware.com`)
   - Celda A3: segundo email destinatario (si aplica)
   - Agregar tantos como necesiten

La pestaña **Contactos** se crea automáticamente con el primer submit.

## Paso 2: Crear el Apps Script

1. En el Google Sheet, ir a **Extensiones > Apps Script**
2. Borrar todo el contenido del editor
3. Copiar y pegar el contenido de `docs/apps-script-contacto.js`
4. Guardar (Ctrl+S)

## Paso 3: Testear localmente

1. En el editor de Apps Script, seleccionar la funcion `testSubmission` del dropdown
2. Click en **Ejecutar** (play)
3. La primera vez pedira permisos — aceptar todos
4. Verificar:
   - Se creo la pestaña **Contactos** con una fila de test
   - Llegaron los emails a los destinatarios de la pestaña Config

## Paso 4: Deploy como Web App

1. En Apps Script, ir a **Implementar > Nueva implementacion**
2. Tipo: **Aplicacion web**
3. Configurar:
   - Descripcion: `Contacto web v1`
   - Ejecutar como: **Yo** (tu cuenta GSuite)
   - Quien tiene acceso: **Cualquier persona**
4. Click en **Implementar**
5. Copiar la URL generada (formato: `https://script.google.com/macros/s/XXXX/exec`)

## Paso 5: Conectar con el sitio web

1. Abrir `contacto.html`
2. Buscar esta linea:
   ```js
   var APPS_SCRIPT_URL = 'APPS_SCRIPT_URL_PLACEHOLDER';
   ```
3. Reemplazar `APPS_SCRIPT_URL_PLACEHOLDER` con la URL del paso 4

## Paso 6: Verificar en produccion

1. Abrir contacto.html en el navegador
2. Completar el formulario con datos de prueba
3. Verificar que:
   - El boton cambia a "Consulta enviada"
   - Aparece una nueva fila en el Google Sheet
   - Llegan los emails de notificacion

---

## Gestionar destinatarios de email

Para agregar/quitar personas que reciben las notificaciones:

1. Abrir el Google Sheet **"Inthegra Web — Contactos"**
2. Ir a la pestaña **Config**
3. Agregar o eliminar emails en la columna A (uno por fila, desde A2)
4. No hace falta re-deployar — los cambios son inmediatos

---

## Google Tag Manager (GTM) + Google Analytics

GTM ya esta instalado en todas las paginas con el ID **GTM-TRT4B92N**.

### Eventos custom disponibles via dataLayer

Estos eventos se disparan automaticamente y estan disponibles en GTM para crear triggers:

| Evento | Cuando se dispara | Variables |
|--------|-------------------|-----------|
| `form_submit` | Submit del formulario de contacto | `form_name`, `form_interest`, `form_origin` |
| `whatsapp_click` | Click en cualquier link de WhatsApp | `link_url`, `page_location` |
| `cta_click` | Click en cualquier CTA a contacto.html | `link_url`, `link_text`, `page_location` |

### Configurar en GTM (Google Tag Manager)

1. Ir a [tagmanager.google.com](https://tagmanager.google.com)
2. Abrir el contenedor **GTM-TRT4B92N**

#### Crear trigger para form_submit:
- Triggers > New > Custom Event
- Event name: `form_submit`
- Nombre: "Formulario de contacto enviado"

#### Crear tag de GA4 Event:
- Tags > New > GA4 Event
- Event name: `generate_lead` (evento recomendado de GA4)
- Parameters: `form_interest` = {{form_interest}}, `form_origin` = {{form_origin}}
- Trigger: el trigger creado arriba

#### Repetir para whatsapp_click y cta_click si se desea trackear.

### Google Search Console

1. Ir a [search.google.com/search-console](https://search.google.com/search-console)
2. Agregar propiedad: `https://inthegrasoftware.com`
3. Verificar via GTM (metodo mas simple — ya tienen GTM instalado)

---

## Notas

- El formulario usa `mode: 'no-cors'` en el fetch porque Apps Script no soporta CORS headers custom. Esto significa que no podemos leer la respuesta del servidor, pero el submit funciona correctamente.
- Si necesitan migrar a Kommo CRM en el futuro, pueden agregar la integracion en el mismo Apps Script (usando la API de Kommo) sin tocar el frontend.
- Los datos en el Google Sheet pueden exportarse a CSV en cualquier momento.
- Google Ads tracking (AW-16670573573) tambien esta incluido en todas las paginas.
