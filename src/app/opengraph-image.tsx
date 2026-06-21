import { ImageResponse } from "next/og";

export const alt = "JonnyAI — a one-man, AI-native digital marketing agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dynamically rendered share card (Facebook / LinkedIn / etc.) — always
// crisp, correctly spelled, and on-brand. Replaces the old static og_card.png.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "84px",
          background: "#070708",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Ambient brand glows */}
        <div style={{ position: "absolute", top: -220, left: -160, width: 760, height: 760, display: "flex", backgroundImage: "radial-gradient(circle, rgba(217,119,87,0.40), rgba(217,119,87,0) 60%)" }} />
        <div style={{ position: "absolute", bottom: -280, right: -120, width: 760, height: 760, display: "flex", backgroundImage: "radial-gradient(circle, rgba(49,198,169,0.20), rgba(49,198,169,0) 60%)" }} />

        {/* Glowing core orb */}
        <div
          style={{
            position: "absolute",
            right: 96,
            top: 205,
            width: 220,
            height: 220,
            borderRadius: 220,
            display: "flex",
            backgroundImage: "radial-gradient(circle at 38% 32%, #fff3e4, #D97757 46%, #5a1e0c 100%)",
            boxShadow: "0 0 140px 24px rgba(217,119,87,0.55)",
          }}
        />

        {/* Eyebrow */}
        <div style={{ display: "flex", color: "#D97757", fontSize: 26, letterSpacing: 8, fontWeight: 700, marginBottom: 30 }}>
          AI-NATIVE DIGITAL MARKETING AGENCY
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 800, lineHeight: 1.04, color: "#ffffff", maxWidth: 800 }}>
          <div style={{ display: "flex" }}>We brand it, build it,</div>
          <div style={{ display: "flex", color: "#D97757" }}>film it &amp; automate it.</div>
        </div>

        {/* Sub */}
        <div style={{ display: "flex", color: "rgba(255,255,255,0.6)", fontSize: 30, marginTop: 36, maxWidth: 740 }}>
          One person, AI-amplified — brand, websites, content and ads, plus the BizOS platform.
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 58 }}>
          <div style={{ display: "flex", color: "#ffffff", fontSize: 32, fontWeight: 700 }}>jonnyai.co.uk</div>
          <div style={{ display: "flex", width: 6, height: 6, borderRadius: 6, background: "#D97757", margin: "0 22px" }} />
          <div style={{ display: "flex", color: "rgba(255,255,255,0.55)", fontSize: 26 }}>BizOS · HubSuite</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
