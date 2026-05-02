export default function Slide08TechStack() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "0", left: "40vw", width: "30vw", height: "30vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.05, filter: "blur(8vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "6vh 7vw" }}>
        <div style={{ marginBottom: "3.5vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#01d7fb", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>TECHNOLOGY STACK</div>
          <h2 style={{ fontSize: "3.8vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
            One product. Every platform. <span style={{ color: "#01d7fb" }}>Real engineering.</span>
          </h2>
          <p style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: "1.5vh 0 0 0", maxWidth: "62vw" }}>
            Polyglot codebase: shared logic in JavaScript/TypeScript and React Native, native modules in Swift, Kotlin, C++ where the platform demands it. MongoDB for catalog, AWS for delivery, Cloudflare for the edge.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5vw", flex: 1 }}>
          {/* Apps & Frontend */}
          <div style={{ padding: "2.2vh 1.6vw", background: "rgba(255,65,153,0.05)", border: "1px solid rgba(255,65,153,0.18)", borderRadius: "1vw" }}>
            <div style={{ fontSize: "0.95vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.15em", marginBottom: "1.8vh" }}>APPS & CLIENTS</div>
            {[
              { n: "React Native", d: "iOS, Android, mobile core" },
              { n: "Swift / Objective-C", d: "Native iOS, watchOS, tvOS, CarPlay" },
              { n: "Kotlin / Java", d: "Android, Wear OS, Android Auto, Android TV" },
              { n: "React + Vite", d: "Web (themegaradio.com), Tizen, webOS" },
              { n: "Electron / Tauri", d: "macOS, Windows, Linux" },
              { n: "TypeScript", d: "Shared types end-to-end" },
            ].map((t) => (
              <div key={t.n} style={{ marginBottom: "1.1vh" }}>
                <div style={{ fontSize: "1.25vw", color: "#ffffff", fontWeight: 600, lineHeight: 1.2 }}>{t.n}</div>
                <div style={{ fontSize: "0.95vw", color: "rgba(255,255,255,0.45)" }}>{t.d}</div>
              </div>
            ))}
          </div>

          {/* Backend & Data */}
          <div style={{ padding: "2.2vh 1.6vw", background: "rgba(1,215,251,0.05)", border: "1px solid rgba(1,215,251,0.18)", borderRadius: "1vw" }}>
            <div style={{ fontSize: "0.95vw", fontWeight: 700, color: "#01d7fb", letterSpacing: "0.15em", marginBottom: "1.8vh" }}>BACKEND & DATA</div>
            {[
              { n: "Node.js + Express", d: "REST + WebSocket APIs" },
              { n: "MongoDB", d: "Stations, users, social graph" },
              { n: "Redis", d: "Caching, presence, pub/sub" },
              { n: "Vector DB", d: "AI embeddings for recommend" },
              { n: "Stream proxy (Go)", d: "Reliable HLS/ICY playback" },
              { n: "OpenAPI 3.1 + Zod", d: "Typed contracts everywhere" },
            ].map((t) => (
              <div key={t.n} style={{ marginBottom: "1.1vh" }}>
                <div style={{ fontSize: "1.25vw", color: "#ffffff", fontWeight: 600, lineHeight: 1.2 }}>{t.n}</div>
                <div style={{ fontSize: "0.95vw", color: "rgba(255,255,255,0.45)" }}>{t.d}</div>
              </div>
            ))}
          </div>

          {/* Infra, DevOps, Security */}
          <div style={{ padding: "2.2vh 1.6vw", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "1vw" }}>
            <div style={{ fontSize: "0.95vw", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.15em", marginBottom: "1.8vh" }}>INFRA · DEVOPS · SECURITY</div>
            {[
              { n: "AWS", d: "S3, CloudFront, EC2, Lambda" },
              { n: "Railway", d: "Auto-deploy preview & prod" },
              { n: "Cloudflare", d: "WAF, DDoS, bot mgmt, CDN" },
              { n: "GitHub + Actions", d: "CI/CD, code review, releases" },
              { n: "Sentry + Datadog", d: "Error & perf monitoring" },
              { n: "OAuth 2.0 / Device Flow", d: "Auth across every form factor" },
            ].map((t) => (
              <div key={t.n} style={{ marginBottom: "1.1vh" }}>
                <div style={{ fontSize: "1.25vw", color: "#ffffff", fontWeight: 600, lineHeight: 1.2 }}>{t.n}</div>
                <div style={{ fontSize: "0.95vw", color: "rgba(255,255,255,0.45)" }}>{t.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "3vh", padding: "2vh 2vw", background: "rgba(255,65,153,0.04)", border: "1px solid rgba(255,65,153,0.12)", borderRadius: "0.8vw", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1.5vw", textAlign: "center" }}>
          <div>
            <div style={{ fontSize: "1.8vw", fontWeight: 700, color: "#ff4199" }}>17 platforms</div>
            <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.4)" }}>One codebase strategy</div>
          </div>
          <div>
            <div style={{ fontSize: "1.8vw", fontWeight: 700, color: "#01d7fb" }}>5 languages</div>
            <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.4)" }}>JS · Swift · Kotlin · Go · C++</div>
          </div>
          <div>
            <div style={{ fontSize: "1.8vw", fontWeight: 700, color: "#ffffff" }}>99.95% uptime</div>
            <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.4)" }}>Multi-region failover</div>
          </div>
          <div>
            <div style={{ fontSize: "1.8vw", fontWeight: 700, color: "#ffffff" }}>SOC 2 ready</div>
            <div style={{ fontSize: "1vw", color: "rgba(255,255,255,0.4)" }}>Audit Q3 2025</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>15 / 23</span>
      </div>
    </div>
  );
}
