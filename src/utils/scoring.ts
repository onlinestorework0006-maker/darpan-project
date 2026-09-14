import { CategoryId, CategoryScore, AssessmentResult } from '../types';
import { CATEGORIES, CATEGORY_ORDER, QUESTIONS } from '../data/questions';

export type WellnessStatus =
  | 'Excellent'
  | 'Good'
  | 'Needs Improvement'
  | 'Needs Attention'
  | 'High Priority for Improvement';

export function getStatusFromScore(score: number): WellnessStatus {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Needs Improvement';
  if (score >= 40) return 'Needs Attention';
  return 'High Priority for Improvement';
}

export function getStatusColor(status: WellnessStatus): {
  badgeBg: string;
  badgeText: string;
  barColor: string;
  borderColor: string;
} {
  switch (status) {
    case 'Excellent':
      return {
        badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
        badgeText: 'text-emerald-700',
        barColor: 'bg-emerald-500',
        borderColor: 'border-emerald-200',
      };
    case 'Good':
      return {
        badgeBg: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300',
        badgeText: 'text-teal-700',
        barColor: 'bg-teal-500',
        borderColor: 'border-teal-200',
      };
    case 'Needs Improvement':
      return {
        badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
        badgeText: 'text-amber-700',
        barColor: 'bg-amber-500',
        borderColor: 'border-amber-200',
      };
    case 'Needs Attention':
      return {
        badgeBg: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
        badgeText: 'text-orange-700',
        barColor: 'bg-orange-500',
        borderColor: 'border-orange-200',
      };
    case 'High Priority for Improvement':
    default:
      return {
        badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
        badgeText: 'text-rose-700',
        barColor: 'bg-rose-500',
        borderColor: 'border-rose-200',
      };
  }
}

/**
 * Calculates score for a single question given user's input
 */
export function calculateQuestionScore(questionId: number, answerValue: number): number {
  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question) return 50;

  if (question.type === 'choice' && question.options) {
    const selectedOption = question.options[answerValue];
    return selectedOption ? selectedOption.points : 50;
  }

  if (question.type === 'slider') {
    // Slider from 1 to 10
    const min = question.min ?? 1;
    const max = question.max ?? 10;
    const normalized = Math.max(min, Math.min(max, answerValue));
    // Scale 1-10 to 0-100
    if (question.invertSlider) {
      // 1 is best (100 pts), 10 is worst (10 pts)
      return Math.round(((max - normalized + 1) / (max - min + 1)) * 100);
    } else {
      // 10 is best (100 pts), 1 is worst (10 pts)
      return Math.round(((normalized - min + 1) / (max - min + 1)) * 100);
    }
  }

  return 50;
}

/**
 * Calculates category scores and overall Digital Wellness Score
 */
export function calculateAssessmentResults(answers: Record<number, number>): {
  overallScore: number;
  status: WellnessStatus;
  categoryScores: Record<CategoryId, number>;
  detailedScores: CategoryScore[];
  topWeakAreas: CategoryId[];
} {
  const categoryScores: Record<CategoryId, number> = {
    sleep: 0,
    digital: 0,
    physical: 0,
    hydration: 0,
    nutrition: 0,
    stress: 0,
    social: 0,
    routine: 0,
  };

  // Group questions by category and calculate averages
  CATEGORY_ORDER.forEach((catId) => {
    const categoryQuestions = QUESTIONS.filter((q) => q.categoryId === catId);
    let totalPoints = 0;
    let count = 0;

    categoryQuestions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        totalPoints += calculateQuestionScore(q.id, answers[q.id]);
        count++;
      }
    });

    const avg = count > 0 ? Math.round(totalPoints / count) : 50;
    categoryScores[catId] = avg;
  });

  // Calculate weighted overall score
  let weightedSum = 0;
  let totalWeight = 0;

  CATEGORY_ORDER.forEach((catId) => {
    const catInfo = CATEGORIES[catId];
    weightedSum += categoryScores[catId] * (catInfo.weight / 100);
    totalWeight += catInfo.weight;
  });

  const overallScore = Math.round(weightedSum);
  const status = getStatusFromScore(overallScore);

  const detailedScores: CategoryScore[] = CATEGORY_ORDER.map((catId) => ({
    categoryId: catId,
    name: CATEGORIES[catId].name,
    score: categoryScores[catId],
    weight: CATEGORIES[catId].weight,
    status: getStatusFromScore(categoryScores[catId]),
  }));

  // Identify top 3 weakest categories (lowest scores)
  const sortedCategories = [...CATEGORY_ORDER].sort(
    (a, b) => categoryScores[a] - categoryScores[b]
  );
  const topWeakAreas = sortedCategories.slice(0, 3);

  return {
    overallScore,
    status,
    categoryScores,
    detailedScores,
    topWeakAreas,
  };
}

