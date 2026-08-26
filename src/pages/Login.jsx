import React, { useState, useEffect } from "react";
import { useLocale } from "../context/LocaleContext";
import { useSession } from "../context/SessionContext";
import { signUpUser, signInUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, User, BookOpen, GraduationCap, ArrowLeft } from "lucide-react";

const InputField = ({ icon: Icon, label, type, value, onChange, placeholder, required }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 11, fontWeight: 500, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</label>
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <Icon size={16} color="#555" />
      </div>
      <input
        type={type} required={required} value={value} onChange={onChange} placeholder={placeholder}
        className="input-field"
        style={{ paddingLeft: 42, paddingRight: 14 }}
      />
    </div>
  </div>
);

const Login = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const { refreshProfile } = useSession();

  // Screen steps: "ask_age" -> "ask_role" (if 14+) -> "auth_form"
  const [flowStep, setFlowStep] = useState("ask_age");

  // Intro Animation Timeline Stages:
  // 0: Blank black screen (0.0s)
  // 1: Logo materializes & holds centered with soft breathing glow (0.1s - 1.8s)
  // 2: Smooth transition into Age Gate — logo slides up, question & buttons stagger in (1.8s - 2.6s)
  // 3: Fully settled & interactive Age Gate (2.6s+)
  const [introStage, setIntroStage] = useState(0);

  const [ageGroup, setAgeGroup] = useState(""); // "under14" or "14plus"
  const [role, setRole] = useState("student");   // "student" or "teacher"
  const [isSignUp, setIsSignUp] = useState(false); // false = Sign in, true = Create account

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Stage 1: Logo materializes centered at 100ms
    const t1 = setTimeout(() => setIntroStage(1), 100);
    // Stage 2: Transition out to Age Gate at 1800ms
    const t2 = setTimeout(() => setIntroStage(2), 1800);
    // Stage 3: Fully settled at 2600ms
    const t3 = setTimeout(() => setIntroStage(3), 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleUnder14 = () => {
    setAgeGroup("under14");
    setRole("student");
    setFlowStep("auth_form");
  };

  const handle14Plus = () => {
    setAgeGroup("14plus");
    setFlowStep("ask_role");
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFlowStep("auth_form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        await signUpUser(email, password, fullName, role);
        // Wait for the profile to be available in the DB before navigating
        // This fixes the race condition where onAuthStateChange fires before
        // the profile row is inserted, causing "hallucination" on hosted sites
        await refreshProfile();
      } else {
        await signInUser(email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setFlowStep("ask_age");
    setIntroStage(3); // Keep fully settled on reset
    setAgeGroup("");
    setRole("student");
    setError("");
  };

  return (
    <div style={{ minHeight: "92vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", backgroundColor: "#0A0A0F" }}>
      {/* Glow Orbs */}
      <div style={{ position: "absolute", top: "20%", left: "30%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(212,77,240,0.10) 50%, transparent 75%)", filter: "blur(90px)", pointerEvents: "none" }} />

      {/* ── STEP 1: Age Check with 2-Stage Logo Intro Animation ────────────── */}
      {flowStep === "ask_age" && (
        <div
          style={{
            width: "100%",
            maxWidth: 600,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 380,
          }}
        >
          {/* Logo Container (Centred in Stage 1, slides up in Stage 2) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform:
                introStage === 0
                  ? "translateY(20px) scale(0.85)"
                  : introStage === 1
                  ? "translateY(0px) scale(1)"
                  : "translateY(-12px) scale(0.92)",
              opacity: introStage === 0 ? 0 : 1,
              transition:
                introStage === 2 || introStage === 3
                  ? "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
                  : "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "transform, opacity",
              marginBottom: introStage >= 2 ? 16 : 0,
            }}
          >
            {/* SwarAstra Emblem Graphic */}
            <div
              style={{
                width: introStage >= 2 ? 110 : 140,
                height: introStage >= 2 ? 110 : 140,
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0A0A0F",
                boxShadow:
                  introStage === 1
                    ? "0 0 45px rgba(212,77,240,0.5), 0 0 90px rgba(106,76,245,0.35)"
                    : "0 0 25px rgba(212,77,240,0.3)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                marginBottom: 12,
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
                  filter: "drop-shadow(0 0 15px rgba(139,92,246,0.8)) contrast(1.15)",
                }}
              />
            </div>

            {/* Logo Typography */}
            <h1
              style={{
                fontSize: introStage >= 2 ? 34 : 42,
                fontWeight: 800,
                letterSpacing: "-1px",
                margin: 0,
                background: "linear-gradient(90deg, #d44df0 0%, #a78bfa 50%, #6a4cf5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: introStage === 1 ? "drop-shadow(0 0 16px rgba(212,77,240,0.4))" : "none",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              SwarAstra
            </h1>
          </div>

          {/* Subtitle Question ("Are you 14 years old or older?") — Stagger 0ms in Stage 2 */}
          <p
            style={{
              fontSize: 16,
              color: "#94a3b8",
              margin: "0 0 32px 0",
              fontWeight: 400,
              opacity: introStage >= 2 ? 1 : 0,
              transform: introStage >= 2 ? "translateY(0px)" : "translateY(15px)",
              transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0ms",
              pointerEvents: introStage >= 2 ? "auto" : "none",
            }}
          >
            Are you 14 years old or older?
          </p>

          {/* Buttons Container */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", width: "100%" }}>
            {/* Button 1: "I am 14 or older" — Stagger +150ms in Stage 2 */}
            <button
              onClick={handle14Plus}
              style={{
                padding: "14px 32px",
                borderRadius: 100,
                background: "#141417",
                border: "1px solid #27272a",
                color: "#f8fafc",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s, opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 150ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 150ms",
                minWidth: 200,
                opacity: introStage >= 2 ? 1 : 0,
                transform: introStage >= 2 ? "translateY(0px)" : "translateY(15px)",
                pointerEvents: introStage >= 2 ? "auto" : "none",
              }}
              onMouseEnter={(e) => {
                if (introStage >= 2) {
                  e.currentTarget.style.borderColor = "#8b5cf6";
                  e.currentTarget.style.background = "#1c1c21";
                }
              }}
              onMouseLeave={(e) => {
                if (introStage >= 2) {
                  e.currentTarget.style.borderColor = "#27272a";
                  e.currentTarget.style.background = "#141417";
                }
              }}
            >
              I am 14 or older
            </button>

            {/* Button 2: "I am under 14" — Stagger +300ms in Stage 2 */}
            <button
              onClick={handleUnder14}
              style={{
                padding: "14px 32px",
                borderRadius: 100,
                background: "#141417",
                border: "1px solid #27272a",
                color: "#f8fafc",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s, opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 300ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 300ms",
                minWidth: 200,
                opacity: introStage >= 2 ? 1 : 0,
                transform: introStage >= 2 ? "translateY(0px)" : "translateY(15px)",
                pointerEvents: introStage >= 2 ? "auto" : "none",
              }}
              onMouseEnter={(e) => {
                if (introStage >= 2) {
                  e.currentTarget.style.borderColor = "#06b6d4";
                  e.currentTarget.style.background = "#1c1c21";
                }
              }}
              onMouseLeave={(e) => {
                if (introStage >= 2) {
                  e.currentTarget.style.borderColor = "#27272a";
                  e.currentTarget.style.background = "#141417";
                }
              }}
            >
              I am under 14
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Role Selection (For 14+) ────────────────────────────── */}
      {flowStep === "ask_role" && (
        <div className="animate-fade-up" style={{ width: "100%", maxWidth: 600, textAlign: "center" }}>
          <button
            onClick={resetAll}
            style={{
              background: "none", border: "none", color: "#64748b", cursor: "pointer",
              fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20,
            }}
          >
            <ArrowLeft size={16} /> Back to age check
          </button>

          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-1px",
              margin: 0,
              background: "linear-gradient(90deg, #d44df0 0%, #a78bfa 50%, #6a4cf5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 10,
            }}
          >
            SwarAstra
          </h1>
          <p style={{ fontSize: 16, color: "#94a3b8", marginBottom: 36, fontWeight: 400 }}>
            How would you like to join?
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => handleRoleSelect("student")}
              style={{
                flex: "1 1 240px",
                maxWidth: 260,
                padding: "24px 20px",
                borderRadius: 20,
                background: "#141417",
                border: "1px solid #27272a",
                color: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6a4cf5";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.background = "#1c1c21";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#27272a";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "#141417";
              }}
            >
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(106,76,245,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa" }}>
                <BookOpen size={24} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Regular User / Student</span>
              <span style={{ fontSize: 12, color: "#64748b" }}>Learn Gujarati signs, maths & science</span>
            </button>

            <button
              onClick={() => handleRoleSelect("teacher")}
              style={{
                flex: "1 1 240px",
                maxWidth: 260,
                padding: "24px 20px",
                borderRadius: 20,
                background: "#141417",
                border: "1px solid #27272a",
                color: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#d44df0";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.background = "#1c1c21";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#27272a";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "#141417";
              }}
            >
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(212,77,240,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e86af5" }}>
                <GraduationCap size={24} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Teacher</span>
              <span style={{ fontSize: 12, color: "#64748b" }}>Add questions & guide students</span>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Sign In / Create Account Interface ────────────────────── */}
      {flowStep === "auth_form" && (
        <div className="animate-fade-up" style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
          <div style={{ background: "#141414", border: "1px solid #262626", borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
            <div style={{ height: 3, background: role === "teacher" ? "linear-gradient(90deg,#d44df0,#e86af5)" : "linear-gradient(90deg,#6a4cf5,#d44df0,#ff7a3d)" }} />

            <div style={{ padding: "32px 28px 28px" }}>
              {/* Back button */}
              <button
                type="button"
                onClick={() => setFlowStep(ageGroup === "under14" ? "ask_age" : "ask_role")}
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}
              >
                <ArrowLeft size={14} /> Change options
              </button>

              {/* Logo + Header */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#6a4cf5,#d44df0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#fff" }}>S</div>
                  <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 100, background: role === "teacher" ? "rgba(212,77,240,0.15)" : "rgba(106,76,245,0.15)", color: role === "teacher" ? "#e86af5" : "#a78bfa", border: `1px solid ${role === "teacher" ? "rgba(212,77,240,0.3)" : "rgba(106,76,245,0.3)"}`, textTransform: "capitalize", fontWeight: 600 }}>
                    {role} • {ageGroup === "under14" ? "Under 14" : "14+"}
                  </span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.8px", marginTop: 14, marginBottom: 4 }}>
                  {isSignUp ? `Create ${role === "teacher" ? "Teacher" : "Student"} Account` : `Sign In as ${role === "teacher" ? "Teacher" : "Student"}`}
                </h2>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                  {isSignUp ? "Enter your details to register" : "Enter your email & password to continue"}
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <InputField icon={User} label="Username" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your username" required />
                <InputField icon={Mail} label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                <InputField icon={Lock} label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading
                    ? (isSignUp ? "Creating account..." : "Signing in...")
                    : (isSignUp ? "Create Account" : "Sign In")}
                </button>
              </form>

              {/* Mode switch (Sign in <-> Create account) */}
              <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 24, marginBottom: 0 }}>
                {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                  style={{ color: "#0099ff", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                >
                  {isSignUp ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
