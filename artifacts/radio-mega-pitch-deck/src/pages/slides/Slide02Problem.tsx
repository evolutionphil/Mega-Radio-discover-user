export default function Slide02Problem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d12", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "-5vh", left: "30vw", width: "30vw", height: "30vw", borderRadius: "50%", background: "#ff4199", opacity: 0.05, filter: "blur(7vw)" }} />

      <div className="absolute inset-0 flex" style={{ zIndex: 10, padding: "8vh 8vw" }}>
        {/* Left: label + headline */}
        <div style={{ width: "44vw", display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "4vw" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2.5vh" }}>THE PROBLEM</div>
          <h2 style={{ fontSize: "4.2vw", fontWeight: 700, color: "#ffffff", margin: "0 0 3vh 0", lineHeight: 1.1, letterSpacing: "-0.025em", textWrap: "balance" }}>
            Radio listening on TV is a broken experience
          </h2>
          <p style={{ fontSize: "1.6vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
            85% of smart TVs ship with no dedicated radio app. Listeners are forced onto phones, laptops, or old-fashioned FM — while TV screens sit idle.
          </p>
        </div>

        {/* Right: pain points */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "2.5vh" }}>
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.2)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: 700, color: "#ff4199", marginBottom: "0.8vh" }}>No native TV radio apps</div>
            <div style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.55)" }}>Samsung Smart Hub and LG Content Store offer fewer than 3 radio apps globally, none with full station catalogs.</div>
          </div>
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.2)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: 700, color: "#ff4199", marginBottom: "0.8vh" }}>Fragmented discovery</div>
            <div style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.55)" }}>Listeners cannot browse by genre, country, or language. Finding a station requires knowing its exact name or frequency.</div>
          </div>
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.2)", borderRadius: "1.2vw" }}>
            <div style={{ fontSize: "1.8vw", fontWeight: 700, color: "#ff4199", marginBottom: "0.8vh" }}>No cross-device continuity</div>
            <div style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.55)" }}>Favorites, history, and preferences don't follow users from phone to TV — every session starts from scratch.</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>2 / 18</span>
      </div>
    </div>
  );
}
