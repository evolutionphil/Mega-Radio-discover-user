const base = import.meta.env.BASE_URL;

export default function Slide04Product() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d12", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "10vh", right: "-5vw", width: "30vw", height: "30vw", borderRadius: "50%", background: "#ff4199", opacity: 0.05, filter: "blur(7vw)" }} />

      <div className="absolute inset-0 flex" style={{ zIndex: 10, padding: "7vh 7vw", gap: "5vw", alignItems: "center" }}>
        {/* Left: text */}
        <div style={{ width: "36vw", flexShrink: 0 }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>PRODUCT</div>
          <h2 style={{ fontSize: "3.8vw", fontWeight: 700, color: "#ffffff", margin: "0 0 3vh 0", lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Designed for the living room
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "0.35vw", height: "3vh", background: "#ff4199", borderRadius: "0.2vw", flexShrink: 0, marginTop: "0.5vh" }} />
              <div>
                <div style={{ fontSize: "1.65vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Remote-first navigation</div>
                <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.5)" }}>D-pad focus system works on all major TV platforms with no mouse or touch required.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "0.35vw", height: "3vh", background: "#01d7fb", borderRadius: "0.2vw", flexShrink: 0, marginTop: "0.5vh" }} />
              <div>
                <div style={{ fontSize: "1.65vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Smart discovery</div>
                <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.5)" }}>Browse by country, genre, language, or trending — with on-screen keyboard search.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "0.35vw", height: "3vh", background: "rgba(255,255,255,0.4)", borderRadius: "0.2vw", flexShrink: 0, marginTop: "0.5vh" }} />
              <div>
                <div style={{ fontSize: "1.65vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Ambient screensaver mode</div>
                <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.5)" }}>Album art, station info, and visualizer fill the screen when idle — no black screen.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.2vw", alignItems: "flex-start" }}>
              <div style={{ width: "0.35vw", height: "3vh", background: "#ff4199", borderRadius: "0.2vw", flexShrink: 0, marginTop: "0.5vh" }} />
              <div>
                <div style={{ fontSize: "1.65vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Mobile companion cast</div>
                <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.5)" }}>Control playback from your phone and cast to TV via QR or device code pairing.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: mock TV screen */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: "50vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.5vw", overflow: "hidden", boxShadow: "0 0 6vw rgba(255,65,153,0.12)" }}>
            {/* Fake TV bezel top */}
            <div style={{ height: "2vh", background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", paddingLeft: "1.5vw", gap: "0.4vw" }}>
              <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ff4199", opacity: 0.7 }} />
              <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.7 }} />
              <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
            </div>
            {/* Screen content mock */}
            <div style={{ padding: "3vh 3vw", background: "#111118", minHeight: "30vh" }}>
              <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "#ff4199", marginBottom: "1.5vh", letterSpacing: "0.1em" }}>NOW PLAYING</div>
              <div style={{ display: "flex", gap: "2vw", alignItems: "center", marginBottom: "2.5vh" }}>
                <div style={{ width: "8vw", height: "8vw", borderRadius: "1vw", background: "linear-gradient(135deg, #ff4199, #7b1fa2)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="3.5vw" height="3.5vw" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M9 18V5l12-2v13M9 9l12-2"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Radio Swiss Jazz</div>
                  <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.5)", marginBottom: "1vh" }}>Switzerland · Jazz</div>
                  <div style={{ display: "flex", gap: "0.5vw" }}>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                      <div key={i} style={{ width: "0.3vw", height: `${1 + Math.sin(i) * 1.2}vh`, background: "#ff4199", borderRadius: "0.2vw", opacity: 0.7 + (i % 3) * 0.1 }} />
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1vw" }}>
                {["Pop", "Rock", "Jazz", "Classical", "Electronic"].map(g => (
                  <div key={g} style={{ padding: "0.5vh 1vw", background: "rgba(255,65,153,0.1)", border: "1px solid rgba(255,65,153,0.2)", borderRadius: "2vw", fontSize: "1.1vw", color: "rgba(255,255,255,0.6)" }}>{g}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>4 / 18</span>
      </div>
    </div>
  );
}
