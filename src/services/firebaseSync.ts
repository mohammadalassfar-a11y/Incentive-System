import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Grade,
  Student,
  User,
  Criterion,
  Period,
  EvaluationLog,
  AttendanceRecord,
  Hero,
} from '../types';
import { StorageService } from './storage';

const COLLECTIONS = {
  SCHOOL_INFO: 'settings',
  GRADES: 'grades',
  STUDENTS: 'students',
  USERS: 'users',
  CRITERIA: 'criteria',
  PERIODS: 'periods',
  LOGS: 'logs',
  HEROES: 'heroes',
  ATTENDANCE: 'attendance',
};

// Reconciles Firestore collection with local items (saves current items and removes deleted items)
async function syncCollection<T extends { id: string }>(
  collectionName: string,
  items: T[]
) {
  try {
    const snap = await getDocs(collection(db, collectionName));
    const newIds = new Set(items.map((item) => item.id));

    // Delete documents in Firestore that are no longer in items
    const deletePromises: Promise<void>[] = [];
    snap.docs.forEach((d) => {
      if (!newIds.has(d.id)) {
        deletePromises.push(deleteDoc(doc(db, collectionName, d.id)));
      }
    });
    await Promise.all(deletePromises);

    // Set/update documents present in items
    const setPromises: Promise<void>[] = [];
    items.forEach((item) => {
      setPromises.push(setDoc(doc(db, collectionName, item.id), item));
    });
    await Promise.all(setPromises);
  } catch (err) {
    console.error(`Error syncing collection ${collectionName}:`, err);
  }
}

// Seed initial data to Firestore if collection is empty
export async function seedFirestoreIfEmpty() {
  try {
    const studentsSnap = await getDocs(collection(db, COLLECTIONS.STUDENTS));
    if (!studentsSnap.empty) {
      console.log('Firestore already has data. Syncing in real-time...');
      return;
    }

    console.log('Firestore is empty. Seeding initial data from local storage...');

    // 1. School Info
    await setDoc(doc(db, COLLECTIONS.SCHOOL_INFO, 'school_info'), {
      schoolName: StorageService.getSchoolName(),
    });

    // 2. Grades
    const grades = StorageService.getGrades();
    for (const g of grades) {
      await setDoc(doc(db, COLLECTIONS.GRADES, g.id), g);
    }

    // 3. Students
    const students = StorageService.getStudents();
    for (const st of students) {
      await setDoc(doc(db, COLLECTIONS.STUDENTS, st.id), st);
    }

    // 4. Users
    const users = StorageService.getUsers();
    for (const u of users) {
      await setDoc(doc(db, COLLECTIONS.USERS, u.id), u);
    }

    // 5. Criteria
    const criteria = StorageService.getCriteria();
    for (const c of criteria) {
      await setDoc(doc(db, COLLECTIONS.CRITERIA, c.id), c);
    }

    // 6. Periods
    const periods = StorageService.getPeriods();
    for (const p of periods) {
      await setDoc(doc(db, COLLECTIONS.PERIODS, p.id), p);
    }

    // 7. Logs
    const logs = StorageService.getLogs();
    for (const l of logs) {
      await setDoc(doc(db, COLLECTIONS.LOGS, l.id), l);
    }

    // 8. Heroes
    const heroes = StorageService.getHeroes();
    for (const h of heroes) {
      await setDoc(doc(db, COLLECTIONS.HEROES, h.id), h);
    }

    // 9. Attendance
    const attendance = StorageService.getAttendance();
    for (const a of attendance) {
      await setDoc(doc(db, COLLECTIONS.ATTENDANCE, a.id), a);
    }

    console.log('Firestore successfully seeded!');
  } catch (err) {
    console.error('Error seeding Firestore:', err);
  }
}

