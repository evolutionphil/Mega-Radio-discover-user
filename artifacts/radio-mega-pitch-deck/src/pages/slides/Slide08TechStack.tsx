export default function Slide08TechStack() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "0", left: "40vw", width: "25vw", height: "25vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.05, filter: "blur(8vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "7vh 8vw" }}>
        <div style={{ marginBottom: "4vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#01d7fb", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>TECHNOLOGY</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Purpose-built for every screen
          </h2>
        </div>

        {/* Tech rows */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2vw", flex: 1 }}>
          {/* Frontend */}
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,65,153,0.05)", border: "1px solid rgba(255,65,153,0.15)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.12em", marginBottom: "2vh" }}>FRONTEND</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>React + TypeScript</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>Core UI framework</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>Vite</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>Build tool</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>Tailwind CSS</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>Styling system</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>Wouter</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>Lightweight router</span>
              </div>
            </div>
          </div>

          {/* TV Platforms */}
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(1,215,251,0.04)", border: "1px solid rgba(1,215,251,0.15)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "#01d7fb", letterSpacing: "0.12em", marginBottom: "2vh" }}>TV PLATFORMS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>Samsung Tizen</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>Tizen 4.0+</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>LG webOS</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>webOS 4.0+</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>Apple TV</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>tvOS — Q3 2025</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>Android TV</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>Fire TV — Q4 2025</span>
              </div>
            </div>
          </div>

          {/* Backend */}
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", marginBottom: "2vh" }}>BACKEND</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>Node.js + Express</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>API server</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>PostgreSQL</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>Primary database</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>Stream proxy</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>Reliable playback</span>
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", marginBottom: "2vh" }}>DATA & API</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>Radio Browser API</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>50K+ stations</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>Drizzle ORM + Zod</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>Type-safe data layer</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5vw", color: "#ffffff", fontWeight: 500 }}>OAuth 2.0 Device Flow</span>
                <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>TV auth standard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>8 / 18</span>
      </div>
    </div>
  );
}
