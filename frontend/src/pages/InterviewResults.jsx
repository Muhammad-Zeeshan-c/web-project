import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import {
  Trophy, Download, RotateCcw, TrendingUp, CheckCircle2, AlertCircle,
  Zap, Brain, BarChart3, ChevronUp, ChevronDown, Minus,
  Clock, ArrowLeft, Star, Lightbulb,
} from 'lucide-react';

// ===== HARDCODED DUMMY DATA =====
// This is the fake result data shown on the results page
const DUMMY_RESULT = {
  positionTitle: 'Senior Frontend Developer',
  mode: 'Mixed (HR + Technical)',
  date: 'October 30, 2025',
  duration: '24 min',
  overallScore: 74,

  questions: [
    { id: 1, text: 'Tell me about yourself and your background.', category: 'Introduction', type: 'hr', difficulty: 'Easy', score: 82, skipped: false, tip: 'Great opening — consider adding a career headline.' },
    { id: 2, text: 'Describe a challenging project you delivered under tight deadlines.', category: 'Time Management', type: 'hr', difficulty: 'Medium', score: 68, skipped: false, tip: 'Use the STAR method: your Result was missing.' },
    { id: 3, text: 'How do you handle conflict within a team?', category: 'Teamwork', type: 'hr', difficulty: 'Medium', score: 75, skipped: false, tip: 'Add a concrete example of a resolved conflict.' },
    { id: 4, text: 'Explain the Virtual DOM in React and why it matters.', category: 'React Core', type: 'technical', difficulty: 'Medium', score: 88, skipped: false, tip: 'Excellent. Mentioning reconciliation was a bonus.' },
    { id: 5, text: 'What is the difference between useMemo and useCallback?', category: 'React', type: 'technical', difficulty: 'Hard', score: 55, skipped: false, tip: 'Lacked a code-level example. Practice more.' },
    { id: 6, text: 'Describe your approach to CSS architecture in large projects.', category: 'CSS', type: 'technical', difficulty: 'Medium', score: 79, skipped: false, tip: 'Mentioning BEM or CSS Modules would push this higher.' },
    { id: 7, text: 'How do you prioritize tasks when everything seems urgent?', category: 'Prioritization', type: 'hr', difficulty: 'Medium', score: 71, skipped: false, tip: 'Adding stakeholder communication would strengthen this.' },
    { id: 8, text: 'Explain event delegation and when to use it.', category: 'JavaScript Core', type: 'technical', difficulty: 'Medium', score: 92, skipped: false, tip: 'Perfect — clearly explained.' },
    { id: 9, text: 'Where do you see yourself in 5 years?', category: 'Career Goals', type: 'hr', difficulty: 'Easy', score: 0, skipped: true, tip: "Don't skip — even a brief answer is better than silence." },
    { id: 10, text: 'How would you optimize a slow-loading React application?', category: 'Performance', type: 'technical', difficulty: 'Hard', score: 61, skipped: false, tip: 'Mention React Profiler and bundle analysis next time.' },
  ],

  skills: [
    { name: 'Clarity', score: 78, description: 'How clear your answers were' },
    { name: 'Confidence', score: 72, description: 'Assertiveness and certainty' },
    { name: 'Relevance', score: 81, description: 'Staying on-topic per question' },
    { name: 'Structure', score: 65, description: 'Logical flow, STAR usage' },
    { name: 'Depth', score: 69, description: 'Technical detail and examples' },
    { name: 'Conciseness', score: 84, description: 'Focused, no filler words' },
  ],

  feedback: {
    strengths: [
      'Strong JavaScript fundamentals — event delegation answer was near-perfect.',
      'Concise, easy-to-follow answers throughout the HR section.',
      'Genuine enthusiasm for frontend engineering came through clearly.',
    ],
    improvements: [
      'Behavioral answers lack the STAR structure — outcomes are often missing.',
      'React hooks (useMemo/useCallback) needs deeper practice.',
      'Never skip questions — partial answers always score higher than silence.',
    ],
    overall: 'You showed solid technical depth in JavaScript but need more structure in behavioral responses. Focus on adding measurable outcomes to your stories. Overall a strong showing — keep practicing!',
  },
};

// ===== HELPER FUNCTIONS =====

