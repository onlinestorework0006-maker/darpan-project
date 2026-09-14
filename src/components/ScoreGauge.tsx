import React from 'react';
import { getStatusColor, getStatusFromScore } from '../utils/scoring';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  label?: string;
  sublabel?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 'lg',
  showStatus = true,
  label = 'Digital Wellness Score',
  sublabel,
}) => {
  const status = getStatusFromScore(score);
  const color = getStatusColor(status);

  // SVG parameters
  const dimension = size === 'lg' ? 180 : size === 'md' ? 130 : 90;
  const strokeWidth = size === 'lg' ? 14 : size === 'md' ? 10 : 8;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let strokeColorClass = '#10b981'; // emerald
  if (score < 40) strokeColorClass = '#f43f5e'; // rose
  else if (score < 60) strokeColorClass = '#f97316'; // orange
  else if (score < 75) strokeColorClass = '#f59e0b'; // amber
  else if (score < 90) strokeColorClass = '#0ea5e9'; // sky

  return (
    <div id={`score-gauge-${score}`} className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg width={dimension} height={dimension} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={strokeColorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span
            className={`font-black tracking-tight text-slate-900 ${
              size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-xl'
            }`}
          >
            {clampedScore}
          </span>
          <span
            className={`font-semibold text-slate-400 ${
              size === 'lg' ? 'text-xs' : 'text-[10px]'
            }`}
          >
            / 100
          </span>
        </div>
      </div>

      {label && (
        <div className="mt-3 text-center">
          <p className="text-sm font-semibold text-slate-800">{label}</p>
          {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
        </div>
      )}

      {showStatus && (
        <div className="mt-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${color.badgeBg}`}
          >
            {status}
          </span>
        </div>
      )}
    </div>
  );
};
