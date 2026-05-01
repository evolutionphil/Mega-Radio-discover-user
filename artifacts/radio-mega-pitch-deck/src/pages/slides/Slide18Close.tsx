export default function Slide18Close() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0e0e0e", fontFamily: "'Ubuntu', sans-serif" }}>
      {/* Animated gradient background */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,65,153,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(1,215,251,0.07) 0%, transparent 60%)" }} />
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "4vw 4vw" }} />

      {/* Glow orbs */}
      <div className="absolute" style={{ top: "10vh", left: "5vw", width: "20vw", height: "20vw", borderRadius: "50%", background: "#ff4199", opacity: 0.08, filter: "blur(6vw)" }} />
      <div className="absolute" style={{ bottom: "5vh", right: "5vw", width: "25vw", height: "25vw", borderRadius: "50%", background: "#01d7fb", opacity: 0.06, filter: "blur(7vw)" }} />

      <div className="absolute inset-0 flex flex-col justify-center items-center" style={{ zIndex: 10, textAlign: "center", padding: "10vh 15vw" }}>
        {/* Icon */}
        <div style={{ marginBottom: "4vh" }}>
          <svg width="5vw" height="5vw" viewBox="0 0 40 40" fill="none">
            <path d="M8 34 L8 6 L20 20 L32 6 L32 34" stroke="#ff4199" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>

        <div style={{ fontSize: "1vw", fontWeight: 700, color: "#ff4199", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "3vh" }}>Join Us</div>

        <h1 style={{ fontSize: "5.5vw", fontWeight: 700, color: "#ffffff", margin: "0 0 3vh 0", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
          Radio for the<br />
          <span style={{ background: "linear-gradient(135deg, #ff4199 0%, #01d7fb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            television era
          </span>
        </h1>

        <p style={{ fontSize: "1.9vw", color: "rgba(255,255,255,0.5)", maxWidth: "44vw", lineHeight: 1.6, margin: "0 0 6vh 0" }}>
          We have built the product, shipped to two platforms, and proven the model. We are looking for partners who believe radio deserves the same premium experience as every other great streaming service.
        </p>

        {/* CTA row */}
        <div style={{ display: "flex", gap: "3vw", alignItems: "center", marginBottom: "6vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)", marginBottom: "0.5vh" }}>Raising</div>
            <div style={{ fontSize: "2.8vw", fontWeight: 700, color: "#ff4199" }}>$2.5M Seed</div>
          </div>
          <div style={{ width: "1px", height: "6vh", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)", marginBottom: "0.5vh" }}>Contact</div>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#ffffff" }}>invest@themegaradio.com</div>
          </div>
          <div style={{ width: "1px", height: "6vh", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.2vw", color: "rgba(255,255,255,0.4)", marginBottom: "0.5vh" }}>Live demo</div>
            <div style={{ fontSize: "2vw", fontWeight: 700, color: "#01d7fb" }}>themegaradio.com/tv</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "4vw", fontSize: "1.3vw", color: "rgba(255,255,255,0.3)" }}>
          <span>Samsung Smart Hub — available now</span>
          <span>·</span>
          <span>LG Content Store — available now</span>
          <span>·</span>
          <span>50,000+ stations · 238 countries</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "2vh 5vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 10 }}>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.1em" }}>RADIO MEGA</span>
        <span style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.2)" }}>18 / 18</span>
      </div>
    </div>
  );
}