// Subscribe to real-time updates for all collections
export function subscribeToDatabase(callbacks: {
  onSchoolName: (name: string) => void;
  onGrades: (grades: Grade[]) => void;
  onStudents: (students: Student[]) => void;
  onUsers: (users: User[]) => void;
  onCriteria: (criteria: Criterion[]) => void;
  onPeriods: (periods: Period[]) => void;
  onLogs: (logs: EvaluationLog[]) => void;
  onHeroes: (heroes: Hero[]) => void;
  onAttendance: (attendance: AttendanceRecord[]) => void;
}) {
  const unsubscribes: (() => void)[] = [];

  // School Info
  unsubscribes.push(
    onSnapshot(doc(db, COLLECTIONS.SCHOOL_INFO, 'school_info'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && data.schoolName) {
          callbacks.onSchoolName(data.schoolName);
        }
      }
    })
  );

  // Grades
  unsubscribes.push(
    onSnapshot(collection(db, COLLECTIONS.GRADES), (snapshot) => {
      const items: Grade[] = snapshot.docs.map((d) => d.data() as Grade);
      callbacks.onGrades(items);
    })
  );

  // Students
  unsubscribes.push(
    onSnapshot(collection(db, COLLECTIONS.STUDENTS), (snapshot) => {
      const items: Student[] = snapshot.docs.map((d) => d.data() as Student);
      callbacks.onStudents(items);
    })
  );

  // Users
  unsubscribes.push(
    onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
      const items: User[] = snapshot.docs.map((d) => d.data() as User);
      callbacks.onUsers(items);
    })
  );

  // Criteria
  unsubscribes.push(
    onSnapshot(collection(db, COLLECTIONS.CRITERIA), (snapshot) => {
      const items: Criterion[] = snapshot.docs.map((d) => d.data() as Criterion);
      callbacks.onCriteria(items);
    })
  );

  // Periods
  unsubscribes.push(
    onSnapshot(collection(db, COLLECTIONS.PERIODS), (snapshot) => {
      const items: Period[] = snapshot.docs.map((d) => d.data() as Period);
      callbacks.onPeriods(items);
    })
  );

  // Logs
  unsubscribes.push(
    onSnapshot(collection(db, COLLECTIONS.LOGS), (snapshot) => {
      const items: EvaluationLog[] = snapshot.docs.map((d) => d.data() as EvaluationLog);
      // Sort newest first
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callbacks.onLogs(items);
    })
  );

  // Heroes
  unsubscribes.push(
    onSnapshot(collection(db, COLLECTIONS.HEROES), (snapshot) => {
      const items: Hero[] = snapshot.docs.map((d) => d.data() as Hero);
      callbacks.onHeroes(items);
    })
  );

  // Attendance
  unsubscribes.push(
    onSnapshot(collection(db, COLLECTIONS.ATTENDANCE), (snapshot) => {
      const items: AttendanceRecord[] = snapshot.docs.map((d) => d.data() as AttendanceRecord);
      callbacks.onAttendance(items);
    })
  );

  return () => {
    unsubscribes.forEach((unsub) => unsub());
  };
}

// Writers for updating database items
export async function dbSaveSchoolName(schoolName: string) {
  await setDoc(doc(db, COLLECTIONS.SCHOOL_INFO, 'school_info'), { schoolName });
}

export async function dbSaveGrades(grades: Grade[]) {
  await syncCollection(COLLECTIONS.GRADES, grades);
}

export async function dbSaveStudents(students: Student[]) {
  await syncCollection(COLLECTIONS.STUDENTS, students);
}

export async function dbSaveUsers(users: User[]) {
  await syncCollection(COLLECTIONS.USERS, users);
}

export async function dbSaveCriteria(criteria: Criterion[]) {
  await syncCollection(COLLECTIONS.CRITERIA, criteria);
}

export async function dbSavePeriods(periods: Period[]) {
  await syncCollection(COLLECTIONS.PERIODS, periods);
}

export async function dbSaveLogs(logs: EvaluationLog[]) {
  await syncCollection(COLLECTIONS.LOGS, logs);
}

export async function dbSaveHeroes(heroes: Hero[]) {
  await syncCollection(COLLECTIONS.HEROES, heroes);
}

export async function dbSaveAttendance(attendance: AttendanceRecord[]) {
  await syncCollection(COLLECTIONS.ATTENDANCE, attendance);
}
