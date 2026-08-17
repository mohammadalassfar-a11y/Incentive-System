import React, { useState } from 'react';
import { Crown, Sparkles, Award, Medal, Shield, User, GraduationCap, ArrowLeft, KeyRound, AlertCircle, Calendar, Target } from 'lucide-react';
import { Student, Grade, UserRole, Period } from '../types';
import { motion } from 'motion/react';

interface HeroLeaderboardProps {
  schoolName: string;
  students: Student[];
  grades: Grade[];
  activePeriodTitle?: string;
  activePeriod?: Period;
  onLoginSubmit: (role: UserRole, code: string) => boolean;
  onSelectStudentDemo?: (code: string) => void;
}

export const HeroLeaderboard: React.FC<HeroLeaderboardProps> = ({
  schoolName,
  students,
  grades,
  activePeriodTitle,
  activePeriod,
  onLoginSubmit,
}) => {
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sort top students for podium
  const sortedStudents = [...students].sort((a, b) => b.points - a.points);
  const first = sortedStudents[0];
  const second = sortedStudents[1];
  const third = sortedStudents[2];

  const getGradeName = (gradeId: string) => {
    const g = grades.find((item) => item.id === gradeId);
    return g ? g.name : 'الصف الدراسي';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!inputCode.trim()) {
      setErrorMessage('يرجى إدخال كود الدخول');
      return;
    }

    const success = onLoginSubmit(activeTab, inputCode.trim());
    if (!success) {
      if (activeTab === 'student') {
        setErrorMessage('كود الطالب غير صحيح (مثال صحيح: 5001 أو 5002)');
      } else if (activeTab === 'teacher') {
        setErrorMessage('رمز مرور المعلم غير صحيح (مثال صحيح: 1001 أو 1002)');
      } else {
        setErrorMessage('رمز الإدارة السري غير صحيح (الرمز الافتراضي: mmm@12345)');
      }
    }
  };


  return (
    <div className="relative overflow-hidden bg-slate-800 bg-space-grid py-4 sm:py-6 border-b border-slate-650 border-slate-600 shadow-inner flex-1 flex flex-col justify-center">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Main Content Grid: Podium (7 cols) + Login Box (5 cols) on iPad landscape / Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 items-stretch">
          
          {/* Podium Column */}
          <div className="md:col-span-7 bg-slate-700/80 border border-slate-600 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col justify-between backdrop-blur-md shadow-xl">
            
            <div className="text-center mb-1.5 sm:mb-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center justify-center gap-1.5">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <span>منصة التتويج الشرفية للأبطال</span>
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5">
                المتصدرون الثلاثة الأوائل في رصيد النقاط السلوكية والأكاديمية
              </p>
            </div>

            {activePeriod && (
              <div className="mb-2 p-2 px-3 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between gap-2 text-xs font-bold text-amber-300">
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{activePeriod.title}</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-lg text-[11px] font-extrabold shrink-0">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>النقاط الهدف: {activePeriod.targetPoints || 500} نقطة</span>
                </div>
              </div>
            )}

            {/* Compact Podium Steps */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 items-end justify-center pt-1 pb-1">
              
              {/* 2nd Place (Silver) */}
              {second ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-1 flex flex-col items-center text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-slate-400 to-slate-200 p-0.5 shadow-md border border-slate-300/50 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-700 rounded-lg flex items-center justify-center text-slate-100 font-extrabold text-xs sm:text-base">
                        🥈
                      </div>
                    </div>
                    <span className="absolute -top-1.5 px-1.5 py-0.1 rounded-full bg-slate-200 text-slate-950 font-black text-[9px] sm:text-[10px] shadow">
                      المركز 2
                    </span>
                    <h3 className="mt-1 text-[11px] sm:text-xs font-bold text-slate-100 truncate max-w-[85px] sm:max-w-[110px]">
                      {second.name}
                    </h3>
                    <span className="text-[9px] sm:text-[10px] text-slate-300 truncate max-w-[85px] sm:max-w-[100px]">
                      {getGradeName(second.gradeId)}
                    </span>
                    <div className="mt-0.5 px-1.5 py-0.2 rounded-full bg-slate-650 bg-slate-600/80 border border-slate-500 text-slate-100 text-[10px] sm:text-xs font-extrabold">
                      {second.points} ن
                    </div>
                  </div>

                  <div className="w-full h-16 sm:h-20 bg-gradient-to-t from-slate-700 via-slate-600/80 to-slate-500/60 rounded-t-xl border-t-2 border-slate-300/80 flex items-center justify-center font-black text-base sm:text-xl text-slate-100 shadow-md">
                    2
                  </div>
                </motion.div>
              ) : (
                <div className="h-16 sm:h-20 bg-slate-700/50 rounded-xl border border-slate-600 flex items-center justify-center text-[10px] text-slate-400">
                  في انتظار التنافس
                </div>
              )}

              {/* 1st Place (Gold Center) */}
              {first ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center z-10"
                >
                  <div className="relative mb-1 flex flex-col items-center text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-0.5 shadow-xl border border-amber-300 glow-card-gold flex items-center justify-center">
                      <div className="w-full h-full bg-slate-800 rounded-lg flex items-center justify-center text-amber-300 font-extrabold text-sm sm:text-xl">
                        👑
                      </div>
                    </div>
                    <span className="absolute -top-2 px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[9px] sm:text-[10px] shadow-lg flex items-center gap-0.5">
                      🥇 الأول الذهبي
                    </span>
                    <h3 className="mt-1 text-xs sm:text-sm font-black text-amber-300 truncate max-w-[95px] sm:max-w-[130px] glow-text-gold">
                      {first.name}
                    </h3>
                    <span className="text-[9px] sm:text-[10px] text-slate-200 font-medium truncate max-w-[95px] sm:max-w-[120px]">
                      {getGradeName(first.gradeId)}
                    </span>
                    <div className="mt-0.5 px-2 py-0.2 rounded-full bg-amber-500/25 border border-amber-500/50 text-amber-300 text-xs sm:text-xs font-black shadow-md">
                      {first.points} نقطة
                    </div>
                  </div>

                  <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-amber-950/80 via-amber-900/40 to-amber-600/40 rounded-t-xl border-t-3 border-amber-400 flex items-center justify-center font-black text-2xl sm:text-3xl text-amber-300 shadow-lg">
                    1
                  </div>
                </motion.div>
              ) : (
                <div className="h-24 sm:h-28 bg-slate-700/50 rounded-xl border border-slate-600 flex items-center justify-center text-[10px] text-slate-400">
                  في انتظار التنافس
                </div>
              )}

              {/* 3rd Place (Bronze) */}
              {third ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-1 flex flex-col items-center text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-800 to-amber-600 p-0.5 shadow-md border border-amber-700/50 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-700 rounded-lg flex items-center justify-center text-amber-500 font-extrabold text-xs sm:text-base">
                        🥉
                      </div>
                    </div>
                    <span className="absolute -top-1.5 px-1.5 py-0.1 rounded-full bg-amber-700 text-amber-100 font-black text-[9px] sm:text-[10px] shadow">
                      المركز 3
                    </span>
                    <h3 className="mt-1 text-[11px] sm:text-xs font-bold text-slate-100 truncate max-w-[85px] sm:max-w-[110px]">
                      {third.name}
                    </h3>
                    <span className="text-[9px] sm:text-[10px] text-slate-300 truncate max-w-[85px] sm:max-w-[100px]">
                      {getGradeName(third.gradeId)}
                    </span>
                    <div className="mt-0.5 px-1.5 py-0.2 rounded-full bg-slate-650 bg-slate-600/80 border border-slate-500 text-slate-100 text-[10px] sm:text-xs font-extrabold">
                      {third.points} ن
                    </div>
                  </div>

                  <div className="w-full h-12 sm:h-16 bg-gradient-to-t from-slate-700 via-slate-600/80 to-amber-950/40 rounded-t-xl border-t-2 border-amber-700/80 flex items-center justify-center font-black text-sm sm:text-lg text-amber-400 shadow-md">
                    3
                  </div>
                </motion.div>
              ) : (
                <div className="h-12 sm:h-16 bg-slate-700/50 rounded-xl border border-slate-600 flex items-center justify-center text-[10px] text-slate-400">
                  في انتظار التنافس
                </div>
              )}

            </div>
          </div>

          {/* Quick Authentication Box Column */}
          <div className="md:col-span-5 bg-slate-700/85 border border-slate-600 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            
            <div>
              <div className="text-center mb-3">
                <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center justify-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>بوابة الدخول السريع</span>
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5">
                  اختر نوع الحساب وأدخل كود الوصول المخصص
                </p>
              </div>

              {/* Role Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-800 rounded-xl border border-slate-600 mb-3">
                <button
                  type="button"
                  onClick={() => { setActiveTab('student'); setErrorMessage(''); setInputCode(''); }}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                    activeTab === 'student'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-200 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>طالب/ولي</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('teacher'); setErrorMessage(''); setInputCode(''); }}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                    activeTab === 'teacher'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-200 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>المعلم</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('admin'); setErrorMessage(''); setInputCode(''); }}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                    activeTab === 'admin'
                      ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-200 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>الإدارة</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-200 mb-1">
                    {activeTab === 'student' && 'كود الطالب الخاص (4 أرقام):'}
                    {activeTab === 'teacher' && 'رمز دخول المعلم:'}
                    {activeTab === 'admin' && 'رمز الإدارة السري:'}
                  </label>

                  <input
                    type={activeTab === 'admin' ? 'password' : 'text'}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder={
                      activeTab === 'student' ? 'مثال: 5001' : activeTab === 'teacher' ? 'مثال: 1001' : 'رمز السر Admin'
                    }
                    className="w-full bg-slate-800 border border-slate-500 focus:border-amber-400 text-white font-mono text-center text-sm rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all dir-ltr"
                  />
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-200 text-[10px] font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-300" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-xl font-black text-xs text-slate-950 shadow-md transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'student'
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200'
                      : activeTab === 'teacher'
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200'
                      : 'bg-gradient-to-r from-purple-400 to-indigo-300 text-white hover:from-purple-300 hover:to-indigo-200'
                  }`}
                >
                  <span>تسجيل الدخول للمنظومة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            <p className="text-[10px] text-center text-slate-300 mt-2.5 pt-1.5 border-t border-slate-600">
              💡 يمكنك الحصول على كود الوصول الخاص بك من إدارة المدرسة أو المعلم.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};
