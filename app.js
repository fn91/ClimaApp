

applyTheme(getPreferredTheme());

// --------- Selección de nodos ---------
const inputCity     = document.getElementById("city");
const btnSearch     = document.getElementById("btnSearch");
const btnGeo= document.getElementById("btnGeo")
const weatherBox    = document.getElementById("weather");
const forecastBox   = document.getElementById("forecast");     // opcional si aún no lo creaste
const forecastGrid  = document.getElementById("forecastGrid"); // idem
const btnTheme = document.getElementById("btnTheme");
const statusEl=document.getElementById("status");

// --------- Constantes API ---------
const API_KEY = window.OPENWEATHER_API_KEY; // definido en config.js
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const UNITS = "metric"; // °C
const LANG  = "es";

// --------- Helpers ---------
function normalizeCityName(str) {
  return str.trim().replace(/\s+/g, " ").toLowerCase()
    .replace(/^\w|\s\w/g, (m) => m.toUpperCase());
}

function setStatus(message = "", type = "info") {
  if (!statusEl) return;
  statusEl.className = "status"; // reset classes
  if (type === "loading") statusEl.classList.add("loading");
  statusEl.textContent = message;
}

function lock(el, isLoading = true) {
  if (!el) return;
  el.disabled = isLoading;
}


function iconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function fmtHour(ts) {
  return new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function fetchJSON(url) {
  const res = await fetch(url);
  const payload = await res.json(); // OW devuelve JSON incluso en error
  if (!res.ok) {
    console.error("OpenWeather error:", res.status, payload);
    throw new Error(`HTTP ${res.status} · ${payload?.message || "error desconocido"}`);
  }
  return payload;
}

function applyTheme(theme){
const root = document.documentElement;
if(theme==="dark"){
root.classList.add("dark");
}else{
root.classList.remove("dark");

}
localStorage.setItem("theme",theme);

}

function getPreferredTheme(){
  const saved= localStorage.getItem("theme")
  if (saved==="dark"|| saved==="light") return saved;

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";


}


// --------- Render: clima actual ---------
function renderCurrentWeatherReal(data) {
  const { name, sys, weather, main, wind } = data;
  const w = weather?.[0];

  const cityName = `${name}${sys?.country ? ", " + sys.country : ""}`;
  const temp = Math.round(main.temp);
  const desc = w?.description || "Sin descripción";
  const tmin = Math.round(main.temp_min);
  const tmax = Math.round(main.temp_max);

  weatherBox.innerHTML = `
    <h2>${cityName}</h2>
    <p style="font-size:2rem; font-weight:700; margin:.25rem 0;">${temp}°C</p>
    <p>${desc}</p>
    <p>Máx: <strong>${tmax}°C</strong> · Mín: <strong>${tmin}°C</strong></p>
    ${wind ? `<p style="opacity:.7">Viento: ${Math.round(wind.speed)} m/s</p>` : ""}
  `;
}

// --------- Render: forecast 24h ---------
function renderForecast24h(list) {
  
  if (!forecastGrid) return; // por si aún no existe en el HTML


  if (!Array.isArray(list) || list.length === 0) {
    forecastGrid.innerHTML = `<p>No hay datos de pronóstico.</p>`;
    return;
  }

  // 8 bloques de 3h = 24h
  const items = list.slice(0, 8).map((entry) => {
    const time = fmtHour(entry.dt);
    const temp = Math.round(entry.main.temp);
    const desc = entry.weather?.[0]?.description || "";
    const icon = entry.weather?.[0]?.icon || "01d";
    return `
      <div class="forecast-item">
        <div>${time}</div>
       <img loading="lazy" src="${iconUrl(icon)}" alt="${desc}" width="50" height="50" />
        <div class="t">${temp}°C</div>
        <div>${desc}</div>
      </div>
    `;
  }).join("");

  forecastGrid.innerHTML = items;
}

// --------- Mock (para diseño sin red) ---------
function renderMockWeather(city) {
  const niceCity = normalizeCityName(city);
  const mock = { city: niceCity, temp: 22, desc: "Cielo claro (mock)", min: 18, max: 26 };
  weatherBox.innerHTML = `
    <h2>${mock.city}</h2>
    <p style="font-size:2rem; font-weight:700; margin:.25rem 0;">${mock.temp}°C</p>
    <p>${mock.desc}</p>
    <p>Máx: <strong>${mock.max}°C</strong> · Mín: <strong>${mock.min}°C</strong></p>
  `;
}

// --------- Búsqueda real por ciudad ---------
// --------- Búsqueda real por ciudad (versión corregida) ---------
async function handleSearch() {
  const raw = inputCity.value;

  // 1) Validación
  if (!raw || !raw.trim()) {
    setStatus("Escribe una ciudad válida.", "error");
    weatherBox.innerHTML = `<p style="color:#b91c1c">Escribe una ciudad válida.</p>`;
    inputCity.focus();
    return;
  }

  // 2) Preparar UI
  const city = raw.trim();
  setStatus(`Buscando clima para ${normalizeCityName(city)}…`, "loading");
  lock(btnSearch, true);
  if (forecastGrid) forecastGrid.innerHTML = "";

  // 3) Comprobar API key
  if (!API_KEY || API_KEY === "TU_API_KEY_AQUI") {
    setStatus("⚠️ Falta la API key o es inválida. Añádela en config.js.", "error");
    lock(btnSearch, false);
    return;
  }

  try {
    // 4) Clima actual
    const currentURL  = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`;
    const currentData = await fetchJSON(currentURL);
    renderCurrentWeatherReal(currentData);

    // 5) Forecast 24h
    if (forecastGrid) {
      forecastGrid.innerHTML = `<p class="loading">Cargando pronóstico…</p>`;
      const forecastURL  = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`;
      const forecastData = await fetchJSON(forecastURL);
      renderForecast24h(forecastData.list); // recuerda: <img loading="lazy"> en esta función
    }

    // 6) Éxito
    setStatus("Listo ✅");
  } catch (error) {
    console.error(error);
    setStatus(`No se pudo obtener el clima. ${error.message || ""}`, "error");
    weatherBox.innerHTML = `
      <p style="color:#b91c1c">❌ No se pudo obtener el clima para "${normalizeCityName(city)}".<br>
      <small>${error.message || ""}</small></p>`;
    if (forecastGrid) forecastGrid.innerHTML = "";
  } finally {
    // 7) Siempre desbloquear
    lock(btnSearch, false);
  }
}


