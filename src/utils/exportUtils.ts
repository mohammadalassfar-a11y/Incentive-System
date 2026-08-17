/**
 * Utility functions for automatic data export in CSV (Excel) and JSON formats
 */

import { EvaluationLog, Student, Grade, AttendanceRecord } from '../types';

/**
 * Downloads a string content as a file with UTF-8 BOM for Excel Arabic compatibility
 */
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Automatically export evaluation logs to a CSV file (opens smoothly in Excel)
 */
export const exportLogsToCSV = (logs: EvaluationLog[], schoolName: string) => {
  const headers = ['التاريخ والوقت', 'اسم الطالب', 'الصف الدراسي', 'معيار التقييم', 'المجال/الفئة', 'نوع التقييم', 'النقاط', 'المعلم المقيّم', 'السبب'];
  
  const rows = logs.map((log) => [
    `"${log.date.replace(/"/g, '""')}"`,
    `"${log.studentName.replace(/"/g, '""')}"`,
    `"${log.gradeName.replace(/"/g, '""')}"`,
    `"${log.criterionTitle.replace(/"/g, '""')}"`,
    `"${log.category === 'academic' ? 'أكاديمي' : log.category === 'moral' ? 'سلوكي / أخلاقي' : log.category === 'attendance' ? 'حضور والتزام' : 'مشاركة وتفاعل'}"`,
    `"${log.type === 'positive' ? 'إيجابي' : 'سلبي'}"`,
    `"${log.type === 'positive' ? '+' + log.points : '-' + log.points}"`,
    `"${log.teacherName.replace(/"/g, '""')}"`,
    `"${(log.reason || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  const safeSchoolName = schoolName.replace(/[\/\s]/g, '_');
  
  downloadFile(csvContent, `تقرير_سجلات_التقييم_${safeSchoolName}_${dateStr}.csv`, 'text/csv;charset=utf-8;');
};

/**
 * Automatically export students list with scores to CSV
 */
export const exportStudentsToCSV = (students: Student[], grades: Grade[], schoolName: string) => {
  const getGradeName = (gradeId: string) => {
    const g = grades.find((item) => item.id === gradeId);
    return g ? g.name : 'غير محدد';
  };

  const headers = ['كود الطالب', 'اسم الطالب', 'الصف الدراسي', 'مجموع النقاط الحالية'];
  const rows = students.map((st) => [
    `"${st.code.replace(/"/g, '""')}"`,
    `"${st.name.replace(/"/g, '""')}"`,
    `"${getGradeName(st.gradeId).replace(/"/g, '""')}"`,
    `"${st.points}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  const safeSchoolName = schoolName.replace(/[\/\s]/g, '_');

  downloadFile(csvContent, `كشف_الطلاب_والنقاط_${safeSchoolName}_${dateStr}.csv`, 'text/csv;charset=utf-8;');
};

/**
 * Automatically export attendance record to CSV
 */
export const exportAttendanceToCSV = (
  attendance: AttendanceRecord[],
  students: Student[],
  grades: Grade[],
  schoolName: string
) => {
  const getStudentName = (id: string) => students.find((s) => s.id === id)?.name || 'طالب';
  const getStudentGrade = (id: string) => {
    const st = students.find((s) => s.id === id);
    if (!st) return '';
    return grades.find((g) => g.id === st.gradeId)?.name || '';
  };

  const headers = ['التاريخ', 'اسم الطالب', 'الصف', 'حالة الحضور'];
  const rows = attendance.map((att) => [
    `"${att.date}"`,
    `"${getStudentName(att.studentId).replace(/"/g, '""')}"`,
    `"${getStudentGrade(att.studentId).replace(/"/g, '""')}"`,
    `"${att.status === 'present' ? 'حاضر' : att.status === 'absent' ? 'غائب' : 'متأخر'}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  const safeSchoolName = schoolName.replace(/[\/\s]/g, '_');

  downloadFile(csvContent, `سجل_الغياب_والحضور_${safeSchoolName}_${dateStr}.csv`, 'text/csv;charset=utf-8;');
};

/**
 * Automatically export complete database backup to JSON
 */
export const exportSystemBackupJSON = () => {
  const keys = ['schoolName', 'grades', 'students', 'users', 'criteria', 'periods', 'logs', 'heroes', 'attendance'];
  const backupData: Record<string, any> = {};

  keys.forEach((key) => {
    const raw = localStorage.getItem(`hero_school_${key}`);
    if (raw) {
      try {
        backupData[key] = JSON.parse(raw);
      } catch (e) {
        backupData[key] = raw;
      }
    }
  });

  const jsonString = JSON.stringify(backupData, null, 2);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(jsonString, `نسخة_احتياطية_كاملة_${dateStr}.json`, 'application/json');
};
