import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * SwarAstra Splash Screen Component
 *
 * Sequence:
 * 1. Entry (0.0s - 1.2s): Deep fade-in from pitch black (#0A0A0F). Central icon scales 85% -> 100% (spring curve).
 * 2. Wave Glow Pulse (1.2s - 2.2s): Audio waves pulse outward with cyan/purple neon aura. "SwarAstra" slides up 20px (opacity 0 -> 1).
 * 3. Transition Out (2.2s - 2.8s): Typography fades out. Icon translates upward to top header & scales down to 50%. Background fades smoothly into Sign-In/UI.
 */
const SplashScreen = ({ onComplete, forcePlay = false, targetRoute = "/login" }) => {
  const navigate = useNavigate();
  // Stage: 0 = hidden, 1 = Entry (0-1.2s), 2 = Wave Pulse (1.2-2.2s), 3 = Transition Out (2.2-2.8s), 4 = Done
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Check if splash has already played in this session / launch
    const hasSeenSplash = localStorage.getItem("swarastra_splash_played");
    if (hasSeenSplash && !forcePlay) {
      if (onComplete) onComplete();
      return;
    }

    // Start Timeline
    setStage(1); // Entry phase

    const timer1 = setTimeout(() => {
      setStage(2); // Wave Glow Pulse + Text slide up
    }, 1200);

    const timer2 = setTimeout(() => {
      setStage(3); // Transition Out (Move to header + scale down)
    }, 2200);

    const timer3 = setTimeout(() => {
      setStage(4); // Finished
      localStorage.setItem("swarastra_splash_played", "true");
      if (onComplete) onComplete();
      if (targetRoute) {
        navigate(targetRoute);
      }
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [forcePlay, navigate, onComplete, targetRoute]);

  if (stage === 0 || stage === 4) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        backgroundColor: "#0A0A0F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        pointerEvents: stage === 3 ? "none" : "auto",
        transition: "background-color 0.6s ease, opacity 0.6s ease",
        opacity: stage === 3 ? 0 : 1,
      }}
    >
      {/* Background Neon Spotlights / Glow Orbs */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(139,92,246,0.15) 45%, transparent 70%)",
          filter: "blur(80px)",
          transform: stage >= 2 ? "scale(1.25)" : "scale(0.85)",
          transition: "transform 1s ease-out, opacity 0.8s ease",
          opacity: stage === 3 ? 0 : 0.8,
          pointerEvents: "none",
        }}
      />

      {/* Main Animated Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform, opacity",
          transform:
            stage === 3
              ? "translateY(-38vh) scale(0.50)"
              : stage >= 1
              ? "translateY(0px) scale(1)"
              : "translateY(0px) scale(0.85)",
          transition:
            stage === 3
              ? "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
              : "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Central Icon (Hand + Circle Wave + Open Book) */}
        <div style={{ position: "relative", width: 220, height: 220, display: "flex", alignItems: "center", justifyCenter: "center" }}>
          
          {/* Pulsing Audio Wave Rings (Stage 2) */}
          <div
            style={{
              position: "absolute",
              inset: -20,
              borderRadius: "50%",
              border: "2px solid rgba(6, 182, 212, 0.5)",
              boxShadow: "0 0 30px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(139, 92, 246, 0.3)",
              opacity: stage >= 2 ? 1 : 0,
              transform: stage >= 2 ? "scale(1.15)" : "scale(0.9)",
              transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -40,
              borderRadius: "50%",
              border: "1.5px dashed rgba(212, 77, 240, 0.35)",
              opacity: stage >= 2 ? 0.7 : 0,
              transform: stage >= 2 ? "scale(1.25) rotate(15deg)" : "scale(0.85) rotate(0deg)",
              transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease",
              pointerEvents: "none",
            }}
          />

          {/* SVG Vector Logo matching the stylized Hand + Wave + Book design */}
          <svg viewBox="0 0 200 200" width="220" height="220" style={{ filter: "drop-shadow(0 0 25px rgba(6,182,212,0.5))", position: "absolute", zIndex: 1 }}>
            <defs>
              <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b6cf8" />
                <stop offset="100%" stopColor="#d44df0" />
              </linearGradient>

              <radialGradient id="glowGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(6,182,212,0.6)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Glowing background aura inside circle */}
            <circle cx="100" cy="90" r="65" fill="url(#glowGlow)" opacity={stage >= 2 ? 0.8 : 0.4} />

            {/* Circular wave ring */}
            <circle
              cx="100"
              cy="85"
              r="62"
              fill="none"
              stroke="url(#splashGradient)"
              strokeWidth="4"
              strokeDasharray={stage >= 1 ? "400" : "0"}
              strokeDashoffset="0"
              style={{ transition: "stroke-dasharray 1.2s ease" }}
            />

            {/* Outer wave arcs (Left and Right sound waves) */}
            <path
              d="M 28 70 A 72 72 0 0 0 28 100"
              fill="none"
              stroke="url(#splashGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              opacity={stage >= 2 ? 1 : 0.3}
              transform={stage >= 2 ? "scale(1.05)" : "scale(1)"}
              style={{ transition: "all 0.5s ease" }}
            />
            <path
              d="M 172 70 A 72 72 0 0 1 172 100"
              fill="none"
              stroke="url(#splashGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              opacity={stage >= 2 ? 1 : 0.3}
              transform={stage >= 2 ? "scale(1.05)" : "scale(1)"}
              style={{ transition: "all 0.5s ease" }}
            />
          </svg>

          {/* High-res Circular Blended Emblem Overlay */}
          <div
            style={{
              position: "absolute",
              width: 170,
              height: 170,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0A0A0F",
              boxShadow: "0 0 35px rgba(6,182,212,0.4), inset 0 0 25px rgba(139,92,246,0.3)",
              zIndex: 2,
            }}
          >
            <img
              src="/swarastra_logo.png"
              alt="SwarAstra Logo"
              style={{
                width: "115%",
                height: "115%",
                objectFit: "cover",
                borderRadius: "50%",
                mixBlendMode: "screen",
                filter: "drop-shadow(0 0 15px rgba(139,92,246,0.8)) contrast(1.15) brightness(1.1)",
              }}
            />
          </div>
        </div>

        {/* Below the Icon: "SwarAstra" Typography */}
        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            opacity: stage === 2 ? 1 : 0,
            transform: stage === 2 ? "translateY(0px)" : "translateY(20px)",
            transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h1
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: "-1px",
              margin: 0,
              background: "linear-gradient(90deg, #06b6d4 0%, #8b6cf8 50%, #d44df0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 30px rgba(6,182,212,0.4)",
            }}
          >
            SwarAstra
          </h1>
          <p style={{ fontSize: 13, color: "#94a3b8", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 6, fontWeight: 500 }}>
            Gujarati Learning & Sign Platform
          </p>
        </div>
      </div>

      {/* Skip Button (for ease of testing / instant skip) */}
      {stage === 1 || stage === 2 ? (
        <button
          onClick={() => {
            setStage(4);
            localStorage.setItem("swarastra_splash_played", "true");
            if (onComplete) onComplete();
            if (targetRoute) navigate(targetRoute);
          }}
          style={{
            position: "absolute",
            bottom: 32,
            right: 32,
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#94a3b8",
            fontSize: 12,
            fontWeight: 600,
            padding: "8px 16px",
            borderRadius: 100,
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
          }}
        >
          Skip →
        </button>
      ) : null}
    </div>
  );
};

export default SplashScreen;
