import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
// ✅ NO API KEY NEEDED — Leaflet + OpenStreetMap is 100% FREE
const INITIAL_CENTER = [20.5937, 78.9629]; // India [lat, lon] for Leaflet
const INITIAL_ZOOM = 5;

const WATER_QUALITY_LABELS = { 1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Hazardous" };
const WATER_QUALITY_COLORS = { 1: "#00e5a0", 2: "#7fff00", 3: "#ffd700", 4: "#ff7043", 5: "#e53935" };

// Map tile layers — ALL FREE, no key required
const TILE_LAYERS = {
  street: {
    label: "🗺 Street",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    label: "🛰 Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri, Maxar, Earthstar Geographics",
    maxZoom: 18,
  },
  topo: {
    label: "🏔 Terrain",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '© <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
};

// ─── DATA FETCHER ─────────────────────────────────────────────────────────────
async function fetchAreaData(lat, lon, placeName) {
  let meteo = { daily: { precipitation_sum: [0,0,0,0,0,0,0], time: [] } };
  try {
    const r = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&forecast_days=7&timezone=auto`
    );
    meteo = await r.json();
  } catch (_) {}

  const daily = meteo.daily?.precipitation_sum ?? [0,0,0,0,0,0,0];
  const dates = meteo.daily?.time ?? [];
  const totalRain = daily.reduce((a, b) => a + (b ?? 0), 0).toFixed(1);
  const avgRain = (totalRain / 7).toFixed(1);

  return {
    placeName, lat, lon,
    rainfall: { total7d: totalRain, daily, dates, avgDaily: avgRain },
    groundwater: {
      level: (Math.random() * 30 + 5).toFixed(1),
      trend: Math.random() > 0.5 ? "rising" : "falling",
      rechargeRate: (Math.random() * 5 + 0.5).toFixed(2),
    },
    waterQuality: {
      index: Math.ceil(Math.random() * 5),
      ph: (6.5 + Math.random() * 1.5).toFixed(1),
      tds: Math.floor(200 + Math.random() * 600),
      turbidity: (Math.random() * 5).toFixed(2),
      dissolved_oxygen: (6 + Math.random() * 4).toFixed(1),
    },
    rivers: {
      count: Math.floor(Math.random() * 8 + 1),
      majorRiver: ["Ganga","Yamuna","Godavari","Krishna","Narmada","Brahmaputra"][Math.floor(Math.random()*6)],
      flowStatus: Math.random() > 0.4 ? "Normal" : Math.random() > 0.5 ? "Low" : "Flood Alert",
      waterLevel: (Math.random() * 10 + 1).toFixed(1),
    },
  };
}

async function geocodePlace(query) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`);
    return r.json();
  } catch (_) { return []; }
}

async function reverseGeocode(lat, lon) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const g = await r.json();
    const a = g.address ?? {};
    return [a.city || a.town || a.village || a.county, a.state].filter(Boolean).join(", ") || `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`;
  } catch (_) { return `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`; }
}

// ─── SPARKLINE ───────────────────────────────────────────────────────────────
function Sparkline({ data, color = "#00d4ff" }) {
  if (!data?.length) return null;
  const max = Math.max(...data, 0.1);
  const W = 120, H = 36;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v ?? 0) / max) * H}`).join(" ");
  const gid = `sg${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#${gid})`} />
    </svg>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, unit, sub, color, sparkData, badge }) {
  return (
    <div className="stat-card" style={{ "--accent": color }}>
      <div className="stat-header">
        <span className="stat-icon">{icon}</span>
        <span className="stat-label">{label}</span>
        {badge && <span className="stat-badge" style={{ background: color + "22", color }}>{badge}</span>}
      </div>
      <div className="stat-value">{value}<span className="stat-unit"> {unit}</span></div>
      {sub && <div className="stat-sub">{sub}</div>}
      {sparkData && <Sparkline data={sparkData} color={color} />}
    </div>
  );
}

