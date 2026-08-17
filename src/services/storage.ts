import { Grade, Student, User, Criterion, Period, EvaluationLog, AttendanceRecord, Hero } from '../types';

const STORAGE_KEYS = {
  SCHOOL_NAME: 'sh_school_name',
  GRADES: 'sh_grades',
  STUDENTS: 'sh_students',
  USERS: 'sh_users',
  CRITERIA: 'sh_criteria',
  PERIODS: 'sh_periods',
  LOGS: 'sh_logs',
  HEROES: 'sh_heroes',
  ATTENDANCE: 'sh_attendance',
};

// Seed Data
const DEFAULT_SCHOOL_NAME = 'مدارس الكلية العلمية الإسلامية';

const DEFAULT_GRADES: Grade[] = [
  { id: 'g1', name: 'الصف الأول الثانوي - شعبة أ', description: 'مسار التأسيس والابتكار' },
  { id: 'g2', name: 'الصف الأول الثانوي - شعبة ب', description: 'مسار العلوم والتكنولوجيا' },
  { id: 'g3', name: 'الصف الثاني الثانوي - علوم', description: 'المسار العلمي المتقدم' },
  { id: 'g4', name: 'الصف الثالث الثانوي - تميز', description: 'دفعة الخريجين والأبطال' },
];

const DEFAULT_STUDENTS: Student[] = [
  { id: 'st1', code: '5001', name: 'عبدالرحمن خالد الشمري', gradeId: 'g4', points: 520, notes: 'طالب متميز في الابتكار والقيادة' },
  { id: 'st2', code: '5002', name: 'سارة محمد الغامدي', gradeId: 'g3', points: 450, notes: 'مبدعة في الفيزياء والأنشطة الثقافية' },
  { id: 'st3', code: '5003', name: 'حمزة بن عبدالعزيز السالم', gradeId: 'g4', points: 480, notes: 'حاصل على المركز الأول في الإذاعة المدرسية' },
  { id: 'st4', code: '5004', name: 'مريم علي الزهراني', gradeId: 'g3', points: 410, notes: 'طالبة خلوقة ومنضبطة جداً' },
  { id: 'st5', code: '5005', name: 'يوسف أحمد العتيبي', gradeId: 'g1', points: 380, notes: 'نجم واعد في الرياضيات' },
  { id: 'st6', code: '5006', name: 'ريما عبدالله الشهري', gradeId: 'g2', points: 360, notes: 'متميزة في الحضور المبكر والقراءة' },
  { id: 'st7', code: '5007', name: 'فاطمة عمر القحطاني', gradeId: 'g2', points: 310, notes: 'مشاركة نشطة في الأنشطة التطوعية' },
  { id: 'st8', code: '5008', name: 'عمر فيصل الدوسري', gradeId: 'g1', points: 290, notes: 'طالب مجتهد في البرمجة' },
];

const DEFAULT_USERS: User[] = [
  { id: 'u_admin', name: 'المدير المنسق العام', passcode: 'mmm@12345', role: 'admin' },
  { id: 'u_t1', name: 'أ. عبد الله المعلم - رياضيات', passcode: '1001', role: 'teacher' },
  { id: 'u_t2', name: 'أ. مريم العتيبي - لغة عربية', passcode: '1002', role: 'teacher' },
  { id: 'u_t3', name: 'أ. خالد الغامدي - علوم وابتكار', passcode: '1003', role: 'teacher' },
];