async function fetchCurrentByCoords(lat, lon) {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`;
  return await fetchJSON(url);
}

async function fetchForecastByCoords(lat, lon) {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`;
  return await fetchJSON(url);
}

async function loadWeatherByCoords(lat, lon) {
  // Feedback en UI
  weatherBox.innerHTML = `<p>Buscando clima en tu ubicación…</p>`;
  if (typeof forecastGrid !== "undefined" && forecastGrid) {
    forecastGrid.innerHTML = `<p>Cargando pronóstico…</p>`;
  }

  // Peticiones reales
  const current = await fetchCurrentByCoords(lat, lon);
  renderCurrentWeatherReal(current);

  if (typeof forecastGrid !== "undefined" && forecastGrid) {
    const forecast = await fetchForecastByCoords(lat, lon);
    renderForecast24h(forecast.list);
  }
}

btnGeo.addEventListener("click", () => {
  // 1) Geolocation soportada
  if (!("geolocation" in navigator)) {
    setStatus("Tu navegador no soporta geolocalización.", "error");
    return;
  }

  // 2) Feedback inmediato
  setStatus("Intentando obtener tu ubicación…");

  // 3) Solicitar posición
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        await loadWeatherByCoords(latitude, longitude);
      } catch (err) {
        console.error(err);
        setStatus(`No se pudo obtener el clima por coordenadas. ${err.message || ""}`, "error");
        if (typeof forecastGrid !== "undefined" && forecastGrid) forecastGrid.innerHTML = "";
      }
    },
    (err) => {
      // Errores típicos: 1 denegado, 2 no disponible, 3 timeout
      let msg = "No se pudo obtener tu ubicación.";
      if (err.code === 1) msg = "Permiso de ubicación denegado.";
      if (err.code === 2) msg = "Ubicación no disponible en este momento.";
      if (err.code === 3) msg = "La petición de ubicación ha caducado.";
      setStatus(`${msg} (Código ${err.code})`, "error");
      if (typeof forecastGrid !== "undefined" && forecastGrid) forecastGrid.innerHTML = "";
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 0 }
  );
});


// --------- Eventos ---------
// ===== Geolocalización real (con feedback visual) =====
btnGeo.addEventListener("click", () => {
  // 1️⃣ Verificamos si el navegador soporta la API
  if (!("geolocation" in navigator)) {
    setStatus("Tu navegador no soporta geolocalización.", "error");
    return;
  }

  // 2️⃣ Antes de pedir la ubicación → feedback al usuario
  setStatus("Intentando obtener tu ubicación…", "loading");
  lock(btnGeo, true);

  // 3️⃣ Solicitamos posición
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        // Cargamos clima real con coordenadas
        await loadWeatherByCoords(latitude, longitude);

        // Éxito 🎉
        setStatus("Listo ✅");
      } catch (err) {
        console.error(err);
        setStatus(`No se pudo obtener el clima. ${err.message}`, "error");
      } finally {
        // 4️⃣ Siempre desbloqueamos el botón al final
        lock(btnGeo, false);
      }
    },

    // 5️⃣ Manejo de errores de geolocalización
    (err) => {
      let msg = "No se pudo obtener tu ubicación.";
      if (err.code === 1) msg = "Permiso de ubicación denegado.";
      if (err.code === 2) msg = "Ubicación no disponible.";
      if (err.code === 3) msg = "La petición ha caducado.";

      setStatus(`${msg} (Código ${err.code})`, "error");
      lock(btnGeo, false);
    },

    // 6️⃣ Configuración opcional: precisión, timeout, cache
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 0 }
  );
});


// Evento cambiar de color oscuro a  claro
btnTheme.textContent = document.documentElement.classList.contains("dark") ? "🌞" : "🌓";
btnTheme.addEventListener("click", () => {
  const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  btnTheme.textContent = next === "dark" ? "🌞" : "🌓";
});



