import { ExamType } from '@/types/exam';

export const EXAM_TYPES: ExamType[] = [
  'Hemograma completo',
  'Glicemia em jejum',
  'Colesterol total e frações',
  'Triglicerídeos',
  'Ureia e creatinina',
  'TSH e T4 livre',
  'Raio-X',
  'Ultrassonografia',
  'Eletrocardiograma',
  'Teste ergométrico',
  'Hemoglobina glicada',
  'TGO e TGP',
  'Vitamina D',
  'Ácido úrico',
];

export const EXAM_CATEGORIES = {
  laboratorial: [
    'Hemograma completo',
    'Glicemia em jejum',
    'Colesterol total e frações',
    'Triglicerídeos',
    'Ureia e creatinina',
    'TSH e T4 livre',
    'Hemoglobina glicada',
    'TGO e TGP',
    'Vitamina D',
    'Ácido úrico',
  ],
  imagem: ['Raio-X', 'Ultrassonografia'],
  cardiológico: ['Eletrocardiograma', 'Teste ergométrico'],
};

export const EXAM_STATUS_LABELS = {
  completed: 'Concluído',
  pending: 'Pendente',
  scheduled: 'Agendado',
  cancelled: 'Cancelado',
};

export const EXAM_STATUS_COLORS = {
  completed: 'bg-green-500',
  pending: 'bg-yellow-500',
  scheduled: 'bg-blue-500',
  cancelled: 'bg-red-500',
};
