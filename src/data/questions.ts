import { CategoryId, CategoryInfo, Question } from '../types';

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  sleep: {
    id: 'sleep',
    name: 'Sleep Quality',
    weight: 15,
    icon: 'Moon',
    color: 'indigo',
    description: 'Assesses sleep duration, schedule consistency, and pre-bed screen habits.',
  },
  digital: {
    id: 'digital',
    name: 'Screen & Digital Habits',
    weight: 20,
    icon: 'Smartphone',
    color: 'violet',
    description: 'Measures daily screen time, social media consumption, focus interruption, and breaks.',
  },
  physical: {
    id: 'physical',
    name: 'Physical Activity',
    weight: 15,
    icon: 'Activity',
    color: 'emerald',
    description: 'Evaluates weekly exercise frequency, daily active movement, and prolonged sitting.',
  },
  hydration: {
    id: 'hydration',
    name: 'Hydration',
    weight: 10,
    icon: 'Droplets',
    color: 'cyan',
    description: 'Tracks daily fluid intake and hydration sufficiency.',
  },
  nutrition: {
    id: 'nutrition',
    name: 'Nutrition & Meals',
    weight: 10,
    icon: 'Utensils',
    color: 'amber',
    description: 'Measures fresh produce intake, junk food frequency, and meal schedule regularity.',
  },
  stress: {
    id: 'stress',
    name: 'Stress & Mental Well-being',
    weight: 15,
    icon: 'Smile',
    color: 'rose',
    description: 'Assesses stress frequency, perceived tension levels, and restorative relaxation.',
  },
  social: {
    id: 'social',
    name: 'Social Connection',
    weight: 5,
    icon: 'Users',
    color: 'teal',
    description: 'Measures quality time spent with family/friends and face-to-face social contact.',
  },
  routine: {
    id: 'routine',
    name: 'Daily Routine & Focus',
    weight: 10,
    icon: 'CalendarCheck',
    color: 'blue',
    description: 'Evaluates schedule consistency, daily planning, time waste, and overall lifestyle satisfaction.',
  },
};

export const CATEGORY_ORDER: CategoryId[] = [
  'sleep',
  'digital',
  'physical',
  'hydration',
  'nutrition',
  'stress',
  'social',
  'routine',
];

