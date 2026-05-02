export default function Slide14Team() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "0", right: "15vw", width: "28vw", height: "28vw", borderRadius: "50%", background: "#ff4199", opacity: 0.05, filter: "blur(8vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "7vh 8vw" }}>
        <div style={{ marginBottom: "5vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>TEAM</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Built by operators who understand the living room
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2.5vw", flex: 1, alignItems: "start" }}>
          {/* Founder */}
          <div style={{ padding: "3vh 2.5vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.18)", borderRadius: "1.2vw" }}>
            <div style={{ width: "5vw", height: "5vw", borderRadius: "50%", background: "linear-gradient(135deg, #ff4199, #7b1fa2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2vh" }}>
              <svg width="2.5vw" height="2.5vw" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Founder & CEO</div>
            <div style={{ fontSize: "1.2vw", color: "#ff4199", marginBottom: "2vh", fontWeight: 500 }}>themegaradio.com</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1vh" }}>
              <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.6)" }}>Product vision, business development, platform partnerships</div>
            </div>
          </div>

          {/* Engineering */}
          <div style={{ padding: "3vh 2.5vw", background: "rgba(1,215,251,0.04)", border: "1px solid rgba(1,215,251,0.15)", borderRadius: "1.2vw" }}>
            <div style={{ width: "5vw", height: "5vw", borderRadius: "50%", background: "linear-gradient(135deg, #01d7fb, #0277bd)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2vh" }}>
              <svg width="2.5vw" height="2.5vw" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Lead Engineer</div>
            <div style={{ fontSize: "1.2vw", color: "#01d7fb", marginBottom: "2vh", fontWeight: 500 }}>Full-stack TV specialist</div>
            <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.6)" }}>Samsung Tizen, LG webOS, React, Node.js, multi-platform TV SDK expertise</div>
          </div>

          {/* Advisory */}
          <div style={{ padding: "3vh 2.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.2vw" }}>
            <div style={{ width: "5vw", height: "5vw", borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2vh" }}>
              <svg width="2.5vw" height="2.5vw" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>Advisory Board</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)", marginBottom: "2vh", fontWeight: 500 }}>Hiring Q3 2025</div>
            <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.6)" }}>Seeking advisors from broadcast media, OEM partnerships, and consumer subscription businesses</div>
          </div>
        </div>

        {/* Hiring banner */}
        <div style={{ marginTop: "4vh", padding: "2vh 3vw", background: "rgba(255,65,153,0.05)", border: "1px solid rgba(255,65,153,0.12)", borderRadius: "0.8vw", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.5vh" }}>We are hiring</div>
            <div style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.45)" }}>Senior React/TV engineer · Head of Partnerships · Content Operations Lead</div>
          </div>
          <div style={{ fontSize: "1.3vw", color: "#ff4199", fontWeight: 600 }}>careers@themegaradio.com</div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>19 / 23</span>
      </div>
    </div>
  );
}
