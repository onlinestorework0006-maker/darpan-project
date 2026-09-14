import React from 'react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/questions';
import { CategoryIcon } from './CategoryIcon';
import { getStatusColor, getStatusFromScore } from '../utils/scoring';

interface CategoryBarProps {
  categoryId: CategoryId;
  score: number;
  showWeight?: boolean;
  previousScore?: number;
  isWeakest?: boolean;
  rank?: number;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categoryId,
  score,
  showWeight = true,
  previousScore,
  isWeakest,
  rank,
}) => {
  const info = CATEGORIES[categoryId];
  const status = getStatusFromScore(score);
  const color = getStatusColor(status);

  const delta = previousScore !== undefined ? score - previousScore : undefined;

  return (
    <div
      id={`cat-bar-${categoryId}`}
      className={`rounded-2xl border bg-white p-4 transition-all shadow-xs ${
        isWeakest ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              isWeakest ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <CategoryIcon categoryId={categoryId} className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              {rank !== undefined && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                  {rank}
                </span>
              )}
              <h4 className="text-sm font-semibold text-slate-900">{info.name}</h4>
            </div>
            {showWeight && (
              <span className="text-xs text-slate-400 font-medium">Weight: {info.weight}%</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-slate-900">{score}</span>
            <span className="text-xs text-slate-400">/100</span>

            {delta !== undefined && (
              <span
                className={`ml-1 text-xs font-semibold ${
                  delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-rose-600' : 'text-slate-400'
                }`}
              >
                {delta > 0 ? `+${delta}` : delta}
              </span>
            )}
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${color.badgeBg}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color.barColor}`}
          style={{ width: `${Math.max(4, Math.min(100, score))}%` }}
        />
      </div>
    </div>
  );
};
