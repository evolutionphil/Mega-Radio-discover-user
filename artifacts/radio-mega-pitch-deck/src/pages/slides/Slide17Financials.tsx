export default function Slide17Financials() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d12", fontFamily: "'Ubuntu', sans-serif" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />
      <div className="absolute" style={{ bottom: "5vh", left: "5vw", width: "28vw", height: "28vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.04, filter: "blur(8vw)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, padding: "7vh 8vw" }}>
        <div style={{ marginBottom: "4vh" }}>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#01d7fb", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2vh" }}>FINANCIAL SUMMARY</div>
          <h2 style={{ fontSize: "4vw", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Three-year P&L snapshot
          </h2>
        </div>

        {/* Table */}
        <div style={{ flex: 1 }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr", gap: "2vw", padding: "1.5vh 2vw", borderBottom: "2px solid rgba(255,255,255,0.1)", marginBottom: "1vh" }}>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>METRIC</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)", fontWeight: 600, textAlign: "right" }}>2026</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)", fontWeight: 600, textAlign: "right" }}>2027</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.35)", fontWeight: 600, textAlign: "right" }}>2028</div>
          </div>

          {[
            { metric: "Premium subscribers", y1: "150K", y2: "600K", y3: "1.8M", highlight: false },
            { metric: "Subscription revenue", y1: "$820K", y2: "$3.4M", y3: "$8.2M", highlight: true },
            { metric: "Advertising revenue", y1: "$0", y2: "$620K", y3: "$1.9M", highlight: false },
            { metric: "B2B / licensing revenue", y1: "$0", y2: "$280K", y3: "$1.1M", highlight: false },
            { metric: "Total revenue", y1: "$820K", y2: "$4.3M", y3: "$11.2M", highlight: true },
            { metric: "Gross margin", y1: "64%", y2: "70%", y3: "74%", highlight: false },
            { metric: "EBITDA", y1: "($1.8M)", y2: "($0.4M)", y3: "$2.1M", highlight: false },
            { metric: "Free cash flow break-even", y1: "—", y2: "—", y3: "Q2 2028", highlight: false },
          ].map((row, i) => (
            <div key={row.metric} style={{
              display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr", gap: "2vw",
              padding: "1.5vh 2vw",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              background: row.highlight ? "rgba(255,65,153,0.04)" : i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
              alignItems: "center"
            }}>
              <div style={{ fontSize: "1.5vw", color: row.highlight ? "#ffffff" : "rgba(255,255,255,0.6)", fontWeight: row.highlight ? 600 : 400 }}>{row.metric}</div>
              <div style={{ fontSize: "1.5vw", color: row.highlight ? "#ff4199" : "rgba(255,255,255,0.6)", fontWeight: row.highlight ? 700 : 400, textAlign: "right" }}>{row.y1}</div>
              <div style={{ fontSize: "1.5vw", color: row.highlight ? "#ff4199" : "rgba(255,255,255,0.6)", fontWeight: row.highlight ? 700 : 400, textAlign: "right" }}>{row.y2}</div>
              <div style={{ fontSize: "1.5vw", color: row.highlight ? "#ff4199" : "rgba(255,255,255,0.6)", fontWeight: row.highlight ? 700 : 400, textAlign: "right" }}>{row.y3}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3vh", fontSize: "1.2vw", color: "rgba(255,255,255,0.25)", textAlign: "right" }}>
          Projections are forward-looking estimates. Not financial advice. See full model in data room.
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>17 / 18</span>
      </div>
    </div>
  );
}
