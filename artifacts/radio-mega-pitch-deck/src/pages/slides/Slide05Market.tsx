export default function Slide05Market() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ bottom: "-5vh", right: "10vw", width: "28vw", height: "28vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.05, filter: "blur(7vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "7vh 8vw" }}>
        <div style={{ marginBottom: "5vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#01d7fb", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>MARKET SIZE</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            A $50B+ addressable market growing at 15% per year
          </h2>
        </div>

        {/* Concentric TAM/SAM/SOM visual */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2.5vw", flex: 1, alignItems: "center" }}>
          <div style={{ textAlign: "center", padding: "3vh 2vw", background: "rgba(255,65,153,0.04)", border: "1px solid rgba(255,65,153,0.12)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1vw", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>TAM</div>
            <div style={{ fontSize: "6vw", fontWeight: 700, color: "#ff4199", lineHeight: 1, marginBottom: "1vh" }}>$52B</div>
            <div style={{ fontSize: "1.5vw", fontWeight: 600, color: "#ffffff", marginBottom: "1vh" }}>Global online audio</div>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>Streaming radio, podcasts, and live audio worldwide (2025 estimate)</div>
          </div>

          <div style={{ textAlign: "center", padding: "3vh 2vw", background: "rgba(1,215,251,0.04)", border: "1px solid rgba(1,215,251,0.15)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1vw", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>SAM</div>
            <div style={{ fontSize: "6vw", fontWeight: 700, color: "#01d7fb", lineHeight: 1, marginBottom: "1vh" }}>$14B</div>
            <div style={{ fontSize: "1.5vw", fontWeight: 600, color: "#ffffff", marginBottom: "1vh" }}>Smart TV audio</div>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>Radio and audio consumed via connected TV and OTT devices globally</div>
          </div>

          <div style={{ textAlign: "center", padding: "3vh 2vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1vw", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginBottom: "1.5vh" }}>SOM</div>
            <div style={{ fontSize: "6vw", fontWeight: 700, color: "rgba(255,255,255,0.85)", lineHeight: 1, marginBottom: "1vh" }}>$800M</div>
            <div style={{ fontSize: "1.5vw", fontWeight: 600, color: "#ffffff", marginBottom: "1vh" }}>5-year target</div>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>1% capture of SAM through premium + B2B channels by 2030</div>
          </div>
        </div>

        <div style={{ marginTop: "4vh", display: "flex", gap: "4vw" }}>
          <div>
            <span style={{ fontSize: "2vw", fontWeight: 700, color: "#ff4199" }}>1.2B</span>
            <span style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.45)", marginLeft: "0.8vw" }}>smart TVs in active use globally (2025)</span>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.08)" }} />
          <div>
            <span style={{ fontSize: "2vw", fontWeight: 700, color: "#01d7fb" }}>15%</span>
            <span style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.45)", marginLeft: "0.8vw" }}>CAGR online radio 2023-2028</span>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.08)" }} />
          <div>
            <span style={{ fontSize: "2vw", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>500M+</span>
            <span style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.45)", marginLeft: "0.8vw" }}>weekly radio listeners in Europe alone</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>5 / 18</span>
      </div>
    </div>
  );
}
