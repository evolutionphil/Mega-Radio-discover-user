export default function Slide12UnitEconomics() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d12", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ bottom: "5vh", left: "5vw", width: "25vw", height: "25vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.05, filter: "blur(7vw)" }} />

      <div className="absolute inset-0 flex" style={{ zIndex: 10, padding: "7vh 8vw", gap: "6vw", alignItems: "center" }}>
        {/* Left */}
        <div style={{ width: "38vw" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#01d7fb", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>UNIT ECONOMICS</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: "0 0 4vh 0", lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Strong fundamentals from day one
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh" }}>
            <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.15)", borderRadius: "1vw" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.45)", marginBottom: "0.5vh" }}>Customer Acquisition Cost</div>
                  <div style={{ fontSize: "3vw", fontWeight: 700, color: "#ff4199" }}>$1.80</div>
                </div>
                <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.3)", textAlign: "right", lineHeight: 1.5 }}>Organic app store<br />discovery + TV pre-install</div>
              </div>
            </div>

            <div style={{ padding: "2.5vh 2.5vw", background: "rgba(1,215,251,0.04)", border: "1px solid rgba(1,215,251,0.12)", borderRadius: "1vw" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.45)", marginBottom: "0.5vh" }}>Lifetime Value (Premium)</div>
                  <div style={{ fontSize: "3vw", fontWeight: 700, color: "#01d7fb" }}>$38</div>
                </div>
                <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.3)", textAlign: "right", lineHeight: 1.5 }}>Based on 24-month<br />avg. subscription</div>
              </div>
            </div>

            <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1vw" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.45)", marginBottom: "0.5vh" }}>LTV / CAC Ratio</div>
                  <div style={{ fontSize: "3vw", fontWeight: 700, color: "#ffffff" }}>21x</div>
                </div>
                <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.3)" }}>Industry benchmark: 3x+</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: additional metrics */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3vh" }}>
          <div style={{ padding: "3vh 3vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)", marginBottom: "1.5vh" }}>MONTHLY ACTIVE RETENTION</div>
            <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
              <div style={{ flex: 1 }}>
                <div style={{ height: "1.5vh", background: "rgba(255,255,255,0.06)", borderRadius: "2vw", overflow: "hidden" }}>
                  <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg, #ff4199, rgba(255,65,153,0.6))", borderRadius: "2vw" }} />
                </div>
              </div>
              <div style={{ fontSize: "2.5vw", fontWeight: 700, color: "#ff4199", flexShrink: 0 }}>72%</div>
            </div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.3)", marginTop: "1vh" }}>30-day retention for premium subscribers — vs. 40-50% music streaming average</div>
          </div>

          <div style={{ padding: "3vh 3vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)", marginBottom: "1.5vh" }}>DAILY SESSION LENGTH</div>
            <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
              <div style={{ flex: 1 }}>
                <div style={{ height: "1.5vh", background: "rgba(255,255,255,0.06)", borderRadius: "2vw", overflow: "hidden" }}>
                  <div style={{ width: "85%", height: "100%", background: "linear-gradient(90deg, #01d7fb, rgba(1,215,251,0.5))", borderRadius: "2vw" }} />
                </div>
              </div>
              <div style={{ fontSize: "2.5vw", fontWeight: 700, color: "#01d7fb", flexShrink: 0 }}>2.4h</div>
            </div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.3)", marginTop: "1vh" }}>Average daily listening session on TV — radio is background media, driving long engagement</div>
          </div>

          <div style={{ padding: "3vh 3vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)", marginBottom: "1vh" }}>CHURN (projected monthly)</div>
            <div style={{ fontSize: "2.5vw", fontWeight: 700, color: "#ffffff" }}>3.8%</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.3)", marginTop: "0.5vh" }}>Radio listeners are habit-driven — lower churn than on-demand streaming</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>12 / 18</span>
      </div>
    </div>
  );
}
