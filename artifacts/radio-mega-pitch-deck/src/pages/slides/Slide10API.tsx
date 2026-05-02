export default function Slide10API() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "0", left: "20vw", width: "35vw", height: "35vw", borderRadius: "50%", background: "#ff4199", opacity: 0.06, filter: "blur(9vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "5vh 6.5vw" }}>
        <div style={{ marginBottom: "2.5vh" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2vh" }}>
            <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase" }}>DEVELOPER PLATFORM</div>
            <div style={{ padding: "0.4vh 1vw", background: "rgba(1,215,251,0.1)", border: "1px solid rgba(1,215,251,0.3)", borderRadius: "1vw", fontSize: "0.9vw", color: "#01d7fb", fontWeight: 700, letterSpacing: "0.1em" }}>api.themegaradio.com</div>
          </div>
          <h2 style={{ fontSize: "3.4vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
            A public API anyone can build on
          </h2>
          <p style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: "1.2vh 0 0 0", maxWidth: "62vw" }}>
            We open the same data layer that powers our 17 apps to third-party developers, hardware makers, broadcasters and hobbyists. The Radio Mega catalog becomes infrastructure for the whole industry.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "2vw", flex: 1 }}>
          {/* Left: code sample */}
          <div style={{ padding: "2vh 0", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1vw", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6vw", padding: "0 1.5vw 1.5vh 1.5vw", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "1.5vh" }}>
              <div style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#ff5f56" }} />
              <div style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: "0.8vw", height: "0.8vw", borderRadius: "50%", background: "#27c93f" }} />
              <div style={{ marginLeft: "1vw", fontSize: "0.95vw", color: "rgba(255,255,255,0.45)", fontFamily: "'Courier New', monospace" }}>curl — search stations</div>
            </div>
            <pre style={{ margin: 0, padding: "0 1.8vw", fontFamily: "'Courier New', monospace", fontSize: "1.05vw", color: "#ffffff", lineHeight: 1.6, overflow: "hidden", whiteSpace: "pre-wrap" }}>
<span style={{ color: "#01d7fb" }}>GET</span> https://api.themegaradio.com/v1/stations
   ?<span style={{ color: "#ff4199" }}>country</span>=TR
   &<span style={{ color: "#ff4199" }}>genre</span>=jazz
   &<span style={{ color: "#ff4199" }}>limit</span>=20

<span style={{ color: "rgba(255,255,255,0.4)" }}>{`{`}</span>
  <span style={{ color: "#01d7fb" }}>"stations"</span>: [
    {`{`}
      <span style={{ color: "#01d7fb" }}>"id"</span>: <span style={{ color: "#a5f3a1" }}>"rm-tr-jazz-001"</span>,
      <span style={{ color: "#01d7fb" }}>"name"</span>: <span style={{ color: "#a5f3a1" }}>"Radio Jazz Istanbul"</span>,
      <span style={{ color: "#01d7fb" }}>"stream"</span>: <span style={{ color: "#a5f3a1" }}>"https://stream.../live.m3u8"</span>,
      <span style={{ color: "#01d7fb" }}>"genres"</span>: [<span style={{ color: "#a5f3a1" }}>"jazz"</span>, <span style={{ color: "#a5f3a1" }}>"smooth-jazz"</span>],
      <span style={{ color: "#01d7fb" }}>"bio"</span>: <span style={{ color: "#a5f3a1" }}>"Smooth jazz from the Bosphorus..."</span>,
      <span style={{ color: "#01d7fb" }}>"country"</span>: <span style={{ color: "#a5f3a1" }}>"TR"</span>,
      <span style={{ color: "#01d7fb" }}>"language"</span>: <span style={{ color: "#a5f3a1" }}>"tr"</span>
    {`}`}
  ]
<span style={{ color: "rgba(255,255,255,0.4)" }}>{`}`}</span>
            </pre>
          </div>

          {/* Right: endpoints + use cases */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5vw" }}>
            <div style={{ padding: "2vh 1.8vw", background: "rgba(255,65,153,0.05)", border: "1px solid rgba(255,65,153,0.2)", borderRadius: "1vw" }}>
              <div style={{ fontSize: "1vw", color: "#ff4199", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "1.5vh" }}>CORE ENDPOINTS</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8vh 1.2vw", fontFamily: "'Courier New', monospace", fontSize: "1.05vw", color: "rgba(255,255,255,0.75)" }}>
                <div>/v1/stations</div>
                <div>/v1/search</div>
                <div>/v1/genres</div>
                <div>/v1/countries</div>
                <div>/v1/recommend</div>
                <div>/v1/now-playing</div>
                <div>/v1/stations/:id</div>
                <div>/v1/users/:id/feed</div>
              </div>
            </div>

            <div style={{ padding: "2vh 1.8vw", background: "rgba(1,215,251,0.05)", border: "1px solid rgba(1,215,251,0.2)", borderRadius: "1vw" }}>
              <div style={{ fontSize: "1vw", color: "#01d7fb", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "1.5vh" }}>WHAT DEVELOPERS BUILD</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1vh" }}>
                {[
                  { t: "IoT & smart speakers", d: "Sonos modules, Raspberry Pi radios, Home Assistant" },
                  { t: "Custom dashboards", d: "Hotels, gyms, restaurants — branded radio control" },
                  { t: "Browser extensions", d: "Background station player for the workday" },
                  { t: "Discord/Telegram bots", d: "Tune into a station inside any community" },
                ].map((u) => (
                  <div key={u.t} style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "1.15vw", color: "#ffffff", fontWeight: 600 }}>{u.t}</span>
                    <span style={{ fontSize: "0.95vw", color: "rgba(255,255,255,0.45)" }}>{u.d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "1.2vh 1.4vw", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.8vw", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1vw", textAlign: "center" }}>
              <div>
                <div style={{ fontSize: "1.15vw", fontWeight: 700, color: "#ffffff" }}>OpenAPI 3.1</div>
                <div style={{ fontSize: "0.8vw", color: "rgba(255,255,255,0.4)" }}>Spec + SDKs</div>
              </div>
              <div>
                <div style={{ fontSize: "1.15vw", fontWeight: 700, color: "#ffffff" }}>OAuth 2.0</div>
                <div style={{ fontSize: "0.8vw", color: "rgba(255,255,255,0.4)" }}>Auth flows</div>
              </div>
              <div>
                <div style={{ fontSize: "1.15vw", fontWeight: 700, color: "#ffffff" }}>Free tier</div>
                <div style={{ fontSize: "0.8vw", color: "rgba(255,255,255,0.4)" }}>Then paid plans</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>10 / 23</span>
      </div>
    </div>
  );
}
