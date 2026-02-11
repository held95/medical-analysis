export const APP_CONFIG = {
  appName: 'Medical Analysis',
  appDescription: 'Sistema de Análise e Gerenciamento de Pacientes',
  version: '3.0.0',
  locale: 'pt-BR',
  timezone: 'America/Sao_Paulo',
};

export const STORAGE_KEYS = {
  patients: 'medical_analysis_patients_v3',
  exams: 'medical_analysis_exams_v3',
  settings: 'medical_analysis_settings_v3',
};

export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
};

export const VALIDATION = {
  cpfLength: 11,
  phoneLength: 11,
  minAge: 0,
  maxAge: 120,
  minNameLength: 3,
  maxNameLength: 100,
};
