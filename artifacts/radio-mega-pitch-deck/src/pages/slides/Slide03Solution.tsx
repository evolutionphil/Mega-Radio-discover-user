export default function Slide03Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ bottom: "-10vh", right: "-5vw", width: "35vw", height: "35vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.05, filter: "blur(8vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "7vh 8vw" }}>
        <div style={{ marginBottom: "5vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#01d7fb", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>THE SOLUTION</div>
          <h2 style={{ fontSize: "4.2vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            One app. Every screen. Every station.
          </h2>
        </div>

        {/* Three pillars */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2.5vw", flex: 1, alignItems: "start" }}>
          <div style={{ padding: "3vh 2.5vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.18)", borderRadius: "1.2vw", height: "fit-content" }}>
            <div style={{ width: "3.5vw", height: "3.5vw", borderRadius: "0.8vw", background: "rgba(255,65,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2vh" }}>
              <svg width="1.8vw" height="1.8vw" viewBox="0 0 24 24" fill="none" stroke="#ff4199" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
            </div>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff", marginBottom: "1.5vh" }}>Native TV Apps</div>
            <div style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>Purpose-built for Samsung Tizen and LG webOS — remote-first navigation, 10-foot UI, ambient mode.</div>
          </div>

          <div style={{ padding: "3vh 2.5vw", background: "rgba(1,215,251,0.05)", border: "1px solid rgba(1,215,251,0.18)", borderRadius: "1.2vw", height: "fit-content" }}>
            <div style={{ width: "3.5vw", height: "3.5vw", borderRadius: "0.8vw", background: "rgba(1,215,251,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2vh" }}>
              <svg width="1.8vw" height="1.8vw" viewBox="0 0 24 24" fill="none" stroke="#01d7fb" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>
              </svg>
            </div>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff", marginBottom: "1.5vh" }}>50,000+ Stations</div>
            <div style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>Curated catalog across 238 countries, 50 languages, organized by genre, mood, and location.</div>
          </div>

          <div style={{ padding: "3vh 2.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.2vw", height: "fit-content" }}>
            <div style={{ width: "3.5vw", height: "3.5vw", borderRadius: "0.8vw", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2vh" }}>
              <svg width="1.8vw" height="1.8vw" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff", marginBottom: "1.5vh" }}>Cross-Device Sync</div>
            <div style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>Favorites, history, and preferences follow users from TV to mobile to web — one account, every device.</div>
          </div>
        </div>

        {/* Bottom callout */}
        <div style={{ marginTop: "4vh", padding: "2vh 3vw", background: "linear-gradient(90deg, rgba(255,65,153,0.08), rgba(1,215,251,0.05))", border: "1px solid rgba(255,65,153,0.15)", borderRadius: "0.8vw", display: "flex", alignItems: "center", gap: "1.5vw" }}>
          <div style={{ width: "0.3vw", height: "4vh", background: "linear-gradient(#ff4199, #01d7fb)", borderRadius: "0.3vw", flexShrink: 0 }} />
          <p style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.5 }}>
            Radio Mega is the first multi-platform streaming app built exclusively for the living room — designed from the ground up for TV remote navigation and large-screen consumption.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>3 / 23</span>
      </div>
    </div>
  );
}
