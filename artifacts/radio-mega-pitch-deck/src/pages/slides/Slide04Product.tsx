const base = import.meta.env.BASE_URL;

export default function Slide04Product() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "10vh", right: "-5vw", width: "30vw", height: "30vw", borderRadius: "50%", background: "#ff4199", opacity: 0.05, filter: "blur(7vw)" }} />

      <div className="absolute inset-0 flex" style={{ zIndex: 10, padding: "7vh 7vw", gap: "5vw", alignItems: "center" }}>
        {/* Left: text */}
        <div style={{ width: "34vw", flexShrink: 0 }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>PRODUCT</div>
          <h2 style={{ fontSize: "3.8vw", fontWeight: 700, color: "#ffffff", margin: "0 0 3vh 0", lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Designed for the living room
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "0.35vw", height: "3vh", background: "#ff4199", borderRadius: "0.2vw", flexShrink: 0, marginTop: "0.5vh" }} />
              <div>
                <div style={{ fontSize: "1.65vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Remote-first navigation</div>
                <div style={{ fontSize: "1.35vw", color: "rgba(255,255,255,0.5)" }}>D-pad focus system built for every major Smart TV platform.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "0.35vw", height: "3vh", background: "#01d7fb", borderRadius: "0.2vw", flexShrink: 0, marginTop: "0.5vh" }} />
              <div>
                <div style={{ fontSize: "1.65vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Smart discovery by country, genre & language</div>
                <div style={{ fontSize: "1.35vw", color: "rgba(255,255,255,0.5)" }}>Curated browsing across 50K+ stations from 238 countries.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "0.35vw", height: "3vh", background: "rgba(255,255,255,0.4)", borderRadius: "0.2vw", flexShrink: 0, marginTop: "0.5vh" }} />
              <div>
                <div style={{ fontSize: "1.65vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Ambient screensaver mode</div>
                <div style={{ fontSize: "1.35vw", color: "rgba(255,255,255,0.5)" }}>Station art and visualizer fill the screen when idle.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "0.35vw", height: "3vh", background: "#ff4199", borderRadius: "0.2vw", flexShrink: 0, marginTop: "0.5vh" }} />
              <div>
                <div style={{ fontSize: "1.65vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Device-code login & cross-device sync</div>
                <div style={{ fontSize: "1.35vw", color: "rgba(255,255,255,0.5)" }}>Scan a QR on your phone to log in — no TV keyboard needed.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: real product screenshots */}
        <div style={{ flex: 1, display: "flex", gap: "1.5vw", alignItems: "center", justifyContent: "center" }}>
          {/* Main screenshot */}
          <div style={{ flex: 2, borderRadius: "1vw", overflow: "hidden", boxShadow: "0 0 4vw rgba(255,65,153,0.2)", border: "1px solid rgba(255,65,153,0.2)" }}>
            <img src={`${base}screen-discover.jpg`} alt="Radio Mega discover screen" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          {/* Secondary screenshot stack */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5vw" }}>
            <div style={{ borderRadius: "0.8vw", overflow: "hidden", boxShadow: "0 0 2vw rgba(1,215,251,0.15)", border: "1px solid rgba(1,215,251,0.15)" }}>
              <img src={`${base}screen-genres.jpg`} alt="Radio Mega genres screen" style={{ width: "100%", display: "block" }} />
            </div>
            <div style={{ borderRadius: "0.8vw", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
              <img src={`${base}screen-settings.jpg`} alt="Radio Mega settings screen" style={{ width: "100%", display: "block" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>4 / 23</span>
      </div>
    </div>
  );
}
