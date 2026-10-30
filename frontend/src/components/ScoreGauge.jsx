import { useState, useEffect } from 'react';

export const ScoreGauge = ({ score, size = 140, label = 'Overall Score' }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!score) return;

    // Wait 300ms then start animating
    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const duration = 1200; // animation takes 1.2 seconds

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // 0 to 1
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out curve
        setAnimatedScore(Math.round(eased * score));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, 300);
    return () => clearTimeout(timeout);
  }, [score]);

  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const getStrokeColor = (s) => {
    if (s >= 80) return '#10b981'; // green
    if (s >= 60) return '#f59e0b'; // yellow
    return '#ef4444';              // red
  };

  const getTrackColor = (s) => {
    if (s >= 80) return '#d1fae5';
    if (s >= 60) return '#fef3c7';
    return '#fee2e2';
  };

  const getScoreLabel = (s) => {
    if (s >= 80) return 'Excellent';
    if (s >= 65) return 'Good';
    if (s >= 50) return 'Needs Work';
    return 'Poor';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG circle - rotated -90deg so the arc starts from top */}
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track circle (light color) */}
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke={getTrackColor(score)} strokeWidth={strokeWidth}
          />
          {/* Foreground arc circle (colored based on score) */}
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke={getStrokeColor(score)} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (animatedScore / 100) * circumference}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900 font-display">{animatedScore}</span>
          <span className="text-xs text-slate-500 font-medium">/ 100</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-sm font-semibold mt-0.5" style={{ color: getStrokeColor(score) }}>
          {getScoreLabel(score)}
        </p>
      </div>
    </div>
  );
};

// MiniScoreBar - small horizontal progress bar for individual score categories
// Props:
//   label - text label (e.g. "Keyword Match Rate")
//   score - value 0-100
export const MiniScoreBar = ({ label, score }) => {
  // animatedScore counts up from 0 to score
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedScore(score);
    }, 400);
    return () => clearTimeout(timeout);
  }, [score]);

  // Pick bar color based on score
  const getColor = (s) => {
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Pick text color based on score
  const getTextColor = (s) => {
    if (s >= 80) return 'text-emerald-600';
    if (s >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600 font-medium">{label}</span>
        <span className={`text-sm font-bold ${getTextColor(score)}`}>{animatedScore}%</span>
      </div>
      {/* Progress bar track */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        {/* Filled portion of the bar */}
        <div
          className={`h-full rounded-full transition-all duration-1000 ${getColor(score)}`}
          style={{ width: `${animatedScore}%` }}
        />
      </div>
    </div>
  );
};
