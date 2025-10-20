// =======================
// App del Clima — Local + Vercel Proxy
// =======================

// ---- Nodos ----
const inputCity    = document.getElementById("city");
const btnSearch    = document.getElementById("btnSearch");
const btnGeo       = document.getElementById("btnGeo");
const btnTheme     = document.getElementById("btnTheme");
const weatherBox   = document.getElementById("weather");
const forecastGrid = document.getElementById("forecastGrid");
const statusEl     = document.getElementById("status");

// ---- Constantes cliente ----
const UNITS = "metric";
const LANG  = "es";

// ===== Detectar entorno (local vs Vercel) =====
const IS_LOCAL = typeof window.IS_LOCAL !== "undefined" && window.IS_LOCAL === true;

// ---- Helpers ----
function normalizeCityName(str){
  return str.trim().replace(/\s+/g," ").toLowerCase()
    .replace(/^\w|\s\w/g,(m)=>m.toUpperCase());
}
function setStatus(message="", type="info"){
  if(!statusEl) return;
  statusEl.className = "status";
  if(type==="loading") statusEl.classList.add("loading");
  statusEl.textContent = message;
}
function lock(el, on=true){ if(el) el.disabled = on; }
function iconUrl(i){ return `https://openweathermap.org/img/wn/${i}@2x.png`; }
function fmtHour(ts){ return new Date(ts*1000).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}); }
async function fetchJSON(url){
  const r = await fetch(url);
  const payload = await r.json();
  if(!r.ok) throw new Error(`HTTP ${r.status} · ${payload?.message || "error desconocido"}`);
  return payload;
}

// ---- Render actual ----
function renderCurrentWeatherReal(data){
  const { name, sys, weather, main, wind } = data;
  const w = weather?.[0];
  const cityName = `${name ?? "—"}${sys?.country ? ", " + sys.country : ""}`;
  const temp = Math.round(main?.temp ?? 0);
  const desc = w?.description || "Sin descripción";
  const tmin = Math.round(main?.temp_min ?? 0);
  const tmax = Math.round(main?.temp_max ?? 0);

  weatherBox.innerHTML = `
    <h2>${cityName}</h2>
    <p style="font-size:2rem;font-weight:700;margin:.25rem 0;">${temp}°C</p>
    <p>${desc}</p>
    <p>Máx: <strong>${tmax}°C</strong> · Mín: <strong>${tmin}°C</strong></p>
    ${wind ? `<p style="opacity:.7">Viento: ${Math.round(wind.speed)} m/s</p>` : ""}
  `;
}

