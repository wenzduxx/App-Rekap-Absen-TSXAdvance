
export enum RecordType {
  ACADEMIC = 'Academic',
  ACHIEVEMENT = 'Achievement',
  ACTIVITY = 'Activity',
  DISCIPLINE = 'Discipline'
}

export interface StudentRecord {
  id: string;
  date: string;
  title: string;
  category: RecordType;
  description: string;
  gradeOrResult: string; // e.g., "A", "1st Place", "Participated"
  verifiedBy: string;
}

export interface SemesterResult {
  id: string;
  semesterName: string; // e.g., "Semester 1 (Ganjil) 2022/2023"
  gpa: number; // IPS (Indeks Prestasi Semester)
  credits: number; // SKS Taken this semester
  cumulativeGpa: number; // IPK at the end of this semester
}

export interface StudentProfile {
  id: string;
  name: string;
  nim: string;
  major: string;
  batch: string;
  gpa: number; // Current Cumulative IPK
  status: 'Active' | 'Inactive' | 'Graduated';
  avatarUrl: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female';
  
  // Dashboard & Visual Props
  initials: string;
  color: 'blue' | 'purple' | 'orange' | 'teal' | 'red' | 'indigo' | 'green';
  
  // Attendance Stats (Calculated)
  h: number; // Hadir
  i: number; // Izin
  s: number; // Sakit
  a: number; // Alpha
  pct: number; // Percentage
  attendanceStatus: 'Excellent' | 'Good' | 'Warning' | 'Critical';

  // Extended Editable Details
  totalCredits: number; // Total SKS Taken
  targetCredits: number; // Target SKS for graduation (usually 144)
  achievementCount: number;
  disciplinePoints: number;
  
  // Tuition & Financial
  tuitionStatus: 'Paid' | 'Unpaid' | 'Pending';
  tuitionDate: string; // Due date or Paid date
  tuitionInvoiceUrl?: string; // New field for uploaded invoice/receipt
  economicTier: 1 | 2 | 3 | 4 | 5; // 1 = High Need, 5 = Full Fee/Wealthy
  isScholarship: boolean;

  // Conduct
  goodStandingNote: string;

  // Records List
  records: StudentRecord[];

  // Academic History (New)
  academicHistory?: SemesterResult[];
}

export interface AcademicStat {
  label: string;
  value: string | number;
  trend?: number; // percentage
  trendDirection?: 'up' | 'down' | 'neutral';
  color: 'blue' | 'yellow' | 'orange' | 'green' | 'red';
  subtext?: string;
}