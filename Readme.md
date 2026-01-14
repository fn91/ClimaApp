# 🌦️ App del Clima – Editorial Design 2025

**Una experiencia meteorológica minimalista, audaz y tipográfica. Diseño de vanguardia inspirado en el estilo suizo aplicado a una herramienta funcional.**

![Banner de la App](./docs/screenshot-banner.png)

👉 **[Ver Demo en Vivo](https://fn91.github.io/app-clima/)**

---

## 🧭 Concepto y Diseño

Esta versión rompe con la estética genérica de las aplicaciones del clima tradicionales. Hemos abandonado el *glassmorphism* y los gradientes coloridos en favor de:

- **Tipografía de Impacto:** Uso de `Outfit` para jerarquías audaces y `JetBrains Mono` para datos técnicos.
- **Micro-texturas:** Una sutil capa de grano y patrones para una sensación táctil y humana.
- **Grilla Asimétrica:** Un layout dinámico que prioriza la lectura y la jerarquía visual del clima actual.
- **Alto Contraste:** Una paleta monocromática potente con acentos en Azul Eléctrico (`#0047ff`).

---

## 🛠️ Funcionalidades Core

- **Consulta Global:** Búsqueda instantánea por nombre de ciudad 🌆.
- **Geolocalización:** Acceso a datos locales con un solo clic 🌍.
- **Datos en Tiempo Real:** Integración directa con **OpenWeather API** ☁️.
- **Pronóstico 24h:** Visualización detallada de las próximas horas con scroll horizontal 📅.
- **Modo Dual:** Soporte nativo para Temas Claro y Oscuro con persistencia en `localStorage` 🌓.
- **UX Reactiva:** Estados de carga, errores y validaciones fluidas 💫.

---

## 🚀 Tecnologías

| Tecnología | Rol en el Proyecto |
|-------------|--------------------|
| **HTML5** | Estructura semántica y accesible |
| **CSS3** | Layout Grid, Variables y Diseño Editorial |
| **JS (ES6+)** | Lógica de negocio y consumo asíncrono de API |
| **OpenWeather** | Motor de datos meteorológicos |

---

## 🧩 Estructura

```text
├── index.html   # Estructura semántica
├── styles.css   # Sistema de diseño (CSS Variables + Grid)
├── app.js       # Orquestador de lógica (Fetch & Render)
├── config.js    # Configuración de API
├── /docs        # Activos y documentación visual
└── Readme.md    # Documentación del proyecto
```

---

## ⚙️ Configuración e Instalación

1️⃣ **Clona este repositorio**
```bash
git clone https://github.com/fn91/app-clima.git
cd app-clima
```

2️⃣ **Configura tu API Key**
Obtén tu clave gratuita en [OpenWeather](https://openweathermap.org/) y agrégala en `config.js`:
```javascript
const API_KEY = "TU_API_KEY_AQUI";
```

3️⃣ **Inicia la App**
Solo abre `index.html` en tu navegador o usa la extensión **Live Server** de VS Code.

---

## 🧠 Enfoque Técnico

- **Modularidad:** Separación estricta entre estilos (CSS), estructura (HTML) y lógica (JS).
- **Escalabilidad:** Uso extensivo de variables CSS para facilitar cambios globales de marca.
- **Rendimiento:** Carga diferida de iconos y manejo optimizado de peticiones de red.
- **Accesibilidad:** Uso de `aria-live` para anuncios de estado y navegación por teclado optimizada.

---

## 👤 Autor

**Fn – Programador Front-End**  
💼 [LinkedIn](https://www.linkedin.com/in/claudio-fanelli/)  
💻 [GitHub](https://github.com/fn91)

---
*Producido con enfoque en el diseño visual y la excelencia en el código.*