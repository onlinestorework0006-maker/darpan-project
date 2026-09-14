export type CategoryId =
  | 'sleep'
  | 'digital'
  | 'physical'
  | 'hydration'
  | 'nutrition'
  | 'stress'
  | 'social'
  | 'routine';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  weight: number; // percentage, e.g. 15 for 15%
  icon: string;
  color: string;
  description: string;
}

export type QuestionType = 'choice' | 'slider';

export interface QuestionOption {
  label: string;
  points: number; // 0 to 100 scaled value for this choice
  description?: string;
}

export interface Question {
  id: number;
  categoryId: CategoryId;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  // Invert slider points if higher value = worse behavior (e.g. higher stress)
  invertSlider?: boolean;
}

export interface UserProfile {
  name: string;
  age: number | string;
  status: 'Student' | 'Working Professional' | 'Other';
  dailyHours?: number | string;
  createdAt: string;
}

export interface CategoryScore {
  categoryId: CategoryId;
  name: string;
  score: number; // 0-100
  weight: number; // percentage
  status: 'Excellent' | 'Good' | 'Needs Improvement' | 'Needs Attention' | 'High Priority for Improvement';
}

export interface AssessmentResult {
  id: string;
  date: string;
  timestamp: number;
  overallScore: number; // 0-100
  status: 'Excellent' | 'Good' | 'Needs Improvement' | 'Needs Attention' | 'High Priority for Improvement';
  categoryScores: Record<CategoryId, number>;
  answers: Record<number, number>; // questionId -> optionIndex or numeric value
  topWeakAreas: CategoryId[];
}

export interface Recommendation {
  id: string;
  categoryId: CategoryId;
  categoryName: string;
  title: string;
  problem: string;
  whyItMatters: string;
  action: string;
  suggestedTarget: string;
  severity: 'high' | 'medium' | 'low';
}

export interface DailyCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  sleepHours: number;
  screenTimeHours: number;
  exerciseMinutes: number;
  waterLiters: number;
  stressLevel: number; // 1-10
  healthyMeals: number; // 0-3+
  dayRating: number; // 1-10
  notes?: string;
  calculatedScore: number; // 0-100
}

export interface AppStorageState {
  userProfile: UserProfile | null;
  initialAssessment: AssessmentResult | null;
  latestAssessment: AssessmentResult | null;
  assessmentHistory: AssessmentResult[];
  dailyCheckIns: DailyCheckIn[];
}

export type ActiveTab =
  | 'welcome'
  | 'profile'
  | 'assessment'
  | 'results'
  | 'recommendations'
  | 'dashboard'
  | 'checkin'
  | 'progress'
  | 'comparison';
