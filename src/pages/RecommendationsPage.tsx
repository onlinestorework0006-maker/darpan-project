import React, { useState } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  CalendarCheck2,
  Filter,
  ArrowRight,
  ShieldAlert,
  Target,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';
import { AssessmentResult, CategoryId, Recommendation } from '../types';
import { CATEGORIES, CATEGORY_ORDER } from '../data/questions';
import { generateRecommendations } from '../utils/recommendations';
import { CategoryIcon } from '../components/CategoryIcon';

interface RecommendationsPageProps {
  assessment: AssessmentResult;
  onGoToCheckIn: () => void;
  onGoToDashboard: () => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  assessment,
  onGoToCheckIn,
  onGoToDashboard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const allRecommendations = generateRecommendations({
    categoryScores: assessment.categoryScores,
    answers: assessment.answers,
    topWeakAreas: assessment.topWeakAreas,
  });

  const filteredRecommendations =
    selectedCategory === 'all'
      ? allRecommendations
      : allRecommendations.filter((r) => r.categoryId === selectedCategory);

  const toggleAction = (recId: string) => {
    setCompletedActions((prev) => ({
      ...prev,
      [recId]: !prev[recId],
    }));
  };

  const completedCount = Object.values(completedActions).filter(Boolean).length;

  return (
    <div id="recommendations-page" className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 mb-2">
            <Lightbulb className="h-3.5 w-3.5" />
            <span>Rule-Based Lifestyle Insights</span>
          </div>
          <h1 id="recommendations-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personalized Recommendations
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Tailored suggestions derived directly from your assessment answers and weakest category scores.
          </p>
        </div>

        {/* Action Completion Tracker */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Adopted Habits</div>
            <div className="text-sm font-bold text-slate-900">
              {completedCount} of {allRecommendations.length} committed
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Recommendations ({allRecommendations.length})
        </button>

        {CATEGORY_ORDER.map((catId) => {
          const recCount = allRecommendations.filter((r) => r.categoryId === catId).length;
          if (recCount === 0) return null;
          const isWeak = assessment.topWeakAreas.includes(catId);

          return (
            <button
              key={catId}
              type="button"
              onClick={() => setSelectedCategory(catId)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === catId
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isWeak
                  ? 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CategoryIcon categoryId={catId} className="h-3.5 w-3.5" />
              <span>{CATEGORIES[catId].name.split(' ')[0]}</span>
              <span className="rounded-full bg-slate-100/30 px-1 text-[10px]">({recCount})</span>
            </button>
          );
        })}
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-6">
        {filteredRecommendations.map((rec) => {
          const isCompleted = !!completedActions[rec.id];
          const isTopWeak = assessment.topWeakAreas.includes(rec.categoryId);

          return (
            <div
              key={rec.id}
              id={`recommendation-card-${rec.id}`}
              className={`rounded-3xl border bg-white p-6 sm:p-7 shadow-xs transition-all ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : isTopWeak
                  ? 'border-slate-200 hover:border-indigo-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isTopWeak
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-indigo-50 text-indigo-600'
                    }`}
                  >
                    <CategoryIcon categoryId={rec.categoryId} className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {rec.categoryName}
                      </span>
                      {isTopWeak && (
                        <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                          Priority Weak Area
                        </span>
                      )}
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          rec.severity === 'high'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {rec.severity} Impact
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                      {rec.title}
                    </h3>
                  </div>
                </div>

                {/* Mark as committed button */}
                <button
                  type="button"
                  id={`commit-btn-${rec.id}`}
                  onClick={() => toggleAction(rec.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{isCompleted ? 'Habit Committed' : 'Commit to Habit'}</span>
                </button>
              </div>

              {/* 4 Required Fields: Problem, Why It Matters, Action, Target */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Problem */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                    <span>Identified Issue</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.problem}</p>
                </div>

                {/* Why It Matters */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Why It Matters</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.whyItMatters}</p>
                </div>

                {/* Simple Action */}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Recommended Action</span>
                  </div>
                  <p className="text-xs text-indigo-950 font-medium leading-relaxed">{rec.action}</p>
                </div>

                {/* Suggested Target */}
                <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900 mb-1">
                    <Target className="h-3.5 w-3.5 text-teal-600" />
                    <span>Measurable Target</span>
                  </div>
                  <p className="text-xs text-teal-950 font-medium leading-relaxed">{rec.suggestedTarget}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA to Daily Check-in */}
      <div className="mt-12 rounded-3xl border border-slate-200 bg-gradient-to-r from-indigo-900 to-slate-900 p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div>
          <h3 className="text-lg font-bold">Put Recommendations into Practice</h3>
          <p className="mt-1 text-xs text-slate-300 max-w-md">
            Daily consistency is where real wellness gains happen. Track today’s sleep, screen time, exercise, and hydration in 60 seconds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoToDashboard}
            className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
          >
            Dashboard
          </button>
          <button
            type="button"
            id="recommendations-checkin-cta"
            onClick={onGoToCheckIn}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-teal-300 transition-colors shadow-sm"
          >
            <CalendarCheck2 className="h-4 w-4" />
            <span>Log Daily Check-in</span>
          </button>
        </div>
      </div>
    </div>
  );
};
