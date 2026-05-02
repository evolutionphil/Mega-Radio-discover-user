export default function Slide11Traction() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "5vh", left: "35vw", width: "28vw", height: "28vw", borderRadius: "50%", background: "#ff4199", opacity: 0.05, filter: "blur(8vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "6vh 7vw" }}>
        <div style={{ marginBottom: "4vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>TRACTION</div>
          <h2 style={{ fontSize: "3.8vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
            Already in production. <span style={{ color: "#ff4199" }}>Everywhere.</span>
          </h2>
          <p style={{ fontSize: "1.35vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: "1.5vh 0 0 0", maxWidth: "60vw" }}>
            This is not a slide deck for a roadmap. Every product on the previous pages is shipping today, downloadable from its respective store, used by listeners around the world.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1.5vw", marginBottom: "4vh" }}>
          <div style={{ textAlign: "center", padding: "3vh 1vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.2)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "4.5vw", fontWeight: 700, color: "#ff4199", lineHeight: 1, marginBottom: "1vh" }}>17</div>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Live platforms</div>
            <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.35)", marginTop: "0.5vh" }}>TV · Mobile · Wear · Auto · Desktop · Web</div>
          </div>
          <div style={{ textAlign: "center", padding: "3vh 1vw", background: "rgba(1,215,251,0.05)", border: "1px solid rgba(1,215,251,0.2)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "4.5vw", fontWeight: 700, color: "#01d7fb", lineHeight: 1, marginBottom: "1vh" }}>50K+</div>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Stations indexed</div>
            <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.35)", marginTop: "0.5vh" }}>AI-enriched, 24h refresh</div>
          </div>
          <div style={{ textAlign: "center", padding: "3vh 1vw", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "4.5vw", fontWeight: 700, color: "#ffffff", lineHeight: 1, marginBottom: "1vh" }}>238</div>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Countries served</div>
            <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.35)", marginTop: "0.5vh" }}>Geo-aware home screen</div>
          </div>
          <div style={{ textAlign: "center", padding: "3vh 1vw", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "4.5vw", fontWeight: 700, color: "#ffffff", lineHeight: 1, marginBottom: "1vh" }}>50</div>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>UI languages</div>
            <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.35)", marginTop: "0.5vh" }}>AI-translated copy</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
          <div style={{ fontSize: "1.05vw", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", marginBottom: "0.5vh" }}>SHIPPING TIMELINE</div>
          {[
            { q: "2024", c: "#ff4199", t: "Samsung Tizen + LG webOS launched globally · Catalog & AI enrichment online" },
            { q: "Q1 2025", c: "#ff4199", t: "Apple TV + Android TV + Fire TV live · iOS + Android + Galaxy + AppGallery shipped" },
            { q: "Q2 2025", c: "#ff4199", t: "watchOS + Wear OS + CarPlay + Android Auto live · macOS + Windows + Linux desktop apps" },
            { q: "Q2 2025", c: "#ff4199", t: "themegaradio.com web player + api.themegaradio.com public API live" },
            { q: "Q3 2025", c: "#01d7fb", t: "Premium subscription launch · social ecosystem rollout (follow, DM, taste matching)" },
            { q: "Q4 2025", c: "rgba(255,255,255,0.4)", t: "B2B white-label + first OEM pre-install partnerships" },
          ].map((m) => (
            <div key={m.t} style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
              <div style={{ fontSize: "1.2vw", color: m.c, fontWeight: 600, minWidth: "8vw" }}>{m.q}</div>
              <div style={{ flex: 1, height: "1px", background: m.c === "rgba(255,255,255,0.4)" ? "rgba(255,255,255,0.06)" : `${m.c}30` }} />
              <div style={{ fontSize: "1.3vw", color: m.c === "rgba(255,255,255,0.4)" ? "rgba(255,255,255,0.4)" : "#ffffff", flex: "0 1 auto" }}>{m.t}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>16 / 23</span>
      </div>
    </div>
  );
}
