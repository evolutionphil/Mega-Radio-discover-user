export default function Slide15Roadmap() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d12", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ bottom: "5vh", right: "5vw", width: "30vw", height: "30vw", borderRadius: "50%", background: "#ff4199", opacity: 0.04, filter: "blur(9vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "7vh 8vw" }}>
        <div style={{ marginBottom: "5vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>ROADMAP</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            12 months to category leadership
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Track line */}
          <div style={{ position: "relative", display: "flex", alignItems: "flex-start" }}>
            {/* Horizontal line */}
            <div style={{ position: "absolute", top: "2.2vh", left: "2vw", right: "2vw", height: "2px", background: "linear-gradient(90deg, #ff4199, rgba(255,255,255,0.15))" }} />

            {/* Quarters */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0", width: "100%" }}>
              {/* Q2 2025 */}
              <div style={{ padding: "0 1.5vw", paddingTop: "0" }}>
                <div style={{ width: "1.2vw", height: "1.2vw", borderRadius: "50%", background: "#ff4199", marginBottom: "2vh", position: "relative", zIndex: 2 }} />
                <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.1em", marginBottom: "1.5vh" }}>Q2 — 2025</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
                  <div style={{ padding: "1.5vh 1.5vw", background: "rgba(255,65,153,0.08)", border: "1px solid rgba(255,65,153,0.18)", borderRadius: "0.8vw", fontSize: "1.3vw", color: "#ffffff" }}>Samsung + LG live</div>
                  <div style={{ padding: "1.5vh 1.5vw", background: "rgba(255,65,153,0.08)", border: "1px solid rgba(255,65,153,0.18)", borderRadius: "0.8vw", fontSize: "1.3vw", color: "#ffffff" }}>50 languages</div>
                  <div style={{ padding: "1.5vh 1.5vw", background: "rgba(255,65,153,0.08)", border: "1px solid rgba(255,65,153,0.18)", borderRadius: "0.8vw", fontSize: "1.3vw", color: "#ffffff" }}>Auth & sync</div>
                </div>
              </div>

              {/* Q3 2025 */}
              <div style={{ padding: "0 1.5vw" }}>
                <div style={{ width: "1.2vw", height: "1.2vw", borderRadius: "50%", background: "#ff4199", opacity: 0.7, marginBottom: "2vh", position: "relative", zIndex: 2 }} />
                <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "rgba(255,65,153,0.7)", letterSpacing: "0.1em", marginBottom: "1.5vh" }}>Q3 — 2025</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
                  <div style={{ padding: "1.5vh 1.5vw", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.8vw", fontSize: "1.3vw", color: "#ffffff" }}>Apple TV launch</div>
                  <div style={{ padding: "1.5vh 1.5vw", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.8vw", fontSize: "1.3vw", color: "#ffffff" }}>Premium tier</div>
                  <div style={{ padding: "1.5vh 1.5vw", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.8vw", fontSize: "1.3vw", color: "#ffffff" }}>B2B hotel pilot</div>
                </div>
              </div>

              {/* Q4 2025 */}
              <div style={{ padding: "0 1.5vw" }}>
                <div style={{ width: "1.2vw", height: "1.2vw", borderRadius: "50%", background: "rgba(255,255,255,0.3)", marginBottom: "2vh", position: "relative", zIndex: 2 }} />
                <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: "1.5vh" }}>Q4 — 2025</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
                  <div style={{ padding: "1.5vh 1.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.8vw", fontSize: "1.3vw", color: "rgba(255,255,255,0.6)" }}>Android + Fire TV</div>
                  <div style={{ padding: "1.5vh 1.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.8vw", fontSize: "1.3vw", color: "rgba(255,255,255,0.6)" }}>Programmatic ads</div>
                  <div style={{ padding: "1.5vh 1.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.8vw", fontSize: "1.3vw", color: "rgba(255,255,255,0.6)" }}>Mobile companion</div>
                </div>
              </div>

              {/* Q1-Q2 2026 */}
              <div style={{ padding: "0 1.5vw" }}>
                <div style={{ width: "1.2vw", height: "1.2vw", borderRadius: "50%", background: "rgba(1,215,251,0.4)", marginBottom: "2vh", position: "relative", zIndex: 2 }} />
                <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "rgba(1,215,251,0.5)", letterSpacing: "0.1em", marginBottom: "1.5vh" }}>H1 — 2026</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
                  <div style={{ padding: "1.5vh 1.5vw", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "0.8vw", fontSize: "1.3vw", color: "rgba(255,255,255,0.4)" }}>Recommendation AI</div>
                  <div style={{ padding: "1.5vh 1.5vw", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "0.8vw", fontSize: "1.3vw", color: "rgba(255,255,255,0.4)" }}>Series A fundraise</div>
                  <div style={{ padding: "1.5vh 1.5vw", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "0.8vw", fontSize: "1.3vw", color: "rgba(255,255,255,0.4)" }}>OEM pre-installs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>15 / 18</span>
      </div>
    </div>
  );
}
