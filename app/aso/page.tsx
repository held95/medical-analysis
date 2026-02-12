'use client';

import { useEffect, useMemo } from 'react';
import { useEmployeesStore } from '@/lib/store/employeesStore';
import { ASOControlTable } from '@/components/aso/ASOControlTable';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { exportASOToExcel } from '@/lib/utils/exportExcel';

export default function ASOPage() {
  const { employees, exams, initializeStore } = useEmployeesStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const stats = useMemo(() => {
    const okExams = exams.filter((e) => e.status === 'completed').length;
    const expiredExams = exams.filter((e) => e.status === 'expired').length;
    const totalExams = exams.length;

    const employeesWithExpiredExams = new Set(
      exams.filter((e) => e.status === 'expired').map((e) => e.employeeId)
    ).size;

    const employeesWithAllOk = employees.filter((emp) => {
      const empExams = exams.filter((e) => e.employeeId === emp.id);
      return empExams.length > 0 && empExams.every((e) => e.status === 'completed');
    }).length;

    return {
      totalEmployees: employees.length,
      totalExams,
      okExams,
      expiredExams,
      employeesWithExpiredExams,
      employeesWithAllOk,
    };
  }, [employees, exams]);

  const handleExport = () => {
    try {
      exportASOToExcel({ employees, exams });
      alert('Arquivo Excel gerado com sucesso! Verifique sua pasta de downloads.');
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao gerar arquivo Excel. Verifique o console para detalhes.');
    }
  };

  return (
    <div className="space-y-6 pb-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 -mx-6 -mt-6 px-6 pt-8 pb-16 rounded-b-3xl shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <FileSpreadsheet className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Controle ASO Detalhado
            </h1>
            <p className="text-blue-100 text-lg">
              Registro completo de exames por funcionário
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="-mt-8 relative z-10 px-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4 border-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Funcionários</p>
                <p className="text-2xl font-bold">{stats.totalEmployees}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Funcionários Ok</p>
                <p className="text-2xl font-bold text-green-600">{stats.employeesWithAllOk}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Com Exames Vencidos</p>
                <p className="text-2xl font-bold text-red-600">{stats.employeesWithExpiredExams}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Exames</p>
                <p className="text-2xl font-bold">{stats.totalExams}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabela de Controle ASO */}
      <div className="px-6">
        <ASOControlTable
          employees={employees}
          exams={exams}
          onExport={handleExport}
        />
      </div>

      {/* Informações */}
      <div className="px-6">
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <span>⚠️</span>
            <span>Importante</span>
          </h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li className="flex items-start">
              <span className="mr-2 font-bold">•</span>
              <span>
                Exames marcados como <Badge className="bg-red-600 text-white text-xs mx-1">Vencido</Badge>
                precisam ser renovados imediatamente
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">•</span>
              <span>
                Todos os exames ASO têm validade de <strong>12 meses</strong>
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">•</span>
              <span>
                Use os filtros acima para buscar por setor específico ou funcionário
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">•</span>
              <span>
                Clique em "Exportar Excel" para gerar planilha com todos os dados
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
