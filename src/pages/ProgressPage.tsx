import React, { useState } from 'react';
import {
  TrendingUp,
  CalendarCheck2,
  Database,
  Moon,
  Smartphone,
  Activity,
  Droplets,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { AppStorageState } from '../types';

interface ProgressPageProps {
  storageState: AppStorageState;
  onGoToCheckIn: () => void;
  onLoadDemo: () => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  storageState,
  onGoToCheckIn,
  onLoadDemo,
}) => {
  const { dailyCheckIns, assessmentHistory, latestAssessment } = storageState;
  const [selectedRange, setSelectedRange] = useState<'7' | '14' | 'all'>('7');

  // Filter check-ins by selected range
  const sortedCheckIns = [...dailyCheckIns].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const displayCheckIns =
    selectedRange === '7'
      ? sortedCheckIns.slice(-7)
      : selectedRange === '14'
      ? sortedCheckIns.slice(-14)
      : sortedCheckIns;

  // Chart data mapping
  const chartData = displayCheckIns.map((item) => ({
    date: item.date.slice(5), // MM-DD
    fullDate: item.date,
    score: item.calculatedScore,
    sleepHours: item.sleepHours,
    screenTimeHours: item.screenTimeHours,
    exerciseMinutes: item.exerciseMinutes,
    waterLiters: item.waterLiters,
    stressLevel: item.stressLevel,
  }));

  const hasData = chartData.length > 0;

  // Empty State if no daily check-ins recorded yet
  if (!hasData) {
    return (
      <div id="progress-empty-state" className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
            <TrendingUp className="h-7 w-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            No Historical Check-in Data Yet
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            The progress page plots real lifestyle trends from your browser&apos;s LocalStorage. Once you complete daily check-ins, your wellness score, sleep, screen time, and hydration charts will appear here.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              id="empty-progress-checkin-btn"
              type="button"
              onClick={onGoToCheckIn}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <CalendarCheck2 className="h-4 w-4" />
              <span>Log First Daily Check-in</span>
            </button>

            <button
              id="empty-progress-demo-btn"
              type="button"
              onClick={onLoadDemo}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Database className="h-4 w-4 text-emerald-600" />
              <span>Load Realistic Demo Data</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Averages for the current filtered window
  const avgScore = Math.round(
    chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length
  );
  const avgSleep = (
    chartData.reduce((acc, curr) => acc + curr.sleepHours, 0) / chartData.length
  ).toFixed(1);
  const avgScreen = (
    chartData.reduce((acc, curr) => acc + curr.screenTimeHours, 0) / chartData.length
  ).toFixed(1);
  const avgExercise = Math.round(
    chartData.reduce((acc, curr) => acc + curr.exerciseMinutes, 0) / chartData.length
  );
  const avgWater = (
    chartData.reduce((acc, curr) => acc + curr.waterLiters, 0) / chartData.length
  ).toFixed(1);

  return (
    <div id="progress-page" className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      {/* Top Header & Range Filters */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Empirical Habit Trends</span>
          </div>
          <h1 id="progress-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Progress Tracking
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real data stored locally in your browser across {chartData.length} recorded daily check-ins.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1 self-start sm:self-auto">
          {(['7', '14', 'all'] as const).map((range) => (
            <button
              key={range}
              type="button"
              id={`filter-range-${range}`}
              onClick={() => setSelectedRange(range)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedRange === range
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {range === 'all' ? 'All Time' : `Last ${range} Days`}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center">
          <span className="text-[11px] text-slate-400 font-medium">Avg Wellness Score</span>
          <div className="text-xl font-black text-indigo-600 mt-0.5">{avgScore}/100</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center">
          <span className="text-[11px] text-slate-400 font-medium">Avg Sleep</span>
          <div className="text-xl font-black text-slate-800 mt-0.5">{avgSleep} hrs</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center">
          <span className="text-[11px] text-slate-400 font-medium">Avg Screen Time</span>
          <div className="text-xl font-black text-violet-600 mt-0.5">{avgScreen} hrs</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center">
          <span className="text-[11px] text-slate-400 font-medium">Avg Daily Exercise</span>
          <div className="text-xl font-black text-emerald-600 mt-0.5">{avgExercise} mins</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 font-medium">Avg Daily Water</span>
          <div className="text-xl font-black text-cyan-600 mt-0.5">{avgWater} L</div>
        </div>
      </div>

      {/* CHART 1: Digital Wellness Score Over Time */}
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Daily Wellness Score Over Time</h2>
            <p className="text-xs text-slate-500">
              Composite index combining sleep, screen time, exercise, water, and stress.
            </p>
          </div>
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
            Target: 75+
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                  fontSize: '12px',
                }}
              />
              <ReferenceLine y={75} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Target: 75', fill: '#10b981', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="score"
                name="Wellness Score"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 4, fill: '#4f46e5' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid of 2x2 Domain Specific Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* CHART 2: Sleep Trend */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                <Moon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sleep Duration (Hours)</h3>
                <span className="text-[11px] text-slate-400">Target: 7.0–9.0 hrs</span>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0, 12]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine y={7.0} stroke="#4f46e5" strokeDasharray="3 3" />
                <Bar dataKey="sleepHours" name="Sleep (hrs)" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Screen Time Trend */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Screen Time (Hours)</h3>
                <span className="text-[11px] text-slate-400">Lower is better (&lt;4.0 hrs)</span>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine y={4.0} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Target: <4h', fill: '#f43f5e', fontSize: 9 }} />
                <Line
                  type="monotone"
                  dataKey="screenTimeHours"
                  name="Screen Time (hrs)"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: Exercise Minutes Trend */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Exercise Duration (Minutes)</h3>
                <span className="text-[11px] text-slate-400">Target: 30+ mins</span>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" />
                <Bar dataKey="exerciseMinutes" name="Exercise (mins)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 5: Water Intake Trend */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                <Droplets className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hydration (Litres)</h3>
                <span className="text-[11px] text-slate-400">Target: 2.0+ L</span>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0, 4]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine y={2.0} stroke="#06b6d4" strokeDasharray="3 3" label={{ value: 'Target: 2.0L', fill: '#06b6d4', fontSize: 9 }} />
                <Line
                  type="monotone"
                  dataKey="waterLiters"
                  name="Water (L)"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#06b6d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
