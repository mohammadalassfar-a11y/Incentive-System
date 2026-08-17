export type UserRole = 'student' | 'teacher' | 'admin';

export type CategoryType = 'academic' | 'moral' | 'attendance' | 'participation';

export type LogType = 'positive' | 'negative';

export interface Grade {
  id: string;
  name: string;
  description?: string;
}

export interface Student {
  id: string;
  code: string; // 4-digit code e.g. 5001
  name: string;
  gradeId: string;
  points: number;
  avatarUrl?: string;
  parentPhone?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  passcode: string; // login code e.g. 1001 or admin code mmm@12345
  role: UserRole;
  studentCode?: string;
}

export interface Criterion {
  id: string;
  title: string;
  points: number;
  type: LogType;
  category: CategoryType;
  icon: string;
}

export interface Period {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  targetPoints?: number;
  winnerId?: string;
  crownedAt?: string;
  winnerTitle?: string;
}

export interface EvaluationLog {
  id: string;
  studentId: string;
  studentName: string;
  gradeName: string;
  teacherName: string;
  category: CategoryType;
  criterionTitle: string;
  points: number;
  type: LogType;
  reason: string;
  date: string;
  periodId?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface Hero {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  gradeName: string;
  periodTitle: string;
  points: number;
  crownedDate: string;
  certificateId: string;
}