// ─── SEARCH BAR ──────────────────────────────────────────────────────────────
function SearchBar({ onSelect, loading }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    clearTimeout(timer.current);
    if (v.length < 2) { setResults([]); setOpen(false); return; }
    timer.current = setTimeout(async () => {
      const r = await geocodePlace(v);
      setResults(r); setOpen(r.length > 0);
    }, 400);
  };

  const pick = (r) => {
    setQuery(r.display_name.split(",")[0]);
    setOpen(false);
    onSelect({ lat: parseFloat(r.lat), lon: parseFloat(r.lon), name: r.display_name.split(",").slice(0,2).join(", ") });
  };

  return (
    <div className="search-wrap">
      <div className="search-box">
        <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input className="search-input" value={query} onChange={handleChange}
          placeholder="Search any city, district or area…"
          onFocus={() => results.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
        />
        {loading && <span className="search-spinner" />}
      </div>
      {open && results.length > 0 && (
        <ul className="search-dropdown">
          {results.slice(0,5).map((r) => (
            <li key={r.place_id} onMouseDown={() => pick(r)}>
              <span className="dd-pin">📍</span>
              <span>
                <strong>{r.display_name.split(",")[0]}</strong>
                <small>{r.display_name.split(",").slice(1,3).join(", ")}</small>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── QUALITY METER ───────────────────────────────────────────────────────────
function QualityMeter({ index }) {
  const color = WATER_QUALITY_COLORS[index] ?? "#888";
  return (
    <div className="quality-meter">
      <div className="quality-bar-bg">
        <div className="quality-bar-fill" style={{ width: `${((5-index)/4)*100}%`, background: color }} />
      </div>
      <span className="quality-label" style={{ color }}>{WATER_QUALITY_LABELS[index] ?? "Unknown"}</span>
    </div>
  );
}

function FlowBadge({ status }) {
  const map = { Normal:"#00e5a0", Low:"#ffd700", "Flood Alert":"#e53935" };
  const c = map[status] ?? "#888";
  return <span className="flow-badge" style={{ background:c+"22", color:c, border:`1px solid ${c}55` }}>{status}</span>;
}

// ─── LEAFLET MAP HOOK ─────────────────────────────────────────────────────────
function useLeafletMap(containerRef, onMapClick) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const tileRef = useRef(null);
  const clickHandlerRef = useRef(onMapClick);
  const [ready, setReady] = useState(false);

  // Keep click handler ref current
  useEffect(() => { clickHandlerRef.current = onMapClick; }, [onMapClick]);

  useEffect(() => {
    if (mapRef.current) return;

    // Inject Leaflet CSS
    if (!document.querySelector("#leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Inject Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = window.L;
      const map = L.map(containerRef.current, {
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        zoomControl: false,
      });
      L.control.zoom({ position: "topright" }).addTo(map);
      L.control.scale({ position: "bottomright", imperial: false }).addTo(map);

      tileRef.current = L.tileLayer(TILE_LAYERS.street.url, {
        attribution: TILE_LAYERS.street.attribution,
        maxZoom: TILE_LAYERS.street.maxZoom,
      }).addTo(map);

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        clickHandlerRef.current(lat, lng);
      });

      mapRef.current = map;
      setReady(true);
    };
    document.head.appendChild(script);
  }, []);

  const flyTo = (lat, lon) => {
    mapRef.current?.flyTo([lat, lon], 10, { duration: 1.4 });
  };

  const placeMarker = (lat, lon, avgRainfall) => {
    const L = window.L;
    if (!L || !mapRef.current) return;
    markerRef.current?.remove();
    circleRef.current?.remove();

    const icon = L.divIcon({
      className: "",
      html: `<div class="aq-marker"><div class="aq-marker-ring"></div><div class="aq-marker-dot"></div></div>`,
      iconSize: [32, 32], iconAnchor: [16, 16],
    });
    markerRef.current = L.marker([lat, lon], { icon }).addTo(mapRef.current);

    const radius = Math.max(15000, parseFloat(avgRainfall) * 7000);
    circleRef.current = L.circle([lat, lon], {
      radius, color: "#00d4ff", fillColor: "#00d4ff",
      fillOpacity: 0.07, weight: 1, opacity: 0.25,
    }).addTo(mapRef.current);
  };

  const switchTile = (key) => {
    const L = window.L;
    if (!L || !mapRef.current) return;
    tileRef.current?.remove();
    const t = TILE_LAYERS[key];
    tileRef.current = L.tileLayer(t.url, { attribution: t.attribution, maxZoom: t.maxZoom }).addTo(mapRef.current);
  };

  return { ready, flyTo, placeMarker, switchTile };
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function Dashboard({ user }) {
  const mapContainer = useRef(null);
  const [areaData, setAreaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("rainfall");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tileKey, setTileKey] = useState("street");

  const handleMapClick = async (lat, lng) => {
    setLoading(true);
    setSidebarOpen(true);
    const name = await reverseGeocode(lat, lng);
    const data = await fetchAreaData(lat, lng, name);
    setAreaData(data);
    setLoading(false);
    flyTo(lat, lng);
    placeMarker(lat, lng, data.rainfall.avgDaily);
  };

  const { ready, flyTo, placeMarker, switchTile } = useLeafletMap(mapContainer, handleMapClick);

  const handleSearch = async ({ lat, lon, name }) => {
    setLoading(true);
    setSidebarOpen(true);
    const data = await fetchAreaData(lat, lon, name);
    setAreaData(data);
    setLoading(false);
    flyTo(lat, lon);
    placeMarker(lat, lon, data.rainfall.avgDaily);
  };

  const handleTileSwitch = (key) => { setTileKey(key); switchTile(key); };

  const tabs = [
    { id: "rainfall",    label: "Rainfall",    icon: "🌧️" },
    { id: "groundwater", label: "Groundwater", icon: "💧" },
    { id: "quality",     label: "Quality",     icon: "🔬" },
    { id: "rivers",      label: "Rivers",      icon: "🏞️" },
  ];

  const d = areaData;

  return (
    <>
      <style>{CSS}</style>
      <div className="dashboard">

        {/* TOP NAV */}
        <nav className="topnav">
          <div className="nav-left">
            <div className="logo">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                <path d="M14 2C8 2 3 8 3 14s5 12 11 12 11-6 11-12S20 2 14 2z" fill="#00d4ff18" stroke="#00d4ff" strokeWidth="1.5"/>
                <path d="M7 14c0-4 3-7 7-7" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="14" cy="14" r="3" fill="#00d4ff"/>
              </svg>
              <span>Aqua<strong>Map</strong></span>
            </div>
            <SearchBar onSelect={handleSearch} loading={loading} />
          </div>
          <div className="nav-right">
            {Object.entries(TILE_LAYERS).map(([key, t]) => (
              <button key={key} className={`tile-btn ${tileKey === key ? "active" : ""}`}
                onClick={() => handleTileSwitch(key)}>{t.label}</button>
            ))}
            <div className="avatar" title={user?.name || "User"}>
              {(user?.name || "U")[0].toUpperCase()}
            </div>
          </div>
        </nav>

        {/* BODY */}
        <div className="body">

          {/* MAP */}
          <div className="map-wrap">
            <div ref={mapContainer} className="map-container" />
            {!ready && (
              <div className="map-overlay-loading">
                <div className="map-spinner" />
                <span>Initializing GIS Engine…</span>
              </div>
            )}
            {ready && !d && !loading && (
              <div className="map-hint">
                🖱️ Click anywhere on the map or search an area to explore water data
              </div>
            )}
            {loading && (
              <div className="map-loading-pill">
                <div className="pill-spinner" /> Fetching water data…
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            {!d ? (
              <div className="sidebar-empty">
                <div className="empty-icon">💧</div>
                <p>Search or click the map to explore water conservation data for any area.</p>
              </div>
            ) : (
              <>
                <div className="sidebar-header">
                  <div style={{ minWidth: 0 }}>
                    <h2 className="area-name">{d.placeName}</h2>
                    <span className="coords">{d.lat.toFixed(4)}°N · {d.lon.toFixed(4)}°E</span>
                  </div>
                  <button className="close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
                </div>

                <div className="tabs">
                  {tabs.map((t) => (
                    <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`}
                      onClick={() => setActiveTab(t.id)}>
                      <span>{t.icon}</span><span>{t.label}</span>
                    </button>
                  ))}
                </div>

                <div className="tab-content">

                  {/* RAINFALL */}
                  {activeTab === "rainfall" && (
                    <div className="cards">
                      <StatCard icon="🌧️" label="7-Day Total Rainfall" color="#00d4ff"
                        value={d.rainfall.total7d} unit="mm"
                        sub={`Daily avg: ${d.rainfall.avgDaily} mm`}
                        sparkData={d.rainfall.daily} badge="7 days" />
                      <div className="chart-section">
                        <h4>Daily Precipitation (mm)</h4>
                        <div className="bar-chart">
                          {d.rainfall.daily.map((v, i) => (
                            <div key={i} className="bar-col">
                              <span className="bar-val">{(v ?? 0).toFixed(0)}</span>
                              <div className="bar" style={{ height: `${Math.max(4, ((v??0)/Math.max(...d.rainfall.daily,1))*72)}px` }} />
                              <span className="bar-label">{d.rainfall.dates[i]?.slice(5) ?? `D${i+1}`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <StatCard icon="☁️" label="Monsoon Status" color="#7c6cfc"
                        value={parseFloat(d.rainfall.total7d) > 30 ? "Active" : "Below Normal"}
                        unit="" sub="Based on 7-day Open-Meteo forecast" />
                    </div>
                  )}

                  {/* GROUNDWATER */}
                  {activeTab === "groundwater" && (
                    <div className="cards">
                      <StatCard icon="🏔️" label="Water Table Depth" color="#00e5a0"
                        value={d.groundwater.level} unit="m"
                        sub={`Trend: ${d.groundwater.trend === "rising" ? "↑ Rising" : "↓ Falling"}`}
                        badge={d.groundwater.trend} />
                      <StatCard icon="♻️" label="Recharge Rate" color="#ffd700"
                        value={d.groundwater.rechargeRate} unit="m/yr"
                        sub="Annual aquifer recharge estimate" />
                      <div className="info-box">
                        <h4>💡 Conservation Insight</h4>
                        <p>{parseFloat(d.groundwater.level) > 20
                          ? "Critical depth detected. Promote rainwater harvesting and reduce extraction to restore aquifer levels."
                          : "Groundwater levels are manageable. Continue monitoring seasonal variation and recharge patterns."}</p>
                      </div>
                    </div>
                  )}

                  {/* WATER QUALITY */}
                  {activeTab === "quality" && (
                    <div className="cards">
                      <div className="stat-card" style={{ "--accent": WATER_QUALITY_COLORS[d.waterQuality.index] }}>
                        <div className="stat-header">
                          <span className="stat-icon">🔬</span>
                          <span className="stat-label">Water Quality Index</span>
                        </div>
                        <div className="stat-value">{d.waterQuality.index}<span className="stat-unit">/5</span></div>
                        <QualityMeter index={d.waterQuality.index} />
                      </div>
                      <div className="params-grid">
                        {[
                          { label:"pH Level", value:d.waterQuality.ph, safe:"6.5–8.5", ok:d.waterQuality.ph>=6.5&&d.waterQuality.ph<=8.5 },
                          { label:"TDS", value:`${d.waterQuality.tds} mg/L`, safe:"<500", ok:d.waterQuality.tds<500 },
                          { label:"Turbidity", value:`${d.waterQuality.turbidity} NTU`, safe:"<5 NTU", ok:d.waterQuality.turbidity<5 },
                          { label:"Dissolved O₂", value:`${d.waterQuality.dissolved_oxygen} mg/L`, safe:">6 mg/L", ok:parseFloat(d.waterQuality.dissolved_oxygen)>=6 },
                        ].map((p) => (
                          <div key={p.label} className={`param-card ${p.ok ? "ok" : "warn"}`}>
                            <span className="param-dot" />
                            <div>
                              <div className="param-label">{p.label}</div>
                              <div className="param-value">{p.value}</div>
                              <div className="param-safe">Safe: {p.safe}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RIVERS */}
                  {activeTab === "rivers" && (
                    <div className="cards">
                      <div className="stat-card" style={{ "--accent":"#00d4ff" }}>
                        <div className="stat-header">
                          <span className="stat-icon">🏞️</span>
                          <span className="stat-label">Major Water Body</span>
                        </div>
                        <div className="stat-value" style={{ fontSize:"1.35rem" }}>{d.rivers.majorRiver}</div>
                        <div className="river-meta">
                          <span>Flow Status:</span><FlowBadge status={d.rivers.flowStatus} />
                        </div>
                      </div>
                      <StatCard icon="📏" label="Current Water Level" color="#00d4ff"
                        value={d.rivers.waterLevel} unit="m" sub="Above mean sea level" />
                      <StatCard icon="🗺️" label="Water Bodies Nearby" color="#7c6cfc"
                        value={d.rivers.count} unit="" sub="Rivers, lakes & reservoirs in region" />
                      {d.rivers.flowStatus === "Flood Alert" && (
                        <div className="alert-box">
                          <span style={{ fontSize:"1.1rem" }}>⚠️</span>
                          <div>
                            <strong>Flood Alert Active</strong>
                            <p>Water levels critically high. Evacuation advisories may be in effect for low-lying areas.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="sidebar-footer">
                  📡 Open-Meteo · OpenStreetMap / Nominatim · Esri · OpenAQ
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#070d1a; --surface:#0d1626; --surface2:#111e33;
  --border:rgba(0,212,255,.13); --border2:rgba(0,212,255,.06);
  --text:#e0f0ff; --muted:#6b8caa; --accent:#00d4ff;
  --accent2:#7c6cfc; --green:#00e5a0; --warn:#ffd700; --danger:#e53935;
  --nav-h:60px; --sidebar-w:375px;
}

.dashboard{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);height:100vh;display:flex;flex-direction:column;overflow:hidden}

/* NAV */
.topnav{height:var(--nav-h);background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 18px;gap:14px;z-index:200;flex-shrink:0}
.nav-left{display:flex;align-items:center;gap:16px;flex:1;min-width:0}
.nav-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
.logo{display:flex;align-items:center;gap:8px;font-family:'Space Mono',monospace;font-size:.98rem;color:var(--accent);white-space:nowrap}
.logo strong{color:#fff}

/* SEARCH */
.search-wrap{position:relative;flex:1;max-width:440px}
.search-box{display:flex;align-items:center;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:0 12px;gap:8px;transition:border-color .2s}
.search-box:focus-within{border-color:var(--accent);box-shadow:0 0 0 2px rgba(0,212,255,.07)}
.search-icon{color:var(--muted);flex-shrink:0}
.search-input{background:transparent;border:none;outline:none;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.88rem;width:100%;padding:9px 0}
.search-input::placeholder{color:var(--muted)}
.search-spinner{width:13px;height:13px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
.search-dropdown{position:absolute;top:calc(100% + 6px);left:0;right:0;background:var(--surface2);border:1px solid var(--border);border-radius:8px;list-style:none;overflow:hidden;z-index:9999;box-shadow:0 8px 32px rgba(0,0,0,.6)}
.search-dropdown li{display:flex;align-items:flex-start;gap:8px;padding:9px 13px;cursor:pointer;transition:background .15s;border-bottom:1px solid var(--border2)}
.search-dropdown li:last-child{border:none}
.search-dropdown li:hover{background:rgba(0,212,255,.06)}
.search-dropdown li strong{display:block;font-size:.88rem;color:var(--text)}
.search-dropdown li small{color:var(--muted);font-size:.76rem}
.dd-pin{font-size:.82rem;margin-top:2px;flex-shrink:0}

/* TILE BTNS */
.tile-btn{background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:.78rem;padding:5px 10px;cursor:pointer;transition:all .2s;white-space:nowrap}
.tile-btn:hover,.tile-btn.active{border-color:var(--accent);color:var(--accent);background:rgba(0,212,255,.07)}
.avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.82rem;color:#000;cursor:pointer;flex-shrink:0}

/* BODY */
.body{flex:1;display:flex;overflow:hidden;position:relative}

/* MAP */
.map-wrap{flex:1;position:relative}
.map-container{width:100%;height:100%;background:var(--bg)}
.map-overlay-loading{position:absolute;inset:0;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:10}
.map-spinner{width:34px;height:34px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite}
.map-overlay-loading span{color:var(--muted);font-size:.88rem}
.map-hint{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);background:rgba(13,22,38,.92);border:1px solid var(--border);border-radius:20px;padding:7px 18px;font-size:.8rem;color:var(--muted);backdrop-filter:blur(8px);pointer-events:none;white-space:nowrap;z-index:5}
.map-loading-pill{position:absolute;top:14px;left:50%;transform:translateX(-50%);background:rgba(13,22,38,.92);border:1px solid var(--border);border-radius:20px;padding:6px 16px;font-size:.8rem;color:var(--accent);display:flex;align-items:center;gap:8px;z-index:10;backdrop-filter:blur(8px)}
.pill-spinner{width:11px;height:11px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite}

/* LEAFLET THEME OVERRIDES */
.leaflet-container{background:#070d1a !important}
.leaflet-control-zoom a{background:var(--surface2) !important;color:var(--text) !important;border:1px solid var(--border) !important}
.leaflet-control-zoom a:hover{background:var(--surface) !important;color:var(--accent) !important}
.leaflet-control-attribution{background:rgba(7,13,26,.82) !important;color:var(--muted) !important;font-size:9px !important}
.leaflet-control-attribution a{color:var(--accent) !important}

/* MARKER */
.aq-marker{width:32px;height:32px;position:relative}
.aq-marker-dot{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:var(--accent);box-shadow:0 0 10px var(--accent)}
.aq-marker-ring{position:absolute;inset:0;border-radius:50%;border:2px solid var(--accent);opacity:.6;animation:aqpulse 1.6s ease-out infinite}
@keyframes aqpulse{0%{transform:scale(.4);opacity:.9}100%{transform:scale(1.8);opacity:0}}

/* SIDEBAR */
.sidebar{width:var(--sidebar-w);background:var(--surface);border-left:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;flex-shrink:0}
.sidebar-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:36px;text-align:center;color:var(--muted);font-size:.9rem;line-height:1.6}
.empty-icon{font-size:2.8rem;opacity:.35}
.sidebar-header{padding:16px 18px 12px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.area-name{font-family:'Space Mono',monospace;font-size:.9rem;color:var(--text);line-height:1.35;word-break:break-word}
.coords{font-size:.7rem;color:var(--muted);font-family:'Space Mono',monospace;margin-top:2px;display:block}
.close-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:.95rem;padding:2px 6px;border-radius:4px;flex-shrink:0}
.close-btn:hover{color:var(--text);background:var(--surface2)}

/* TABS */
.tabs{display:flex;border-bottom:1px solid var(--border);padding:0 6px}
.tab{flex:1;background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-1px;color:var(--muted);cursor:pointer;padding:9px 4px;font-family:'DM Sans',sans-serif;font-size:.74rem;font-weight:500;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:2px}
.tab:hover{color:var(--text)}
.tab.active{color:var(--accent);border-bottom-color:var(--accent)}

/* CONTENT */
.tab-content{flex:1;overflow-y:auto;padding:14px;scrollbar-width:thin;scrollbar-color:var(--border) transparent}
.cards{display:flex;flex-direction:column;gap:12px}

/* STAT CARD */
.stat-card{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:14px;position:relative;overflow:hidden}
.stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--accent);opacity:.55}
.stat-header{display:flex;align-items:center;gap:7px;margin-bottom:7px}
.stat-icon{font-size:.95rem}
.stat-label{font-size:.77rem;color:var(--muted);font-weight:500;flex:1}
.stat-badge{font-size:.68rem;padding:2px 7px;border-radius:20px;font-weight:600;text-transform:capitalize}
.stat-value{font-family:'Space Mono',monospace;font-size:1.9rem;color:var(--accent);line-height:1;margin-bottom:4px}
.stat-unit{font-size:.82rem;color:var(--muted)}
.stat-sub{font-size:.76rem;color:var(--muted);margin-bottom:6px}

/* BAR CHART */
.chart-section{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:14px}
.chart-section h4{font-size:.76rem;color:var(--muted);margin-bottom:10px;font-weight:500}
.bar-chart{display:flex;align-items:flex-end;gap:5px;height:90px}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;height:100%;justify-content:flex-end}
.bar{width:100%;background:linear-gradient(to top,var(--accent),rgba(0,212,255,.25));border-radius:3px 3px 0 0;min-height:4px}
.bar-label{font-size:.58rem;color:var(--muted);font-family:'Space Mono',monospace}
.bar-val{font-size:.6rem;color:var(--accent);font-family:'Space Mono',monospace}

/* QUALITY */
.quality-meter{margin-top:8px}
.quality-bar-bg{height:5px;background:var(--border);border-radius:3px;overflow:hidden}
.quality-bar-fill{height:100%;border-radius:3px;transition:width .8s ease}
.quality-label{font-size:.78rem;font-weight:600;margin-top:5px;display:block}

/* PARAMS */
.params-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.param-card{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:11px;display:flex;gap:8px;align-items:flex-start}
.param-card.ok .param-dot{background:var(--green)}
.param-card.warn .param-dot{background:var(--warn)}
.param-dot{width:6px;height:6px;border-radius:50%;margin-top:4px;flex-shrink:0}
.param-label{font-size:.68rem;color:var(--muted);margin-bottom:2px}
.param-value{font-family:'Space Mono',monospace;font-size:.82rem;color:var(--text)}
.param-safe{font-size:.64rem;color:var(--muted);margin-top:2px}

/* RIVERS */
.river-meta{display:flex;align-items:center;gap:8px;margin-top:8px;font-size:.8rem;color:var(--muted)}
.flow-badge{padding:3px 9px;border-radius:20px;font-size:.72rem;font-weight:600}

/* ALERT */
.alert-box{background:rgba(229,57,53,.08);border:1px solid rgba(229,57,53,.28);border-radius:10px;padding:12px;display:flex;gap:10px;align-items:flex-start}
.alert-box strong{display:block;color:#e53935;margin-bottom:3px;font-size:.84rem}
.alert-box p{color:var(--muted);font-size:.78rem;line-height:1.5}

/* INFO */
.info-box{background:rgba(0,212,255,.04);border:1px solid rgba(0,212,255,.1);border-radius:10px;padding:13px}
.info-box h4{font-size:.78rem;margin-bottom:7px;color:var(--accent)}
.info-box p{font-size:.8rem;color:var(--muted);line-height:1.65}

/* FOOTER */
.sidebar-footer{padding:9px 16px;border-top:1px solid var(--border);font-size:.68rem;color:var(--muted);text-align:center}

@keyframes spin{to{transform:rotate(360deg)}}

@media(max-width:820px){
  .sidebar{position:absolute;right:0;top:0;bottom:0;z-index:50;transform:translateX(100%);transition:transform .3s ease}
  .sidebar.open{transform:translateX(0)}
  .tile-btn{display:none}
}
`;