import React from "react";
import { Link } from "react-router-dom";

// Maps each card to a spotlight variant from the design system
const SPOTLIGHT_MAP = {
  "/sign-language": { gradient: "linear-gradient(135deg,#6a4cf5 0%,#8b6cf8 60%,#5a3ce8 100%)", glow: "rgba(106,76,245,0.35)", label: "ગ" },
  "/maths":         { gradient: "linear-gradient(135deg,#ff7a3d 0%,#ff9a5c 60%,#ff5a1a 100%)", glow: "rgba(255,122,61,0.35)",  label: "ગ" },
  "/science":       { gradient: "linear-gradient(135deg,#d44df0 0%,#e86af5 60%,#c030e0 100%)", glow: "rgba(212,77,240,0.35)",  label: "ગ" },
  "/progress-report":{ gradient: "linear-gradient(135deg,#22c55e 0%,#4ade80 60%,#16a34a 100%)", glow: "rgba(34,197,94,0.30)",  label: "ગ" },
  "/teacher":       { gradient: "linear-gradient(135deg,#ff5577 0%,#ff7a96 60%,#ff2255 100%)", glow: "rgba(255,85,119,0.35)", label: "ગ" },
};

const CategoryCard = ({
  to,
  title,
  icon: Icon,
  isDimmed,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}) => {
  const spot = SPOTLIGHT_MAP[to] || { gradient: "linear-gradient(135deg,#6a4cf5,#d44df0)", glow: "rgba(106,76,245,0.3)" };

  return (
    <Link
      to={to}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "32px",
        borderRadius: 30,
        background: spot.gradient,
        minHeight: 220,
        position: "relative",
        overflow: "hidden",
        textDecoration: "none",
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
        opacity: isDimmed ? 0.35 : 1,
        transform: isDimmed ? "scale(0.97)" : "scale(1)",
        boxShadow: isDimmed ? "none" : `0 0 60px 10px ${spot.glow}`,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        onMouseEnter && onMouseEnter(e);
        e.currentTarget.style.transform = "scale(1.04) translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 0 80px 20px ${spot.glow}`;
      }}
      onMouseLeave={(e) => {
        onMouseLeave && onMouseLeave(e);
        e.currentTarget.style.transform = isDimmed ? "scale(0.97)" : "scale(1)";
        e.currentTarget.style.boxShadow = isDimmed ? "none" : `0 0 60px 10px ${spot.glow}`;
      }}
    >
      {/* Frosted noise texture overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "160px",
        pointerEvents: "none",
      }} />

      {/* Top: icon in translucent circle */}
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        background: "rgba(255,255,255,0.20)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.30)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon size={26} color="white" strokeWidth={1.8} />
      </div>

      {/* Bottom: title */}
      <div style={{ marginTop: "auto" }}>
        <p style={{
          fontSize: 22, fontWeight: 700, color: "#fff",
          lineHeight: 1.1, letterSpacing: "-0.8px",
          textShadow: "0 1px 8px rgba(0,0,0,0.3)",
        }}>
          {title}
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6, letterSpacing: "-0.1px" }}>
          Tap to explore →
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
