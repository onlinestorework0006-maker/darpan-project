import React, { useState, useEffect } from 'react';
import { ActiveTab, AppStorageState, UserProfile } from './types';
import {
  getData,
  updateProfile,
  saveAssessment,
  saveDailyCheckIn,
  clearAllData,
  loadDemoData,
} from './utils/storage';
import { calculateAssessmentResults } from './utils/scoring';

// Components
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ConfirmModal } from './components/ConfirmModal';

// Pages
import { WelcomePage } from './pages/WelcomePage';
import { ProfileStep } from './pages/ProfileStep';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { ResultsPage } from './pages/ResultsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { DashboardPage } from './pages/DashboardPage';
import { DailyCheckInPage } from './pages/DailyCheckInPage';
import { ProgressPage } from './pages/ProgressPage';
import { ComparisonPage } from './pages/ComparisonPage';

export default function App() {
  const [storageState, setStorageState] = useState<AppStorageState>(() => getData());
  const [activeTab, setActiveTab] = useState<ActiveTab>('welcome');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Sync state if another tab modifies storage
  useEffect(() => {
    const handleStorageChange = () => {
      setStorageState(getData());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const hasAssessment = !!storageState.latestAssessment;
  const hasComparison =
    !!storageState.initialAssessment &&
    !!storageState.latestAssessment &&
    storageState.initialAssessment.id !== storageState.latestAssessment.id;

  // Handlers
  const handleStartAssessmentFlow = () => {
    if (!storageState.userProfile) {
      setActiveTab('profile');
    } else {
      setActiveTab('assessment');
    }
  };

  const handleSaveProfile = (profile: UserProfile) => {
    const updated = updateProfile(profile);
    setStorageState(updated);
    setActiveTab('assessment');
  };

  const handleCompleteAssessment = (answers: Record<number, number>) => {
    const calculated = calculateAssessmentResults(answers);
    const newAssessment = {
      id: `assessment-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      timestamp: Date.now(),
      overallScore: calculated.overallScore,
      status: calculated.status,
      categoryScores: calculated.categoryScores,
      answers,
      topWeakAreas: calculated.topWeakAreas,
    };

    const updated = saveAssessment(newAssessment);
    setStorageState(updated);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDailyCheckIn = (checkIn: any) => {
    const updated = saveDailyCheckIn(checkIn);
    setStorageState(updated);
  };

  const handleLoadDemo = () => {
    const demoData = loadDemoData();
    setStorageState(demoData);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmClearData = () => {
    clearAllData();
    setStorageState(getData());
    setIsClearModalOpen(false);
    setActiveTab('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Main Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasAssessment={hasAssessment}
        hasComparison={hasComparison}
        userProfile={storageState.userProfile}
        onLoadDemo={handleLoadDemo}
        onOpenClearConfirm={() => setIsClearModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'welcome' && (
          <WelcomePage
            onStartAssessment={handleStartAssessmentFlow}
            onGoToDashboard={() => setActiveTab('dashboard')}
            onLoadDemo={handleLoadDemo}
            latestAssessment={storageState.latestAssessment}
            userProfile={storageState.userProfile}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileStep
            initialProfile={storageState.userProfile}
            onSaveProfile={handleSaveProfile}
            onCancel={() => setActiveTab('welcome')}
          />
        )}

        {activeTab === 'assessment' && (
          <QuestionnairePage
            onComplete={handleCompleteAssessment}
            onCancel={() => setActiveTab(hasAssessment ? 'dashboard' : 'welcome')}
          />
        )}

        {activeTab === 'results' && storageState.latestAssessment && (
          <ResultsPage
            currentAssessment={storageState.latestAssessment}
            previousAssessment={
              storageState.initialAssessment?.id !== storageState.latestAssessment.id
                ? storageState.initialAssessment
                : null
            }
            onViewRecommendations={() => setActiveTab('recommendations')}
            onGoToDashboard={() => setActiveTab('dashboard')}
            onRetakeAssessment={() => setActiveTab('assessment')}
          />
        )}

        {activeTab === 'recommendations' && (
          storageState.latestAssessment ? (
            <RecommendationsPage
              assessment={storageState.latestAssessment}
              onGoToCheckIn={() => setActiveTab('checkin')}
              onGoToDashboard={() => setActiveTab('dashboard')}
            />
          ) : (
            <div className="text-center py-20">
              <p className="text-sm text-slate-500">Please complete an assessment first.</p>
              <button
                onClick={() => setActiveTab('assessment')}
                className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white"
              >
                Take Assessment
              </button>
            </div>
          )
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            storageState={storageState}
            onGoToCheckIn={() => setActiveTab('checkin')}
            onGoToProgress={() => setActiveTab('progress')}
            onGoToRecommendations={() => setActiveTab('recommendations')}
            onRetakeAssessment={handleStartAssessmentFlow}
          />
        )}

        {activeTab === 'checkin' && (
          <DailyCheckInPage
            checkIns={storageState.dailyCheckIns}
            onSaveCheckIn={handleSaveDailyCheckIn}
            onGoToProgress={() => setActiveTab('progress')}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressPage
            storageState={storageState}
            onGoToCheckIn={() => setActiveTab('checkin')}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {activeTab === 'comparison' &&
          storageState.initialAssessment &&
          storageState.latestAssessment && (
            <ComparisonPage
              initialAssessment={storageState.initialAssessment}
              latestAssessment={storageState.latestAssessment}
              onRetakeAgain={() => setActiveTab('assessment')}
              onGoToDashboard={() => setActiveTab('dashboard')}
            />
          )}
      </main>

      {/* Global Footer */}
      <Footer
        onLoadDemo={handleLoadDemo}
        onOpenClearConfirm={() => setIsClearModalOpen(true)}
      />

      {/* Confirmation Modal for Clearing Data */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        title="Clear All Stored Data?"
        message="This action will permanently delete your user profile, assessment results, and all daily check-in records from your browser's LocalStorage. This cannot be undone."
        confirmLabel="Yes, Clear Data"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmClearData}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  );
}
