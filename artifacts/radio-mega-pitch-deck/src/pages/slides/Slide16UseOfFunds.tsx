export default function Slide16UseOfFunds() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "0", left: "30vw", width: "30vw", height: "30vw", borderRadius: "50%", background: "#ff4199", opacity: 0.05, filter: "blur(9vw)" }} />

      <div className="absolute inset-0 flex" style={{ zIndex: 10, padding: "7vh 8vw", gap: "6vw", alignItems: "center" }}>
        {/* Left */}
        <div style={{ width: "36vw" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>USE OF FUNDS</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: "0 0 2vh 0", lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Raising $2.5M seed round
          </h2>
          <p style={{ fontSize: "1.6vw", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: "0 0 4vh 0" }}>
            18-month runway. Two live platforms today. Funding accelerates Apple TV, Android TV, B2B rollout, and premium launch.
          </p>
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.18)", borderRadius: "1vw" }}>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)", marginBottom: "0.5vh" }}>Target close</div>
            <div style={{ fontSize: "2.5vw", fontWeight: 700, color: "#ff4199" }}>Q3 2025</div>
          </div>
        </div>

        {/* Right: allocation */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2.5vh" }}>
          {[
            { label: "Engineering & Platform Development", percent: 40, color: "#ff4199", detail: "Apple TV, Android TV, Fire TV builds · backend scaling" },
            { label: "Sales & Partnerships", percent: 25, color: "#ff4199", detail: "OEM pre-install deals · B2B hospitality rollout · hotel pilot" },
            { label: "Marketing & UA", percent: 20, color: "rgba(255,65,153,0.6)", detail: "App store optimization · brand campaigns · influencer audio" },
            { label: "Operations & Headcount", percent: 10, color: "rgba(255,255,255,0.4)", detail: "Content ops · customer support · legal / finance" },
            { label: "Reserve", percent: 5, color: "rgba(255,255,255,0.2)", detail: "Working capital buffer" },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1vh" }}>
                <div>
                  <div style={{ fontSize: "1.5vw", fontWeight: 600, color: "#ffffff" }}>{item.label}</div>
                  <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)" }}>{item.detail}</div>
                </div>
                <div style={{ fontSize: "2.2vw", fontWeight: 700, color: item.color, marginLeft: "2vw", flexShrink: 0 }}>{item.percent}%</div>
              </div>
              <div style={{ height: "0.8vh", background: "rgba(255,255,255,0.06)", borderRadius: "2vw", overflow: "hidden" }}>
                <div style={{ width: `${item.percent}%`, height: "100%", background: item.color, borderRadius: "2vw" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>16 / 18</span>
      </div>
    </div>
  );
}
