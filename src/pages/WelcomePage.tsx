import React from 'react';
import {
  ClipboardCheck,
  TrendingUp,
  Lightbulb,
  Calendar,
  ArrowRight,
  Database,
  Sparkles,
  Shield,
  Layers,
  Heart,
} from 'lucide-react';
import { AssessmentResult, UserProfile } from '../types';

interface WelcomePageProps {
  onStartAssessment: () => void;
  onGoToDashboard: () => void;
  onLoadDemo: () => void;
  latestAssessment: AssessmentResult | null;
  userProfile: UserProfile | null;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onStartAssessment,
  onGoToDashboard,
  onLoadDemo,
  latestAssessment,
  userProfile,
}) => {
  return (
    <div id="welcome-page" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-teal-300 backdrop-blur-xs mb-4">
            <Sparkles className="h-3.5 w-3.5 text-teal-300" />
            <span>Personalized Lifestyle Assessment &amp; Tracking</span>
          </div>

          <h1 id="welcome-hero-title" className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Digital Wellness
          </h1>
          <p id="welcome-hero-subtitle" className="mt-3 text-lg sm:text-xl font-medium text-slate-300">
            Understand your lifestyle. Improve your daily habits.
          </p>

          <p className="mt-4 text-sm sm:text-base text-slate-300/90 leading-relaxed">
            Assess your daily sleep, screen consumption, physical movement, hydration, nutrition, and routine focus. Receive a transparent Digital Wellness Score and tailored, actionable habit recommendations.
          </p>

          {/* Quick Resume Card if assessment exists */}
          {latestAssessment && (
            <div
              id="resume-assessment-card"
              className="mt-6 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs text-teal-300 font-medium">Welcome back, {userProfile?.name ?? 'Explorer'}!</p>
                <p className="text-sm font-semibold text-white">
                  Current Wellness Score: <span className="text-teal-300 font-bold">{latestAssessment.overallScore}/100</span> ({latestAssessment.status})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onGoToDashboard}
                  className="rounded-xl bg-teal-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-teal-300 transition-colors shadow-sm"
                >
                  Open Dashboard
                </button>
                <button
                  type="button"
                  onClick={onStartAssessment}
                  className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  Retake Test
                </button>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              id="start-assessment-cta-btn"
              type="button"
              onClick={onStartAssessment}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg hover:from-teal-300 hover:to-emerald-300 transition-all hover:scale-[1.01] focus:outline-hidden focus:ring-2 focus:ring-teal-300"
            >
              <span>{latestAssessment ? 'Retake Lifestyle Assessment' : 'Start Assessment'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              id="welcome-load-demo-btn"
              type="button"
              onClick={onLoadDemo}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-3.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Database className="h-4 w-4 text-teal-400" />
              <span>Load College Demo Data</span>
            </button>
          </div>
        </div>

        {/* Decorative background visual */}
        <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500/20 to-teal-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* How It Works Section */}
      <div id="how-it-works-section" className="mt-14">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            How It Works
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            A structured, 4-step framework to diagnose and optimize your lifestyle rhythm.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Step 1 */}
          <div className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition-all hover:border-indigo-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mb-4 group-hover:scale-105 transition-transform">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Step 1</span>
            <h3 className="text-base font-semibold text-slate-900 mt-1">Assess your lifestyle</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Answer 25 targeted questions covering sleep patterns, screen screen-time, physical activity, hydration, nutrition, and stress.
            </p>
          </div>

          {/* Step 2 */}
          <div className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition-all hover:border-teal-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 font-bold text-lg mb-4 group-hover:scale-105 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Step 2</span>
            <h3 className="text-base font-semibold text-slate-900 mt-1">Analyze your habits</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Receive an objective Digital Wellness Score out of 100 with weighted category breakdowns and your top 3 improvement priorities.
            </p>
          </div>

          {/* Step 3 */}
          <div className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition-all hover:border-amber-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg mb-4 group-hover:scale-105 transition-transform">
              <Lightbulb className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Step 3</span>
            <h3 className="text-base font-semibold text-slate-900 mt-1">Get recommendations</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Review specific, rule-based lifestyle changes detailing the problem, why it matters, a practical action, and measurable target.
            </p>
          </div>

          {/* Step 4 */}
          <div className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition-all hover:border-blue-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-lg mb-4 group-hover:scale-105 transition-transform">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 4</span>
            <h3 className="text-base font-semibold text-slate-900 mt-1">Track your progress</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Log 60-second daily check-ins, view trend charts over time, and retake the questionnaire to quantify your lifestyle gains.
            </p>
          </div>
        </div>
      </div>

      {/* College Presentation Callout */}
      <div className="mt-12 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/40 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">College Subject Demonstration Mode</h4>
            <p className="text-xs text-slate-600">
              Need to demonstrate results and charts instantly during grading? Click &quot;Load Demo Data&quot; to populate 7 days of check-ins and an initial vs. latest assessment comparison.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLoadDemo}
          className="shrink-0 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          Load Demo Data
        </button>
      </div>
    </div>
  );
};
