'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Employee, Exam } from '@/types';
import { ASO_EXAM_TYPES } from '@/constants/exams';
import { formatDate } from '@/lib/utils/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ASOControlTableProps {
  employees: Employee[];
  exams: Exam[];
  onExport?: () => void;
}

export function ASOControlTable({ employees, exams, onExport }: ASOControlTableProps) {
  const [setorFilter, setSetorFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = useMemo(() => {
    let filtered = [...employees];

    if (setorFilter !== 'all') {
      filtered = filtered.filter((e) => e.setor === setorFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(term) ||
          e.matricula.includes(term) ||
          e.cpf.includes(term)
      );
    }

    return filtered;
  }, [employees, setorFilter, searchTerm]);

  // Organiza exames por funcionário e tipo
  const getExamForEmployee = (employeeId: string, examType: string) => {
    return exams.find((e) => e.employeeId === employeeId && e.name === examType);
  };

  // Formata a exibição do exame na célula
  const renderExamCell = (exam: Exam | undefined) => {
    if (!exam) {
      return <span className="text-gray-300 text-xs">-</span>;
    }

    if (exam.status === 'completed') {
      return (
        <div className="flex flex-col items-center">
          <Badge className="bg-green-500 text-white text-xs">Ok</Badge>
          <span className="text-xs text-gray-600 mt-1">
            {formatDate(exam.date)}
          </span>
        </div>
      );
    }

    if (exam.status === 'expired') {
      return (
        <div className="flex flex-col items-center">
          <Badge className="bg-red-600 text-white text-xs">Vencido</Badge>
          <span className="text-xs text-gray-600 mt-1">
            {exam.expirationDate ? formatDate(exam.expirationDate) : '-'}
          </span>
        </div>
      );
    }

    if (exam.status === 'pending') {
      return <Badge variant="secondary" className="text-xs">Pendente</Badge>;
    }

    if (exam.status === 'scheduled') {
      return (
        <div className="flex flex-col items-center">
          <Badge className="bg-blue-500 text-white text-xs">Agendado</Badge>
          <span className="text-xs text-gray-600 mt-1">
            {exam.scheduledDate ? formatDate(exam.scheduledDate) : '-'}
          </span>
        </div>
      );
    }

    return <span className="text-gray-300 text-xs">-</span>;
  };

  // Calcula o mês do último ASO
  const getASOMonth = (employee: Employee) => {
    if (!employee.dataUltimoASO) return '-';
    const date = new Date(employee.dataUltimoASO);
    return date.toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' });
  };

  return (
    <Card className="p-6">
      {/* Header e Filtros */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>📋</span>
            Controle ASO - Registro de Exames
          </h2>
          {onExport && (
            <Button onClick={onExport} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, matrícula ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={setorFilter} onValueChange={setSetorFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Setores</SelectItem>
              <SelectItem value="SABDARIA">SABDARIA</SelectItem>
              <SelectItem value="MOD">MOD</SelectItem>
              <SelectItem value="SMT">SMT</SelectItem>
              <SelectItem value="TI">TI</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-gray-600 flex items-center">
            Mostrando {filteredEmployees.length} de {employees.length} funcionários
          </div>
        </div>
      </div>

      {/* Tabela Scrollable */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full min-w-[1400px] border-collapse">
          <thead className="bg-blue-900 text-white sticky top-0 z-10">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold w-24">
                Matrícula
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold min-w-[200px]">
                Nome
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold w-32">
                Cargo
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold w-24">
                Setor
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold w-24">
                DATA ASO
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold w-20">
                MÊS
              </th>
              {ASO_EXAM_TYPES.map((examType) => (
                <th
                  key={examType}
                  className="border border-gray-300 px-2 py-2 text-center text-xs font-semibold w-28"
                >
                  {examType}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredEmployees.map((employee, index) => (
              <tr
                key={employee.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
              >
                <td className="border border-gray-300 px-3 py-2 text-sm font-medium">
                  {employee.matricula}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-sm">
                  {employee.name}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-xs">
                  {employee.cargo}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <Badge variant="secondary" className="text-xs">
                    {employee.setor}
                  </Badge>
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center text-xs">
                  {employee.dataUltimoASO ? formatDate(employee.dataUltimoASO) : '-'}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center text-xs font-medium">
                  {getASOMonth(employee)}
                </td>
                {ASO_EXAM_TYPES.map((examType) => {
                  const exam = getExamForEmployee(employee.id, examType);
                  return (
                    <td
                      key={`${employee.id}-${examType}`}
                      className="border border-gray-300 px-2 py-2 text-center"
                    >
                      {renderExamCell(exam)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">Nenhum funcionário encontrado</p>
          <p className="text-sm mt-2">Ajuste os filtros ou adicione novos funcionários</p>
        </div>
      )}

      {/* Legenda */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
        <div className="font-semibold">Legenda:</div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500 text-white text-xs">Ok</Badge>
          <span className="text-gray-600">Exame válido</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-600 text-white text-xs">Vencido</Badge>
          <span className="text-gray-600">Exame vencido (precisa renovar)</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-500 text-white text-xs">Agendado</Badge>
          <span className="text-gray-600">Exame agendado</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">Pendente</Badge>
          <span className="text-gray-600">Aguardando agendamento</span>
        </div>
      </div>
    </Card>
  );
}
