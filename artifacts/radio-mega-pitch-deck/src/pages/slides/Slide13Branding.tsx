export default function Slide13Branding() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "-5vh", right: "10vw", width: "30vw", height: "30vw", borderRadius: "50%", background: "#ff4199", opacity: 0.06, filter: "blur(8vw)" }} />
      <div className="absolute" style={{ bottom: "0", left: "0", width: "20vw", height: "20vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.05, filter: "blur(6vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "7vh 8vw" }}>
        <div style={{ marginBottom: "4vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>BRAND IDENTITY</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            A premium media brand for the living room era
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3vw", flex: 1 }}>
          {/* Logo & wordmark */}
          <div style={{ padding: "3vh 3vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.2vw", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginBottom: "3vh" }}>LOGO SYSTEM</div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3vh", justifyContent: "center" }}>
              {/* Full logo */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.2vw" }}>
                <svg width="4vw" height="4vw" viewBox="0 0 40 40" fill="none">
                  <path d="M8 34 L8 6 L20 20 L32 6 L32 34" stroke="#ff4199" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                <span style={{ fontSize: "2.8vw", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
                  <span style={{ color: "#ff4199" }}>mega</span>radio
                </span>
              </div>
              {/* Icon only */}
              <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
                <div style={{ width: "5vw", height: "5vw", background: "#ff4199", borderRadius: "1vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="3vw" height="3vw" viewBox="0 0 40 40" fill="none">
                    <path d="M8 34 L8 6 L20 20 L32 6 L32 34" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <div style={{ width: "5vw", height: "5vw", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="3vw" height="3vw" viewBox="0 0 40 40" fill="none">
                    <path d="M8 34 L8 6 L20 20 L32 6 L32 34" stroke="#ff4199" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.35)" }}>App icon variants</div>
              </div>
            </div>
          </div>

          {/* Color palette */}
          <div style={{ padding: "3vh 3vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginBottom: "3vh" }}>COLOR PALETTE</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
                <div style={{ width: "5vw", height: "3.5vh", background: "#ff4199", borderRadius: "0.5vw" }} />
                <div>
                  <div style={{ fontSize: "1.5vw", fontWeight: 600, color: "#ffffff" }}>Primary Pink</div>
                  <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>#FF4199</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
                <div style={{ width: "5vw", height: "3.5vh", background: "#01d7fb", borderRadius: "0.5vw" }} />
                <div>
                  <div style={{ fontSize: "1.5vw", fontWeight: 600, color: "#ffffff" }}>Accent Cyan</div>
                  <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>#01D7FB</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
                <div style={{ width: "5vw", height: "3.5vh", background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5vw" }} />
                <div>
                  <div style={{ fontSize: "1.5vw", fontWeight: 600, color: "#ffffff" }}>Background Dark</div>
                  <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>#0E0E0E</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
                <div style={{ width: "5vw", height: "3.5vh", background: "linear-gradient(135deg, #ff4199, #01d7fb)", borderRadius: "0.5vw" }} />
                <div>
                  <div style={{ fontSize: "1.5vw", fontWeight: 600, color: "#ffffff" }}>Gradient Brand</div>
                  <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>Pink → Cyan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div style={{ padding: "3vh 3vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginBottom: "2.5vh" }}>TYPOGRAPHY</div>
            <div>
              <div style={{ fontSize: "3.5vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh", letterSpacing: "-0.02em" }}>Ubuntu</div>
              <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.4)", marginBottom: "2vh" }}>Primary typeface — all weights</div>
              <div style={{ display: "flex", gap: "2vw" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff" }}>Bold</div>
                  <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)" }}>700</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2vw", fontWeight: 500, color: "#ffffff" }}>Medium</div>
                  <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)" }}>500</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2vw", fontWeight: 300, color: "#ffffff" }}>Light</div>
                  <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)" }}>300</div>
                </div>
              </div>
            </div>
          </div>

          {/* Brand voice */}
          <div style={{ padding: "3vh 3vw", background: "rgba(255,65,153,0.04)", border: "1px solid rgba(255,65,153,0.12)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginBottom: "2.5vh" }}>BRAND POSITION</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh" }}>
              <div style={{ fontSize: "1.8vw", fontWeight: 700, color: "#ff4199" }}>Premium — not mass market</div>
              <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>Radio Mega targets listeners who want a curated, high-quality experience — not a utility app with 10K genre checkboxes.</div>
              <div style={{ fontSize: "1.8vw", fontWeight: 700, color: "#ff4199", marginTop: "1vh" }}>Global — locally relevant</div>
              <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>50 UI languages, country-first browsing, region-specific recommendations.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>18 / 23</span>
      </div>
    </div>
  );
}
