'use client';

import { useEffect, useMemo, useState } from 'react';
import { useEmployeesStore } from '@/lib/store/employeesStore';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { ExamsChart } from '@/components/dashboard/ExamsChart';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { StatsData, ChartData } from '@/types/filters';

export default function AnalisePage() {
  const { employees, exams, initializeStore } = useEmployeesStore();
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Aplicar filtros nos funcionários
  const filteredEmployees = useMemo(() => {
    let filtered = [...employees];

    if (filters.setor && filters.setor !== 'all') {
      filtered = filtered.filter((e) => e.setor === filters.setor);
    }

    if (filters.gender && filters.gender !== 'all') {
      filtered = filtered.filter((e) => e.gender === filters.gender);
    }

    return filtered;
  }, [employees, filters]);

  // Aplicar filtros nos exames
  const filteredExams = useMemo(() => {
    let filtered = [...exams];

    // Filtrar por funcionários filtrados
    const filteredEmployeeIds = new Set(filteredEmployees.map((e) => e.id));
    filtered = filtered.filter((e) => filteredEmployeeIds.has(e.employeeId));

    // Filtrar por tipo de exame
    if (filters.examType && filters.examType !== 'all') {
      filtered = filtered.filter((e) => e.name === filters.examType);
    }

    // Filtrar por status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((e) => e.status === filters.status);
    }

    return filtered;
  }, [exams, filteredEmployees, filters]);

  const stats = useMemo((): StatsData => {
    const totalPatients = filteredEmployees.length;
    const totalExams = filteredExams.length;
    const completedExams = filteredExams.filter((e) => e.status === 'completed').length;
    const pendingExams = filteredExams.filter((e) => e.status === 'pending').length;
    const scheduledExams = filteredExams.filter((e) => e.status === 'scheduled').length;
    const averageExamsPerPatient =
      totalPatients > 0 ? totalExams / totalPatients : 0;

    return {
      totalPatients,
      totalExams,
      completedExams,
      pendingExams,
      scheduledExams,
      averageExamsPerPatient,
    };
  }, [filteredEmployees, filteredExams]);

  const examChartData = useMemo((): ChartData[] => {
    const examCounts = filteredExams.reduce(
      (acc, exam) => {
        acc[exam.name] = (acc[exam.name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(examCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredExams]);

  const handleSearch = (query: string) => {
    console.log('Searching:', query);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6 pb-8 bg-gray-50 min-h-screen">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 -mx-6 -mt-6 px-6 pt-8 pb-16 rounded-b-3xl shadow-xl">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
          Análise de Dados
        </h1>
        <p className="text-blue-100 text-lg">
          Visão geral e análise de funcionários e exames ASO
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="-mt-24 relative z-10 px-6">
        <StatsCards stats={stats} />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid gap-6 lg:grid-cols-3 px-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
            <ExamsChart
              data={examChartData}
              title={`Top ${examChartData.length} Exames Mais Realizados`}
            />
          </div>
        </div>

        <div className="space-y-6">
          <FilterPanel
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Info adicional */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-6 rounded-2xl border-2 border-indigo-200">
            <h3 className="font-semibold text-indigo-900 mb-3 text-lg">
              ℹ️ Informações
            </h3>
            <ul className="space-y-2 text-sm text-indigo-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Dados atualizados em tempo real</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Filtros afetam gráficos e estatísticas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Acesse "Funcionários" para cadastrar novos registros
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Use "Controle ASO" para visão detalhada por exame
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
