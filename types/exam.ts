export type ExamStatus =
  | 'completed'
  | 'pending'
  | 'scheduled'
  | 'cancelled'
  | 'expired';

export type ExamType =
  | 'Audiometria'
  | 'Visio Teste'
  | 'Raio X Tórax OIT'
  | 'Coluna Lombar'
  | 'TQHA URINA'
  | 'Hemograma c/ plaquetas'
  | 'Espirometria'
  | 'Glicemia'
  | 'Carboxihemoglobina'
  | 'ECG'
  | 'EEG';

export type ExamCategory =
  | 'clinico'
  | 'laboratorial'
  | 'imagem'
  | 'funcional'
  | 'cardiológico'
  | 'neurológico';

export interface Exam {
  id: string;
  employeeId: string; // Renomeado de patientId
  name: ExamType;
  category: ExamCategory;
  date: string;
  scheduledDate?: string;
  expirationDate?: string; // Novo: data de vencimento
  validityPeriod?: number; // Novo: período de validade em meses
  result?: string;
  resultValue?: string;
  referenceRange?: string;
  status: ExamStatus;
  notes?: string;
  doctor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExamDTO {
  employeeId: string; // Renomeado de patientId
  name: ExamType;
  category: ExamCategory;
  scheduledDate?: string;
  notes?: string;
  doctor?: string;
}
