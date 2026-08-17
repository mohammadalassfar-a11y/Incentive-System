import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Shield, Users, GraduationCap, Award, Calendar, FileSpreadsheet, Settings, Plus, Edit3, Trash2, Crown, Sparkles, CheckCircle2, AlertTriangle, Printer, RefreshCw, Save, UserCheck, Key, BookOpen, Clock, Heart, Search, Download, FileDown, Trophy, Zap, UserPlus, Check, X } from 'lucide-react';
import { Grade, Student, User, Criterion, Period, EvaluationLog, Hero, CategoryType } from '../types';
import { BulkStudentModal } from './BulkStudentModal';
import { PeriodEditModal } from './PeriodEditModal';
import { CertificateModal } from './CertificateModal';
import { exportLogsToCSV, exportStudentsToCSV, exportSystemBackupJSON } from '../utils/exportUtils';
import { getStudentSchoolRank } from '../utils/rankUtils';

interface AdminDashboardProps {
  schoolName: string;
  grades: Grade[];
  students: Student[];
  users: User[];
  criteria: Criterion[];
  periods: Period[];
  logs: EvaluationLog[];
  heroes: Hero[];
  onUpdateSchoolName: (name: string) => void;
  onUpdateGrades: (grades: Grade[]) => void;
  onUpdateStudents: (students: Student[]) => void;
  onUpdateUsers: (users: User[]) => void;
  onUpdateCriteria: (criteria: Criterion[]) => void;
  onUpdatePeriods: (periods: Period[]) => void;
  onDeleteLog: (logId: string) => void;
  onCrownWinner: (hero: Hero) => void;
  onResetData: () => void;
  onOpenTopTen?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  schoolName,
  grades,
  students,
  users,
  criteria,
  periods,
  logs,
  heroes,
  onUpdateSchoolName,
  onUpdateGrades,
  onUpdateStudents,
  onUpdateUsers,
  onUpdateCriteria,
  onUpdatePeriods,
  onDeleteLog,
  onCrownWinner,
  onResetData,
  onOpenTopTen,
}) => {
  const [activeTab, setActiveTab] = useState<
    'users_grades' | 'criteria' | 'periods' | 'reports' | 'settings'
  >('users_grades');

  // Deletion state for log entry
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);

  // School name edit state
  const [tempSchoolName, setTempSchoolName] = useState(schoolName);
  const [schoolSavedMsg, setSchoolSavedMsg] = useState('');

  // Modals state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [viewingHeroCert, setViewingHeroCert] = useState<Hero | null>(null);

  // New Grade state
  const [newGradeName, setNewGradeName] = useState('');
  
  // New Single Student state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentCode, setNewStudentCode] = useState('');
  const [newStudentGradeId, setNewStudentGradeId] = useState(grades[0]?.id || '');

  // New Teacher state
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherPasscode, setNewTeacherPasscode] = useState('');

  // Editing Student state
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editStudentName, setEditStudentName] = useState<string>('');
  const [editStudentCode, setEditStudentCode] = useState<string>('');
  const [editStudentGradeId, setEditStudentGradeId] = useState<string>('');

  // Editing Teacher state
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [editTeacherName, setEditTeacherName] = useState<string>('');
  const [editTeacherPasscode, setEditTeacherPasscode] = useState<string>('');

  // New Criterion state
  const [newCritTitle, setNewCritTitle] = useState('');
  const [newCritPoints, setNewCritPoints] = useState(15);
  const [newCritType, setNewCritType] = useState<'positive' | 'negative'>('positive');
  const [newCritCategory, setNewCritCategory] = useState<CategoryType>('academic');

  // Reports Filter
  const [reportGradeId, setReportGradeId] = useState('all');
  const [reportSearch, setReportSearch] = useState('');

  // Winner crowning selection
  const [crownPeriodId, setCrownPeriodId] = useState<string>('');
  const [crownStudentId, setCrownStudentId] = useState<string>('');

  // Grade Helpers
  const getGradeName = (id: string) => {
    const g = grades.find((item) => item.id === id);
    return g ? g.name : 'الصف الدراسي';
  };

  // Grade Handlers
  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGradeName.trim()) return;
    const newG: Grade = {
      id: `g_${Date.now()}`,
      name: newGradeName.trim(),
    };
    onUpdateGrades([...grades, newG]);
    setNewGradeName('');
  };

  const handleDeleteGrade = (id: string) => {
    if (confirm('هل أنت تأكد من حذف هذا الصف؟')) {
      onUpdateGrades(grades.filter((g) => g.id !== id));
    }
  };

  // Code Generators
  const generateUniqueStudentCode = (): string => {
    let code = '';
    let attempts = 0;
    do {
      code = Math.floor(1000 + Math.random() * 9000).toString();
      attempts++;
    } while (students.some((s) => s.code === code) && attempts < 100);
    return code;
  };

  const generateUniqueTeacherPasscode = (): string => {
    let code = '';
    let attempts = 0;
    do {
      code = Math.floor(1000 + Math.random() * 9000).toString();
      attempts++;
    } while (users.some((u) => u.passcode === code) && attempts < 100);
    return code;
  };

  const handleGenerateStudentCode = () => {
    setNewStudentCode(generateUniqueStudentCode());
  };

  const handleRegenerateStudentCode = (studentId: string) => {
    const newCode = generateUniqueStudentCode();
    const updated = students.map((s) => (s.id === studentId ? { ...s, code: newCode } : s));
    onUpdateStudents(updated);
  };

  // Student Handlers
  const handleAddSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    const finalCode = newStudentCode.trim() || generateUniqueStudentCode();
    const newSt: Student = {
      id: `st_${Date.now()}`,
      code: finalCode,
      name: newStudentName.trim(),
      gradeId: newStudentGradeId || grades[0]?.id || '',
      points: 0,
    };
    onUpdateStudents([...students, newSt]);
    setNewStudentName('');
    setNewStudentCode('');
  };

  const handleBulkStudentsSave = (newSts: Omit<Student, 'id' | 'points'>[]) => {
    const prepared: Student[] = newSts.map((st, i) => ({
      ...st,
      id: `st_bulk_${Date.now()}_${i}`,
      points: 0,
    }));
    onUpdateStudents([...students, ...prepared]);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('هل تريد حذف هذا الطالب من النظام؟')) {
      onUpdateStudents(students.filter((s) => s.id !== id));
    }
  };

  // Edit Student Handlers
  const handleStartEditStudent = (st: Student) => {
    setEditingStudentId(st.id);
    setEditStudentName(st.name);
    setEditStudentCode(st.code);
    setEditStudentGradeId(st.gradeId);
  };

  const handleSaveEditStudent = (studentId: string) => {
    if (!editStudentName.trim() || !editStudentCode.trim()) return;
    const updated = students.map((s) =>
      s.id === studentId
        ? {
            ...s,
            name: editStudentName.trim(),
            code: editStudentCode.trim(),
            gradeId: editStudentGradeId,
          }
        : s
    );
    onUpdateStudents(updated);
    setEditingStudentId(null);
  };

  const handleCancelEditStudent = () => {
    setEditingStudentId(null);
  };

  // Teacher Handlers
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherPasscode.trim()) return;
    const newU: User = {
      id: `u_${Date.now()}`,
      name: newTeacherName.trim(),
      passcode: newTeacherPasscode.trim(),
      role: 'teacher',
    };
    onUpdateUsers([...users, newU]);
    setNewTeacherName('');
    setNewTeacherPasscode('');
  };

  const handleDeleteTeacher = (id: string) => {
    if (confirm('هل تريد حذف حساب هذا المعلم؟')) {
      onUpdateUsers(users.filter((u) => u.id !== id));
    }
  };

  // Edit Teacher Handlers
  const handleStartEditTeacher = (teacher: User) => {
    setEditingTeacherId(teacher.id);
    setEditTeacherName(teacher.name);
    setEditTeacherPasscode(teacher.passcode);
  };

  const handleSaveEditTeacher = (teacherId: string) => {
    if (!editTeacherName.trim() || !editTeacherPasscode.trim()) return;
    const updated = users.map((u) =>
      u.id === teacherId
        ? {
            ...u,
            name: editTeacherName.trim(),
            passcode: editTeacherPasscode.trim(),
          }
        : u
    );
    onUpdateUsers(updated);
    setEditingTeacherId(null);
  };

  const handleCancelEditTeacher = () => {
    setEditingTeacherId(null);
  };

  // Criterion Handlers
  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritTitle.trim()) return;
    const newC: Criterion = {
      id: `c_${Date.now()}`,
      title: newCritTitle.trim(),
      points: Number(newCritPoints) || 10,
      type: newCritType,
      category: newCritCategory,
      icon: 'Award',
    };
    onUpdateCriteria([...criteria, newC]);
    setNewCritTitle('');
  };

  const handleDeleteCriterion = (id: string) => {
    if (confirm('هل تريد حذف معيار التقييم هذا؟')) {
      onUpdateCriteria(criteria.filter((c) => c.id !== id));
    }
  };

  // Period Handlers
  const handleSavePeriod = (periodData: Partial<Period>) => {
    if (periodData.id) {
      // Edit
      const updated = periods.map((p) =>
        p.id === periodData.id ? { ...p, ...periodData } : p
      );
      onUpdatePeriods(updated);
    } else {
      // Create new
      const newP: Period = {
        id: `p_${Date.now()}`,
        title: periodData.title || 'فترة تنافسية جديدة',
        startDate: periodData.startDate || '2026-08-01',
        endDate: periodData.endDate || '2026-10-31',
        isActive: false,
      };
      onUpdatePeriods([...periods, newP]);
    }
  };

  const handleDeletePeriod = (id: string) => {
    if (confirm('هل تريد حذف هذه الفترة التنافسية؟')) {
      onUpdatePeriods(periods.filter((p) => p.id !== id));
    }
  };

  const handleSetActivePeriod = (id: string) => {
    const updated = periods.map((p) => ({
      ...p,
      isActive: p.id === id,
    }));
    onUpdatePeriods(updated);
  };

  // Crowning ceremony trigger
  const handleTriggerCrowning = (e: React.FormEvent) => {
    e.preventDefault();
    const period = periods.find((p) => p.id === crownPeriodId);
    const student = students.find((s) => s.id === crownStudentId);

    if (!period || !student) return;

    // Trigger golden confetti fireworks
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#34d399', '#6366f1', '#ffffff'],
    });

    const newHero: Hero = {
      id: `hero_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentCode: student.code,
      gradeName: getGradeName(student.gradeId),
      periodTitle: period.title,
      points: student.points,
      crownedDate: new Date().toISOString().split('T')[0],
      certificateId: `ROYAL-HERO-${Date.now().toString().slice(-4)}`,
    };

    onCrownWinner(newHero);
    setViewingHeroCert(newHero);
  };

  // Save school name
  const handleSaveSchoolName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempSchoolName.trim()) return;
    onUpdateSchoolName(tempSchoolName.trim());
    setSchoolSavedMsg('تم حفظ اسم المدرسة بنجاح!');
    setTimeout(() => setSchoolSavedMsg(''), 2000);
  };

  // Filtered Logs
  const filteredLogs = logs.filter((l) => {
    const matchGrade = reportGradeId === 'all' || l.gradeName.includes(getGradeName(reportGradeId));
    const matchSearch =
      l.studentName.includes(reportSearch) ||
      l.teacherName.includes(reportSearch) ||
      l.criterionTitle.includes(reportSearch);
    return matchGrade && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Banner */}
      <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/25 border border-purple-500/40 flex items-center justify-center text-purple-200 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              لوحة تحكم المدير المنسق (الإدارة العامة)
            </h2>
            <p className="text-xs text-slate-200 mt-0.5">
              إدارة الهيكل التنظيمي، الصفوف، المعايير، الفترات التنافسية، وتتويج الأبطال
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenTopTen && (
            <button
              type="button"
              onClick={onOpenTopTen}
              className="no-print px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              title="عرض قائمة العشرة الأوائل على مستوى المدرسة"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>العشرة الأوائل</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => exportLogsToCSV(logs, schoolName)}
            className="no-print px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 border border-emerald-500/35 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            title="تصدير جميع التقييمات تلقائياً بتنسيق CSV (Excel)"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            <span>تصدير تلقائي (Excel/CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="no-print px-3.5 py-2 rounded-xl bg-slate-650 bg-slate-600 text-slate-100 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-500"
          >
            <Printer className="w-4 h-4 text-purple-300" />
            <span>طباعة الشاشة</span>
          </button>
        </div>
      </div>

      {/* Admin 5 Main Tabs Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1.5 bg-slate-800 border border-slate-600 rounded-2xl">
        
        <button
          type="button"
          onClick={() => setActiveTab('users_grades')}
          className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'users_grades'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-200 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>الطلاب والصفوف والمعلمين</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('criteria')}
          className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'criteria'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-200 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>معايير التقييم والنقاط</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('periods')}
          className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'periods'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-200 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>الفترات وتتويج الأبطال</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            activeTab === 'reports'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-200 hover:text-white hover:bg-slate-700'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>التقارير والتدقيق</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition col-span-2 sm:col-span-1 ${
            activeTab === 'settings'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-200 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات المنظومة</span>
        </button>

      </div>

      {/* Tab 1: Students, Grades & Teachers */}
      {activeTab === 'users_grades' && (
        <div className="space-y-8">
          
          {/* Grades Management */}
          <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <span>إدارة الصفوف والشعب الدراسية</span>
            </h3>

            <form onSubmit={handleAddGrade} className="flex gap-3 mb-6">
              <input
                type="text"
                value={newGradeName}
                onChange={(e) => setNewGradeName(e.target.value)}
                placeholder="اسم الصف الجديد (مثال: الصف الثاني الثانوي - مسار العلوم)..."
                className="flex-1 bg-slate-800 border border-slate-500 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-400 transition flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة صف</span>
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {grades.map((g) => (
                <div
                  key={g.id}
                  className="p-4 rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-between gap-3"
                >
                  <span className="font-bold text-xs text-white truncate">{g.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteGrade(g.id)}
                    className="p-1.5 rounded-lg text-rose-300 hover:bg-rose-500/20 transition"
                    title="حذف الصف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Students Management */}
          <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>إدارة الطلاب ({students.length} طالب مسجل)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  إضافة فردية أو جماعية وتحديد أكواد الدخول المكونة من 4 أرقام
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsBulkModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-xs font-black hover:from-amber-300 transition shadow-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مجموعة طلاب (Bulk)</span>
              </button>
            </div>

            {/* Single Add Form with Code Generator */}
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-800 border border-slate-600 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>إضافة طلاب جدد في هذا الصف:</span>
                </h4>
              </div>

              <form onSubmit={handleAddSingleStudent} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                {/* Grade Select */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">الصف الدراسي *</label>
                  <select
                    value={newStudentGradeId}
                    onChange={(e) => setNewStudentGradeId(e.target.value)}
                    className="w-full bg-slate-750 bg-slate-700 border border-slate-550 border-slate-600 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400 font-medium"
                  >
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student Name */}
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">اسم الطالب الكامل بالمنصة *</label>
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="مثال: صالح بن عبد الله القحطاني"
                    className="w-full bg-slate-750 bg-slate-700 border border-slate-600 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Code Input with Generate Button */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    رمز الدخول الرباعي <span className="text-amber-400">🔑</span> (اتركه فارغاً للتوليد)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      maxLength={6}
                      value={newStudentCode}
                      onChange={(e) => setNewStudentCode(e.target.value)}
                      placeholder="مثال: 5521"
                      className="flex-1 bg-slate-750 bg-slate-700 border border-slate-600 text-white font-mono text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400 dir-ltr text-center font-bold tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateStudentCode}
                      className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black transition flex items-center gap-1 shrink-0 shadow-md border border-indigo-400/40 active:scale-95"
                      title="توليد كود دخول تلقائي مكون من 4 أرقام"
                    >
                      <span>توليد</span>
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    </button>
                  </div>
                </div>

                {/* Add Student Submit Button */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة الطالب</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-800 text-slate-200 font-bold border-b border-slate-600">
                  <tr>
                    <th className="p-3">الكود</th>
                    <th className="p-3">اسم الطالب</th>
                    <th className="p-3">الصف الدراسي</th>
                    <th className="p-3">المركز بالمدرسة</th>
                    <th className="p-3">رصيد النقاط</th>
                    <th className="p-3 text-center">إجراءات والتعديل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600/60 font-medium">
                  {students.map((st) => {
                    const studentRank = getStudentSchoolRank(st.id, students).rank;
                    const isEditing = editingStudentId === st.id;

                    if (isEditing) {
                      return (
                        <tr key={st.id} className="bg-slate-750 bg-slate-700 border-y border-amber-500/40">
                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editStudentCode}
                                onChange={(e) => setEditStudentCode(e.target.value)}
                                className="w-20 bg-slate-800 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold rounded-lg px-2 py-1.5 text-center dir-ltr"
                              />
                              <button
                                type="button"
                                onClick={() => setEditStudentCode(generateUniqueStudentCode())}
                                className="p-1 rounded-lg bg-indigo-600/40 text-indigo-200 hover:bg-indigo-600/60 transition"
                                title="توليد كود عشوائي جديد"
                              >
                                <Zap className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={editStudentName}
                              onChange={(e) => setEditStudentName(e.target.value)}
                              className="w-full bg-slate-800 border border-amber-500/50 text-white font-bold text-xs rounded-lg px-2.5 py-1.5"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              value={editStudentGradeId}
                              onChange={(e) => setEditStudentGradeId(e.target.value)}
                              className="bg-slate-800 border border-amber-500/50 text-white text-xs rounded-lg px-2 py-1.5"
                            >
                              {grades.map((g) => (
                                <option key={g.id} value={g.id}>
                                  {g.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2 text-slate-300 text-[11px]">
                            المركز #{studentRank}
                          </td>
                          <td className="p-2 font-mono text-amber-300 font-bold">{st.points}</td>
                          <td className="p-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleSaveEditStudent(st.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition flex items-center gap-1"
                                title="حفظ التعديل"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>حفظ</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEditStudent}
                                className="p-1.5 rounded-lg bg-slate-600 text-slate-200 hover:bg-slate-500 transition"
                                title="إلغاء"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={st.id} className="hover:bg-slate-650/40 hover:bg-slate-600/30 transition">
                        <td className="p-3 font-mono text-amber-300 font-bold">{st.code}</td>
                        <td className="p-3 text-white font-bold">{st.name}</td>
                        <td className="p-3 text-slate-200">{getGradeName(st.gradeId)}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                            studentRank === 1
                              ? 'bg-amber-500/25 text-amber-200 border-amber-500/50'
                              : studentRank <= 3
                              ? 'bg-amber-500/15 text-amber-200 border-amber-500/40'
                              : studentRank <= 10
                              ? 'bg-indigo-500/20 text-indigo-100 border-indigo-500/40'
                              : 'bg-slate-800 text-slate-300 border-slate-600'
                          }`}>
                            المركز #{studentRank}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-amber-300 font-bold">{st.points}</td>
                        <td className="p-3 text-center flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEditStudent(st)}
                            className="p-1.5 rounded-lg text-indigo-300 hover:bg-indigo-500/20 transition"
                            title="تعديل اسم أو كود الطالب"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRegenerateStudentCode(st.id)}
                            className="p-1.5 rounded-lg text-amber-300 hover:bg-amber-500/20 transition"
                            title="توليد كود دخول جديد للطالب"
                          >
                            <Zap className="w-4 h-4 text-amber-300 fill-amber-300/20" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(st.id)}
                            className="p-1.5 rounded-lg text-rose-300 hover:bg-rose-500/20 transition"
                            title="حذف الطالب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teachers Management */}
          <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>إدارة المعلمين والمقيمين</span>
            </h3>

            <form onSubmit={handleAddTeacher} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-slate-800 border border-slate-600 items-end">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">اسم المعلم والمادة</label>
                <input
                  type="text"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="اسم المعلم والمادة..."
                  className="w-full bg-slate-750 bg-slate-700 border border-slate-600 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">رمز المرور (اتركه فارغاً للتوليد)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newTeacherPasscode}
                    onChange={(e) => setNewTeacherPasscode(e.target.value)}
                    placeholder="مثال: 1004"
                    className="flex-1 bg-slate-750 bg-slate-700 border border-slate-600 text-white font-mono text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-400 dir-ltr text-center font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setNewTeacherPasscode(generateUniqueTeacherPasscode())}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-600/40 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-xs font-black transition flex items-center gap-1 shrink-0 active:scale-95"
                    title="توليد رمز مرور تلقائي"
                  >
                    <span>توليد</span>
                    <Zap className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition"
              >
                إضافة معلم جديد
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {users
                .filter((u) => u.role === 'teacher')
                .map((t) => {
                  const isEditing = editingTeacherId === t.id;

                  if (isEditing) {
                    return (
                      <div
                        key={t.id}
                        className="p-4 rounded-2xl bg-slate-800 border border-emerald-500/40 space-y-3"
                      >
                        <div>
                          <label className="block text-[10px] text-slate-300 font-bold mb-1">اسم المعلم والمادة</label>
                          <input
                            type="text"
                            value={editTeacherName}
                            onChange={(e) => setEditTeacherName(e.target.value)}
                            className="w-full bg-slate-750 bg-slate-700 border border-emerald-500/50 text-white text-xs font-bold rounded-xl px-2.5 py-1.5"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-300 font-bold mb-1">رمز المرور الخاص بالمعلم</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editTeacherPasscode}
                              onChange={(e) => setEditTeacherPasscode(e.target.value)}
                              className="flex-1 bg-slate-750 bg-slate-700 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold rounded-xl px-2.5 py-1.5 text-center dir-ltr"
                            />
                            <button
                              type="button"
                              onClick={() => setEditTeacherPasscode(generateUniqueTeacherPasscode())}
                              className="p-1.5 rounded-xl bg-emerald-600/40 text-emerald-200 hover:bg-emerald-600/60 transition"
                              title="توليد رمز مرور جديد"
                            >
                              <Zap className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveEditTeacher(t.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>حفظ</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditTeacher}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-650 bg-slate-600 text-slate-200 text-xs font-bold hover:bg-slate-500 transition"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={t.id}
                      className="p-4 rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-white">{t.name}</h4>
                        <span className="text-[11px] text-emerald-300 font-mono block">
                          رمز المرور: {t.passcode}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditTeacher(t)}
                          className="p-1.5 rounded-lg text-indigo-300 hover:bg-indigo-500/20 transition"
                          title="تعديل اسم المعلم أو رمز المرور"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTeacher(t.id)}
                          className="p-1.5 rounded-lg text-rose-300 hover:bg-rose-500/20 transition"
                          title="حذف المعلم"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Criteria Manager */}
      {activeTab === 'criteria' && (
        <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>إدارة معايير التقييم والنقاط السلوكية والأكاديمية</span>
          </h3>

          <form onSubmit={handleAddCriterion} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-800 border border-slate-600">
            <input
              type="text"
              value={newCritTitle}
              onChange={(e) => setNewCritTitle(e.target.value)}
              placeholder="اسم معيار التقييم الجديد..."
              className="sm:col-span-2 bg-slate-750 bg-slate-700 border border-slate-600 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400"
            />
            <input
              type="number"
              value={newCritPoints}
              onChange={(e) => setNewCritPoints(Number(e.target.value))}
              placeholder="عدد النقاط..."
              className="bg-slate-750 bg-slate-700 border border-slate-600 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400 font-mono"
            />
            <select
              value={newCritType}
              onChange={(e) => setNewCritType(e.target.value as 'positive' | 'negative')}
              className="bg-slate-750 bg-slate-700 border border-slate-600 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400"
            >
              <option value="positive">إيجابي (تحفيز)</option>
              <option value="negative">سلبي (تنبيه)</option>
            </select>
            <button
              type="submit"
              className="py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
            >
              إضافة معيار
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {criteria.map((c) => (
              <div
                key={c.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  c.type === 'positive'
                    ? 'bg-emerald-950/25 border-emerald-500/35'
                    : 'bg-rose-950/25 border-rose-500/35'
                }`}
              >
                <div>
                  <h4 className="font-bold text-xs text-white">{c.title}</h4>
                  <span className="text-[11px] text-slate-200 block mt-0.5">
                    النوع: {c.type === 'positive' ? 'تحفيز' : 'تنبيه'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono ${
                      c.type === 'positive'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {c.type === 'positive' ? `+${c.points}` : `-${c.points}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCriterion(c.id)}
                    className="p-1.5 rounded-lg text-rose-300 hover:bg-rose-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Competitive Periods & Crowning */}
      {activeTab === 'periods' && (
        <div className="space-y-8">
          
          {/* Create / Manage Periods */}
          <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span>الفترات التنافسية بالمدرسة</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  تحديد وتعديل وحذف الفترات التنافسية وتفعيل الفترة الحالية النشطة
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingPeriod(null);
                  setIsPeriodModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition flex items-center gap-1.5 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء فترة منافسة جديدة</span>
              </button>
            </div>

            <div className="space-y-3">
              {periods.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                    p.isActive
                      ? 'bg-amber-950/25 border-amber-500/50 shadow-lg'
                      : 'bg-slate-800 border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-white">{p.title}</h4>
                      {p.isActive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                          الفترة النشطة الحالية
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-300 font-mono mt-1 flex-wrap">
                      <span>الفترة: {p.startDate} إلى {p.endDate}</span>
                      <span className="text-amber-300 font-bold bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                        🎯 الهدف: {p.targetPoints || 500} نقطة
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!p.isActive && (
                      <button
                        type="button"
                        onClick={() => handleSetActivePeriod(p.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-700 text-amber-200 hover:bg-slate-600 text-xs font-bold transition"
                      >
                        تفعيل كفترة نشطة
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setEditingPeriod(p);
                        setIsPeriodModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-slate-700 text-slate-200 hover:text-white transition"
                      title="تعديل الفترة"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePeriod(p.id)}
                      className="p-2 rounded-xl bg-slate-700 text-rose-300 hover:bg-rose-500/20 transition"
                      title="حذف الفترة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crowning Ceremony Box */}
          <div className="bg-gradient-to-br from-amber-950/40 via-slate-800 to-slate-750 border-2 border-amber-500/45 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <h3 className="text-xl font-black text-amber-300 mb-2 flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400 animate-bounce" />
              <span>مراسم إعلان وتتويج بطل الفترة التنافسية</span>
            </h3>
            <p className="text-xs text-slate-200 mb-6 max-w-xl">
              اختر الفترة التنافسية والطالب المتصدر لإصدار الشهادة الملكية وإطلاق تأثيرات الألعاب النارية الاحتفالية!
            </p>

            <form onSubmit={handleTriggerCrowning} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={crownPeriodId}
                onChange={(e) => setCrownPeriodId(e.target.value)}
                className="bg-slate-750 bg-slate-700 border border-slate-600 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-amber-400"
              >
                <option value="">-- اختر الفترة التنافسية --</option>
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>

              <select
                value={crownStudentId}
                onChange={(e) => setCrownStudentId(e.target.value)}
                className="bg-slate-750 bg-slate-700 border border-slate-600 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-amber-400"
              >
                <option value="">-- اختر الطالب البطل --</option>
                {[...students]
                  .sort((a, b) => b.points - a.points)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.points} نقطة)
                    </option>
                  ))}
              </select>

              <button
                type="submit"
                disabled={!crownPeriodId || !crownStudentId}
                className={`py-3 px-6 rounded-xl font-black text-xs shadow-2xl transition flex items-center justify-center gap-2 ${
                  crownPeriodId && crownStudentId
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 hover:from-amber-300 cursor-pointer'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>إعلان وتتويج البطل الملكي 👑</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Tab 4: Reports & Audit */}
      {activeTab === 'reports' && (
        <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-6 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                <span>سجلات التدقيق وتقارير الأداء المدرسية</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                تصفية وتدقيق جميع عمليات التقييم المسجلة بالمدرسة
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => exportLogsToCSV(filteredLogs, schoolName)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition flex items-center gap-1.5 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>تصدير أوتوماتيكي للسجلات (CSV)</span>
              </button>

              <button
                type="button"
                onClick={() => exportStudentsToCSV(students, grades, schoolName)}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition flex items-center gap-1.5 shadow-md"
              >
                <FileDown className="w-4 h-4 text-amber-300" />
                <span>تصدير كشف النقاط (CSV)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-650 bg-slate-600 text-slate-100 text-xs font-bold hover:bg-slate-500 transition flex items-center gap-1.5 border border-slate-500"
              >
                <Printer className="w-4 h-4 text-slate-300" />
                <span>طباعة</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-800 border border-slate-600">
            <input
              type="text"
              value={reportSearch}
              onChange={(e) => setReportSearch(e.target.value)}
              placeholder="بحث باسم الطالب أو المعلم أو معيار التقييم..."
              className="bg-slate-750 bg-slate-700 border border-slate-600 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-400"
            />

            <select
              value={reportGradeId}
              onChange={(e) => setReportGradeId(e.target.value)}
              className="bg-slate-750 bg-slate-700 border border-slate-600 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-400"
            >
              <option value="all">جميع الصفوف</option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-800 text-slate-200 font-bold border-b border-slate-600">
                <tr>
                  <th className="p-3">التاريخ والوقت</th>
                  <th className="p-3">اسم الطالب</th>
                  <th className="p-3">الصف</th>
                  <th className="p-3">معيار التقييم</th>
                  <th className="p-3">المعلم</th>
                  <th className="p-3 font-mono">النقاط</th>
                  <th className="p-3 text-center">إجراء (حذف)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600/60 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-650/40 hover:bg-slate-600/30 transition">
                    <td className="p-3 font-mono text-slate-300 dir-ltr text-right">{log.date}</td>
                    <td className="p-3 text-white font-bold">{log.studentName}</td>
                    <td className="p-3 text-slate-200">{log.gradeName}</td>
                    <td className="p-3 text-slate-100">{log.criterionTitle}</td>
                    <td className="p-3 text-emerald-300 font-semibold">{log.teacherName}</td>
                    <td
                      className={`p-3 font-mono font-bold ${
                        log.type === 'positive' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {log.type === 'positive' ? `+${log.points}` : `-${log.points}`}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => setDeletingLogId(log.id)}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/35 transition inline-flex items-center gap-1 text-xs font-bold"
                        title="حذف المرصود والتراجع عن النقاط"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Tab 5: Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          
          {/* School Name Edit */}
          <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              <span>إعدادات مظهر واسم المنظومة</span>
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              تعديل اسم المدرسة العام الذي يظهر في جميع الشاشات والتقارير والشهادات الملكية
            </p>

            <form onSubmit={handleSaveSchoolName} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  اسم المدرسة العام:
                </label>
                <input
                  type="text"
                  value={tempSchoolName}
                  onChange={(e) => setTempSchoolName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-500 text-white text-sm font-bold rounded-xl p-3 focus:outline-none focus:border-purple-400"
                />
              </div>

              {schoolSavedMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{schoolSavedMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-500 text-white text-xs font-bold hover:bg-purple-400 transition shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التغييرات</span>
              </button>
            </form>
          </div>

          {/* Backup Data Export */}
          <div className="bg-slate-700/85 border border-slate-600 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-400" />
              <span>تصدير النسخة الاحتياطية التلقائية للمنظومة</span>
            </h3>
            <p className="text-xs text-slate-300 mb-6 max-w-xl">
              قم بتحميل نسخة احتياطية كاملة تشمل الطلاب، المعلمين، الصفوف، المعايير، وسجلات التقييم والحضور بصيغة (JSON) للقيام بحفظها بأمان.
            </p>

            <button
              type="button"
              onClick={exportSystemBackupJSON}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black hover:bg-emerald-400 transition shadow-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>تصدير نسخة احتياطية (JSON)</span>
            </button>
          </div>

          {/* Reset System Data */}
          <div className="bg-rose-950/25 border border-rose-500/40 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-rose-200 mb-2 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-rose-400" />
              <span>إعادة تعيين بيانات المنظومة للوضع الافتراضي</span>
            </h3>
            <p className="text-xs text-slate-300 mb-6 max-w-xl">
              إعادة تعيين كافة الصفوف والطلاب والسجلات إلى الحالة الابتدائية الأصلية المصممة تجريبياً.
            </p>

            <button
              type="button"
              onClick={() => {
                if (confirm('تنبيه هام: هل أنت متأكد من إعادة تعيين جميع البيانات إلى الوضع الافتراضي؟')) {
                  onResetData();
                  alert('تمت إعادة تعيين البيانات بنجاح!');
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition shadow-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>استرجاع البيانات الافتراضية للسيستم</span>
            </button>
          </div>

        </div>
      )}

      {/* Modals */}
      {isBulkModalOpen && (
        <BulkStudentModal
          grades={grades}
          existingStudents={students}
          onSaveBulk={handleBulkStudentsSave}
          onClose={() => setIsBulkModalOpen(false)}
        />
      )}

      {isPeriodModalOpen && (
        <PeriodEditModal
          period={editingPeriod}
          onSave={handleSavePeriod}
          onClose={() => setIsPeriodModalOpen(false)}
        />
      )}

      {viewingHeroCert && (
        <CertificateModal
          hero={viewingHeroCert}
          schoolName={schoolName}
          onClose={() => setViewingHeroCert(null)}
        />
      )}

      {/* Delete Log Confirmation Modal for Admin */}
      {deletingLogId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-750 bg-slate-700 border border-slate-600 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-white mb-2">
              تأكيد حذف التقييم المرصود؟
            </h3>
            <p className="text-xs text-slate-200 mb-6 leading-relaxed">
              عند حذف هذا المرصود، سيتم شطبه نهائياً من سجلات المدرسة وتعديل نقاط الطالب المستهدف تلقائياً بالتراجع عن التقييم.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingLogId(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-600 text-slate-200 text-xs font-bold hover:bg-slate-500 transition"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteLog(deletingLogId);
                  setDeletingLogId(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-500 text-slate-950 text-xs font-black hover:bg-rose-400 transition shadow-lg shadow-rose-500/20"
              >
                تأكيد الحذف وإلغاء المرصود
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
