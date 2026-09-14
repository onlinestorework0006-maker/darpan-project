import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { CategoryId, Question } from '../types';
import { CATEGORIES, CATEGORY_ORDER, QUESTIONS } from '../data/questions';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  getDraftAnswers,
  saveDraftAnswers,
} from '../utils/storage';

interface QuestionnairePageProps {
  onComplete: (answers: Record<number, number>) => void;
  onCancel: () => void;
}

export const QuestionnairePage: React.FC<QuestionnairePageProps> = ({
  onComplete,
  onCancel,
}) => {
  // Current category section index (0 to 7)
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    return getDraftAnswers();
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-save draft on every answer change
  useEffect(() => {
    saveDraftAnswers(answers);
  }, [answers]);

  const currentCategoryId: CategoryId = CATEGORY_ORDER[sectionIndex];
  const currentCategoryInfo = CATEGORIES[currentCategoryId];
  const currentQuestions = QUESTIONS.filter((q) => q.categoryId === currentCategoryId);

  // Total answers count
  const answeredTotalCount = QUESTIONS.filter((q) => answers[q.id] !== undefined).length;
  const totalQuestions = QUESTIONS.length;
  const progressPercent = Math.round((answeredTotalCount / totalQuestions) * 100);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setValidationError(null);
  };

  const handleSliderChange = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setValidationError(null);
  };

  const validateCurrentSection = (): boolean => {
    const missing = currentQuestions.filter((q) => answers[q.id] === undefined);
    if (missing.length > 0) {
      setValidationError(
        `Please answer all questions in this section before continuing (${missing.length} remaining).`
      );
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleNextSection = () => {
    if (!validateCurrentSection()) return;

    if (sectionIndex < CATEGORY_ORDER.length - 1) {
      setSectionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevSection = () => {
    setValidationError(null);
    if (sectionIndex > 0) {
      setSectionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentSection()) return;

    // Verify all 25 questions are answered
    const unanswered = QUESTIONS.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      setValidationError(
        `There are ${unanswered.length} unanswered questions across the assessment. Please complete them.`
      );
      return;
    }

    onComplete(answers);
  };

  return (
    <div id="questionnaire-page" className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      {/* Top Header & Overall Progress */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Lifestyle Assessment
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Section {sectionIndex + 1} of {CATEGORY_ORDER.length}: {currentCategoryInfo.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">
              {answeredTotalCount} of {totalQuestions} answered ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Multi-step progress bar */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-teal-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Section Indicators */}
        <div className="mt-3 flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {CATEGORY_ORDER.map((catId, idx) => {
            const isCompleted = QUESTIONS.filter((q) => q.categoryId === catId).every(
              (q) => answers[q.id] !== undefined
            );
            const isCurrent = idx === sectionIndex;

            return (
              <button
                key={catId}
                type="button"
                onClick={() => {
                  // Allow jumping only to already visited or completed sections
                  setSectionIndex(idx);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                ) : (
                  <span>{idx + 1}</span>
                )}
                <span className="hidden md:inline">{CATEGORIES[catId].name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Section Header Card */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <CategoryIcon categoryId={currentCategoryId} className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">{currentCategoryInfo.name}</h2>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              Weight: {currentCategoryInfo.weight}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{currentCategoryInfo.description}</p>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div
          id="questionnaire-validation-error"
          className="mb-6 flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 animate-in fade-in"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Questions in Current Section */}
      <div className="space-y-6">
        {currentQuestions.map((q, qIndex) => {
          const isAnswered = answers[q.id] !== undefined;

          return (
            <div
              key={q.id}
              id={`question-card-${q.id}`}
              className={`rounded-2xl border p-5 sm:p-6 transition-all bg-white shadow-xs ${
                isAnswered ? 'border-slate-200' : 'border-slate-200 ring-1 ring-indigo-50'
              }`}
            >
              {/* Question Label */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                    {q.id}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                      {q.text}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Question {q.id} of {totalQuestions}
                    </span>
                  </div>
                </div>

                {isAnswered && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Answered</span>
                  </span>
                )}
              </div>

              {/* Multiple Choice Options */}
              {q.type === 'choice' && q.options && (
                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = answers[q.id] === optIdx;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        id={`q-${q.id}-opt-${optIdx}`}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full flex items-center justify-between rounded-xl p-3 sm:p-3.5 text-left text-xs sm:text-sm font-medium transition-all border ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/70'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                          </div>
                          <span>{opt.label}</span>
                        </div>

                        {opt.description && (
                          <span className="hidden sm:inline text-[11px] text-slate-400 font-normal">
                            {opt.description}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Slider Option */}
              {q.type === 'slider' && (
                <div className="pt-2">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">{q.minLabel}</span>
                    <div className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3.5 py-1 text-indigo-700 font-bold text-base">
                      <span>{answers[q.id] ?? 5}</span>
                      <span className="text-xs text-indigo-400 font-medium">/ 10</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{q.maxLabel}</span>
                  </div>

                  <input
                    id={`slider-q-${q.id}`}
                    type="range"
                    min={q.min ?? 1}
                    max={q.max ?? 10}
                    step={q.step ?? 1}
                    value={answers[q.id] ?? 5}
                    onChange={(e) => handleSliderChange(q.id, parseInt(e.target.value, 10))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />

                  <div className="mt-2 flex justify-between text-[11px] text-slate-400 font-mono">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <span
                        key={num}
                        className={answers[q.id] === num ? 'font-bold text-indigo-600' : ''}
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-200 pt-5">
        <button
          id="questionnaire-prev-btn"
          type="button"
          onClick={handlePrevSection}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{sectionIndex === 0 ? 'Cancel' : 'Previous Section'}</span>
        </button>

        {sectionIndex < CATEGORY_ORDER.length - 1 ? (
          <button
            id="questionnaire-next-btn"
            type="button"
            onClick={handleNextSection}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
          >
            <span>Next: {CATEGORIES[CATEGORY_ORDER[sectionIndex + 1]].name.split(' ')[0]}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            id="questionnaire-submit-btn"
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-7 py-3 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all hover:scale-[1.01] focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
          >
            <Sparkles className="h-4 w-4" />
            <span>Submit Assessment &amp; Calculate Score</span>
          </button>
        )}
      </div>
    </div>
  );
};
