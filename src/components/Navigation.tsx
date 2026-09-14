import React, { useState } from 'react';
import {
  Heart,
  ClipboardList,
  LayoutDashboard,
  CalendarCheck2,
  TrendingUp,
  Lightbulb,
  GitCompare,
  Database,
  Trash2,
  Menu,
  X,
  User,
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasAssessment: boolean;
  hasComparison: boolean;
  userProfile: UserProfile | null;
  onLoadDemo: () => void;
  onOpenClearConfirm: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  hasAssessment,
  hasComparison,
  userProfile,
  onLoadDemo,
  onOpenClearConfirm,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; requiresAssessment?: boolean }[] = [
    { id: 'welcome', label: 'Home', icon: <Heart className="w-4 h-4" /> },
    { id: 'assessment', label: 'Assessment', icon: <ClipboardList className="w-4 h-4" /> },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      requiresAssessment: true,
    },
    {
      id: 'checkin',
      label: 'Daily Check-in',
      icon: <CalendarCheck2 className="w-4 h-4" />,
      requiresAssessment: false,
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <TrendingUp className="w-4 h-4" />,
      requiresAssessment: false,
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: <Lightbulb className="w-4 h-4" />,
      requiresAssessment: true,
    },
  ];

  if (hasComparison) {
    navItems.push({
      id: 'comparison',
      label: 'Re-Assessment',
      icon: <GitCompare className="w-4 h-4" />,
      requiresAssessment: true,
    });
  }

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navigation"
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & College Project Label */}
        <div
          id="nav-brand"
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleSelectTab('welcome')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white shadow-sm">
            <Heart className="h-5 w-5 fill-white/20" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
              Digital Wellness
            </span>
            <span className="text-[11px] font-semibold text-teal-600 block uppercase tracking-wider">
              Lifestyle Assessment & Tracking
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isDisabled = item.requiresAssessment && !hasAssessment;

            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => !isDisabled && handleSelectTab(item.id)}
                disabled={isDisabled}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : isDisabled
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={isDisabled ? 'Complete the Assessment first to access' : item.label}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools (Demo Data, User Badge, Clear Data) */}
        <div className="hidden sm:flex items-center gap-2">
          {userProfile && (
            <div
              id="user-profile-badge"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-700"
            >
              <User className="h-3.5 w-3.5 text-indigo-600" />
              <span className="font-semibold max-w-[110px] truncate">{userProfile.name}</span>
              <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600 font-medium">
                {userProfile.status}
              </span>
            </div>
          )}

          <button
            id="nav-load-demo-btn"
            type="button"
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
            title="Load realistic sample data for demo presentation"
          >
            <Database className="h-3.5 w-3.5" />
            <span>Load Demo Data</span>
          </button>

          <button
            id="nav-clear-data-btn"
            type="button"
            onClick={onOpenClearConfirm}
            className="flex items-center gap-1 rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            title="Clear My Data (Reset LocalStorage)"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="border-t border-slate-200 bg-white p-4 lg:hidden">
          {userProfile && (
            <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-semibold text-slate-800">{userProfile.name}</span>
              </div>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                {userProfile.status}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mb-4">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const isDisabled = item.requiresAssessment && !hasAssessment;

              return (
                <button
                  key={item.id}
                  onClick={() => !isDisabled && handleSelectTab(item.id)}
                  disabled={isDisabled}
                  className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : isDisabled
                      ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                      : 'text-slate-700 bg-slate-100/70 hover:bg-slate-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <button
              onClick={() => {
                onLoadDemo();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 border border-emerald-200"
            >
              <Database className="h-3.5 w-3.5" />
              <span>Load Demo Data</span>
            </button>
            <button
              onClick={() => {
                onOpenClearConfirm();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Data</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