export const QUESTIONS: Question[] = [
  // SLEEP (3 questions)
  {
    id: 1,
    categoryId: 'sleep',
    text: 'How many hours do you sleep on average?',
    type: 'choice',
    options: [
      { label: 'Less than 5 hours', points: 30, description: 'Severe sleep deprivation' },
      { label: '5–6 hours', points: 60, description: 'Insufficient restorative rest' },
      { label: '6–7 hours', points: 80, description: 'Acceptable but borderline' },
      { label: '7–9 hours', points: 100, description: 'Optimal recommended range for cognitive function' },
      { label: 'More than 9 hours', points: 70, description: 'Oversleeping or fatigue recovery' },
    ],
  },
  {
    id: 2,
    categoryId: 'sleep',
    text: 'How consistent is your sleep schedule?',
    type: 'choice',
    options: [
      { label: 'Very inconsistent', points: 20 },
      { label: 'Inconsistent', points: 40 },
      { label: 'Sometimes consistent', points: 65 },
      { label: 'Mostly consistent', points: 85 },
      { label: 'Very consistent', points: 100 },
    ],
  },
  {
    id: 3,
    categoryId: 'sleep',
    text: 'How often do you use your phone before sleeping?',
    type: 'choice',
    options: [
      { label: 'Never', points: 100 },
      { label: 'Rarely', points: 85 },
      { label: 'Sometimes', points: 60 },
      { label: 'Often', points: 35 },
      { label: 'Every night', points: 15 },
    ],
  },

  // SCREEN TIME & DIGITAL HABITS (5 questions)
  {
    id: 4,
    categoryId: 'digital',
    text: 'How many hours do you spend on your phone daily?',
    type: 'choice',
    options: [
      { label: 'Less than 2', points: 100 },
      { label: '2–4', points: 80 },
      { label: '4–6', points: 55 },
      { label: '6–8', points: 30 },
      { label: 'More than 8', points: 10 },
    ],
  },
  {
    id: 5,
    categoryId: 'digital',
    text: 'How many hours do you spend on social media?',
    type: 'choice',
    options: [
      { label: 'Less than 30 minutes', points: 100 },
      { label: '30–60 minutes', points: 85 },
      { label: '1–2 hours', points: 65 },
      { label: '2–4 hours', points: 35 },
      { label: 'More than 4 hours', points: 15 },
    ],
  },
  {
    id: 6,
    categoryId: 'digital',
    text: 'How often do you check your phone without a specific reason?',
    type: 'choice',
    options: [
      { label: 'Never', points: 100 },
      { label: 'Rarely', points: 85 },
      { label: 'Sometimes', points: 60 },
      { label: 'Often', points: 35 },
      { label: 'Very frequently', points: 15 },
    ],
  },
  {
    id: 7,
    categoryId: 'digital',
    text: 'How often do you take breaks during long screen sessions?',
    type: 'choice',
    options: [
      { label: 'Every 20–30 minutes', points: 100, description: 'Follows 20-20-20 rule' },
      { label: 'Every hour', points: 80 },
      { label: 'Every 2 hours', points: 50 },
      { label: 'Rarely', points: 25 },
      { label: 'Almost never', points: 10 },
    ],
  },
  {
    id: 8,
    categoryId: 'digital',
    text: 'Do you use your phone while studying or working?',
    type: 'choice',
    options: [
      { label: 'Never', points: 100 },
      { label: 'Rarely', points: 80 },
      { label: 'Sometimes', points: 55 },
      { label: 'Often', points: 30 },
      { label: 'Almost always', points: 10 },
    ],
  },

  // PHYSICAL ACTIVITY (3 questions)
  {
    id: 9,
    categoryId: 'physical',
    text: 'How many days per week do you exercise?',
    type: 'choice',
    options: [
      { label: '0', points: 15 },
      { label: '1–2', points: 45 },
      { label: '3–4', points: 80 },
      { label: '5–6', points: 100 },
      { label: '7', points: 90 },
    ],
  },
  {
    id: 10,
    categoryId: 'physical',
    text: 'How much physical activity do you get per day?',
    type: 'choice',
    options: [
      { label: 'Less than 10 minutes', points: 20 },
      { label: '10–20 minutes', points: 45 },
      { label: '20–30 minutes', points: 70 },
      { label: '30–60 minutes', points: 95 },
      { label: 'More than 60 minutes', points: 100 },
    ],
  },
  {
    id: 11,
    categoryId: 'physical',
    text: 'How much time do you spend sitting continuously?',
    type: 'choice',
    options: [
      { label: 'Less than 1 hour', points: 100 },
      { label: '1–2 hours', points: 85 },
      { label: '2–4 hours', points: 60 },
      { label: '4–6 hours', points: 35 },
      { label: 'More than 6 hours', points: 15 },
    ],
  },

  // HYDRATION (1 question)
  {
    id: 12,
    categoryId: 'hydration',
    text: 'How much water do you drink per day?',
    type: 'choice',
    options: [
      { label: 'Less than 1 litre', points: 20 },
      { label: '1–1.5 litres', points: 50 },
      { label: '1.5–2 litres', points: 75 },
      { label: '2–3 litres', points: 100, description: 'Optimal daily hydration' },
      { label: 'More than 3 litres', points: 90 },
    ],
  },

  // NUTRITION (3 questions)
  {
    id: 13,
    categoryId: 'nutrition',
    text: 'How often do you eat fruits or vegetables?',
    type: 'choice',
    options: [
      { label: 'Almost never', points: 15 },
      { label: 'Rarely', points: 35 },
      { label: 'Sometimes', points: 65 },
      { label: 'Often', points: 85 },
      { label: 'Daily', points: 100 },
    ],
  },
  {
    id: 14,
    categoryId: 'nutrition',
    text: 'How often do you eat fast food/junk food?',
    type: 'choice',
    options: [
      { label: 'Daily', points: 10 },
      { label: 'Several times a week', points: 30 },
      { label: 'Once a week', points: 65 },
      { label: 'Occasionally', points: 85 },
      { label: 'Rarely', points: 100 },
    ],
  },
  {
    id: 15,
    categoryId: 'nutrition',
    text: 'How regularly do you eat your meals?',
    type: 'choice',
    options: [
      { label: 'Very irregular', points: 20 },
      { label: 'Irregular', points: 40 },
      { label: 'Sometimes regular', points: 65 },
      { label: 'Mostly regular', points: 85 },
      { label: 'Very regular', points: 100 },
    ],
  },

  // STRESS & WELL-BEING (4 questions)
  {
    id: 16,
    categoryId: 'stress',
    text: 'How often do you feel stressed during a normal week?',
    type: 'choice',
    options: [
      { label: 'Never', points: 100 },
      { label: 'Rarely', points: 85 },
      { label: 'Sometimes', points: 60 },
      { label: 'Often', points: 35 },
      { label: 'Very often', points: 15 },
    ],
  },
  {
    id: 17,
    categoryId: 'stress',
    text: 'How would you rate your average stress level?',
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
    minLabel: '1 (Completely Relaxed)',
    maxLabel: '10 (Overwhelmed)',
    invertSlider: true, // 1 is best (100 pts), 10 is worst (10 pts)
  },
  {
    id: 18,
    categoryId: 'stress',
    text: 'How often do you take time to relax?',
    type: 'choice',
    options: [
      { label: 'Never', points: 10 },
      { label: 'Rarely', points: 35 },
      { label: 'Sometimes', points: 65 },
      { label: 'Often', points: 85 },
      { label: 'Daily', points: 100 },
    ],
  },
  {
    id: 19,
    categoryId: 'stress',
    text: 'How satisfied are you with your daily routine?',
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
    minLabel: '1 (Very Dissatisfied)',
    maxLabel: '10 (Very Satisfied)',
    invertSlider: false, // 10 is best (100 pts), 1 is worst (10 pts)
  },

  // SOCIAL LIFE (2 questions)
  {
    id: 20,
    categoryId: 'social',
    text: 'How often do you spend quality time with friends or family?',
    type: 'choice',
    options: [
      { label: 'Almost never', points: 15 },
      { label: 'Rarely', points: 40 },
      { label: 'Sometimes', points: 70 },
      { label: 'Often', points: 85 },
      { label: 'Daily', points: 100 },
    ],
  },
  {
    id: 21,
    categoryId: 'social',
    text: 'How often do you interact with people face-to-face?',
    type: 'choice',
    options: [
      { label: 'Rarely', points: 20 },
      { label: '1–2 days/week', points: 50 },
      { label: '3–4 days/week', points: 75 },
      { label: '5–6 days/week', points: 90 },
      { label: 'Daily', points: 100 },
    ],
  },

  // DAILY ROUTINE (4 questions)
  {
    id: 22,
    categoryId: 'routine',
    text: 'How consistent is your daily schedule?',
    type: 'choice',
    options: [
      { label: 'Very inconsistent', points: 20 },
      { label: 'Inconsistent', points: 40 },
      { label: 'Sometimes consistent', points: 65 },
      { label: 'Mostly consistent', points: 85 },
      { label: 'Very consistent', points: 100 },
    ],
  },
  {
    id: 23,
    categoryId: 'routine',
    text: 'How often do you plan your day?',
    type: 'choice',
    options: [
      { label: 'Never', points: 15 },
      { label: 'Rarely', points: 40 },
      { label: 'Sometimes', points: 65 },
      { label: 'Often', points: 85 },
      { label: 'Daily', points: 100 },
    ],
  },
  {
    id: 24,
    categoryId: 'routine',
    text: 'How often do you feel that you waste time online?',
    type: 'choice',
    options: [
      { label: 'Never', points: 100 },
      { label: 'Rarely', points: 80 },
      { label: 'Sometimes', points: 55 },
      { label: 'Often', points: 30 },
      { label: 'Very often', points: 10 },
    ],
  },
  {
    id: 25,
    categoryId: 'routine',
    text: 'How satisfied are you with your current lifestyle?',
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
    minLabel: '1 (Extremely Unhappy)',
    maxLabel: '10 (Thriving)',
    invertSlider: false, // 10 is best (100 pts), 1 is worst (10 pts)
  },
];