const DEFAULT_CRITERIA: Criterion[] = [
  { id: 'c1', title: 'تفوق ممتاز في الاختبار الأسبوعي', points: 20, type: 'positive', category: 'academic', icon: 'BookOpen' },
  { id: 'c2', title: 'إنجاز مشروع علمي فريد واجتهاد', points: 25, type: 'positive', category: 'academic', icon: 'Award' },
  { id: 'c3', title: 'مساعدة الزملاء والمبادرة بالخلق الحسن', points: 15, type: 'positive', category: 'moral', icon: 'Heart' },
  { id: 'c4', title: 'الصدق والأمانة والقدوة الحسنة', points: 20, type: 'positive', category: 'moral', icon: 'ShieldCheck' },
  { id: 'c5', title: 'الانضباط الكامل بالحضور المبكر أسبوعاً كاملاً', points: 15, type: 'positive', category: 'attendance', icon: 'Clock' },
  { id: 'c6', title: 'المشاركة الفعالة في الإذاعة المدرسية', points: 20, type: 'positive', category: 'participation', icon: 'Sparkles' },
  { id: 'c7', title: 'تنبيه: التأخر غير المبرر عن الحصة', points: 10, type: 'negative', category: 'attendance', icon: 'AlertTriangle' },
  { id: 'c8', title: 'تنبيه: عدم إحضار الواجب المطلوب', points: 10, type: 'negative', category: 'academic', icon: 'FileX' },
  { id: 'c9', title: 'تنبيه: عدم الالتزام بالهدوء أثناء الشرح', points: 15, type: 'negative', category: 'moral', icon: 'VolumeX' },
];

const DEFAULT_PERIODS: Period[] = [
  {
    id: 'p1',
    title: 'فترة منافسة التميز المكتبي والثقافي (الربع الأول)',
    startDate: '2026-08-01',
    endDate: '2026-10-31',
    targetPoints: 500,
    isActive: true,
  },
  {
    id: 'p0',
    title: 'فترة منافسة التفوق التربوي (النسخة السابقة)',
    startDate: '2026-05-01',
    endDate: '2026-07-31',
    targetPoints: 500,
    isActive: false,
    winnerId: 'st1',
    crownedAt: '2026-07-31',
    winnerTitle: 'بطل العرش الذهبي للمنظومة',
  },
];

const DEFAULT_LOGS: EvaluationLog[] = [
  {
    id: 'l1',
    studentId: 'st1',
    studentName: 'عبدالرحمن خالد الشمري',
    gradeName: 'الصف الثالث الثانوي - تميز',
    teacherName: 'أ. خالد الغامدي - علوم وابتكار',
    category: 'academic',
    criterionTitle: 'إنجاز مشروع علمي فريد واجتهاد',
    points: 25,
    type: 'positive',
    reason: 'تصميم نموذج مبتكر في الذكاء الاصطناعي',
    date: '2026-08-03 10:15',
    periodId: 'p1',
  },
  {
    id: 'l2',
    studentId: 'st3',
    studentName: 'حمزة بن عبدالعزيز السالم',
    gradeName: 'الصف الثالث الثانوي - تميز',
    teacherName: 'أ. مريم العتيبي - لغة عربية',
    category: 'participation',
    criterionTitle: 'المشاركة الفعالة في الإذاعة المدرسية',
    points: 20,
    type: 'positive',
    reason: 'إلقاء كلمة الصباح بأسلوب فصيح ومؤثر',
    date: '2026-08-03 08:30',
    periodId: 'p1',
  },
  {
    id: 'l3',
    studentId: 'st2',
    studentName: 'سارة محمد الغامدي',
    gradeName: 'الصف الثاني الثانوي - علوم',
    teacherName: 'أ. عبد الله المعلم - رياضيات',
    category: 'academic',
    criterionTitle: 'تفوق ممتاز في الاختبار الأسبوعي',
    points: 20,
    type: 'positive',
    reason: 'الحصول على الدرجة الكاملة في اختار الرياضيات',
    date: '2026-08-02 11:00',
    periodId: 'p1',
  },
  {
    id: 'l4',
    studentId: 'st5',
    studentName: 'يوسف أحمد العتيبي',
    gradeName: 'الصف الأول الثانوي - شعبة أ',
    teacherName: 'أ. مريم العتيبي - لغة عربية',
    category: 'moral',
    criterionTitle: 'مساعدة الزملاء والمبادرة بالخلق الحسن',
    points: 15,
    type: 'positive',
    reason: 'المساعدة في تنظيم المكتبة المدرسية',
    date: '2026-08-01 12:20',
    periodId: 'p1',
  },
];

