import React from 'react';
import {
  GitCompare,
  TrendingUp,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { AssessmentResult } from '../types';
import { CATEGORIES, CATEGORY_ORDER } from '../data/questions';
import { CategoryIcon } from '../components/CategoryIcon';
import { getStatusColor, getStatusFromScore } from '../utils/scoring';

interface ComparisonPageProps {
  initialAssessment: AssessmentResult;
  latestAssessment: AssessmentResult;
  onRetakeAgain: () => void;
  onGoToDashboard: () => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  initialAssessment,
  latestAssessment,
  onRetakeAgain,
  onGoToDashboard,
}) => {
  const initialScore = initialAssessment.overallScore;
  const latestScore = latestAssessment.overallScore;
  const pointDiff = latestScore - initialScore;
  const percentDiff =
    initialScore > 0 ? (((latestScore - initialScore) / initialScore) * 100).toFixed(1) : '0';

  const initialStatus = getStatusFromScore(initialScore);
  const latestStatus = getStatusFromScore(latestScore);

  return (
    <div id="comparison-page" className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-2">
            <GitCompare className="h-3.5 w-3.5" />
            <span>Re-Assessment Analysis</span>
          </div>
          <h1 id="comparison-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assessment Comparison
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Quantifying lifestyle improvements between your baseline and current evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRetakeAgain}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Take Test Again</span>
          </button>
          <button
            type="button"
            onClick={onGoToDashboard}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Main Comparison Banner: Initial vs Latest */}
      <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center">
          {/* INITIAL ASSESSMENT */}
          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Initial Assessment
            </span>
            <div className="text-xs text-slate-500 mt-0.5">{initialAssessment.date}</div>
            <div className="mt-3 flex items-baseline justify-center gap-1">
              <span className="text-4xl font-black text-slate-800">{initialScore}</span>
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  getStatusColor(initialStatus).badgeBg
                }`}
              >
                {initialStatus}
              </span>
            </div>
          </div>

          {/* DELTA / IMPROVEMENT */}
          <div className="flex flex-col items-center justify-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-2">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Score Improvement
            </span>
            <div
              className={`text-2xl sm:text-3xl font-black mt-1 ${
                pointDiff > 0
                  ? 'text-emerald-600'
                  : pointDiff < 0
                  ? 'text-rose-600'
                  : 'text-slate-700'
              }`}
            >
              {pointDiff > 0 ? `+${pointDiff} points` : `${pointDiff} points`}
            </div>
            <span className="text-xs text-slate-500 mt-0.5">
              {pointDiff >= 0 ? `+${percentDiff}%` : `${percentDiff}%`} relative change
            </span>
          </div>

          {/* LATEST ASSESSMENT */}
          <div className="rounded-2xl bg-indigo-50/40 p-5 border border-indigo-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Latest Assessment
            </span>
            <div className="text-xs text-slate-500 mt-0.5">{latestAssessment.date}</div>
            <div className="mt-3 flex items-baseline justify-center gap-1">
              <span className="text-4xl font-black text-indigo-900">{latestScore}</span>
              <span className="text-xs text-indigo-400 font-semibold">/ 100</span>
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  getStatusColor(latestStatus).badgeBg
                }`}
              >
                {latestStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY BY CATEGORY COMPARISON */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">Category Comparison Breakdown</h2>
          <p className="text-xs text-slate-500">
            Side-by-side comparison across all 8 lifestyle dimensions.
          </p>
        </div>

        <div className="space-y-4">
          {CATEGORY_ORDER.map((catId) => {
            const catInfo = CATEGORIES[catId];
            const initVal = initialAssessment.categoryScores[catId] ?? 50;
            const latestVal = latestAssessment.categoryScores[catId] ?? 50;
            const diff = latestVal - initVal;

            return (
              <div
                key={catId}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700">
                    <CategoryIcon categoryId={catId} className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{catInfo.name}</h3>
                    <span className="text-[11px] text-slate-400">Weight: {catInfo.weight}%</span>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="flex-1 max-w-md">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-500">Initial: {initVal}</span>
                    <span className="text-indigo-700 font-bold">Latest: {latestVal}</span>
                  </div>
                  <div className="relative h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    {/* Initial mark */}
                    <div
                      className="absolute top-0 bottom-0 bg-slate-400 opacity-60 rounded-full"
                      style={{ width: `${initVal}%` }}
                    />
                    {/* Latest fill */}
                    <div
                      className={`h-full rounded-full transition-all ${
                        diff >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${latestVal}%` }}
                    />
                  </div>
                </div>

                {/* Delta Badge */}
                <div className="min-w-[110px] text-right sm:text-right">
                  <span
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${
                      diff > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : diff < 0
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{initVal}</span>
                    <span>→</span>
                    <span>{latestVal}</span>
                    <span className="ml-1">({diff > 0 ? `+${diff}` : diff})</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
