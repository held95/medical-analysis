import { create } from 'zustand';
import { Employee, Exam, CreateEmployeeDTO, UpdateEmployeeDTO, AdherenceStats, MonthlyAdherence, ASOIndicators } from '@/types';
import {
  saveEmployees,
  loadEmployees,
  saveExams,
  loadExams,
} from '@/lib/storage/localStorage';
import { generateMockEmployees } from '@/lib/utils/generators';
import { calculateAdherence, getExamExpirationDate, isExamExpired } from '@/lib/utils/adherence';
import { EXAM_VALIDITY_PERIODS } from '@/constants/exams';
import { MONTHS, ADHERENCE_GOAL } from '@/constants/aso';

interface EmployeesState {
  employees: Employee[];
  exams: Exam[];
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeStore: () => void;
  addEmployee: (employee: CreateEmployeeDTO) => void;
  updateEmployee: (employee: UpdateEmployeeDTO) => void;
  deleteEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;

  addExam: (exam: Omit<Exam, 'id' | 'createdAt' | 'updatedAt' | 'expirationDate'>) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  getExamsByEmployeeId: (employeeId: string) => Exam[];

  searchEmployees: (query: string) => Employee[];
  filterEmployees: (filters: any) => Employee[];

  // Adherence and ASO specific methods
  updateExamExpirationStatus: () => void;
  getASOIndicators: () => ASOIndicators;
  getAdherenceStats: () => AdherenceStats;
  getMonthlyAdherence: () => MonthlyAdherence[];
}