const DEFAULT_HEROES: Hero[] = [
  {
    id: 'h1',
    studentId: 'st1',
    studentName: 'عبدالرحمن خالد الشمري',
    studentCode: '5001',
    gradeName: 'الصف الثالث الثانوي - تميز',
    periodTitle: 'فترة منافسة التفوق التربوي (النسخة السابقة)',
    points: 520,
    crownedDate: '2026-07-31',
    certificateId: 'ROYAL-HERO-2026-01',
  },
];

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.error('Error reading localStorage key', key, e);
  }
  // Initialize default
  setStored(key, defaultValue);
  return defaultValue;
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing localStorage key', key, e);
  }
}

// Storage API Export
export const StorageService = {
  // School Name
  getSchoolName(): string {
    return getStored<string>(STORAGE_KEYS.SCHOOL_NAME, DEFAULT_SCHOOL_NAME);
  },
  saveSchoolName(name: string): void {
    setStored(STORAGE_KEYS.SCHOOL_NAME, name);
  },

  // Grades
  getGrades(): Grade[] {
    return getStored<Grade[]>(STORAGE_KEYS.GRADES, DEFAULT_GRADES);
  },
  saveGrades(grades: Grade[]): void {
    setStored(STORAGE_KEYS.GRADES, grades);
  },

  // Students
  getStudents(): Student[] {
    return getStored<Student[]>(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
  },
  saveStudents(students: Student[]): void {
    setStored(STORAGE_KEYS.STUDENTS, students);
  },

  // Users (Teachers & Admin)
  getUsers(): User[] {
    return getStored<User[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
  },
  saveUsers(users: User[]): void {
    setStored(STORAGE_KEYS.USERS, users);
  },

  // Criteria
  getCriteria(): Criterion[] {
    return getStored<Criterion[]>(STORAGE_KEYS.CRITERIA, DEFAULT_CRITERIA);
  },
  saveCriteria(criteria: Criterion[]): void {
    setStored(STORAGE_KEYS.CRITERIA, criteria);
  },

  // Periods
  getPeriods(): Period[] {
    return getStored<Period[]>(STORAGE_KEYS.PERIODS, DEFAULT_PERIODS);
  },
  savePeriods(periods: Period[]): void {
    setStored(STORAGE_KEYS.PERIODS, periods);
  },

  // Logs
  getLogs(): EvaluationLog[] {
    return getStored<EvaluationLog[]>(STORAGE_KEYS.LOGS, DEFAULT_LOGS);
  },
  saveLogs(logs: EvaluationLog[]): void {
    setStored(STORAGE_KEYS.LOGS, logs);
  },

  // Heroes
  getHeroes(): Hero[] {
    return getStored<Hero[]>(STORAGE_KEYS.HEROES, DEFAULT_HEROES);
  },
  saveHeroes(heroes: Hero[]): void {
    setStored(STORAGE_KEYS.HEROES, heroes);
  },

  // Attendance
  getAttendance(): AttendanceRecord[] {
    return getStored<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
  },
  saveAttendance(attendance: AttendanceRecord[]): void {
    setStored(STORAGE_KEYS.ATTENDANCE, attendance);
  },

  // Reset ALL to Defaults
  resetAllToDefaults(): void {
    setStored(STORAGE_KEYS.SCHOOL_NAME, DEFAULT_SCHOOL_NAME);
    setStored(STORAGE_KEYS.GRADES, DEFAULT_GRADES);
    setStored(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
    setStored(STORAGE_KEYS.USERS, DEFAULT_USERS);
    setStored(STORAGE_KEYS.CRITERIA, DEFAULT_CRITERIA);
    setStored(STORAGE_KEYS.PERIODS, DEFAULT_PERIODS);
    setStored(STORAGE_KEYS.LOGS, DEFAULT_LOGS);
    setStored(STORAGE_KEYS.HEROES, DEFAULT_HEROES);
    setStored(STORAGE_KEYS.ATTENDANCE, []);
  },
};
