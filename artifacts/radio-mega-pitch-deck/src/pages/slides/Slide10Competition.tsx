export default function Slide10Competition() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ bottom: "0", right: "0", width: "30vw", height: "30vw", borderRadius: "50%", background: "#ff4199", opacity: 0.05, filter: "blur(8vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "6vh 7vw" }}>
        <div style={{ marginBottom: "3vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>COMPETITIVE LANDSCAPE</div>
          <h2 style={{ fontSize: "3.8vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
            No global alternative. <span style={{ color: "#ff4199" }}>Anywhere.</span>
          </h2>
          <p style={{ fontSize: "1.35vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: "1.5vh 0 0 0", maxWidth: "60vw" }}>
            We searched. There is no other product on Earth that brings tens of thousands of radios together across 17 native platforms with social features and a public API. Closest peers are partial point solutions.
          </p>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.9fr 0.8fr 0.8fr 0.8fr 0.8fr", gap: "0.8vw", padding: "1.2vh 0", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "1vh" }}>
            <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.1em" }}>FEATURE</div>
            <div style={{ fontSize: "1vw", color: "#ff4199", fontWeight: 700, textAlign: "center", letterSpacing: "0.05em" }}>Radio Mega</div>
            <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>TuneIn</div>
            <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>iHeart</div>
            <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>Spotify</div>
            <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>Radio Garden</div>
          </div>

          {[
            { feature: "Native Smart TV apps (Tizen + webOS)", rm: true, ti: "P", ih: false, sp: false, rg: false },
            { feature: "Apple TV + Android TV + Fire TV", rm: true, ti: false, ih: false, sp: false, rg: false },
            { feature: "iOS + Android + Galaxy + Huawei", rm: true, ti: "P", ih: "P", sp: "P", rg: "P" },
            { feature: "watchOS + Wear OS", rm: true, ti: false, ih: false, sp: "P", rg: false },
            { feature: "CarPlay + Android Auto", rm: true, ti: true, ih: true, sp: true, rg: false },
            { feature: "macOS + Windows + Linux native", rm: true, ti: false, ih: false, sp: "P", rg: false },
            { feature: "50K+ stations, 238 countries", rm: true, ti: true, ih: false, sp: false, rg: true },
            { feature: "AI per-station bios & recommend", rm: true, ti: false, ih: false, sp: "P", rg: false },
            { feature: "Social: follow, DM, taste matching", rm: true, ti: false, ih: false, sp: "P", rg: false },
            { feature: "Public API for developers", rm: true, ti: false, ih: false, sp: true, rg: false },
            { feature: "Free tier + premium subscription", rm: true, ti: true, ih: true, sp: true, rg: true },
          ].map((row, i) => (
            <div key={row.feature} style={{ display: "grid", gridTemplateColumns: "1.6fr 0.9fr 0.8fr 0.8fr 0.8fr 0.8fr", gap: "0.8vw", padding: "1vh 0", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
              <div style={{ fontSize: "1.15vw", color: "rgba(255,255,255,0.7)" }}>{row.feature}</div>
              {[row.rm, row.ti, row.ih, row.sp, row.rg].map((val, idx) => (
                <div key={idx} style={{ textAlign: "center" }}>
                  {val === true
                    ? <span style={{ fontSize: "1.3vw", color: idx === 0 ? "#ff4199" : "#01d7fb" }}>✓</span>
                    : val === "P"
                    ? <span style={{ fontSize: "0.9vw", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>partial</span>
                    : <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.18)" }}>—</span>
                  }
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2vh", padding: "1.8vh 2vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.2)", borderRadius: "0.8vw", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2vw" }}>
          <p style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.4 }}>
            <span style={{ color: "#ff4199", fontWeight: 700 }}>Radio Mega is the only product</span> combining 17-platform reach, AI catalog, social graph and a public developer API in one place.
          </p>
          <div style={{ flexShrink: 0, padding: "0.8vh 1.4vw", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,65,153,0.3)", borderRadius: "0.5vw", fontSize: "1.1vw", color: "#ff4199", fontWeight: 700, letterSpacing: "0.1em" }}>CATEGORY OF ONE</div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>12 / 23</span>
      </div>
    </div>
  );
}
