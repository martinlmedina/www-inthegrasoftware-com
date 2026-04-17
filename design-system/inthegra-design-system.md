# 🎨 MINI DESIGN SYSTEM — INTHEGRA (VERSIÓN OPERATIVA)

## 1. 🎯 VARIABLES CSS (BASE)

```css
:root {
  /* Brand */
  --color-inthegra: #ff7200;

  /* Business Units */
  --color-products: #179dca;
  --color-services: #F7B5CD;
  --color-solutions: #a603fc;

  /* Neutrals */
  --color-bg: #0f1115;
  --color-surface: #171a21;
  --color-border: #2a2f3a;
  --color-text: #ffffff;
  --color-text-muted: #a0a6b3;

  /* Subtle variants (usar MUCHO) */
  --color-products-soft: rgba(23,157,202,0.08);
  --color-services-soft: rgba(247,181,205,0.10);
  --color-solutions-soft: rgba(166,3,252,0.08);
}
```

---

## 2. 🧠 REGLAS DE ORO (NO NEGOCIABLES)

* ❌ No usar colores saturados como fondo completo

* ❌ No mezclar colores sin lógica

* ❌ No usar más de 1 color de unidad por sección

* ✅ Base SIEMPRE neutra (dark o white)

* ✅ Color = acento, no protagonista

* ✅ Orange = SOLO conversión / CTA

---

## 3. 🧱 COMPONENTES BASE

### 🔘 BOTONES

```css
.btn-primary {
  background: var(--color-inthegra);
  color: white;
  border-radius: 10px;
  padding: 12px 20px;
  font-weight: 600;
}

.btn-secondary {
  border: 1px solid var(--color-border);
  color: var(--color-text);
  background: transparent;
}

.btn-products {
  background: var(--color-products-soft);
  color: var(--color-products);
}

.btn-services {
  background: var(--color-services-soft);
  color: #d96c96;
}

.btn-solutions {
  background: var(--color-solutions-soft);
  color: var(--color-solutions);
}
```

---

### 🧩 CARDS

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
}

.card-products {
  border-left: 3px solid var(--color-products);
}

.card-services {
  border-left: 3px solid #d96c96;
}

.card-solutions {
  border-left: 3px solid var(--color-solutions);
}
```

---

### 📊 SECTIONS

```css
.section-products {
  background: var(--color-products-soft);
}

.section-services {
  background: var(--color-services-soft);
}

.section-solutions {
  background: var(--color-solutions-soft);
}
```

---

### ➖ DIVISORS / MICRO ACCENTS

```css
.divider-products {
  height: 1px;
  background: rgba(23,157,202,0.3);
}

.divider-services {
  height: 1px;
  background: rgba(247,181,205,0.3);
}

.divider-solutions {
  height: 1px;
  background: rgba(166,3,252,0.3);
}
```

---

## 4. 🧭 USO POR TIPO DE PÁGINA

### 🏠 HOME

* Usa los 4 colores
* Cada bloque = una unidad
* Orange solo en CTA

---

### 📦 PRODUCTS

* Color dominante: **cyan**
* Cards, líneas, iconos
* CTA sigue en orange

---

### 🛠 SERVICES

* Color dominante: **pink (MUY sutil)**
* Nunca saturado
* Sensación: profesional, no “soft”

---

### 🧠 SOLUTIONS

* Color dominante: **purple**
* Más presencia (AI, innovación)
* Puede usar gradients MUY suaves

---

### 🏢 INSTITUCIONAL (People, About)

* 95% neutro
* Solo orange en CTA

---

### 📰 BLOG

* 100% neutro
* Sin colores de unidad

---

## 5. 🎨 GRADIENTES (USO CORRECTO)

```css
.gradient-products {
  background: linear-gradient(
    135deg,
    rgba(23,157,202,0.08),
    transparent
  );
}

.gradient-solutions {
  background: linear-gradient(
    135deg,
    rgba(166,3,252,0.10),
    transparent
  );
}
```

👉 Regla:

* Opacidad máxima: **10%**
* Nunca gradientes saturados

---

## 6. 🧪 EJEMPLO REAL (HTML LISTO)

```html
<section class="section-products">
  <div class="card card-products">
    <h3 style="color: var(--color-products);">
      Plataforma de Productos
    </h3>

    <p style="color: var(--color-text-muted);">
      Soluciones modulares para industrias específicas.
    </p>

    <button class="btn-primary">
      Agendar demo
    </button>
  </div>
</section>
```

---

## 7. 🚫 ANTI-PATTERNS (EVITAR)

❌ Botones de todos colores
❌ Fondos violetas fuertes
❌ Cards con fondo cyan sólido
❌ Mezclar cyan + purple en misma sección
❌ Pink dominante (pierde tono enterprise)

---

## 8. 🧠 LECTURA ESTRATÉGICA (CLAVE)

Esto es lo importante de verdad:

* **Cyan → producto concreto**
* **Pink → servicio humano**
* **Purple → inteligencia / AI / solución**
* **Orange → decisión / negocio**

👉 Si esto está bien aplicado:
el usuario entiende Inthegra **sin leer una línea**


