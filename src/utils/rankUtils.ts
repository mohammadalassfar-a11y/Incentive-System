/**
 * Utility functions for computing student school ranks and top 10 leaderboards
 */

import { Student, Grade } from '../types';

export interface RankedStudent {
  student: Student;
  rank: number;
  gradeName: string;
}

/**
 * Gets a student's school-wide rank among all students.
 */
export function getStudentSchoolRank(
  studentId: string,
  allStudents: Student[]
): { rank: number; totalStudents: number } {
  if (!allStudents || allStudents.length === 0) {
    return { rank: 0, totalStudents: 0 };
  }

  // Sort descending by points
  const sorted = [...allStudents].sort((a, b) => b.points - a.points);
  const index = sorted.findIndex((s) => s.id === studentId);

  return {
    rank: index !== -1 ? index + 1 : 0,
    totalStudents: allStudents.length,
  };
}

/**
 * Returns the top 10 students on school-wide level with their grade names.
 */
export function getTopTenSchoolStudents(
  allStudents: Student[],
  grades: Grade[]
): RankedStudent[] {
  const getGradeName = (gradeId: string) => {
    const g = grades.find((item) => item.id === gradeId);
    return g ? g.name : 'الصف غير محدد';
  };

  const sorted = [...allStudents].sort((a, b) => b.points - a.points);

  return sorted.slice(0, 10).map((student, idx) => ({
    student,
    rank: idx + 1,
    gradeName: getGradeName(student.gradeId),
  }));
}