// Returns color classes based on score value (used throughout)
const scoreColor = (s) => {
  if (s >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-200' };
  if (s >= 60) return { text: 'text-amber-600', bg: 'bg-amber-400', light: 'bg-amber-50', border: 'border-amber-200' };
  return { text: 'text-red-500', bg: 'bg-red-400', light: 'bg-red-50', border: 'border-red-200' };
};

// Returns a text label for the score range
const scoreLabel = (s) => {
  if (s >= 80) return 'Excellent';
  if (s >= 70) return 'Good';
  if (s >= 55) return 'Fair';
  return 'Needs Work';
};

// ===== SUB-COMPONENTS =====

// SkillBar - horizontal progress bar for a single skill
const SkillBar = ({ skill, index }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Delay the animation slightly for each bar (stagger effect)
    const t = setTimeout(() => setWidth(skill.score), 300 + index * 80);
    return () => clearTimeout(t);
  }, [skill.score, index]);

  const c = scoreColor(skill.score);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800">{skill.name}</span>
          <span className="hidden sm:inline text-xs text-slate-400">{skill.description}</span>
        </div>
        <span className={`text-sm font-bold tabular-nums ${c.text}`}>{skill.score}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${c.bg} rounded-full`}
          style={{ width: `${width}%`, transition: 'width 1s cubic-bezier(.4,0,.2,1)' }}
        />
      </div>
    </div>
  );
};

// QuestionScoreCard - expandable card for each question with AI tip
const QuestionScoreCard = ({ q, index }) => {
  // open tracks whether the AI tip section is expanded
  const [open, setOpen] = useState(false);
  const c = q.skipped
    ? { text: 'text-slate-400', light: 'bg-slate-50', border: 'border-slate-100' }
    : scoreColor(q.score);

  return (
    <div
      className={`card border ${c.border} transition-shadow hover:shadow-md cursor-pointer animate-slide-up select-none`}
      style={{ animationDelay: `${index * 40}ms` }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Score bubble */}
        <div className={`w-12 h-12 rounded-xl ${c.light} flex flex-col items-center justify-center flex-shrink-0 border ${c.border}`}>
          {q.skipped ? (
            <Minus size={15} className="text-slate-400" />
          ) : (
            <>
              <span className={`text-sm font-bold leading-none ${c.text}`}>{q.score}</span>
              <span className="text-[9px] text-slate-400 mt-0.5">/100</span>
            </>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {/* Badges: question number, category, type, difficulty */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Q{index + 1}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{q.category}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${q.type === 'hr' ? 'bg-blue-50 text-blue-600' : 'bg-violet-50 text-violet-600'}`}>
              {q.type === 'hr' ? 'HR' : 'Tech'}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${q.difficulty === 'Easy' ? 'bg-green-50 text-green-600' : q.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
              {q.difficulty}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-800 leading-snug">{q.text}</p>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-1">
              {q.skipped ? (
                <span className="text-xs text-slate-400 italic">Skipped</span>
              ) : (
                <>
                  <span className={`text-xs font-semibold ${c.text}`}>{scoreLabel(q.score)}</span>
                  {q.score >= 80 && <ChevronUp size={13} className="text-emerald-500" />}
                  {q.score >= 60 && q.score < 80 && <Minus size={13} className="text-amber-500" />}
                  {q.score < 60 && <ChevronDown size={13} className="text-red-500" />}
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-400">{open ? '▲ hide' : '▼ AI tip'}</span>
          </div>
        </div>
      </div>
      {/* Expandable AI tip section */}
      {open && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3 bg-amber-50/40">
          <div className="flex items-start gap-2">
            <Lightbulb size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 leading-relaxed">{q.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== MAIN InterviewResults PAGE COMPONENT =====
export const InterviewResults = () => {
  const navigate = useNavigate();
  const data = DUMMY_RESULT;

  // Calculate summary statistics
  const answered = data.questions.filter(q => !q.skipped);
  const avgScore = answered.length ? Math.round(answered.reduce((a, q) => a + q.score, 0) / answered.length) : 0;

  return (
    <DashboardLayout>
      {/* Print styles - hides buttons when printing */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .card { break-inside: avoid; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <button
              onClick={() => navigate('/interview')}
              className="no-print flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-3"
            >
              <ArrowLeft size={14} /> Back to Interview
            </button>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shadow-sm">
                <Trophy size={20} className="text-emerald-600" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">Interview Results</h1>
            </div>
            <p className="text-sm text-slate-500 mt-1" style={{ paddingLeft: '52px' }}>
              <span className="font-semibold text-slate-700">{data.positionTitle}</span>
              {' · '}{data.mode}{' · '}{data.date}{' · '}{data.duration}
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="no-print flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>

        {/* ── KPI CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Overall Score', value: data.overallScore, sub: '/100', icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Answered', value: answered.length, sub: `/ ${data.questions.length} Qs`, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Avg Score', value: avgScore, sub: '/100', icon: BarChart3, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Duration', value: data.duration, sub: 'total', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((kpi, i) => (
            <div key={i} className="card p-4 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center mb-3`}>
                <kpi.icon size={17} className={kpi.color} />
              </div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
              <p className="font-display text-2xl font-bold text-slate-900 mt-1 leading-none">
                {kpi.value}<span className="text-xs text-slate-400 font-normal ml-1">{kpi.sub}</span>
              </p>
            </div>
          ))}
        </div>


        {/* ── SKILL BREAKDOWN BARS ── */}
        <div className="card p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
              <Star size={14} className="text-violet-600" />
            </div>
            <p className="text-sm font-bold text-slate-800">AI Skill Breakdown</p>
          </div>
          <div className="space-y-5">
            {data.skills.map((s, i) => <SkillBar key={s.name} skill={s} index={i} />)}
          </div>
        </div>

        {/* ── PER-QUESTION CARDS ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <p className="text-sm font-bold text-slate-800">Per-Question Scores</p>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Click any card to reveal the AI tip</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.questions.map((q, i) => <QuestionScoreCard key={q.id} q={q} index={i} />)}
          </div>
        </div>

        {/* ── STRENGTHS & IMPROVEMENTS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6 border border-emerald-100 bg-emerald-50/20 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Zap size={16} className="text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-slate-800">Strengths</p>
            </div>
            <ul className="space-y-3">
              {data.feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                  <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 border border-amber-100 bg-amber-50/20 animate-slide-up" style={{ animationDelay: '80ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <TrendingUp size={16} className="text-amber-600" />
              </div>
              <p className="text-sm font-bold text-slate-800">Areas to Improve</p>
            </div>
            <ul className="space-y-3">
              {data.feedback.improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                  <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── AI COACH SUMMARY ── */}
        <div className="card p-6 border border-violet-100 bg-gradient-to-br from-violet-50/40 to-white mb-10 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <Brain size={16} className="text-violet-600" />
            </div>
            <p className="text-sm font-bold text-slate-800">AI Coach Summary</p>
            <span className="ml-auto text-[10px] bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-semibold">AI Generated</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{data.feedback.overall}</p>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="no-print flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/interview')}
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <RotateCcw size={15} /> Start New Session
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
          >
            <Download size={15} /> Download as PDF
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};
