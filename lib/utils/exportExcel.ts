import * as XLSX from 'xlsx';
import { Employee, Exam } from '@/types';
import { ASO_EXAM_TYPES } from '@/constants/exams';
import { formatDate } from './formatters';

export interface ExportData {
  employees: Employee[];
  exams: Exam[];
}

/**
 * Exporta dados de funcionários e exames para Excel
 */
export function exportASOToExcel(data: ExportData) {
  const { employees, exams } = data;

  // Cria os dados para a planilha
  const rows = employees.map((employee) => {
    const row: any = {
      'Matrícula': employee.matricula,
      'Nome': employee.name,
      'CPF': employee.cpf,
      'Cargo': employee.cargo,
      'Turno': employee.turno,
      'Setor': employee.setor,
      'Data Admissão': formatDate(employee.dataAdmissao),
      'Último ASO': employee.dataUltimoASO ? formatDate(employee.dataUltimoASO) : '-',
      'Idade': employee.age,
      'Sexo': employee.gender,
      'Email': employee.email,
      'Telefone': employee.phone,
    };

    // Adiciona cada tipo de exame como coluna
    ASO_EXAM_TYPES.forEach((examType) => {
      const exam = exams.find(
        (e) => e.employeeId === employee.id && e.name === examType
      );

      if (exam) {
        if (exam.status === 'completed') {
          row[examType] = `Ok - ${formatDate(exam.date)}`;
        } else if (exam.status === 'expired') {
          row[examType] = `Vencido - ${exam.expirationDate ? formatDate(exam.expirationDate) : ''}`;
        } else if (exam.status === 'scheduled') {
          row[examType] = `Agendado - ${exam.scheduledDate ? formatDate(exam.scheduledDate) : ''}`;
        } else {
          row[examType] = 'Pendente';
        }
      } else {
        row[examType] = '-';
      }
    });

    return row;
  });

  // Cria a planilha
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Ajusta larguras das colunas
  const columnWidths = [
    { wch: 12 }, // Matrícula
    { wch: 30 }, // Nome
    { wch: 15 }, // CPF
    { wch: 25 }, // Cargo
    { wch: 25 }, // Turno
    { wch: 12 }, // Setor
    { wch: 15 }, // Data Admissão
    { wch: 15 }, // Último ASO
    { wch: 8 },  // Idade
    { wch: 8 },  // Sexo
    { wch: 25 }, // Email
    { wch: 15 }, // Telefone
  ];

  // Adiciona largura para colunas de exames
  ASO_EXAM_TYPES.forEach(() => {
    columnWidths.push({ wch: 20 });
  });

  worksheet['!cols'] = columnWidths;

  // Cria o workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Controle ASO');

  // Cria planilha de resumo
  const summaryData = [
    { Indicador: 'Total de Funcionários', Valor: employees.length },
    { Indicador: 'Total de Exames', Valor: exams.length },
    { Indicador: 'Exames Ok', Valor: exams.filter((e) => e.status === 'completed').length },
    { Indicador: 'Exames Vencidos', Valor: exams.filter((e) => e.status === 'expired').length },
    { Indicador: 'Exames Pendentes', Valor: exams.filter((e) => e.status === 'pending').length },
    { Indicador: 'Exames Agendados', Valor: exams.filter((e) => e.status === 'scheduled').length },
  ];

  const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
  summaryWorksheet['!cols'] = [{ wch: 30 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Resumo');

  // Gera o arquivo
  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = `ASO_Controle_${timestamp}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}

/**
 * Exporta aderência mensal para Excel
 */
export function exportMonthlyAdherenceToExcel(monthlyData: any[]) {
  const worksheet = XLSX.utils.json_to_sheet(
    monthlyData.map((item) => ({
      'Mês': item.month,
      'Total Funcionários': item.totalEmployees,
      'Total ASO': item.totalASO,
      'Exames Completos': item.completedExams,
      'Exames Vencidos': item.expiredExams,
      'Aderência (%)': item.adherencePercentage.toFixed(2),
      'Meta (%)': item.goalPercentage,
    }))
  );

  worksheet['!cols'] = [
    { wch: 12 },
    { wch: 18 },
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Aderência Mensal');

  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = `ASO_Aderencia_Mensal_${timestamp}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}
