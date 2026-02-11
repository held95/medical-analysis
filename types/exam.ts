export type ExamStatus = 'completed' | 'pending' | 'scheduled' | 'cancelled';

export type ExamType =
  | 'Hemograma completo'
  | 'Glicemia em jejum'
  | 'Colesterol total e frações'
  | 'Triglicerídeos'
  | 'Ureia e creatinina'
  | 'TSH e T4 livre'
  | 'Raio-X'
  | 'Ultrassonografia'
  | 'Eletrocardiograma'
  | 'Teste ergométrico'
  | 'Hemoglobina glicada'
  | 'TGO e TGP'
  | 'Vitamina D'
  | 'Ácido úrico';

export type ExamCategory = 'laboratorial' | 'imagem' | 'cardiológico';

export interface Exam {
  id: string;
  patientId: string;
  name: ExamType;
  category: ExamCategory;
  date: string;
  scheduledDate?: string;
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
  patientId: string;
  name: ExamType;
  category: ExamCategory;
  scheduledDate?: string;
  notes?: string;
  doctor?: string;
}
