import { Exam } from './exam';

export interface Employee {
  id: string;
  name: string;
  cpf: string;
  matricula: string;
  age: number;
  gender: 'M' | 'F';
  email: string;
  phone: string;
  cargo: string;
  turno: string;
  setor: 'SABDARIA' | 'MOD' | 'SMT' | 'TI';
  dataAdmissao: string; // ISO date
  dataUltimoASO: string; // ISO date
  examsCompleted: Exam[];
  examsPending: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDTO {
  name: string;
  cpf: string;
  matricula: string;
  age: number;
  gender: 'M' | 'F';
  email: string;
  phone: string;
  cargo: string;
  turno: string;
  setor: 'SABDARIA' | 'MOD' | 'SMT' | 'TI';
  dataAdmissao: string;
}

export interface UpdateEmployeeDTO extends Partial<CreateEmployeeDTO> {
  id: string;
}
