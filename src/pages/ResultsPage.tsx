import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  CalendarCheck2,
  RotateCcw,
  Layers,
} from 'lucide-react';
import { AssessmentResult, CategoryId } from '../types';
import { CATEGORIES, CATEGORY_ORDER } from '../data/questions';
import { ScoreGauge } from '../components/ScoreGauge';
import { CategoryBar } from '../components/CategoryBar';
import { CategoryIcon } from '../components/CategoryIcon';
import { getStatusColor, getStatusFromScore } from '../utils/scoring';

interface ResultsPageProps {
  currentAssessment: AssessmentResult;
  previousAssessment: AssessmentResult | null;
  onViewRecommendations: () => void;
  onGoToDashboard: () => void;
  onRetakeAssessment: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  currentAssessment,
  previousAssessment,
  onViewRecommendations,
  onGoToDashboard,
  onRetakeAssessment,
}) => {
  const { overallScore, status, categoryScores, topWeakAreas } = currentAssessment;
  const statusColor = getStatusColor(status);

  const deltaScore =
    previousAssessment && previousAssessment.id !== currentAssessment.id
      ? overallScore - previousAssessment.overallScore
      : null;

  return (
    <div id="results-page" className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* Top Banner / Celebration */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Assessment Completed • {currentAssessment.date}</span>
        </div>
        <h1 id="results-title" className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Your Digital Wellness Score
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Based on your self-reported habits across 8 key dimensions of daily lifestyle.
        </p>
      </div>

      {/* Hero Score Card */}
      <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Gauge Center/Left */}
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
            <ScoreGauge score={overallScore} size="lg" showStatus={false} />
            <div className="mt-4 text-center">
              <span
                className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold ${statusColor.badgeBg}`}
              >
                {status}
              </span>
            </div>
          </div>

          {/* Score Explanation & Interpretation */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Score Diagnosis: <span className={statusColor.badgeText}>{status}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                {overallScore >= 90 &&
                  'Your daily habits demonstrate excellent balance. You maintain optimal sleep, mindful screen consumption, and stable daily routines.'}
                {overallScore >= 75 &&
                  overallScore < 90 &&
                  'You possess solid wellness fundamentals with notable strengths. Addressing 1–2 specific areas will noticeably boost your focus and vitality.'}
                {overallScore >= 60 &&
                  overallScore < 75 &&
                  'Your routine shows healthy baseline practices but suffers from frequent digital friction or irregular sleep patterns.'}
                {overallScore >= 40 &&
                  overallScore < 60 &&
                  'Several daily habits need active attention. High screen exposure, sleep disruption, or high stress may be causing daytime fatigue.'}
                {overallScore < 40 &&
                  'High priority for improvement. Multiple lifestyle dimensions are significantly out of rhythm. Structured small steps can bring fast relief.'}
              </p>
            </div>

            {/* Previous assessment delta callout */}
            {deltaScore !== null && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-700">
                    Previous Assessment Comparison:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">
                    {previousAssessment?.overallScore} → {overallScore}
                  </span>
                  <span
                    className={`text-xs font-bold rounded-md px-2 py-0.5 ${
                      deltaScore > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : deltaScore < 0
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {deltaScore > 0 ? `+${deltaScore} points` : `${deltaScore} points`}
                  </span>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                id="results-recommendations-cta"
                type="button"
                onClick={onViewRecommendations}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                <span>View Personalized Recommendations</span>
              </button>

              <button
                id="results-dashboard-cta"
                type="button"
                onClick={onGoToDashboard}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TOP AREAS FOR IMPROVEMENT (Weak areas) */}
      <div id="top-weak-areas-section" className="mb-10">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Top Areas for Improvement</h2>
            <p className="text-xs text-slate-500">
              The 3 lowest category scores identified from your assessment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topWeakAreas.map((catId, index) => {
            const info = CATEGORIES[catId];
            const score = categoryScores[catId] ?? 50;
            const status = getStatusFromScore(score);
            const color = getStatusColor(status);

            return (
              <div
                key={catId}
                id={`weak-area-card-${catId}`}
                className="rounded-2xl border border-rose-200/80 bg-rose-50/20 p-5 shadow-xs relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-200 text-xs font-black text-rose-800">
                      #{index + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{info.name}</h3>
                  </div>
                  <span className="text-base font-black text-rose-700">{score}/100</span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 mb-3">
                  <div className={`h-full ${color.barColor}`} style={{ width: `${score}%` }} />
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{info.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ALL CATEGORIES BREAKDOWN */}
      <div id="all-categories-breakdown" className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Category Scores Breakdown</h2>
            <p className="text-xs text-slate-500">
              Detailed performance across all 8 weighted lifestyle dimensions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORY_ORDER.map((catId) => {
            const isWeak = topWeakAreas.includes(catId);
            const weakRank = isWeak ? topWeakAreas.indexOf(catId) + 1 : undefined;

            return (
              <CategoryBar
                key={catId}
                categoryId={catId}
                score={categoryScores[catId] ?? 50}
                previousScore={previousAssessment?.categoryScores[catId]}
                isWeakest={isWeak}
                rank={weakRank}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={onRetakeAssessment}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Retake Assessment</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoToDashboard}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={onViewRecommendations}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <span>Personalized Recommendations</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
