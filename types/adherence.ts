import { ExamType } from './exam';

export interface MonthlyAdherence {
  month: string; // 'Janeiro', 'Fevereiro', etc.
  totalEmployees: number;
  totalASO: number;
  completedExams: number;
  expiredExams: number;
  adherencePercentage: number;
  goalPercentage: number;
}

export interface AdherenceStats {
  total: {
    ok: number;
    expired: number;
    percentage: number;
  };
  byExamType: Record<ExamType, {
    ok: number;
    expired: number;
    percentage: number;
  }>;
  monthly: MonthlyAdherence[];
}

export interface ASOIndicators {
  vencido: number;
  ok: number;
  total: number;
  adherencePercentage: number;
}
