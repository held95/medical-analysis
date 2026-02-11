import { Patient, Exam, ExamStatus } from '@/types';
import { EXAM_TYPES } from '@/constants/exams';

const BRAZILIAN_NAMES = [
  'João Silva Santos',
  'Maria Oliveira Costa',
  'Pedro Rodrigues Alves',
  'Ana Paula Ferreira',
  'Carlos Eduardo Souza',
  'Juliana Martins Lima',
  'Fernando Henrique Rocha',
  'Patricia Silva Gomes',
  'Ricardo Alves Pereira',
  'Camila Costa Ribeiro',
  'Lucas Fernandes Carvalho',
  'Beatriz Souza Araújo',
  'Rafael Santos Dias',
  'Amanda Lima Cardoso',
  'Gustavo Pereira Castro',
  'Larissa Martins Correia',
  'Bruno Oliveira Barbosa',
  'Gabriela Ferreira Monteiro',
  'Thiago Costa Nascimento',
  'Mariana Alves Teixeira',
  'Diego Silva Duarte',
  'Isabella Santos Ramos',
  'Vinicius Rodrigues Moreira',
  'Leticia Oliveira Barros',
  'André Ferreira Campos',
  'Carolina Costa Xavier',
  'Marcelo Santos Moura',
  'Natalia Silva Mendes',
  'Felipe Alves Azevedo',
  'Vanessa Rodrigues Nunes',
  'Rodrigo Santos Lopes',
  'Renata Oliveira Melo',
  'Eduardo Costa Farias',
  'Aline Ferreira Siqueira',
  'Leandro Silva Macedo',
  'Fernanda Santos Batista',
  'Daniel Alves Viana',
  'Juliane Rodrigues Reis',
  'Mateus Costa Aguiar',
  'Priscila Silva Freitas',
  'Caio Santos Pinto',
  'Bianca Oliveira Cavalcanti',
  'Leonardo Ferreira Melo',
  'Viviane Costa Pires',
  'Gabriel Silva Cardoso',
  'Tatiane Alves Monteiro',
  'Henrique Rodrigues Xavier',
  'Adriana Santos Ribeiro',
  'Fabio Costa Lima',
  'Simone Oliveira Nascimento',
];

const BRAZILIAN_CITIES = [
  { city: 'São Paulo', state: 'SP' },
  { city: 'Rio de Janeiro', state: 'RJ' },
  { city: 'Belo Horizonte', state: 'MG' },
  { city: 'Curitiba', state: 'PR' },
  { city: 'Porto Alegre', state: 'RS' },
  { city: 'Brasília', state: 'DF' },
  { city: 'Salvador', state: 'BA' },
  { city: 'Fortaleza', state: 'CE' },
  { city: 'Recife', state: 'PE' },
  { city: 'Manaus', state: 'AM' },
];

const STREETS = [
  'Rua das Flores',
  'Av. Paulista',
  'Rua dos Três Irmãos',
  'Av. Brasil',
  'Rua do Comércio',
  'Av. Atlântica',
  'Rua Sete de Setembro',
  'Av. Ipiranga',
  'Rua Augusta',
  'Av. Faria Lima',
  'Rua Oscar Freire',
  'Av. Rebouças',
];

export function generateCPF(): string {
  const random = (n: number) => Math.floor(Math.random() * n);
  const mod = (dividend: number, divisor: number) =>
    Math.round(dividend - Math.floor(dividend / divisor) * divisor);

  let n = '';
  for (let i = 0; i < 9; i++) {
    n += random(9);
  }

  let d1 = 0;
  for (let i = 0; i < 9; i++) {
    d1 += parseInt(n[i]) * (10 - i);
  }
  d1 = 11 - mod(d1, 11);
  if (d1 >= 10) d1 = 0;

  let d2 = 0;
  for (let i = 0; i < 9; i++) {
    d2 += parseInt(n[i]) * (11 - i);
  }
  d2 += d1 * 2;
  d2 = 11 - mod(d2, 11);
  if (d2 >= 10) d2 = 0;

  return n + d1 + d2;
}

