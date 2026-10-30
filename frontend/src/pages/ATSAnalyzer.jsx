import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Dropzone } from '../components/Dropzone';
import { ScoreGauge, MiniScoreBar } from '../components/ScoreGauge';
import {
  FileText, RotateCcw, CheckCircle, AlertTriangle, Info,
  TrendingUp, Search, Layout, Zap, ChevronRight, Download,
  Brain, AlignLeft, ArrowRight,
} from 'lucide-react';

//  HARDCODED DUMMY DATA
const dummyResult = {
  overallScore: 74,
  scores: {
    keywordMatch: 68,
    formatting: 82,
    impact: 71,
    readability: 79,
  },
  fileName: 'resume.pdf',
  wordCount: 487,
  pageCount: 1,
  hasJobDescription: false,
  missingKeywords: [
    { keyword: 'Agile methodology', priority: 'high', context: 'Project Management' },
    { keyword: 'REST API', priority: 'high', context: 'Technical Skills' },
    { keyword: 'CI/CD pipeline', priority: 'high', context: 'DevOps' },
    { keyword: 'cross-functional teams', priority: 'medium', context: 'Leadership' },
    { keyword: 'stakeholder management', priority: 'medium', context: 'Communication' },
    { keyword: 'TypeScript', priority: 'medium', context: 'Technical Skills' },
    { keyword: 'performance optimization', priority: 'low', context: 'Engineering' },
    { keyword: 'code review', priority: 'low', context: 'Engineering' },
  ],
  formattingIssues: [
    { type: 'error', title: 'Missing quantified achievements', description: 'Only 2 of 8 bullet points include measurable outcomes.', section: 'Experience' },
    { type: 'error', title: 'Inconsistent date formatting', description: 'Mix of "Jan 2022" and "January 2022" found.', section: 'Experience' },
    { type: 'warning', title: 'Contact section lacks LinkedIn URL', description: 'Include your LinkedIn profile URL to increase recruiter engagement.', section: 'Header' },
    { type: 'warning', title: 'Skills section not parsed correctly', description: 'Comma-separated skill lists may not be parsed by all ATS systems.', section: 'Skills' },
    { type: 'info', title: 'Summary section is too brief', description: 'Your professional summary is 1 sentence. Expand to 3-4 sentences.', section: 'Summary' },
  ],
  strongPoints: [
    'Clear chronological work history with no gaps',
    'Education section is properly formatted and complete',
    'Technical skills are clearly listed and scannable',
    'Resume length is optimal (1 page)',
  ],
};


const analysisStages = [
  { label: 'Parsing document structure...', progress: 15 },
  { label: 'Extracting keywords and phrases...', progress: 30 },
  { label: 'Matching against job description...', progress: 48 },
  { label: 'Running ATS compliance check...', progress: 62 },
  { label: 'Scoring keyword density...', progress: 75 },
  { label: 'Evaluating formatting rules...', progress: 88 },
  { label: 'Generating impact analysis...', progress: 96 },
  { label: 'Finalizing report...', progress: 100 },
];


const getPriorityClass = (priority) => {
  if (priority === 'high') return 'bg-red-50 text-red-700 border border-red-200';
  if (priority === 'medium') return 'bg-amber-50 text-amber-700 border border-amber-200';
  return 'bg-slate-50 text-slate-600 border border-slate-200';
};

