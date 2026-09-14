import React from 'react';
import {
  TrendingUp,
  ArrowRight,
  RotateCcw,
  CalendarCheck2,
  AlertTriangle,
  Lightbulb,
  Award,
  CheckCircle2,
  BarChart2,
  Clock,
  Flame,
} from 'lucide-react';
import { AppStorageState } from '../types';
import { CATEGORIES, CATEGORY_ORDER } from '../data/questions';
import { ScoreGauge } from '../components/ScoreGauge';
import { CategoryBar } from '../components/CategoryBar';
import { CategoryIcon } from '../components/CategoryIcon';
import { getStatusColor } from '../utils/scoring';

interface DashboardPageProps {
  storageState: AppStorageState;
  onGoToCheckIn: () => void;
  onGoToProgress: () => void;
  onGoToRecommendations: () => void;
  onRetakeAssessment: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  storageState,
  onGoToCheckIn,
  onGoToProgress,
  onGoToRecommendations,
  onRetakeAssessment,
}) => {
  const { userProfile, latestAssessment, initialAssessment, dailyCheckIns } = storageState;

  if (!latestAssessment) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs">
          <Award className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h2 className="text-xl font-bold text-slate-900">No Assessment Completed Yet</h2>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Take the 25-question lifestyle assessment to calculate your initial Digital Wellness Score and unlock the dashboard.
          </p>
          <button
            type="button"
            onClick={onRetakeAssessment}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
          >
            Start Assessment Now
          </button>
        </div>
      </div>
    );
  }

  const currentScore = latestAssessment.overallScore;
  const previousAssessment =
    initialAssessment && initialAssessment.id !== latestAssessment.id
      ? initialAssessment
      : null;
  const previousScore = previousAssessment?.overallScore;

  // Calculate improvement percentage: ((current - previous) / previous) * 100
  let improvementPercent: string | null = null;
  let pointDiff: number | null = null;
  if (previousScore !== undefined && previousScore > 0) {
    const diff = currentScore - previousScore;
    pointDiff = diff;
    const pct = ((diff / previousScore) * 100).toFixed(1);
    improvementPercent = diff >= 0 ? `+${pct}%` : `${pct}%`;
  }

  const topWeakest = latestAssessment.topWeakAreas[0];
  const topWeakInfo = topWeakest ? CATEGORIES[topWeakest] : null;

  // Today check-in status
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckIn = dailyCheckIns.find((c) => c.date === todayStr);

  return (
    <div id="dashboard-page" className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      {/* Top Welcome Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>{userProfile?.status ?? 'Personal'} Wellness Portal</span>
            <span>•</span>
            <span>Last Assessed: {latestAssessment.date}</span>
          </div>
          <h1 id="dashboard-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {userProfile?.name ?? 'Wellness Explorer'}
          </h1>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            id="dashboard-retake-btn"
            type="button"
            onClick={onRetakeAssessment}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retake Assessment</span>
          </button>

          <button
            id="dashboard-checkin-btn"
            type="button"
            onClick={onGoToCheckIn}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <CalendarCheck2 className="h-4 w-4" />
            <span>{todayCheckIn ? 'Update Check-in' : 'Daily Check-in'}</span>
          </button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Card 1: Current Wellness Score */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Current Wellness Score
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                getStatusColor(latestAssessment.status).badgeBg
              }`}
            >
              {latestAssessment.status}
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">{currentScore}</span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Weighted assessment score</p>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full ${getStatusColor(latestAssessment.status).barColor}`}
              style={{ width: `${currentScore}%` }}
            />
          </div>
        </div>

        {/* Card 2: Previous Score & Improvement */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Score Trajectory
            </span>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="my-3">
            {previousScore !== undefined ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{previousScore}</span>
                  <span className="text-xs text-slate-400">→</span>
                  <span className="text-3xl font-black text-indigo-600">{currentScore}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold rounded-md px-1.5 py-0.5 ${
                      pointDiff && pointDiff >= 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {improvementPercent} ({pointDiff && pointDiff >= 0 ? `+${pointDiff}` : pointDiff} pts)
                  </span>
                  <span className="text-xs text-slate-500">since initial test</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-800">Initial Test</div>
                <p className="text-xs text-slate-500 mt-1">
                  Baseline established. Retake test after a week of check-ins to view trajectory.
                </p>
              </>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {previousAssessment ? `Baseline: ${previousAssessment.date}` : 'First assessment'}
          </span>
        </div>

        {/* Card 3: Top Improvement Priority */}
        <div className="rounded-3xl border border-rose-200/80 bg-rose-50/20 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Top Focus Area
            </span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="my-3">
            {topWeakInfo ? (
              <>
                <div className="flex items-center gap-2">
                  <CategoryIcon categoryId={topWeakest} className="h-5 w-5 text-rose-600" />
                  <span className="text-lg font-bold text-slate-900">{topWeakInfo.name}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xl font-black text-rose-700">
                    {latestAssessment.categoryScores[topWeakest]}/100
                  </span>
                  <span className="text-xs text-slate-500">Lowest category score</span>
                </div>
              </>
            ) : (
              <span className="text-xs text-slate-500">All categories balanced</span>
            )}
          </div>
          <button
            type="button"
            onClick={onGoToRecommendations}
            className="text-xs font-bold text-rose-700 hover:text-rose-800 inline-flex items-center gap-1"
          >
            <span>View Action Target</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Card 4: Today's Check-in & Streak */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Daily Check-in
            </span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <div className="my-3">
            {todayCheckIn ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-600">
                    {todayCheckIn.calculatedScore}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">/ 100 Today</span>
                </div>
                <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Logged for {todayStr}</span>
                </p>
              </>
            ) : (
              <>
                <div className="text-lg font-bold text-slate-800">Pending Today</div>
                <p className="text-xs text-slate-500 mt-1">
                  Log your sleep, screen time, exercise, and water intake.
                </p>
              </>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{dailyCheckIns.length} total logged check-ins</span>
            <button
              type="button"
              onClick={onGoToCheckIn}
              className="font-bold text-indigo-600 hover:underline"
            >
              {todayCheckIn ? 'Edit' : 'Log Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Middle Section: Category Breakdown + Recent Check-in Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Category Scores Overview (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Lifestyle Category Performance
              </h2>
              <p className="text-xs text-slate-500">
                8 weighted lifestyle pillars scaled 0–100.
              </p>
            </div>
            <button
              type="button"
              onClick={onGoToRecommendations}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Insights</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {CATEGORY_ORDER.map((catId) => (
              <CategoryBar
                key={catId}
                categoryId={catId}
                score={latestAssessment.categoryScores[catId] ?? 50}
                previousScore={previousAssessment?.categoryScores[catId]}
                isWeakest={latestAssessment.topWeakAreas.includes(catId)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Quick Progress Mini-Card & Action Checklist */}
        <div className="space-y-6">
          {/* Quick Progress Teaser */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Tracking Highlights</h3>
              <BarChart2 className="h-4 w-4 text-slate-400" />
            </div>

            {dailyCheckIns.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  You have recorded <span className="font-bold text-slate-900">{dailyCheckIns.length}</span> check-ins.
                </p>

                <div className="rounded-2xl bg-slate-50 p-3 space-y-2 border border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Avg Sleep:</span>
                    <span className="font-semibold text-slate-800">
                      {(
                        dailyCheckIns.reduce((acc, c) => acc + c.sleepHours, 0) /
                        dailyCheckIns.length
                      ).toFixed(1)}{' '}
                      hrs
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Avg Screen Time:</span>
                    <span className="font-semibold text-slate-800">
                      {(
                        dailyCheckIns.reduce((acc, c) => acc + c.screenTimeHours, 0) /
                        dailyCheckIns.length
                      ).toFixed(1)}{' '}
                      hrs
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Avg Daily Water:</span>
                    <span className="font-semibold text-slate-800">
                      {(
                        dailyCheckIns.reduce((acc, c) => acc + c.waterLiters, 0) /
                        dailyCheckIns.length
                      ).toFixed(1)}{' '}
                      L
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onGoToProgress}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  View Full Progress Graphs
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Clock className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-500">No daily logs yet.</p>
                <button
                  type="button"
                  onClick={onGoToCheckIn}
                  className="mt-3 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  Start First Daily Log
                </button>
              </div>
            )}
          </div>

          {/* Quick Recommendations Teaser */}
          <div className="rounded-3xl border border-indigo-100 bg-indigo-50/40 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-2">
              <Lightbulb className="h-4 w-4 text-indigo-600" />
              <span>Personalized Suggestion</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on your lowest score in{' '}
              <span className="font-bold text-indigo-900">{topWeakInfo?.name}</span>:
            </p>
            <div className="mt-3 rounded-2xl bg-white p-3.5 border border-indigo-100 text-xs text-indigo-950 font-medium">
              &quot;Commit to a concrete 30-minute change this week to build compounding habit momentum.&quot;
            </div>
            <button
              type="button"
              onClick={onGoToRecommendations}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              <span>Explore all recommendations</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
