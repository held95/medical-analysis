export const APP_CONFIG = {
  appName: 'Sistema ASO',
  appDescription: 'Sistema de Controle de Atestado de Saúde Ocupacional',
  version: '4.0.0',
  locale: 'pt-BR',
  timezone: 'America/Sao_Paulo',
};

export const STORAGE_KEYS = {
  employees: 'aso_system_employees_v4',
  exams: 'aso_system_exams_v4',
  settings: 'aso_system_settings_v4',
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
