import { CategoryId, Recommendation } from '../types';
import { CATEGORIES } from '../data/questions';

interface AssessmentEvaluationContext {
  categoryScores: Record<CategoryId, number>;
  answers: Record<number, number>;
  topWeakAreas: CategoryId[];
}

export function generateRecommendations(context: AssessmentEvaluationContext): Recommendation[] {
  const { categoryScores, answers, topWeakAreas } = context;
  const recommendations: Recommendation[] = [];

  // 1. DIGITAL HABITS & SCREEN TIME
  const digitalScore = categoryScores.digital ?? 50;
  const phoneHoursAns = answers[4]; // 0: <2, 1: 2-4, 2: 4-6, 3: 6-8, 4: >8
  const socialMediaAns = answers[5]; // 0: <30m, 1: 30-60m, 2: 1-2h, 3: 2-4h, 4: >4h
  const screenBreakAns = answers[7]; // 0: 20-30m, 1: 1h, 2: 2h, 3: rarely, 4: almost never
  const phoneStudyAns = answers[8]; // 0: never, 1: rarely, 2: sometimes, 3: often, 4: almost always

  if (digitalScore < 75 || phoneHoursAns >= 2 || socialMediaAns >= 2) {
    if (phoneHoursAns >= 2) {
      recommendations.push({
        id: 'rec-screen-time',
        categoryId: 'digital',
        categoryName: CATEGORIES.digital.name,
        title: 'High Daily Screen Time',
        problem: 'Your daily phone screen time is elevated above healthy digital wellness boundaries.',
        whyItMatters:
          'Excessive continuous screen usage increases eye strain, cognitive fragmentation, and displaces rest and active movement.',
        action: 'Activate built-in screen-time limits or grayscale mode for your two most distracting apps.',
        suggestedTarget: 'Reduce recreational screen duration by 30–45 minutes daily over the next 7 days.',
        severity: digitalScore < 50 ? 'high' : 'medium',
      });
    }

    if (screenBreakAns >= 2) {
      recommendations.push({
        id: 'rec-screen-breaks',
        categoryId: 'digital',
        categoryName: CATEGORIES.digital.name,
        title: 'Infrequent Screen Rest Intervals',
        problem: 'You rarely pause for eye and postural resets during prolonged screen sessions.',
        whyItMatters:
          'Staring at displays without pauses leads to computer vision syndrome, dry eyes, and tension headaches.',
        action: 'Adopt the 20-20-20 protocol: every 20 minutes, gaze at an object 20 feet away for 20 seconds.',
        suggestedTarget: 'Take at least 3 intentional visual stretch pauses during long study or work blocks.',
        severity: 'medium',
      });
    }

    if (phoneStudyAns >= 2) {
      recommendations.push({
        id: 'rec-focus-study',
        categoryId: 'digital',
        categoryName: CATEGORIES.digital.name,
        title: 'Digital Distraction During Study/Work',
        problem: 'Phone interruptions frequently break your deep-work and study momentum.',
        whyItMatters:
          'Context-switching incurs attention residue, requiring up to 20 minutes to regain deep focus after every glance.',
        action: 'Keep your phone out of arm’s reach in "Do Not Disturb" mode while focusing on tasks.',
        suggestedTarget: 'Complete two distraction-free 45-minute focus intervals each day this week.',
        severity: 'medium',
      });
    }
  }

  // 2. SLEEP QUALITY
  const sleepScore = categoryScores.sleep ?? 50;
  const sleepHoursAns = answers[1]; // 0: <5h, 1: 5-6h, 2: 6-7h, 3: 7-9h, 4: >9h
  const sleepScheduleAns = answers[2]; // 0: very inconsistent, 1: inconsistent, 2: sometimes, 3: mostly, 4: very
  const phonePreBedAns = answers[3]; // 0: never, 1: rarely, 2: sometimes, 3: often, 4: every night

  if (sleepScore < 75 || sleepHoursAns <= 1 || phonePreBedAns >= 3) {
    if (sleepHoursAns <= 1) {
      recommendations.push({
        id: 'rec-sleep-duration',
        categoryId: 'sleep',
        categoryName: CATEGORIES.sleep.name,
        title: 'Insufficient Restorative Sleep',
        problem: 'Your current sleep duration falls beneath the recommended 7–9 hour restorative baseline.',
        whyItMatters:
          'Chronic sleep deficit compromises memory consolidation, mood regulation, and immune resilience.',
        action: 'Shift your evening wind-down 30 minutes earlier and protect a consistent lights-out target.',
        suggestedTarget: 'Attain at least 7.0 hours of sleep for 5 nights out of the upcoming 7 days.',
        severity: 'high',
      });
    }

    if (phonePreBedAns >= 3) {
      recommendations.push({
        id: 'rec-sleep-phone',
        categoryId: 'sleep',
        categoryName: CATEGORIES.sleep.name,
        title: 'Pre-Bedtime Screen Exposure',
        problem: 'Using smartphones directly before sleep suppresses natural melatonin release.',
        whyItMatters:
          'Short-wavelength blue light and algorithmic dopamine cues delay sleep onset and reduce REM sleep depth.',
        action: 'Establish a 30-minute digital curfew: charge your phone outside arm’s reach before bed.',
        suggestedTarget: 'Keep bed a phone-free sanctuary for 6 consecutive nights.',
        severity: 'high',
      });
    }

    if (sleepScheduleAns <= 1) {
      recommendations.push({
        id: 'rec-sleep-consistency',
        categoryId: 'sleep',
        categoryName: CATEGORIES.sleep.name,
        title: 'Irregular Sleep Schedule',
        problem: 'Your sleep timing fluctuates significantly between weekdays and weekends.',
        whyItMatters:
          'Circadian misalignment ("social jetlag") produces daytime grogginess and hampers metabolic health.',
        action: 'Anchor a fixed wake-up time every morning, even on weekends, to stabilize your biological clock.',
        suggestedTarget: 'Maintain your wake-up time within a ±45 minute window for the next week.',
        severity: 'medium',
      });
    }
  }

  // 3. PHYSICAL ACTIVITY
  const physicalScore = categoryScores.physical ?? 50;
  const exerciseDaysAns = answers[9]; // 0: 0 days, 1: 1-2, 2: 3-4, 3: 5-6, 4: 7
  const sittingAns = answers[11]; // 0: <1h, 1: 1-2h, 2: 2-4h, 3: 4-6h, 4: >6h

  if (physicalScore < 75 || exerciseDaysAns <= 1 || sittingAns >= 3) {
    if (exerciseDaysAns <= 1) {
      recommendations.push({
        id: 'rec-exercise-frequency',
        categoryId: 'physical',
        categoryName: CATEGORIES.physical.name,
        title: 'Low Physical Movement Frequency',
        problem: 'Your routine lacks consistent moderate cardiovascular and muscular engagement.',
        whyItMatters:
          'Physical activity elevates endorphins, clears cortisol, and enhances oxygen flow to the brain.',
        action: 'Incorporate brisk walking, cycling, bodyweight exercises, or recreational sports.',
        suggestedTarget: 'Accumulate at least 25 minutes of intentional exercise on 3 separate days this week.',
        severity: physicalScore < 50 ? 'high' : 'medium',
      });
    }

    if (sittingAns >= 3) {
      recommendations.push({
        id: 'rec-sitting-breaks',
        categoryId: 'physical',
        categoryName: CATEGORIES.physical.name,
        title: 'Extended Sedentary Periods',
        problem: 'You remain seated continuously for 4 or more hours at a stretch.',
        whyItMatters:
          'Prolonged uninterrupted sitting slows metabolic rate, stiffens the spine, and causes afternoon fatigue.',
        action: 'Stand up and pace or stretch for 2 minutes every hour during seated work sessions.',
        suggestedTarget: 'Log at least 3 movement check-in breaks during your study or work day.',
        severity: 'medium',
      });
    }
  }

  // 4. HYDRATION
  const hydrationScore = categoryScores.hydration ?? 50;
  const waterAns = answers[12]; // 0: <1L, 1: 1-1.5L, 2: 1.5-2L, 3: 2-3L, 4: >3L

  if (hydrationScore < 75 || waterAns <= 1) {
    recommendations.push({
      id: 'rec-hydration',
      categoryId: 'hydration',
      categoryName: CATEGORIES.hydration.name,
      title: 'Suboptimal Daily Fluid Intake',
      problem: 'Your estimated water consumption is lower than the recommended 2.0–2.5 litre baseline.',
      whyItMatters:
        'Even mild 1–2% dehydration impairs cognitive alertness, triggers headaches, and worsens fatigue.',
      action: 'Keep a refillable 750ml water bottle at your desk and drink a full glass right after waking.',
      suggestedTarget: 'Consume at least 2.0 litres of water consistently over the next 7 days.',
      severity: hydrationScore < 50 ? 'high' : 'medium',
    });
  }

  // 5. NUTRITION
  const nutritionScore = categoryScores.nutrition ?? 50;
  const produceAns = answers[13]; // 0: never, 1: rarely, 2: sometimes, 3: often, 4: daily
  const junkFoodAns = answers[14]; // 0: daily, 1: several times/week, 2: once/week, 3: occasionally, 4: rarely
  const mealRegAns = answers[15]; // 0: very irregular, 1: irregular, 2: sometimes, 3: mostly, 4: very

  if (nutritionScore < 75 || produceAns <= 1 || junkFoodAns <= 1 || mealRegAns <= 1) {
    if (junkFoodAns <= 1 || produceAns <= 1) {
      recommendations.push({
        id: 'rec-nutrition-quality',
        categoryId: 'nutrition',
        categoryName: CATEGORIES.nutrition.name,
        title: 'Dietary Nutrient Balance',
        problem: 'Your diet leans toward frequent processed food or lacks sufficient fresh fruit and vegetables.',
        whyItMatters:
          'High refined sugar and unhealthy fats spike insulin swings, leading to mid-day brain fog and energy crashes.',
        action: 'Add a colorful portion of fresh fruit or raw greens to at least two meals each day.',
        suggestedTarget: 'Limit fast-food or processed snacks to no more than 1–2 occurrences this week.',
        severity: 'medium',
      });
    }

    if (mealRegAns <= 1) {
      recommendations.push({
        id: 'rec-meal-timing',
        categoryId: 'nutrition',
        categoryName: CATEGORIES.nutrition.name,
        title: 'Irregular Meal Timing',
        problem: 'Meal schedules are unpredictable or frequently skipped during the day.',
        whyItMatters:
          'Skipping meals leads to intense hunger rebound, erratic blood glucose, and reduced academic concentration.',
        action: 'Set predictable lunch and dinner windows within a 1-hour recurring timeframe.',
        suggestedTarget: 'Eat meals at regular hours on at least 5 days this week.',
        severity: 'low',
      });
    }
  }

  // 6. STRESS & MENTAL WELL-BEING
  const stressScore = categoryScores.stress ?? 50;
  const stressLevelSlider = answers[17] ?? 5; // 1 to 10
  const relaxFreqAns = answers[18]; // 0: never, 1: rarely, 2: sometimes, 3: often, 4: daily

  if (stressScore < 75 || stressLevelSlider >= 7 || relaxFreqAns <= 1) {
    recommendations.push({
      id: 'rec-stress-management',
      categoryId: 'stress',
      categoryName: CATEGORIES.stress.name,
      title: 'Elevated Perceived Stress',
      problem: 'You report high stress levels without adequate daily restorative downtime.',
      whyItMatters:
        'Sustained stress elevates sympathetic arousal, draining mental stamina and hampering sleep depth.',
      action: 'Practice 10 minutes of intentional decompression: box breathing (4-4-4-4), journaling, or a quiet walk.',
      suggestedTarget: 'Log one calm relaxation practice in your daily check-in for 5 consecutive days.',
      severity: stressScore < 50 ? 'high' : 'medium',
    });
  }

  // 7. SOCIAL LIFE
  const socialScore = categoryScores.social ?? 50;
  const socialTimeAns = answers[20]; // 0: almost never, 1: rarely, 2: sometimes, 3: often, 4: daily
  const faceToFaceAns = answers[21]; // 0: rarely, 1: 1-2 days, 2: 3-4, 3: 5-6, 4: daily

  if (socialScore < 75 || socialTimeAns <= 1 || faceToFaceAns <= 1) {
    recommendations.push({
      id: 'rec-social-connection',
      categoryId: 'social',
      categoryName: CATEGORIES.social.name,
      title: 'Low In-Person Social Interaction',
      problem: 'Virtual communication has displaced meaningful in-person conversations and family connection.',
      whyItMatters:
        'Genuine face-to-face interaction stimulates oxytocin release, buffers emotional stress, and fosters belonging.',
      action: 'Schedule an in-person coffee, study meetup, or shared walk with a friend or loved one.',
      suggestedTarget: 'Have at least two dedicated screen-free social interactions this week.',
      severity: 'medium',
    });
  }

  // 8. DAILY ROUTINE & FOCUS
  const routineScore = categoryScores.routine ?? 50;
  const planDayAns = answers[23]; // 0: never, 1: rarely, 2: sometimes, 3: often, 4: daily
  const wasteTimeAns = answers[24]; // 0: never, 1: rarely, 2: sometimes, 3: often, 4: very often

  if (routineScore < 75 || planDayAns <= 1 || wasteTimeAns >= 3) {
    recommendations.push({
      id: 'rec-routine-planning',
      categoryId: 'routine',
      categoryName: CATEGORIES.routine.name,
      title: 'Unstructured Daily Planning',
      problem: 'Days start without clear priority definition, leading to online time sinkholes.',
      whyItMatters:
        'Without a defined plan, attention naturally drifts to algorithmically optimized dopamine feeds.',
      action: 'Write down your "Top 3 Tasks for Tomorrow" for 5 minutes before ending each evening.',
      suggestedTarget: 'Follow a pre-planned schedule for 5 work/study days this week.',
      severity: 'medium',
    });
  }

  // Ensure at least 3 recommendations exist, prioritized by user's top weak areas
  if (recommendations.length < 3) {
    topWeakAreas.forEach((weakCat) => {
      const alreadyHas = recommendations.some((r) => r.categoryId === weakCat);
      if (!alreadyHas) {
        recommendations.push({
          id: `rec-fallback-${weakCat}`,
          categoryId: weakCat,
          categoryName: CATEGORIES[weakCat].name,
          title: `Focus on ${CATEGORIES[weakCat].name}`,
          problem: `Your score in ${CATEGORIES[weakCat].name} (${categoryScores[weakCat]}/100) indicates room for steady enhancement.`,
          whyItMatters:
            'Balanced wellness across all dimensions provides synergy for academic success and vitality.',
          action: `Establish one small, measurable habit in ${CATEGORIES[weakCat].name} over the next 5 days.`,
          suggestedTarget: 'Complete daily check-ins to monitor changes in this area.',
          severity: 'medium',
        });
      }
    });
  }

  // Sort recommendations so top weak area recommendations come first
  recommendations.sort((a, b) => {
    const aWeakIndex = topWeakAreas.indexOf(a.categoryId);
    const bWeakIndex = topWeakAreas.indexOf(b.categoryId);
    const aScore = aWeakIndex !== -1 ? aWeakIndex : 99;
    const bScore = bWeakIndex !== -1 ? bWeakIndex : 99;
    if (aScore !== bScore) return aScore - bScore;
    if (a.severity === 'high' && b.severity !== 'high') return -1;
    if (b.severity === 'high' && a.severity !== 'high') return 1;
    return 0;
  });

  return recommendations;
}