export const useEmployeesStore = create<EmployeesState>((set, get) => ({
  employees: [],
  exams: [],
  isLoading: false,
  error: null,

  initializeStore: () => {
    set({ isLoading: true });

    let employees = loadEmployees();
    let exams = loadExams();

    // Se não houver dados, gera dados mockados
    if (employees.length === 0) {
      employees = generateMockEmployees(50);
      saveEmployees(employees);

      // Extrai todos os exames dos funcionários mockados
      exams = employees.flatMap((e) => e.examsCompleted);
      saveExams(exams);
    }

    // Atualiza status de vencimento dos exames
    get().updateExamExpirationStatus();

    set({ employees, exams, isLoading: false });
  },

  addEmployee: (employeeDTO: CreateEmployeeDTO) => {
    const newEmployee: Employee = {
      ...employeeDTO,
      id: `employee-${Date.now()}`,
      examsCompleted: [],
      examsPending: [],
      dataUltimoASO: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedEmployees = [...get().employees, newEmployee];
    set({ employees: updatedEmployees });
    saveEmployees(updatedEmployees);
  },

  updateEmployee: (updateData: UpdateEmployeeDTO) => {
    const updatedEmployees = get().employees.map((e) =>
      e.id === updateData.id
        ? { ...e, ...updateData, updatedAt: new Date().toISOString() }
        : e
    );

    set({ employees: updatedEmployees });
    saveEmployees(updatedEmployees);
  },

  deleteEmployee: (id: string) => {
    const updatedEmployees = get().employees.filter((e) => e.id !== id);
    const updatedExams = get().exams.filter((e) => e.employeeId !== id);

    set({ employees: updatedEmployees, exams: updatedExams });
    saveEmployees(updatedEmployees);
    saveExams(updatedExams);
  },

  getEmployeeById: (id: string) => {
    return get().employees.find((e) => e.id === id);
  },

  addExam: (examData) => {
    // Calcula a data de vencimento automaticamente
    const validityPeriod = EXAM_VALIDITY_PERIODS[examData.name] || 12;
    const expirationDate = examData.status === 'completed' && examData.date
      ? getExamExpirationDate(examData.date, validityPeriod).toISOString()
      : undefined;

    const newExam: Exam = {
      ...examData,
      id: `exam-${Date.now()}`,
      validityPeriod,
      expirationDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedExams = [...get().exams, newExam];
    set({ exams: updatedExams });
    saveExams(updatedExams);

    // Atualiza o funcionário correspondente
    const employee = get().getEmployeeById(examData.employeeId);
    if (employee) {
      const updatedEmployee: Employee = {
        ...employee,
        examsCompleted:
          examData.status === 'completed'
            ? [...employee.examsCompleted, newExam]
            : employee.examsCompleted,
        examsPending:
          examData.status === 'pending'
            ? [...employee.examsPending, examData.name]
            : employee.examsPending,
        dataUltimoASO: examData.status === 'completed' ? examData.date : employee.dataUltimoASO,
        updatedAt: new Date().toISOString(),
      };
      get().updateEmployee(updatedEmployee);
    }
  },

  updateExam: (id: string, examData: Partial<Exam>) => {
    const exam = get().exams.find((e) => e.id === id);
    if (!exam) return;

    // Recalcula a data de vencimento se a data ou status mudou
    let expirationDate = exam.expirationDate;
    if (examData.date || examData.status) {
      const newDate = examData.date || exam.date;
      const newStatus = examData.status || exam.status;
      const validityPeriod = exam.validityPeriod || EXAM_VALIDITY_PERIODS[exam.name] || 12;

      if (newStatus === 'completed' && newDate) {
        expirationDate = getExamExpirationDate(newDate, validityPeriod).toISOString();
      }
    }

    const updatedExams = get().exams.map((e) =>
      e.id === id
        ? { ...e, ...examData, expirationDate, updatedAt: new Date().toISOString() }
        : e
    );

    set({ exams: updatedExams });
    saveExams(updatedExams);
  },

  deleteExam: (id: string) => {
    const updatedExams = get().exams.filter((e) => e.id !== id);
    set({ exams: updatedExams });
    saveExams(updatedExams);
  },

  getExamsByEmployeeId: (employeeId: string) => {
    return get().exams.filter((e) => e.employeeId === employeeId);
  },

  searchEmployees: (query: string) => {
    const lowerQuery = query.toLowerCase();
    return get().employees.filter(
      (e) =>
        e.name.toLowerCase().includes(lowerQuery) ||
        e.cpf.includes(query) ||
        e.matricula.includes(query) ||
        e.email.toLowerCase().includes(lowerQuery)
    );
  },

  filterEmployees: (filters: any) => {
    let filtered = [...get().employees];

    if (filters.setor && filters.setor !== 'all') {
      filtered = filtered.filter((e) => e.setor === filters.setor);
    }

    if (filters.cargo && filters.cargo !== 'all') {
      filtered = filtered.filter((e) => e.cargo === filters.cargo);
    }

    if (filters.gender && filters.gender !== 'all') {
      filtered = filtered.filter((e) => e.gender === filters.gender);
    }

    return filtered;
  },

  // Atualiza o status de vencimento de todos os exames
  updateExamExpirationStatus: () => {
    const updatedExams = get().exams.map((exam) => {
      if (exam.expirationDate && exam.status === 'completed') {
        const expired = isExamExpired(exam.expirationDate);
        return {
          ...exam,
          status: expired ? ('expired' as const) : exam.status,
          updatedAt: new Date().toISOString(),
        };
      }
      return exam;
    });

    set({ exams: updatedExams });
    saveExams(updatedExams);
  },

  // Retorna os indicadores ASO (Vencido, Ok, Total, Aderência %)
  getASOIndicators: (): ASOIndicators => {
    const { employees, exams } = get();
    const totalEmployees = employees.length;

    // Conta exames por status
    const okExams = exams.filter((e) => e.status === 'completed').length;
    const expiredExams = exams.filter((e) => e.status === 'expired').length;
    const totalExams = exams.length;

    // Calcula aderência
    const adherencePercentage = calculateAdherence(totalEmployees, okExams);

    return {
      vencido: expiredExams,
      ok: okExams,
      total: totalExams,
      adherencePercentage,
    };
  },

  // Retorna estatísticas de aderência detalhadas
  getAdherenceStats: (): AdherenceStats => {
    const { exams } = get();

    // Total geral
    const okExams = exams.filter((e) => e.status === 'completed');
    const expiredExams = exams.filter((e) => e.status === 'expired');
    const totalExams = exams.length;

    // Por tipo de exame
    const byExamType = {} as Record<any, { ok: number; expired: number; percentage: number }>;

    exams.forEach((exam) => {
      if (!byExamType[exam.name]) {
        byExamType[exam.name] = { ok: 0, expired: 0, percentage: 0 };
      }

      if (exam.status === 'completed') byExamType[exam.name].ok++;
      if (exam.status === 'expired') byExamType[exam.name].expired++;
    });

    // Calcula percentuais
    Object.keys(byExamType).forEach((examName) => {
      const total = byExamType[examName].ok + byExamType[examName].expired;
      byExamType[examName].percentage = total > 0
        ? (byExamType[examName].ok / total) * 100
        : 0;
    });

    return {
      total: {
        ok: okExams.length,
        expired: expiredExams.length,
        percentage: totalExams > 0 ? (okExams.length / totalExams) * 100 : 0,
      },
      byExamType,
      monthly: get().getMonthlyAdherence(),
    };
  },

  // Retorna aderência mensal
  getMonthlyAdherence: (): MonthlyAdherence[] => {
    const { employees, exams } = get();
    const currentYear = new Date().getFullYear();

    return MONTHS.map((month, index) => {
      // Filtra exames do mês
      const monthExams = exams.filter((exam) => {
        if (!exam.date) return false;
        const examDate = new Date(exam.date);
        return examDate.getFullYear() === currentYear && examDate.getMonth() === index;
      });

      const completedExams = monthExams.filter((e) => e.status === 'completed').length;
      const expiredExams = monthExams.filter((e) => e.status === 'expired').length;
      const adherencePercentage = calculateAdherence(employees.length, completedExams);

      return {
        month,
        totalEmployees: employees.length,
        totalASO: monthExams.length,
        completedExams,
        expiredExams,
        adherencePercentage,
        goalPercentage: ADHERENCE_GOAL,
      };
    });
  },
}));