// ---- Render forecast 24h ----
function renderForecast24h(list){
  if(!forecastGrid) return;
  if(!Array.isArray(list) || list.length===0){
    forecastGrid.innerHTML = `<p>No hay datos de pronóstico.</p>`;
    return;
  }
  const items = list.slice(0,8).map(e=>{
    const time = fmtHour(e.dt);
    const temp = Math.round(e.main?.temp ?? 0);
    const desc = e.weather?.[0]?.description || "";
    const icon = e.weather?.[0]?.icon || "01d";
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

// ---- Helper URLs según entorno ----
function buildWeatherByCityURL(city){
  return IS_LOCAL
    ? `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${window.OPENWEATHER_API_KEY}&units=${UNITS}&lang=${LANG}`
    : `/api/weather?city=${encodeURIComponent(city)}&units=${UNITS}&lang=${LANG}`;
}

function buildForecastByCityURL(city){
  return IS_LOCAL
    ? `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${window.OPENWEATHER_API_KEY}&units=${UNITS}&lang=${LANG}`
    : `/api/forecast?city=${encodeURIComponent(city)}&units=${UNITS}&lang=${LANG}`;
}

function buildWeatherByCoordsURL(lat,lon){
  return IS_LOCAL
    ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${window.OPENWEATHER_API_KEY}&units=${UNITS}&lang=${LANG}`
    : `/api/weather?lat=${lat}&lon=${lon}&units=${UNITS}&lang=${LANG}`;
}
function buildForecastByCoordsURL(lat,lon){
  return IS_LOCAL
    ? `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${window.OPENWEATHER_API_KEY}&units=${UNITS}&lang=${LANG}`
    : `/api/forecast?lat=${lat}&lon=${lon}&units=${UNITS}&lang=${LANG}`;
}

// ---- Búsqueda por ciudad ----
async function handleSearch(){
  const raw = inputCity.value;
  if(!raw || !raw.trim()){
    setStatus("Escribe una ciudad válida.","error");
    weatherBox.innerHTML = `<p style="color:#b91c1c">Escribe una ciudad válida.</p>`;
    inputCity.focus();
    return;
  }

  const city = raw.trim();
  setStatus(`Buscando clima para ${normalizeCityName(city)}…`,"loading");
  lock(btnSearch,true);
  if(forecastGrid) forecastGrid.innerHTML = "";

  try{
    // Actual
    const currentURL  = buildWeatherByCityURL(city);
    const currentData = await fetchJSON(currentURL);
    renderCurrentWeatherReal(currentData);

    // Forecast
    if(forecastGrid){
      forecastGrid.innerHTML = `<p class="loading">Cargando pronóstico…</p>`;
      const forecastURL  = buildForecastByCityURL(city);
      const forecastData = await fetchJSON(forecastURL);
      renderForecast24h(forecastData.list);
    }

    setStatus("Listo ✅");
  }catch(err){
    console.error(err);
    setStatus(`No se pudo obtener el clima. ${err.message || ""}`,"error");
    weatherBox.innerHTML = `
      <p style="color:#b91c1c">❌ No se pudo obtener el clima para "${normalizeCityName(city)}".<br>
      <small>${err.message || ""}</small></p>`;
    if(forecastGrid) forecastGrid.innerHTML = "";
  }finally{
    lock(btnSearch,false);
  }
}

// ---- Geolocalización ----
async function fetchCurrentByCoords(lat,lon){
  return await fetchJSON(buildWeatherByCoordsURL(lat,lon));
}
async function fetchForecastByCoords(lat,lon){
  return await fetchJSON(buildForecastByCoordsURL(lat,lon));
}
async function loadWeatherByCoords(lat,lon){
  weatherBox.innerHTML = `<p>Buscando clima en tu ubicación…</p>`;
  if(forecastGrid) forecastGrid.innerHTML = `<p class="loading">Cargando pronóstico…</p>`;
  const current = await fetchCurrentByCoords(lat,lon);
  renderCurrentWeatherReal(current);
  if(forecastGrid){
    const fc = await fetchForecastByCoords(lat,lon);
    renderForecast24h(fc.list);
  }
}

// ---- Tema oscuro/claro ----
function applyTheme(theme){
  const root = document.documentElement;
  if(theme==="dark") root.classList.add("dark"); else root.classList.remove("dark");
  localStorage.setItem("theme", theme);
}
function getPreferredTheme(){
  const saved = localStorage.getItem("theme");
  if(saved==="dark"||saved==="light") return saved;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}
applyTheme(getPreferredTheme());
if(btnTheme){
  btnTheme.textContent = document.documentElement.classList.contains("dark") ? "🌞" : "🌓";
  btnTheme.addEventListener("click", ()=>{
    const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
    const next = current==="dark" ? "light" : "dark";
    applyTheme(next);
    btnTheme.textContent = next==="dark" ? "🌞" : "🌓";
  });
}

// ---- Eventos ----
btnSearch.addEventListener("click", handleSearch);
inputCity.addEventListener("keydown",(e)=>{
  if(e.key==="Enter"){ e.preventDefault(); handleSearch(); }
});
btnGeo.addEventListener("click", ()=>{
  if(!("geolocation" in navigator)){
    setStatus("Tu navegador no soporta geolocalización.","error");
    return;
  }
  setStatus("Intentando obtener tu ubicación…","loading");
  lock(btnGeo,true);
  navigator.geolocation.getCurrentPosition(
    async (pos)=>{
      const { latitude, longitude } = pos.coords;
      try{
        await loadWeatherByCoords(latitude, longitude);
        setStatus("Listo ✅");
      }catch(err){
        console.error(err);
        setStatus(`No se pudo obtener el clima. ${err.message || ""}`,"error");
        if(forecastGrid) forecastGrid.innerHTML = "";
      }finally{
        lock(btnGeo,false);
      }
    },
    (err)=>{
      let msg = "No se pudo obtener tu ubicación.";
      if (err.code===1) msg = "Permiso de ubicación denegado.";
      if (err.code===2) msg = "Ubicación no disponible.";
      if (err.code===3) msg = "La petición ha caducado.";
      setStatus(`${msg} (Código ${err.code})`,"error");
      lock(btnGeo,false);
    },
    { enableHighAccuracy:false, timeout:8000, maximumAge:0 }
  );
});
