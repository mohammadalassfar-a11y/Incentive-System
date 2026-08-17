/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, Grade, Student, User, Criterion, Period, EvaluationLog, AttendanceRecord, Hero } from './types';
import { StorageService } from './services/storage';
import {
  seedFirestoreIfEmpty,
  subscribeToDatabase,
  dbSaveSchoolName,
  dbSaveGrades,
  dbSaveStudents,
  dbSaveUsers,
  dbSaveCriteria,
  dbSavePeriods,
  dbSaveLogs,
  dbSaveHeroes,
  dbSaveAttendance,
} from './services/firebaseSync';
import { Header } from './components/Header';
import { HeroLeaderboard } from './components/HeroLeaderboard';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TopTenModal } from './components/TopTenModal';
import { KeyRound, X, GraduationCap, UserCheck, Shield } from 'lucide-react';

export default function App() {
  // Application Persistent State
  const [schoolName, setSchoolName] = useState<string>('');
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [logs, setLogs] = useState<EvaluationLog[]>([]);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  // Top 10 Leaders Modal State
  const [isTopTenOpen, setIsTopTenOpen] = useState(false);

  // Auth / Active View State
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Quick Login Modal State
  const [loginModalRole, setLoginModalRole] = useState<UserRole | null>(null);
  const [modalInputCode, setModalInputCode] = useState('');
  const [modalError, setModalError] = useState('');

  // Load state on initial mount and setup Firestore Real-time Sync
  useEffect(() => {
    // 1. Initial Local Storage Load as instant fallback
    setSchoolName(StorageService.getSchoolName());
    setGrades(StorageService.getGrades());
    setStudents(StorageService.getStudents());
    setUsers(StorageService.getUsers());
    setCriteria(StorageService.getCriteria());
    setPeriods(StorageService.getPeriods());
    setLogs(StorageService.getLogs());
    setHeroes(StorageService.getHeroes());
    setAttendance(StorageService.getAttendance());

    // 2. Seed Firestore if empty and subscribe to live cloud changes
    seedFirestoreIfEmpty().then(() => {
      const unsubscribe = subscribeToDatabase({
        onSchoolName: (name) => {
          setSchoolName(name);
          StorageService.saveSchoolName(name);
        },
        onGrades: (updatedGrades) => {
          setGrades(updatedGrades);
          StorageService.saveGrades(updatedGrades);
        },
        onStudents: (updatedStudents) => {
          setStudents(updatedStudents);
          StorageService.saveStudents(updatedStudents);
          // Sync currentStudent if logged in
          setCurrentStudent((prev) => {
            if (!prev) return null;
            return updatedStudents.find((s) => s.id === prev.id) || prev;
          });
        },
        onUsers: (updatedUsers) => {
          setUsers(updatedUsers);
          StorageService.saveUsers(updatedUsers);
        },
        onCriteria: (updatedCriteria) => {
          setCriteria(updatedCriteria);
          StorageService.saveCriteria(updatedCriteria);
        },
        onPeriods: (updatedPeriods) => {
          setPeriods(updatedPeriods);
          StorageService.savePeriods(updatedPeriods);
        },
        onLogs: (updatedLogs) => {
          setLogs(updatedLogs);
          StorageService.saveLogs(updatedLogs);
        },
        onHeroes: (updatedHeroes) => {
          setHeroes(updatedHeroes);
          StorageService.saveHeroes(updatedHeroes);
        },
        onAttendance: (updatedAttendance) => {
          setAttendance(updatedAttendance);
          StorageService.saveAttendance(updatedAttendance);
        },
      });

      return () => unsubscribe();
    });
  }, []);

  // Save State Helpers with Firestore Sync
  const handleUpdateSchoolName = (name: string) => {
    setSchoolName(name);
    StorageService.saveSchoolName(name);
    dbSaveSchoolName(name);
  };

  const handleUpdateGrades = (updatedGrades: Grade[]) => {
    setGrades(updatedGrades);
    StorageService.saveGrades(updatedGrades);
    dbSaveGrades(updatedGrades);
  };

  const handleUpdateStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    StorageService.saveStudents(updatedStudents);
    dbSaveStudents(updatedStudents);

    if (currentStudent) {
      const match = updatedStudents.find((s) => s.id === currentStudent.id);
      if (match) setCurrentStudent(match);
    }
  };

  const handleUpdateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);
    dbSaveUsers(updatedUsers);
  };

  const handleUpdateCriteria = (updatedCriteria: Criterion[]) => {
    setCriteria(updatedCriteria);
    StorageService.saveCriteria(updatedCriteria);
    dbSaveCriteria(updatedCriteria);
  };

  const handleUpdatePeriods = (updatedPeriods: Period[]) => {
    setPeriods(updatedPeriods);
    StorageService.savePeriods(updatedPeriods);
    dbSavePeriods(updatedPeriods);
  };

  const handleUpdateLogs = (updatedLogs: EvaluationLog[]) => {
    setLogs(updatedLogs);
    StorageService.saveLogs(updatedLogs);
    dbSaveLogs(updatedLogs);
  };

  const handleUpdateHeroes = (updatedHeroes: Hero[]) => {
    setHeroes(updatedHeroes);
    StorageService.saveHeroes(updatedHeroes);
    dbSaveHeroes(updatedHeroes);
  };

  const handleUpdateAttendance = (updatedAttendance: AttendanceRecord[]) => {
    setAttendance(updatedAttendance);
    StorageService.saveAttendance(updatedAttendance);
    dbSaveAttendance(updatedAttendance);
  };

  const handleResetData = () => {
    StorageService.resetAllToDefaults();
    setSchoolName(StorageService.getSchoolName());
    setGrades(StorageService.getGrades());
    setStudents(StorageService.getStudents());
    setUsers(StorageService.getUsers());
    setCriteria(StorageService.getCriteria());
    setPeriods(StorageService.getPeriods());
    setLogs(StorageService.getLogs());
    setHeroes(StorageService.getHeroes());
    setAttendance(StorageService.getAttendance());
    setCurrentRole(null);
    setCurrentStudent(null);
    setCurrentUser(null);

    // Sync to Firestore
    dbSaveSchoolName(StorageService.getSchoolName());
    dbSaveGrades(StorageService.getGrades());
    dbSaveStudents(StorageService.getStudents());
    dbSaveUsers(StorageService.getUsers());
    dbSaveCriteria(StorageService.getCriteria());
    dbSavePeriods(StorageService.getPeriods());
    dbSaveLogs(StorageService.getLogs());
    dbSaveHeroes(StorageService.getHeroes());
    dbSaveAttendance([]);
  };

  // Active period
  const activePeriod = periods.find((p) => p.isActive) || periods[0];

  // Auth Handler
  const handleLoginSubmit = (role: UserRole, code: string): boolean => {
    if (role === 'student') {
      const matched = students.find((s) => s.code.trim() === code.trim());
      if (matched) {
        setCurrentRole('student');
        setCurrentStudent(matched);
        setCurrentUser(null);
        return true;
      }
    } else if (role === 'teacher') {
      const matched = users.find(
        (u) => u.role === 'teacher' && u.passcode.trim() === code.trim()
      );
      if (matched) {
        setCurrentRole('teacher');
        setCurrentUser(matched);
        setCurrentStudent(null);
        return true;
      }
    } else if (role === 'admin') {
      const matched = users.find(
        (u) => u.role === 'admin' && u.passcode.trim() === code.trim()
      );
      if (matched || code.trim() === 'mmm@12345') {
        const adminObj = matched || {
          id: 'u_admin',
          name: 'المدير المنسق العام',
          passcode: 'mmm@12345',
          role: 'admin' as const,
        };
        setCurrentRole('admin');
        setCurrentUser(adminObj);
        setCurrentStudent(null);
        return true;
      }
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setCurrentStudent(null);
    setCurrentUser(null);
  };

  // Evaluation Execution
  const handleEvaluateStudents = (
    studentIds: string[],
    criterion: Criterion,
    reason: string,
    teacherName: string
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const pointVal = criterion.type === 'positive' ? criterion.points : -criterion.points;

    // Update students points
    const newStudents = students.map((st) => {
      if (studentIds.includes(st.id)) {
        return {
          ...st,
          points: Math.max(0, st.points + pointVal),
        };
      }
      return st;
    });

    handleUpdateStudents(newStudents);

    // Create log entries
    const newLogs: EvaluationLog[] = studentIds.map((stId, i) => {
      const stObj = students.find((s) => s.id === stId);
      const gradeObj = grades.find((g) => g.id === stObj?.gradeId);
      return {
        id: `log_${Date.now()}_${i}`,
        studentId: stId,
        studentName: stObj ? stObj.name : 'طالب',
        gradeName: gradeObj ? gradeObj.name : 'الصف',
        teacherName,
        category: criterion.category,
        criterionTitle: criterion.title,
        points: criterion.points,
        type: criterion.type,
        reason,
        date: nowStr,
        periodId: activePeriod?.id,
      };
    });

    handleUpdateLogs([...newLogs, ...logs]);
  };

  // Delete Evaluation Log Entry and adjust student points
  const handleDeleteLog = (logId: string) => {
    const targetLog = logs.find((l) => l.id === logId);
    if (!targetLog) return;

    // 1. Filter out log from logs list
    const updatedLogs = logs.filter((l) => l.id !== logId);
    handleUpdateLogs(updatedLogs);

    // 2. Adjust student's points accordingly
    const pointVal = targetLog.type === 'positive' ? targetLog.points : -targetLog.points;
    const updatedStudents = students.map((st) => {
      if (st.id === targetLog.studentId) {
        return {
          ...st,
          points: Math.max(0, st.points - pointVal),
        };
      }
      return st;
    });

    handleUpdateStudents(updatedStudents);
  };

  // Single Student Attendance Handler
  const handleSingleAttendanceUpdate = (
    studentId: string,
    status: 'present' | 'absent' | 'late'
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const existingIndex = attendance.findIndex(
      (a) => a.studentId === studentId && a.date === todayStr
    );

    let newAttendanceList = [...attendance];
    if (existingIndex >= 0) {
      newAttendanceList[existingIndex] = {
        ...newAttendanceList[existingIndex],
        status,
      };
    } else {
      newAttendanceList.push({
        id: `att_${Date.now()}`,
        date: todayStr,
        studentId,
        status,
      });
    }

    handleUpdateAttendance(newAttendanceList);
  };

  // Crown Winner Handler
  const handleCrownWinner = (hero: Hero) => {
    handleUpdateHeroes([hero, ...heroes]);
  };

  // Handle Quick Modal Login
  const handleModalLoginExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginModalRole) return;
    setModalError('');
    const ok = handleLoginSubmit(loginModalRole, modalInputCode);
    if (ok) {
      setLoginModalRole(null);
      setModalInputCode('');
    } else {
      setModalError('رمز الدخول المكتوب غير صحيح');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-800 text-slate-100 font-['Cairo',sans-serif] selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Header */}
      <Header
        schoolName={schoolName}
        activePeriodTitle={activePeriod?.title}
        currentRole={currentRole}
        currentUserName={
          currentRole === 'student' ? currentStudent?.name : currentUser?.name
        }
        onLogout={handleLogout}
        onOpenLoginModal={(role) => {
          setLoginModalRole(role);
          setModalInputCode('');
          setModalError('');
        }}
        onOpenTopTen={() => setIsTopTenOpen(true)}
      />

      {/* Main Container Views */}
      <main className="flex-1 flex flex-col justify-center">
        {/* If no role is active or on home screen, display Hero Leaderboard */}
        {!currentRole && (
          <HeroLeaderboard
            schoolName={schoolName}
            students={students}
            grades={grades}
            activePeriodTitle={activePeriod?.title}
            activePeriod={activePeriod}
            onLoginSubmit={handleLoginSubmit}
          />
        )}

        {/* Student View */}
        {currentRole === 'student' && currentStudent && (
          <StudentDashboard
            student={currentStudent}
            grades={grades}
            logs={logs}
            heroes={heroes}
            activePeriod={activePeriod}
            schoolName={schoolName}
            allStudents={students}
            onOpenTopTen={() => setIsTopTenOpen(true)}
          />
        )}

        {/* Teacher View */}
        {currentRole === 'teacher' && currentUser && (
          <TeacherDashboard
            currentUser={currentUser}
            students={students}
            grades={grades}
            criteria={criteria}
            logs={logs}
            attendance={attendance}
            onEvaluateStudents={handleEvaluateStudents}
            onDeleteLog={handleDeleteLog}
            onUpdateAttendance={handleSingleAttendanceUpdate}
            onOpenTopTen={() => setIsTopTenOpen(true)}
          />
        )}

        {/* Admin View */}
        {currentRole === 'admin' && (
          <AdminDashboard
            schoolName={schoolName}
            grades={grades}
            students={students}
            users={users}
            criteria={criteria}
            periods={periods}
            logs={logs}
            heroes={heroes}
            onUpdateSchoolName={handleUpdateSchoolName}
            onUpdateGrades={handleUpdateGrades}
            onUpdateStudents={handleUpdateStudents}
            onUpdateUsers={handleUpdateUsers}
            onUpdateCriteria={handleUpdateCriteria}
            onUpdatePeriods={handleUpdatePeriods}
            onDeleteLog={handleDeleteLog}
            onCrownWinner={handleCrownWinner}
            onResetData={handleResetData}
            onOpenTopTen={() => setIsTopTenOpen(true)}
          />
        )}
      </main>

      {/* Top 10 Leaders Modal */}
      {isTopTenOpen && (
        <TopTenModal
          students={students}
          grades={grades}
          schoolName={schoolName}
          onClose={() => setIsTopTenOpen(false)}
        />
      )}

      {/* Quick Role Login Modal from Header */}
      {loginModalRole && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-750 bg-slate-700 border border-slate-600 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-600">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <span>
                  {loginModalRole === 'student' && 'تسجيل دخول طالب / ولي أمر'}
                  {loginModalRole === 'teacher' && 'تسجيل دخول معلم / مقيم'}
                  {loginModalRole === 'admin' && 'تسجيل دخول الإدارة العامة'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setLoginModalRole(null)}
                className="p-1.5 rounded-xl bg-slate-600 text-slate-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalLoginExecute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  {loginModalRole === 'student' && 'أدخل كود الطالب (4 أرقام):'}
                  {loginModalRole === 'teacher' && 'أدخل رمز المرور للمعلم:'}
                  {loginModalRole === 'admin' && 'أدخل رمز الإدارة السري:'}
                </label>
                <input
                  type={loginModalRole === 'admin' ? 'password' : 'text'}
                  value={modalInputCode}
                  onChange={(e) => setModalInputCode(e.target.value)}
                  placeholder={
                    loginModalRole === 'student'
                      ? 'مثال: 5001'
                      : loginModalRole === 'teacher'
                      ? 'مثال: 1001'
                      : 'mmm@12345'
                  }
                  className="w-full bg-slate-800 border border-slate-600 text-white font-mono text-center text-lg rounded-2xl py-3 px-4 focus:outline-none focus:border-amber-400 dir-ltr"
                />
              </div>

              {modalError && (
                <p className="text-xs font-bold text-rose-300 bg-rose-500/20 p-2.5 rounded-xl border border-rose-500/30 text-center">
                  {modalError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
              >
                تأكيد الدخول
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`no-print border-t border-slate-700 bg-slate-800/90 text-center text-[11px] text-slate-300 ${!currentRole ? 'py-3 mt-0' : 'py-6 mt-12'}`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold">
            جميع الحقوق محفوظة © 2026 | {schoolName} - منظومة التحفيز التربوي السلوكية
          </p>
          <div className="flex items-center gap-2 text-slate-300 font-mono">
            <span>إصدار المنظومة: v2.5 Space-Edition</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
