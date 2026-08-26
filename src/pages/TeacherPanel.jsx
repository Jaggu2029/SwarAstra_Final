import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { supabase } from "../services/supabaseClient";
import { ArrowLeft, Plus, Calculator, FlaskConical, CheckCircle, Loader2 } from "lucide-react";

// ── Helpers ─────────────────────────────────────────────────────────────────
const InputF = ({ label, value, onChange, placeholder, required, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-sign focus:ring-1 focus:ring-primary-sign/50 transition-all text-white placeholder-gray-600 text-sm"
    />
  </div>
);

const TextareaF = ({ label, value, onChange, placeholder, required }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
    <textarea
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-sign focus:ring-1 focus:ring-primary-sign/50 transition-all text-white placeholder-gray-600 text-sm resize-none"
    />
  </div>
);

// ── Maths Form ───────────────────────────────────────────────────────────────
const MathsForm = () => {
  const [operation, setOperation] = useState("addition");
  const [problemGu, setProblemGu] = useState("");
  const [solutionGu, setSolutionGu] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    const { error: err } = await supabase.from("content_maths").insert({
      type: operation,
      problem_gu: problemGu,
      solution_gu: solutionGu,
    });
    setLoading(false);
    if (err) { setError(err.message); }
    else { setSuccess(true); setProblemGu(""); setSolutionGu(""); setTimeout(() => setSuccess(false), 3000); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Operation Type</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {["addition", "subtraction", "multiplication", "division"].map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => setOperation(op)}
              className={`px-3 py-2 rounded-xl text-sm font-semibold capitalize transition-all border ${
                operation === op
                  ? "bg-primary-maths/20 border-primary-maths text-primary-maths"
                  : "bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      <TextareaF label="Problem (Gujarati) — e.g. ૩ + ૪ = ?" value={problemGu} onChange={(e) => setProblemGu(e.target.value)} placeholder="Enter the problem in Gujarati..." required />
      <InputF label="Solution (Gujarati) — e.g. ૭" value={solutionGu} onChange={(e) => setSolutionGu(e.target.value)} placeholder="Enter the answer in Gujarati..." required />

      {error && <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">{error}</p>}
      {success && (
        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
          <CheckCircle size={16} /> Question added successfully!
        </div>
      )}

      <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-maths to-orange-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary-maths/30 transition-all">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
        Add Maths Question
      </button>
    </form>
  );
};

// ── Science Form ─────────────────────────────────────────────────────────────
const ScienceForm = () => {
  const [questionGu, setQuestionGu] = useState("");
  const [questionEn, setQuestionEn] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const setOption = (i, val) => setOptions((prev) => prev.map((o, idx) => (idx === i ? val : o)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (options.some((o) => !o.trim())) { setError("Please fill all 4 options."); return; }
    setLoading(true); setError(""); setSuccess(false);
    const { error: err } = await supabase.from("content_science").insert({
      question_gu: questionGu,
      question_en: questionEn,
      options_json: options,
      correct_answer_index: correctIndex,
    });
    setLoading(false);
    if (err) { setError(err.message); }
    else {
      setSuccess(true);
      setQuestionGu(""); setQuestionEn(""); setOptions(["", "", "", ""]); setCorrectIndex(0);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <TextareaF label="Question (Gujarati)" value={questionGu} onChange={(e) => setQuestionGu(e.target.value)} placeholder="Enter the science question in Gujarati..." required />
      <TextareaF label="Question (English) — optional" value={questionEn} onChange={(e) => setQuestionEn(e.target.value)} placeholder="Enter the question in English (optional)..." />

      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Answer Options (click the correct one)</label>
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCorrectIndex(i)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 transition-all ${
                correctIndex === i
                  ? "bg-green-500 border-green-400 text-white"
                  : "bg-white/5 border-white/10 text-gray-500 hover:border-green-500/50"
              }`}
            >
              {String.fromCharCode(65 + i)}
            </button>
            <input
              type="text"
              value={opt}
              onChange={(e) => setOption(i, e.target.value)}
              placeholder={`Option ${String.fromCharCode(65 + i)}...`}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-science focus:ring-1 focus:ring-primary-science/50 transition-all text-white placeholder-gray-600 text-sm"
            />
            {correctIndex === i && <span className="text-xs text-green-400 font-semibold flex-shrink-0">✓ Correct</span>}
          </div>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">{error}</p>}
      {success && (
        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
          <CheckCircle size={16} /> Question added successfully!
        </div>
      )}

      <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-science to-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary-science/30 transition-all">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
        Add Science Question
      </button>
    </form>
  );
};

// ── Teacher Panel ─────────────────────────────────────────────────────────────
const TeacherPanel = () => {
  const { profile } = useSession();
  const [tab, setTab] = useState("maths");

  if (profile?.role?.toLowerCase() !== "teacher") {
    return (
      <div className="mt-20 text-center">
        <div className="glass-card p-10 max-w-md mx-auto">
          <p className="text-2xl font-bold text-red-400 mb-2">Access Denied</p>
          <p className="text-gray-400 mb-6">This page is only for teachers.</p>
          <Link to="/" className="text-primary-sign underline">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 glass-card hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
          <ArrowLeft size={22} className="text-primary-science" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Teacher Panel</h1>
          <p className="text-gray-400 text-sm mt-0.5">Add custom questions for your students</p>
        </div>
      </div>

      {/* Card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        {/* Accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-primary-maths via-primary-sign to-primary-science" />

        {/* Tabs */}
        <div className="flex border-b border-white/8">
          {[
            { id: "maths", label: "Maths", icon: Calculator, color: "text-primary-maths", active: "border-primary-maths text-primary-maths bg-primary-maths/5" },
            { id: "science", label: "Science", icon: FlaskConical, color: "text-primary-science", active: "border-primary-science text-primary-science bg-primary-science/5" },
          ].map(({ id, label, icon: Icon, color, active }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                tab === id ? active : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>

        {/* Form content */}
        <div className="p-6 md:p-8">
          {tab === "maths" ? <MathsForm /> : <ScienceForm />}
        </div>
      </div>

      {/* Info note */}
      <div className="mt-4 px-4 py-3 rounded-xl bg-blue-500/5 border border-blue-500/15 text-xs text-blue-400 text-center">
        Questions you add will appear in student practice levels immediately after saving.
      </div>
    </div>
  );
};

export default TeacherPanel;
