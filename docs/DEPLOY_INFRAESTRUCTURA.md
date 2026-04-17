# Guia de Deploy e Infraestructura — inthegrasoftware.com

## Resumen

Sitio web **100% estatico** (HTML/CSS/JS). No requiere backend, base de datos, ni runtime de ningun lenguaje. El unico componente server-side es el web server que sirve los archivos y maneja las reglas de rewrite para URLs limpias.

---

## 1. Servidor Web Recomendado: Nginx

**Nginx** es la mejor opcion para este sitio por:
- Rendimiento superior para contenido estatico (event-driven, no fork por request)
- Bajo consumo de memoria (~2-5 MB por worker)
- Configuracion de rewrites mas eficiente que Apache (no lee `.htaccess` por request)
- Soporte nativo de gzip/brotli, HTTP/2, y SSL/TLS

> **Alternativa:** Si IT ya tiene Apache en su stack, funciona igual de bien. Se incluyen configs para ambos mas abajo.

---

## 2. Especificaciones del Virtual Server

### Minimo recomendado

| Recurso | Especificacion |
|---------|---------------|
| **vCPU** | 1 core |
| **RAM** | 1 GB |
| **Disco** | 10 GB SSD |
| **OS** | Ubuntu 24.04 LTS / Rocky Linux 9 / Windows Server 2022 |
| **Ancho de banda** | 100 Mbps (suficiente para sitio corporativo) |

### Por que es suficiente

- El sitio pesa **~4.5 MB** sin contar el PDF del brochure (28 MB)
- Son **29 paginas HTML** + assets estaticos
- No hay procesamiento server-side
- Nginx sirve archivos estaticos con ~2 MB de RAM por worker
- El trafico esperado de un sitio corporativo B2B es bajo (cientos a pocos miles de visitas/dia)

### Si quieren ir con cloud

| Provider | Instancia equivalente | Costo estimado/mes |
|----------|----------------------|-------------------|
| AWS | t3.micro (1 vCPU, 1 GB) | ~$8-10 USD |
| Azure | B1s (1 vCPU, 1 GB) | ~$7-10 USD |
| Google Cloud | e2-micro (0.25-2 vCPU, 1 GB) | ~$6-8 USD |
| DigitalOcean | Basic Droplet (1 vCPU, 1 GB) | $6 USD |
| OCI (Oracle Cloud) | VM.Standard.A1.Flex | **Free tier** (hasta 4 cores, 24 GB) |

> **Nota:** Dado que Inthegra es Oracle Partner, OCI Free Tier es una opcion natural y sin costo.

---

## 3. Software requerido en el servidor

```
nginx          (o apache2)
certbot        (para SSL via Let's Encrypt)
git            (para deploy via git pull)
```

No se necesita: PHP, Node.js, Python, Java, ni ningun runtime.

---

## 4. Configuracion de Nginx

### 4.1 Archivo principal: `/etc/nginx/sites-available/inthegrasoftware.com`

```nginx
server {
    listen 80;
    server_name inthegrasoftware.com www.inthegrasoftware.com;
    return 301 https://inthegrasoftware.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.inthegrasoftware.com;
    ssl_certificate     /etc/letsencrypt/live/inthegrasoftware.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/inthegrasoftware.com/privkey.pem;
    return 301 https://inthegrasoftware.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name inthegrasoftware.com;

    # ── SSL ──
    ssl_certificate     /etc/letsencrypt/live/inthegrasoftware.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/inthegrasoftware.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ── Root del sitio ──
    root /var/www/inthegrasoftware.com;
    index index.html;
    charset utf-8;

    # ── Pagina 404 custom ──
    error_page 404 /404.html;

    # ── Security headers ──
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # ── Compresion ──
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json image/svg+xml;
    gzip_min_length 1000;
    gzip_vary on;

    # ── Cache de assets estaticos ──
    location ~* \.(css|js|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|pdf)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # HTML no se cachea (para que los cambios se vean inmediatamente)
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # ══════════════════════════════════════════
    #  URL REWRITES — Clean URLs → Archivos HTML
    # ══════════════════════════════════════════
    #
    #  El sitemap y los canonical usan URLs limpias
    #  (ej: /productos/) pero los archivos son .html
    #  (ej: index_productos.html). Estas reglas mapean
    #  la URL publica al archivo real.

    # ── Home ──
    location = / {
        try_files /index.html =404;
    }

    # ── Productos ──
    location = /productos/ {
        try_files /index_productos.html =404;
    }
    location = /productos/healthcare/ {
        try_files /landing_healthcare.html =404;
    }
    location = /productos/credit-financial/ {
        try_files /landing_credit_financial.html =404;
    }
    location = /productos/retail/ {
        try_files /landing_erp.html =404;
    }

    # ── Servicios Oracle ──
    location = /servicios-oracle/ {
        try_files /index_services.html =404;
    }
    location = /servicios-oracle/modernizacion/ {
        try_files /landing_modernizacion.html =404;
    }
    location = /servicios-oracle/oci/ {
        try_files /landing_oci.html =404;
    }
    location = /servicios-oracle/desarrollo-medida/ {
        try_files /landing_desarrollo_medida.html =404;
    }
    location = /servicios-oracle/analytics/ {
        try_files /landing_oac.html =404;
    }
    location = /servicios-oracle/production-ai/ {
        try_files /landing_production_ai.html =404;
    }

    # ── Soluciones ──
    location = /soluciones/crm/ {
        try_files /solutions_crm.html =404;
    }
    location = /soluciones/ai-chatbot/ {
        try_files /solutions_ai_chatbot.html =404;
    }

    # ── Institucional ──
    location = /equipo/ {
        try_files /people_culture.html =404;
    }
    location = /casos-de-exito/ {
        try_files /success_stories.html =404;
    }
    location = /contacto/ {
        try_files /contacto.html =404;
    }

    # ── Blog ──
    location = /blog/ {
        try_files /blog.html =404;
    }
    # Blog articles se sirven directo (usan .html en la URL)
    location /blog/ {
        try_files $uri =404;
    }

    # ── Archivos estaticos (SVGs, imagenes, CSS, JS) ──
    location / {
        try_files $uri =404;
    }
}
```

