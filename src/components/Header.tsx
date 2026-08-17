import React from 'react';
import { Crown, School, Sparkles, LogOut, UserCheck, Shield, GraduationCap, Trophy } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  schoolName: string;
  activePeriodTitle?: string;
  currentRole: UserRole | null;
  currentUserName?: string;
  onLogout: () => void;
  onOpenLoginModal: (role: UserRole) => void;
  onOpenTopTen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  schoolName,
  activePeriodTitle,
  currentRole,
  currentUserName,
  onLogout,
  onOpenLoginModal,
  onOpenTopTen,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur-md border-b border-slate-650 border-slate-600 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand & School Title */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 border border-amber-300/40">
            <Crown className="w-6 h-6 drop-shadow-md animate-pulse" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                المنظومة السلوكية والتربوية
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5 mt-0.5">
              <School className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
              <span>{schoolName}</span>
            </h1>
          </div>
        </div>

        {/* Active Period Banner Indicator */}
        {activePeriodTitle && (
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-800/60 border border-indigo-500/40 text-indigo-100 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-300 animate-ping"></span>
            <span className="text-slate-200">الفترة النشطة:</span>
            <span className="font-bold text-indigo-100 max-w-xs truncate">{activePeriodTitle}</span>
          </div>
        )}

        {/* Global Controls & User Role Actions */}
        <div className="flex items-center gap-2">
          
          {/* Top 10 Leaders Trigger Button */}
          <button
            type="button"
            onClick={onOpenTopTen}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/30 via-yellow-500/30 to-amber-500/20 border border-amber-500/60 hover:border-amber-300 text-amber-200 hover:text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-amber-500/15"
            title="عرض قائمة العشرة الأوائل على مستوى المدرسة"
          >
            <Trophy className="w-4 h-4 text-amber-300 animate-bounce" />
            <span className="hidden sm:inline">العشرة الأوائل</span>
            <span className="sm:hidden">الأوائل</span>
          </button>

          {currentRole && (
            <div className="flex items-center gap-2 bg-slate-700/90 border border-slate-600 rounded-xl p-1.5 pl-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-600/90 text-xs font-semibold text-slate-100">
                {currentRole === 'admin' && <Shield className="w-3.5 h-3.5 text-purple-300" />}
                {currentRole === 'teacher' && <UserCheck className="w-3.5 h-3.5 text-emerald-300" />}
                {currentRole === 'student' && <GraduationCap className="w-3.5 h-3.5 text-amber-300" />}
                <span className="text-slate-100 text-[11px] sm:text-xs">
                  {currentRole === 'admin' ? 'الإدارة' : currentRole === 'teacher' ? 'المعلم' : 'الطالب'}
                </span>
              </div>

              {currentUserName && (
                <span className="text-xs font-bold text-amber-300 hidden lg:inline max-w-[120px] truncate">
                  {currentUserName}
                </span>
              )}

              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-xs font-bold text-rose-300 hover:text-rose-200 hover:bg-rose-500/25 px-2 py-1 rounded-lg transition"
                title="تسجيل الخروج"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
