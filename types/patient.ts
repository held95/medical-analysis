import { Exam } from './exam';

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  age: number;
  gender: 'M' | 'F';
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
  examsCompleted: Exam[];
  examsPending: string[];
  lastVisit: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDTO {
  name: string;
  cpf: string;
  age: number;
  gender: 'M' | 'F';
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface UpdatePatientDTO extends Partial<CreatePatientDTO> {
  id: string;
}
