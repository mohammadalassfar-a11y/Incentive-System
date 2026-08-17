import React, { useState } from 'react';
import { Crown, Trophy, Sparkles, Calendar, BookOpen, Heart, Clock, Award, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Printer, Medal, UserCheck } from 'lucide-react';
import { Student, Grade, EvaluationLog, Hero, Period } from '../types';
import { CertificateModal } from './CertificateModal';
import { getStudentSchoolRank } from '../utils/rankUtils';
import { motion } from 'motion/react';

interface StudentDashboardProps {
  student: Student;
  grades: Grade[];
  logs: EvaluationLog[];
  heroes: Hero[];
  activePeriod?: Period;
  schoolName: string;
  allStudents?: Student[];
  onOpenTopTen?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  grades,
  logs,
  heroes,
  activePeriod,
  schoolName,
  allStudents = [],
  onOpenTopTen,
}) => {
  const [selectedHeroCert, setSelectedHeroCert] = useState<Hero | null>(null);

  const grade = grades.find((g) => g.id === student.gradeId);
  const gradeName = grade ? grade.name : 'الصف الدراسي';

  // Compute school-wide rank
  const { rank, totalStudents } = getStudentSchoolRank(student.id, allStudents.length > 0 ? allStudents : [student]);

  // Student specific logs
  const studentLogs = logs.filter((l) => l.studentId === student.id);

  // Student specific certificates / crowns
  const studentHeroes = heroes.filter((h) => h.studentId === student.id);

  // Period target calculation
  const targetPoints = activePeriod?.targetPoints || 500;
  const progressPercent = Math.min(Math.round((student.points / targetPoints) * 100), 100);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'academic':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'moral':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'attendance':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'participation':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      default:
        return <Award className="w-4 h-4 text-purple-400" />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'academic':
        return 'التميز الأكاديمي';
      case 'moral':
        return 'السلوك وحسن الخلق';
      case 'attendance':
        return 'الانضباط والحضور';
      case 'participation':
        return 'المشاركة والأنشطة';
      default:
        return 'تقييم عام';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="relative overflow-hidden bg-slate-700/85 border border-slate-600 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-1 shadow-2xl shadow-amber-500/20 border-2 border-amber-300 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center text-3xl font-black text-amber-400">
                🎓
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/35 text-xs font-bold flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  كود الطالب: <span className="font-mono text-sm">{student.code}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-100 border border-indigo-500/35 text-xs font-semibold">
                  {gradeName}
                </span>

                {/* School Rank Badge */}
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-200 border border-amber-500/50 text-xs font-extrabold flex items-center gap-1 shadow-sm">
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  المركز #{rank} على مستوى المدرسة {totalStudents > 0 && `(من أصل ${totalStudents})`}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {student.name}
              </h2>
              {student.notes && (
                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                  📝 {student.notes}
                </p>
              )}
            </div>
          </div>

          {/* Points Counter Badge & Top 10 button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="bg-slate-800/90 border border-amber-500/50 rounded-2xl p-4 sm:px-8 sm:py-5 flex items-center justify-between md:justify-center gap-6 shadow-xl glow-card-gold">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-200 block">رصيد النقاط الكلي</span>
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200 font-mono">
                  {student.points}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Crown className="w-7 h-7" />
              </div>
            </div>

            {onOpenTopTen && (
              <button
                type="button"
                onClick={onOpenTopTen}
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500/30 via-yellow-500/30 to-amber-500/20 border border-amber-500/50 hover:border-amber-400 text-amber-200 hover:text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-md hover:shadow-amber-500/20"
              >
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>قائمة العشرة الأوائل</span>
              </button>
            )}
          </div>

        </div>

        {/* Competition Goal Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-600">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-100 mb-2">
            <span className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>
                التقدم نحو هدف {activePeriod ? activePeriod.title : 'وسام التميز التنافسي'} ({targetPoints} نقطة)
              </span>
            </span>
            <span className="text-amber-300 font-mono">{progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-800 h-3.5 rounded-full border border-slate-600 overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full shadow-lg"
            ></motion.div>
          </div>
          <p className="text-[11px] text-slate-200 mt-1.5 text-left font-medium">
            متبقي <span className="text-amber-300 font-bold font-mono">{Math.max(0, targetPoints - student.points)}</span> نقطة للوصول إلى هدف التتويج الملكي القادم
          </p>
        </div>

      </div>

      {/* Royal Honor Certificates Wall (حائط التتويج والشواهد الملكية) */}
      <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Medal className="w-6 h-6 text-amber-400" />
              <span>حائط الأبطال والشواهد الملكية (سجل التتويج)</span>
            </h3>
            <p className="text-xs text-slate-200 mt-1">
              الشهادات والأوسمة التكريمية المكتسبة خلال الفترات التنافسية
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
            {studentHeroes.length} أوسمة مكتسبة
          </span>
        </div>

        {studentHeroes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentHeroes.map((hero) => (
              <div
                key={hero.id}
                className="bg-gradient-to-r from-amber-950/40 via-slate-800 to-slate-750 border border-amber-500/40 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-xl hover:border-amber-400 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 text-xl font-black">
                    🏆
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-300 text-sm sm:text-base">
                      {hero.periodTitle}
                    </h4>
                    <span className="text-xs text-slate-200 block mt-0.5">
                      تاريخ التتويج: {hero.crownedDate} | الرصيد: <span className="text-amber-400 font-bold">{hero.points}</span> نقطة
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedHeroCert(hero)}
                  className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition shrink-0 flex items-center gap-1.5 shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>عرض الشهادة</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/60 border border-dashed border-slate-600 rounded-2xl p-8 text-center">
            <Award className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-200">لا توجد شهادات متوجة بعد</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
              اجتهد في جمع النقاط الأكاديمية والسلوكية لتكون بطل الفترة التنافسية القادمة وتحصل على شهادة التكريم الملكية!
            </p>
          </div>
        )}
      </div>

      {/* Logs and Evaluations Timeline */}
      <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-indigo-400" />
              <span>سجل التقييمات والعمليات الأخيرة</span>
            </h3>
            <p className="text-xs text-slate-200 mt-1">
              تفاصيل النقاط المضافة أو المخصومة وأسباب التقييم من قِبل المعلمين
            </p>
          </div>
          <span className="text-xs font-mono text-slate-200">
            إجمالي السجلات: {studentLogs.length}
          </span>
        </div>

        {studentLogs.length > 0 ? (
          <div className="space-y-3">
            {studentLogs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  log.type === 'positive'
                    ? 'bg-emerald-950/25 border-emerald-500/40 hover:border-emerald-500/60'
                    : 'bg-rose-950/25 border-rose-500/40 hover:border-rose-500/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      log.type === 'positive'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {log.type === 'positive' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-white text-sm">
                        {log.criterionTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-650 bg-slate-600 text-slate-100 text-[11px] font-medium flex items-center gap-1">
                        {getCategoryIcon(log.category)}
                        {getCategoryLabel(log.category)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-medium">
                      السبب: {log.reason}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-1.5">
                      <span>👨‍🏫 المعلم: {log.teacherName}</span>
                      <span>•</span>
                      <span className="font-mono dir-ltr">{log.date}</span>
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-center shrink-0">
                  <span
                    className={`px-3.5 py-1.5 rounded-xl font-black text-sm font-mono dir-ltr flex items-center gap-1 ${
                      log.type === 'positive'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {log.type === 'positive' ? `+${log.points}` : `-${log.points}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/60 border border-dashed border-slate-600 rounded-2xl p-8 text-center text-slate-300 text-xs">
            لا توجد سجلات تقييم مسجلة لهذا الطالب حتى الآن.
          </div>
        )}

      </div>

      {/* Royal Certificate Modal */}
      {selectedHeroCert && (
        <CertificateModal
          hero={selectedHeroCert}
          schoolName={schoolName}
          onClose={() => setSelectedHeroCert(null)}
        />
      )}

    </div>
  );
};
