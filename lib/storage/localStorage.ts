import { Patient, Exam } from '@/types';
import { STORAGE_KEYS } from '@/constants/config';

export function savePatients(patients: Patient[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
    }
  } catch (error) {
    console.error('Error saving patients to localStorage:', error);
  }
}

export function loadPatients(): Patient[] {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEYS.patients);
      return data ? JSON.parse(data) : [];
    }
    return [];
  } catch (error) {
    console.error('Error loading patients from localStorage:', error);
    return [];
  }
}

export function saveExams(exams: Exam[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.exams, JSON.stringify(exams));
    }
  } catch (error) {
    console.error('Error saving exams to localStorage:', error);
  }
}

export function loadExams(): Exam[] {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEYS.exams);
      return data ? JSON.parse(data) : [];
    }
    return [];
  } catch (error) {
    console.error('Error loading exams from localStorage:', error);
    return [];
  }
}

export function clearAllData(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.patients);
      localStorage.removeItem(STORAGE_KEYS.exams);
      localStorage.removeItem(STORAGE_KEYS.settings);
    }
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

export function exportData(): string {
  const patients = loadPatients();
  const exams = loadExams();

  return JSON.stringify(
    {
      patients,
      exams,
      exportDate: new Date().toISOString(),
    },
    null,
    2
  );
}

export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    if (data.patients) savePatients(data.patients);
    if (data.exams) saveExams(data.exams);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}
