export default function Slide06WearAuto() {
  const cards = [
    { tag: "WEARABLES", color: "#ff4199", title: "On your wrist", platforms: ["watchOS — Apple Watch", "Wear OS — Pixel, Galaxy, Wear"], note: "Standalone playback, station favorites, glanceable now-playing complications. Tap once on your watch face — your station starts." },
    { tag: "AUTOMOTIVE", color: "#01d7fb", title: "On every drive", platforms: ["Apple CarPlay", "Android Auto"], note: "Full voice search, large-touch UI, station presets per driver profile. Built to the strict Apple/Google driver-distraction guidelines." },
    { tag: "DESKTOP", color: "#ffffff", title: "On every computer", platforms: ["macOS — universal binary", "Windows — MSIX/EXE", "Linux — AppImage / Flatpak"], note: "Native menu-bar player, system-wide media keys, persistent mini-player, and offline favorites cache. One install — every desktop OS." },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "10vh", right: "20vw", width: "30vw", height: "30vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.05, filter: "blur(9vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "7vh 8vw" }}>
        <div style={{ marginBottom: "4vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#01d7fb", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>WEARABLES · AUTO · DESKTOP</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Wherever the listener is, we are there
          </h2>
          <p style={{ fontSize: "1.5vw", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: "2vh 0 0 0", maxWidth: "55vw" }}>
            Radio Mega is the only radio platform shipping native apps across every form factor a listener actually uses — from a smartwatch on the morning run to a Linux desktop in the office.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2vw", flex: 1 }}>
          {cards.map((c) => (
            <div key={c.tag} style={{ padding: "3vh 2vw", background: "rgba(255,255,255,0.03)", border: `1px solid ${c.color === "#ffffff" ? "rgba(255,255,255,0.12)" : c.color + "30"}`, borderRadius: "1.2vw", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "1vw", color: c.color, fontWeight: 700, letterSpacing: "0.15em", marginBottom: "1.5vh" }}>{c.tag}</div>
              <div style={{ fontSize: "2.2vw", fontWeight: 700, color: "#ffffff", marginBottom: "2.5vh", lineHeight: 1.1 }}>{c.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1vh", marginBottom: "auto" }}>
                {c.platforms.map((p) => (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
                    <div style={{ width: "0.6vw", height: "0.6vw", borderRadius: "50%", background: c.color, boxShadow: `0 0 0.8vw ${c.color}` }} />
                    <span style={{ fontSize: "1.25vw", color: "#ffffff", fontWeight: 500 }}>{p}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "3vh", paddingTop: "2vh", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "1.1vw", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{c.note}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3vh", padding: "2vh 2.5vw", background: "rgba(1,215,251,0.05)", border: "1px solid rgba(1,215,251,0.15)", borderRadius: "0.8vw", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "1.4vw", color: "rgba(255,255,255,0.7)" }}>
            <span style={{ color: "#01d7fb", fontWeight: 700 }}>7 additional form factors</span> shipping native — not a single competitor matches this surface area.
          </div>
          <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>watchOS · Wear OS · CarPlay · Android Auto · macOS · Windows · Linux</div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>6 / 23</span>
      </div>
    </div>
  );
}