### 4.2 Activar el sitio

```bash
sudo ln -s /etc/nginx/sites-available/inthegrasoftware.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. Configuracion de Apache (alternativa)

Si se usa Apache en lugar de Nginx, crear `.htaccess` en la raiz del sitio:

```apache
RewriteEngine On

# ── Forzar HTTPS ──
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# ── Redirigir www a sin www ──
RewriteCond %{HTTP_HOST} ^www\.inthegrasoftware\.com$ [NC]
RewriteRule ^ https://inthegrasoftware.com%{REQUEST_URI} [L,R=301]

# ── Home ──
RewriteRule ^$ /index.html [L]

# ── Productos ──
RewriteRule ^productos/?$ /index_productos.html [L]
RewriteRule ^productos/healthcare/?$ /landing_healthcare.html [L]
RewriteRule ^productos/credit-financial/?$ /landing_credit_financial.html [L]
RewriteRule ^productos/retail/?$ /landing_erp.html [L]

# ── Servicios Oracle ──
RewriteRule ^servicios-oracle/?$ /index_services.html [L]
RewriteRule ^servicios-oracle/modernizacion/?$ /landing_modernizacion.html [L]
RewriteRule ^servicios-oracle/oci/?$ /landing_oci.html [L]
RewriteRule ^servicios-oracle/desarrollo-medida/?$ /landing_desarrollo_medida.html [L]
RewriteRule ^servicios-oracle/analytics/?$ /landing_oac.html [L]
RewriteRule ^servicios-oracle/production-ai/?$ /landing_production_ai.html [L]

# ── Soluciones ──
RewriteRule ^soluciones/crm/?$ /solutions_crm.html [L]
RewriteRule ^soluciones/ai-chatbot/?$ /solutions_ai_chatbot.html [L]

# ── Institucional ──
RewriteRule ^equipo/?$ /people_culture.html [L]
RewriteRule ^casos-de-exito/?$ /success_stories.html [L]
RewriteRule ^contacto/?$ /contacto.html [L]

# ── Blog ──
RewriteRule ^blog/?$ /blog.html [L]

# ── Compresion ──
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# ── Cache ──
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 30 days"
    ExpiresByType application/javascript "access plus 30 days"
    ExpiresByType image/svg+xml "access plus 30 days"
    ExpiresByType image/png "access plus 30 days"
    ExpiresByType image/jpeg "access plus 30 days"
    ExpiresByType application/pdf "access plus 30 days"
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# ── Security headers ──
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# ── 404 ──
ErrorDocument 404 /404.html
```

Modulos de Apache requeridos:
```bash
sudo a2enmod rewrite deflate expires headers ssl
sudo systemctl restart apache2
```

---

## 6. SSL / HTTPS (Let's Encrypt)

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx   # para Nginx
# o
sudo apt install certbot python3-certbot-apache   # para Apache

# Generar certificado
sudo certbot --nginx -d inthegrasoftware.com -d www.inthegrasoftware.com

# Renovacion automatica (ya viene configurada, verificar con)
sudo certbot renew --dry-run
```

El certificado se renueva automaticamente cada 60 dias. Let's Encrypt es gratuito.

---

## 7. DNS

Configurar los siguientes registros DNS en el proveedor del dominio:

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | inthegrasoftware.com | `<IP_DEL_SERVIDOR>` | 300 |
| A | www | `<IP_DEL_SERVIDOR>` | 300 |
| CNAME | www | inthegrasoftware.com | 300 |

> Si usan Cloudflare como DNS proxy, activar el proxy (nube naranja) para tener CDN gratis y proteccion DDoS. En ese caso no se necesita Let's Encrypt (Cloudflare provee SSL).

---

## 8. Deploy del codigo