const getIssueStyles = (type) => {
  if (type === 'error') return { badge: 'bg-red-100 text-red-700', icon: 'text-red-500', border: 'border-l-red-400' };
  if (type === 'warning') return { badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500', border: 'border-l-amber-400' };
  return { badge: 'bg-blue-100 text-blue-700', icon: 'text-blue-500', border: 'border-l-blue-400' };
};

const ProgressBar = ({ progress, stage }) => (
  <div className="card p-8 max-w-lg mx-auto text-center animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
      <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-1">Analyzing Your Resume</h3>
    <p className="text-sm text-slate-500 mb-6">{stage}</p>
    <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
      <div
        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-xs text-slate-400 font-medium">{progress}% complete</p>
  </div>
);

const KeywordBadge = ({ keyword, priority }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getPriorityClass(priority)}`}>
    {keyword}
  </span>
);

const IssueItem = ({ issue }) => {
  const styles = getIssueStyles(issue.type);

  // Pick the right icon based on issue type
  const Icon = issue.type === 'info' ? Info : AlertTriangle;

  return (
    <div className={`border-l-4 pl-4 py-1 ${styles.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Icon size={15} className={`mt-0.5 flex-shrink-0 ${styles.icon}`} />
          <div>
            <p className="text-sm font-semibold text-slate-800">{issue.title}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{issue.description}</p>
          </div>
        </div>
        <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-md ${styles.badge}`}>{issue.section}</span>
      </div>
    </div>
  );
};

// InterviewCTA banner that links to the interview prep page
const InterviewCTA = ({ onPrepare }) => (
  <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-navy-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
        <Brain size={22} className="text-emerald-400" />
      </div>
      <div>
        <p className="font-semibold text-white text-base">Ready to ace the interview?</p>
        <p className="text-sm text-slate-400 mt-0.5">Jump straight into targeted interview prep.</p>
      </div>
    </div>
    <button
      onClick={onPrepare}
      className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition-colors duration-200 shadow-lg"
    >
      Prepare for Interview <ArrowRight size={16} />
    </button>
  </div>
);

// ResultsDashboard shows all the analysis results after the progress bar finishes
const ResultsDashboard = ({ result, onReset, onPrepareInterview }) => {
  // Group keywords by priority (high, medium, low)
  const priorityGroups = {
    high: result.missingKeywords.filter((k) => k.priority === 'high'),
    medium: result.missingKeywords.filter((k) => k.priority === 'medium'),
    low: result.missingKeywords.filter((k) => k.priority === 'low'),
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* Top bar: filename info + action buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <FileText size={18} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">{result.fileName}</h2>
            <p className="text-xs text-slate-500">{result.pageCount} page · {result.wordCount} words</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline text-xs px-3 py-2 gap-1.5">
            <Download size={14} /> Export Report
          </button>
          <button onClick={onReset} className="btn-secondary text-xs px-3 py-2 gap-1.5">
            <RotateCcw size={14} /> New Analysis
          </button>
        </div>
      </div>

      {/* Interview CTA banner */}
      <InterviewCTA onPrepare={onPrepareInterview} />

      {/* Score gauge + breakdown bars */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="card p-6 flex flex-col items-center justify-center lg:col-span-1">
          <ScoreGauge score={result.overallScore} size={148} />
        </div>
        <div className="card p-6 lg:col-span-3">
          <h3 className="text-sm font-semibold text-slate-700 mb-5">Score Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <MiniScoreBar label="Keyword Match Rate" score={result.scores.keywordMatch} />
            <MiniScoreBar label="Formatting Compliance" score={result.scores.formatting} />
            <MiniScoreBar label="Impact & Metrics" score={result.scores.impact} />
            <MiniScoreBar label="Readability Score" score={result.scores.readability} />
          </div>
        </div>
      </div>

      {/* Missing keywords + strong points side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <Search size={16} className="text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-700">Missing Keywords</h3>
            <span className="ml-auto text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-md font-medium">
              {result.missingKeywords.length} missing
            </span>
          </div>
          {/* Show keywords grouped by priority */}
          {Object.entries(priorityGroups).map(([priority, keywords]) => keywords.length > 0 && (
            <div key={priority} className="mb-4 last:mb-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 capitalize">{priority} Priority</p>
              <div className="flex flex-wrap gap-2">
                {keywords.map((k) => <KeywordBadge key={k.keyword} keyword={k.keyword} priority={k.priority} />)}
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle size={16} className="text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-700">Strong Points</h3>
          </div>
          <ul className="space-y-3">
            {result.strongPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-slate-600">
                <ChevronRight size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Formatting issues list */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Layout size={16} className="text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-700">Formatting & Compliance Issues</h3>
          <span className="ml-auto text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
            {result.formattingIssues.length} issues
          </span>
        </div>
        <div className="space-y-4">
          {result.formattingIssues.map((issue) => <IssueItem key={issue.title} issue={issue} />)}
        </div>
      </div>
    </div>
  );
};

// UploadForm - the initial form shown before analysis starts
const UploadForm = ({ jobDescription, onJobDescriptionChange, onFileSelected }) => (
  <div className="space-y-4 max-w-xl animate-slide-up">
    <Dropzone onFileSelected={onFileSelected} />

    <div className="card p-5">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
        <AlignLeft size={15} className="text-emerald-600" />
        Job Description
        <span className="ml-auto text-xs font-normal text-slate-400">Optional but recommended</span>
      </label>
      <textarea
        value={jobDescription}
        onChange={(e) => onJobDescriptionChange(e.target.value)}
        placeholder="Paste the job description here to get a tailored keyword match score..."
        rows={6}
        className="input-field resize-none text-sm leading-relaxed"
      />
    </div>

    <div className="card p-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">What We Analyze</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Search, label: 'Keyword density & match' },
          { icon: Layout, label: 'Formatting & structure' },
          { icon: TrendingUp, label: 'Achievement impact score' },
          { icon: Zap, label: 'ATS parser compatibility' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-slate-600">
            <Icon size={14} className="text-emerald-500 flex-shrink-0" />
            {label}
          </div>
        ))}
      </div>
    </div>
  </div>
);


export const ATSAnalyzer = () => {
  const navigate = useNavigate();

  // status: 'idle'waiti upload, 'analyzing' 'complete'
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleFileSelected = async (file) => {
    setStatus('analyzing');
    setProgress(0);

    for (const stageItem of analysisStages) {
      await new Promise((resolve) => setTimeout(resolve, 550)); // wait 550ms per stage
      setProgress(stageItem.progress);
      setStage(stageItem.label);
    }


    setStatus('complete');
  };


  const handleReset = () => {
    setStatus('idle');
    setProgress(0);
    setStage('');
    setJobDescription('');
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-2">ATS Resume Analyzer</h1>
          <p className="text-slate-500">Upload your resume and optionally paste a job description to get a precise compatibility report.</p>
        </div>

        {/* Show different content based on the current status */}
        {status === 'idle' && (
          <UploadForm
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
            onFileSelected={handleFileSelected}
          />
        )}

        {status === 'analyzing' && (
          <ProgressBar progress={progress} stage={stage} />
        )}

        {status === 'complete' && (
          <ResultsDashboard
            result={dummyResult}
            onReset={handleReset}
            onPrepareInterview={() => navigate('/interview')}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