export function generatePhone(): string {
  const ddd = Math.floor(Math.random() * 90) + 11;
  const firstDigit = 9;
  const restDigits = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, '0');
  return `${ddd}${firstDigit}${restDigits}`;
}

export function generateEmail(name: string): string {
  const cleanName = name.toLowerCase().split(' ').slice(0, 2).join('.');
  const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${cleanName}@${domain}`;
}

function generateRandomDate(start: Date, end: Date): string {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
}

export function generateMockExams(patientId: string, count: number): Exam[] {
  const exams: Exam[] = [];
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  for (let i = 0; i < count; i++) {
    const examType = EXAM_TYPES[Math.floor(Math.random() * EXAM_TYPES.length)];
    const statusRandom = Math.random();
    let status: ExamStatus;

    // 40% completed, 40% scheduled, 15% pending, 5% cancelled
    if (statusRandom > 0.85) {
      status = 'pending';
    } else if (statusRandom > 0.45) {
      status = 'scheduled';
    } else if (statusRandom > 0.05) {
      status = 'completed';
    } else {
      status = 'cancelled';
    }

    let category: 'laboratorial' | 'imagem' | 'cardiológico' = 'laboratorial';
    if (['Raio-X', 'Ultrassonografia'].includes(examType)) {
      category = 'imagem';
    } else if (['Eletrocardiograma', 'Teste ergométrico'].includes(examType)) {
      category = 'cardiológico';
    }

    // Gerar data futura para exames agendados (próximos 60 dias)
    const futureDate = new Date(now.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000);

    const exam: Exam = {
      id: `exam-${patientId}-${i}-${Date.now()}-${Math.random()}`,
      patientId,
      name: examType,
      category,
      date: status === 'completed'
        ? generateRandomDate(sixMonthsAgo, now)
        : status === 'scheduled'
        ? futureDate.toISOString()
        : generateRandomDate(sixMonthsAgo, now),
      scheduledDate: status === 'scheduled' ? futureDate.toISOString() : undefined,
      result: status === 'completed' ? 'Normal' : undefined,
      notes: status === 'scheduled' ? 'Consulta agendada' : undefined,
      status,
      createdAt: generateRandomDate(sixMonthsAgo, now),
      updatedAt: generateRandomDate(sixMonthsAgo, now),
    };

    exams.push(exam);
  }

  return exams;
}

export function generateMockPatients(count: number = 50): Patient[] {
  const patients: Patient[] = [];

  for (let i = 0; i < count; i++) {
    const name = BRAZILIAN_NAMES[i % BRAZILIAN_NAMES.length];
    const gender: 'M' | 'F' = Math.random() > 0.5 ? 'M' : 'F';
    const age = Math.floor(Math.random() * 80) + 18;
    const location =
      BRAZILIAN_CITIES[Math.floor(Math.random() * BRAZILIAN_CITIES.length)];
    const street = STREETS[Math.floor(Math.random() * STREETS.length)];

    const examsCount = Math.floor(Math.random() * 8) + 2;
    const patientId = `patient-${i}-${Date.now()}`;
    const exams = generateMockExams(patientId, examsCount);

    const zipCode = String(Math.floor(Math.random() * 90000000) + 10000000);
    const formattedZipCode = zipCode.replace(/(\d{5})(\d{3})/, '$1-$2');

    patients.push({
      id: patientId,
      name,
      cpf: generateCPF(),
      age,
      gender,
      email: generateEmail(name),
      phone: generatePhone(),
      hasDocuments: Math.random() > 0.4, // 60% tem documentos, 40% não tem
      address: {
        street,
        number: String(Math.floor(Math.random() * 9999) + 1),
        city: location.city,
        state: location.state,
        zipCode: formattedZipCode,
      },
      examsCompleted: exams.filter((e) => e.status === 'completed'),
      examsPending: exams
        .filter((e) => e.status === 'pending')
        .map((e) => e.name),
      lastVisit: generateRandomDate(
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        new Date()
      ),
      createdAt: generateRandomDate(
        new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        new Date()
      ),
      updatedAt: generateRandomDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date()
      ),
    });
  }

  return patients;
}
