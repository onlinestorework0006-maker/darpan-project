import React from 'react';
import { ShieldCheck, Info, Database, Trash2, Heart } from 'lucide-react';

interface FooterProps {
  onLoadDemo: () => void;
  onOpenClearConfirm: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onLoadDemo, onOpenClearConfirm }) => {
  return (
    <footer id="app-footer" className="mt-16 border-t border-slate-200 bg-slate-50 py-10 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Identity */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Heart className="h-4 w-4 fill-white/20" />
              </div>
              <span className="font-bold text-slate-900 text-sm">
                DIGITAL WELLNESS
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Personalized Lifestyle Assessment &amp; Improvement App. Developed as an educational college subject project to promote conscious digital habits, sleep consistency, and daily well-being.
            </p>
          </div>

          {/* Privacy & Storage Notice */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs mb-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>Local Browser Privacy</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This application is a college project. Your data is stored locally in your browser and is not sent to a server in this version.
            </p>
          </div>

          {/* Educational Disclaimer */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-xs">
            <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs mb-1.5">
              <Info className="h-4 w-4" />
              <span>General Lifestyle Disclaimer</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              This application provides general lifestyle suggestions for educational purposes. It is not a medical diagnostic or treatment tool.
            </p>
          </div>
        </div>

        {/* Demo Utilities & Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Digital Wellness Project. College Demonstrator Edition.</p>
          <div className="flex items-center gap-4">
            <button
              id="footer-demo-btn"
              type="button"
              onClick={onLoadDemo}
              className="flex items-center gap-1.5 font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <Database className="h-3.5 w-3.5" />
              <span>Load Realistic Demo Data</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              id="footer-clear-btn"
              type="button"
              onClick={onOpenClearConfirm}
              className="flex items-center gap-1.5 font-medium text-rose-600 hover:text-rose-700 hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear My Data</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
