export default function Slide10Competition() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ bottom: "0", right: "0", width: "30vw", height: "30vw", borderRadius: "50%", background: "#ff4199", opacity: 0.05, filter: "blur(8vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "7vh 8vw" }}>
        <div style={{ marginBottom: "4vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>COMPETITIVE LANDSCAPE</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            No direct competitor owns the TV screen
          </h2>
        </div>

        {/* Comparison table */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: "1vw", padding: "1.5vh 0", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "1.5vh" }}>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>FEATURE</div>
            <div style={{ fontSize: "1.1vw", color: "#ff4199", fontWeight: 700, textAlign: "center" }}>Radio Mega</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>TuneIn</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>iHeart</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>Spotify</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>FM Radio</div>
          </div>

          {[
            { feature: "Native Smart TV app", rm: true, ti: true, ih: false, sp: false, fm: false },
            { feature: "Full TV remote navigation", rm: true, ti: false, ih: false, sp: false, fm: false },
            { feature: "50K+ stations", rm: true, ti: true, ih: false, sp: false, fm: false },
            { feature: "238-country catalog", rm: true, ti: false, ih: false, sp: false, fm: false },
            { feature: "Free tier available", rm: true, ti: true, ih: true, sp: true, fm: true },
            { feature: "Cross-device sync", rm: true, ti: true, ih: true, sp: true, fm: false },
            { feature: "Ambient TV mode", rm: true, ti: false, ih: false, sp: false, fm: false },
            { feature: "B2B / white-label", rm: true, ti: false, ih: false, sp: false, fm: false },
          ].map((row, i) => (
            <div key={row.feature} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: "1vw", padding: "1.4vh 0", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
              <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.65)" }}>{row.feature}</div>
              {[row.rm, row.ti, row.ih, row.sp, row.fm].map((val, idx) => (
                <div key={idx} style={{ textAlign: "center" }}>
                  {val
                    ? <span style={{ fontSize: "1.5vw", color: idx === 0 ? "#ff4199" : "#01d7fb" }}>✓</span>
                    : <span style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.2)" }}>—</span>
                  }
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3vh", padding: "2vh 2.5vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.15)", borderRadius: "0.8vw" }}>
          <p style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.6)", margin: 0 }}>
            Radio Mega is the only platform combining native TV remote UX, a full global station catalog, ambient mode, and B2B white-label — in one product.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>10 / 18</span>
      </div>
    </div>
  );
}