/**
 * Calculates Daily Check-In Wellness Score
 * Weights:
 * Sleep: 20%
 * Screen Time: 25%
 * Exercise: 20%
 * Water: 15%
 * Stress: 10%
 * Healthy Meals: 10%
 * Total = 100%
 */
export function calculateDailyScore(data: {
  sleepHours: number;
  screenTimeHours: number;
  exerciseMinutes: number;
  waterLiters: number;
  stressLevel: number; // 1-10
  healthyMeals: number; // 0-3+
}): number {
  // 1. Sleep (20%): 7-9h optimal (100), 6-7h (80), 5-6h or 9-10h (60), <5h (30)
  let sleepPoints = 60;
  if (data.sleepHours >= 7 && data.sleepHours <= 9) {
    sleepPoints = 100;
  } else if (data.sleepHours >= 6 && data.sleepHours < 7) {
    sleepPoints = 80;
  } else if (data.sleepHours >= 5 && data.sleepHours < 6) {
    sleepPoints = 55;
  } else if (data.sleepHours > 9 && data.sleepHours <= 10.5) {
    sleepPoints = 70;
  } else if (data.sleepHours < 5) {
    sleepPoints = 30;
  } else {
    sleepPoints = 50;
  }

  // 2. Screen Time (25%): <2h (100), 2-4h (85), 4-6h (60), 6-8h (35), >8h (15)
  let screenPoints = 50;
  if (data.screenTimeHours < 2) {
    screenPoints = 100;
  } else if (data.screenTimeHours <= 4) {
    screenPoints = 85;
  } else if (data.screenTimeHours <= 6) {
    screenPoints = 60;
  } else if (data.screenTimeHours <= 8) {
    screenPoints = 35;
  } else {
    screenPoints = 15;
  }

  // 3. Exercise (20%): >=45 min (100), 30-44 (85), 20-29 (70), 10-19 (45), <10 (20)
  let exercisePoints = 20;
  if (data.exerciseMinutes >= 45) {
    exercisePoints = 100;
  } else if (data.exerciseMinutes >= 30) {
    exercisePoints = 85;
  } else if (data.exerciseMinutes >= 20) {
    exercisePoints = 70;
  } else if (data.exerciseMinutes >= 10) {
    exercisePoints = 45;
  } else {
    exercisePoints = 20;
  }

  // 4. Water (15%): >=2.5L (100), 2.0-2.4L (90), 1.5-1.9L (75), 1.0-1.4L (50), <1L (25)
  let waterPoints = 25;
  if (data.waterLiters >= 2.5) {
    waterPoints = 100;
  } else if (data.waterLiters >= 2.0) {
    waterPoints = 90;
  } else if (data.waterLiters >= 1.5) {
    waterPoints = 75;
  } else if (data.waterLiters >= 1.0) {
    waterPoints = 50;
  } else {
    waterPoints = 25;
  }

  // 5. Stress (10%): 1-10 slider where 1 is calmest, 10 is most stressed
  // 1-2 (100), 3-4 (85), 5-6 (65), 7-8 (40), 9-10 (20)
  let stressPoints = 50;
  if (data.stressLevel <= 2) {
    stressPoints = 100;
  } else if (data.stressLevel <= 4) {
    stressPoints = 85;
  } else if (data.stressLevel <= 6) {
    stressPoints = 65;
  } else if (data.stressLevel <= 8) {
    stressPoints = 40;
  } else {
    stressPoints = 20;
  }

  // 6. Healthy Meals (10%): >=3 (100), 2 (75), 1 (50), 0 (25)
  let mealPoints = 25;
  if (data.healthyMeals >= 3) {
    mealPoints = 100;
  } else if (data.healthyMeals === 2) {
    mealPoints = 75;
  } else if (data.healthyMeals === 1) {
    mealPoints = 50;
  } else {
    mealPoints = 25;
  }

  const finalScore = Math.round(
    sleepPoints * 0.2 +
      screenPoints * 0.25 +
      exercisePoints * 0.2 +
      waterPoints * 0.15 +
      stressPoints * 0.1 +
      mealPoints * 0.1
  );

  return Math.min(100, Math.max(0, finalScore));
}
