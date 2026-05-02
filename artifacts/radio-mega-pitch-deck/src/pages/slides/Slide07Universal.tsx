export default function Slide07Universal() {
  const groups = [
    {
      label: "SMART TV",
      color: "#ff4199",
      items: [
        { name: "Samsung Tizen", status: "LIVE" },
        { name: "LG webOS", status: "LIVE" },
        { name: "Apple TV (tvOS)", status: "LIVE" },
        { name: "Android TV", status: "LIVE" },
        { name: "Amazon Fire TV", status: "LIVE" },
      ],
    },
    {
      label: "MOBILE",
      color: "#01d7fb",
      items: [
        { name: "iOS — App Store", status: "LIVE" },
        { name: "Android — Google Play", status: "LIVE" },
        { name: "Samsung Galaxy Store", status: "LIVE" },
        { name: "Huawei AppGallery", status: "LIVE" },
      ],
    },
    {
      label: "DESKTOP",
      color: "#ff4199",
      items: [
        { name: "macOS", status: "LIVE" },
        { name: "Windows", status: "LIVE" },
        { name: "Linux", status: "LIVE" },
      ],
    },
    {
      label: "WEAR & AUTO",
      color: "#01d7fb",
      items: [
        { name: "Apple Watch (watchOS)", status: "LIVE" },
        { name: "Wear OS", status: "LIVE" },
        { name: "Apple CarPlay", status: "LIVE" },
        { name: "Android Auto", status: "LIVE" },
      ],
    },
    {
      label: "WEB",
      color: "#ffffff",
      items: [
        { name: "themegaradio.com", status: "LIVE" },
      ],
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ top: "0", left: "30vw", width: "40vw", height: "40vw", borderRadius: "50%", background: "#ff4199", opacity: 0.06, filter: "blur(10vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "6vh 7vw" }}>
        <div style={{ marginBottom: "3vh" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "2vh" }}>
            <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.18em", textTransform: "uppercase" }}>UNIVERSAL AVAILABILITY</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5vw", padding: "0.5vh 1vw", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "1vw" }}>
              <div style={{ width: "0.6vw", height: "0.6vw", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0.6vw #22c55e" }} />
              <span style={{ fontSize: "0.9vw", color: "#22c55e", fontWeight: 700, letterSpacing: "0.1em" }}>SHIPPING TODAY</span>
            </div>
          </div>
          <h2 style={{ fontSize: "3.8vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
            Live on <span style={{ color: "#ff4199" }}>17 platforms</span> — not roadmap, today
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 0.8fr 1fr 0.7fr", gap: "1.4vw", flex: 1 }}>
          {groups.map((g) => (
            <div key={g.label} style={{ padding: "2.5vh 1.4vw", background: "rgba(255,255,255,0.03)", border: `1px solid ${g.color === "#ffffff" ? "rgba(255,255,255,0.12)" : g.color + "30"}`, borderRadius: "1vw", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "1vw", color: g.color, fontWeight: 700, letterSpacing: "0.15em", marginBottom: "2vh", paddingBottom: "1.5vh", borderBottom: `1px solid ${g.color === "#ffffff" ? "rgba(255,255,255,0.1)" : g.color + "20"}` }}>{g.label}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
                {g.items.map((it) => (
                  <div key={it.name} style={{ display: "flex", flexDirection: "column", gap: "0.3vh" }}>
                    <span style={{ fontSize: "1.15vw", color: "#ffffff", fontWeight: 500, lineHeight: 1.2 }}>{it.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4vw" }}>
                      <div style={{ width: "0.4vw", height: "0.4vw", borderRadius: "50%", background: "#22c55e" }} />
                      <span style={{ fontSize: "0.85vw", color: "#22c55e", fontWeight: 700, letterSpacing: "0.1em" }}>{it.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3vh", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5vw" }}>
          <div style={{ padding: "2vh 2vw", background: "rgba(255,65,153,0.06)", border: "1px solid rgba(255,65,153,0.2)", borderRadius: "0.8vw", textAlign: "center" }}>
            <div style={{ fontSize: "2.6vw", fontWeight: 700, color: "#ff4199" }}>17</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.55)" }}>Live platforms today</div>
          </div>
          <div style={{ padding: "2vh 2vw", background: "rgba(1,215,251,0.06)", border: "1px solid rgba(1,215,251,0.2)", borderRadius: "0.8vw", textAlign: "center" }}>
            <div style={{ fontSize: "2.6vw", fontWeight: 700, color: "#01d7fb" }}>1 account</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.55)" }}>Synced across every device</div>
          </div>
          <div style={{ padding: "2vh 2vw", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.8vw", textAlign: "center" }}>
            <div style={{ fontSize: "2.6vw", fontWeight: 700, color: "#ffffff" }}>0 competitors</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.55)" }}>Match this surface area</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>7 / 23</span>
      </div>
    </div>
  );
}
