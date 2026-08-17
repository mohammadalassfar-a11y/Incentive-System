import React, { useState } from 'react';
import { Search, Filter, CheckSquare, Square, Plus, Minus, BookOpen, Heart, Clock, Sparkles, UserCheck, AlertCircle, CheckCircle2, XCircle, Calendar, Send, ShieldAlert, Award, FileText, Download, Trophy, Trash2, History } from 'lucide-react';
import { Student, Grade, Criterion, User, CategoryType, AttendanceRecord, EvaluationLog } from '../types';
import { exportStudentsToCSV, exportAttendanceToCSV } from '../utils/exportUtils';
import { getStudentSchoolRank } from '../utils/rankUtils';

interface TeacherDashboardProps {
  currentUser: User;
  students: Student[];
  grades: Grade[];
  criteria: Criterion[];
  logs: EvaluationLog[];
  attendance: AttendanceRecord[];
  onEvaluateStudents: (
    studentIds: string[],
    criterion: Criterion,
    reason: string,
    teacherName: string
  ) => void;
  onDeleteLog: (logId: string) => void;
  onUpdateAttendance: (studentId: string, status: 'present' | 'absent' | 'late') => void;
  onOpenTopTen?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentUser,
  students,
  grades,
  criteria,
  logs,
  attendance,
  onEvaluateStudents,
  onDeleteLog,
  onUpdateAttendance,
  onOpenTopTen,
}) => {
  const [selectedGradeId, setSelectedGradeId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'evaluation' | 'logs'>('evaluation');

  // Multi-select for bulk evaluation
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Modal / Drawer state for evaluation
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [selectedCriterion, setSelectedCriterion] = useState<Criterion | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | 'all'>('all');
  const [customReason, setCustomReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete Log confirmation state
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);

  // Filter students
  const filteredStudents = students.filter((st) => {
    const matchesGrade = selectedGradeId === 'all' || st.gradeId === selectedGradeId;
    const matchesSearch =
      st.name.includes(searchQuery.trim()) || st.code.includes(searchQuery.trim());
    return matchesGrade && matchesSearch;
  });

  const getGradeName = (gradeId: string) => {
    const g = grades.find((item) => item.id === gradeId);
    return g ? g.name : 'الصف الدراسي';
  };

  const toggleSelectStudent = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((item) => item !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const selectAllFiltered = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleOpenEvalModal = () => {
    if (selectedStudentIds.length === 0) return;
    setIsEvalModalOpen(true);
    setSuccessMsg('');
  };

  const handleExecuteEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCriterion) return;

    const reason = customReason.trim() || selectedCriterion.title;
    onEvaluateStudents(selectedStudentIds, selectedCriterion, reason, currentUser.name);

    setSuccessMsg(`تم رصد التقييم بنجاح لعدد ${selectedStudentIds.length} طالب/طالبة`);
    setTimeout(() => {
      setIsEvalModalOpen(false);
      setSelectedStudentIds([]);
      setSelectedCriterion(null);
      setCustomReason('');
      setSuccessMsg('');
    }, 1500);
  };

  const filteredCriteria = criteria.filter(
    (c) => categoryFilter === 'all' || c.category === categoryFilter
  );

  // Filter evaluation logs for current teacher
  const myLogs = logs.filter((l) => {
    const matchesTeacher = l.teacherName === currentUser.name;
    const matchesSearch =
      l.studentName.includes(searchQuery.trim()) ||
      l.criterionTitle.includes(searchQuery.trim()) ||
      (l.reason && l.reason.includes(searchQuery.trim()));
    const matchesGrade = selectedGradeId === 'all' || l.gradeName === getGradeName(selectedGradeId);
    return matchesTeacher && matchesSearch && matchesGrade;
  });

  // Today date string (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  const getStudentAttendanceStatus = (studentId: string) => {
    const rec = attendance.find(
      (a) => a.studentId === studentId && a.date === todayStr
    );
    return rec ? rec.status : 'present'; // default present
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner / Teacher Info */}
      <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 text-xs font-bold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              لوحة المعلم والمقيم
            </span>
            <span className="text-xs text-slate-200 font-mono">
              تاريخ اليوم: {todayStr}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            أهلاً بك، {currentUser.name}
          </h2>
          <p className="text-xs text-slate-200 mt-1">
            رصد النقاط التحفيزية، التنبيهات السلوكية، ومتابعة سجل التقييمات والمرصودات للطلاب
          </p>
        </div>

        {/* Mode Selector Tabs & Export */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-2xl border border-slate-600 flex-1 md:flex-initial">
            <button
              type="button"
              onClick={() => setActiveTab('evaluation')}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                activeTab === 'evaluation'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>رصد النقاط والسلوك</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                activeTab === 'logs'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>سجل المرصودات ({logs.filter(l => l.teacherName === currentUser.name).length})</span>
            </button>
          </div>

          {onOpenTopTen && (
            <button
              type="button"
              onClick={onOpenTopTen}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
              title="عرض قائمة العشرة الأوائل على مستوى المدرسة"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>العشرة الأوائل</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => exportStudentsToCSV(filteredStudents, grades, 'مدارس الكلية العلمية الإسلامية')}
            className="px-3.5 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
            title="تصدير كشف البيانات أوتوماتيكياً كملف Excel/CSV"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            <span>تصدير أوتوماتيكي (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-300 absolute right-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث باسم الطالب أو الكود..."
            className="w-full bg-slate-800 border border-slate-500 focus:border-emerald-400 text-white text-xs sm:text-sm rounded-2xl pr-10 pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>

        {/* Grade Filter Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-200 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            تصفية الصفوف:
          </span>

          <button
            type="button"
            onClick={() => setSelectedGradeId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedGradeId === 'all'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-200 hover:text-white border border-slate-600'
            }`}
          >
            جميع الصفوف
          </button>

          {grades.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelectedGradeId(g.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedGradeId === g.id
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-200 hover:text-white border border-slate-600'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

      </div>

      {/* Main Content View based on Active Tab */}
      {activeTab === 'evaluation' ? (
        <div className="space-y-4">
          
          {/* Action Bar for Bulk Selection */}
          <div className="bg-slate-700/80 border border-slate-600 rounded-2xl p-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={selectAllFiltered}
              className="flex items-center gap-2 text-xs font-bold text-slate-100 hover:text-white"
            >
              {selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0 ? (
                <CheckSquare className="w-5 h-5 text-emerald-400" />
              ) : (
                <Square className="w-5 h-5 text-slate-400" />
              )}
              <span>
                تحديد الكل ({selectedStudentIds.length} من {filteredStudents.length} محدد)
              </span>
            </button>

            <button
              type="button"
              disabled={selectedStudentIds.length === 0}
              onClick={handleOpenEvalModal}
              className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-2 transition ${
                selectedStudentIds.length > 0
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 hover:from-emerald-300 hover:to-teal-200 cursor-pointer'
                  : 'bg-slate-750 bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>رصد التقييم للطلاب المحددين ({selectedStudentIds.length})</span>
            </button>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStudents.map((st) => {
              const isSelected = selectedStudentIds.includes(st.id);
              return (
                <div
                  key={st.id}
                  onClick={() => toggleSelectStudent(st.id)}
                  className={`relative p-5 rounded-3xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-400 shadow-xl shadow-emerald-500/15'
                      : 'bg-slate-700/85 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-650 bg-slate-600 border border-slate-500 flex items-center justify-center font-bold text-slate-100 text-sm">
                        🎓
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-1">
                          {st.name}
                        </h4>
                        <span className="text-[11px] text-slate-200 block font-mono">
                          الكود: {st.code}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-600 flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium truncate max-w-[120px]">
                      {getGradeName(st.gradeId)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-amber-200 bg-amber-500/25 px-2 py-0.5 rounded-full border border-amber-500/40" title="المركز على مستوى المدرسة">
                        #{getStudentSchoolRank(st.id, students).rank} مدرسة
                      </span>
                      <span className="font-extrabold text-amber-200 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                        {st.points} ن
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredStudents.length === 0 && (
            <div className="bg-slate-700/50 border border-dashed border-slate-600 rounded-3xl p-12 text-center">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-200">لم يتم العثور على نتائج</h3>
              <p className="text-xs text-slate-300 mt-1">تأكد من اسم الطالب أو الصف المحدد</p>
            </div>
          )}

        </div>
      ) : (
        /* Evaluation Logs & Deletion View for Teacher */
        <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                <span>سجل التقييمات والمرصودات الخاصة بك</span>
              </h3>
              <p className="text-xs text-slate-200 mt-1">
                تستطيع مراجعة كل تقييم قمت برصده للطلاب وحذفه للتراجع وإلغاء النقاط بمرونة
              </p>
            </div>

            <div className="flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/35 px-3 py-1.5 rounded-2xl text-xs font-bold text-indigo-100">
              <span>إجمالي مرصوداتك: {myLogs.length} عملية تقييم</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-800 text-slate-200 font-bold uppercase border-b border-slate-600">
                <tr>
                  <th className="p-3.5">التاريخ والوقت</th>
                  <th className="p-3.5">اسم الطالب</th>
                  <th className="p-3.5">الصف</th>
                  <th className="p-3.5">معيار التقييم</th>
                  <th className="p-3.5 font-mono">النقاط</th>
                  <th className="p-3.5">السبب / الملاحظات</th>
                  <th className="p-3.5 text-center">حذف / إلغاء المرصود</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600/60 font-medium">
                {myLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-650/40 hover:bg-slate-600/30 transition">
                    <td className="p-3.5 font-mono text-slate-200 dir-ltr text-right">{log.date}</td>
                    <td className="p-3.5 text-white font-bold">{log.studentName}</td>
                    <td className="p-3.5 text-slate-200">{log.gradeName}</td>
                    <td className="p-3.5 text-slate-100">{log.criterionTitle}</td>
                    <td
                      className={`p-3.5 font-mono font-extrabold ${
                        log.type === 'positive' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {log.type === 'positive' ? `+${log.points}` : `-${log.points}`}
                    </td>
                    <td className="p-3.5 text-slate-200 max-w-xs truncate">{log.reason || '-'}</td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => setDeletingLogId(log.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 mx-auto"
                        title="حذف هذا المرصود والتراجع عن النقاط"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {myLogs.length === 0 && (
              <div className="p-12 text-center text-slate-300 text-xs">
                لا توجد تقييمات مرصودة مطابقة للبحث أو الصف المحدد
              </div>
            )}
          </div>
        </div>
      )}

      {/* Evaluation Modal */}
      {isEvalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-750 bg-slate-700 border border-slate-600 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-400" />
              <span>رصد نقاط التقييم السلوكي والأكاديمي</span>
            </h3>
            <p className="text-xs text-slate-200 mb-6">
              سيتم تطبيقه على <span className="text-emerald-300 font-bold">{selectedStudentIds.length}</span> طلاب محددين
            </p>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                  categoryFilter === 'all'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-200 hover:text-white border border-slate-600'
                }`}
              >
                جميع المجالات
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('academic')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                  categoryFilter === 'academic'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-200 hover:text-white border border-slate-600'
                }`}
              >
                📚 التميز الأكاديمي
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('moral')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                  categoryFilter === 'moral'
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-800 text-slate-200 hover:text-white border border-slate-600'
                }`}
              >
                🌟 السلوك والتربية
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('attendance')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                  categoryFilter === 'attendance'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-200 hover:text-white border border-slate-600'
                }`}
              >
                ⏰ الانضباط والحضور
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('participation')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                  categoryFilter === 'participation'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-200 hover:text-white border border-slate-600'
                }`}
              >
                🏆 المشاركة والأنشطة
              </button>
            </div>

            {/* Criteria List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto mb-6 pr-1">
              {filteredCriteria.map((crit) => {
                const isSelected = selectedCriterion?.id === crit.id;
                return (
                  <div
                    key={crit.id}
                    onClick={() => setSelectedCriterion(crit)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? crit.type === 'positive'
                          ? 'bg-emerald-950/40 border-emerald-400 shadow-md'
                          : 'bg-rose-950/40 border-rose-400 shadow-md'
                        : 'bg-slate-800 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white">{crit.title}</h5>
                      <span className="text-[10px] text-slate-200 block mt-0.5">
                        {crit.type === 'positive' ? 'إيجابي (تحفيز)' : 'سلبي (تنبيه)'}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono shrink-0 ${
                        crit.type === 'positive'
                          ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {crit.type === 'positive' ? `+${crit.points}` : `-${crit.points}`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Custom Reason */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-200 mb-2">
                ملاحظات أو سبب إضافي (اختياري):
              </label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="أدخل سبب التقييم أو اتركه افتراضياً حسب معيار التقييم..."
                className="w-full bg-slate-800 border border-slate-500 text-white text-xs rounded-xl py-2.5 px-3 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-600">
              <button
                type="button"
                onClick={() => setIsEvalModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-600 text-slate-200 text-xs font-bold hover:bg-slate-500 transition"
              >
                إلغاء
              </button>

              <button
                type="button"
                disabled={!selectedCriterion}
                onClick={handleExecuteEvaluation}
                className={`px-6 py-2.5 rounded-xl text-xs font-black shadow-xl flex items-center gap-2 transition ${
                  selectedCriterion
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer shadow-emerald-500/20'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>تأكيد ورصد التقييم</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Teacher */}
      {deletingLogId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-750 bg-slate-700 border border-slate-600 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-white mb-2">
              تأكيد حذف التقييم المرصود؟
            </h3>
            <p className="text-xs text-slate-200 mb-6 leading-relaxed">
              عند حذف هذا التقييم، سيتم إلغاء السجل وتعديل رصيد نقاط الطالب تلقائياً (تعديل بالخصم أو الإرجاع حسب نوع التقييم).
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingLogId(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-600 text-slate-200 text-xs font-bold hover:bg-slate-500 transition"
              >
                تراجع وإلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteLog(deletingLogId);
                  setDeletingLogId(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-500 text-slate-950 text-xs font-black hover:bg-rose-400 transition shadow-lg shadow-rose-500/20"
              >
                تأكيد حذف التقييم
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
