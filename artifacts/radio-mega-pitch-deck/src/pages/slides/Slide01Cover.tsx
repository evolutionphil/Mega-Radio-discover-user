const base = import.meta.env.BASE_URL;

export default function Slide01Cover() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      {/* Hero background image */}
      <img
        src={`${base}hero-waves.png`}
        crossOrigin="anonymous"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.35 }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(13,13,18,0.85) 0%, rgba(13,13,18,0.55) 60%, rgba(255,65,153,0.08) 100%)" }} />

      {/* Grid texture */}
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />

      {/* Pink glow top-right */}
      <div className="absolute" style={{ top: "-10vh", right: "-5vw", width: "40vw", height: "40vw", borderRadius: "50%", background: "#ff4199", opacity: 0.08, filter: "blur(8vw)" }} />
      {/* Cyan glow bottom-left */}
      <div className="absolute" style={{ bottom: "-15vh", left: "-8vw", width: "35vw", height: "35vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.06, filter: "blur(8vw)" }} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center" style={{ zIndex: 10, textAlign: "center" }}>
        {/* Logo lockup */}
        <div className="flex items-center justify-center" style={{ marginBottom: "4vh", gap: "1.2vw" }}>
          <svg width="3.5vw" height="3.5vw" viewBox="0 0 40 40" fill="none">
            <path d="M8 34 L8 6 L20 20 L32 6 L32 34" stroke="#ff4199" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span style={{ fontSize: "2.2vw", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
            <span style={{ color: "#ff4199" }}>mega</span>radio
          </span>
        </div>

        {/* Main title */}
        <h1 style={{ fontSize: "6.5vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.05, letterSpacing: "-0.03em", textWrap: "balance" }}>
          Global Radio Streaming
        </h1>
        <h1 style={{ fontSize: "6.5vw", fontWeight: 700, margin: "0 0 3vh 0", lineHeight: 1.05, letterSpacing: "-0.03em", background: "linear-gradient(90deg, #ff4199, #01d7fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          for Every Screen
        </h1>

        <p style={{ fontSize: "1.9vw", color: "rgba(255,255,255,0.65)", maxWidth: "52vw", lineHeight: 1.5, margin: "0 0 5vh 0", textWrap: "balance" }}>
          50,000+ stations · 238 countries · Samsung, LG, Apple TV, Android TV
        </p>

        {/* Tag line chips */}
        <div style={{ display: "flex", gap: "1.5vw", justifyContent: "center" }}>
          <div style={{ padding: "0.8vh 1.6vw", background: "rgba(255,65,153,0.1)", border: "1px solid rgba(255,65,153,0.3)", borderRadius: "2vw", fontSize: "1.2vw", color: "#ff4199", fontWeight: 500 }}>
            Seed Round 2025
          </div>
          <div style={{ padding: "0.8vh 1.6vw", background: "rgba(1,215,251,0.08)", border: "1px solid rgba(1,215,251,0.25)", borderRadius: "2vw", fontSize: "1.2vw", color: "#01d7fb", fontWeight: 500 }}>
            themegaradio.com
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2.5vh 5vw", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>CONFIDENTIAL — INVESTOR PRESENTATION 2025</span>
        <span style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.35)" }}>1 / 23</span>
      </div>
    </div>
  );
}
