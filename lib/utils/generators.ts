import { Employee, Exam, ExamStatus, ExamType } from '@/types';
import { ASO_EXAM_TYPES, EXAM_VALIDITY_PERIODS } from '@/constants/exams';
import { SETORES, CARGOS, TURNOS } from '@/constants/aso';
import { getExamExpirationDate } from './adherence';

const BRAZILIAN_NAMES = [
  'ADILSON RAIMUNDO',
  'ADRIANO GALVÃO DE GÓIS',
  'ADRIANO ROSA',
  'ADRENA FONSECA DE SOUSA',
  'ADRIANA FERREIRA DE OLIVEIRA',
  'EDUARDO GALDINO DE SOUZA',
  'JOÃO SILVA SANTOS',
  'MARIA OLIVEIRA COSTA',
  'PEDRO RODRIGUES ALVES',
  'ANA PAULA FERREIRA',
  'CARLOS EDUARDO SOUZA',
  'JULIANA MARTINS LIMA',
  'FERNANDO HENRIQUE ROCHA',
  'PATRICIA SILVA GOMES',
  'RICARDO ALVES PEREIRA',
  'CAMILA COSTA RIBEIRO',
  'LUCAS FERNANDES CARVALHO',
  'BEATRIZ SOUZA ARAÚJO',
  'RAFAEL SANTOS DIAS',
  'AMANDA LIMA CARDOSO',
  'GUSTAVO PEREIRA CASTRO',
  'LARISSA MARTINS CORREIA',
  'BRUNO OLIVEIRA BARBOSA',
  'GABRIELA FERREIRA MONTEIRO',
  'THIAGO COSTA NASCIMENTO',
  'MARIANA ALVES TEIXEIRA',
  'DIEGO SILVA DUARTE',
  'ISABELLA SANTOS RAMOS',
  'VINICIUS RODRIGUES MOREIRA',
  'LETICIA OLIVEIRA BARROS',
  'ANDRÉ FERREIRA CAMPOS',
  'CAROLINA COSTA XAVIER',
  'MARCELO SANTOS MOURA',
  'NATALIA SILVA MENDES',
  'FELIPE ALVES AZEVEDO',
  'VANESSA RODRIGUES NUNES',
  'RODRIGO SANTOS LOPES',
  'RENATA OLIVEIRA MELO',
  'EDUARDO COSTA FARIAS',
  'ALINE FERREIRA SIQUEIRA',
  'LEANDRO SILVA MACEDO',
  'FERNANDA SANTOS BATISTA',
  'DANIEL ALVES VIANA',
  'JULIANE RODRIGUES REIS',
  'MATEUS COSTA AGUIAR',
  'PRISCILA SILVA FREITAS',
  'CAIO SANTOS PINTO',
  'BIANCA OLIVEIRA CAVALCANTI',
  'LEONARDO FERREIRA MELO',
  'VIVIANE COSTA PIRES',
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

export function generateMatricula(): string {
  return String(Math.floor(Math.random() * 900000) + 100000);
}

function generateRandomDate(start: Date, end: Date): string {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
}

function getExamCategory(examType: ExamType): any {
  if (['Visio Teste', 'Audiometria'].includes(examType)) return 'clinico';
  if (['Hemograma c/ plaquetas', 'Glicemia', 'TQHA URINA', 'Carboxihemoglobina'].includes(examType)) return 'laboratorial';
  if (['Raio X Tórax OIT', 'Coluna Lombar'].includes(examType)) return 'imagem';
  if (examType === 'Espirometria') return 'funcional';
  if (examType === 'ECG') return 'cardiológico';
  if (examType === 'EEG') return 'neurológico';
  return 'laboratorial';
}

export function generateMockExams(employeeId: string, count: number): Exam[] {
  const exams: Exam[] = [];
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Seleciona exames aleatórios, mas garante que tenha pelo menos os principais ASO
  const selectedExamTypes = new Set<ExamType>();

  // Adiciona exames obrigatórios ASO
  selectedExamTypes.add('Audiometria');
  selectedExamTypes.add('Visio Teste');
  selectedExamTypes.add('Hemograma c/ plaquetas');
  selectedExamTypes.add('ECG');

  // Adiciona exames aleatórios até atingir a contagem
  while (selectedExamTypes.size < count && selectedExamTypes.size < ASO_EXAM_TYPES.length) {
    const randomExam = ASO_EXAM_TYPES[Math.floor(Math.random() * ASO_EXAM_TYPES.length)];
    selectedExamTypes.add(randomExam);
  }

  selectedExamTypes.forEach((examType, index) => {
    const statusRandom = Math.random();
    let status: ExamStatus;

    // 70% completed, 10% expired, 15% pending, 5% scheduled
    if (statusRandom > 0.95) {
      status = 'pending';
    } else if (statusRandom > 0.90) {
      status = 'scheduled';
    } else if (statusRandom > 0.80) {
      status = 'expired';
    } else {
      status = 'completed';
    }

    const category = getExamCategory(examType);
    const validityPeriod = EXAM_VALIDITY_PERIODS[examType] || 12;

    // Data do exame (passado para completed/expired, futuro para scheduled)
    let examDate: string;
    let expirationDate: string | undefined;

    if (status === 'completed' || status === 'expired') {
      // Exames completados nos últimos 12 meses
      examDate = generateRandomDate(oneYearAgo, now);
      expirationDate = getExamExpirationDate(examDate, validityPeriod).toISOString();

      // Se for expired, ajusta a data para que realmente esteja vencido
      if (status === 'expired') {
        const oldDate = new Date(now);
        oldDate.setMonth(oldDate.getMonth() - (validityPeriod + Math.floor(Math.random() * 6) + 1));
        examDate = oldDate.toISOString();
        expirationDate = getExamExpirationDate(examDate, validityPeriod).toISOString();
      }
    } else if (status === 'scheduled') {
      // Exames agendados nos próximos 60 dias
      const futureDate = new Date(now);
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 60) + 1);
      examDate = futureDate.toISOString();
    } else {
      // Pending
      examDate = now.toISOString();
    }

    const exam: Exam = {
      id: `exam-${employeeId}-${index}-${Date.now()}-${Math.random()}`,
      employeeId,
      name: examType,
      category,
      date: examDate,
      scheduledDate: status === 'scheduled' ? examDate : undefined,
      expirationDate,
      validityPeriod,
      result: status === 'completed' ? 'Ok' : undefined,
      notes: status === 'scheduled' ? 'Exame agendado' : undefined,
      status,
      createdAt: generateRandomDate(oneYearAgo, now),
      updatedAt: new Date().toISOString(),
    };

    exams.push(exam);
  });

  return exams;
}

