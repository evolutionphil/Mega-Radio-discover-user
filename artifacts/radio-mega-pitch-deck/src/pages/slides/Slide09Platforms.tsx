export default function Slide09Platforms() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "5vh", left: "30vw", width: "30vw", height: "30vw", borderRadius: "50%", background: "#ff4199", opacity: 0.05, filter: "blur(9vw)" }} />
      <div className="absolute" style={{ bottom: "0", right: "0", width: "20vw", height: "20vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.04, filter: "blur(7vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "7vh 8vw" }}>
        <div style={{ marginBottom: "5vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>PLATFORM STRATEGY</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            TV first. Then everywhere.
          </h2>
        </div>

        {/* Three-phase strategy */}
        <div style={{ display: "flex", gap: "2.5vw", flex: 1, alignItems: "stretch" }}>
          {/* Phase 1: TV */}
          <div style={{ flex: 1, padding: "3vh 2.5vw", background: "rgba(255,65,153,0.07)", border: "1px solid rgba(255,65,153,0.22)", borderRadius: "1.2vw", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2vh" }}>
              <div style={{ width: "3vw", height: "3vw", background: "#ff4199", borderRadius: "0.7vw", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="1.8vw" height="1.8vw" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              </div>
              <div>
                <div style={{ fontSize: "1.1vw", color: "#ff4199", fontWeight: 700, letterSpacing: "0.1em" }}>PHASE 1 — NOW</div>
                <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff" }}>Smart TV</div>
              </div>
            </div>
            <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "2vh" }}>
              Own the largest screen in the home. Build the brand, grow the audience, establish OEM relationships. TV radio is habit — the daily listening session is 2.4 hours.
            </div>
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "1vh" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ff4199" }} />
                <span style={{ fontSize: "1.3vw", color: "#ffffff" }}>Samsung Tizen — LIVE</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#ff4199" }} />
                <span style={{ fontSize: "1.3vw", color: "#ffffff" }}>LG webOS — LIVE</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "rgba(255,65,153,0.5)" }} />
                <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.6)" }}>Apple TV — Q3 2025</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "rgba(255,65,153,0.5)" }} />
                <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.6)" }}>Android TV / Fire TV — Q4 2025</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <svg width="2.5vw" height="2.5vw" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>

          {/* Phase 2: Mobile */}
          <div style={{ flex: 1, padding: "3vh 2.5vw", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.2vw", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2vh" }}>
              <div style={{ width: "3vw", height: "3vw", background: "rgba(1,215,251,0.15)", border: "1px solid rgba(1,215,251,0.3)", borderRadius: "0.7vw", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="1.8vw" height="1.8vw" viewBox="0 0 24 24" fill="none" stroke="#01d7fb" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
              </div>
              <div>
                <div style={{ fontSize: "1.1vw", color: "#01d7fb", fontWeight: 700, letterSpacing: "0.1em" }}>PHASE 2 — 2025</div>
                <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff" }}>Mobile Companion</div>
              </div>
            </div>
            <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "2vh" }}>
              iOS and Android apps serve as remote controls for the TV — and as standalone listening clients on the go. The TV session drives mobile install; mobile drives premium conversion.
            </div>
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "1vh" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "rgba(1,215,251,0.4)" }} />
                <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.6)" }}>iOS — Q4 2025</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "rgba(1,215,251,0.4)" }} />
                <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.6)" }}>Android — Q4 2025</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)" }}>TV remote control via app</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)" }}>Cross-device favorites sync</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <svg width="2.5vw" height="2.5vw" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>

          {/* Phase 3: Web + B2B */}
          <div style={{ flex: 1, padding: "3vh 2.5vw", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.2vw", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2vh" }}>
              <div style={{ width: "3vw", height: "3vw", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.7vw", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="1.8vw" height="1.8vw" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20"/></svg>
              </div>
              <div>
                <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em" }}>PHASE 3 — 2026</div>
                <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff" }}>Web & B2B</div>
              </div>
            </div>
            <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "2vh" }}>
              Web player completes the cross-device story. B2B white-label SDK lets hotels, airlines, and broadcasters embed Radio Mega under their own brand.
            </div>
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "1vh" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)" }}>Progressive web app (PWA)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)" }}>Hotel & hospitality white-label</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)" }}>OEM pre-install partnerships</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <span style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.4)" }}>Broadcaster SDK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom summary bar */}
        <div style={{ marginTop: "3vh", padding: "2vh 2.5vw", background: "rgba(255,65,153,0.04)", border: "1px solid rgba(255,65,153,0.12)", borderRadius: "0.8vw", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ff4199" }}>2 platforms</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)" }}>Live today</div>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.06)", height: "5vh" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff" }}>5 TV platforms</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)" }}>By Q4 2025</div>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.06)", height: "5vh" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#01d7fb" }}>Mobile + Web</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)" }}>2025–2026</div>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.06)", height: "5vh" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>B2B white-label</div>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)" }}>2026</div>
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
