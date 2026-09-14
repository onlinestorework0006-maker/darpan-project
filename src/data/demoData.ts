import { AppStorageState, AssessmentResult, DailyCheckIn, UserProfile } from '../types';

export const DEMO_USER_PROFILE: UserProfile = {
  name: 'Alex Morgan',
  age: 21,
  status: 'Student',
  dailyHours: 6,
  createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
};

// Initial assessment 10 days ago
export const DEMO_INITIAL_ASSESSMENT: AssessmentResult = {
  id: 'assessment-initial-001',
  date: new Date(Date.now() - 10 * 86400000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
  timestamp: Date.now() - 10 * 86400000,
  overallScore: 65,
  status: 'Needs Improvement',
  categoryScores: {
    sleep: 60,
    digital: 45,
    physical: 70,
    hydration: 60,
    nutrition: 65,
    stress: 55,
    social: 75,
    routine: 65,
  },
  answers: {
    1: 1, // 5-6 hours
    2: 1, // inconsistent
    3: 4, // every night phone in bed
    4: 3, // 6-8 hrs phone
    5: 3, // 2-4 hrs social media
    6: 4, // check phone very frequently
    7: 3, // rarely screen breaks
    8: 3, // often phone while studying
    9: 1, // 1-2 days exercise
    10: 2, // 20-30 mins activity
    11: 3, // 4-6 hrs sitting
    12: 1, // 1-1.5 L water
    13: 2, // sometimes fruits
    14: 1, // several times week fast food
    15: 1, // irregular meals
    16: 3, // often stressed
    17: 8, // stress 8/10
    18: 1, // rarely relax
    19: 5, // satisfaction 5/10
    20: 2, // sometimes family time
    21: 2, // 3-4 days face-to-face
    22: 1, // inconsistent schedule
    23: 1, // rarely plan
    24: 3, // often waste time online
    25: 5, // lifestyle satisfaction 5/10
  },
  topWeakAreas: ['digital', 'stress', 'sleep'],
};

// Latest assessment conducted today
export const DEMO_LATEST_ASSESSMENT: AssessmentResult = {
  id: 'assessment-latest-002',
  date: new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
  timestamp: Date.now(),
  overallScore: 78,
  status: 'Good',
  categoryScores: {
    sleep: 80,
    digital: 65,
    physical: 78,
    hydration: 85,
    nutrition: 75,
    stress: 75,
    social: 85,
    routine: 78,
  },
  answers: {
    1: 3, // 7-9 hours sleep
    2: 3, // mostly consistent
    3: 2, // sometimes phone before sleep
    4: 1, // 2-4 hours
    5: 1, // 30-60 mins social media
    6: 2, // sometimes check
    7: 1, // every hour break
    8: 1, // rarely phone while studying
    9: 2, // 3-4 days exercise
    10: 3, // 30-60 mins
    11: 2, // 2-4 hours sitting
    12: 3, // 2-3 litres water
    13: 3, // often fruits/veggies
    14: 3, // occasionally junk food
    15: 3, // mostly regular meals
    16: 2, // sometimes stressed
    17: 4, // stress 4/10
    18: 3, // often relax
    19: 8, // routine satisfaction 8/10
    20: 3, // often friends/family
    21: 3, // 5-6 days face to face
    22: 3, // mostly consistent
    23: 3, // often plan
    24: 1, // rarely waste time
    25: 8, // lifestyle satisfaction 8/10
  },
  topWeakAreas: ['digital', 'nutrition', 'routine'],
};

// 7 days of daily check-ins leading up to today
export const DEMO_DAILY_CHECKINS: DailyCheckIn[] = [
  {
    id: 'checkin-day-7',
    date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
    timestamp: Date.now() - 6 * 86400000,
    sleepHours: 6.2,
    screenTimeHours: 6.5,
    exerciseMinutes: 15,
    waterLiters: 1.4,
    stressLevel: 8,
    healthyMeals: 1,
    dayRating: 5,
    notes: 'Busy project day, struggled to put phone away before bed.',
    calculatedScore: 58,
  },
  {
    id: 'checkin-day-6',
    date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    timestamp: Date.now() - 5 * 86400000,
    sleepHours: 6.5,
    screenTimeHours: 5.8,
    exerciseMinutes: 20,
    waterLiters: 1.7,
    stressLevel: 7,
    healthyMeals: 2,
    dayRating: 6,
    notes: 'Started keeping water bottle at my desk.',
    calculatedScore: 64,
  },
  {
    id: 'checkin-day-5',
    date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    timestamp: Date.now() - 4 * 86400000,
    sleepHours: 7.0,
    screenTimeHours: 5.0,
    exerciseMinutes: 25,
    waterLiters: 2.0,
    stressLevel: 6,
    healthyMeals: 2,
    dayRating: 7,
    notes: 'Took walking breaks between campus lectures.',
    calculatedScore: 72,
  },
  {
    id: 'checkin-day-4',
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    timestamp: Date.now() - 3 * 86400000,
    sleepHours: 7.2,
    screenTimeHours: 4.2,
    exerciseMinutes: 30,
    waterLiters: 2.2,
    stressLevel: 5,
    healthyMeals: 2,
    dayRating: 7,
    notes: 'Set a 45-minute Instagram app timer.',
    calculatedScore: 78,
  },
  {
    id: 'checkin-day-3',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    timestamp: Date.now() - 2 * 86400000,
    sleepHours: 7.5,
    screenTimeHours: 3.8,
    exerciseMinutes: 35,
    waterLiters: 2.3,
    stressLevel: 4,
    healthyMeals: 3,
    dayRating: 8,
    notes: 'Cooked fresh vegetables and slept before 11:30 PM.',
    calculatedScore: 83,
  },
  {
    id: 'checkin-day-2',
    date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    timestamp: Date.now() - 1 * 86400000,
    sleepHours: 7.8,
    screenTimeHours: 3.5,
    exerciseMinutes: 40,
    waterLiters: 2.4,
    stressLevel: 4,
    healthyMeals: 3,
    dayRating: 8,
    notes: 'Phone left in the living room at night. Felt remarkably rested.',
    calculatedScore: 86,
  },
  {
    id: 'checkin-day-1',
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
    sleepHours: 8.0,
    screenTimeHours: 3.0,
    exerciseMinutes: 45,
    waterLiters: 2.5,
    stressLevel: 3,
    healthyMeals: 3,
    dayRating: 9,
    notes: 'Great routine today! Completed morning jog and 2 focus blocks.',
    calculatedScore: 91,
  },
];

export const DEMO_APP_DATA: AppStorageState = {
  userProfile: DEMO_USER_PROFILE,
  initialAssessment: DEMO_INITIAL_ASSESSMENT,
  latestAssessment: DEMO_LATEST_ASSESSMENT,
  assessmentHistory: [DEMO_INITIAL_ASSESSMENT, DEMO_LATEST_ASSESSMENT],
  dailyCheckIns: DEMO_DAILY_CHECKINS,
};
