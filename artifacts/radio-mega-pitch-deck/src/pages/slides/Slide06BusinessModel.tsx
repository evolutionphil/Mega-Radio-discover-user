export default function Slide06BusinessModel() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "-5vh", left: "20vw", width: "30vw", height: "30vw", borderRadius: "50%", background: "#ff4199", opacity: 0.05, filter: "blur(8vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "7vh 8vw" }}>
        <div style={{ marginBottom: "5vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>BUSINESS MODEL</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Four revenue streams, one platform
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "2vw", flex: 1 }}>
          {/* Premium Subscription */}
          <div style={{ padding: "3vh 2.5vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.2)", borderRadius: "1.2vw", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "1.5vh" }}>
                <div style={{ fontSize: "1.6vw", fontWeight: 700, color: "#ff4199" }}>01 — Premium Subscription</div>
              </div>
              <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>Ad-free listening, offline favorites, early platform access. Individual and family plans.</div>
            </div>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff", marginTop: "1.5vh" }}>
              $4.99 / mo <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>· $39.99 / yr</span>
            </div>
          </div>

          {/* Advertising */}
          <div style={{ padding: "3vh 2.5vw", background: "rgba(1,215,251,0.04)", border: "1px solid rgba(1,215,251,0.15)", borderRadius: "1.2vw", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "1.6vw", fontWeight: 700, color: "#01d7fb", marginBottom: "1.5vh" }}>02 — Programmatic Advertising</div>
              <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>Audio + display ads served to free-tier users. CPM-based, geo-targeted, brand-safe inventory.</div>
            </div>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff", marginTop: "1.5vh" }}>
              $8–12 CPM <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>· Revenue share with stations</span>
            </div>
          </div>

          {/* B2B Licensing */}
          <div style={{ padding: "3vh 2.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.2vw", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "1.6vw", fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: "1.5vh" }}>03 — B2B Licensing</div>
              <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>White-label platform for hotels, airlines, and hospitality chains. Branded apps on their TV estate.</div>
            </div>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff", marginTop: "1.5vh" }}>
              $2K–15K / mo <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>· Per property</span>
            </div>
          </div>

          {/* Station Partnership */}
          <div style={{ padding: "3vh 2.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.2vw", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "1.6vw", fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: "1.5vh" }}>04 — Station Partnership</div>
              <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>Promoted placement, analytics dashboards, and verified station badges for broadcaster partners.</div>
            </div>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff", marginTop: "1.5vh" }}>
              $199–999 / mo <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>· Per station</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>13 / 23</span>
      </div>
    </div>
  );
}