### Opcion A: Git pull (recomendado)

```bash
# Setup inicial (una sola vez)
cd /var/www
sudo git clone https://github.com/martinlmedina/www-inthegrasoftware-com.git inthegrasoftware.com
sudo chown -R www-data:www-data /var/www/inthegrasoftware.com

# Para actualizar (cada vez que hay cambios)
cd /var/www/inthegrasoftware.com
sudo git pull origin master
```

### Opcion B: rsync desde maquina local

```bash
rsync -avz --delete \
  --exclude '.git' \
  --exclude 'mock_*' \
  --exclude 'mockup-*' \
  --exclude 'home_oldversion*' \
  --exclude 'view-source_*' \
  --exclude 'docs/' \
  ./ usuario@servidor:/var/www/inthegrasoftware.com/
```

### Opcion C: GitHub Actions (CI/CD automatico)

Crear `.github/workflows/deploy.yml` para deploy automatico en cada push a master. Esto se puede configurar mas adelante si se desea.

---

## 9. Checklist de verificacion post-deploy

### Funcionalidad
- [ ] Home carga en `https://inthegrasoftware.com/`
- [ ] Todas las URLs limpias funcionan (ej: `/productos/healthcare/`)
- [ ] Blog articles cargan (ej: `/blog/erp-retail-inthegra.html`)
- [ ] Navegacion funciona en todas las paginas (nav.js carga correctamente)
- [ ] Formulario de contacto envia correctamente
- [ ] WhatsApp float abre chat correcto
- [ ] SVGs de fondo cargan (inspeccionar con DevTools > Network)
- [ ] Imagenes de WordPress cargan (las que usan wp-content/uploads/)
- [ ] PDF del brochure descarga (`/img_solutions/BROCHURE CRM.pdf`)

### SEO
- [ ] `https://inthegrasoftware.com/sitemap.xml` accesible
- [ ] `https://inthegrasoftware.com/robots.txt` accesible
- [ ] `https://inthegrasoftware.com/llms.txt` accesible
- [ ] Redirect HTTP → HTTPS funciona
- [ ] Redirect www → sin www funciona
- [ ] Pagina 404 custom funciona (visitar URL inexistente)

### Performance
- [ ] Gzip activado (verificar con `curl -I -H "Accept-Encoding: gzip" https://inthegrasoftware.com/`)
- [ ] Headers de cache correctos para assets estaticos
- [ ] SSL grade A en [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/)

### Seguridad
- [ ] Security headers presentes (verificar con [securityheaders.com](https://securityheaders.com))
- [ ] Archivos mock/test NO accesibles desde el browser
- [ ] Directorio `docs/` NO accesible desde el browser
- [ ] Directorio `.git/` NO accesible desde el browser

---

## 10. Archivos que NO deben estar en produccion

Si se usa git pull para deployar, estos archivos estan en el repo pero **no deben ser accesibles publicamente**. Agregar reglas al web server:

```nginx
# En la config de Nginx, dentro del server block:
location ~ /\. {
    deny all;      # bloquea .git, .github, .claude
}
location /docs/ {
    deny all;      # documentacion interna
}
location ~* ^/(mock_|mockup-|home_oldversion|view-source_) {
    deny all;      # archivos de desarrollo
}
```

---

## 11. Monitoreo (opcional pero recomendado)

| Herramienta | Que monitorea | Costo |
|-------------|--------------|-------|
| UptimeRobot | Uptime, responde o no | Free (50 monitors) |
| Google Search Console | Indexacion, errores SEO | Free |
| Google Analytics (via GTM) | Ya configurado (GTM-TRT4B92N) | Free |
| Cloudflare | CDN, DDoS, analytics | Free tier |

---

## 12. Dependencias externas

El sitio carga recursos de estos dominios externos. Deben estar permitidos en firewall/WAF:

| Dominio | Uso |
|---------|-----|
| fonts.googleapis.com | Google Fonts (Inter) |
| fonts.gstatic.com | Archivos de fuentes |
| www.googletagmanager.com | Google Tag Manager + Google Ads |
| tracker.metricool.com | Metricool analytics |
| forms.kommo.com | Kommo CRM widget |
| connect.facebook.net | Facebook Pixel |
| script.google.com | Apps Script (formulario de contacto) |

---

## 13. Arquitectura del sitio

```
                    [DNS]
                      |
              [Cloudflare CDN]  ← opcional pero recomendado
                      |
                   [Nginx]
                      |
         /var/www/inthegrasoftware.com/
         ├── index.html              → /
         ├── index_productos.html   → /productos/
         ├── landing_*.html         → /productos/*/ y /servicios-oracle/*/
         ├── solutions_*.html       → /soluciones/*/
         ├── contacto.html          → /contacto/
         ├── blog.html              → /blog/
         ├── blog/*.html            → /blog/*.html
         ├── common.css
         ├── nav.js
         ├── *.svg, img_*/
         ├── sitemap.xml
         ├── robots.txt
         └── llms.txt
```
