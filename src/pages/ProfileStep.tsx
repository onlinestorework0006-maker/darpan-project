import React, { useState } from 'react';
import { User, Briefcase, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileStepProps {
  initialProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  initialProfile,
  onSaveProfile,
  onCancel,
}) => {
  const [name, setName] = useState(initialProfile?.name ?? '');
  const [age, setAge] = useState(initialProfile?.age ? String(initialProfile.age) : '');
  const [status, setStatus] = useState<'Student' | 'Working Professional' | 'Other'>(
    initialProfile?.status ?? 'Student'
  );
  const [dailyHours, setDailyHours] = useState(
    initialProfile?.dailyHours ? String(initialProfile.dailyHours) : ''
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 110) {
      setError('Please enter a valid age between 10 and 110.');
      return;
    }

    const hoursNum = dailyHours.trim() ? parseFloat(dailyHours) : undefined;
    if (hoursNum !== undefined && (isNaN(hoursNum) || hoursNum < 0 || hoursNum > 24)) {
      setError('Daily study/work hours must be between 0 and 24.');
      return;
    }

    setError('');
    const profile: UserProfile = {
      name: name.trim(),
      age: ageNum,
      status,
      dailyHours: hoursNum,
      createdAt: initialProfile?.createdAt ?? new Date().toISOString(),
    };

    onSaveProfile(profile);
  };

  return (
    <div id="profile-step-container" className="mx-auto max-w-xl px-4 py-8 sm:py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 id="profile-title" className="text-xl font-bold text-slate-900">
              User Profile
            </h2>
            <p className="text-xs text-slate-500">
              Set up your profile before taking the Digital Wellness Assessment.
            </p>
          </div>
        </div>

        {error && (
          <div
            id="profile-error-alert"
            className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="user-name-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name or Preferred Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="user-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                required
              />
              <User className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="user-age-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Age <span className="text-rose-500">*</span>
            </label>
            <input
              id="user-age-input"
              type="number"
              min="10"
              max="110"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 21"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          {/* Occupation / Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Occupation / Current Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Student', 'Working Professional', 'Other'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  id={`status-option-${opt.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setStatus(opt)}
                  className={`flex flex-col items-center justify-center rounded-xl p-3 text-xs font-semibold transition-all border ${
                    status === opt
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-200'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="h-4 w-4 mb-1" />
                  <span className="text-center">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional: Daily study / work hours */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="user-hours-input" className="block text-xs font-semibold text-slate-700">
                Daily Study / Work Hours
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Optional</span>
            </div>
            <div className="relative">
              <input
                id="user-hours-input"
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                placeholder="e.g. 6.5"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
              />
              <Clock className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Helps calibrate daily screen fatigue and sedentary expectations.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Back
              </button>
            )}
            <button
              id="save-profile-continue-btn"
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
            >
              <span>Continue to Questionnaire</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
