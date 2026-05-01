export default function Slide11Traction() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d12", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "5vh", left: "35vw", width: "28vw", height: "28vw", borderRadius: "50%", background: "#ff4199", opacity: 0.05, filter: "blur(8vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "7vh 8vw" }}>
        <div style={{ marginBottom: "5vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>TRACTION</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Early signals across two live platforms
          </h2>
        </div>

        {/* Big stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "2vw", marginBottom: "4vh" }}>
          <div style={{ textAlign: "center", padding: "3vh 1.5vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.18)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "5vw", fontWeight: 700, color: "#ff4199", lineHeight: 1, marginBottom: "1vh" }}>2</div>
            <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)" }}>Live TV platforms</div>
          </div>
          <div style={{ textAlign: "center", padding: "3vh 1.5vw", background: "rgba(1,215,251,0.04)", border: "1px solid rgba(1,215,251,0.15)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "5vw", fontWeight: 700, color: "#01d7fb", lineHeight: 1, marginBottom: "1vh" }}>50K+</div>
            <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)" }}>Indexed stations</div>
          </div>
          <div style={{ textAlign: "center", padding: "3vh 1.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "5vw", fontWeight: 700, color: "#ffffff", lineHeight: 1, marginBottom: "1vh" }}>238</div>
            <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)" }}>Countries available</div>
          </div>
          <div style={{ textAlign: "center", padding: "3vh 1.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "5vw", fontWeight: 700, color: "#ffffff", lineHeight: 1, marginBottom: "1vh" }}>50</div>
            <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)" }}>UI languages</div>
          </div>
        </div>

        {/* Milestones */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh" }}>
          <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginBottom: "0.5vh" }}>MILESTONES</div>
          <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
            <div style={{ fontSize: "1.3vw", color: "#ff4199", fontWeight: 600, minWidth: "10vw" }}>Q1 2025</div>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,65,153,0.2)" }} />
            <div style={{ fontSize: "1.5vw", color: "#ffffff" }}>Samsung Tizen app deployed to Samsung Smart Hub globally</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
            <div style={{ fontSize: "1.3vw", color: "#ff4199", fontWeight: 600, minWidth: "10vw" }}>Q2 2025</div>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,65,153,0.2)" }} />
            <div style={{ fontSize: "1.5vw", color: "#ffffff" }}>LG webOS launch · 50 language localization complete</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
            <div style={{ fontSize: "1.3vw", color: "#ff4199", fontWeight: 600, minWidth: "10vw" }}>Q2 2025</div>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,65,153,0.2)" }} />
            <div style={{ fontSize: "1.5vw", color: "#ffffff" }}>Device-code OAuth auth system live · cross-device sync</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
            <div style={{ fontSize: "1.3vw", color: "#01d7fb", fontWeight: 600, minWidth: "10vw" }}>Q3 2025</div>
            <div style={{ flex: 1, height: "1px", background: "rgba(1,215,251,0.15)" }} />
            <div style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.6)" }}>Apple TV + Android TV · B2B pilot with first hotel chain</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.35)", fontWeight: 600, minWidth: "10vw" }}>Q4 2025</div>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.4)" }}>Premium subscription launch · programmatic ad inventory</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>11 / 18</span>
      </div>
    </div>
  );
}
