const base = import.meta.env.BASE_URL;

export default function Slide09Platforms() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d12", fontFamily: "'Ubuntu', sans-serif" }}>
      <img src={`${base}world-map.png`} crossOrigin="anonymous" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.15 }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(13,13,18,0.9) 0%, rgba(13,13,18,0.7) 100%)" }} />
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />

      <div className="absolute inset-0 flex flex-col justify-center items-center" style={{ zIndex: 10, textAlign: "center", padding: "7vh 10vw" }}>
        <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>GLOBAL REACH</div>
        <h2 style={{ fontSize: "4.5vw", fontWeight: 700, color: "#ffffff", margin: "0 0 2vh 0", lineHeight: 1.1, letterSpacing: "-0.025em" }}>
          238 countries. 50 languages.
        </h2>
        <p style={{ fontSize: "1.8vw", color: "rgba(255,255,255,0.5)", maxWidth: "50vw", lineHeight: 1.5, margin: "0 0 6vh 0" }}>
          Available on every major TV platform — already deployed to Samsung and LG, with Apple TV, Android TV, and Fire TV in active development.
        </p>

        {/* Platform cards */}
        <div style={{ display: "flex", gap: "2vw", justifyContent: "center", width: "100%" }}>
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,65,153,0.08)", border: "1px solid rgba(255,65,153,0.2)", borderRadius: "1.2vw", minWidth: "14vw", textAlign: "center" }}>
            <div style={{ fontSize: "2.2vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Samsung</div>
            <div style={{ fontSize: "1.2vw", color: "#ff4199", fontWeight: 600, marginBottom: "0.5vh" }}>LIVE</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)" }}>Tizen 4.0+</div>
          </div>
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,65,153,0.08)", border: "1px solid rgba(255,65,153,0.2)", borderRadius: "1.2vw", minWidth: "14vw", textAlign: "center" }}>
            <div style={{ fontSize: "2.2vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>LG</div>
            <div style={{ fontSize: "1.2vw", color: "#ff4199", fontWeight: 600, marginBottom: "0.5vh" }}>LIVE</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)" }}>webOS 4.0+</div>
          </div>
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.2vw", minWidth: "14vw", textAlign: "center" }}>
            <div style={{ fontSize: "2.2vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Apple TV</div>
            <div style={{ fontSize: "1.2vw", color: "#01d7fb", fontWeight: 600, marginBottom: "0.5vh" }}>Q3 2025</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)" }}>tvOS 15+</div>
          </div>
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.2vw", minWidth: "14vw", textAlign: "center" }}>
            <div style={{ fontSize: "2.2vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Android TV</div>
            <div style={{ fontSize: "1.2vw", color: "#01d7fb", fontWeight: 600, marginBottom: "0.5vh" }}>Q4 2025</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)" }}>Android 9+</div>
          </div>
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.2vw", minWidth: "14vw", textAlign: "center" }}>
            <div style={{ fontSize: "2.2vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Fire TV</div>
            <div style={{ fontSize: "1.2vw", color: "#01d7fb", fontWeight: 600, marginBottom: "0.5vh" }}>Q4 2025</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)" }}>Fire OS 6+</div>
          </div>
        </div>

        <div style={{ marginTop: "5vh", display: "flex", gap: "5vw", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4vw", fontWeight: 700, color: "#ff4199" }}>50K+</div>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)" }}>Radio stations</div>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff" }}>238</div>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)" }}>Countries covered</div>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4vw", fontWeight: 700, color: "#01d7fb" }}>50</div>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)" }}>UI languages</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>9 / 18</span>
      </div>
    </div>
  );
}
