export default function Slide09AI() {
  const pipeline = [
    { step: "01", color: "#ff4199", title: "Ingest", desc: "50K+ stations crawled continuously. Stream metadata, ICY tags, EPG, language hints, geo-IP." },
    { step: "02", color: "#01d7fb", title: "Enrich (AI)", desc: "LLM generates per-station bios, genre tags, mood profiles, recommended-for descriptors and SEO copy in 50 languages." },
    { step: "03", color: "#ff4199", title: "Index", desc: "Embeddings stored for vector search; structured tags pushed to MongoDB for filter queries; CDN cache warmed." },
    { step: "04", color: "#01d7fb", title: "Recommend", desc: "Per-user listening graph + station vectors → real-time recommendations on the home screen and Discover." },
    { step: "05", color: "#ffffff", title: "Refresh", desc: "Daily delta runs detect changed station fingerprints; AI re-writes copy and re-embeds. Catalog never stales." },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "0", right: "5vw", width: "35vw", height: "35vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.06, filter: "blur(10vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "6vh 7vw" }}>
        <div style={{ marginBottom: "3.5vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#01d7fb", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>AI CONTENT ENGINE</div>
          <h2 style={{ fontSize: "3.8vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
            Every station gets <span style={{ color: "#01d7fb" }}>its own story</span> — written by AI
          </h2>
          <p style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: "1.8vh 0 0 0", maxWidth: "62vw" }}>
            Most radio apps are just a list of URLs. We run a continuous AI pipeline that turns 50,000 streams into a discoverable, searchable, recommendation-ready catalog — in 50 languages.
          </p>
        </div>

        {/* Pipeline */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1vw", marginBottom: "4vh" }}>
          {pipeline.map((p, i) => (
            <div key={p.step} style={{ position: "relative" }}>
              <div style={{ padding: "2vh 1.2vw", background: "rgba(255,255,255,0.03)", border: `1px solid ${p.color === "#ffffff" ? "rgba(255,255,255,0.12)" : p.color + "30"}`, borderRadius: "0.9vw", height: "100%" }}>
                <div style={{ fontSize: "0.9vw", color: p.color, fontWeight: 700, letterSpacing: "0.15em", marginBottom: "0.8vh" }}>STEP {p.step}</div>
                <div style={{ fontSize: "1.6vw", fontWeight: 700, color: "#ffffff", marginBottom: "1.2vh" }}>{p.title}</div>
                <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.5)", lineHeight: 1.45 }}>{p.desc}</div>
              </div>
              {i < pipeline.length - 1 && (
                <div style={{ position: "absolute", top: "50%", right: "-0.8vw", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", fontSize: "1.5vw", zIndex: 5 }}>›</div>
              )}
            </div>
          ))}
        </div>

        {/* What AI generates */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "2vw", flex: 1 }}>
          <div style={{ padding: "2.5vh 2vw", background: "rgba(255,65,153,0.05)", border: "1px solid rgba(255,65,153,0.2)", borderRadius: "1vw" }}>
            <div style={{ fontSize: "1vw", color: "#ff4199", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "1.5vh" }}>WHAT AI WRITES — PER STATION</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2vh 1.5vw" }}>
              {[
                "Station bio (3–5 sentences)",
                "Genre & sub-genre tags",
                "Mood descriptors (chill, hype, focus…)",
                "\"Listen if you like…\" comparisons",
                "Recommended day-parts & contexts",
                "Multi-language SEO descriptions",
                "Auto-generated cover art prompts",
                "Country & language confidence scores",
              ].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.6vw", fontSize: "1.15vw", color: "rgba(255,255,255,0.75)" }}>
                  <span style={{ color: "#ff4199" }}>✓</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "2.5vh 2vw", background: "rgba(1,215,251,0.05)", border: "1px solid rgba(1,215,251,0.2)", borderRadius: "1vw", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "1vw", color: "#01d7fb", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "1.5vh" }}>SCALE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh" }}>
                <div>
                  <div style={{ fontSize: "2.2vw", fontWeight: 700, color: "#01d7fb", lineHeight: 1 }}>50,000+</div>
                  <div style={{ fontSize: "1.05vw", color: "rgba(255,255,255,0.55)" }}>stations enriched</div>
                </div>
                <div>
                  <div style={{ fontSize: "2.2vw", fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>50 languages</div>
                  <div style={{ fontSize: "1.05vw", color: "rgba(255,255,255,0.55)" }}>auto-generated copy</div>
                </div>
                <div>
                  <div style={{ fontSize: "2.2vw", fontWeight: 700, color: "#ff4199", lineHeight: 1 }}>24h refresh</div>
                  <div style={{ fontSize: "1.05vw", color: "rgba(255,255,255,0.55)" }}>full catalog re-index</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "1.5vh", padding: "1vh 1vw", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.5vw", fontSize: "0.85vw", color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>
              Models: GPT-class LLM · embeddings · classifiers for language & genre · diffusion for fallback artwork.
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>9 / 23</span>
      </div>
    </div>
  );
}
