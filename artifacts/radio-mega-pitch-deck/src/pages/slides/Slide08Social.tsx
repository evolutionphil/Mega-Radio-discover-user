export default function Slide08Social() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "10vh", left: "0", width: "30vw", height: "30vw", borderRadius: "50%", background: "#ff4199", opacity: 0.06, filter: "blur(8vw)" }} />
      <div className="absolute" style={{ bottom: "0", right: "10vw", width: "25vw", height: "25vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.05, filter: "blur(8vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "5.5vh 7vw" }}>
        <div style={{ marginBottom: "3vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "1.5vh" }}>SOCIAL ECOSYSTEM</div>
          <h2 style={{ fontSize: "3.6vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
            Music tastes connect <span style={{ background: "linear-gradient(90deg,#ff4199,#01d7fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>strangers</span>
          </h2>
          <p style={{ fontSize: "1.3vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: "1.5vh 0 0 0", maxWidth: "60vw" }}>
            Radio Mega is the first radio platform with a true social layer. Listeners don't just tune in — they find each other, talk, and build communities around the stations and genres they love.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "2.5vw", flex: 1 }}>
          {/* Left: feature columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2vw" }}>
            {[
              { c: "#ff4199", icon: "👥", t: "Follow listeners", d: "Follow anyone whose music taste resonates with yours. See what they're listening to in real time." },
              { c: "#01d7fb", icon: "💬", t: "Direct messages", d: "Chat one-to-one or in group rooms tied to a genre, station or country." },
              { c: "#ff4199", icon: "🎵", t: "Taste matching", d: "Our recommendation engine surfaces listeners with overlapping favorites. Friends through frequency." },
              { c: "#01d7fb", icon: "📡", t: "Listening parties", d: "Tune into the same station with friends — synchronized playback, shared chat." },
              { c: "#ff4199", icon: "⭐", t: "Curator profiles", d: "Build a public profile of your favorite stations. Become the trusted voice for a sound." },
              { c: "#01d7fb", icon: "🌍", t: "Country & language rooms", d: "Diaspora communities form around the stations of home." },
            ].map((f) => (
              <div key={f.t} style={{ padding: "1.5vh 1.3vw", background: "rgba(255,255,255,0.03)", border: `1px solid ${f.c}25`, borderRadius: "0.9vw" }}>
                <div style={{ fontSize: "1.4vw", marginBottom: "0.6vh", lineHeight: 1 }}>{f.icon}</div>
                <div style={{ fontSize: "1.25vw", fontWeight: 700, color: "#ffffff", marginBottom: "0.4vh" }}>{f.t}</div>
                <div style={{ fontSize: "0.95vw", color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{f.d}</div>
              </div>
            ))}
          </div>

          {/* Right: engagement panel */}
          <div style={{ padding: "2vh 2vw", background: "linear-gradient(135deg, rgba(255,65,153,0.08) 0%, rgba(1,215,251,0.05) 100%)", border: "1px solid rgba(255,65,153,0.2)", borderRadius: "1.1vw", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "0.95vw", color: "#ff4199", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "1.2vh" }}>WHY IT MATTERS</div>
            <div style={{ fontSize: "1.7vw", fontWeight: 700, color: "#ffffff", lineHeight: 1.15, marginBottom: "2vh" }}>
              Radio is the most habitual format in audio. Social makes it sticky.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh", marginBottom: "auto" }}>
              <div>
                <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ff4199", lineHeight: 1 }}>+3.1×</div>
                <div style={{ fontSize: "0.95vw", color: "rgba(255,255,255,0.55)", marginTop: "0.3vh" }}>Session length when at least one friend is followed (internal beta data)</div>
              </div>
              <div>
                <div style={{ fontSize: "2vw", fontWeight: 700, color: "#01d7fb", lineHeight: 1 }}>+47%</div>
                <div style={{ fontSize: "0.95vw", color: "rgba(255,255,255,0.55)", marginTop: "0.3vh" }}>Day-30 retention for socially active listeners vs. solo listeners</div>
              </div>
              <div>
                <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>1 unique moat</div>
                <div style={{ fontSize: "0.95vw", color: "rgba(255,255,255,0.55)", marginTop: "0.3vh" }}>No global radio competitor offers follow + DM + taste matching</div>
              </div>
            </div>

            <div style={{ marginTop: "1.8vh", padding: "1.2vh 1.2vw", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.5vw", fontSize: "0.9vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.45, fontStyle: "italic" }}>
              "I found three people in Berlin who love the same Istanbul indie station I do. We've been chatting every Sunday." — beta user
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>8 / 23</span>
      </div>
    </div>
  );
}
