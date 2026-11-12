# 🌦️ App del Clima – Editorial Design 2025

**Una experiencia meteorológica minimalista, audaz y tipográfica. Diseño de vanguardia inspirado en el estilo suizo aplicado a una herramienta funcional.**



👉 **[Ver Demo en Vivo](https://clima-app-sooty.vercel.app/)**

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
- **Datos en Tiempo Real:** Una función de Vercel consulta **OpenWeather API** ☁️.
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
├── api/weather.mjs # Consultas a OpenWeather desde el servidor
└── Readme.md    # Documentación del proyecto
```

---

## ⚙️ Configuración e Instalación

1️⃣ **Clona este repositorio**
```bash
git clone https://github.com/fn91/ClimaApp.git
cd ClimaApp
```

2️⃣ **Configura la clave en Vercel**

Crea una clave en [OpenWeather](https://home.openweathermap.org/api_keys). En tu proyecto de Vercel, ve a **Settings → Environment Variables** y guarda la clave como `OPENWEATHER_API_KEY`. Selecciona **Production** para el sitio publicado y **Development** para las pruebas locales. Si una clave anterior se incluyó en Git o en un archivo público como `config.js`, revócala en OpenWeather.

3️⃣ **Prueba y despliega**

Desde la raíz del proyecto, vincula tu proyecto de Vercel y ejecuta su servidor local:

```bash
npx vercel link
npx vercel dev
```

Abre la URL que muestra Vercel. Para aplicar el cambio al sitio público, despliega esta versión después de guardar la variable de producción. El navegador consulta `/api/weather` y la función añade la clave al contactar con OpenWeather.

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
