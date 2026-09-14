import React, { useState } from 'react';
import {
  CalendarCheck2,
  Moon,
  Smartphone,
  Activity,
  Droplets,
  Smile,
  Utensils,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { DailyCheckIn } from '../types';
import { calculateDailyScore, getStatusColor, getStatusFromScore } from '../utils/scoring';

interface DailyCheckInPageProps {
  checkIns: DailyCheckIn[];
  onSaveCheckIn: (checkIn: DailyCheckIn) => void;
  onGoToProgress: () => void;
}

export const DailyCheckInPage: React.FC<DailyCheckInPageProps> = ({
  checkIns,
  onSaveCheckIn,
  onGoToProgress,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const existingToday = checkIns.find((c) => c.date === todayStr);

  // Form states initialized with today's values if already logged or healthy defaults
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [sleepHours, setSleepHours] = useState(existingToday?.sleepHours ?? 7.5);
  const [screenTimeHours, setScreenTimeHours] = useState(existingToday?.screenTimeHours ?? 4.0);
  const [exerciseMinutes, setExerciseMinutes] = useState(existingToday?.exerciseMinutes ?? 30);
  const [waterLiters, setWaterLiters] = useState(existingToday?.waterLiters ?? 2.0);
  const [stressLevel, setStressLevel] = useState(existingToday?.stressLevel ?? 4);
  const [healthyMeals, setHealthyMeals] = useState(existingToday?.healthyMeals ?? 2);
  const [dayRating, setDayRating] = useState(existingToday?.dayRating ?? 8);
  const [notes, setNotes] = useState(existingToday?.notes ?? '');

  const [submittedScore, setSubmittedScore] = useState<number | null>(
    existingToday?.calculatedScore ?? null
  );
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Dynamic preview of daily score based on current sliders
  const previewScore = calculateDailyScore({
    sleepHours,
    screenTimeHours,
    exerciseMinutes,
    waterLiters,
    stressLevel,
    healthyMeals,
  });

  const previewStatus = getStatusFromScore(previewScore);
  const statusColor = getStatusColor(previewStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const checkIn: DailyCheckIn = {
      id: `checkin-${selectedDate}-${Date.now()}`,
      date: selectedDate,
      timestamp: new Date(selectedDate).getTime() || Date.now(),
      sleepHours: Number(sleepHours),
      screenTimeHours: Number(screenTimeHours),
      exerciseMinutes: Number(exerciseMinutes),
      waterLiters: Number(waterLiters),
      stressLevel: Number(stressLevel),
      healthyMeals: Number(healthyMeals),
      dayRating: Number(dayRating),
      notes: notes.trim() || undefined,
      calculatedScore: previewScore,
    };

    onSaveCheckIn(checkIn);
    setSubmittedScore(previewScore);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  return (
    <div id="daily-checkin-page" className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-2">
          <CalendarCheck2 className="h-3.5 w-3.5" />
          <span>Daily Habit Journal</span>
        </div>
        <h1 id="daily-checkin-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Daily Wellness Check-in
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Track your daily sleep, screen hours, physical exercise, water intake, and stress in 60 seconds.
        </p>
      </div>

      {/* Success Notification */}
      {showSuccessToast && (
        <div
          id="checkin-success-banner"
          className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-in fade-in"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>
              Daily check-in saved successfully! Today&apos;s calculated wellness score is{' '}
              <strong className="underline">{submittedScore}/100</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={onGoToProgress}
            className="rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
          >
            View Progress Chart
          </button>
        </div>
      )}

      {/* Main Grid: Check-in Form + Real-time Daily Score Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form: Left 2 Cols */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6"
        >
          {/* Date Picker & Existing Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <label htmlFor="checkin-date-input" className="block text-xs font-bold text-slate-700 mb-1">
                Log Date
              </label>
              <input
                id="checkin-date-input"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={todayStr}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            {existingToday && (
              <span className="text-xs text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full font-medium self-start sm:self-auto">
                Existing log: {existingToday.calculatedScore}/100 (editing)
              </span>
            )}
          </div>

          {/* 1. Sleep Duration (Hours) */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <Moon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Sleep Duration</h3>
                  <span className="text-[10px] text-slate-400">Target: 7–9 hours</span>
                </div>
              </div>
              <span className="text-sm font-black text-indigo-600">{sleepHours} hrs</span>
            </div>
            <input
              id="checkin-sleep-slider"
              type="range"
              min="3"
              max="12"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>3h</span>
              <span>7–9h (Optimal)</span>
              <span>12h</span>
            </div>
          </div>

          {/* 2. Screen Time (Hours) */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Daily Phone &amp; Screen Time</h3>
                  <span className="text-[10px] text-slate-400">Lower is healthier</span>
                </div>
              </div>
              <span className="text-sm font-black text-violet-600">{screenTimeHours} hrs</span>
            </div>
            <input
              id="checkin-screen-slider"
              type="range"
              min="0.5"
              max="12"
              step="0.5"
              value={screenTimeHours}
              onChange={(e) => setScreenTimeHours(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>&lt;2h (Great)</span>
              <span>4–6h</span>
              <span>12h+</span>
            </div>
          </div>

          {/* 3. Physical Exercise (Minutes) */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Exercise &amp; Active Movement</h3>
                  <span className="text-[10px] text-slate-400">Target: 30+ minutes</span>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-600">{exerciseMinutes} mins</span>
            </div>
            <input
              id="checkin-exercise-slider"
              type="range"
              min="0"
              max="90"
              step="5"
              value={exerciseMinutes}
              onChange={(e) => setExerciseMinutes(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0m</span>
              <span>30m (Target)</span>
              <span>90m+</span>
            </div>
          </div>

          {/* 4. Water Intake (Litres) */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                  <Droplets className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Water Intake</h3>
                  <span className="text-[10px] text-slate-400">Target: 2.0–2.5 litres</span>
                </div>
              </div>
              <span className="text-sm font-black text-cyan-600">{waterLiters} L</span>
            </div>
            <input
              id="checkin-water-slider"
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={waterLiters}
              onChange={(e) => setWaterLiters(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0.5L</span>
              <span>2.0L (Target)</span>
              <span>4.0L</span>
            </div>
          </div>

          {/* 5. Stress Level (1-10) */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                  <Smile className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Perceived Stress Level</h3>
                  <span className="text-[10px] text-slate-400">1: Calm, 10: Overwhelmed</span>
                </div>
              </div>
              <span className="text-sm font-black text-rose-600">{stressLevel} / 10</span>
            </div>
            <input
              id="checkin-stress-slider"
              type="range"
              min="1"
              max="10"
              step="1"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
          </div>

          {/* 6. Healthy Meals Eaten & Overall Day Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Healthy meals */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Utensils className="h-4 w-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900">Balanced Meals Eaten</h3>
              </div>
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {[0, 1, 2, 3].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setHealthyMeals(val)}
                    className={`rounded-xl py-2 text-xs font-bold border transition-colors ${
                      healthyMeals === val
                        ? 'border-amber-600 bg-amber-50 text-amber-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {val === 3 ? '3+' : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Overall Day Rating */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-900">Day Rating (1–10)</h3>
                <span className="text-xs font-bold text-indigo-600">{dayRating}/10</span>
              </div>
              <input
                id="checkin-day-rating-slider"
                type="range"
                min="1"
                max="10"
                step="1"
                value={dayRating}
                onChange={(e) => setDayRating(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Difficult</span>
                <span>Thriving</span>
              </div>
            </div>
          </div>

          {/* 7. Optional Notes */}
          <div>
            <label htmlFor="checkin-notes-input" className="block text-xs font-bold text-slate-700 mb-1">
              Reflections &amp; Notes (Optional)
            </label>
            <input
              id="checkin-notes-input"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Put phone down 30 mins before sleep, felt refreshed."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 flex justify-end">
            <button
              id="submit-checkin-btn"
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 px-7 py-3 text-xs font-bold text-white shadow-md hover:from-indigo-700 hover:to-teal-700 transition-all hover:scale-[1.01]"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Save Today&apos;s Check-in</span>
            </button>
          </div>
        </form>

        {/* Right Column: Real-Time Score Calculation & Transparent Formula */}
        <div className="space-y-6">
          {/* Live Daily Score Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Daily Score Preview
            </span>

            <div className="my-4">
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-5xl font-black text-slate-900">{previewScore}</span>
                <span className="text-base font-bold text-slate-400">/ 100</span>
              </div>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${statusColor.badgeBg}`}
                >
                  {previewStatus}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Calculated dynamically as you adjust your metrics above.
            </p>
          </div>

          {/* Transparent Scoring Formula Card */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 shadow-xs text-xs space-y-2.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Transparent Daily Formula</span>
            </h4>
            <ul className="space-y-1 text-slate-600">
              <li className="flex justify-between">
                <span>Screen Time:</span> <strong className="text-slate-900">25%</strong>
              </li>
              <li className="flex justify-between">
                <span>Sleep Duration:</span> <strong className="text-slate-900">20%</strong>
              </li>
              <li className="flex justify-between">
                <span>Physical Activity:</span> <strong className="text-slate-900">20%</strong>
              </li>
              <li className="flex justify-between">
                <span>Hydration Intake:</span> <strong className="text-slate-900">15%</strong>
              </li>
              <li className="flex justify-between">
                <span>Stress Level:</span> <strong className="text-slate-900">10%</strong>
              </li>
              <li className="flex justify-between">
                <span>Healthy Meals:</span> <strong className="text-slate-900">10%</strong>
              </li>
            </ul>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400">
              Total = 100%. Lower screen time &amp; lower stress yield higher points.
            </div>
          </div>

          {/* Recent History Preview */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900">Logged Entries ({checkIns.length})</h4>
              <button
                type="button"
                onClick={onGoToProgress}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                View Charts
              </button>
            </div>

            {checkIns.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {[...checkIns].reverse().slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{entry.date}</span>
                      <span className="text-[11px] text-slate-400 block">
                        {entry.sleepHours}h sleep • {entry.screenTimeHours}h screen
                      </span>
                    </div>
                    <span className="font-black text-indigo-600 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                      {entry.calculatedScore}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-3">No check-ins logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
