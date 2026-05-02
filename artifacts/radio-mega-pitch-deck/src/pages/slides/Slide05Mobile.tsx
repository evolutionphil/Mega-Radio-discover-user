const base = import.meta.env.BASE_URL;

export default function Slide05Mobile() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "-5vh", left: "-5vw", width: "35vw", height: "35vw", borderRadius: "50%", background: "#ff4199", opacity: 0.07, filter: "blur(9vw)" }} />
      <div className="absolute" style={{ bottom: "-10vh", right: "-5vw", width: "30vw", height: "30vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.05, filter: "blur(8vw)" }} />

      <div className="absolute inset-0 flex" style={{ zIndex: 10, padding: "7vh 7vw", gap: "5vw", alignItems: "center" }}>
        {/* Left: copy + features */}
        <div style={{ width: "42vw", flexShrink: 0 }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>MOBILE EXPERIENCE</div>
          <h2 style={{ fontSize: "3.6vw", fontWeight: 700, color: "#ffffff", margin: "0 0 2.5vh 0", lineHeight: 1.05, letterSpacing: "-0.025em" }}>
            Radio you carry,<br />
            <span style={{ background: "linear-gradient(90deg,#ff4199 0%,#01d7fb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>everywhere you go</span>
          </h2>
          <p style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.55, margin: "0 0 3.5vh 0" }}>
            Native iOS and Android apps built in React Native with native modules for low-latency audio. Same catalog, same favorites, same account — synced across every device.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.8vh 1.5vw" }}>
            {[
              { c: "#ff4199", t: "Native player", d: "Background audio, lock-screen controls, AirPlay & Cast" },
              { c: "#01d7fb", t: "Smart search", d: "Find any of 50K+ stations in milliseconds" },
              { c: "#ff4199", t: "Favorites & history", d: "One tap to save, infinite recall across devices" },
              { c: "#01d7fb", t: "Live equalizer", d: "10-band EQ with presets per genre" },
              { c: "#ff4199", t: "Now-playing artwork", d: "Auto-fetched album art and metadata" },
              { c: "#01d7fb", t: "Sleep timer", d: "Drift off to your favorite station" },
            ].map((f) => (
              <div key={f.t} style={{ display: "flex", gap: "1vw", alignItems: "flex-start" }}>
                <div style={{ width: "0.35vw", height: "3vh", background: f.c, borderRadius: "0.2vw", flexShrink: 0, marginTop: "0.4vh" }} />
                <div>
                  <div style={{ fontSize: "1.3vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.2vh" }}>{f.t}</div>
                  <div style={{ fontSize: "1.05vw", color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{f.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3.5vh", display: "flex", gap: "1vw", alignItems: "center" }}>
            <div style={{ padding: "1vh 1.4vw", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.6vw", fontSize: "1.1vw", color: "#ffffff", fontWeight: 600 }}>App Store</div>
            <div style={{ padding: "1vh 1.4vw", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.6vw", fontSize: "1.1vw", color: "#ffffff", fontWeight: 600 }}>Google Play</div>
            <div style={{ padding: "1vh 1.4vw", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.6vw", fontSize: "1.1vw", color: "#ffffff", fontWeight: 600 }}>Galaxy Store</div>
            <div style={{ padding: "1vh 1.4vw", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.6vw", fontSize: "1.1vw", color: "#ffffff", fontWeight: 600 }}>AppGallery</div>
          </div>
        </div>

        {/* Right: behance mobile mockups */}
        <div style={{ flex: 1, position: "relative", height: "78vh", borderRadius: "1.5vw", overflow: "hidden", border: "1px solid rgba(255,65,153,0.18)", boxShadow: "0 0 5vw rgba(255,65,153,0.18)" }}>
          <img
            src={`${base}behance-mobile.jpg`}
            alt="Radio Mega mobile app design"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center bottom", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,14,14,0.4) 0%, rgba(14,14,14,0) 30%, rgba(14,14,14,0) 70%, rgba(14,14,14,0.6) 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "2vh", left: "2vh", padding: "0.8vh 1.2vw", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,65,153,0.3)", borderRadius: "0.5vw", fontSize: "1vw", color: "#ff4199", fontWeight: 700, letterSpacing: "0.1em" }}>iOS · ANDROID</div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>5 / 23</span>
      </div>
    </div>
  );
}
