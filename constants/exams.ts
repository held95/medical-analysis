import { ExamType } from '@/types/exam';

export const ASO_EXAM_TYPES: ExamType[] = [
  'Audiometria',
  'Visio Teste',
  'Raio X Tórax OIT',
  'Coluna Lombar',
  'TQHA URINA',
  'Hemograma c/ plaquetas',
  'Espirometria',
  'Glicemia',
  'Carboxihemoglobina',
  'ECG',
  'EEG',
];

export const EXAM_VALIDITY_PERIODS: Record<ExamType, number> = {
  'Audiometria': 12,
  'Visio Teste': 12,
  'Raio X Tórax OIT': 12,
  'Coluna Lombar': 12,
  'TQHA URINA': 12,
  'Hemograma c/ plaquetas': 12,
  'Espirometria': 12,
  'Glicemia': 12,
  'Carboxihemoglobina': 12,
  'ECG': 12,
  'EEG': 12,
}; // Todos os exames têm validade de 12 meses conforme requisito

export const EXAM_CATEGORIES = {
  clinico: ['Visio Teste', 'Audiometria'],
  laboratorial: ['Hemograma c/ plaquetas', 'Glicemia', 'TQHA URINA', 'Carboxihemoglobina'],
  imagem: ['Raio X Tórax OIT', 'Coluna Lombar'],
  funcional: ['Espirometria'],
  cardiológico: ['ECG'],
  neurológico: ['EEG'],
};

export const EXAM_STATUS_LABELS = {
  completed: 'Ok',
  pending: 'Pendente',
  scheduled: 'Agendado',
  cancelled: 'Cancelado',
  expired: 'Vencido',
};

export const EXAM_STATUS_COLORS = {
  completed: 'bg-green-500',
  pending: 'bg-yellow-500',
  scheduled: 'bg-blue-500',
  cancelled: 'bg-red-500',
  expired: 'bg-red-600',
};
