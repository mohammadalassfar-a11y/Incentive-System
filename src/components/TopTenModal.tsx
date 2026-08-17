import React from 'react';
import { Crown, Trophy, Sparkles, X, Printer, Medal, Award, UserCheck } from 'lucide-react';
import { Student, Grade } from '../types';
import { getTopTenSchoolStudents } from '../utils/rankUtils';
import { motion } from 'motion/react';

interface TopTenModalProps {
  students: Student[];
  grades: Grade[];
  schoolName: string;
  onClose: () => void;
}

export const TopTenModal: React.FC<TopTenModalProps> = ({
  students,
  grades,
  schoolName,
  onClose,
}) => {
  const topTen = getTopTenSchoolStudents(students, grades);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg border border-amber-300">
            🥇 1
          </div>
        );
      case 2:
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-950 font-black text-sm flex items-center justify-center shadow-md border border-slate-300">
            🥈 2
          </div>
        );
      case 3:
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-500 text-slate-100 font-black text-sm flex items-center justify-center shadow-md border border-amber-600">
            🥉 3
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-black text-xs flex items-center justify-center">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto dir-rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-slate-850 bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="no-print p-5 sm:p-6 border-b border-slate-700 flex items-center justify-between gap-4 relative z-10 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  لوحة الشرف والمنافسة السلوكية
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white mt-1">
                قائمة العشرة الأوائل على مستوى المدرسة 🏆
              </h2>
              <p className="text-xs text-slate-300">
                {schoolName} — أبطال التميز في رصيد النقاط السلوكية والأكاديمية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-600"
              title="طباعة لوحة الشرف"
            >
              <Printer className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">طباعة</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Header (Visible only on print) */}
        <div className="hidden print:block p-6 text-center border-b border-slate-300">
          <h1 className="text-2xl font-black">{schoolName}</h1>
          <h2 className="text-xl font-bold mt-1">لوحة الشرف: قائمة العشرة الأوائل على مستوى المدرسة</h2>
          <p className="text-xs text-slate-600 mt-1">تاريخ الاستخراج: {new Date().toLocaleDateString('ar-EG')}</p>
        </div>

        {/* Modal Body / Top 10 List */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-3 relative z-10">
          {topTen.length > 0 ? (
            topTen.map((item) => {
              const isGold = item.rank === 1;
              const isSilver = item.rank === 2;
              const isBronze = item.rank === 3;

              return (
                <div
                  key={item.student.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isGold
                      ? 'bg-gradient-to-r from-amber-950/60 via-slate-800 to-slate-900 border-amber-500/50 shadow-xl shadow-amber-500/10'
                      : isSilver
                      ? 'bg-gradient-to-r from-slate-800/90 via-slate-800 to-slate-900 border-slate-500/40 shadow-md'
                      : isBronze
                      ? 'bg-gradient-to-r from-amber-950/30 via-slate-800 to-slate-900 border-amber-700/40 shadow-md'
                      : 'bg-slate-900/70 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  {/* Rank & Student Info */}
                  <div className="flex items-center gap-3">
                    {getRankBadge(item.rank)}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-bold text-sm sm:text-base ${isGold ? 'text-amber-300 text-base sm:text-lg font-black' : 'text-white'}`}>
                          {item.student.name}
                        </h3>
                        {isGold && (
                          <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black">
                            👑 الأول على المدرسة
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                        <span className="text-slate-200 font-medium">{item.gradeName}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-slate-400">كود: {item.student.code}</span>
                      </div>
                    </div>
                  </div>

                  {/* Points Badge */}
                  <div className="shrink-0 text-left">
                    <div className={`px-3.5 py-1.5 rounded-xl font-black text-sm sm:text-base font-mono dir-ltr flex items-center gap-1 shadow-md ${
                      isGold
                        ? 'bg-amber-500 text-slate-950 border border-amber-300'
                        : isSilver
                        ? 'bg-slate-200 text-slate-950 border border-slate-300'
                        : isBronze
                        ? 'bg-amber-700 text-amber-100 border border-amber-600'
                        : 'bg-slate-700 text-amber-300 border border-slate-600'
                    }`}>
                      <span>{item.student.points}</span>
                      <span className="text-xs font-normal">نقطة</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              لا يوجد طلاب مضافون في المنظومة حالياً.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="no-print p-4 bg-slate-900 border-t border-slate-700 text-center text-xs text-slate-400">
          💡 يتم تحديث الترتيب تلقائياً فور رصيد المعلمين والإدارة لأي نقاط جديدة للطلاب.
        </div>
      </motion.div>
    </div>
  );
};