export function generateMockEmployees(count: number = 50): Employee[] {
  const employees: Employee[] = [];

  for (let i = 0; i < count; i++) {
    const name = BRAZILIAN_NAMES[i % BRAZILIAN_NAMES.length];
    const gender: 'M' | 'F' = Math.random() > 0.5 ? 'M' : 'F';
    const age = Math.floor(Math.random() * 40) + 20; // Idade entre 20-60
    const setor = SETORES[Math.floor(Math.random() * SETORES.length)];
    const cargo = CARGOS[Math.floor(Math.random() * CARGOS.length)];
    const turno = TURNOS[Math.floor(Math.random() * TURNOS.length)].codigo;

    const examsCount = Math.floor(Math.random() * 5) + 4; // 4-8 exames
    const employeeId = `employee-${i}-${Date.now()}`;
    const exams = generateMockExams(employeeId, examsCount);

    // Data de admissão (entre 1-10 anos atrás)
    const dataAdmissao = new Date();
    dataAdmissao.setFullYear(dataAdmissao.getFullYear() - Math.floor(Math.random() * 10) - 1);

    // Data do último ASO (data do exame mais recente completed)
    const completedExams = exams.filter((e) => e.status === 'completed');
    const dataUltimoASO =
      completedExams.length > 0
        ? completedExams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
        : new Date().toISOString();

    employees.push({
      id: employeeId,
      name,
      cpf: generateCPF(),
      matricula: generateMatricula(),
      age,
      gender,
      email: generateEmail(name),
      phone: generatePhone(),
      cargo,
      turno,
      setor,
      dataAdmissao: dataAdmissao.toISOString(),
      examsCompleted: exams.filter((e) => e.status === 'completed' || e.status === 'expired'),
      examsPending: exams
        .filter((e) => e.status === 'pending')
        .map((e) => e.name),
      dataUltimoASO,
      createdAt: dataAdmissao.toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return employees;
}
