const OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/";

function json(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function validCoordinate(value, max) {
  return value !== null && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)
    && Math.abs(Number(value)) <= max;
}

export default {
  async fetch(request) {
    if (request.method !== "GET") {
      return json({ message: "Método no permitido." }, 405, { Allow: "GET" });
    }

    const params = new URL(request.url).searchParams;
    const type = params.get("type");
    if (type !== "weather" && type !== "forecast") {
      return json({ message: "Consulta meteorológica no válida." }, 400);
    }

    const city = params.get("q")?.trim();
    const lat = params.get("lat");
    const lon = params.get("lon");
    const url = new URL(type, OPENWEATHER_URL);
    if (city && city.length <= 100 && lat === null && lon === null) {
      url.searchParams.set("q", city);
    } else if (!params.has("q") && validCoordinate(lat, 90) && validCoordinate(lon, 180)) {
      url.searchParams.set("lat", lat);
      url.searchParams.set("lon", lon);
    } else {
      return json({ message: "Indica una ciudad o unas coordenadas válidas." }, 400);
    }

    const apiKey = process.env.OPENWEATHER_API_KEY?.trim();
    if (!apiKey) {
      return json({ message: "El servicio meteorológico no está configurado." }, 503);
    }

    url.searchParams.set("appid", apiKey);
    url.searchParams.set("units", "metric");
    url.searchParams.set("lang", "es");
    if (type === "forecast") url.searchParams.set("cnt", "8");

    try {
      const response = await fetch(url, {
        redirect: "error",
        signal: AbortSignal.timeout(6000),
      });
      if (response.status === 404) {
        return json({ message: "No se encontró esa ubicación." }, 404);
      }
      if (!response.ok) {
        return json({ message: "El servicio meteorológico no está disponible." }, 502);
      }
      return json(await response.json());
    } catch {
      return json({ message: "El servicio meteorológico no está disponible." }, 502);
    }
  },
};
