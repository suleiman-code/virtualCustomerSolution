import { ImageResponse } from "next/og";

export const alt = "Virtual Customer Solution";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", height: "100%", width: "100%", background: "#000000", color: "#FFFFFF", fontFamily: "Merriweather, Georgia, serif", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 20%, rgba(34,197,94,0.12), transparent 30%), radial-gradient(circle at 80% 80%, rgba(34,197,94,0.06), transparent 30%)" }} />
        <div style={{ position: "absolute", inset: 40, borderRadius: 36, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "76px 82px", width: "100%", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 74, height: 74, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "#22C55E", fontSize: 28, fontWeight: 700, color: "#000000" }}>VCS</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 18, letterSpacing: 5, textTransform: "uppercase", opacity: 0.76, color: "#FFFFFF" }}>Virtual Customer Solution</span>
              <span style={{ fontSize: 22, opacity: 0.6, color: "#9CA3AF" }}>IT, Marketing & Virtual Workforce Solutions</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 820 }}>
            <div style={{ fontSize: 78, lineHeight: 0.98, fontWeight: 700, color: "#FFFFFF" }}>Scale with smarter systems, virtual support, and performance-driven marketing.</div>
            <div style={{ fontSize: 28, lineHeight: 1.45, opacity: 0.7, color: "#D1D5DB" }}>Virtual Customer Solution helps businesses grow through marketing, operations, technology, and expert virtual execution.</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
