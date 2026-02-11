import { create } from 'zustand';
import { Patient, Exam, CreatePatientDTO, UpdatePatientDTO } from '@/types';
import {
  savePatients,
  loadPatients,
  saveExams,
  loadExams,
} from '@/lib/storage/localStorage';
import { generateMockPatients } from '@/lib/utils/generators';

interface PatientsState {
  patients: Patient[];
  exams: Exam[];
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeStore: () => void;
  addPatient: (patient: CreatePatientDTO) => void;
  updatePatient: (patient: UpdatePatientDTO) => void;
  deletePatient: (id: string) => void;
  getPatientById: (id: string) => Patient | undefined;

  addExam: (exam: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  getExamsByPatientId: (patientId: string) => Exam[];

  searchPatients: (query: string) => Patient[];
  filterPatients: (filters: any) => Patient[];
}

export const usePatientsStore = create<PatientsState>((set, get) => ({
  patients: [],
  exams: [],
  isLoading: false,
  error: null,

  initializeStore: () => {
    set({ isLoading: true });

    let patients = loadPatients();
    let exams = loadExams();

    // Se não houver dados, gera dados mockados
    if (patients.length === 0) {
      patients = generateMockPatients(50);
      savePatients(patients);

      // Extrai todos os exames dos pacientes mockados
      exams = patients.flatMap((p) => p.examsCompleted);
      saveExams(exams);
    }

    set({ patients, exams, isLoading: false });
  },

  addPatient: (patientDTO: CreatePatientDTO) => {
    const newPatient: Patient = {
      ...patientDTO,
      id: `patient-${Date.now()}`,
      examsCompleted: [],
      examsPending: [],
      lastVisit: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPatients = [...get().patients, newPatient];
    set({ patients: updatedPatients });
    savePatients(updatedPatients);
  },

  updatePatient: (updateData: UpdatePatientDTO) => {
    const updatedPatients = get().patients.map((p) =>
      p.id === updateData.id
        ? { ...p, ...updateData, updatedAt: new Date().toISOString() }
        : p
    );

    set({ patients: updatedPatients });
    savePatients(updatedPatients);
  },

  deletePatient: (id: string) => {
    const updatedPatients = get().patients.filter((p) => p.id !== id);
    const updatedExams = get().exams.filter((e) => e.patientId !== id);

    set({ patients: updatedPatients, exams: updatedExams });
    savePatients(updatedPatients);
    saveExams(updatedExams);
  },

  getPatientById: (id: string) => {
    return get().patients.find((p) => p.id === id);
  },

  addExam: (examData) => {
    const newExam: Exam = {
      ...examData,
      id: `exam-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedExams = [...get().exams, newExam];
    set({ exams: updatedExams });
    saveExams(updatedExams);

    // Atualiza o paciente correspondente
    const patient = get().getPatientById(examData.patientId);
    if (patient) {
      const updatedPatient: Patient = {
        ...patient,
        examsCompleted:
          examData.status === 'completed'
            ? [...patient.examsCompleted, newExam]
            : patient.examsCompleted,
        examsPending:
          examData.status === 'pending'
            ? [...patient.examsPending, examData.name]
            : patient.examsPending,
        updatedAt: new Date().toISOString(),
      };
      get().updatePatient(updatedPatient);
    }
  },

  updateExam: (id: string, examData: Partial<Exam>) => {
    const updatedExams = get().exams.map((e) =>
      e.id === id
        ? { ...e, ...examData, updatedAt: new Date().toISOString() }
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

  getExamsByPatientId: (patientId: string) => {
    return get().exams.filter((e) => e.patientId === patientId);
  },

  searchPatients: (query: string) => {
    const lowerQuery = query.toLowerCase();
    return get().patients.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.cpf.includes(query) ||
        p.email.toLowerCase().includes(lowerQuery)
    );
  },

  filterPatients: (filters: any) => {
    // Implementação de filtros complexos
    return get().patients; // Placeholder
  },
}));
