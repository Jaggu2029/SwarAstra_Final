import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "../context/LocaleContext";
import { useSession } from "../context/SessionContext";
import { signOutUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { LogOut } from "lucide-react";

const Header = () => {
  const { locale, toggleLocale, t } = useLocale();
  const { session, profile } = useSession();
  const navigate = useNavigate();

  const [showEnglish, setShowEnglish] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Alternate greeting language
  useEffect(() => {
    const iv = setInterval(() => setShowEnglish(p => !p), 4500);
    return () => clearInterval(iv);
  }, []);

  // Sticky nav shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          buttonRef.current  && !buttonRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleToggleDropdown = () => {
    if (buttonRef.current) {
      const r = buttonRef.current.getBoundingClientRect();
      setDropdownPos({ top: r.bottom + 10, right: window.innerWidth - r.right });
    }
    setShowDropdown(p => !p);
  };

  const handleLogout = async () => {
    setShowDropdown(false);
    try { await signOutUser(); navigate("/login"); } catch (e) { console.error(e); }
  };

  const initials = (name) => {
    if (!name) return "?";
    const p = name.trim().split(" ");
    return p.length === 1 ? p[0][0].toUpperCase() : (p[0][0] + p[p.length-1][0]).toUpperCase();
  };

  const nameEn = profile?.full_name || "Friend";
  const nameGu = profile?.full_name || "મિત્ર";

  // Profile dropdown via portal
  const dropdown = showDropdown ? createPortal(
    <div
      ref={dropdownRef}
      className="animate-slide-down"
      style={{
        position: "fixed", top: dropdownPos.top, right: dropdownPos.right,
        zIndex: 99999, width: 260,
        backgroundColor: "#141414",
        border: "1px solid #262626",
        borderRadius: 20,
        boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Accent stripe */}
      <div style={{ height: 3, background: "linear-gradient(90deg,#6a4cf5,#d44df0,#ff7a3d)" }} />

      {/* User block */}
      <div style={{ padding: "18px 20px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "linear-gradient(135deg,#6a4cf5,#d44df0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0,
            border: "1.5px solid rgba(255,255,255,0.15)",
          }}>
            {initials(profile?.full_name)}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, color: "#fff", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.3px" }}>
              {profile?.full_name || "User"}
            </p>
            <span style={{
              display: "inline-block", fontSize: 11, padding: "2px 9px",
              borderRadius: 100, marginTop: 3, textTransform: "capitalize",
              background: "rgba(106,76,245,0.18)", color: "#a78bfa",
              border: "1px solid rgba(106,76,245,0.3)", letterSpacing: "-0.1px",
            }}>
              {profile?.role || "student"}
            </span>
          </div>
        </div>

        {/* Email */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
          borderRadius: 10, background: "rgba(255,255,255,0.03)",
          border: "1px solid #1a1a1a",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {session?.user?.email || "—"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#1a1a1a" }} />

      {/* Sign Out */}
      <div style={{ padding: "10px 12px" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 7, padding: "10px 16px", borderRadius: 100,
            background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.22)",
            color: "#f87171", fontWeight: 600, fontSize: 13, cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; e.currentTarget.style.color = "#fca5a5"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.10)"; e.currentTarget.style.color = "#f87171"; }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <header
        style={{
          position: "sticky", top: 0, zIndex: 100,
          backgroundColor: scrolled ? "rgba(9,9,9,0.92)" : "#090909",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: `1px solid ${scrolled ? "#262626" : "transparent"}`,
          transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
          height: 64,
        }}
      >
        <div style={{
          maxWidth: 1200, margin: "0 auto", height: "100%",
          padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
        }}>

          {/* Left: logo / wordmark */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, textDecoration: "none" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg,#6a4cf5,#d44df0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "-1px",
            }}>S</div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: "-0.5px" }}>SwarAstra</span>
          </Link>

          {/* Center: rotating greeting (hidden on mobile) */}
          <div
            style={{ flex: 1, position: "relative", height: 32, overflow: "hidden", margin: "0 24px" }}
            className="hidden md:block"
          >
            <span
              style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 500, color: "#999", letterSpacing: "-0.14px",
                transition: "opacity 0.8s ease, transform 0.8s ease",
                opacity: showEnglish ? 1 : 0,
                transform: showEnglish ? "translateY(0)" : "translateY(-8px)",
                whiteSpace: "nowrap",
              }}
            >
              Welcome, {nameEn} 👋
            </span>
            <span
              style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 500, color: "#999", letterSpacing: "-0.14px",
                transition: "opacity 0.8s ease, transform 0.8s ease",
                opacity: !showEnglish ? 1 : 0,
                transform: !showEnglish ? "translateY(0)" : "translateY(8px)",
                whiteSpace: "nowrap",
                fontFamily: "Noto Sans Gujarati, sans-serif",
              }}
            >
              સ્વાગત છે, {nameGu} 👋
            </span>
          </div>

          {/* Right: locale + profile */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <button
              onClick={toggleLocale}
              className="btn-secondary"
              style={{ padding: "8px 14px", minHeight: 36, fontSize: 12, borderRadius: 100 }}
            >
              {locale === "en" ? "ગુ" : "EN"}
            </button>

            {session ? (
              <button
                ref={buttonRef}
                onClick={handleToggleDropdown}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg,#6a4cf5,#d44df0)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: 13,
                  border: "1.5px solid rgba(255,255,255,0.15)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(106,76,245,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {initials(profile?.full_name)}
              </button>
            ) : (
              <Link to="/login" className="btn-primary" style={{ padding: "8px 16px", minHeight: 36, fontSize: 13 }}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {dropdown}
    </>
  );
};

export default Header;
