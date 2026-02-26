export interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher';
  name: string;
  class?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  value: number;
  date: string;
  term: number;
  comment?: string;
}

export interface Absence {
  id: string;
  studentId: string;
  date: string;
  subject: string;
  period: number;
  status: 'excused' | 'unexcused';
  teacherId: string;
}

export interface Homework {
  id: string;
  classId: string;
  subject: string;
  title: string;
  description: string;
  deadline: string;
  teacherId: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  submissionText: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: 'pending' | 'graded';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetClass?: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
}

export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  fromRole: 'student' | 'teacher';
  toId: string;
  toName: string;
  toRole: 'student' | 'teacher';
  subject: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface TimetableSlot {
  id: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  period: number;
  subject: string;
  teacher: string;
  class?: string;
  room?: string;
}
