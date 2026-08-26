import React, { useState, useEffect, useRef } from "react";
import { useLocale } from "../context/LocaleContext";
import { useSession } from "../context/SessionContext";
import CategoryCard from "../components/CategoryCard";
import AITutorWidget from "../components/AITutorWidget";
import { Hand, Calculator, FlaskConical, BarChart3, GraduationCap, Users } from "lucide-react";

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("revealed"); obs.disconnect(); }
    }, { threshold: 0.10 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const HomePage = () => {
  const { t } = useLocale();
  const { profile } = useSession();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showEnglishText, setShowEnglishText] = useState(true);
  const isTeacher = profile?.role?.toLowerCase() === "teacher";
  const gridRef = useReveal();
  const aiRef = useReveal();

  useEffect(() => {
    const interval = setInterval(() => {
      setShowEnglishText((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { to: "/sign-language",   key: "sign",     title: t("category_sign"),     icon: Hand,         show: true },
    { to: "/maths",           key: "maths",    title: t("category_maths"),    icon: Calculator,   show: true },
    { to: "/science",         key: "science",  title: t("category_science"),  icon: FlaskConical, show: true },
    { to: "/progress-report", key: "progress", title: t("category_progress"), icon: BarChart3,    show: true },
    { to: "/teacher",         key: "teacher",  title: "Add Questions",        icon: GraduationCap,show: isTeacher },
    { to: "/add-students",    key: "add_students", title: "Add Students",     icon: Users,        show: isTeacher },
  ].filter(c => c.show);

  return (
    <div style={{ paddingTop: 56, paddingBottom: 96 }}>
      {/* ── Hero band ─────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: 72, padding: "0 24px" }}>
        <p className="animate-fade-up" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#666", marginBottom: 20 }}>
          Gujarati Learning Platform
        </p>

        {/* Interchangeable English / Gujarati Hero Headline */}
        <div className="animate-fade-up delay-100" style={{ position: "relative", minHeight: "clamp(6rem, 14vw, 10rem)", display: "flex", itemsCenter: "center", justifyContent: "center", marginBottom: 12 }}>
          {/* English Headline */}
          <h1
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(2.8rem,7vw,5rem)",
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: "-0.05em",
              color: "#fff",
              opacity: showEnglishText ? 1 : 0,
              transform: showEnglishText ? "translateY(0) scale(1)" : "translateY(-12px) scale(0.98)",
              transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              pointerEvents: showEnglishText ? "auto" : "none",
            }}
          >
            Learn. Practice.{" "}
            <span style={{ background: "linear-gradient(90deg,#6a4cf5 0%,#d44df0 50%,#ff7a3d 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginLeft: "0.25em" }}>
              Grow.
            </span>
          </h1>

          {/* Gujarati Headline */}
          <h1
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(2.5rem,6.5vw,4.6rem)",
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              color: "#fff",
              fontFamily: "Noto Sans Gujarati, sans-serif",
              opacity: !showEnglishText ? 1 : 0,
              transform: !showEnglishText ? "translateY(0) scale(1)" : "translateY(12px) scale(0.98)",
              transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              pointerEvents: !showEnglishText ? "auto" : "none",
            }}
          >
            શીખો. મહાવરો કરો.{" "}
            <span style={{ background: "linear-gradient(90deg,#6a4cf5 0%,#d44df0 50%,#ff7a3d 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginLeft: "0.25em" }}>
              આગળ વધો.
            </span>
          </h1>
        </div>

        <p className="animate-fade-up delay-200" style={{ fontSize: 16, color: "#666", maxWidth: 440, margin: "0 auto", lineHeight: 1.55, letterSpacing: "-0.1px" }}>
          Master Gujarati sign language, maths and science — track your progress in one place.
        </p>
      </div>

      {/* ── Spotlight card grid ────────────────────────────────────────── */}
      <div
        ref={gridRef}
        className="reveal"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, maxWidth: 960, margin: "0 auto", padding: "0 24px" }}
      >
        {cards.map((card, i) => (
          <div key={card.key} className="animate-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
            <CategoryCard
              to={card.to}
              title={card.title}
              icon={card.icon}
              isDimmed={!!hoveredCard && hoveredCard !== card.key}
              onMouseEnter={() => setHoveredCard(card.key)}
              onMouseLeave={() => setHoveredCard(null)}
              onFocus={() => setHoveredCard(card.key)}
              onBlur={() => setHoveredCard(null)}
            />
          </div>
        ))}
      </div>

      {/* ── Divider ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 960, margin: "64px auto 0", padding: "0 24px" }}>
        <div style={{ height: 1, background: "#1a1a1a" }} />
      </div>

      {/* ── AI Tutor ─────────────────────────────────────────────────── */}
      <div ref={aiRef} className="reveal" style={{ maxWidth: 960, margin: "48px auto 0", padding: "0 24px" }}>
        <AITutorWidget />
      </div>
    </div>
  );
};

export default HomePage;
