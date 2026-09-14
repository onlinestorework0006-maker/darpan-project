import { AppStorageState, AssessmentResult, DailyCheckIn, UserProfile } from '../types';
import { DEMO_APP_DATA } from '../data/demoData';

const STORAGE_KEY = 'digital_wellness_data_v1';
const DRAFT_QUIZ_KEY = 'digital_wellness_quiz_draft_v1';

const DEFAULT_STATE: AppStorageState = {
  userProfile: null,
  initialAssessment: null,
  latestAssessment: null,
  assessmentHistory: [],
  dailyCheckIns: [],
};

/**
 * Safely retrieve entire app storage state
 */
export function getData(): AppStorageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);

    return {
      userProfile: parsed.userProfile ?? null,
      initialAssessment: parsed.initialAssessment ?? null,
      latestAssessment: parsed.latestAssessment ?? null,
      assessmentHistory: Array.isArray(parsed.assessmentHistory) ? parsed.assessmentHistory : [],
      dailyCheckIns: Array.isArray(parsed.dailyCheckIns) ? parsed.dailyCheckIns : [],
    };
  } catch (err) {
    console.error('Failed to parse local storage data, resetting to safe defaults:', err);
    return DEFAULT_STATE;
  }
}

/**
 * Safely save entire app storage state
 */
export function saveData(data: AppStorageState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to local storage:', err);
  }
}

/**
 * Update or save user profile
 */
export function updateProfile(profile: UserProfile): AppStorageState {
  const current = getData();
  const updated: AppStorageState = {
    ...current,
    userProfile: profile,
  };
  saveData(updated);
  return updated;
}

/**
 * Save newly completed assessment.
 * Handles initial vs latest assessment logic and appends to history.
 */
export function saveAssessment(assessment: AssessmentResult): AppStorageState {
  const current = getData();
  const isFirst = !current.initialAssessment;

  const history = [...current.assessmentHistory, assessment];

  const updated: AppStorageState = {
    ...current,
    initialAssessment: isFirst ? assessment : current.initialAssessment,
    latestAssessment: assessment,
    assessmentHistory: history,
  };

  saveData(updated);
  clearDraftAnswers();
  return updated;
}

/**
 * Record a daily check-in (prevents duplicate key for same day or updates current day)
 */
export function saveDailyCheckIn(checkIn: DailyCheckIn): AppStorageState {
  const current = getData();
  const existingIndex = current.dailyCheckIns.findIndex((item) => item.date === checkIn.date);

  let updatedCheckIns: DailyCheckIn[];
  if (existingIndex >= 0) {
    // Replace today's check-in
    updatedCheckIns = [...current.dailyCheckIns];
    updatedCheckIns[existingIndex] = checkIn;
  } else {
    // Append and sort chronologically
    updatedCheckIns = [...current.dailyCheckIns, checkIn].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  const updated: AppStorageState = {
    ...current,
    dailyCheckIns: updatedCheckIns,
  };

  saveData(updated);
  return updated;
}

/**
 * Clear all data from LocalStorage
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DRAFT_QUIZ_KEY);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}

/**
 * Load realistic sample demonstration data
 */
export function loadDemoData(): AppStorageState {
  try {
    saveData(DEMO_APP_DATA);
    clearDraftAnswers();
    return DEMO_APP_DATA;
  } catch (err) {
    console.error('Failed to load demo data:', err);
    return DEFAULT_STATE;
  }
}

/**
 * Preserve ongoing questionnaire answers across accidental refresh or tab change
 */
export function getDraftAnswers(): Record<number, number> {
  try {
    const raw = localStorage.getItem(DRAFT_QUIZ_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveDraftAnswers(answers: Record<number, number>): void {
  try {
    localStorage.setItem(DRAFT_QUIZ_KEY, JSON.stringify(answers));
  } catch (err) {
    console.error('Failed to save draft answers:', err);
  }
}

export function clearDraftAnswers(): void {
  try {
    localStorage.removeItem(DRAFT_QUIZ_KEY);
  } catch {}
}
