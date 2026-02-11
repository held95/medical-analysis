import { ExamStatus } from './exam';

export interface DashboardFilters {
  searchTerm: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  examTypes: string[];
  examStatus: ExamStatus[];
  gender: ('M' | 'F')[];
  ageRange: {
    min: number;
    max: number;
  };
}

export interface ChartData {
  name: string;
  value: number;
  label?: string;
}

export interface StatsData {
  totalPatients: number;
  totalExams: number;
  completedExams: number;
  pendingExams: number;
  scheduledExams: number;
  averageExamsPerPatient: number;
}
