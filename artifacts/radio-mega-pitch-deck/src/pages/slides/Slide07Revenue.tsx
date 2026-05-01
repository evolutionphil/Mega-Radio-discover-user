export default function Slide07Revenue() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d12", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "5vh", right: "5vw", width: "25vw", height: "25vw", borderRadius: "50%", background: "#ff4199", opacity: 0.06, filter: "blur(7vw)" }} />

      <div className="absolute inset-0 flex" style={{ zIndex: 10, padding: "7vh 8vw", gap: "6vw", alignItems: "center" }}>
        {/* Left */}
        <div style={{ width: "38vw" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>REVENUE PROJECTIONS</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: "0 0 4vh 0", lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Path to $10M ARR by Year 3
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "2vh", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <span style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.55)" }}>Year 1 (2026)</span>
              <span style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff" }}>$820K</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "2vh", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <span style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.55)" }}>Year 2 (2027)</span>
              <span style={{ fontSize: "2vw", fontWeight: 700, color: "#ff4199" }}>$3.4M</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.55)" }}>Year 3 (2028)</span>
              <span style={{ fontSize: "2vw", fontWeight: 700, color: "#01d7fb" }}>$10.1M</span>
            </div>
          </div>

          <div style={{ marginTop: "4vh", padding: "2vh 2.5vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.15)", borderRadius: "0.8vw" }}>
            <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)", marginBottom: "0.5vh" }}>Gross margin target</div>
            <div style={{ fontSize: "2.5vw", fontWeight: 700, color: "#ff4199" }}>72%</div>
          </div>
        </div>

        {/* Right: bar chart visualization */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)", marginBottom: "3vh", letterSpacing: "0.1em" }}>ARR GROWTH ($M)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "3vw", height: "40vh" }}>
            {/* Year 1 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5vh", flex: 1 }}>
              <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>$0.82M</div>
              <div style={{ width: "100%", height: "8%", background: "rgba(255,65,153,0.4)", borderRadius: "0.5vw 0.5vw 0 0", minHeight: "3vh" }} />
              <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.35)" }}>2026</div>
            </div>
            {/* Year 2 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5vh", flex: 1 }}>
              <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#ff4199" }}>$3.4M</div>
              <div style={{ width: "100%", height: "33%", background: "rgba(255,65,153,0.6)", borderRadius: "0.5vw 0.5vw 0 0" }} />
              <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.35)" }}>2027</div>
            </div>
            {/* Year 3 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5vh", flex: 1 }}>
              <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#ff4199" }}>$10.1M</div>
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(to top, #ff4199, rgba(255,65,153,0.5))", borderRadius: "0.5vw 0.5vw 0 0" }} />
              <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.35)" }}>2028</div>
            </div>
          </div>
          <div style={{ marginTop: "3vh", paddingTop: "2vh", borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: "1.2vw", color: "rgba(255,255,255,0.3)" }}>
            Projections based on 150K premium users Y1, 600K Y2, 1.8M Y3 — plus B2B and advertising revenue
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>7 / 18</span>
      </div>
    </div>
  );
}
