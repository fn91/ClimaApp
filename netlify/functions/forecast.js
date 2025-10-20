export default async function handler(req, res) {
  try {
    const { city, lat, lon, units = "metric", lang = "es" } = req.query || {};
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) return res.status(500).json({ message: "Missing OPENWEATHER_API_KEY" });

    const base = "https://api.openweathermap.org/data/2.5";
    let url;
    if (city) {
      url = `${base}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}&lang=${lang}`;
    } else if (lat && lon) {
      url = `${base}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${lang}`;
    } else {
      return res.status(400).json({ message: "Missing query: city OR lat & lon" });
    }

    const r = await fetch(url);
    const payload = await r.json();
    res.setHeader("Cache-Control", "public, max-age=120");
    return res.status(r.status).json(payload);
  } catch (e) {
    return res.status(500).json({ message: e.message || "Internal error" });
  }
}